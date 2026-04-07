import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
const rawHosts = process.env.VITE_ALLOWED_HOSTS || 'localhost';
const allowedHosts = rawHosts.split(',').map(h => h.trim());
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    allowedHosts,
  }
})
