import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/expense-tracker/',
  server: {
    proxy: {
      '/api/ollama': {
        target: 'https://ollama.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/ollama/, '')
      }
    }
  }
})
