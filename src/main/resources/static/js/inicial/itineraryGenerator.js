// js/inicial/itineraryGenerator.js - VERSÃO GEMINI COMPLETA
class ItineraryGenerator {
    constructor() {
        console.log('🔧 Inicializando ItineraryGenerator com Gemini');
        this.GEMINI_API_KEY = '';
        // Linha 2:
        this.GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
        this.loadApiKey();
        this.cache = new Map(); // Cache simples
    }
    async testConnection() {
        console.log('🔌 Testando conexão com Gemini...');
        try {
            const testPrompt = "Responda apenas com 'OK' se estiver funcionando";
            const response = await fetch(`${this.GEMINI_URL}?key=${this.GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: testPrompt }]
                    }]
                })
            });

            if (response.ok) {
                console.log('✅ Gemini API conectada com sucesso!');
                return true;
            } else {
                const error = await response.text();
                console.error('❌ Gemini API error:', error);
                return false;
            }
        } catch (error) {
            console.error('❌ Erro de conexão:', error);
            return false;
        }
    }
    async loadApiKey() {
        console.log('🔑 Carregando chaves de API...');
        try {
            const response = await fetch('/api/config/keys'); if (response.ok) {
                const config = await response.json();
                this.GEMINI_API_KEY = config.geminiKey;
                console.log('✅ Chave Gemini carregada do backend');

                // Testar conexão
                if (this.GEMINI_API_KEY) {
                    console.log('🔗 Chave disponível, pronta para uso');
                }
            } else {
                console.warn('⚠️ Não foi possível obter config do backend');
            }
        } catch (error) {
            console.error('❌ Erro ao carregar API key:', error);

            // Para desenvolvimento local, você pode definir manualmente
            // this.GEMINI_API_KEY = 'SUA_CHAVE_GEMINI_AQUI';
        }
    }

    async generateItinerary(theme, location) {
        console.log(`🎯 Gerando roteiro: ${theme} em ${location}`);
        // Testar conexão primeiro
        const connected = await this.testConnection();
        if (!connected) {
            console.warn('⚠️ Gemini não conectada, usando fallback');
            return this.getFallbackItinerary(theme, location);
        }


        // Verificar cache primeiro
        const cacheKey = `${theme}_${location}`;
        if (this.cache.has(cacheKey)) {
            console.log('📦 Retornando do cache');
            return this.cache.get(cacheKey);
        }

        if (!this.GEMINI_API_KEY) {
            console.error('❌ Chave Gemini não configurada');
            return this.getFallbackItinerary(theme, location);
        }

        try {
            // 1. Gerar texto com Gemini
            console.log('🤖 Chamando Gemini API...');
            const itineraryText = await this.generateWithAI(theme, location);
            console.log('✅ Resposta recebida do Gemini');

            // 2. Extrair locais
            const locations = this.extractLocations(itineraryText, theme);
            console.log(`📍 ${locations.length} locais extraídos`);

            // 3. Formatar resposta
            const itineraryData = this.formatItineraryData(theme, location, locations, itineraryText);

            // 4. Salvar no cache
            this.cache.set(cacheKey, itineraryData);

            return itineraryData;

        } catch (error) {
            console.error('💥 Erro na geração:', error);
            return this.getFallbackItinerary(theme, location);
        }
    }

    async generateWithAI(theme, location) {
        const prompt = this.createPrompt(theme, location);
        console.log('📝 Prompt enviado:', prompt.substring(0, 100) + '...');

        const response = await fetch(`${this.GEMINI_URL}?key=${this.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1500,
                    topP: 0.8,
                    topK: 40
                },
                safetySettings: [
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Gemini: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error('Formato de resposta inesperado do Gemini');
        }
    }

    createPrompt(theme, location) {
        console.log(`🎯 Criando prompt para: ${theme} em ${location}`);

        const themeInstructions = {
            'festas': `Liste 5-6 locais de vida noturna, bares, casas de show ou festivais em ${location}. Inclua horários noturnos e tipos de música.`,
            'gastronomia': `Liste 5-6 restaurantes, mercados ou pontos gastronômicos típicos de ${location}. Inclua especialidades locais e faixa de preço.`,
            'historia': `Liste 5-6 pontos históricos, museus ou monumentos em ${location}. Inclua contexto histórico e horários de visita.`,
            'paisagens': `Liste 5-6 pontos naturais, parques ou mirantes em ${location}. Inclua melhores horários para visita e dicas de acesso.`,
            'cultura': `Liste 5-6 pontos culturais, teatros, centros culturais ou feiras em ${location}. Inclua atividades e horários.`
        };

        const instruction = themeInstructions[theme] || `Liste 5-6 pontos turísticos em ${location}.`;

        return `Você é um guia turístico local especializado em ${location}.

LOCALIZAÇÃO EXATA: ${location}
TEMA: ${theme}

INSTRUÇÕES CRÍTICAS:
1. Todos os lugares devem EXISTIR fisicamente em ${location} ou região próxima
2. Liste lugares REAIS e ACESSÍVEIS
3. Foque em lugares FAMOSOS ou BEM AVALIADOS
4. Se ${location} for pequeno, sugira atrações da região

${instruction}

FORMATO OBRIGATÓRIO (um por linha):
NOME: [Nome real do lugar]
ENDEREÇO: [Endereço aproximado]
DESCRIÇÃO: [O que fazer lá - 1-2 frases]
TEMPO: [Tempo sugerido de visita]
DICA: [Dica prática]

Exemplo:
NOME: Mercado Municipal de São Paulo
ENDEREÇO: R. da Cantareira, 306 - Centro
DESCRIÇÃO: Mercado histórico com barracas de frutas, queijos e o famoso sanduíche de mortadela.
TEMPO: 1-2 horas
DICA: Vá com fome e experimente o sanduíche no Hocca Bar.

Agora, para ${location} com tema ${theme}:`;
    }

    extractLocations(text, theme) {
        console.log('🔍 Extraindo locais do texto Gemini...');
        const locations = [];
        const lines = text.split('\n');

        let currentLocation = null;

        lines.forEach(line => {
            line = line.trim();

            if (line.startsWith('NOME:')) {
                if (currentLocation) locations.push(currentLocation);

                currentLocation = {
                    nome: line.replace('NOME:', '').trim(),
                    descricao: '',
                    endereco: '',
                    tempo: '',
                    dica: '',
                    tipo: theme,
                    coordenadas: null
                };
            }
            else if (currentLocation) {
                if (line.startsWith('DESCRIÇÃO:')) {
                    currentLocation.descricao = line.replace('DESCRIÇÃO:', '').trim();
                }
                else if (line.startsWith('ENDEREÇO:')) {
                    currentLocation.endereco = line.replace('ENDEREÇO:', '').trim();
                }
                else if (line.startsWith('TEMPO:')) {
                    currentLocation.tempo = line.replace('TEMPO:', '').trim();
                }
                else if (line.startsWith('DICA:')) {
                    currentLocation.dica = line.replace('DICA:', '').trim();
                }
            }
        });

        // Adicionar último local
        if (currentLocation) {
            locations.push(currentLocation);
        }

        console.log(`📍 ${locations.length} locais extraídos`);
        return locations.slice(0, 6); // Limitar a 6
    }

    getLocationType(name, theme) {
        const typeMap = {
            'festas': ['bar', 'club', 'pub', 'festa', 'show', 'balada'],
            'gastronomia': ['restaurante', 'café', 'padaria', 'mercado', 'bar', 'doceria'],
            'historia': ['museu', 'igreja', 'praça', 'monumento', 'centro histórico', 'fórum'],
            'paisagens': ['parque', 'mirante', 'cachoeira', 'trilha', 'lago', 'praia'],
            'cultura': ['centro cultural', 'teatro', 'galeria', 'biblioteca', 'feira', 'artesanato']
        };

        const keywords = typeMap[theme] || [];
        const nameLower = name.toLowerCase();

        for (const keyword of keywords) {
            if (nameLower.includes(keyword)) {
                return keyword;
            }
        }

        return theme;
    }

    getDefaultHours(theme) {
        const hours = {
            'festas': '19:00-02:00',
            'gastronomia': '11:00-23:00',
            'historia': '09:00-17:00',
            'paisagens': '08:00-18:00',
            'cultura': '10:00-20:00',
            'manual': '09:00-18:00'
        };
        return hours[theme] || '09:00-18:00';
    }

    getDefaultLocations(theme, location) {
        const defaults = {
            'festas': [
                { id: 1, nome: 'Bar Central', descricao: 'Local tradicional para começar a noite', tipo: 'bar' },
                { id: 2, nome: 'Casa de Show', descricao: 'Música ao vivo e ambiente animado', tipo: 'show' }
            ],
            'gastronomia': [
                { id: 1, nome: 'Restaurante Típico', descricao: 'Pratos tradicionais da região', tipo: 'restaurante' },
                { id: 2, nome: 'Mercado Municipal', descricao: 'Ingredientes frescos e produtos locais', tipo: 'mercado' }
            ],
            // ... outros temas
        };

        return defaults[theme] || [
            { id: 1, nome: 'Ponto Turístico Principal', descricao: 'Atração imperdível da cidade', tipo: 'ponto_turistico' }
        ];
    }

    formatItineraryData(theme, location, locations, itineraryText) {
        return {
            theme: theme,
            userLocation: location,
            generatedAt: new Date().toISOString(),
            locations: locations,
            totalDistance: this.calculateTotalDistance(locations),
            totalTime: this.calculateTotalTime(locations),
            itineraryText: itineraryText,
            summary: this.extractSummary(itineraryText)
        };
    }

    calculateTotalDistance(locations) {
        // Estimativa: ~2km entre cada local
        const distance = locations.length * 2;
        return `${distance} km`;
    }

    calculateTotalTime(locations) {
        // Estimativa: 1-2 horas por local
        const totalHours = locations.length * 1.5;
        const hours = Math.floor(totalHours);
        const minutes = Math.round((totalHours - hours) * 60);

        if (hours === 0) {
            return `${minutes}min`;
        } else if (minutes === 0) {
            return `${hours}h`;
        } else {
            return `${hours}h ${minutes}min`;
        }
    }

    extractSummary(text) {
        const lines = text.split('\n');
        let summary = '';

        for (const line of lines) {
            if (line.includes('RESUMO DO DIA:')) {
                summary = line.replace('RESUMO DO DIA:', '').trim();
                break;
            }
        }

        return summary || 'Um dia cheio de descobertas e experiências únicas!';
    }

    getFallbackItinerary(theme, location) {
        console.log('🔄 Usando itinerário de fallback');

        const fallbackLocations = this.getDefaultLocations(theme, location);

        return {
            theme: theme,
            userLocation: location,
            generatedAt: new Date().toISOString(),
            locations: fallbackLocations,
            totalDistance: '5 km',
            totalTime: '4h 30min',
            itineraryText: `Roteiro ${theme} para ${location}. Dados de exemplo para demonstração.`,
            summary: 'Roteiro gerado com dados locais. Configure a API Gemini para resultados personalizados.'
        };
    }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.ItineraryGenerator = ItineraryGenerator;
}