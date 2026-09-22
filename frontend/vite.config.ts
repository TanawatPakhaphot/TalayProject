import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // forward API calls to the backend so it works behind forwarded/proxied dev URLs (e.g. Codespaces)
      '/api': {
        target: 'http://localhost:5100',
        changeOrigin: true,
      },
    },
  },
})
