import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: Number(process.env.SERVICE_PORT || 80),
    host: '0.0.0.0',
    allowedHosts: ["localhost"],
    proxy: {
      '/api': {
        target: process.env.SERVICE_PROXY_TARGET,
        changeOrigin: true
      },
    },
  }
})
