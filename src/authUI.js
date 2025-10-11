import authService from './auth.js';

const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const closeLogin = document.getElementById('close-login');
const closeRegister = document.getElementById('close-register');
const loginError = document.getElementById('login-error');
const registerError = document.getElementById('register-error');

function showLoginModal() {
  loginModal.classList.remove('hidden');
  loginError.classList.add('hidden');
  document.getElementById('login-username').focus();
}

function hideLoginModal() {
  loginModal.classList.add('hidden');
  loginForm.reset();
}

function showRegisterModal() {
  registerModal.classList.remove('hidden');
  registerError.classList.add('hidden');
  document.getElementById('register-username').focus();
}

function hideRegisterModal() {
  registerModal.classList.add('hidden');
  registerForm.reset();
}

function showSuccessMessage(message) {
  // Create a temporary success message
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

export function initAuthUI() {
  // Set up event listeners
  document.getElementById('login-btn').addEventListener('click', showLoginModal);
  document.getElementById('register-btn').addEventListener('click', showRegisterModal);
  document.getElementById('logout-btn').addEventListener('click', handleLogout);

  closeLogin.addEventListener('click', hideLoginModal);
  closeRegister.addEventListener('click', hideRegisterModal);

  loginForm.addEventListener('submit', handleLogin);
  registerForm.addEventListener('submit', handleRegister);

  // Initialize UI state
  authService.updateUI();
}

// Auto-login if token exists
export function tryAutoLogin() {
  if (authService.isAuthenticated()) {
    authService.updateUI();
  }
}
