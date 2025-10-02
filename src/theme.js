const toggle = document.getElementById('theme-toggle');
const label = document.getElementById('theme-label');

if (toggle) {
  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    label.textContent = newTheme === 'dark' ? 'Dark Mode' : 'Light Mode';
    localStorage.setItem('snakeTheme', newTheme);
  });

  // Load saved theme
  const saved = localStorage.getItem('snakeTheme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
    label.textContent = saved === 'dark' ? 'Dark Mode' : 'Light Mode';
  }
}
