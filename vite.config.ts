import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    // Mock 插件配置（已禁用，各页面 Mock 通过注释控制）
    // viteMockServe({
    //   enable: false,
    //   mockPath: 'src/mock',
    //   logger: true,
    // }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2022',
    sourcemap: false,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          const isReact = /node_modules[/\\]react-dom[/\\]/.test(id) ||
            /node_modules[/\\]react-router-dom[/\\]/.test(id) ||
            (/node_modules[/\\]react[/\\]/.test(id) && !/node_modules[/\\]react-/.test(id))
          if (isReact) return 'vendor-react'
          if (id.includes('antd') || id.includes('@ant-design')) return 'vendor-antd'
          if (id.includes('@mdxeditor')) return undefined
          // 重要依赖按包名单独拆 chunk，便于缓存与排查体积
          if (id.includes('node_modules/ahooks/')) return 'vendor-ahooks'
          if (id.includes('node_modules/gsap/')) return 'vendor-gsap'
          if (id.includes('node_modules/dayjs/')) return 'vendor-dayjs'
          if (id.includes('node_modules/marked/')) return 'vendor-marked'
          if (id.includes('node_modules/mockjs/')) return 'vendor-mockjs'
          if (id.includes('node_modules/numeral/')) return 'vendor-numeral'
          if (id.includes('node_modules/turndown/')) return 'vendor-turndown'
          if (id.includes('node_modules/web-vitals/')) return 'vendor-web-vitals'
          if (id.includes('node_modules/zustand/')) return 'vendor-zustand'
          return 'vendor'
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash][extname]',
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/res': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/static': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
