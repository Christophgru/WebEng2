import path from 'path';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';

const SRC_DIR = path.resolve(__dirname, './src');
const PUBLIC_DIR = path.resolve(__dirname, './public');
const BUILD_DIR = path.resolve(__dirname, './www');

export default async () => {

  return  {
    plugins: [
      react(),
      mkcert(),
    ],
    root: SRC_DIR,
    base: '',
    publicDir: PUBLIC_DIR,
    build: {
      outDir: BUILD_DIR,
      assetsInlineLimit: 0,
      emptyOutDir: true,
      rollupOptions: {
        treeshake: false,
      },
    },
    resolve: {
      alias: {
        '@': SRC_DIR,
      },
    },
    server: {
      host: true,
      https: true,
      proxy: {
        '/wikipedia': {
          target: 'http://localhost:3001', // Your proxy server address
          changeOrigin: true,
        },
      },
    },
  };
};
