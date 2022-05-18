import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    eslintPlugin()
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "./src/scss/variables";
          @import "./src/scss/mixins";
        `
      }
    }
  },
})
