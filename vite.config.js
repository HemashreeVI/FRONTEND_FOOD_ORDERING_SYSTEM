import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages serves the site at /<repo-name>/ (case-sensitive)
export default defineConfig({
  base: '/FRONTEND_FOOD_ORDERING_SYSTEM/',
  plugins: [react()],
})
