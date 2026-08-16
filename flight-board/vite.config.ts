import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Browser calls /api/* on the dev-server origin; Vite forwards to
      // flight-api server-side, so the browser never makes a cross-origin
      // request and CORS never comes into play.
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
