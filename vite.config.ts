import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    cors: true,
    open: false
  },
  preview: {
    host: true,
    port: 4173,
    strictPort: false,
    cors: true
  }
})
