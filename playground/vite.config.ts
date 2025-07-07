import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      // 使用本地UI库，ui组件修改实时变化，提高调试效率。
      '~/@DLib/ui': resolve(__dirname, '../packages/ui/src/index.ts'),
      '~': resolve(__dirname, '../packages/ui/src'),
    },
  },
  server: {
    port: 4444,
  },
  optimizeDeps: {
    include: ['vue'],
  },
});
