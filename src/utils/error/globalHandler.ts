/**
 * 全局错误处理器
 *
 * 监听并处理未捕获的 JavaScript 错误和 Promise rejection
 * 在应用启动时调用，用于捕获全局错误并统一处理
 *
 * @module utils/error/globalHandler
 */

import { handleError } from './logger';

/**
 * 初始化全局错误监听器
 *
 * 注册以下全局错误监听器：
 * - `error` 事件：捕获未捕获的 JavaScript 错误
 * - `unhandledrejection` 事件：捕获未处理的 Promise rejection
 *
 * @remarks
 * - 会自动忽略资源加载错误（如图片、脚本等）
 * - 所有错误都会通过 `handleError` 统一处理
 * - 应在应用入口（main.tsx）中调用
 *
 * @example
 * ```typescript
 * // 在 main.tsx 中
 * import { initGlobalErrorHandler } from '@/utils/error/globalHandler';
 *
 * initGlobalErrorHandler();
 * ```
 */
export function initGlobalErrorHandler(): void {
  // 监听未捕获的 JavaScript 错误
  window.addEventListener('error', event => {
    // 忽略资源加载错误（如图片、脚本等）
    if (event.target && (event.target as HTMLElement).tagName) {
      return;
    }

    const error = event.error || new Error(event.message || '未知错误');
    handleError(error, undefined, 'javascript');
  });

  // 监听未处理的 Promise rejection
  window.addEventListener('unhandledrejection', event => {
    const error =
      event.reason instanceof Error
        ? event.reason
        : new Error(String(event.reason || 'Promise rejection'));

    handleError(error, undefined, 'promise');

    // 阻止默认的错误处理（可选）
    // event.preventDefault();
  });
}
