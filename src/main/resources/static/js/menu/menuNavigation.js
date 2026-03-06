// menuNavigation.js - Navegação entre seções
function showSection(section) {
    // Esconder todas as seções
    document.querySelectorAll('.content-area').forEach(sec => {
        sec.classList.remove('active');
    });
    
    // Mostrar a seção selecionada
    const targetSection = document.getElementById(section);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Atualizar URL sem recarregar a página
    const url = new URL(window.location);
    url.searchParams.set('section', section);
    window.history.replaceState({}, '', url);
    
    // Atualizar menu ativo
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const activeItem = document.querySelector(`.menu-item[onclick="showSection('${section}')"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        window.location.href = '/logout';
    }
}

function setupInitialNavigation() {
    // Verificar se há uma seção específica na URL
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');
    
    if (section) {
        showSection(section);
    }
}