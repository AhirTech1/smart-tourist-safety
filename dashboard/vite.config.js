import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({
    // Add babel options to help with development
    babel: {
      plugins: []
    }
  })],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 3000,
    host: true,
    hmr: {
      overlay: false // Disable overlay that might cause refreshes
    }
  },
  preview: {
    port: 3000,
    host: true,
  },
  // Add esbuild options to handle potential issues
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
})