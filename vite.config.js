import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Agar aap React 19 Compiler use kar rahe hain, to ye standard official tareeqa hai configuration ka
      babel: {
        plugins: [
          ['babel-plugin-react-compiler', {}],
        ],
      },
    }),
    tailwindcss()
  ],
  resolve: {
    alias: {
      // Node.js ka 'path' module use karna zaroori hai taaki OS-agnostic absolute paths ban sakein
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        // Optional: Agar backend par '/api' prefix nahi chahiye to rewrite use karein
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})