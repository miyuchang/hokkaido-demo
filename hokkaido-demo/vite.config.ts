import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 如果你的倉庫網址是 https://miyuchang.github.io/hokkaido-demo/
  // 建議將 base 設定為 '/hokkaido-demo/'。
  // 目前使用 './' 是相對路徑，在大多數 GitHub Pages 設定下也能正常運作。
  base: './', 
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
});