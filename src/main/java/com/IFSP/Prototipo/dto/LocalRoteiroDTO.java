package com.IFSP.Prototipo.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class LocalRoteiroDTO {
    private Long id;
    private String nome;
    private String descricao;
    private String tipo;
    private String endereco;
    private Double latitude;
    private Double longitude;
    private String tempoSugerido;
    private String faixaPreco;
    private Double rating;
    private Integer totalAvaliacoes;
    private String dicas;
    private Integer ordemVisita;
    
    // Construtor padrão
    public LocalRoteiroDTO() {}
    
    // Construtor com parâmetros
    public LocalRoteiroDTO(Long id, String nome, String descricao, String tipo, 
                          String endereco, Double latitude, Double longitude) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.tipo = tipo;
        this.endereco = endereco;
        this.latitude = latitude;
        this.longitude = longitude;
    }
    
    // Construtor a partir do modelo
    public LocalRoteiroDTO(com.IFSP.Prototipo.model.LocalRoteiro local) {
        this.id = local.getId();
        this.nome = local.getNome();
        this.descricao = local.getDescricao();
        this.tipo = local.getTipo();
        this.endereco = local.getEndereco();
        this.latitude = local.getLatitude();
        this.longitude = local.getLongitude();
        this.tempoSugerido = local.getTempoSugerido();
        this.faixaPreco = local.getFaixaPreco();
        this.rating = local.getRating();
        this.totalAvaliacoes = local.getTotalAvaliacoes();
        this.dicas = local.getDicas();
        this.ordemVisita = local.getOrdemVisita();
    }
    
    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    
    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }
    
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    
    public String getTempoSugerido() { return tempoSugerido; }
    public void setTempoSugerido(String tempoSugerido) { this.tempoSugerido = tempoSugerido; }
    
    public String getFaixaPreco() { return faixaPreco; }
    public void setFaixaPreco(String faixaPreco) { this.faixaPreco = faixaPreco; }
    
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    
    public Integer getTotalAvaliacoes() { return totalAvaliacoes; }
    public void setTotalAvaliacoes(Integer totalAvaliacoes) { this.totalAvaliacoes = totalAvaliacoes; }
    
    public String getDicas() { return dicas; }
    public void setDicas(String dicas) { this.dicas = dicas; }
    
    public Integer getOrdemVisita() { return ordemVisita; }
    public void setOrdemVisita(Integer ordemVisita) { this.ordemVisita = ordemVisita; }
}