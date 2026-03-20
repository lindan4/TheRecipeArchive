import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const base = process.env.NODE_ENV === 'production' ? '/juno_react_project/' : '/';

export default defineConfig({
  base,
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts'
  }
});
