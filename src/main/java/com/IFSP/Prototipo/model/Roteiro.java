package com.IFSP.Prototipo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "roteiros")
public class Roteiro {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String titulo;
    
    @Column(columnDefinition = "TEXT")
    private String descricao;
    
    @Column(nullable = false)
    private String localizacao;
    
    @Column(nullable = false)
    private String tema;
    
    private Double distanciaTotal;
    private String tempoEstimado;
    
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
    
    @OneToMany(mappedBy = "roteiro", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LocalRoteiro> locais = new ArrayList<>();
    
    @Column(name = "criado_em")
    private LocalDateTime criadoEm;
    
    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm;
    
    @PrePersist
    protected void onCreate() {
        criadoEm = LocalDateTime.now();
        atualizadoEm = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        atualizadoEm = LocalDateTime.now();
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
    
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    
    public List<LocalRoteiro> getLocais() { return locais; }
    public void setLocais(List<LocalRoteiro> locais) { this.locais = locais; }
    
    public LocalDateTime getCriadoEm() { return criadoEm; }
    public LocalDateTime getAtualizadoEm() { return atualizadoEm; }
}