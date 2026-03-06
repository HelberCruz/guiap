// src/main/resources/static/js/roteiro/geminiService.js

class GeminiService {
    constructor() {
        this.apiKey = null;
        this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
        this.isInitialized = false;
        this.isDemoMode = false;
        this.maxRetries = 2;
    }

    async loadRealPlacesFromJSON(location, theme) {
        try {
            const response = await fetch('/data/lugares-reais.json');
            const data = await response.json();

            const city = location.toLowerCase();
            if (data[city] && data[city][theme]) {
                return data[city][theme];
            }

            // Fallback: buscar cidade parecida
            for (const key in data) {
                if (city.includes(key) || key.includes(city)) {
                    if (data[key][theme]) {
                        return data[key][theme];
                    }
                }
            }

            return null;
        } catch (error) {
            console.warn('⚠️ Não foi possível carregar lugares do JSON:', error);
            return null;
        }
    }

    async generateItinerary(location, theme, days = 1) {
        console.log(`🎯 Gerando roteiro REAL para: ${location}, ${theme}`);

        // 1. PRIMEIRO tentar lugares do JSON (100% real)
        const realPlaces = await this.loadRealPlacesFromJSON(location, theme);

        if (realPlaces && realPlaces.length > 0) {
            console.log(`✅ Usando ${realPlaces.length} lugares REAIS do banco`);
            return this.createItineraryFromRealPlaces(realPlaces, location, theme, days);
        }

        // 2. SEGUNDO usar Gemini com prompt melhorado
        console.log('⚠️ Nenhum lugar real no banco, usando Gemini');
        return await this.generateRealItinerary(location, theme, days);
    }

    createItineraryFromRealPlaces(places, location, theme, days) {
        return {
            theme: theme,
            userLocation: location,
            summary: `Roteiro ${theme} em ${location} com lugares reais e históricos`,
            totalDistance: `${places.length * 3} km`,
            totalTime: `${places.length * 2} horas`,
            locations: places.map(place => ({
                name: place.nome,
                description: place.descricao,
                type: place.tipo,
                address: place.endereco,
                suggestedTime: "1-2 horas",
                cost: "médio",
                tips: "Verifique horários de funcionamento antes de visitar",
                keywords: [place.tipo, theme],
                coordinates: place.latitude && place.longitude ? {
                    lat: place.latitude,
                    lng: place.longitude
                } : null
            })),
            recommendations: [
                "Use calçados confortáveis para caminhar",
                "Leve uma garrafa de água",
                "Tire fotos para registrar o passeio"
            ],
            generatedAt: new Date().toISOString(),
            days: days,
            isDemo: false,
            hasRealPlaces: true
        };
    }

    async initialize() {
        try {
            console.log('🤖 Inicializando Gemini Service...');

            // Método 1: Usar endpoint específico
            const response = await fetch('/api/gemini-key', {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                this.apiKey = data.apiKey;
                this.isDemoMode = this.apiKey === 'demo-mode';

                if (this.isDemoMode) {
                    console.log('⚠️ Gemini em modo demo - usando dados simulados');
                } else {
                    console.log('✅ Gemini inicializado com chave real');
                    // Verificar modelos apenas se não for demo
                    const modelsChecked = await this.checkAvailableModels();
                    if (!modelsChecked) {
                        console.warn('⚠️ Não conseguiu verificar modelos, usando flash como padrão');
                        this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
                    }
                }

                this.isInitialized = true;
                return true;
            }

            // Método 2: Fallback para endpoint geral
            console.log('Tentando endpoint geral...');
            const configResponse = await fetch('/api/config', {
                credentials: 'include'
            });

            if (configResponse.ok) {
                const config = await configResponse.json();
                this.apiKey = config.geminiKey || config.openaiKey;
                this.isDemoMode = this.apiKey === 'demo-mode';

                if (this.isDemoMode) {
                    console.log('⚠️ Gemini em modo demo via config');
                } else {
                    console.log('✅ Gemini inicializado via config geral');
                    const modelsChecked = await this.checkAvailableModels();
                    if (!modelsChecked) {
                        console.warn('⚠️ Não conseguiu verificar modelos, usando flash como padrão');
                        this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
                    }
                }

                this.isInitialized = true;
                return true;
            }

            console.error('❌ Falha ao obter chave Gemini');
            this.isDemoMode = true;
            this.isInitialized = true;
            return true;

        } catch (error) {
            console.error('❌ Erro ao inicializar Gemini:', error);
            this.isDemoMode = true;
            this.isInitialized = true;
            console.log('🔧 Usando modo fallback com dados simulados');
            return true;
        }
    }

    async generateRealItinerary(location, theme, days) {
        console.log('🚀 Chamando Gemini API...');

        // Tentar com retry
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                console.log(`📡 Tentativa ${attempt} de ${this.maxRetries}`);
                
                const response = await fetch(`${this.baseURL}?key=${this.apiKey}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: this.createOptimizedPrompt(location, theme, days)
                            }]
                        }],
                        generationConfig: {
                            temperature: 0.7,
                            topK: 40,
                            topP: 0.95,
                            maxOutputTokens: 2000,  // Balanceado para evitar MAX_TOKENS
                            stopSequences: ["}", "}]"]
                        }
                    })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`❌ Gemini API error (tentativa ${attempt}):`, {
                        status: response.status,
                        error: errorText.substring(0, 200)
                    });

                    if (attempt < this.maxRetries) {
                        await this.delay(1000 * attempt); // Backoff exponencial
                        continue;
                    }
                    
                    return await this.tryAlternativeModel(location, theme, days);
                }

                const data = await response.json();

                if (!data || !data.candidates || data.candidates.length === 0) {
                    console.error('❌ Resposta da API sem candidatos:', data);
                    continue;
                }

                const firstCandidate = data.candidates[0];

                // Verificar se a resposta foi truncada
                if (firstCandidate.finishReason === 'MAX_TOKENS') {
                    console.warn('⚠️ Resposta truncada (MAX_TOKENS)');
                    // Continuar processando o que temos
                }

                if (!firstCandidate.content || !firstCandidate.content.parts || firstCandidate.content.parts.length === 0) {
                    console.error('❌ Estrutura de resposta inválida');
                    continue;
                }

                const itineraryText = firstCandidate.content.parts[0].text;
                console.log('📝 Resposta do Gemini recebida');

                return this.parseItineraryResponse(itineraryText, location, theme, days);

            } catch (error) {
                console.error(`❌ Erro na tentativa ${attempt}:`, error);
                
                if (attempt < this.maxRetries) {
                    await this.delay(1000 * attempt);
                } else {
                    return await this.tryAlternativeModel(location, theme, days);
                }
            }
        }
        
        // Se todas as tentativas falharem
        return this.generateDemoItinerary(location, theme, days);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async tryAlternativeModel(location, theme, days) {
        console.log('🔄 Tentando modelo alternativo...');
        
        try {
            // Usar Gemini Flash como alternativa (mais rápido, menor custo)
            const flashURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
            
            const response = await fetch(`${flashURL}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: this.createSimplifiedPrompt(location, theme, days)
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1500,
                        stopSequences: ["}", "}]"]
                    }
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.candidates && data.candidates.length > 0) {
                    const itineraryText = data.candidates[0].content.parts[0].text;
                    console.log('✅ Modelo alternativo funcionou');
                    return this.parseItineraryResponse(itineraryText, location, theme, days);
                }
            }
        } catch (error) {
            console.warn('⚠️ Modelo alternativo também falhou:', error.message);
        }

        // Último recurso: dados demo
        console.log('🔧 Usando dados demo como fallback final');
        return this.generateDemoItinerary(location, theme, days);
    }

    createOptimizedPrompt(location, theme, days) {
        return `Crie um roteiro turístico simples de ${days} dia(s) na mesma cidade de ${location} com tema ${theme}.

Forneça APENAS JSON no formato:

{
  "summary": "Descrição breve",
  "locations": [
    {
      "name": "Nome real específico",
      "description": "Descrição muito curta",
      "type": "tipo",
      "address": "Endereço real curto",
      "suggestedTime": "X horas",
      "cost": "gratuito/barato/médio/caro"
    }
  ]
}

Use MÁXIMO 3 locais reais de ${location}.`;
    }

    // No método parseItineraryResponse, substitua esta parte:
parseItineraryResponse(responseText, location, theme, days) {
    try {
        console.log('🔍 Processando resposta do Gemini...');
        console.log('📄 Resposta (primeiros 500 chars):', responseText.substring(0, 500));
        
        // Tentar várias estratégias para extrair JSON
        let jsonStr = this.extractJSONFromResponse(responseText);
        
        if (!jsonStr) {
            console.warn('⚠️ Não conseguiu extrair JSON da resposta');
            return this.extractPartialItinerary(responseText, location, theme, days);
        }
        
        console.log('📦 JSON extraído:', jsonStr.substring(0, 300) + '...');
        
        const parsed = JSON.parse(jsonStr);
        
        // Validar estrutura básica
        if (!parsed.locations || !Array.isArray(parsed.locations)) {
            console.warn('⚠️ JSON não tem array de locations');
            return this.extractPartialItinerary(responseText, location, theme, days);
        }
        
        console.log('✅ JSON parseado com sucesso:', {
            locations: parsed.locations.length,
            hasSummary: !!parsed.summary
        });
        
        // Garantir que todos os locais tenham os campos mínimos
        const validatedLocations = parsed.locations.map((loc, index) => ({
            name: loc.name || `Local ${index + 1} em ${location}`,
            description: loc.description || `Ponto ${theme} em ${location}`,
            type: loc.type || theme,
            address: loc.address || location,
            suggestedTime: loc.suggestedTime || "1-2 horas",
            cost: loc.cost || "médio",
            tips: loc.tips || "Visite durante horário comercial",
            keywords: loc.keywords || [theme]
        })).filter(loc => loc.name && loc.address); // Remover locais inválidos
        
        if (validatedLocations.length === 0) {
            console.warn('⚠️ Nenhum local válido após validação');
            return this.extractPartialItinerary(responseText, location, theme, days);
        }
        
        return {
            theme: theme,
            userLocation: location,
            summary: parsed.summary || `Roteiro ${theme} em ${location}`,
            totalDistance: parsed.totalDistance || `${validatedLocations.length * 2} km`,
            totalTime: parsed.totalTime || `${validatedLocations.length * 1.5} horas`,
            locations: validatedLocations,
            recommendations: parsed.recommendations || [
                "Use calçados confortáveis",
                "Verifique horários de funcionamento"
            ],
            generatedAt: new Date().toISOString(),
            days: days || 1,
            isDemo: false,
            fromGemini: true
        };
        
    } catch (error) {
        console.warn('⚠️ Erro ao parsear resposta do Gemini:', error.message);
        return this.extractPartialItinerary(responseText, location, theme, days);
    }
}

// Adicione este novo método para extrair JSON:
extractJSONFromResponse(text) {
    // Estratégia 1: Procurar por JSON completo com markdown
    const jsonWithMarkdown = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonWithMarkdown && jsonWithMarkdown[1]) {
        return jsonWithMarkdown[1];
    }
    
    // Estratégia 2: Procurar por JSON sem markdown
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        const potentialJson = text.substring(jsonStart, jsonEnd + 1);
        
        // Verificar se parece JSON válido
        if (potentialJson.includes('"locations"') && potentialJson.includes('[')) {
            try {
                // Testar se é JSON válido
                JSON.parse(potentialJson);
                return potentialJson;
            } catch (e) {
                // Não é JSON válido, continuar
            }
        }
    }
    
    // Estratégia 3: Tentar encontrar array de locations
    const locationsMatch = text.match(/"locations"\s*:\s*\[([\s\S]*?)\]/);
    if (locationsMatch) {
        // Construir um JSON mínimo
        return `{
            "summary": "Roteiro gerado",
            "locations": [${locationsMatch[1]}]
        }`;
    }
    
    return null;
}

    extractPartialItinerary(text, location, theme, days) {
        try {
            console.log('🔍 Tentando extrair dados parciais do texto...');
            
            const lines = text.split('\n').filter(line => line.trim());
            const locations = [];
            let currentLocation = null;
            
            for (const line of lines) {
                // Tentar identificar nomes de locais
                if (line.includes('"name"') || line.includes('name:')) {
                    const nameMatch = line.match(/"name":\s*"([^"]+)"/) || 
                                     line.match(/name:\s*"([^"]+)"/) ||
                                     line.match(/"name":\s*'([^']+)'/);
                    if (nameMatch) {
                        currentLocation = { name: nameMatch[1] };
                    }
                }
                // Tentar identificar endereços
                else if (line.includes('"address"') || line.includes('address:')) {
                    const addrMatch = line.match(/"address":\s*"([^"]+)"/) || 
                                     line.match(/address:\s*"([^"]+)"/);
                    if (addrMatch && currentLocation) {
                        currentLocation.address = addrMatch[1];
                        locations.push({
                            ...currentLocation,
                            description: `Local ${theme} em ${location}`,
                            type: theme,
                            suggestedTime: "1-2 horas",
                            cost: "médio"
                        });
                        currentLocation = null;
                    }
                }
                // Tentar identificar por padrões de endereço
                else if ((line.includes('R.') || line.includes('Av.') || line.includes('Avenida')) && 
                         line.includes('-')) {
                    const parts = line.split('-');
                    if (parts.length >= 2) {
                        const name = parts[0].trim().replace(/[":]/g, '');
                        const address = line.trim();
                        locations.push({
                            name: name || `Local ${locations.length + 1}`,
                            description: `Ponto ${theme} em ${location}`,
                            type: theme,
                            address: address,
                            suggestedTime: "1-2 horas",
                            cost: "médio"
                        });
                    }
                }
            }
            
            if (locations.length > 0) {
                console.log(`✅ Extraídos ${locations.length} locais do texto`);
                return {
                    theme: theme,
                    userLocation: location,
                    summary: `Roteiro ${theme} em ${location}`,
                    totalDistance: `${locations.length * 2} km`,
                    totalTime: `${locations.length * 1.5} horas`,
                    locations: locations.slice(0, 3),
                    recommendations: ["Extraído de resposta do Gemini"],
                    generatedAt: new Date().toISOString(),
                    days: days || 1,
                    isDemo: false,
                    extracted: true
                };
            }
            
        } catch (error) {
            console.warn('Não conseguiu extrair dados do texto:', error);
        }
        
        // Fallback para dados demo
        return this.generateDemoItinerary(location, theme, days);
    }

    async checkAvailableModels() {
        try {
            console.log('🔍 Verificando modelos disponíveis...');
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models?key=${this.apiKey}`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                
                if (data.models && Array.isArray(data.models)) {
                    // Priorizar modelos flash (mais rápidos e baratos)
                    const flashModels = data.models.filter(m => 
                        m.name.includes('flash') && 
                        m.supportedGenerationMethods?.includes('generateContent')
                    );
                    
                    if (flashModels.length > 0) {
                        const modelName = flashModels[0].name.split('/').pop();
                        this.baseURL = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;
                        console.log(`✅ Usando modelo: ${modelName} (flash)`);
                        return true;
                    }
                    
                    // Fallback para qualquer modelo que suporte generateContent
                    const generateContentModels = data.models.filter(m =>
                        m.supportedGenerationMethods?.includes('generateContent')
                    );
                    
                    if (generateContentModels.length > 0) {
                        const modelName = generateContentModels[0].name.split('/').pop();
                        this.baseURL = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;
                        console.log(`✅ Usando modelo: ${modelName}`);
                        return true;
                    }
                }
            }
            
            console.warn('⚠️ Não encontrou modelos disponíveis, usando flash como padrão');
            this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
            return true;
            
        } catch (error) {
            console.warn('⚠️ Não foi possível verificar modelos:', error.message);
            // Usar flash como padrão seguro
            this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
            return true;
        }
    }

    generateDemoItinerary(location, theme, days) {
        console.log('🎭 Gerando roteiro demo...');

        const demoData = {
            'gastronomia': {
                summary: `Roteiro gastronômico de ${days} dia${days > 1 ? 's' : ''} em ${location}`,
                locations: [
                    {
                        name: "Restaurante Tradicional",
                        description: "Experimente os sabores autênticos da região.",
                        type: "restaurante",
                        address: `Centro, ${location}`,
                        suggestedTime: "1-2 horas",
                        cost: "médio",
                        tips: "Recomendamos reservar",
                        keywords: ["restaurante", "comida local"]
                    },
                    {
                        name: "Cafeteria Local",
                        description: "Café especial e doces caseiros.",
                        type: "cafeteria",
                        address: `Rua Principal, ${location}`,
                        suggestedTime: "30-45 minutos",
                        cost: "barato",
                        tips: "Experimente o café local",
                        keywords: ["café", "cafeteria"]
                    }
                ]
            },
            'historia': {
                summary: `Roteiro histórico em ${location}`,
                locations: [
                    {
                        name: "Museu Histórico",
                        description: "Conheça a história da região.",
                        type: "museu",
                        address: `Praça Central, ${location}`,
                        suggestedTime: "1-2 horas",
                        cost: "gratuito a barato",
                        tips: "Visitas guiadas disponíveis",
                        keywords: ["museu", "história"]
                    }
                ]
            },
            'paisagens': {
                summary: `Roteiro de paisagens em ${location}`,
                locations: [
                    {
                        name: "Parque Natural",
                        description: "Área verde com trilhas e mirantes.",
                        type: "parque",
                        address: `Avenida das Flores, ${location}`,
                        suggestedTime: "2-3 horas",
                        cost: "gratuito",
                        tips: "Leve água e protetor solar",
                        keywords: ["parque", "natureza"]
                    }
                ]
            },
            'cultura': {
                summary: `Roteiro cultural em ${location}`,
                locations: [
                    {
                        name: "Centro Cultural",
                        description: "Programação cultural diversificada.",
                        type: "centro_cultural",
                        address: `Praça da Cultura, ${location}`,
                        suggestedTime: "2-3 horas",
                        cost: "médio",
                        tips: "Confira a programação",
                        keywords: ["cultura", "arte"]
                    }
                ]
            },
            'festas': {
                summary: `Roteiro de vida noturna em ${location}`,
                locations: [
                    {
                        name: "Bar Local",
                        description: "Ambiente animado com música.",
                        type: "bar",
                        address: `Rua da Noite, ${location}`,
                        suggestedTime: "2-3 horas",
                        cost: "médio",
                        tips: "Happy hour disponível",
                        keywords: ["bar", "noite"]
                    }
                ]
            }
        };

        const data = demoData[theme] || demoData['gastronomia'];

        return {
            theme: theme,
            userLocation: location,
            summary: data.summary,
            totalDistance: `${days * 10} km`,
            totalTime: `${days} dia${days > 1 ? 's' : ''}`,
            locations: data.locations,
            recommendations: [
                "Use calçados confortáveis",
                "Leve água e protetor solar",
                "Verifique horários de funcionamento"
            ],
            generatedAt: new Date().toISOString(),
            days: days,
            isDemo: true,
            isFallback: true
        };
    }
}

// Exportar instância única
const geminiService = new GeminiService();