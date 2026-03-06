// menuFAQ.js - Funcionalidades das FAQ
function toggleFaqCard(cardId) {
    const card = event.currentTarget.parentElement;
    const content = document.getElementById(cardId);
    
    // Fechar outros cards abertos
    document.querySelectorAll('.faq-card').forEach(otherCard => {
        if (otherCard !== card && otherCard.classList.contains('active')) {
            otherCard.classList.remove('active');
            const otherContent = otherCard.querySelector('.faq-card-content');
            if (otherContent) {
                otherContent.style.maxHeight = '0';
                otherContent.style.padding = '0';
            }
        }
    });
    
    // Alternar card atual
    card.classList.toggle('active');
    
    if (card.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.padding = '25px';
    } else {
        content.style.maxHeight = '0';
        content.style.padding = '0';
    }
}

function initializeFAQ() {
    // Fechar todos os cards FAQ ao carregar a página
    document.querySelectorAll('.faq-card-content').forEach(content => {
        content.style.maxHeight = '0';
        content.style.padding = '0';
    });
}