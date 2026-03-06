// Gerenciador de temas
class ThemeManager {
    constructor() {
        this.currentTheme = null;
        this.cards = [];
    }

    init() {
        this.cards = document.querySelectorAll('.card[data-theme]');
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.cards.forEach(card => {
            card.addEventListener('click', () => {
                this.selectTheme(card);
            });
        });
    }

    selectTheme(card) {
        // Remover seleção anterior
        this.cards.forEach(c => c.classList.remove('selected'));
        
        // Adicionar seleção atual
        card.classList.add('selected');
        this.currentTheme = card.getAttribute('data-theme');
        
        // Disparar evento personalizado
        this.onThemeChange();
    }

    onThemeChange() {
        // Evento para notificar outros módulos
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: this.currentTheme }
        }));
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    reset() {
        this.currentTheme = null;
        this.cards.forEach(card => card.classList.remove('selected'));
    }
}