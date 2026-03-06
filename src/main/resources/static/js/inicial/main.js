class App {
    constructor() {
        console.log('🔧 Construtor App chamado');
        this.elements = null;
        this.userLocation = null;
        this.selectedTheme = null;
        this.validationTimeout = null;
    }

    init() {
        console.log('🔧 App.init() chamado');
        this.cacheElements();
        this.setupEventListeners();
        this.setupThemeSelection();
        console.log('🎉 App inicializada com sucesso!');
    }

    cacheElements() {
        console.log('🔧 Cache de elementos...');
        this.elements = {
            // IDs EXATOS do seu HTML
            locationBtn: document.getElementById('detect-location'),
            locationInput: document.getElementById('user-location'),
            generateBtn: document.getElementById('generate-itinerary'),
            themeCards: document.querySelectorAll('.card[data-theme]'),
            loadingModal: document.getElementById('loading-modal')
        };
        
        console.log('🔍 Elementos encontrados:', {
            locationBtn: !!this.elements.locationBtn,
            locationInput: !!this.elements.locationInput,
            generateBtn: !!this.elements.generateBtn,
            themeCards: this.elements.themeCards ? this.elements.themeCards.length : 0
        });
    }

    setupEventListeners() {
        console.log('🔧 Configurando event listeners...');
        
        // 1. BOTÃO "USAR MINHA LOCALIZAÇÃO"
        if (this.elements.locationBtn) {
            console.log('✅ Botão detectar localização - OK');
            this.elements.locationBtn.addEventListener('click', () => {
                this.getUserLocation();
            });
        } else {
            console.warn('⚠️ Botão detectar localização NÃO encontrado');
        }
        
        // 2. INPUT DE LOCALIZAÇÃO (digitação)
        if (this.elements.locationInput) {
            console.log('✅ Input localização - OK');
            
            // Validação em tempo real (digitação)
            this.elements.locationInput.addEventListener('input', () => {
                clearTimeout(this.validationTimeout);
                
                this.validationTimeout = setTimeout(async () => {
                    const address = this.elements.locationInput.value.trim();
                    if (address.length > 2) {
                        await this.validateAddressInRealTime(address);
                    }
                    this.validateAndEnableGenerate();
                }, 800);
            });
            
            // Validação ao sair do campo
            this.elements.locationInput.addEventListener('blur', async () => {
                const address = this.elements.locationInput.value.trim();
                if (address) {
                    await this.validateAddressInRealTime(address);
                }
            });
            
            // Enter para validar
            this.elements.locationInput.addEventListener('keypress', async (e) => {
                if (e.key === 'Enter') {
                    const address = this.elements.locationInput.value.trim();
                    if (address) {
                        await this.validateAddressInRealTime(address, true);
                    }
                    this.validateAndEnableGenerate();
                }
            });
        } else {
            console.warn('⚠️ Input localização NÃO encontrado');
        }
        
        // 3. BOTÃO "GERAR MEU ROTEIRO"
        if (this.elements.generateBtn) {
            console.log('✅ Botão gerar roteiro - OK');
            this.elements.generateBtn.addEventListener('click', () => {
                this.generateItinerary();
            });
        } else {
            console.warn('⚠️ Botão gerar roteiro NÃO encontrado');
        }
        
        console.log('🎯 Configuração de event listeners concluída');
    }

    setupThemeSelection() {
        if (!this.elements.themeCards) return;
        
        this.elements.themeCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (card.dataset.theme === 'manual') return;
                
                this.elements.themeCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.selectedTheme = card.dataset.theme;
                console.log(`🎨 Tema selecionado: ${this.selectedTheme}`);
                
                this.validateAndEnableGenerate();
            });
        });
    }

    // ====================
    // GEOLOCALIZAÇÃO (GPS)
    // ====================
    async getUserLocation() {
        console.log('📍 Obtendo localização via GPS...');
        
        if (!navigator.geolocation) {
            alert('Seu navegador não suporta geolocalização. Digite o endereço manualmente.');
            return;
        }
        
        this.showLoading('Obtendo sua localização...');
        
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: false,  // FALSE funciona melhor
                    timeout: 10000,
                    maximumAge: 30000
                });
            });
            
            const { latitude, longitude } = position.coords;
            console.log(`📍 Coordenadas obtidas: ${latitude}, ${longitude}`);
            
            // Converter para endereço
            const address = await this.reverseGeocode(latitude, longitude);
            
            // Preencher o campo
            this.elements.locationInput.value = address;
            this.userLocation = { latitude, longitude, address };
            
            // Validar e dar feedback
            this.validateAndEnableGenerate();
            this.showValidationIndicator('valid');
            this.showSuccess('Localização obtida com sucesso!');
            
        } catch (error) {
            console.error('❌ Erro ao obter localização:', error);
            
            let errorMessage = 'Não foi possível obter sua localização. ';
            errorMessage += 'Por favor, digite o endereço manualmente.';
            
            alert(errorMessage);
            this.elements.locationInput.focus();
            
        } finally {
            this.hideLoading();
        }
    }

    async reverseGeocode(lat, lng) {
        try {
            // Usar OpenStreetMap (gratuito, sem chave)
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16`,
                {
                    headers: {
                        'User-Agent': 'MeuGuiaApp/1.0'
                    }
                }
            );
            
            if (!response.ok) return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            
            const data = await response.json();
            
            if (data.address) {
                const addr = data.address;
                // Tentar pegar cidade/estado
                if (addr.city && addr.state) {
                    return `${addr.city}, ${addr.state}`;
                } else if (addr.town && addr.state) {
                    return `${addr.town}, ${addr.state}`;
                } else if (addr.village && addr.state) {
                    return `${addr.village}, ${addr.state}`;
                }
            }
            
            return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            
        } catch (error) {
            console.warn('⚠️ Geocodificação reversa falhou:', error);
            return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        }
    }

    // ====================
    // VALIDAÇÃO DE ENDEREÇO
    // ====================
    async validateUserAddress(address) {
        console.log(`🔍 Validando endereço: "${address}"`);
        
        if (!address || address.trim().length < 3) {
            return { isValid: false, message: 'Digite pelo menos 3 caracteres' };
        }
        
        // Verificar se parece um endereço
        if (address.length < 5 && !/\d/.test(address)) {
            return { 
                isValid: false, 
                message: 'Endereço muito curto. Inclua cidade ou rua' 
            };
        }
        
        // Tentar geocodificar para confirmar
        try {
            const coords = await this.geocodeAddress(address);
            
            if (coords) {
                return { 
                    isValid: true, 
                    message: 'Endereço válido!',
                    coordinates: coords,
                    formattedAddress: coords.displayName || address
                };
            }
            
            // Mesmo sem coordenadas, aceitar se parece válido
            return { 
                isValid: true,
                message: 'Endereço aceito',
                coordinates: null
            };
            
        } catch (error) {
            console.log('⚠️ Validação falhou, mas aceitamos:', error);
            return { 
                isValid: true,
                message: 'Endereço será verificado na geração',
                coordinates: null
            };
        }
    }

    async geocodeAddress(address) {
        try {
            // Geocodificação direta: texto → coordenadas
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=br`,
                {
                    headers: {
                        'User-Agent': 'MeuGuiaApp/1.0'
                    }
                }
            );
            
            if (!response.ok) return null;
            
            const data = await response.json();
            
            if (data && data.length > 0) {
                return {
                    lat: parseFloat(data[0].lat),
                    lon: parseFloat(data[0].lon),
                    displayName: data[0].display_name
                };
            }
            
            return null;
            
        } catch (error) {
            console.warn('⚠️ Geocodificação falhou:', error);
            return null;
        }
    }

    async validateAddressInRealTime(address, showAlert = false) {
        if (address.length < 3) {
            this.showValidationIndicator('none');
            return;
        }
        
        this.showValidationIndicator('validating');
        
        const result = await this.validateUserAddress(address);
        
        if (result.isValid) {
            this.showValidationIndicator('valid');
            
            if (result.coordinates && showAlert) {
                console.log(`✅ Endereço confirmado: ${result.formattedAddress}`);
            }
            
            if (result.coordinates) {
                this.userLocation = {
                    latitude: result.coordinates.lat,
                    longitude: result.coordinates.lon,
                    address: result.formattedAddress || address
                };
            }
            
        } else {
            this.showValidationIndicator('invalid');
            if (showAlert) {
                alert(result.message);
            }
        }
    }

    showValidationIndicator(state) {
        const input = this.elements.locationInput;
        if (!input) return;
        
        input.classList.remove('validating', 'valid', 'invalid');
        
        if (state === 'validating') {
            input.classList.add('validating');
            input.title = 'Validando endereço...';
        } else if (state === 'valid') {
            input.classList.add('valid');
            input.title = 'Endereço válido!';
        } else if (state === 'invalid') {
            input.classList.add('invalid');
            input.title = 'Endereço precisa ser corrigido';
        } else {
            input.title = '';
        }
    }

    validateAndEnableGenerate() {
        const hasLocation = this.elements.locationInput.value.trim().length > 0;
        const hasTheme = this.selectedTheme !== null;
        
        if (hasLocation && hasTheme) {
            this.elements.generateBtn.disabled = false;
            this.elements.generateBtn.classList.add('enabled');
        } else {
            this.elements.generateBtn.disabled = true;
            this.elements.generateBtn.classList.remove('enabled');
        }
    }

    // ====================
    // GERAÇÃO DO ROTEIRO
    // ====================
    async generateItinerary() {
        console.log('🚀 Iniciando geração do roteiro...');
        
        const rawAddress = this.elements.locationInput.value.trim();
        const theme = this.selectedTheme;
        
        if (!rawAddress || !theme) {
            alert('Por favor, preencha a localização e selecione um tema.');
            return;
        }
        
        // Validar endereço antes de gerar
        this.showLoading('Validando endereço...');
        
        try {
            const validation = await this.validateUserAddress(rawAddress);
            
            if (!validation.isValid) {
                this.hideLoading();
                alert(validation.message);
                this.elements.locationInput.focus();
                return;
            }
            
            // Usar endereço formatado se disponível
            const finalAddress = validation.formattedAddress || rawAddress;
            
            console.log(`📤 Gerando roteiro para: ${finalAddress}, Tema: ${theme}`);
            
            // Mostrar que está processando
            this.showLoading('Criando seu roteiro personalizado...');
            
            // Redirecionar para a página de roteiro
            window.location.href = `/roteiro?tema=${theme}&localizacao=${encodeURIComponent(finalAddress)}`;
            
        } catch (error) {
            console.error('❌ Erro na validação final:', error);
            this.hideLoading();
            
            // Mesmo com erro, permitir tentar
            const shouldProceed = confirm(
                'Endereço não pôde ser validado completamente.\n' +
                'Deseja tentar gerar o roteiro mesmo assim?\n\n' +
                `Localização: ${rawAddress}`
            );
            
            if (shouldProceed) {
                window.location.href = `/roteiro?tema=${theme}&localizacao=${encodeURIComponent(rawAddress)}`;
            }
        }
    }

    // ====================
    // MÉTODOS AUXILIARES
    // ====================
    showLoading(message) {
        if (this.elements.loadingModal) {
            const modal = this.elements.loadingModal;
            const messageEl = modal.querySelector('p');
            if (messageEl) messageEl.textContent = message;
            modal.style.display = 'flex';
        }
    }

    hideLoading() {
        if (this.elements.loadingModal) {
            this.elements.loadingModal.style.display = 'none';
        }
    }

    showSuccess(message) {
        console.log('✅ ' + message);
        // Feedback visual simples
        if (this.elements.locationBtn) {
            const originalHTML = this.elements.locationBtn.innerHTML;
            this.elements.locationBtn.innerHTML = '<i class="fas fa-check"></i> Localizado!';
            this.elements.locationBtn.style.backgroundColor = '#27ae60';
            
            setTimeout(() => {
                this.elements.locationBtn.innerHTML = originalHTML;
                this.elements.locationBtn.style.backgroundColor = '';
            }, 2000);
        }
    }

    showError(message) {
        alert(message);
    }

    showInfo(message) {
        console.log('ℹ️ ' + message);
    }
}

// ====================
// INICIALIZAÇÃO
// ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏁 DOM Content Loaded - Iniciando App...');
    
    // Verificar se estamos na página correta
    if (!document.getElementById('user-location')) {
        console.log('⚠️ Não está na página inicial, abortando App');
        return;
    }
    
    const app = new App();
    app.init();
});