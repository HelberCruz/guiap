package com.IFSP.Prototipo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.IFSP.Prototipo.model.Usuario;
import com.IFSP.Prototipo.repository.UsuarioRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private FileStorageService fileStorageService;

    public Usuario salvarUsuario(Usuario usuario) {
        // Email continua obrigatório aqui!
        return usuarioRepository.save(usuario);
    }
    
    public Usuario buscarPorEmail(String email) {
        Optional<Usuario> usuario = usuarioRepository.findByEmail(email);
        return usuario.orElse(null); // Retorna o usuário ou null se não encontrar
    }
    
    public Usuario buscarPorId(Long id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);
        return usuario.orElse(null);
    }
    
    public boolean existePorEmail(String email) {
        // Verifica se existe algum usuário com este email
        return usuarioRepository.findByEmail(email).isPresent();
    }
    
    public boolean existePorCpf(String cpf) {
        // Verifica se existe algum usuário com este CPF
        return usuarioRepository.findByCpf(cpf).isPresent();
    }
    
    public long contarUsuarios() {
        return usuarioRepository.count();
    }
    
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }
    
    // NOVO MÉTODO: Atualizar foto de perfil
    public boolean atualizarFotoPerfil(Long usuarioId, String nomeArquivo) {
        try {
            Usuario usuario = buscarPorId(usuarioId);
            if (usuario != null) {
                // Deletar foto antiga se existir
                if (usuario.getFotoPerfil() != null && !usuario.getFotoPerfil().isEmpty()) {
                    fileStorageService.deleteFile(usuario.getFotoPerfil());
                }
                
                usuario.setFotoPerfil(nomeArquivo);
                usuarioRepository.save(usuario);
                return true;
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }
}