/// <reference types="vitest" />

import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/', // This reversible hosting option is mounted at the origin root.
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    host: '127.0.0.1',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          charts: ['gsap'],
        },
      },
    },
  },
  test: {
    include: ['src/**/*.spec.ts'],
    environment: 'jsdom',
  },
})