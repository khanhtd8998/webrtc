import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
// import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173
  },
  css: {
    devSourcemap: true
  },

  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src')
    }
  }
})
