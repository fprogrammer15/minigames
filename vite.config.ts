import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: mode === 'development',
    minify: mode === 'production',
  },
  server: {
    port: 3000,
    open: true,
  },
}));
