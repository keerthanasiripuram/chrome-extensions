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
        options: 'options.html',
        contentScript: 'src/contentScript.ts', // Add this line
        notesContentScript: 'src/notesContentScript.ts', 
        optionsIndex: 'src/components/OptionsIndex.tsx',

      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
  
})
