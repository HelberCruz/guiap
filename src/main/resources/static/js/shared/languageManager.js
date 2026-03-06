// languageManager.js - COM FALLBACK

class LanguageManager {
    constructor() {
        // Verifica se translations existe
        if (typeof translations === 'undefined') {
            console.warn('translations não carregada ainda. Usando fallback.');
            this.setupFallbackTranslations();
        }
        
        this.currentLanguage = this.getSavedLanguage();
        this.init();
    }

    init() {
        // Aguarda um pouco para garantir que tudo está carregado
        setTimeout(() => {
            this.applyLanguage(this.currentLanguage);
            document.documentElement.lang = this.currentLanguage;
        }, 100);
    }

    getSavedLanguage() {
        return localStorage.getItem('preferredLanguage') || 'pt-BR';
    }

    saveLanguage(lang) {
        localStorage.setItem('preferredLanguage', lang);
        this.currentLanguage = lang;
        document.documentElement.lang = lang;
    }

    applyLanguage(lang) {
        // Verifica se translations está disponível
        if (typeof translations === 'undefined') {
            console.error('translations não disponível. Tentando novamente...');
            setTimeout(() => this.applyLanguage(lang), 200);
            return;
        }
        
        const translation = translations[lang];
        if (!translation) {
            console.error(`Tradução para ${lang} não encontrada`);
            return;
        }

        // Atualizar todos os elementos com data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translation[key]) {
                element.textContent = translation[key];
            }
        });

        // Atualizar placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (translation[key]) {
                element.placeholder = translation[key];
            }
        });

        // Atualizar títulos
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            if (translation[key]) {
                element.title = translation[key];
            }
        });

        // Disparar evento personalizado
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: lang, translation: translation }
        }));
    }

    setupFallbackTranslations() {
        // Fallback básico enquanto não carrega o translations.js completo
        window.translations = window.translations || {
            'pt-BR': {
                'save': 'Salvar',
                'cancel': 'Cancelar',
                'edit': 'Editar',
                'timeline': 'Linha do tempo',
                'saved': 'Salvos',
                'profile': 'Perfil',
                'language': 'Idioma',
                'logout': 'Sair'
            },
            'en': {
                'save': 'Save',
                'cancel': 'Cancel',
                'edit': 'Edit',
                'timeline': 'Timeline',
                'saved': 'Saved',
                'profile': 'Profile',
                'language': 'Language',
                'logout': 'Logout'
            },
            'es': {
                'save': 'Guardar',
                'cancel': 'Cancelar',
                'edit': 'Editar',
                'timeline': 'Línea de tiempo',
                'saved': 'Guardados',
                'profile': 'Perfil',
                'language': 'Idioma',
                'logout': 'Salir'
            }
        };
    }

    changeLanguage(lang) {
        this.saveLanguage(lang);
        this.applyLanguage(lang);
        
        // Salvar no servidor (opcional)
        this.saveLanguageToServer(lang);
    }

    async saveLanguageToServer(lang) {
        try {
            await fetch('/api/user/language', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ language: lang })
            });
        } catch (error) {
            console.error('Erro ao salvar idioma no servidor:', error);
        }
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    getTranslation(key) {
        if (!translations || !translations[this.currentLanguage]) {
            return key;
        }
        return translations[this.currentLanguage][key] || key;
    }
}

// Adiciona função global para compatibilidade com onclick
window.changeLanguage = function(lang) {
    if (window.languageManager) {
        window.languageManager.changeLanguage(lang);
    }
};

// Instância global - AGORA COM VERIFICAÇÃO
document.addEventListener('DOMContentLoaded', function() {
    if (!window.languageManager) {
        window.languageManager = new LanguageManager();
    }
});