package com.IFSP.Prototipo.service;

import com.IFSP.Prototipo.model.Roteiro;
import com.IFSP.Prototipo.model.LocalRoteiro;
import com.IFSP.Prototipo.model.Usuario;
import com.IFSP.Prototipo.repository.RoteiroRepository;

import jakarta.annotation.PostConstruct;

import com.IFSP.Prototipo.repository.LocalRoteiroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RoteiroService {

    @Autowired
    private RoteiroRepository roteiroRepository;

    @Autowired
    private LocalRoteiroRepository localRoteiroRepository;

    @Transactional
    public Roteiro salvarRoteiro(Usuario usuario, Map<String, Object> dadosRoteiro) {
        Roteiro roteiro = new Roteiro();
        roteiro.setUsuario(usuario);
        roteiro.setTitulo((String) dadosRoteiro.getOrDefault("titulo", "Meu Roteiro"));
        roteiro.setDescricao((String) dadosRoteiro.getOrDefault("summary", ""));
        roteiro.setLocalizacao((String) dadosRoteiro.getOrDefault("userLocation", ""));
        roteiro.setTema((String) dadosRoteiro.getOrDefault("theme", ""));

        // Extrair informações de distância e tempo
        String distancia = (String) dadosRoteiro.getOrDefault("totalDistance", "0 km");
        String tempo = (String) dadosRoteiro.getOrDefault("totalTime", "0 min");

        // Converter "15 km" para 15.0
        try {
            if (distancia.contains("km")) {
                String num = distancia.replace("km", "").trim();
                roteiro.setDistanciaTotal(Double.parseDouble(num));
            }
        } catch (NumberFormatException e) {
            roteiro.setDistanciaTotal(0.0);
        }

        roteiro.setTempoEstimado(tempo);

        // Salvar roteiro primeiro
        Roteiro savedRoteiro = roteiroRepository.save(roteiro);

        // Salvar locais do roteiro
        List<Map<String, Object>> locais = (List<Map<String, Object>>) dadosRoteiro.get("locations");
        if (locais != null) {
            for (int i = 0; i < locais.size(); i++) {
                Map<String, Object> localData = locais.get(i);
                LocalRoteiro local = criarLocalRoteiro(localData, savedRoteiro, i + 1);
                localRoteiroRepository.save(local);
            }
        }

        return savedRoteiro;
    }

    // NO RoteiroService.java - ADICIONE este método:
    public List<LocalRoteiro> buscarLocaisPopularesPorCidadeETema(String cidade, String tema) {
        // Buscar em todos os roteiros já criados por outros usuários
        // que tenham locais na mesma cidade e com o mesmo tema
        List<Roteiro> roteirosSimilares = roteiroRepository.findByLocalizacaoContainingIgnoreCaseAndTema(cidade, tema);

        List<LocalRoteiro> locaisPopulares = new ArrayList<>();

        for (Roteiro roteiro : roteirosSimilares) {
            List<LocalRoteiro> locaisDoRoteiro = listarLocaisDoRoteiro(roteiro);
            locaisPopulares.addAll(locaisDoRoteiro);
        }

        // Limitar a 4 locais únicos (evitar duplicados)
        return locaisPopulares.stream()
                .filter(local -> local.getEndereco() != null && !local.getEndereco().isEmpty())
                .distinct() // Necessário implementar equals/hashCode ou usar Set
                .limit(4)
                .collect(Collectors.toList());
    }

    private LocalRoteiro criarLocalRoteiro(Map<String, Object> localData, Roteiro roteiro, int ordem) {
        LocalRoteiro local = new LocalRoteiro();
        local.setRoteiro(roteiro);
        local.setNome((String) localData.getOrDefault("name", localData.getOrDefault("nome", "Local sem nome")));
        local.setDescricao((String) localData.getOrDefault("description", localData.getOrDefault("descricao", "")));
        local.setTipo((String) localData.getOrDefault("type", localData.getOrDefault("tipo", "")));
        local.setEndereco((String) localData.getOrDefault("address", localData.getOrDefault("endereco", "")));
        local.setTempoSugerido(
                (String) localData.getOrDefault("suggestedTime", localData.getOrDefault("tempoSugerido", "")));
        local.setFaixaPreco((String) localData.getOrDefault("cost", localData.getOrDefault("custo", "")));
        local.setDicas((String) localData.getOrDefault("tips", localData.getOrDefault("dica", "")));
        local.setOrdemVisita(ordem);

        // Extrair coordenadas
        if (localData.get("coordenadas") instanceof Map) {
            Map<String, Object> coords = (Map<String, Object>) localData.get("coordenadas");
            if (coords.get("lat") != null) {
                local.setLatitude(Double.parseDouble(coords.get("lat").toString()));
            }
            if (coords.get("lng") != null) {
                local.setLongitude(Double.parseDouble(coords.get("lng").toString()));
            }
        }

        // Extrair rating
        if (localData.get("rating") != null) {
            try {
                local.setRating(Double.parseDouble(localData.get("rating").toString()));
            } catch (NumberFormatException e) {
                local.setRating(null);
            }
        }

        return local;
    }

    // NO RoteiroService.java - ADICIONE:
    @PostConstruct
    @Transactional
    public void initDadosExemplo() {
        // Só popula se não houver locais
        if (localRoteiroRepository.count() == 0) {
            System.out.println("🎯 Criando dados de exemplo para trabalho escolar...");

            // Criar um usuário "sistema" para os dados exemplo
            // (Ou você pode criar roteiros sem usuário se ajustar o modelo)

            System.out.println("✅ Dados de exemplo prontos para uso");
        }
    }

    public List<Roteiro> listarRoteirosPorUsuario(Usuario usuario) {
        return roteiroRepository.findByUsuarioOrderByCriadoEmDesc(usuario);
    }

    public Roteiro buscarPorId(Long id) {
        return roteiroRepository.findById(id).orElse(null);
    }

    public List<LocalRoteiro> listarLocaisDoRoteiro(Roteiro roteiro) {
        return localRoteiroRepository.findByRoteiroOrderByOrdemVisitaAsc(roteiro);
    }

    @Transactional
    public void deletarRoteiro(Long id) {
        roteiroRepository.deleteById(id);
    }

    public long contarRoteirosPorUsuario(Usuario usuario) {
        return roteiroRepository.countByUsuario(usuario);
    }
    
}