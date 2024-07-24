import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import svgr from 'vite-plugin-svgr';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import inject from '@rollup/plugin-inject';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      svgr(),
      nodePolyfills({
        include: ['buffer'],
        globals: {
          Buffer: true,
        },
      }),
    ],
    resolve: {
      alias: {
        src: path.resolve(__dirname, 'src'),
      },
    },
    server: {
      port: 3000,
    },
    preview: {
      port: Number(env.PORT || 4431),
    },
    build: {
      outDir: './build',
      rollupOptions: {
        plugins: [inject({ Buffer: ['buffer/', 'Buffer'] }), nodePolyfills()],
      },
    },
  };
});
