// src/main/resources/static/js/roteiro/itineraryService.js

class ItineraryService {
    constructor() {
        this.currentItinerary = null;
        this.enrichedLocations = [];
    }

    // Buscar dados da URL ou localStorage
    async loadItineraryData() {
        console.log('📋 Carregando dados do roteiro...');

        // 1. Tentar obter da URL
        const urlParams = new URLSearchParams(window.location.search);
        const location = urlParams.get('localizacao');
        const theme = urlParams.get('tema');

        if (location && theme) {
            console.log(`📍 Dados da URL: ${location}, ${theme}`);
            return await this.generateNewItinerary(location, theme);
        }

        // 2. Tentar localStorage
        const savedData = localStorage.getItem('currentItinerary');
        if (savedData) {
            try {
                this.currentItinerary = JSON.parse(savedData);
                console.log('✅ Dados carregados do localStorage');
                return this.currentItinerary;
            } catch (error) {
                console.error('❌ Erro ao parsear localStorage:', error);
            }
        }

        // 3. Nenhum dado encontrado
        throw new Error('Nenhum roteiro encontrado. Gere um novo na página inicial.');
    }

    // itineraryService.js - método generateNewItinerary corrigido
    async generateNewItinerary(location, theme) {
        console.log(`🎯 Gerando novo roteiro: ${location}, ${theme}`);

        try {
            // 1. Gerar roteiro com Gemini
            const geminiResponse = await geminiService.generateItinerary(location, theme);

            console.log('📋 Resposta do Gemini:', {
                hasLocations: !!geminiResponse.locations,
                locationsCount: geminiResponse.locations?.length || 0
            });

            // 2. Enriquecer locais com Maps (se houver locais)
            let enrichedLocations = [];
            if (geminiResponse.locations && geminiResponse.locations.length > 0) {
                enrichedLocations = await this.enrichLocationsWithMaps(geminiResponse.locations, location);
            } else {
                console.warn('⚠️ Gemini não retornou locais, usando fallback');
                // Criar alguns locais básicos como fallback
                enrichedLocations = this.createFallbackLocations(location, theme);
            }

            // 3. Calcular rota (agora seguro mesmo se locations for undefined)
            const routeInfo = await mapsService.calculateRoute(enrichedLocations);

            // 4. Criar objeto final
            this.currentItinerary = {
                ...geminiResponse,
                locations: enrichedLocations,
                totalDistance: routeInfo.totalDistance,
                totalTime: routeInfo.totalTime,
                enriched: true,
                generatedAt: new Date().toISOString()
            };

            // 5. Salvar no localStorage
            localStorage.setItem('currentItinerary', JSON.stringify(this.currentItinerary));
            localStorage.setItem('itineraryData', JSON.stringify(this.currentItinerary));

            console.log('✅ Roteiro gerado com sucesso:', {
                theme: this.currentItinerary.theme,
                location: this.currentItinerary.userLocation,
                locationsCount: this.currentItinerary.locations?.length || 0
            });

            return this.currentItinerary;

        } catch (error) {
            console.error('❌ Erro ao gerar roteiro:', error);
            // Fallback: criar roteiro básico
            return this.createFallbackItinerary(location, theme);
        }
    }

    // Adicione estes métodos no itineraryService.js:
    createFallbackLocations(location, theme) {
        console.log(`🔄 Criando locais fallback para ${location}, ${theme}`);

        const fallbackData = {
            'gastronomia': [
                {
                    nome: `Restaurante Local em ${location}`,
                    descricao: `Experimente a culinária típica de ${location}`,
                    tipo: "restaurante",
                    endereco: `Centro, ${location}`,
                    tempoSugerido: "1-2 horas",
                    custo: "médio",
                    dica: "Experimente o prato da casa"
                }
            ],
            'historia': [
                {
                    nome: `Museu Histórico de ${location}`,
                    descricao: `Conheça a história e cultura de ${location}`,
                    tipo: "museu",
                    endereco: `Praça Central, ${location}`,
                    tempoSugerido: "1-2 horas",
                    custo: "gratuito a barato",
                    dica: "Visite durante a semana para evitar filas"
                }
            ],
            'paisagens': [
                {
                    nome: `Parque de ${location}`,
                    descricao: `Área verde para relaxar e contemplar a natureza`,
                    tipo: "parque",
                    endereco: `Zona Sul, ${location}`,
                    tempoSugerido: "2-3 horas",
                    custo: "gratuito",
                    dica: "Leve água e protetor solar"
                }
            ]
        };

        return fallbackData[theme] || fallbackData['gastronomia'];
    }

    createFallbackItinerary(location, theme) {
        console.log(`🔄 Criando roteiro fallback para ${location}, ${theme}`);

        const locations = this.createFallbackLocations(location, theme);

        this.currentItinerary = {
            theme: theme,
            userLocation: location,
            summary: `Roteiro ${theme} em ${location}`,
            totalDistance: `${locations.length * 3} km`,
            totalTime: `${locations.length * 2} horas`,
            locations: locations,
            recommendations: [
                "Use calçados confortáveis",
                "Leve uma garrafa de água",
                "Verifique horários de funcionamento"
            ],
            generatedAt: new Date().toISOString(),
            days: 1,
            isDemo: true,
            isFallback: true
        };

        localStorage.setItem('currentItinerary', JSON.stringify(this.currentItinerary));
        return this.currentItinerary;
    }

    async enrichLocationsWithMaps(locations, baseLocation) {
        console.log(`🗺️ Enriquecendo ${locations.length} locais...`);

        // Se já tem dados reais, não precisa enriquecer muito
        if (locations.some(loc => loc.address && loc.address.includes('R.') || loc.address.includes('Av.'))) {
            console.log('✅ Locais já têm endereços reais, enriquecimento mínimo');
            return locations.map(loc => ({
                nome: loc.name || loc.nome,
                descricao: loc.description || loc.descricao,
                tipo: loc.type || loc.tipo,
                endereco: loc.address || loc.endereco || `Local em ${baseLocation}`,
                tempoSugerido: loc.suggestedTime || loc.tempoSugerido || "1-2 horas",
                custo: loc.cost || loc.custo || "médio",
                dica: loc.tips || loc.dica || "Visite durante a semana",
                fotoUrl: `https://source.unsplash.com/random/600x400/?${encodeURIComponent(loc.name || loc.tipo)}`
            }));
        }
    }

    // ====================
    // MÉTODO NOVO: Salvar roteiro no banco
    // ====================
    async salvarRoteiroNoBanco() {
        console.log('🔍 salvarRoteiroNoBanco() chamado');

        if (!this.currentItinerary) {
            console.error('❌ Nenhum currentItinerary disponível');
            throw new Error('Nenhum roteiro para salvar');
        }

        console.log('📤 Preparando dados para envio:', {
            titulo: this.currentItinerary.theme,
            localizacao: this.currentItinerary.userLocation,
            numLocais: this.currentItinerary.locations?.length
        });

        try {
            // NOVO: Sanitizar os dados antes de enviar
            const dadosParaSalvar = this.sanitizarDadosParaSalvar();

            console.log('📝 Dados sanitizados:', dadosParaSalvar);

            console.log('📨 Enviando para /api/salvar-roteiro...');

            const response = await fetch('/api/salvar-roteiro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosParaSalvar),
                credentials: 'include'
            });

            console.log('📊 Resposta recebida:', {
                status: response.status,
                statusText: response.statusText
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Resposta não OK:', errorText);
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('📝 Resultado JSON:', result);

            if (result.success) {
                console.log('✅ Roteiro salvo com ID:', result.roteiroId);

                // Atualizar o itinerário atual com o ID
                this.currentItinerary.id = result.roteiroId;
                localStorage.setItem('currentItinerary', JSON.stringify(this.currentItinerary));

                return result;
            } else {
                console.error('❌ API retornou success=false:', result.message);
                throw new Error(result.message || 'Erro ao salvar roteiro');
            }

        } catch (error) {
            console.error('💥 Erro completo:', error);
            throw error;
        }
    }

    // NOVO MÉTODO: Sanitizar dados
    sanitizarDadosParaSalvar() {
        const dados = { ...this.currentItinerary };

        // 1. Criar um objeto limpo apenas com os campos necessários
        const dadosLimpos = {
            theme: dados.theme,
            userLocation: dados.userLocation,
            summary: dados.summary,
            totalDistance: dados.totalDistance,
            totalTime: dados.totalTime,
            days: dados.days || 1,
            isDemo: dados.isDemo || false,

            // IMPORTANTE: Simplificar os locais
            locations: this.sanitizarLocais(dados.locations || []),

            // Remover campos que podem causar problemas
            // rota: undefined, // Remover se existir
            // enriched: undefined,
            // generatedAt: new Date().toISOString() // Manter apenas se necessário
        };

        // 2. Remover campos undefined
        Object.keys(dadosLimpos).forEach(key => {
            if (dadosLimpos[key] === undefined) {
                delete dadosLimpos[key];
            }
        });

        // 3. Verificar se o JSON é válido
        try {
            JSON.stringify(dadosLimpos);
            return dadosLimpos;
        } catch (error) {
            console.error('❌ Dados não serializáveis:', error);

            // Fallback: dados mínimos
            return {
                theme: dados.theme,
                userLocation: dados.userLocation,
                summary: dados.summary,
                totalDistance: dados.totalDistance,
                totalTime: dados.totalTime,
                locations: []
            };
        }
    }

    // NOVO MÉTODO: Sanitizar locais
    sanitizarLocais(locations) {
        if (!locations || !Array.isArray(locations)) {
            return [];
        }

        return locations.map(local => {
            const localLimpo = {
                nome: this.escapeString(local.nome || local.name || ''),
                descricao: this.escapeString(local.descricao || local.description || ''),
                tipo: local.tipo || local.type || '',
                endereco: this.escapeString(local.endereco || local.address || ''),
                tempoSugerido: local.tempoSugerido || local.suggestedTime || '',
                custo: local.custo || local.cost || '',
                dica: this.escapeString(local.dica || local.tips || ''),
                palavrasChave: Array.isArray(local.palavrasChave || local.keywords)
                    ? local.palavrasChave || local.keywords
                    : []
            };

            // Coordenadas (se existirem)
            if (local.coordenadas) {
                localLimpo.coordenadas = {
                    lat: parseFloat(local.coordenadas.lat) || 0,
                    lng: parseFloat(local.coordenadas.lng) || 0
                };
            } else if (local.latitude && local.longitude) {
                localLimpo.coordenadas = {
                    lat: parseFloat(local.latitude),
                    lng: parseFloat(local.longitude)
                };
            }

            // Rating (se existir)
            if (local.rating !== undefined) {
                localLimpo.rating = parseFloat(local.rating);
            }

            // Total avaliações
            if (local.totalAvaliacoes !== undefined) {
                localLimpo.totalAvaliacoes = parseInt(local.totalAvaliacoes);
            }

            // Remover campos undefined
            Object.keys(localLimpo).forEach(key => {
                if (localLimpo[key] === undefined) {
                    delete localLimpo[key];
                }
            });

            return localLimpo;
        });
    }

    // NOVO MÉTODO: Escapar strings
    escapeString(str) {
        if (typeof str !== 'string') {
            return String(str || '');
        }

        // Remover aspas problemáticas e caracteres especiais
        return str
            .replace(/"/g, "'") // Substituir aspas duplas por simples
            .replace(/\\/g, '') // Remover barras invertidas
            .replace(/\n/g, ' ') // Substituir quebras de linha por espaço
            .replace(/\r/g, ' ') // Substituir carriage return por espaço
            .substring(0, 500); // Limitar tamanho
    }

    // ====================
    // MÉTODO NOVO: Carregar roteiro do banco
    // ====================
    async carregarRoteiroDoBanco(roteiroId) {
        console.log(`📋 Carregando roteiro do banco: ${roteiroId}`);

        try {
            const response = await fetch(`/api/carregar-roteiro/${roteiroId}`, {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                console.log('✅ Roteiro carregado do banco:', result.roteiro);
                this.currentItinerary = this.formatarRoteiroDoBanco(result);
                return this.currentItinerary;
            } else {
                throw new Error(result.message || 'Erro ao carregar roteiro');
            }

        } catch (error) {
            console.error('❌ Erro ao carregar roteiro:', error);
            throw error;
        }
    }

    formatarRoteiroDoBanco(resultadoApi) {
        const roteiro = resultadoApi.roteiro;
        const locais = resultadoApi.locais || [];

        return {
            id: roteiro.id,
            theme: roteiro.tema,
            userLocation: roteiro.localizacao,
            summary: roteiro.descricao,
            totalDistance: resultadoApi.rota?.distancia || roteiro.distanciaTotal + ' km',
            totalTime: resultadoApi.rota?.tempo || roteiro.tempoEstimado,
            locations: locais.map(local => ({
                nome: local.nome,
                descricao: local.descricao,
                tipo: local.tipo,
                endereco: local.endereco,
                coordenadas: local.latitude && local.longitude ? {
                    lat: local.latitude,
                    lng: local.longitude
                } : null,
                tempoSugerido: local.tempoSugerido,
                custo: local.faixaPreco,
                rating: local.rating,
                totalAvaliacoes: local.totalAvaliacoes,
                dica: local.dicas,
                ordemVisita: local.ordemVisita
            })),
            rota: resultadoApi.rota,
            generatedAt: roteiro.criadoEm || new Date().toISOString(),
            fromDatabase: true
        };
    }

    // ====================
    // MÉTODO NOVO: Listar roteiros do usuário
    // ====================
    async listarMeusRoteiros() {
        console.log('📋 Listando roteiros do usuário...');

        try {
            const response = await fetch('/api/meus-roteiros', {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                console.log(`✅ ${result.total} roteiros encontrados`);
                return result.roteiros;
            } else {
                throw new Error(result.message || 'Erro ao listar roteiros');
            }

        } catch (error) {
            console.error('❌ Erro ao listar roteiros:', error);
            return [];
        }
    }

    // ====================
    // MÉTODOS EXISTENTES
    // ====================
    getItinerary() {
        return this.currentItinerary;
    }

    getLocation(index) {
        if (!this.currentItinerary || !this.currentItinerary.locations) {
            return null;
        }
        return this.currentItinerary.locations[index];
    }

    updateLocation(index, updatedData) {
        if (!this.currentItinerary || !this.currentItinerary.locations) {
            return false;
        }

        this.currentItinerary.locations[index] = {
            ...this.currentItinerary.locations[index],
            ...updatedData
        };

        // Atualizar localStorage
        localStorage.setItem('currentItinerary', JSON.stringify(this.currentItinerary));
        localStorage.setItem('itineraryData', JSON.stringify(this.currentItinerary));

        return true;
    }

    saveToFavorites() {
        if (!this.currentItinerary) return false;

        const favorites = JSON.parse(localStorage.getItem('favoriteItineraries') || '[]');

        // Verificar se já está favoritado
        const exists = favorites.some(fav =>
            fav.userLocation === this.currentItinerary.userLocation &&
            fav.theme === this.currentItinerary.theme
        );

        if (!exists) {
            favorites.push({
                ...this.currentItinerary,
                favoritedAt: new Date().toISOString()
            });

            localStorage.setItem('favoriteItineraries', JSON.stringify(favorites));
            return true;
        }

        return false;
    }

    getShareableLink() {
        if (!this.currentItinerary) return '';

        const baseUrl = window.location.origin;
        return `${baseUrl}/roteiro?tema=${encodeURIComponent(this.currentItinerary.theme)}&localizacao=${encodeURIComponent(this.currentItinerary.userLocation)}`;
    }
}

// Exportar instância única
const itineraryService = new ItineraryService();