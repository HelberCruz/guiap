// src/main/resources/static/js/mapa/main.js

class MapApp {
    constructor() {
        this.mapRouter = null;
        this.roteiro = null;
    }

    async init(mapContainerId = 'map') {
        console.log('🗺️ Inicializando MapApp...');

        try {
            // 1. Inicializar MapRouter
            this.mapRouter = new MapRouter();
            await this.mapRouter.init(mapContainerId);

            // 2. Carregar roteiro
            this.roteiro = await this.loadRoteiro();

            if (this.roteiro) {
                // 3. Plotar roteiro no mapa
                await this.mapRouter.plotRoteiro(this.roteiro);

                // 4. Configurar interface
                this.setupUI();
                this.setupRouteControls(); // ADICIONADO: controles de rota
                this.updateUI();

                console.log('✅ MapApp inicializado com sucesso');
            } else {
                this.showError('Nenhum roteiro encontrado. Crie um roteiro primeiro.');
            }

        } catch (error) {
            console.error('❌ Erro ao inicializar MapApp:', error);
            this.showError('Erro ao carregar o mapa: ' + error.message);
        }
    }

    async loadRoteiro() {
        // Tentar obter da URL
        const urlParams = new URLSearchParams(window.location.search);
        const roteiroId = urlParams.get('roteiroId');

        if (roteiroId) {
            console.log(`📋 Carregando roteiro do banco: ${roteiroId}`);
            return await this.loadFromBackend(roteiroId);
        }

        // Tentar obter do localStorage
        const saved = localStorage.getItem('confirmedItinerary') ||
            localStorage.getItem('currentItinerary');

        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.warn('⚠️ Roteiro inválido no localStorage:', e);
            }
        }

        return null;
    }

    async loadFromBackend(roteiroId) {
        try {
            const response = await fetch(`/api/carregar-roteiro/${roteiroId}`, {
                credentials: 'include'
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const responseText = await response.text();
            console.log('📄 Resposta bruta:', responseText.substring(0, 500) + '...');

            try {
                const result = JSON.parse(responseText);
                console.log('🔍 Estrutura da resposta:', result);

                if (result.success) {
                    return this.formatarRoteiroDoBackend(result);
                } else {
                    throw new Error(result.message || 'API retornou success=false');
                }

            } catch (parseError) {
                console.error('❌ Erro ao fazer parse do JSON:', parseError);
                throw new Error('Resposta do servidor não é JSON válido');
            }

        } catch (error) {
            console.error('❌ Erro ao carregar do backend:', error);
            return null;
        }
    }

    // No arquivo main.js, LOCALIZE o método formatarRoteiroDoBackend
    // E SUBSTITUA pelo código abaixo:

    // NO main.js - ATUALIZE o formatarRoteiroDoBackend:

    // main.js - MÉTODO formatarRoteiroDoBackend CORRIGIDO
formatarRoteiroDoBackend(result) {
    console.log('🔍 Formatando roteiro do backend:', result);
    
    const roteiro = result.roteiro || {};
    let locais = [];

    // Encontrar os locais na estrutura
    if (result.locais && Array.isArray(result.locais)) {
        locais = result.locais;
        console.log('📌 Usando result.locais');
    } else if (roteiro.locais && Array.isArray(roteiro.locais)) {
        locais = roteiro.locais;
        console.log('📌 Usando roteiro.locais');
    }

    console.log(`📍 Total de locais: ${locais.length}`);

    // CORREÇÃO: Banco de coordenadas de Sorocaba
    const coordenadasSorocaba = {
        // Gastronomia
        "Restaurante Bella Paulista Sorocaba": { lat: -23.5285, lng: -47.4420 },
        "Churrascaria e Pizzaria Recanto Gaúcho": { lat: -23.5055, lng: -47.4580 },
        "Cafeteria do Parque": { lat: -23.5080, lng: -47.4555 },
        // História
        "Palacete Scarpa": { lat: -23.5075, lng: -47.4560 },
        "Igreja Catedral de Sorocaba": { lat: -23.5025, lng: -47.4590 },
        "Museu Histórico Sorocabano": { lat: -23.5150, lng: -47.4725 },
        // Paisagens
        "Parque Natural Chico Mendes": { lat: -23.5210, lng: -47.4480 },
        "Jardim Botânico Irmãos Villas-Bôas": { lat: -23.5380, lng: -47.4205 },
        "Represa de Itupararanga": { lat: -23.4800, lng: -47.3800 }
    };

    // Mapear locais
    const locationsMapeadas = locais.map((localItem, index) => {
        console.log(`🔍 Processando local ${index}: ${localItem.nome}`);
        
        let coordenadas = null;
        const nomeLocal = localItem.nome || '';
        
        // 1. Verificar se tem coordenadas no objeto
        if (localItem.latitude !== undefined && localItem.longitude !== undefined) {
            console.log(`✅ Coordenadas em localItem.latitude/longitude`);
            coordenadas = {
                lat: parseFloat(localItem.latitude),
                lng: parseFloat(localItem.longitude)
            };
        }
        // 2. Verificar no banco de coordenadas de Sorocaba
        else if (coordenadasSorocaba[nomeLocal]) {
            console.log(`✅ Coordenadas encontradas no banco de Sorocaba`);
            coordenadas = { ...coordenadasSorocaba[nomeLocal] };
        }
        // 3. Buscar por similaridade
        else {
            console.log(`🔎 Procurando coordenadas por similaridade: ${nomeLocal}`);
            const nomeLower = nomeLocal.toLowerCase();
            
            for (const [key, coord] of Object.entries(coordenadasSorocaba)) {
                if (nomeLower.includes(key.toLowerCase().substring(0, 10)) ||
                    key.toLowerCase().includes(nomeLower.substring(0, 10))) {
                    coordenadas = { ...coord };
                    console.log(`✅ Encontrado por similaridade com: ${key}`);
                    break;
                }
            }
            
            // 4. Fallback baseado no índice
            if (!coordenadas) {
                console.warn(`⚠️ Usando fallback para: ${nomeLocal}`);
                const fallbackCoords = Object.values(coordenadasSorocaba);
                const coordIndex = Math.min(index, fallbackCoords.length - 1);
                coordenadas = { 
                    lat: fallbackCoords[coordIndex].lat + (index * 0.0005),
                    lng: fallbackCoords[coordIndex].lng + (index * 0.0005)
                };
            }
        }
        
        console.log(`📍 Coordenadas para ${nomeLocal}:`, coordenadas);
        
        return {
            nome: nomeLocal,
            descricao: localItem.descricao || '',
            tipo: localItem.tipo || '',
            endereco: localItem.endereco || '',
            coordenadas: coordenadas,
            tempoSugerido: localItem.tempoSugerido || '30 min',
            custo: localItem.faixaPreco || '',
            rating: localItem.rating ? parseFloat(localItem.rating) : null,
            totalAvaliacoes: localItem.totalAvaliacoes || null,
            dica: localItem.dicas || '',
            ordemVisita: localItem.ordemVisita || index + 1
        };
    });

    return {
        id: roteiro.id || result.roteiroId || Date.now(),
        theme: roteiro.tema || result.tema || 'Roteiro Personalizado',
        userLocation: roteiro.localizacao || result.localizacao || 'Sorocaba, SP',
        summary: roteiro.descricao || result.descricao || 'Descrição do roteiro',
        totalDistance: result.rota?.distancia || '0 km',
        totalTime: result.rota?.tempo || '0 min',
        locations: locationsMapeadas,
        rota: result.rota,
        generatedAt: roteiro.criadoEm || result.generatedAt || new Date().toISOString()
    };
}

    extrairCoordenadas(local) {
        console.log('🔍 Extraindo coordenadas de:', local.nome);
        console.log('📊 Dados disponíveis:', {
            temLatitude: !!local.latitude,
            temLongitude: !!local.longitude,
            temCoordenadas: !!local.coordenadas,
            latitude: local.latitude,
            longitude: local.longitude,
            coordenadas: local.coordenadas
        });

        // ESTRATÉGIA 1: Verificar se já tem objeto coordenadas
        if (local.coordenadas) {
            if (typeof local.coordenadas === 'object') {
                if (local.coordenadas.lat !== undefined && local.coordenadas.lng !== undefined) {
                    console.log('✅ Coordenadas do objeto coordenadas:', local.coordenadas);
                    return {
                        lat: parseFloat(local.coordenadas.lat),
                        lng: parseFloat(local.coordenadas.lng)
                    };
                }
            }
        }

        // ESTRATÉGIA 2: Verificar latitude e longitude separados (formato do seu JSON)
        if (local.latitude !== undefined && local.longitude !== undefined) {
            console.log('✅ Coordenadas de latitude/longitude:', local.latitude, local.longitude);
            return {
                lat: parseFloat(local.latitude),
                lng: parseFloat(local.longitude)
            };
        }

        // ESTRATÉGIA 3: Verificar location
        if (local.location) {
            if (local.location.lat !== undefined && local.location.lng !== undefined) {
                console.log('✅ Coordenadas do location:', local.location);
                return {
                    lat: parseFloat(local.location.lat),
                    lng: parseFloat(local.location.lng)
                };
            }
        }

        // ESTRATÉGIA 4: Tentar extrair de qualquer campo que possa ter
        for (const key in local) {
            if (key.toLowerCase().includes('lat') && local[key] !== undefined) {
                const lat = parseFloat(local[key]);
                // Procurar longitude correspondente
                for (const key2 in local) {
                    if (key2.toLowerCase().includes('lon') || key2.toLowerCase().includes('lng')) {
                        const lng = parseFloat(local[key2]);
                        if (!isNaN(lat) && !isNaN(lng)) {
                            console.log('✅ Coordenadas extraídas de campos:', key, key2);
                            return { lat, lng };
                        }
                    }
                }
            }
        }

        console.warn('❌ Nenhuma coordenada encontrada para:', local.nome);
        return null;
    }

    // CONTROLES BÁSICOS DA INTERFACE
    setupUI() {
        // Botões de controle do mapa
        this.setupMapControls();

        // Botões de navegação
        this.setupNavigationControls();
    }

    setupMapControls() {
        // Zoom In
        document.getElementById('btn-zoom-in').addEventListener('click', () => {
            if (this.mapRouter && this.mapRouter.map) {
                this.mapRouter.map.zoomIn();
            }
        });

        // Zoom Out
        document.getElementById('btn-zoom-out').addEventListener('click', () => {
            if (this.mapRouter && this.mapRouter.map) {
                this.mapRouter.map.zoomOut();
            }
        });

        // Minha Localização
        document.getElementById('btn-my-location').addEventListener('click', () => {
            if (this.mapRouter) {
                this.mapRouter.goToMyLocation();
            }
        });

        // Ajustar ao roteiro
        document.getElementById('btn-fit-bounds').addEventListener('click', () => {
            if (this.mapRouter) {
                this.mapRouter.fitBounds();
            }
        });
    }

    setupNavigationControls() {
        // Iniciar Navegação
        document.getElementById('btn-start-navigation').addEventListener('click', () => {
            this.startNavigation();
        });

        // Imprimir Rota
        document.getElementById('btn-print-route').addEventListener('click', () => {
            window.print();
        });
    }

    // CONTROLES DE ROTA (O QUE VOCÊ PEDIU)
    setupRouteControls() {
        // Botão para mostrar/ocultar rota
        const routeToggleBtn = document.getElementById('btn-toggle-route');
        if (routeToggleBtn) {
            routeToggleBtn.addEventListener('click', () => {
                if (this.mapRouter) {
                    this.mapRouter.toggleRoute();
                    this.updateRouteButtonState(routeToggleBtn);
                }
            });
            // Adicionar o botão ao HTML se não existir
            if (!routeToggleBtn.parentNode) {
                this.addRouteToggleButton();
            }
        } else {
            this.addRouteToggleButton();
        }

        // Botão para recalcular rota
        const recalcBtn = document.getElementById('btn-recalculate');
        if (recalcBtn) {
            recalcBtn.addEventListener('click', async () => {
                if (this.mapRouter && this.roteiro) {
                    try {
                        await this.mapRouter.calculateAndPlotRoute();
                        alert('Rota recalculada com sucesso!');
                    } catch (error) {
                        console.error('❌ Erro ao recalcular rota:', error);
                        alert('Erro ao recalcular rota: ' + error.message);
                    }
                }
            });
        } else {
            this.addRecalculateButton();
        }
    }

    // Adicionar botão de mostrar/ocultar rota se não existir
    addRouteToggleButton() {
        const mapControls = document.querySelector('.map-controls');
        if (!mapControls) return;

        const btn = document.createElement('button');
        btn.id = 'btn-toggle-route';
        btn.className = 'map-btn';
        btn.title = 'Mostrar Rota';
        btn.innerHTML = '<i class="fas fa-route"></i>';

        btn.addEventListener('click', () => {
            if (this.mapRouter) {
                this.mapRouter.toggleRoute();
                this.updateRouteButtonState(btn);
            }
        });

        mapControls.appendChild(btn);
    }

    // Atualizar estado do botão de rota
    updateRouteButtonState(button) {
        const icon = button.querySelector('i');
        if (icon.classList.contains('fa-route')) {
            icon.className = 'fas fa-eye-slash';
            button.title = 'Ocultar Rota';
        } else {
            icon.className = 'fas fa-route';
            button.title = 'Mostrar Rota';
        }
    }

    // Adicionar botão de recalcular se não existir
    addRecalculateButton() {
        const routeActions = document.querySelector('.route-actions');
        if (!routeActions) return;

        const btn = document.createElement('button');
        btn.id = 'btn-recalculate';
        btn.className = 'btn-secondary';
        btn.innerHTML = '<i class="fas fa-sync-alt"></i> Recalcular Rota';

        btn.addEventListener('click', async () => {
            if (this.mapRouter && this.roteiro) {
                try {
                    await this.mapRouter.calculateAndPlotRoute();
                    alert('Rota recalculada com sucesso!');
                } catch (error) {
                    console.error('❌ Erro ao recalcular rota:', error);
                    alert('Erro ao recalcular rota: ' + error.message);
                }
            }
        });

        routeActions.appendChild(btn);
    }

    updateUI() {
        if (!this.roteiro) return;

        // Título
        document.getElementById('route-title').textContent =
            `Roteiro ${this.roteiro.theme} - ${this.roteiro.userLocation}`;

        // Informações básicas
        document.getElementById('info-theme').textContent = this.roteiro.theme;
        document.getElementById('info-location').textContent = this.roteiro.userLocation;
        document.getElementById('info-date').textContent =
            new Date(this.roteiro.generatedAt).toLocaleDateString('pt-BR');

        // Estatísticas (serão atualizadas pelo mapRouter após cálculo da rota)
        document.getElementById('stat-distance').textContent = this.roteiro.totalDistance;
        document.getElementById('stat-time').textContent = this.roteiro.totalTime;
        document.getElementById('stat-stops').textContent = this.roteiro.locations.length;

        // Lista de locais
        this.updateLocationsList();
    }

    updateLocationsList() {
        const container = document.getElementById('locations-list');
        const locations = this.roteiro.locations || [];

        if (locations.length === 0) {
            container.innerHTML = '<p class="no-locations">Nenhum local no roteiro</p>';
            return;
        }

        container.innerHTML = locations.map((local, index) => `
            <div class="location-item" onclick="window.mapApp.showLocationDetails(${index})">
                <div class="location-number">${index + 1}</div>
                <div class="location-info">
                    <div class="location-name">${local.nome}</div>
                    <div class="location-address">${local.endereco || 'Endereço não disponível'}</div>
                    ${local.tempoSugerido ?
                `<div class="location-time"><i class="fas fa-clock"></i> ${local.tempoSugerido}</div>` : ''}
                </div>
                <button class="location-zoom-btn" onclick="event.stopPropagation(); window.mapApp.zoomToLocation(${index})" 
                        title="Centralizar no mapa">
                    <i class="fas fa-search-location"></i>
                </button>
            </div>
        `).join('');
    }

    showLocationDetails(index) {
        if (this.mapRouter) {
            this.mapRouter.showLocationDetails(index);
        }
    }

    zoomToLocation(index) {
        if (this.mapRouter) {
            this.mapRouter.zoomToLocation(index);
        }
    }

    startNavigation() {
        if (!this.roteiro || !this.roteiro.locations || this.roteiro.locations.length === 0) {
            alert('Nenhum local para navegar');
            return;
        }

        const firstLocation = this.roteiro.locations[0];
        if (firstLocation.endereco) {
            const encodedAddress = encodeURIComponent(firstLocation.endereco);
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
        } else {
            alert('Endereço não disponível para navegação');
        }
    }

    showError(message) {
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; padding: 20px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #e74c3c; margin-bottom: 20px;"></i>
                    <h3 style="color: #e74c3c;">Erro ao carregar mapa</h3>
                    <p>${message}</p>
                    <div style="margin-top: 20px; display: flex; gap: 10px;">
                        <button onclick="window.location.href='/inicial'" 
                                style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">
                            <i class="fas fa-arrow-left"></i> Voltar
                        </button>
                        <button onclick="location.reload()" 
                                style="padding: 10px 20px; background: #2ecc71; color: white; border: none; border-radius: 5px; cursor: pointer;">
                            <i class="fas fa-redo"></i> Recarregar
                        </button>
                    </div>
                </div>
            `;
        }
    }

}

// Inicialização global
let mapApp;

document.addEventListener('DOMContentLoaded', () => {
    console.log('🗺️ Inicializando aplicação do mapa...');
    mapApp = new MapApp();
    mapApp.init();

    // Tornar acessível globalmente
    window.mapApp = mapApp;
});
// Função de debug global
window.debugCoordenadas = function () {
    if (window.mapApp && window.mapApp.roteiro) {
        console.log('🔍 DEBUG: Todas as coordenadas do roteiro');
        window.mapApp.roteiro.locations.forEach((loc, i) => {
            console.log(`${i + 1}. ${loc.nome}:`, loc.coordenadas);
        });

        // Testar extração
        const testLocal = window.mapApp.roteiro.locations[0];
        if (testLocal) {
            console.log('🔍 Testando extração do primeiro local:');
            console.log('Local completo:', testLocal);
            console.log('Coordenadas extraídas:',
                window.mapApp.extrairCoordenadas ?
                    window.mapApp.extrairCoordenadas(testLocal) :
                    'Método não disponível'
            );
        }
    } else {
        console.log('❌ mapApp ou roteiro não disponível');
    }
}