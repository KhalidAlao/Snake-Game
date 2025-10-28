export default function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  const label = document.getElementById('theme-label');

  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    if (label) label.textContent = t === 'dark' ? 'Dark Mode' : 'Light Mode';
    localStorage.setItem('snakeTheme', t);
  }

  if (!toggle) {
    // Nothing to wire up (safe no-op)
    const saved = localStorage.getItem('snakeTheme');
    if (saved) applyTheme(saved);
    return;
  }

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });

  // Load saved theme
  const saved = localStorage.getItem('snakeTheme');
  if (saved) applyTheme(saved);
}
