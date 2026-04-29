import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Toda petición que empiece por /api se redirige al backend
      // El navegador cree que habla con localhost:5173 → sin CORS
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})