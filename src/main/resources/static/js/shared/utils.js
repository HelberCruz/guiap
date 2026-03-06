// Utilitários compartilhados
class Utils {
    static showLoading(message = 'Carregando...') {
        const modal = document.getElementById('loading-modal');
        if (modal) {
            modal.querySelector('p').textContent = message;
            modal.style.display = 'flex';
        }
    }

    static hideLoading() {
        const modal = document.getElementById('loading-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    static formatTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
    }

    static formatDistance(meters) {
        return meters < 1000 ? `${meters}m` : `${(meters / 1000).toFixed(1)}km`;
    }
}