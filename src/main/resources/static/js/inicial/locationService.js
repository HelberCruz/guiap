// js/inicial/locationService.js - VERSÃO CORRIGIDA
class LocationService {
    constructor() {
        this.userLocation = '';
    }

    async detectUserLocation() {
        console.log('📍 Detectando localização...');
        
        if (!navigator.geolocation) {
            throw new Error('Geolocalização não suportada');
        }

        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    console.log('📍 Posição obtida:', position.coords);
                    try {
                        const location = await this.reverseGeocode(
                            position.coords.latitude,
                            position.coords.longitude
                        );
                        this.userLocation = location;
                        console.log('📍 Localização convertida:', location);
                        resolve(location);
                    } catch (error) {
                        console.error('📍 Erro no reverse geocode:', error);
                        // Fallback: usar coordenadas
                        this.userLocation = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
                        resolve(this.userLocation);
                    }
                },
                (error) => {
                    console.error('📍 Erro na geolocalização:', error);
                    reject(new Error('Permita o acesso à localização no navegador'));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        });
    }

    async reverseGeocode(lat, lng) {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=pt`
            );
            const data = await response.json();
            
            if (data.address) {
                // Tenta obter cidade
                let locationName = '';
                if (data.address.city) locationName = data.address.city;
                else if (data.address.town) locationName = data.address.town;
                else if (data.address.village) locationName = data.address.village;
                else if (data.address.municipality) locationName = data.address.municipality;
                
                if (locationName && data.address.country) {
                    return `${locationName}, ${data.address.country}`;
                }
            }
            
            // Fallback: coordenadas
            return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            
        } catch (error) {
            console.error('📍 Erro no Nominatim:', error);
            return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        }
    }

    getLocation() {
        return this.userLocation;
    }

    setLocation(location) {
        this.userLocation = location;
    }
}