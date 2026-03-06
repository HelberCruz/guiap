// Gerenciamento de modais
class ModalManager {
    static showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    static hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    static setupModalClose(modalId, closeSelector = '.close') {
        const modal = document.getElementById(modalId);
        if (modal) {
            const closeElements = modal.querySelectorAll(closeSelector);
            closeElements.forEach(element => {
                element.addEventListener('click', () => this.hideModal(modalId));
            });

            // Fechar ao clicar fora do conteúdo
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modalId);
                }
            });
        }
    }
}