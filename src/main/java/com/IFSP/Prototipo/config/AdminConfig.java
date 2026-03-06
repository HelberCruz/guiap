package com.IFSP.Prototipo.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.IFSP.Prototipo.model.Usuario;
import com.IFSP.Prototipo.repository.UsuarioRepository;

@Configuration
public class AdminConfig {
    
    @Bean
    CommandLineRunner criarAdmin(UsuarioRepository usuarioRepository) {
        return args -> {
            // Verificar se já existe um admin
            if (usuarioRepository.findByEmail("admin@meuguia.com").isEmpty()) {
                Usuario admin = new Usuario();
                admin.setNome("Administrador");
                admin.setEmail("admin@meuguia.com");
                admin.setCpf("000.000.000-00");
                admin.setSenha("admin123");
                admin.setNivelAcesso("ADMIN");
                
                usuarioRepository.save(admin);
                System.out.println("Usuário admin criado: admin@meuguia.com / admin123");
            }
        };
    }
}