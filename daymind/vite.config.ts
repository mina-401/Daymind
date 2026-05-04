import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: '/Daymind/', 
  plugins: [
    tailwindcss(),
    reactRouter(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'Daymind',
        short_name: 'MyRoutine',
        description: 'AI 기반 스마트 일정 플래너',
        theme_color: '#a4a4c4',
        background_color: '#f7f4e9',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: '/icons/fi-rs-heart.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/fi-rs-heart.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],

});