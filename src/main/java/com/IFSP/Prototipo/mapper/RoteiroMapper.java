package com.IFSP.Prototipo.mapper;

import com.IFSP.Prototipo.dto.LocalRoteiroDTO;
import com.IFSP.Prototipo.dto.RoteiroDTO;
import com.IFSP.Prototipo.model.LocalRoteiro;
import com.IFSP.Prototipo.model.Roteiro;
import java.util.List;
import java.util.stream.Collectors;

public class RoteiroMapper {
    
    // Converter LocalRoteiro (model) para LocalRoteiroDTO
    public static LocalRoteiroDTO toDTO(LocalRoteiro local) {
        if (local == null) return null;
        
        return new LocalRoteiroDTO(local);
    }
    
    // Converter lista de LocalRoteiro para lista de DTO
    public static List<LocalRoteiroDTO> toDTOList(List<LocalRoteiro> locais) {
        if (locais == null) return null;
        
        return locais.stream()
                .map(RoteiroMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    // Converter Roteiro (model) para RoteiroDTO sem locais
    public static RoteiroDTO toDTO(Roteiro roteiro) {
        if (roteiro == null) return null;
        
        return new RoteiroDTO(roteiro);
    }
    
    // Converter Roteiro (model) para RoteiroDTO com locais
    public static RoteiroDTO toDTOComLocais(Roteiro roteiro, List<LocalRoteiro> locais) {
        if (roteiro == null) return null;
        
        RoteiroDTO dto = new RoteiroDTO(roteiro);
        dto.setLocais(toDTOList(locais));
        return dto;
    }
    
    // Converter para resposta simplificada (usado na listagem)
    public static RoteiroDTO toDTOResumido(Roteiro roteiro) {
        if (roteiro == null) return null;
        
        RoteiroDTO dto = new RoteiroDTO(roteiro);
        // Não inclui locais na listagem resumida
        return dto;
    }
}