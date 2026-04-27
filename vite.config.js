import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Nabd Clinic',
        short_name: 'Nabd',
        start_url: '/',
        display: 'standalone',
        theme_color: '#0f172a',
        background_color: '#ffffff',
        icons: [
          {
            src: '/logo-light.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logo-light.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})