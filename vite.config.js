import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    origin: 'https://hospedaje.daemon-lab.duckdns.org',
    cors: true,
    hmr: {
      host: 'hospedaje.daemon-lab.duckdns.org',
      protocol: 'wss',
      clientPort: 443,
      path: 'vite-hmr',
    },
  },
});
