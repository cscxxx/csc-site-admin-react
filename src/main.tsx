import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import './config/dayjs'
import './config/gsap' // 初始化 GSAP 配置，注册插件
import './config/numeral' // 初始化 Numeral 配置，设置中文语言
import './index.css'
import App from './App.tsx'
import { themeConfig } from './config/theme'
import { initGlobalErrorHandler } from './utils/error/globalHandler'

// 初始化全局错误监听
initGlobalErrorHandler()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider locale={zhCN} theme={themeConfig}>
      <App />
    </ConfigProvider>
  </StrictMode>,
)
