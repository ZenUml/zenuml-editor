import { defineConfig, Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'

const genStub: Plugin = {
  name: 'gen-stub',
  apply: 'build',
  generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: 'embed-container-demo.html',
      source: `<iframe src="dist/embed.html" width="100%" height="100%"></iframe>`
    })
  }
}

export default defineConfig({
  plugins: [vue(), genStub],
  build: {
    rollupOptions: {
      input: {
        app: './embed.html',
      }
    },
    minify: true
  }
})
