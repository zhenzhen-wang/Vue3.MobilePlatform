import { fileURLToPath, URL } from 'url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// import Components from 'unplugin-vue-components/vite';
// import { VantResolver } from 'unplugin-vue-components/resolvers';

import styleImport, { VantResolve } from 'vite-plugin-style-import';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // Components({
    //   resolvers: [VantResolver()],
    // }),
    styleImport({
      resolves: [VantResolve()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    dedupe: ['vue'], // vue-sign报错后新增此解决
  },
  // 只负责dev模式下的代理解决跨域，生产环境需要通过nginx做代理转发
  server: {
    port: 8090, // 优先级低于package.json中设置的port
    proxy: {
      // 解决跨域
      '/api': {
        // 浏览器中看到的网址还是http://localhost:3000/api
        // 以此代理后端api地址，即可满足浏览器的同源策略
        target: 'http://localhost:5059/api/HrResume',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // 删除路径中的/api
      },
      // 往下写，可以配多个代理
    },
  },
});
