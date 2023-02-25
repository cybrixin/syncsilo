import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: [
      { find: '@', replacement: path.join(path.resolve(__dirname, 'src')) },
      {
        find: '~bootstrap', replacement: path.join(path.resolve(__dirname, 'node_modules/bootstrap'))
      },
    ],
  },
  build: {
    outDir: "build"
  },
  envPrefix: "PUBLIC_"
})
