import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { vitePrerenderPlugin } from 'vite-prerender-plugin'

export default defineConfig({
  build: {
    sourcemap: false,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'SOURCEMAP_BROKEN') {
          return;
        }
        warn(warning);
      },
    },
  },
  plugins: [react(), tailwindcss(), vitePrerenderPlugin({ renderTarget: '#root' })],
})
