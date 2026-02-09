/**
 * 网络状态检测 Hook
 * 监听浏览器的在线/离线状态变化
 */

import { useState, useEffect } from 'react';

/**
 * 获取当前网络状态
 * @returns 是否在线
 */
export function useNetworkStatus(): boolean {
  const [isOnline, setIsOnline] = useState(() => {
    // 初始化时检查 navigator.onLine
    if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
      return navigator.onLine;
    }
    // 如果浏览器不支持，默认认为在线
    return true;
  });

  useEffect(() => {
    // 监听在线事件
    const handleOnline = () => {
      setIsOnline(true);
    };

    // 监听离线事件
    const handleOffline = () => {
      setIsOnline(false);
    };

    // 注册事件监听器
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 清理函数：移除事件监听器
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
