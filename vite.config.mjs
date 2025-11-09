import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import autoprefixer from 'autoprefixer'

export default defineConfig(() => {
    return {
      base: './',
    build: {
      outDir: 'build',
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer({}), // add options if needed
        ],
      },
    },
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
      exclude: [],
    },
    optimizeDeps: {
      force: true,
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        // root-style aliases (no @ prefix)
        'src': path.resolve(__dirname, './src'),
        'components': path.resolve(__dirname, './src/components'),
        'views': path.resolve(__dirname, './src/views'),
        'layout': path.resolve(__dirname, './src/layout'),
        'features': path.resolve(__dirname, './src/features'),
        'common': path.resolve(__dirname, './src/common'),
        'core': path.resolve(__dirname, './src/core'),
        'assets': path.resolve(__dirname, './src/assets'),
        // keep @ aliases for backward-compatibility
        '@': path.resolve(__dirname, './src'),
        '@features': path.resolve(__dirname, './src/features'),
        '@common': path.resolve(__dirname, './src/common'),
        '@core': path.resolve(__dirname, './src/core'),
        '@layout': path.resolve(__dirname, './src/layout'),
        '@assets': path.resolve(__dirname, './src/assets')
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss'],
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://192.168.1.78:7000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
        },
      },
    },
  }
})
