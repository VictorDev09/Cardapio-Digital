document.addEventListener('DOMContentLoaded', function () {
    const themeToggleBtn = document.querySelector('.btn');
    const body = document.body;
    const savedTheme = localStorage.getItem('theme') || 'light';

    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
    }

    updateThemeIcon();

    themeToggleBtn.addEventListener('click', function () {
        body.classList.toggle('dark-theme');

        const theme = body.classList.contains('dark-theme') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);

        updateThemeIcon();
    });

    function updateThemeIcon() {
        const isDark = body.classList.contains('dark-theme');
        themeToggleBtn.innerHTML = isDark
            ? '<img src="./Imagens/sun.png" alt="Light Mode">'
            : '<img src="./Imagens/moon.png" alt="Dark Mode">';
    }
});