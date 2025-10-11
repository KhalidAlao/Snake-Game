import config from './config.js';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('authToken');
    this.username = localStorage.getItem('username');
    this.apiBaseUrl = config.API_BASE_URL; // Store config in instance
  }

  async login(username, password) {
    const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }

    const data = await response.json();
    this.setAuth(data.token, data.username);
    return data;
  }

  async register(username, password) {
    const response = await fetch(`${this.apiBaseUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Registration failed');
    }

    const data = await response.json();
    // You could also set auth here if you want auto-login after registration
    // this.setAuth(data.token, data.username);
    return data;
  }

  setAuth(token, username) {
    this.token = token;
    this.username = username;
    localStorage.setItem('authToken', token);
    localStorage.setItem('username', username);
  }

  logout() {
    this.token = null;
    this.username = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    this.updateUI();
  }

  isAuthenticated() {
    return !!this.token;
  }

  getAuthHeader() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  updateUI() {
    const authSection = document.getElementById('auth-section');
    const userSection = document.getElementById('user-section');
    const usernameSpan = document.getElementById('username-display');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');

    if (this.isAuthenticated()) {
      if (authSection) authSection.classList.add('hidden');
      if (userSection) userSection.classList.remove('hidden');
      if (usernameSpan) usernameSpan.textContent = this.username;
      if (loginBtn) loginBtn.classList.add('hidden');
      if (registerBtn) registerBtn.classList.add('hidden');
      if (logoutBtn) logoutBtn.classList.remove('hidden');
    } else {
      if (authSection) authSection.classList.remove('hidden');
      if (userSection) userSection.classList.add('hidden');
      if (loginBtn) loginBtn.classList.remove('hidden');
      if (registerBtn) registerBtn.classList.remove('hidden');
      if (logoutBtn) logoutBtn.classList.add('hidden');
    }
  }
}

export default new AuthService();
