import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function suppressSourcemapWarning(): Plugin {
  return {
    name: 'suppress-sourcemap-warning',
    config() {
      return {
        build: {
          rollupOptions: {
            onwarn(warning, warn) {
              if (warning.code === 'SOURCEMAP_BROKEN') return;
              warn(warning);
            },
          },
        },
      };
    },
  };
}

export default defineConfig({
  build: {
    sourcemap: false,
  },
  plugins: [
    suppressSourcemapWarning(),
    react(),
    tailwindcss(),
  ],
})
