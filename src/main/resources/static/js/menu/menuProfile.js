// menuProfile.js - Funções de edição de perfil
let modoEdicao = false;
let campoEditando = null;

function toggleEdicaoPerfil() {
    modoEdicao = !modoEdicao;
    const botoesEditar = document.querySelectorAll('.edit-icon');
    const iconesAvatarSidebar = document.querySelectorAll('.edit-avatar-icon');
    const iconesAvatarPerfil = document.querySelectorAll('.edit-profile-avatar-icon');
    const textoBotao = document.getElementById('textoBotaoEditar');
    
    if (modoEdicao) {
        botoesEditar.forEach(icon => icon.style.display = 'inline-block');
        iconesAvatarSidebar.forEach(icon => icon.style.display = 'block');
        iconesAvatarPerfil.forEach(icon => icon.style.display = 'block');
        textoBotao.textContent = 'Cancelar Edição';
    } else {
        botoesEditar.forEach(icon => icon.style.display = 'none');
        iconesAvatarSidebar.forEach(icon => icon.style.display = 'none');
        iconesAvatarPerfil.forEach(icon => icon.style.display = 'none');
        textoBotao.textContent = 'Editar Perfil';
        
        if (campoEditando) {
            cancelarEdicao(campoEditando);
        }
    }
}

function editarCampo(campo) {
    if (campoEditando && campoEditando !== campo) {
        cancelarEdicao(campoEditando);
    }
    
    campoEditando = campo;
    const display = document.getElementById(campo + 'Display');
    const input = document.getElementById(campo + 'Input');
    const icon = event.currentTarget;
    const infoValue = icon.parentNode;
    
    display.style.display = 'none';
    input.style.display = 'block';
    input.focus();
    
    let acoes = infoValue.querySelector('.edit-actions');
    if (!acoes) {
        acoes = document.createElement('div');
        acoes.className = 'edit-actions';
        acoes.innerHTML = `
            <button type="button" class="btn-confirm" onclick="salvarCampo('${campo}')">
                <i class="fas fa-check"></i> <span data-i18n="save">Salvar</span>
            </button>
            <button type="button" class="btn-cancel" onclick="cancelarEdicao('${campo}')">
                <i class="fas fa-times"></i> <span data-i18n="cancel">Cancelar</span>
            </button>
        `;
        infoValue.appendChild(acoes);
        // Re-aplicar traduções aos novos botões
        applyTranslations(localStorage.getItem('preferredLanguage') || 'pt-BR');
    }
    
    icon.style.display = 'none';
}

function cancelarEdicao(campo) {
    const display = document.getElementById(campo + 'Display');
    const input = document.getElementById(campo + 'Input');
    const icon = document.querySelector(`.edit-icon[onclick="editarCampo('${campo}')"]`);
    const infoValue = input.parentNode;
    const acoes = infoValue.querySelector('.edit-actions');
    
    display.style.display = 'inline';
    input.style.display = 'none';
    if (icon) icon.style.display = 'inline-block';
    if (acoes) acoes.remove();
    
    campoEditando = null;
}

function salvarCampo(campo) {
    const input = document.getElementById(campo + 'Input');
    const display = document.getElementById(campo + 'Display');
    const valor = input.value.trim();
    
    if (!valor) {
        alert('Este campo não pode ficar vazio!');
        input.focus();
        return;
    }
    
    input.classList.add('loading');
    
    fetch('/perfil/atualizar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `campo=${campo}&valor=${encodeURIComponent(valor)}`
    })
    .then(response => response.json())
    .then(data => {
        input.classList.remove('loading');
        
        if (data.success) {
            display.textContent = data.novoValor || valor;
            
            if (campo === 'nome') {
                document.querySelector('.user-name').textContent = data.novoValor || valor;
            }
            
            cancelarEdicao(campo);
            mostrarMensagem(data.message || 'Perfil atualizado com sucesso!', 'success');
        } else {
            alert('Erro: ' + data.message);
            input.focus();
        }
    })
    .catch(error => {
        input.classList.remove('loading');
        alert('Erro ao atualizar perfil: ' + error.message);
        console.error('Erro:', error);
    });
}

function mostrarMensagem(mensagem, tipo) {
    const mensagemAnterior = document.querySelector('.edit-message');
    if (mensagemAnterior) {
        mensagemAnterior.remove();
    }
    
    const mensagemDiv = document.createElement('div');
    mensagemDiv.className = `edit-message edit-${tipo}`;
    mensagemDiv.textContent = mensagem;
    
    document.querySelector('.profile-container').appendChild(mensagemDiv);
    
    setTimeout(() => {
        mensagemDiv.remove();
    }, 5000);
}

function alterarSenha() {
    alert('Funcionalidade de alterar senha em desenvolvimento...');
}

function alterarFoto() {
    iniciarUploadFoto();
}

function initializeProfile() {
    // Inicialização específica do perfil, se necessário
}