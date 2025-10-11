import authService from './auth.js';

let loginModal;
let registerModal;
let loginForm;
let registerForm;
let closeLogin;
let closeRegister;
let loginError;
let registerError;

function showLoginModal() {
  if (!loginModal || !loginError) return;
  loginModal.classList.remove('hidden');
  loginError.classList.add('hidden');
  const input = document.getElementById('login-username');
  if (input) input.focus();
}

function hideLoginModal() {
  if (!loginModal || !loginForm) return;
  loginModal.classList.add('hidden');
  loginForm.reset();
}

function showRegisterModal() {
  if (!registerModal || !registerError) return;
  registerModal.classList.remove('hidden');
  registerError.classList.add('hidden');
  const input = document.getElementById('register-username');
  if (input) input.focus();
}

function hideRegisterModal() {
  if (!registerModal || !registerForm) return;
  registerModal.classList.add('hidden');
  registerForm.reset();
}

function showSuccessMessage(message) {
  const successMsg = document.createElement('div');
  successMsg.className = 'success-message';
  successMsg.textContent = message;
  successMsg.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    z-index: 1000;
  `;
  document.body.appendChild(successMsg);
  setTimeout(() => {
    document.body.removeChild(successMsg);
  }, 3000);
}

async function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  try {
    await authService.login(username, password);
    hideLoginModal();
    authService.updateUI();
    showSuccessMessage('Login successful!');
  } catch (error) {
    loginError.textContent = error.message;
    loginError.classList.remove('hidden');
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;
  try {
    await authService.register(username, password);
    hideRegisterModal();
    showSuccessMessage('Registration successful! Please login.');
  } catch (error) {
    registerError.textContent = error.message;
    registerError.classList.remove('hidden');
  }
}

function handleLogout() {
  authService.logout();
  showSuccessMessage('Logged out successfully!');
}

// Public init function - safe DOM access
export function initAuthUI() {
  loginModal = document.getElementById('loginModal');
  registerModal = document.getElementById('registerModal');
  loginForm = document.getElementById('login-form');
  registerForm = document.getElementById('register-form');
  closeLogin = document.getElementById('close-login');
  closeRegister = document.getElementById('close-register');
  loginError = document.getElementById('login-error');
  registerError = document.getElementById('register-error');

  // Wire UI
  document.getElementById('login-btn')?.addEventListener('click', showLoginModal);
  document.getElementById('register-btn')?.addEventListener('click', showRegisterModal);
  document.getElementById('logout-btn')?.addEventListener('click', handleLogout);

  if (closeLogin) closeLogin.addEventListener('click', hideLoginModal);
  if (closeRegister) closeRegister.addEventListener('click', hideRegisterModal);

  if (loginForm) loginForm.addEventListener('submit', handleLogin);
  if (registerForm) registerForm.addEventListener('submit', handleRegister);

  // Set initial UI state
  authService.updateUI();
}

export function tryAutoLogin() {
  if (authService.isAuthenticated()) {
    authService.updateUI();
  }
}
