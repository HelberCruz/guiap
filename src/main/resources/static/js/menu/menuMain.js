// menuMain.js

function initializeLanguage() {
    // Aguarda o languageManager estar pronto
    if (!window.languageManager) {
        setTimeout(initializeLanguage, 100);
        return;
    }
    
    console.log('Idioma inicializado:', window.languageManager.getCurrentLanguage());
    
    // Configura eventos para os cards de idioma
    document.querySelectorAll('.language-card').forEach(card => {
        const lang = card.getAttribute('data-lang') || 
                    (card.textContent.includes('Português') ? 'pt-BR' :
                     card.textContent.includes('English') ? 'en' : 'es');
        card.setAttribute('data-lang', lang);
        
        // Remove listener antigo
        card.removeEventListener('click', card._langHandler);
        
        // Adiciona novo listener
        const handler = function() {
            window.changeLanguage(lang);
        };
        card._langHandler = handler;
        card.addEventListener('click', handler);
    });
}

// Torna disponível globalmente
window.initializeLanguage = initializeLanguage;

// Outras funções de inicialização...
document.addEventListener('DOMContentLoaded', function() {
    // Inicializações
    initializeMenu();
    initializeTheme();
    initializeLanguage();  // Agora a função existe
    initializeFAQ();
    initializeProfile();
    setupInitialNavigation();
});