package com.IFSP.Prototipo.service;

import com.IFSP.Prototipo.model.LocalRoteiro;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class MapsRoutingService {
    
    private final RestTemplate restTemplate = new RestTemplate();
    private static final String OSRM_BASE_URL = "https://router.project-osrm.org/route/v1/driving/";
    
    /**
     * Calcula rota entre múltiplos pontos usando OSRM (Open Source Routing Machine)
     */
    public Map<String, Object> calcularRota(List<LocalRoteiro> locais) {
        Map<String, Object> resultado = new HashMap<>();
        
        if (locais == null || locais.size() < 2) {
            resultado.put("erro", "É necessário pelo menos 2 locais para calcular uma rota");
            return resultado;
        }
        
        try {
            // Construir string de coordenadas para OSRM
            StringBuilder coordinates = new StringBuilder();
            for (LocalRoteiro local : locais) {
                if (local.getLatitude() != null && local.getLongitude() != null) {
                    coordinates.append(local.getLongitude())
                              .append(",")
                              .append(local.getLatitude())
                              .append(";");
                }
            }
            
            // Remover último ponto e vírgula
            if (coordinates.length() > 0) {
                coordinates.setLength(coordinates.length() - 1);
            }
            
            String url = OSRM_BASE_URL + coordinates.toString() + "?overview=full&geometries=geojson";
            
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> osrmResponse = response.getBody();
                
                if ("Ok".equals(osrmResponse.get("code"))) {
                    List<Map<String, Object>> routes = (List<Map<String, Object>>) osrmResponse.get("routes");
                    if (routes != null && !routes.isEmpty()) {
                        Map<String, Object> route = routes.get(0);
                        
                        // Converter distância para km
                        Double distanceMeters = (Double) route.get("distance");
                        Double distanceKm = distanceMeters / 1000.0;
                        
                        // Converter duração para minutos
                        Double durationSeconds = (Double) route.get("duration");
                        Double durationMinutes = durationSeconds / 60.0;
                        
                        resultado.put("sucesso", true);
                        resultado.put("distancia", String.format("%.1f km", distanceKm));
                        resultado.put("tempo", String.format("%.0f min", durationMinutes));
                        resultado.put("geometria", route.get("geometry"));
                        resultado.put("pontos", locais.size());
                        
                        return resultado;
                    }
                }
            }
            
        } catch (Exception e) {
            resultado.put("erro", "Erro ao calcular rota: " + e.getMessage());
            return resultado;
        }
        
        // Fallback: cálculo simples baseado em distância linear
        return calcularRotaFallback(locais);
    }
    
    private Map<String, Object> calcularRotaFallback(List<LocalRoteiro> locais) {
        Map<String, Object> resultado = new HashMap<>();
        
        // Cálculo simplificado (distância euclidiana)
        double distanciaTotal = 0;
        for (int i = 0; i < locais.size() - 1; i++) {
            LocalRoteiro atual = locais.get(i);
            LocalRoteiro proximo = locais.get(i + 1);
            
            if (atual.getLatitude() != null && atual.getLongitude() != null &&
                proximo.getLatitude() != null && proximo.getLongitude() != null) {
                
                // Fórmula de Haversine simplificada
                double lat1 = Math.toRadians(atual.getLatitude());
                double lon1 = Math.toRadians(atual.getLongitude());
                double lat2 = Math.toRadians(proximo.getLatitude());
                double lon2 = Math.toRadians(proximo.getLongitude());
                
                double dlat = lat2 - lat1;
                double dlon = lon2 - lon1;
                double a = Math.sin(dlat/2) * Math.sin(dlat/2) +
                          Math.cos(lat1) * Math.cos(lat2) *
                          Math.sin(dlon/2) * Math.sin(dlon/2);
                double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                double distancia = 6371 * c; // Raio da Terra em km
                
                distanciaTotal += distancia;
            }
        }
        
        // Tempo estimado: 50km/h em média + 30min por parada
        double tempoHoras = (distanciaTotal / 50.0) + (locais.size() * 0.5);
        double tempoMinutos = tempoHoras * 60;
        
        resultado.put("sucesso", true);
        resultado.put("distancia", String.format("%.1f km", distanciaTotal));
        resultado.put("tempo", String.format("%.0f min", tempoMinutos));
        resultado.put("geometria", null);
        resultado.put("pontos", locais.size());
        resultado.put("observacao", "Cálculo estimado (sem tráfego)");
        
        return resultado;
    }
    
    /**
     * Calcula rota do ponto de partida para o primeiro destino
     */
    public Map<String, Object> calcularRotaPartida(String enderecoPartida, LocalRoteiro primeiroDestino) {
        Map<String, Object> resultado = new HashMap<>();
        
        // Esta é uma versão simplificada
        // Em produção, você usaria uma API de geocoding + routing
        
        resultado.put("sucesso", true);
        resultado.put("distancia", "A calcular");
        resultado.put("tempo", "A calcular");
        resultado.put("observacao", "Use a função de navegação do seu aplicativo de mapas");
        
        return resultado;
    }
}