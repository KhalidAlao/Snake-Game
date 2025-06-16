const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'dark';

htmlElement.setAttribute('data-theme', savedTheme);
updateThemeText();

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeText();
});

function updateThemeText() {
    const themeText = themeToggle.querySelector('span');
    const currentTheme = htmlElement.getAttribute('data-theme');
    themeText.textContent = currentTheme === 'dark' ? 'Dark Mode' : 'Light Mode';
}
