// menuUpload.js - Upload de foto de perfil
function iniciarUploadFoto() {
    document.getElementById('fotoPerfilInput').click();
}

function uploadFotoPerfil(file) {
    if (!file) return;
    
    // Validar tipo de arquivo
    if (!file.type.match('image.*')) {
        alert('Por favor, selecione apenas imagens');
        return;
    }
    
    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB');
        return;
    }
    
    // Mostrar preview e confirmar
    const reader = new FileReader();
    reader.onload = function(e) {
        if (confirm('Deseja usar esta imagem como foto de perfil?')) {
            enviarFotoParaServidor(file);
        }
    };
    reader.readAsDataURL(file);
}

function enviarFotoParaServidor(file) {
    const formData = new FormData();
    formData.append('foto', file);
    
    // Mostrar loading
    const avatarContainers = document.querySelectorAll('.avatar-container');
    avatarContainers.forEach(container => {
        container.classList.add('loading');
    });
    
    fetch('/perfil/upload-foto', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        avatarContainers.forEach(container => {
            container.classList.remove('loading');
        });
        
        if (data.success) {
            // Recarregar a página para atualizar a foto
            location.reload();
        } else {
            alert('Erro: ' + data.message);
        }
    })
    .catch(error => {
        avatarContainers.forEach(container => {
            container.classList.remove('loading');
        });
        alert('Erro ao fazer upload: ' + error.message);
        console.error('Erro:', error);
    });
}