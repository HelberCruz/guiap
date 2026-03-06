package com.IFSP.Prototipo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.IFSP.Prototipo.model.Usuario;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    // Optional aqui significa: "pode encontrar ou não um usuário com este email"
    // Mas o email continua sendo campo obrigatório na tabela!
    Optional<Usuario> findByEmail(String email);
    
    Optional<Usuario> findByCpf(String cpf);
}