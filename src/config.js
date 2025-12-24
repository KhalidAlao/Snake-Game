class Config {
  constructor() {
    this.isDevelopment =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '0.0.0.0' ||
      window.location.port === '5174' ||
      window.location.port === '3000';

    this.API_BASE_URL = this.getApiBaseUrl();
    this.ENABLE_AUTH = Config.getEnableAuth(); // Changed to static call

    this.GRID_SIZE = 20;
    this.INIT_MOVE_INTERVAL = 200;
    this.MIN_MOVE_INTERVAL = 50;
  }

  getApiBaseUrl() {
    if (
      typeof import.meta !== 'undefined' &&
      import.meta.env &&
      import.meta.env.VITE_API_BASE_URL
    ) {
      return import.meta.env.VITE_API_BASE_URL;
    }

    if (this.isDevelopment) {
      return 'http://localhost:8080/api';
    }

    return '/api';
  }

  static getEnableAuth() {
    // Made static
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ENABLE_AUTH) {
      return import.meta.env.VITE_ENABLE_AUTH === 'true';
    }
    return true; // Default to enabled
  }
}

const config = new Config();

export default config;
export const {
  GRID_SIZE,
  INIT_MOVE_INTERVAL,
  MIN_MOVE_INTERVAL,
  API_BASE_URL,
  ENABLE_AUTH,
  isDevelopment,
} = config;
