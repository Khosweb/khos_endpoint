import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: false,
  server: {
    host: true,
    port: 5176,
    proxy: {
      '/api/': {
        target: 'http://127.0.0.1:3005',
        changeOrigin: true,
      },
      '/api.js': { target: 'http://127.0.0.1:3005', changeOrigin: true },
      '/app.js': { target: 'http://127.0.0.1:3005', changeOrigin: true },
      '/ui.js': { target: 'http://127.0.0.1:3005', changeOrigin: true },
      '/utils.js': { target: 'http://127.0.0.1:3005', changeOrigin: true },
      // style.css is served directly by Vite (no proxy needed)
    },
  },
});
