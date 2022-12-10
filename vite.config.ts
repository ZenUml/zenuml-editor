import { defineConfig, Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'

const genStub: Plugin = {
  name: 'gen-stub',
  apply: 'build',
  generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: 'embed-container-demo.html',
      source: `<iframe src="embed.html" width="100%" height="100%"></iframe>`
    })
  }
}

const genCNAME: Plugin = {
  name: 'gen-stub',
  apply: 'build',
  generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: 'CNAME.txt',
      source: `embed-editor.zenuml.com`
    })
  }
}

export default defineConfig({
  plugins: [vue(), genStub, genCNAME],
  build: {
    rollupOptions: {
      input: {
        app: './embed.html',
        index: './index.html'
      }
    },
    minify: true
  }
})
