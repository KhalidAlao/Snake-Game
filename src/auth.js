// src/auth.js
// Central auth helper used by the UI and API calls.
// Stores JWT in localStorage under TOKEN_KEY and exposes helpers
// to login/register/logout and to produce Authorization headers.

import { API_BASE_URL } from './config.js';

const TOKEN_KEY = 'jwt_token';

function parseJwt(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch (e) {
    return null;
  }
}

const authService = {
  // Save token after login/register
  setToken(token) {
    if (!token) return;
    localStorage.setItem(TOKEN_KEY, token);
    this.updateUI();
  },

  // Get token from storage
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Parse username claim from JWT (subject)
  getUsername() {
    const token = this.getToken();
    if (!token) return null;
    const payload = parseJwt(token);
    if (!payload || (!payload.sub && !payload.subject)) {
      // libraries differ — subject is standard "sub"
      return payload?.sub || payload?.username || null;
    }
    return payload.sub || null;
  },

  // Check if user is logged in (basic expiry check)
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = parseJwt(token);
      if (!payload) return false;
      // some JWT libraries use 'exp' (seconds), ensure ms compare
      const { exp } = payload;
      if (!exp) return true; // if token has no exp, assume valid (rare)
      const expMs = exp * (exp < 1e12 ? 1000 : 1); // seconds -> ms if needed
      return expMs > Date.now();
    } catch (err) {
      return false;
    }
  },

  // Return Authorization header for fetch
  getAuthHeader() {
    const token = this.getToken();
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  },

  // Remove token on logout
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    this.updateUI();
  },

  // Perform login against backend (returns resolved token+username)
  async login(username, password) {
    if (!username || !password) {
      throw new Error('Username and password required');
    }

    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      let errMsg = `Login failed (${res.status})`;

      const json = await res.json();
      errMsg = json.error || json.message || errMsg;

      throw new Error(errMsg);
    }

    const json = await res.json();
    if (json.token) {
      this.setToken(json.token);
      this.updateUI();
      return json;
    }
    throw new Error('Login response missing token');
  },

  // Perform registration against backend (register + auto-store token)
  async register(username, password) {
    if (!username || !password) {
      throw new Error('Username and password required');
    }

    const res = await fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      let errMsg = `Registration failed (${res.status})`;

      const json = await res.json();
      errMsg = json.error || json.message || errMsg;

      throw new Error(errMsg);
    }

    const json = await res.json();
    if (json.token) {
      this.setToken(json.token);
      this.updateUI();
      return json;
    }
    throw new Error('Register response missing token');
  },

  // Update UI elements in header according to auth state
  updateUI() {
    const loggedIn = this.isAuthenticated();
    const authSection = document.getElementById('auth-section');
    const userSection = document.getElementById('user-section');
    const usernameDisplay = document.getElementById('username-display');

    if (authSection) {
      if (loggedIn) authSection.classList.add('hidden');
      else authSection.classList.remove('hidden');
    }

    if (userSection) {
      if (loggedIn) userSection.classList.remove('hidden');
      else userSection.classList.add('hidden');
    }

    if (usernameDisplay) {
      usernameDisplay.textContent = loggedIn ? this.getUsername() || '' : '';
    }
  },
};

export default authService;
