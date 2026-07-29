import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/'))
            return 'react-vendor'
          if (id.includes('node_modules/framer-motion'))  return 'motion-vendor'
          if (id.includes('node_modules/@tanstack'))      return 'query-vendor'
          if (id.includes('react-icons/fa'))              return 'icons-fa'
          if (id.includes('react-icons/si'))              return 'icons-si'
          if (id.includes('react-icons/hi'))              return 'icons-hi'
        },
      },
    },
    sourcemap: false,
    assetsInlineLimit: 4096,
    target: 'es2020',
  },
})
