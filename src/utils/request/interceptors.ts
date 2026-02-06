/**
 * 拦截器相关实现
 *
 * 提供请求拦截器、响应拦截器和错误拦截器的管理功能
 * 支持拦截器的添加、移除和执行
 *
 * @module utils/request/interceptors
 */

import type {
  RequestConfig,
  ResponseData,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
} from '@/types';

/**
 * 拦截器管理器
 *
 * 用于管理请求拦截器、响应拦截器和错误拦截器
 * 支持拦截器的添加、移除和批量获取
 *
 * @template T - 拦截器函数类型
 *
 * @example
 * ```typescript
 * const manager = new InterceptorManager<RequestInterceptor>();
 * const remove = manager.use((config) => {
 *   config.headers = { ...config.headers, Authorization: 'Bearer token' };
 *   return config;
 * });
 * // 移除拦截器
 * remove();
 * ```
 */
export class InterceptorManager<T> {
  private interceptors: T[] = [];

  /**
   * 添加拦截器
   * @param interceptor 拦截器函数
   * @returns 返回用于移除拦截器的函数
   */
  use(interceptor: T): () => void {
    this.interceptors.push(interceptor);
    const index = this.interceptors.length - 1;
    return () => {
      this.interceptors.splice(index, 1);
    };
  }

  /**
   * 移除所有拦截器
   */
  clear(): void {
    this.interceptors = [];
  }

  /**
   * 获取所有拦截器
   * @returns 拦截器数组的副本
   * @remarks 返回的是副本，修改返回值不会影响原始拦截器列表
   */
  getAll(): T[] {
    return this.interceptors;
  }
}

/**
 * 拦截器集合接口
 *
 * 包含三种类型的拦截器管理器：
 * - request: 请求拦截器（在发送请求前执行）
 * - response: 响应拦截器（在收到响应后执行）
 * - error: 错误拦截器（在请求失败时执行）
 */
export interface Interceptors {
  request: InterceptorManager<RequestInterceptor>;
  response: InterceptorManager<ResponseInterceptor>;
  error: InterceptorManager<ErrorInterceptor>;
}

/**
 * 执行请求拦截器
 *
 * 按顺序执行所有请求拦截器，每个拦截器可以修改请求配置
 *
 * @param config - 初始请求配置
 * @param interceptors - 拦截器管理器集合
 * @returns 经过所有拦截器处理后的最终配置
 * @remarks 拦截器按添加顺序执行，后添加的拦截器会接收到前一个拦截器处理后的配置
 */
export async function applyRequestInterceptors(
  config: RequestConfig,
  interceptors: Interceptors
): Promise<RequestConfig> {
  let finalConfig = { ...config };
  const requestInterceptors = interceptors.request.getAll();

  for (const interceptor of requestInterceptors) {
    finalConfig = await interceptor(finalConfig);
  }

  return finalConfig;
}

/**
 * 执行响应拦截器
 *
 * 按顺序执行所有响应拦截器，每个拦截器可以修改响应数据
 *
 * @param response - 原始响应数据
 * @param interceptors - 拦截器管理器集合
 * @returns 经过所有拦截器处理后的最终响应数据
 * @remarks 拦截器按添加顺序执行，后添加的拦截器会接收到前一个拦截器处理后的响应
 */
export async function applyResponseInterceptors<T>(
  response: ResponseData<T>,
  interceptors: Interceptors
): Promise<ResponseData<T>> {
  let finalResponse = response;
  const responseInterceptors = interceptors.response.getAll();

  for (const interceptor of responseInterceptors) {
    finalResponse = await interceptor(finalResponse);
  }

  return finalResponse;
}

/**
 * 执行错误拦截器
 *
 * 按顺序执行所有错误拦截器，用于统一处理请求错误
 *
 * @param error - 错误对象
 * @param interceptors - 拦截器管理器集合
 * @remarks
 * - 所有错误拦截器都会被执行，即使某个拦截器抛出异常
 * - 错误拦截器通常用于错误日志记录、错误上报等
 */
export async function applyErrorInterceptors(
  error: Error,
  interceptors: Interceptors
): Promise<void> {
  const errorInterceptors = interceptors.error.getAll();
  for (const interceptor of errorInterceptors) {
    await interceptor(error);
  }
}
