// fix-coordinates.js - Correção para coordenadas faltantes
console.log('🔧 fix-coordinates.js carregado');

// Interceptar a resposta do backend para adicionar coordenadas
if (window.fetch) {
    const originalFetch = window.fetch;
    
    window.fetch = async function(...args) {
        const response = await originalFetch.apply(this, args);
        
        // Clonar a resposta para poder ler e modificar
        const clonedResponse = response.clone();
        
        try {
            const data = await clonedResponse.json();
            
            // Verificar se é uma resposta de roteiro
            if (data.success && data.roteiro && data.roteiro.locais) {
                console.log('🔍 Interceptando resposta do roteiro...');
                
                // Adicionar coordenadas aos locais se faltarem
                data.roteiro.locais.forEach((local, index) => {
                    if (!local.latitude || !local.longitude) {
                        console.log(`📍 Adicionando coordenadas para: ${local.nome}`);
                        
                        // Coordenadas de Sorocaba
                        const coordenadasSorocaba = [
                            { latitude: -23.5285, longitude: -47.4420 },
                            { latitude: -23.5055, longitude: -47.4580 },
                            { latitude: -23.5080, longitude: -47.4555 },
                            { latitude: -23.5075, longitude: -47.4560 },
                            { latitude: -23.5025, longitude: -47.4590 },
                            { latitude: -23.5150, longitude: -47.4725 },
                            { latitude: -23.5210, longitude: -47.4480 },
                            { latitude: -23.5380, longitude: -47.4205 },
                            { latitude: -23.4800, longitude: -47.3800 }
                        ];
                        
                        const coordIndex = Math.min(index, coordenadasSorocaba.length - 1);
                        local.latitude = coordenadasSorocaba[coordIndex].latitude;
                        local.longitude = coordenadasSorocaba[coordIndex].longitude;
                    }
                });
                
                // Retornar resposta modificada
                const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
                return new Response(blob, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers
                });
            }
        } catch (e) {
            console.log('⚠️ Não foi possível processar resposta:', e);
        }
        
        return response;
    };
}

console.log('✅ Interceptador de fetch configurado');