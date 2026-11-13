import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// A relative base keeps the build portable across GitHub Pages project sites,
// custom domains, and local `vite preview`.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2022',
  },
});
