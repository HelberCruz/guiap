package com.IFSP.Prototipo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class RoteiroDTO {
    private Long id;
    private String titulo;
    private String descricao;
    private String localizacao;
    private String tema;
    private Double distanciaTotal;
    private String tempoEstimado;
    
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
    private LocalDateTime criadoEm;
    
    private List<LocalRoteiroDTO> locais;
    
    // Construtor padrão
    public RoteiroDTO() {}
    
    // Construtor a partir do modelo
    public RoteiroDTO(com.IFSP.Prototipo.model.Roteiro roteiro) {
        this.id = roteiro.getId();
        this.titulo = roteiro.getTitulo();
        this.descricao = roteiro.getDescricao();
        this.localizacao = roteiro.getLocalizacao();
        this.tema = roteiro.getTema();
        this.distanciaTotal = roteiro.getDistanciaTotal();
        this.tempoEstimado = roteiro.getTempoEstimado();
        this.criadoEm = roteiro.getCriadoEm();
    }
    
    // Construtor completo
    public RoteiroDTO(com.IFSP.Prototipo.model.Roteiro roteiro, List<LocalRoteiroDTO> locais) {
        this(roteiro);
        this.locais = locais;
    }
    
    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    
    public String getLocalizacao() { return localizacao; }
    public void setLocalizacao(String localizacao) { this.localizacao = localizacao; }
    
    public String getTema() { return tema; }
    public void setTema(String tema) { this.tema = tema; }
    
    public Double getDistanciaTotal() { return distanciaTotal; }
    public void setDistanciaTotal(Double distanciaTotal) { this.distanciaTotal = distanciaTotal; }
    
    public String getTempoEstimado() { return tempoEstimado; }
    public void setTempoEstimado(String tempoEstimado) { this.tempoEstimado = tempoEstimado; }
    
    public LocalDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }
    
    public List<LocalRoteiroDTO> getLocais() { return locais; }
    public void setLocais(List<LocalRoteiroDTO> locais) { this.locais = locais; }
}