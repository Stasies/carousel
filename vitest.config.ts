import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    dir: './tests/unit',
    environment: 'happy-dom', // Simulates a browser
    globals: true,
  },
});