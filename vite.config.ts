import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// @ts-expect-error - vite-plugin-mock 类型定义可能不完整
import { viteMockServe } from 'vite-plugin-mock'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Mock 插件配置
    viteMockServe({
      // 只在开发环境启用
      enable: process.env.VITE_USE_MOCK === 'true' || process.env.NODE_ENV === 'development',
      // mock 文件位置
      mockPath: 'src/mock',
      // 是否在控制台显示请求日志
      logger: true,
    }),
  ],
})
