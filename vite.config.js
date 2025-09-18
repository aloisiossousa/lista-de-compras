import { defineConfig } from 'vite';

export default defineConfig({
  // Configuração para desenvolvimento
  server: {
    port: 3000,
    open: true,
    host: true
  },
  
  // Configuração para build
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      input: {
        main: './index.html',
        login: './login.html'
      }
    }
  },
  
  // Configuração de plugins
  plugins: [],
  
  // Configuração de CSS
  css: {
    devSourcemap: true
  },
  
  // Configuração de otimização
  optimizeDeps: {
    include: []
  }
});
