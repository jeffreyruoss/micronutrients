import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

process.env.BROWSER = 'Comet'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    open: true,
  },
})
