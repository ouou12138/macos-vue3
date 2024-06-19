import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Unocss from 'unocss/vite'
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    Unocss(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      eslintrc: {
        enabled: true
      }
    }),
    dynamicImportVars({
      include: ['./src/components/**/*.vue']
    })
  ],
  assetsInclude: ['**/*.icns'],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
