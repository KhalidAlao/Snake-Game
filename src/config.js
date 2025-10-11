// Environment-aware configuration
class Config {
  constructor() {
    this.isDevelopment =
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    this.API_BASE_URL = this.isDevelopment
      ? 'http://localhost:8080/api' // Development
      : '/api'; // Production (same origin)

    this.ENABLE_AUTH = false;
  }
}

const config = new Config();
export default config;
