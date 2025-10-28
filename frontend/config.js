class Config {
  constructor() {
    this.isDevelopment =
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    this.API_BASE_URL = this.isDevelopment ? 'http://localhost:8080/api' : '/api';
    this.ENABLE_AUTH = false;

    // Game constants
    this.GRID_SIZE = 20; // pixels per grid cell
    this.INIT_MOVE_INTERVAL = 200; // ms per move at start
    this.MIN_MOVE_INTERVAL = 50; // fastest speed
  }
}

const config = new Config();
export default config;
export const { GRID_SIZE, INIT_MOVE_INTERVAL, MIN_MOVE_INTERVAL, API_BASE_URL } = config;
