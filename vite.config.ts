import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup:"index.html",
        background: 'src/background.ts',
        content:'src/content-scripts/elementSelector1.ts',
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
  
})
