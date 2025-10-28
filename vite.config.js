// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5174,
    proxy: {
      '/api': 'http://localhost:8080', // forwards API requests to Spring Boot
    },
  },
});