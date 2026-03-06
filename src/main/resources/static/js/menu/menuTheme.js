// menuTheme.js - Controle de tema claro/escuro
function toggleDarkMode() {
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle i');
    
    body.classList.toggle('dark-mode');
    
    // Alternar ícone
    if (body.classList.contains('dark-mode')) {
        themeToggle.classList.remove('fa-moon');
        themeToggle.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
        saveThemeToServer('dark');
    } else {
        themeToggle.classList.remove('fa-sun');
        themeToggle.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
        saveThemeToServer('light');
    }
}

function saveThemeToServer(theme) {
    fetch('/api/theme', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `theme=${theme}`
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) {
            console.error('Erro ao salvar tema:', data.message);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    });
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.querySelector('.theme-toggle i');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.classList.remove('fa-moon');
        themeToggle.classList.add('fa-sun');
    } else {
        themeToggle.classList.remove('fa-sun');
        themeToggle.classList.add('fa-moon');
    }
}