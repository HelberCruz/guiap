package com.IFSP.Prototipo.repository;

import com.IFSP.Prototipo.model.Roteiro;
import com.IFSP.Prototipo.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoteiroRepository extends JpaRepository<Roteiro, Long> {
    
    List<Roteiro> findByUsuario(Usuario usuario);
    List<Roteiro> findByUsuarioOrderByCriadoEmDesc(Usuario usuario);
    List<Roteiro> findByUsuarioAndTema(Usuario usuario, String tema);
    
    long countByUsuario(Usuario usuario);
    // NO RoteiroRepository.java - ADICIONE:
@Query("SELECT r FROM Roteiro r WHERE LOWER(r.localizacao) LIKE LOWER(CONCAT('%', :cidade, '%')) AND r.tema = :tema")
List<Roteiro> findByLocalizacaoContainingIgnoreCaseAndTema(@Param("cidade") String cidade, @Param("tema") String tema);

}