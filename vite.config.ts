import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/viktors-liv/',
  build: {
    rollupOptions: {
      input: {
        website: 'index.html',
        app: 'app.html',
      },
    },
  },
});
