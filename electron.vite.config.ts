import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

const srcRoot = resolve(__dirname, 'src');
const outDir = resolve(__dirname, 'dist');

// https://vitejs.dev/config/
export default defineConfig({
  root: srcRoot,
  base: '',
  publicDir: resolve(srcRoot, 'public'),
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(srcRoot, 'main', 'index.ts'),
        preload: resolve(srcRoot, 'main', 'preload.ts'),
        index: resolve(srcRoot, 'renderer', 'index.html'),
      },
      output: {
        format: 'cjs',
        dir: outDir,
      },
    },
  },
  plugins: [react()],
});