// src/main/resources/static/js/roteiro/main.js

class RoteiroApp {
    constructor() {
        this.itineraryService = itineraryService;
        this.mapsService = mapsService;
        this.currentMap = null;
        this.selectedLocationIndex = null;
        this.itinerary = null;
    }
    // ADICIONE ESTES MÉTODOS:
    showLoading(message = 'Carregando...') {
        // Criar elemento de loading se não existir
        if (!this.loadingElement) {
            this.loadingElement = document.createElement('div');
            this.loadingElement.id = 'loading-overlay';
            this.loadingElement.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                color: white;
            `;

            const spinner = document.createElement('div');
            spinner.style.cssText = `
                border: 5px solid #f3f3f3;
                border-top: 5px solid #3498db;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                animation: spin 1s linear infinite;
                margin-bottom: 20px;
            `;

            const text = document.createElement('div');
            text.id = 'loading-text';
            text.textContent = message;
            text.style.fontSize = '18px';

            // Adicionar animação CSS
            const style = document.createElement('style');
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;

            this.loadingElement.appendChild(style);
            this.loadingElement.appendChild(spinner);
            this.loadingElement.appendChild(text);
            document.body.appendChild(this.loadingElement);
        } else {
            this.loadingElement.style.display = 'flex';
            const text = this.loadingElement.querySelector('#loading-text');
            if (text) text.textContent = message;
        }
    }

    hideLoading() {
        if (this.loadingElement) {
            this.loadingElement.style.display = 'none';
        }
    }
    showApiStatus(message, type = 'info') {
        const statusDiv = document.getElementById('api-status');
        const messageSpan = document.getElementById('status-message');

        if (statusDiv && messageSpan) {
            statusDiv.className = `api-status ${type}`;
            messageSpan.textContent = message;
            statusDiv.style.display = 'flex';

            // Auto-esconder após 10 segundos
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 10000);
        }
    }
    async confirmItinerary() {
        console.log('🎯 confirmItinerary() chamado');

        if (!this.itinerary) {
            console.error('❌ Nenhum itinerary disponível');
            alert('Nenhum roteiro para confirmar.');
            return;
        }

        console.log('📋 Itinerary disponível:', {
            tema: this.itinerary.theme,
            localizacao: this.itinerary.userLocation,
            numLocais: this.itinerary.locations?.length
        });

        try {
            // Mostrar loading
            this.showLoading('Salvando roteiro no banco de dados...');

            console.log('💾 Chamando salvarRoteiroNoBanco()...');

            // 1. Salvar no banco H2 via API
            const saveResult = await this.itineraryService.salvarRoteiroNoBanco();

            console.log('✅ Resultado do salvamento:', saveResult);

            if (!saveResult || !saveResult.success) {
                throw new Error(saveResult?.message || 'Falha ao salvar roteiro');
            }

            // 2. Salvar no localStorage também (para backup)
            localStorage.setItem('confirmedItinerary', JSON.stringify(this.itinerary));
            localStorage.setItem('currentItinerary', JSON.stringify(this.itinerary));

            console.log('💾 Salvo no localStorage');

            // 3. Redirecionar para página do mapa com o ID
            const redirectUrl = `/mapa?roteiroId=${saveResult.roteiroId}`;
            console.log('📍 Redirecionando para:', redirectUrl);

            // Forçar redirecionamento após pequeno delay
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 500);

        } catch (error) {
            console.error('❌ Erro ao salvar roteiro:', error);
            this.hideLoading();

            // Mostrar erro detalhado
            alert(`Erro ao salvar roteiro: ${error.message}\n\nVerifique o console para mais detalhes.`);
        }
    }
    // No método confirmItinerary, ADICIONE LOGS DETALHADOS:
    async confirmItinerary() {
        console.log('🎯 confirmItinerary() chamado');

        if (!this.itinerary) {
            console.error('❌ Nenhum itinerary disponível');
            alert('Nenhum roteiro para confirmar.');
            return;
        }

        console.log('📋 Itinerary disponível:', {
            tema: this.itinerary.theme,
            localizacao: this.itinerary.userLocation,
            numLocais: this.itinerary.locations?.length
        });

        try {

            console.log('💾 Chamando salvarRoteiroNoBanco()...');

            // 1. Salvar no banco H2 via API
            const saveResult = await this.itineraryService.salvarRoteiroNoBanco();

            console.log('✅ Resultado do salvamento:', saveResult);

            if (!saveResult || !saveResult.success) {
                throw new Error(saveResult?.message || 'Falha ao salvar roteiro');
            }

            // 2. Salvar no localStorage também (para backup)
            localStorage.setItem('confirmedItinerary', JSON.stringify(this.itinerary));
            localStorage.setItem('currentItinerary', JSON.stringify(this.itinerary));

            console.log('💾 Salvo no localStorage');

            // 3. Redirecionar para página do mapa com o ID
            const redirectUrl = `/mapa?roteiroId=${saveResult.roteiroId}`;
            console.log('📍 Redirecionando para:', redirectUrl);

            // Forçar redirecionamento após pequeno delay
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 500);

        } catch (error) {
            console.error('❌ Erro ao salvar roteiro:', error);

            // Mostrar erro detalhado
            alert(`Erro ao salvar roteiro: ${error.message}\n\nVerifique o console para mais detalhes.`);
        }
    }
    // No método init do RoteiroApp:
    async init() {
        console.log('🏁 Inicializando Roteiro App...');

        try {
            // 1. Inicializar serviços
            await this.initializeServices();

            // 2. Carregar dados do roteiro
            this.itinerary = await this.itineraryService.loadItineraryData();

            if (!this.itinerary) {
                throw new Error('Não foi possível carregar o roteiro');
            }

            console.log('📊 Itinerary carregado:', {
                tema: this.itinerary.theme,
                localizacao: this.itinerary.userLocation,
                numLocais: this.itinerary.locations?.length || 0,
                isDemo: this.itinerary.isDemo
            });

            // 3. Renderizar interface
            this.renderItinerary(this.itinerary);

            // 4. Inicializar mapa (agora com Leaflet/OpenStreetMap)
            await this.initMap(this.itinerary);

            // 5. Configurar event listeners
            this.setupEventListeners();

            console.log('✅ Roteiro App inicializado com sucesso');

            // Mostrar status ao usuário
            if (this.itinerary.isDemo || this.itinerary.isFallback) {
                this.showApiStatus('Usando dados simulados para demonstrar o funcionamento', 'warning');
            } else if (this.itinerary.extracted) {
                this.showApiStatus('Dados extraídos parcialmente da resposta', 'info');
            }

        } catch (error) {
            console.error('❌ Erro ao inicializar:', error);

            // Tentar carregar do localStorage como fallback
            const savedData = localStorage.getItem('currentItinerary');
            if (savedData) {
                try {
                    this.itinerary = JSON.parse(savedData);
                    this.renderItinerary(this.itinerary);
                    this.showApiStatus('Carregado de backup local', 'warning');
                } catch (e) {
                    this.showError(`Falha ao carregar roteiro: ${error.message}`);
                }
            } else {
                this.showError(`Falha ao carregar roteiro: ${error.message}`);
            }
        }
    }

    async initializeServices() {
        console.log('🛠️ Inicializando serviços...');

        // Inicializar Gemini
        const geminiInitialized = await geminiService.initialize();
        if (!geminiInitialized) {
            console.warn('⚠️ Gemini não inicializado - usando dados mockados');
        }

        // Inicializar Maps (agora com Leaflet/OpenStreetMap)
        const mapsInitialized = await mapsService.initialize();
        if (!mapsInitialized) {
            console.warn('⚠️ Maps não inicializado - usando modo básico');
        }
    }

    renderItinerary(itinerary) {
        console.log('🎨 Renderizando roteiro...');

        if (!itinerary) {
            this.showError('Nenhum dado de roteiro disponível');
            return;
        }

        // 1. Atualizar informações básicas
        this.updateBasicInfo(itinerary);

        // 2. Renderizar cards dos locais
        this.renderLocationCards(itinerary.locations || []);

        // 3. Atualizar legenda do mapa
        this.updateMapLegend(itinerary.locations || []);

        // 4. Atualizar informações de rota
        this.updateRouteInfo(itinerary);
    }

    updateBasicInfo(itinerary) {
        const themeNames = {
            'historia': 'Histórico',
            'gastronomia': 'Gastronômico',
            'paisagens': 'Paisagens',
            'cultura': 'Cultural',
            'festas': 'Vida Noturna',
            'manual': 'Personalizado'
        };

        // Título
        document.getElementById('page-title').textContent =
            `Roteiro ${themeNames[itinerary.theme] || itinerary.theme} - ${itinerary.userLocation}`;

        // Localização atual
        document.getElementById('current-location-name').textContent = itinerary.userLocation;
        document.getElementById('current-location-description').textContent =
            itinerary.summary || `Explore os melhores pontos de ${itinerary.userLocation}`;
    }

    renderLocationCards(locations) {
        const container = document.getElementById('locations-grid');
        if (!container) return;

        if (!locations || locations.length === 0) {
            container.innerHTML = `
                <div class="no-locations">
                    <i class="fas fa-map-marker-alt"></i>
                    <h3>Nenhum local encontrado</h3>
                    <p>Tente gerar um novo roteiro com parâmetros diferentes.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = locations.map((location, index) => `
            <div class="location-card" data-location-index="${index}">
                <div class="card-header">
                    <div class="location-number">${index + 1}</div>
                    <h3>${location.nome}</h3>
                    ${location.rating ? `
                        <div class="location-rating-badge">
                            <i class="fas fa-star"></i> ${location.rating.toFixed(1)}
                            ${location.totalAvaliacoes ? `<small>(${location.totalAvaliacoes})</small>` : ''}
                        </div>
                    ` : ''}
                </div>
                
                <div class="card-image">
                    <img src="${location.fotoUrl || this.getFallbackImage(location)}" 
                         alt="${location.nome}"
                         onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop'">
                </div>
                
                <div class="card-content">
                    <p>${location.descricao}</p>
                    
                    <div class="location-details">
                        ${location.endereco ? `
                            <div class="detail-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${location.endereco}</span>
                            </div>
                        ` : ''}
                        
                        ${location.tempoSugerido ? `
                            <div class="detail-item">
                                <i class="fas fa-clock"></i>
                                <span>${location.tempoSugerido}</span>
                            </div>
                        ` : ''}
                        
                        ${location.custo ? `
                            <div class="detail-item">
                                <i class="fas fa-money-bill-wave"></i>
                                <span>${this.formatCost(location.custo)}</span>
                            </div>
                        ` : ''}
                        
                        ${location.horarioFuncionamento ? `
                            <div class="detail-item">
                                <i class="fas fa-calendar-alt"></i>
                                <span>${Array.isArray(location.horarioFuncionamento) ? location.horarioFuncionamento[0] : location.horarioFuncionamento}</span>
                            </div>
                        ` : ''}
                    </div>
                    
                    ${location.dica ? `
                        <div class="location-tip">
                            <i class="fas fa-lightbulb"></i>
                            <strong>Dica:</strong> ${location.dica}
                        </div>
                    ` : ''}
                    
                    ${location.tipos && location.tipos.length > 0 ? `
                        <div class="location-tags">
                            ${location.tipos.slice(0, 3).map(tipo => `
                                <span class="tag">${tipo}</span>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
                
                <div class="card-actions">
                    <button class="btn-view-on-map" onclick="roteiroApp.viewOnMap(${index})">
                        <i class="fas fa-map-marked-alt"></i> Ver no Mapa
                    </button>
                    <button class="btn-get-directions" onclick="roteiroApp.getDirections(${index})">
                        <i class="fas fa-directions"></i> Como Chegar
                    </button>
                    ${location.website ? `
                        <a href="${location.website}" target="_blank" class="btn-website">
                            <i class="fas fa-globe"></i> Site
                        </a>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    getFallbackImage(location) {
        const query = encodeURIComponent(`${location.tipo || 'place'} ${location.nome?.split(' ')[0] || 'brazil'}`);
        return `https://source.unsplash.com/random/600x400/?${query}`;
    }

    formatCost(cost) {
        const costMap = {
            'gratuito': 'Gratuito',
            'barato': 'Barato (R$ 10-30)',
            'médio': 'Médio (R$ 30-80)',
            'caro': 'Caro (R$ 80+)'
        };
        return costMap[cost] || cost;
    }

    updateMapLegend(locations) {
        const legendList = document.getElementById('legend-list');
        if (!legendList) return;

        legendList.innerHTML = locations.map((location, index) => `
            <li onclick="roteiroApp.viewOnMap(${index})" style="cursor: pointer;">
                <span class="legend-marker" style="background: ${this.getMarkerColor(index)};"></span>
                ${location.nome || `Local ${index + 1}`}
                ${location.rating ? `<span class="legend-rating">${location.rating.toFixed(1)}</span>` : ''}
            </li>
        `).join('');
    }

    getMarkerColor(index) {
        const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
        return colors[index % colors.length];
    }

    updateRouteInfo(itinerary) {
        if (itinerary.totalDistance) {
            document.getElementById('total-distance').textContent = itinerary.totalDistance;
        }
        if (itinerary.totalTime) {
            document.getElementById('total-time').textContent = itinerary.totalTime;
        }
    }

    async initMap(itinerary) {
        const mapContainer = document.getElementById('map');
        if (!mapContainer) {
            console.warn('⚠️ Container do mapa não encontrado');
            return;
        }

        try {
            // Geocodificar localização base
            const geocodeResult = await mapsService.geocodeAddress(itinerary.userLocation);
            console.log('📍 Coordenadas base obtidas:', geocodeResult);

            // Inicializar mapa
            this.currentMap = await mapsService.initMap('map', {
                lat: geocodeResult.lat,
                lng: geocodeResult.lng
            }, 13);

            // Adicionar marcadores para cada local
            if (itinerary.locations && itinerary.locations.length > 0) {
                itinerary.locations.forEach((location, index) => {
                    if (location.coordenadas && location.coordenadas.lat && location.coordenadas.lng) {
                        // ✅ JÁ TEM COORDENADAS - usar diretamente
                        mapsService.addMarker(
                            location.coordenadas,
                            location.nome || `Local ${index + 1}`,
                            this.getMarkerColor(index)
                        );
                        console.log(`📍 Marcador ${index + 1}: usando coordenadas do JSON`);
                    } else if (location.endereco && !location.coordenadas) {
                        // ❌ NÃO TEM COORDENADAS - geocodificar (com rate limiting)
                        this.geocodeAndAddMarkerWithDelay(location.endereco, location.nome, index, 1000 * index);
                    }
                });
            }

        } catch (error) {
            console.error('❌ Erro ao inicializar mapa:', error);
            // ... resto do código de erro ...
        }
    }

    // NOVO MÉTODO: Geocodificar com delay entre requisições
    async geocodeAndAddMarkerWithDelay(address, title, index, delay) {
        setTimeout(async () => {
            try {
                console.log(`⏳ Geocodificando em ${delay}ms: ${title}`);
                const geocodeResult = await mapsService.geocodeAddress(address);

                if (geocodeResult && geocodeResult.lat && geocodeResult.lng) {
                    mapsService.addMarker(
                        { lat: geocodeResult.lat, lng: geocodeResult.lng },
                        title,
                        this.getMarkerColor(index)
                    );
                    console.log(`✅ Marcador adicionado: ${title}`);
                }
            } catch (error) {
                console.warn(`⚠️ Não foi possível adicionar marcador para ${title}:`, error);
            }
        }, delay);
    }

    setupEventListeners() {
        // Botão Compartilhar
        const shareBtn = document.querySelector('.btn-share');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                this.shareItinerary();
            });
        }

        // Botão Favoritar
        const favoriteBtn = document.querySelector('.btn-favorite-header');
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', () => {
                this.favoriteItinerary();
            });
        }

        // Botão Confirmar Roteiro
        const confirmBtn = document.getElementById('confirm-roteiro-btn');
        console.log('🔍 Botão confirmar encontrado?', !!confirmBtn);

        if (confirmBtn) {
            confirmBtn.addEventListener('click', (e) => {
                console.log('🎯 Botão Confirmar clicado!');
                e.preventDefault(); // Importante para não enviar formulário
                this.confirmItinerary();
            });
        } else {
            console.error('❌ Botão confirm-roteiro-btn NÃO encontrado!');
            // Tentar selecionar por classe como fallback
            const btnByClass = document.querySelector('.btn-confirm-small');
            console.log('🔍 Botão por classe:', btnByClass);

            if (btnByClass) {
                btnByClass.addEventListener('click', (e) => {
                    console.log('🎯 Botão Confirmar (classe) clicado!');
                    e.preventDefault();
                    this.confirmItinerary();
                });
            }
        }

        // Botão Voltar
        const backBtn = document.querySelector('.btn-back');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                window.location.href = '/inicial';
            });
        }

        // Botões de ver no mapa (adicionados dinamicamente)
        this.setupDynamicEventListeners();
    }

    setupDynamicEventListeners() {
        // Os botões dentro dos cards são adicionados via onclick no HTML
        // Mas podemos adicionar event delegation também
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-view-on-map')) {
                const card = e.target.closest('.location-card');
                if (card) {
                    const index = card.getAttribute('data-location-index');
                    if (index !== null) {
                        this.viewOnMap(parseInt(index));
                    }
                }
            }

            if (e.target.closest('.btn-get-directions')) {
                const card = e.target.closest('.location-card');
                if (card) {
                    const index = card.getAttribute('data-location-index');
                    if (index !== null) {
                        this.getDirections(parseInt(index));
                    }
                }
            }
        });
    }

    // Métodos de ação - ATUALIZADOS para compatibilidade com Leaflet
    async viewOnMap(index) {
        const location = this.itineraryService.getLocation(index);
        if (!location) return;

        console.log(`🗺️ Visualizando no mapa: ${location.nome}`);

        if (!this.currentMap) {
            // Se não tem mapa interativo, mostrar informações
            alert(`${location.nome}\n\nEndereço: ${location.endereco || 'Não disponível'}\n\nCoordenadas: ${location.coordenadas ? `${location.coordenadas.lat}, ${location.coordenadas.lng}` : 'Não disponível'}`);
            return;
        }

        // Verificar tipo de mapa (Leaflet ou Google Maps)
        if (typeof this.currentMap.setView === 'function') {
            // Leaflet.js
            const coords = location.coordenadas || await this.getCoordinatesForLocation(location);
            if (coords && coords.lat && coords.lng) {
                this.currentMap.setView([coords.lat, coords.lng], 16);

                // Abrir popup do marcador se existir
                const markers = this.mapsService?.markers || [];
                if (markers[index] && typeof markers[index].openPopup === 'function') {
                    markers[index].openPopup();
                }
            }
        } else if (typeof this.currentMap.setCenter === 'function') {
            // Google Maps (se voltar a usar no futuro)
            const coords = location.coordenadas || await this.getCoordinatesForLocation(location);
            if (coords) {
                this.currentMap.setCenter(coords);
                this.currentMap.setZoom(16);
            }
        } else {
            // Mapa estático ou não suportado
            alert(`${location.nome}\n\nEndereço: ${location.endereco || 'Não disponível'}`);
        }

        this.selectedLocationIndex = index;
    }

    async getCoordinatesForLocation(location) {
        if (location.coordenadas) return location.coordenadas;

        if (location.endereco) {
            try {
                const result = await this.mapsService.geocodeAddress(location.endereco);
                return { lat: result.lat, lng: result.lng };
            } catch (error) {
                console.warn('⚠️ Não foi possível obter coordenadas:', error);
            }
        }

        return null;
    }

    async getDirections(index) {
        const location = this.itineraryService.getLocation(index);
        if (!location || !location.endereco) {
            alert('Endereço não disponível para este local.');
            return;
        }

        const address = encodeURIComponent(location.endereco);

        // Usar OpenStreetMap para direções (gratuito)
        const osmUrl = `https://www.openstreetmap.org/directions?from=&to=${address}`;

        // Ou usar Google Maps como fallback
        const googleUrl = `https://www.google.com/maps/dir/?api=1&destination=${address}`;

        // Abrir em nova aba
        window.open(osmUrl, '_blank');

        // Feedback para o usuário
        console.log(`📍 Direções para: ${location.nome}`);
    }

    shareItinerary() {
        if (!this.itinerary) {
            alert('Nenhum roteiro para compartilhar.');
            return;
        }

        const shareUrl = this.itineraryService.getShareableLink();
        const shareText = `Confira meu roteiro ${this.itinerary.theme} para ${this.itinerary.userLocation} no MeuGuia!`;

        // Usar Web Share API se disponível
        if (navigator.share) {
            navigator.share({
                title: `Roteiro ${this.itinerary.theme} - MeuGuia`,
                text: shareText,
                url: shareUrl
            }).catch(error => {
                console.log('Compartilhamento cancelado ou erro:', error);
                this.copyToClipboard(shareText, shareUrl);
            });
        } else {
            // Fallback: copiar para área de transferência
            this.copyToClipboard(shareText, shareUrl);
        }
    }

    copyToClipboard(text, url) {
        const fullText = `${text}\n\n${url}`;
        navigator.clipboard.writeText(fullText)
            .then(() => alert('Link do roteiro copiado para a área de transferência!'))
            .catch(() => {
                // Fallback mais simples
                prompt('Copie o link para compartilhar:', url);
            });
    }

    favoriteItinerary() {
        if (!this.itinerary) {
            alert('Nenhum roteiro para favoritar.');
            return;
        }

        const success = this.itineraryService.saveToFavorites();

        if (success) {
            alert('✅ Roteiro adicionado aos favoritos!');

            // Atualizar visual do botão
            const favoriteBtn = document.querySelector('.btn-favorite-header');
            if (favoriteBtn) {
                favoriteBtn.innerHTML = '<i class="fas fa-star" style="color: #f39c12;"></i> Favoritado';
                favoriteBtn.disabled = true;
            }
        } else {
            alert('⚠️ Este roteiro já está nos favoritos!');
        }
    }

    async saveItineraryToBackend() {
        try {
            const response = await fetch('/api/save-itinerary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.itinerary)
            });

            if (response.ok) {
                console.log('✅ Roteiro salvo no backend');
            }
        } catch (error) {
            console.error('❌ Erro ao salvar roteiro:', error);
        }
    }

    showError(message) {
        const container = document.getElementById('locations-grid') || document.querySelector('.main-content');
        if (container) {
            container.innerHTML = `
                <div class="error-message" style="text-align: center; padding: 40px; color: #666;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #e74c3c; margin-bottom: 20px;"></i>
                    <h3 style="color: #e74c3c;">Erro ao carregar roteiro</h3>
                    <p>${message}</p>
                    <button onclick="window.location.href='/inicial'" class="btn-back" style="
                        margin-top: 20px;
                        padding: 10px 20px;
                        background: #3498db;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;">
                        <i class="fas fa-arrow-left"></i> Voltar e Gerar Novo Roteiro
                    </button>
                </div>
            `;
        }
    }
}

// Inicializar aplicação
let roteiroApp;

document.addEventListener('DOMContentLoaded', () => {
    console.log('📋 Página de roteiro carregada');

    // Verificar se estamos na página correta
    if (!document.getElementById('locations-grid')) {
        console.log('⚠️ Não está na página de roteiro, abortando inicialização');
        return;
    }

    roteiroApp = new RoteiroApp();
    roteiroApp.init();
});