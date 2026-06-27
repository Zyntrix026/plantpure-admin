import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5100', // Aapke backend ka exact port yahan set ho gaya hai
        changeOrigin: true,
        secure: false,
      },
    },
  },
})