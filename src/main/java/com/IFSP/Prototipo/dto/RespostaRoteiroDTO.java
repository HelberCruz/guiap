package com.IFSP.Prototipo.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class RespostaRoteiroDTO {
    private Boolean success;
    private String message;
    private RoteiroDTO roteiro;
    private Map<String, Object> rota;
    private Integer totalLocais;
    
    // Construtores
    public RespostaRoteiroDTO() {}
    
    public RespostaRoteiroDTO(Boolean success, String message) {
        this.success = success;
        this.message = message;
    }
    
    public RespostaRoteiroDTO(Boolean success, RoteiroDTO roteiro, 
                             Map<String, Object> rota, Integer totalLocais) {
        this.success = success;
        this.roteiro = roteiro;
        this.rota = rota;
        this.totalLocais = totalLocais;
    }
    
    // Métodos estáticos de fábrica
    public static RespostaRoteiroDTO sucesso(RoteiroDTO roteiro, 
                                            Map<String, Object> rota, 
                                            Integer totalLocais) {
        return new RespostaRoteiroDTO(true, roteiro, rota, totalLocais);
    }
    
    public static RespostaRoteiroDTO erro(String message) {
        return new RespostaRoteiroDTO(false, message);
    }
    
    // Getters e Setters
    public Boolean getSuccess() { return success; }
    public void setSuccess(Boolean success) { this.success = success; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public RoteiroDTO getRoteiro() { return roteiro; }
    public void setRoteiro(RoteiroDTO roteiro) { this.roteiro = roteiro; }
    
    public Map<String, Object> getRota() { return rota; }
    public void setRota(Map<String, Object> rota) { this.rota = rota; }
    
    public Integer getTotalLocais() { return totalLocais; }
    public void setTotalLocais(Integer totalLocais) { this.totalLocais = totalLocais; }
}