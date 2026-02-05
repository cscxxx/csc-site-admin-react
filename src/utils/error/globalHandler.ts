/**
 * 全局错误处理器
 * 监听并处理未捕获的 JavaScript 错误和 Promise rejection
 */

import { handleError } from './logger';

/**
 * 初始化全局错误监听
 */
export function initGlobalErrorHandler(): void {
  // 监听未捕获的 JavaScript 错误
  window.addEventListener('error', (event) => {
    // 忽略资源加载错误（如图片、脚本等）
    if (event.target && (event.target as HTMLElement).tagName) {
      return;
    }

    const error = event.error || new Error(event.message || '未知错误');
    handleError(error, undefined, 'javascript');
  });

  // 监听未处理的 Promise rejection
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason instanceof Error 
      ? event.reason 
      : new Error(String(event.reason || 'Promise rejection'));
    
    handleError(error, undefined, 'promise');
    
    // 阻止默认的错误处理（可选）
    // event.preventDefault();
  });
}
