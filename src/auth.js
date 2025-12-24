import { API_BASE_URL } from './config.js';

const TOKEN_KEY = 'jwt_token';


function parseJwt(token) {
  if (!token || typeof token !== 'string') {
    console.warn('Invalid token provided to parseJwt');
    return null;
  }
  
  try {
    // Split the token and check it has 3 parts
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('JWT token does not have 3 parts');
      return null;
    }
    
    // JWT uses URL-safe base64
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
 
    const paddedBase64 = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
    
    // Decode base64
    const jsonPayload = decodeURIComponent(
      atob(paddedBase64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to parse JWT:', e);
    return null;
  }
}

const authService = {
  setToken(token) {
    if (!token) {
      console.warn('Attempting to set null/empty token');
      return;
    }
    
    console.log('Setting token, length:', token.length);
    localStorage.setItem(TOKEN_KEY, token);
    this.updateUI();
  },

  getToken() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return null;
    }
    
    // Quick sanity check - most JWT tokens are longer than 50 chars
    if (token.length < 50) {
      console.warn('Token seems too short, possibly invalid');
      this.clearInvalidToken();
      return null;
    }
    
    return token;
  },

  clearInvalidToken() {
    console.log('Clearing invalid token from storage');
    localStorage.removeItem(TOKEN_KEY);
  },

  getUsername() {
    const token = this.getToken();
    if (!token) return null;
    
    const payload = parseJwt(token);
    return payload?.sub || payload?.username || null;
  },

  isAuthenticated() {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    
    const payload = parseJwt(token);
    if (!payload) {
      this.clearInvalidToken();
      return false;
    }
    
    // Check expiration (JWT exp is in seconds)
    if (payload.exp) {
      const now = Math.floor(Date.now() / 1000);
      const isValid = payload.exp > now;
      
      if (!isValid) {
        console.log('Token expired, clearing');
        this.clearInvalidToken();
      }
      
      return isValid;
    }
    
    // No expiration claim, assume valid
    return true;
  },

  logout() {
    console.log('Logging out, clearing token');
    localStorage.removeItem(TOKEN_KEY);
    this.updateUI();
  },

  async login(username, password) {
    if (!username || !password) {
      throw new Error('Username and password required');
    }

    try {
      console.log('Attempting login for:', username);
      
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || data.error || `Login failed (${res.status})`);
      }

      if (data.token) {
        this.setToken(data.token);
        this.updateUI();
        return data;
      }
      throw new Error('Login response missing token');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(username, password) {
    if (!username || !password) {
      throw new Error('Username and password required');
    }

    try {
      console.log('Attempting registration for:', username);
      
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || data.error || `Registration failed (${res.status})`);
      }

      if (data.token) {
        this.setToken(data.token);
        this.updateUI();
        return data;
      }
      throw new Error('Register response missing token');
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  updateUI() {
    const loggedIn = this.isAuthenticated();
    console.log('Updating UI, logged in:', loggedIn);
    
    const authSection = document.getElementById('auth-section');
    const userSection = document.getElementById('user-section');
    const usernameDisplay = document.getElementById('username-display');

    if (authSection) {
      authSection.classList.toggle('hidden', loggedIn);
    }

    if (userSection) {
      userSection.classList.toggle('hidden', !loggedIn);
    }

    if (usernameDisplay) {
      const username = this.getUsername();
      usernameDisplay.textContent = loggedIn ? username || '' : '';
    }
  },
};

// Clear any invalid tokens on module load
if (authService.getToken() && !authService.isAuthenticated()) {
  authService.clearInvalidToken();
}

export default authService;