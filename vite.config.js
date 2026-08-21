import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  return {
    base: command === 'serve' ? '/' : '/cek-biodata/',
    plugins: [
      react(),
      tailwindcss()
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './vitest.setup.js',
    }
  }
})
