/**
 * 错误日志工具
 * 用于记录、格式化和上报错误信息
 */

import type { ErrorInfo } from '@/types';

/**
 * 错误日志存储键名
 */
const ERROR_LOG_KEY = 'app_error_logs';
const MAX_LOG_COUNT = 500; // 最多保存 50 条错误日志

/**
 * 格式化错误信息
 * @param error - 错误对象
 * @param errorInfo - React 错误信息（可选，用于 React 错误边界）
 * @returns 格式化后的错误信息对象
 */
export function formatError(error: Error, errorInfo?: React.ErrorInfo): ErrorInfo {
  return {
    message: error.message || '未知错误',
    stack: error.stack ?? undefined,
    componentStack: errorInfo?.componentStack ?? undefined,
    timestamp: Date.now(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    errorType: 'unknown',
  };
}

/**
 * 记录错误到控制台（开发环境）
 * @param errorInfo - 错误信息对象
 */
export function logErrorToConsole(errorInfo: ErrorInfo): void {
  if (import.meta.env.DEV) {
    console.group('🚨 错误信息');
    console.error('错误消息:', errorInfo.message);
    if (errorInfo.stack) {
      console.error('错误堆栈:', errorInfo.stack);
    }
    if (errorInfo.componentStack) {
      console.error('组件堆栈:', errorInfo.componentStack);
    }
    console.error('发生时间:', new Date(errorInfo.timestamp).toLocaleString());
    console.error('页面 URL:', errorInfo.url);
    console.groupEnd();
  }
}

/**
 * 保存错误到本地存储
 * @param errorInfo - 错误信息对象
 * @remarks 最多保存 MAX_LOG_COUNT 条错误日志，超出部分会被删除
 */
export function saveErrorToLocal(errorInfo: ErrorInfo): void {
  try {
    const existingLogs = getErrorsFromLocal();
    const newLogs = [errorInfo, ...existingLogs].slice(0, MAX_LOG_COUNT);
    localStorage.setItem(ERROR_LOG_KEY, JSON.stringify(newLogs));
  } catch (error) {
    // 如果存储失败，只记录到控制台
    console.warn('无法保存错误日志到本地存储:', error);
  }
}

/**
 * 从本地存储获取错误日志
 * @returns 错误日志数组，如果获取失败或不存在则返回空数组
 */
export function getErrorsFromLocal(): ErrorInfo[] {
  try {
    const logs = localStorage.getItem(ERROR_LOG_KEY);
    return logs ? JSON.parse(logs) : [];
  } catch {
    return [];
  }
}

/**
 * 清空本地错误日志
 */
export function clearErrorLogs(): void {
  try {
    localStorage.removeItem(ERROR_LOG_KEY);
  } catch (error) {
    console.warn('无法清空错误日志:', error);
  }
}

/**
 * 上报错误到服务器（预留接口，可扩展）
 * @param errorInfo - 错误信息对象
 * @remarks 目前仅在开发环境记录到控制台，可扩展为实际上报到错误监控服务
 */
export async function reportError(errorInfo: ErrorInfo): Promise<void> {
  // 这里可以扩展为实际上报到错误监控服务（如 Sentry）
  // 目前只记录到控制台和本地存储
  if (import.meta.env.DEV) {
    console.log('错误上报（开发环境）:', errorInfo);
  }

  // 示例：可以在这里添加实际上报逻辑
  // try {
  //   await fetch('/api/errors', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(errorInfo),
  //   });
  // } catch (error) {
  //   console.error('错误上报失败:', error);
  // }
}

/**
 * 处理错误的主函数
 * 统一处理错误的格式化、记录和上报
 * @param error - 错误对象
 * @param errorInfo - React 错误信息（可选）
 * @param errorType - 错误类型，默认为 'unknown'
 * @remarks 会依次执行：格式化错误、记录到控制台、保存到本地存储、上报错误
 */
export async function handleError(
  error: Error,
  errorInfo?: React.ErrorInfo,
  errorType: ErrorInfo['errorType'] = 'unknown'
): Promise<void> {
  const formattedError = formatError(error, errorInfo);
  formattedError.errorType = errorType;

  // 记录到控制台
  logErrorToConsole(formattedError);

  // 保存到本地存储
  saveErrorToLocal(formattedError);

  // 上报错误（可选）
  await reportError(formattedError);
}
