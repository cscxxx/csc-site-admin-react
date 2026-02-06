/**
 * 请求错误处理
 * 统一处理 HTTP 请求错误
 */

import { handleError } from '@/utils/error/logger';
import type { ResponseData } from '@/types';

/**
 * 处理 HTTP 响应错误
 */
export function handleHttpError(response: ResponseData): void {
  const { status, statusText } = response;

  // 根据状态码创建错误信息
  let errorMessage = `请求失败: ${statusText || '未知错误'}`;

  if (status >= 500) {
    errorMessage = '服务器错误，请稍后重试';
  } else if (status === 404) {
    errorMessage = '请求的资源不存在';
  } else if (status === 403) {
    errorMessage = '没有权限访问该资源';
  } else if (status === 401) {
    errorMessage = '未授权，请重新登录';
  } else if (status >= 400) {
    errorMessage = '请求参数错误';
  }

  const error = new Error(errorMessage);
  (error as Error & { status?: number }).status = status;

  handleError(error, undefined, 'network');
}

/**
 * 创建请求错误拦截器
 */
export function createRequestErrorInterceptor() {
  return async (error: Error) => {
    // 如果是网络错误，记录到错误日志
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      handleError(error, undefined, 'network');
    } else if (error.name !== 'AbortError') {
      // 忽略取消请求的错误，其他错误都记录
      handleError(error, undefined, 'network');
    }
  };
}
