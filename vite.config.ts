import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

// Author: Hamidreza Derhami
// Standalone Vercel deployment: public site (index.html) +
// authenticated admin panel (admin/index.html).

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },

    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          admin: path.resolve(__dirname, 'admin/index.html'),
        },
      },
    },

    server: {
      port: 3000,
      host: '0.0.0.0',
    },
  };
});
