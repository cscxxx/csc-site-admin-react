import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';
import { appLocale } from './config/locale';
import './config/dayjs';
import './config/gsap'; // 初始化 GSAP 配置，注册插件
import './config/numeral'; // 初始化 Numeral 配置，设置中文语言
import './index.css';
import App from './App.tsx';
import { themeConfig } from './config/theme';
import { initGlobalErrorHandler } from './utils/error/globalHandler';
import { initWebVitals } from './utils/performance/vitals';
import { usePerformanceStore } from './store';

// 初始化全局错误监听
initGlobalErrorHandler();

// 初始化性能监控
initWebVitals(metrics => {
  usePerformanceStore.getState().updateMetrics(metrics);
  // 只在指标更新时刷新历史记录，避免频繁读取 localStorage
  // refreshHistory 会在需要时由组件主动调用
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider locale={appLocale} theme={themeConfig}>
      <App />
    </ConfigProvider>
  </StrictMode>
);
