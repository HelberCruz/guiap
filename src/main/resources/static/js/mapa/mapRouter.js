// src/main/resources/static/js/mapa/mapRouter.js

class MapRouter {
    constructor() {
        this.map = null;
        this.roteiro = null;
        this.markers = [];
        this.routeControl = null;
        this.routeLine = null;
        this.selectedLocationIndex = null;
        this.userLocation = null;
        this.isRoutingAvailable = false;
    }

    async init(mapContainerId) {
        console.log('🗺️ Inicializando MapRouter...');

        try {
            // Verificar se o container existe
            const container = document.getElementById(mapContainerId);
            if (!container) {
                throw new Error(`Container #${mapContainerId} não encontrado`);
            }

            // CORREÇÃO: Usar coordenadas de Sorocaba como padrão
            this.map = L.map(mapContainerId).setView([-23.5017, -47.4581], 13);

            // Adicionar camada do OpenStreetMap
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
            }).addTo(this.map);

            // Configurar ícones personalizados
            this.setupCustomIcons();

            // Verificar se Leaflet Routing Machine está disponível
            this.isRoutingAvailable = typeof L.Routing !== 'undefined';
            console.log('📍 Leaflet Routing disponível?', this.isRoutingAvailable);

            // Obter localização do usuário (mas não é obrigatório)
            await this.getUserLocation();

            console.log('✅ MapRouter inicializado');
            return this.map;

        } catch (error) {
            console.error('❌ Erro ao inicializar MapRouter:', error);
            throw error;
        }
    }

    async getUserLocation() {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                console.warn('⚠️ Geolocalização não suportada');
                resolve(null);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    console.log('📍 Localização do usuário:', this.userLocation);
                    this.addUserLocationMarker();
                    resolve(this.userLocation);
                },
                (error) => {
                    console.warn('⚠️ Não foi possível obter localização:', error.message);
                    resolve(null);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        });
    }

    addUserLocationMarker() {
        if (!this.userLocation || !this.map) return;

        // Criar ícone personalizado para usuário
        const userIcon = L.divIcon({
            className: 'user-location-marker',
            html: `<div style="
                background: #2ecc71;
                border: 3px solid white;
                border-radius: 50%;
                width: 25px;
                height: 25px;
                box-shadow: 0 0 10px rgba(46, 204, 113, 0.8);
                position: relative;
            ">
                <div style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 8px;
                    height: 8px;
                    background: white;
                    border-radius: 50%;
                "></div>
            </div>`,
            iconSize: [25, 25],
            iconAnchor: [12, 12]
        });

        // Adicionar marcador
        L.marker([this.userLocation.lat, this.userLocation.lng], {
            icon: userIcon,
            zIndexOffset: 1000
        }).addTo(this.map)
            .bindPopup('<b><i class="fas fa-user"></i> Você está aqui</b>')
            .openPopup();

        // Adicionar círculo de precisão
        L.circle([this.userLocation.lat, this.userLocation.lng], {
            color: '#2ecc71',
            fillColor: '#2ecc71',
            fillOpacity: 0.1,
            radius: 50
        }).addTo(this.map);
    }

    setupCustomIcons() {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
        });
    }

    // MÉTODO plotRoteiro CORRIGIDO E UNIFICADO
    plotRoteiro(roteiro) {
        console.log('📍 [plotRoteiro] Iniciando...');

        if (!roteiro || !roteiro.locations || !Array.isArray(roteiro.locations)) {
            console.error('❌ [plotRoteiro] Roteiro inválido ou sem locations');
            return;
        }

        console.log(`📍 [plotRoteiro] Processando ${roteiro.locations.length} locais`);

        // Salvar roteiro
        this.roteiro = roteiro;

        // Limpar anteriores
        this.clearMarkers();
        this.clearRoute();

        // Verificar se o mapa está inicializado
        if (!this.map || !this.map._leaflet_id) {
            console.error('❌ [plotRoteiro] Mapa não inicializado');
            return;
        }

        // Criar marcadores
        const validLocations = [];

        roteiro.locations.forEach((local, index) => {
            if (local.coordenadas &&
                typeof local.coordenadas.lat === 'number' &&
                typeof local.coordenadas.lng === 'number' &&
                !isNaN(local.coordenadas.lat) &&
                !isNaN(local.coordenadas.lng)) {

                validLocations.push(local);

                // DEBUG: Log das coordenadas
                console.log(`📍 [plotRoteiro] Local ${index + 1}: ${local.nome}`);
                console.log(`   Coordenadas: ${local.coordenadas.lat}, ${local.coordenadas.lng}`);

                // Criar marcador
                const marker = this.addMarker(local.coordenadas, local.nome, index);

                if (marker) {
                    console.log(`   ✅ Marcador criado`);

                    // Adicionar popup
                    marker.bindPopup(this.createPopupContent(local, index));
                } else {
                    console.error(`   ❌ Falha ao criar marcador`);
                }
            } else {
                console.error(`❌ [plotRoteiro] Local sem coordenadas válidas: ${local.nome}`, local.coordenadas);
            }
        });

        console.log(`✅ [plotRoteiro] ${validLocations.length}/${roteiro.locations.length} locais processados`);

        // Ajustar vista do mapa
        if (validLocations.length > 0) {
            setTimeout(() => {
                this.fitMapToMarkers();
                console.log('✅ [plotRoteiro] Vista ajustada');
            }, 100);
        }

        // Calcular rota
        if (validLocations.length >= 2) {
            console.log('🛣️ [plotRoteiro] Calculando rota...');

            // Pequeno delay para garantir que marcadores estão renderizados
            setTimeout(() => {
                this.calculateAndPlotRoute();
            }, 300);
        } else {
            console.log('⚠️ [plotRoteiro] Locais insuficientes para rota');
        }

        console.log('✅ [plotRoteiro] Finalizado com sucesso');
    }

    addMarker(coords, title, index) {
        console.log(`📍 [addMarker] Criando: ${title} em ${coords.lat}, ${coords.lng}`);

        if (!this.map) {
            console.error('❌ [addMarker] Mapa não inicializado');
            return null;
        }

        try {
            // PRIMEIRO: Testar marcador SIMPLES
            console.log('  🧪 Testando marcador simples...');
            const simpleMarker = L.marker([coords.lat, coords.lng], {
                title: title
            }).addTo(this.map);

            simpleMarker.bindPopup(`<b>SIMPLE: ${title}</b>`);

            // SEGUNDO: Tentar com ícone personalizado
            console.log('  🎨 Tentando ícone personalizado...');
            const icon = this.createCustomIcon(index);

            // Remover marcador simples
            simpleMarker.remove();

            // Criar com ícone personalizado
            const marker = L.marker([coords.lat, coords.lng], {
                title: title,
                icon: icon,
                riseOnHover: true
            }).addTo(this.map);

            // Adicionar popup
            const popupContent = this.createPopupContent(
                this.roteiro.locations[index],
                index
            );
            marker.bindPopup(popupContent);

            // Armazenar
            this.markers.push(marker);

            console.log(`✅ [addMarker] Marcador criado: ${title}`);
            return marker;

        } catch (error) {
            console.error(`❌ [addMarker] ERRO:`, error);

            // Fallback: criar marcador simples
            try {
                const fallbackMarker = L.marker([coords.lat, coords.lng], {
                    title: title
                }).addTo(this.map);

                fallbackMarker.bindPopup(`<b>${title}</b><br>Fallback marker`);
                this.markers.push(fallbackMarker);

                console.log(`🔄 [addMarker] Usando fallback para ${title}`);
                return fallbackMarker;
            } catch (fallbackError) {
                console.error(`❌ [addMarker] Fallback também falhou:`, fallbackError);
                return null;
            }
        }
    }

    createCustomIcon(index) {
        console.log(`🎨 [createCustomIcon] Criando ícone para índice ${index}`);

        const isStartingPoint = (index === 0);
        const backgroundColor = isStartingPoint ? '#2ecc71' : '#3498db';
        const iconContent = isStartingPoint ? '🚩' : (index + 1);

        // Código HTML SIMPLIFICADO para o ícone
        const html = `
        <div style="
            background: ${backgroundColor};
            border: 3px solid white;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 16px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        ">
            ${iconContent}
        </div>
    `;

        try {
            return L.divIcon({
                className: 'custom-marker',
                html: html,
                iconSize: [40, 40],
                iconAnchor: [20, 40]
            });
        } catch (error) {
            console.error('❌ [createCustomIcon] Erro ao criar ícone:', error);

            // Fallback: usar ícone padrão do Leaflet
            return L.Icon.Default;
        }
    }

    getColorForIndex(index) {
        const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
        return colors[index % colors.length];
    }

    createPopupContent(local, index) {
        const isStartingPoint = (index === 0);
        let header = '';

        if (isStartingPoint) {
            header = `
                <div style="background: #2ecc71; color: white; padding: 8px; border-radius: 4px 4px 0 0; margin: -10px -10px 10px -10px;">
                    <i class="fas fa-flag-checkered"></i> <strong>PONTO DE PARTIDA</strong>
                </div>
            `;
        }

        return `
            <div style="min-width: 250px; max-width: 300px;">
                ${header}
                <h4 style="margin: 0 0 8px 0; color: #2c3e50;">
                    <i class="fas fa-map-marker-alt" style="color: ${this.getColorForIndex(index)};"></i>
                    ${local.nome}
                </h4>
                ${local.descricao ? `<p style="margin: 0 0 8px 0; color: #555; font-size: 13px;">${local.descricao}</p>` : ''}
                ${local.endereco ? `<p style="margin: 0 0 8px 0; font-size: 12px; color: #777;"><i class="fas fa-location-dot"></i> ${local.endereco}</p>` : ''}
                ${local.tipo ? `<p style="margin: 0 0 8px 0; font-size: 12px; color: #888;"><i class="fas fa-tag"></i> ${local.tipo}</p>` : ''}
                <div style="display: flex; gap: 8px; margin-top: 10px;">
                    <button onclick="window.mapApp.showLocationDetails(${index})" 
                            style="flex: 1; padding: 6px 12px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                        <i class="fas fa-info-circle"></i> Detalhes
                    </button>
                    <button onclick="window.mapApp.zoomToLocation(${index})" 
                            style="padding: 6px 12px; background: #2ecc71; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                        <i class="fas fa-search-location"></i>
                    </button>
                </div>
            </div>
        `;
    }

    async calculateAndPlotRoute() {
        console.log('🛣️ [calculateAndPlotRoute] Iniciando...');

        if (!this.roteiro || !this.roteiro.locations) {
            console.log('⚠️ [calculateAndPlotRoute] Sem locais para rota');
            return;
        }

        // Filtrar locais com coordenadas válidas
        const validLocations = this.roteiro.locations.filter(loc =>
            loc.coordenadas &&
            loc.coordenadas.lat &&
            loc.coordenadas.lng &&
            typeof loc.coordenadas.lat === 'number' &&
            typeof loc.coordenadas.lng === 'number'
        );

        if (validLocations.length < 2) {
            console.log('⚠️ [calculateAndPlotRoute] Locais insuficientes para rota:', validLocations.length);
            return;
        }

        console.log(`🔄 [calculateAndPlotRoute] Calculando rota para ${validLocations.length} locais...`);

        // Preparar waypoints
        const waypoints = validLocations.map(loc =>
            L.latLng(loc.coordenadas.lat, loc.coordenadas.lng)
        );

        // Verificar se podemos usar rotas OSRM
        if (this.isRoutingAvailable && waypoints.length >= 2) {
            try {
                // Remover rota anterior
                this.clearRoute();

                // Criar nova rota
                this.routeControl = L.Routing.control({
                    waypoints: waypoints,
                    routeWhileDragging: false,
                    showAlternatives: false,
                    lineOptions: {
                        styles: [{
                            color: '#3498db',
                            opacity: 0.8,
                            weight: 6
                        }]
                    },
                    createMarker: () => null, // Não criar marcadores extras
                    addWaypoints: false,
                    draggableWaypoints: false,
                    fitSelectedRoutes: true,
                    router: L.Routing.osrmv1({
                        serviceUrl: 'https://router.project-osrm.org/route/v1'
                    })
                }).addTo(this.map);

                // Quando a rota for encontrada
                this.routeControl.on('routesfound', (e) => {
                    const route = e.routes[0];
                    console.log('✅ [calculateAndPlotRoute] Rota encontrada:', {
                        distance: (route.summary.totalDistance / 1000).toFixed(1) + ' km',
                        time: Math.round(route.summary.totalTime / 60) + ' min',
                        waypoints: waypoints.length
                    });
                    this.updateRouteStats(route);
                });

                // Esconder o painel de controle
                setTimeout(() => {
                    const container = this.routeControl.getContainer();
                    if (container) {
                        container.style.display = 'none';
                    }
                }, 500);

                console.log('✅ [calculateAndPlotRoute] Rota OSRM criada');

            } catch (error) {
                console.error('❌ [calculateAndPlotRoute] Erro na rota OSRM:', error);
                this.drawSimpleRoute(validLocations);
            }
        } else {
            console.log('⚠️ [calculateAndPlotRoute] Usando rota simples');
            this.drawSimpleRoute(validLocations);
        }
    }

    drawSimpleRoute(locations) {
        console.log('📏 [drawSimpleRoute] Criando rota simples...');

        if (!locations || locations.length < 2) {
            console.log('⚠️ [drawSimpleRoute] Não há locais suficientes');
            return;
        }

        const points = locations.map(l => [l.coordenadas.lat, l.coordenadas.lng]);

        // Remover linha anterior
        if (this.routeLine) {
            this.map.removeLayer(this.routeLine);
        }

        // Criar nova linha
        this.routeLine = L.polyline(points, {
            color: '#3498db',
            weight: 4,
            opacity: 0.7,
            dashArray: '10, 10',
            lineJoin: 'round'
        }).addTo(this.map);

        // Calcular distância aproximada
        const distance = this.calculateSimpleDistance(points);
        const time = Math.round(locations.length * 30 + distance * 2);

        this.updateSimpleStats(distance, locations.length);

        console.log(`✅ [drawSimpleRoute] Rota simples: ${distance.toFixed(1)} km, ${time} min`);
    }

    calculateSimpleDistance(points) {
        let totalDistance = 0;
        for (let i = 1; i < points.length; i++) {
            const lat1 = points[i - 1][0];
            const lon1 = points[i - 1][1];
            const lat2 = points[i][0];
            const lon2 = points[i][1];

            // Fórmula de Haversine simplificada
            const R = 6371; // Raio da Terra em km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            totalDistance += R * c;
        }
        return totalDistance;
    }

    updateRouteStats(route) {
        if (!route || !route.summary) return;

        const distance = (route.summary.totalDistance / 1000).toFixed(1);
        const time = Math.round(route.summary.totalTime / 60);

        this.updateUIStats(distance, time);
    }

    updateSimpleStats(distance, numStops) {
        // Estimativa de tempo: 30 minutos por parada + 2 minutos por km
        const time = Math.round(numStops * 30 + distance * 2);
        this.updateUIStats(distance.toFixed(1), time);
    }

    updateUIStats(distance, time) {
        // Atualizar na sidebar
        const statDistance = document.getElementById('stat-distance');
        const statTime = document.getElementById('stat-time');

        if (statDistance) statDistance.textContent = `${distance} km`;
        if (statTime) statTime.textContent = `${time} min`;

        console.log(`📊 [updateUIStats] Rota: ${distance} km, ${time} min`);
    }

    clearMarkers() {
        console.log('🧹 [clearMarkers] Limpando marcadores...');
        this.markers.forEach(marker => {
            if (marker && marker.remove) marker.remove();
        });
        this.markers = [];
    }

    clearRoute() {
        console.log('🧹 [clearRoute] Limpando rota...');
        if (this.routeControl) {
            this.map.removeControl(this.routeControl);
            this.routeControl = null;
        }
        if (this.routeLine) {
            this.map.removeLayer(this.routeLine);
            this.routeLine = null;
        }
    }

    fitMapToMarkers() {
        console.log('🗺️ [fitMapToMarkers] Ajustando vista...');

        if (!this.map) {
            console.error('❌ [fitMapToMarkers] Mapa não inicializado');
            return;
        }

        if (!this.markers || this.markers.length === 0) {
            console.log('⚠️ [fitMapToMarkers] Nenhum marcador');
            return;
        }

        try {
            // Obter coordenadas válidas dos marcadores
            const latlngs = [];
            this.markers.forEach(marker => {
                if (marker && marker.getLatLng) {
                    const latlng = marker.getLatLng();
                    if (latlng && typeof latlng.lat === 'number' && typeof latlng.lng === 'number') {
                        latlngs.push(latlng);
                    }
                }
            });

            if (latlngs.length === 0) {
                console.log('⚠️ [fitMapToMarkers] Nenhuma coordenada válida');
                return;
            }

            console.log(`📍 [fitMapToMarkers] Ajustando para ${latlngs.length} marcadores`);

            // Criar bounds e ajustar vista
            const bounds = L.latLngBounds(latlngs);
            this.map.fitBounds(bounds, {
                padding: [50, 50],
                maxZoom: 15,
                animate: true,
                duration: 0.5
            });

            console.log('✅ [fitMapToMarkers] Vista ajustada');

        } catch (error) {
            console.error('❌ [fitMapToMarkers] Erro:', error);
            // Fallback para Sorocaba
            this.map.setView([-23.5017, -47.4581], 13);
        }
    }

    showLocationDetails(index) {
        if (!this.roteiro || !this.roteiro.locations[index]) return;

        const local = this.roteiro.locations[index];
        const panel = document.getElementById('location-details');

        if (!panel) {
            console.warn('⚠️ Painel de detalhes não encontrado');
            return;
        }

        // Atualizar conteúdo
        const elements = {
            'detail-name': local.nome,
            'detail-description': local.descricao || 'Sem descrição',
            'detail-address': local.endereco || 'Endereço não disponível',
            'detail-time': local.tempoSugerido || 'Tempo não especificado',
            'detail-cost': local.custo || 'Custo não informado',
            'detail-tip-text': local.dica || 'Sem dicas'
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });

        // Mostrar painel
        panel.style.display = 'block';

        // Centralizar mapa
        if (local.coordenadas) {
            this.map.setView([local.coordenadas.lat, local.coordenadas.lng], 16);
        }

        this.selectedLocationIndex = index;
    }

    zoomToLocation(index) {
        if (!this.roteiro || !this.roteiro.locations[index]) return;

        const local = this.roteiro.locations[index];
        if (local.coordenadas) {
            this.map.setView([local.coordenadas.lat, local.coordenadas.lng], 16);
        }
    }

    goToMyLocation() {
        if (this.userLocation) {
            this.map.setView([this.userLocation.lat, this.userLocation.lng], 15);
        } else {
            alert('Localização não disponível. Verifique as permissões do navegador.');
        }
    }

    toggleRoute() {
        if (this.routeControl) {
            const container = this.routeControl.getContainer();
            if (container) {
                container.style.display = container.style.display === 'none' ? 'block' : 'none';
            }
        }
    }
    // Adicione este método à classe MapRouter
    debugState() {
        console.log('🔍 [DEBUG] Estado do MapRouter:');
        console.log('  - Mapa inicializado?', !!this.map);
        console.log('  - Tem roteiro?', !!this.roteiro);
        console.log('  - Número de marcadores:', this.markers.length);
        console.log('  - Marcadores válidos:', this.markers.filter(m => m && m.getLatLng).length);

        if (this.markers.length > 0) {
            console.log('  📍 Posições dos marcadores:');
            this.markers.forEach((marker, i) => {
                if (marker && marker.getLatLng) {
                    const pos = marker.getLatLng();
                    console.log(`    ${i + 1}. ${marker.options?.title || 'Sem título'}: ${pos.lat}, ${pos.lng}`);
                } else {
                    console.log(`    ${i + 1}. Marcador inválido`);
                }
            });
        }

        // Verificar elementos no DOM
        console.log('  🌐 Elementos no DOM:');
        console.log('    - Marcadores Leaflet:', document.querySelectorAll('.leaflet-marker-icon').length);
        console.log('    - Ícones customizados:', document.querySelectorAll('.leaflet-div-icon').length);

        // Verificar se os marcadores estão visíveis
        const container = document.getElementById('map');
        if (container) {
            const markersInContainer = container.querySelectorAll('.leaflet-marker-icon, .leaflet-div-icon');
            console.log('    - Marcadores no container:', markersInContainer.length);
        }
    }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.MapRouter = MapRouter;
}