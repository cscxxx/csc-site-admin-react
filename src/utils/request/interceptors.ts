/**
 * 拦截器相关实现
 */

import type {
  RequestConfig,
  ResponseData,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
} from './types';

/**
 * 拦截器管理器
 * 用于管理请求拦截器、响应拦截器和错误拦截器
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
   */
  getAll(): T[] {
    return this.interceptors;
  }
}

/**
 * 拦截器集合接口
 */
export interface Interceptors {
  request: InterceptorManager<RequestInterceptor>;
  response: InterceptorManager<ResponseInterceptor>;
  error: InterceptorManager<ErrorInterceptor>;
}

/**
 * 执行请求拦截器
 * @param config 请求配置
 * @param interceptors 拦截器管理器集合
 * @returns 处理后的配置
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
 * @param response 响应数据
 * @param interceptors 拦截器管理器集合
 * @returns 处理后的响应数据
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
 * @param error 错误对象
 * @param interceptors 拦截器管理器集合
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
