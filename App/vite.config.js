import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5500',
        changeOrigin: true,
        secure: false,
        // Add timeout to prevent hanging requests
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
      '/api/health': {
        target: 'http://localhost:5500',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/health/, '/api/health'),
      }
    },
    // Increase timeout for development server
    hmr: {
      timeout: 5000,
    },
  },
  // Optimize build
  build: {
    // Generate source maps for better debugging
    sourcemap: true,
    // Split chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['styled-components', 'react-icons', 'swiper'],
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
  },
  // Optimize asset handling
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'styled-components'],
  },
})
