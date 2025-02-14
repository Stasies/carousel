/// <reference types="vitest" />

import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
    // environment: 'jsdom',
    environment: 'happy-dom',
  },
  build: {
    lib: {
      entry: 'src/carousel.js',  // or your entry point
      name: 'carousel',  // Global variable name for UMD or IIFE builds
      fileName: (format) => `carousel.${format}.js`
    },
  },
});