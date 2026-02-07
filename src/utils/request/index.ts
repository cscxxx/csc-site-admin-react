/**
 * 基于原生 fetch 封装的请求工具
 * 支持拦截器、请求取消、超时控制等功能
 */

import type {
  RequestConfig,
  ResponseData,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
} from '@/types';

import {
  InterceptorManager,
  applyRequestInterceptors,
  applyResponseInterceptors,
  applyErrorInterceptors,
  type Interceptors,
} from './interceptors';

import { createRequestErrorInterceptor } from './errorHandler';

// 重新导出类型，方便外部使用
export type {
  RequestConfig,
  ResponseData,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
};

// 重新导出拦截器相关类
export { InterceptorManager } from './interceptors';

/**
 * 请求工具类
 */
class Request {
  /** 默认配置 */
  private defaultConfig: RequestConfig = {
    timeout: 10000,
    autoParseJSON: true,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  /** 请求拦截器管理器 */
  public interceptors: Interceptors = {
    request: new InterceptorManager<RequestInterceptor>(),
    response: new InterceptorManager<ResponseInterceptor>(),
    error: new InterceptorManager<ErrorInterceptor>(),
  };

  /**
   * 构造函数
   * @param config 默认配置
   */
  constructor(config?: RequestConfig) {
    if (config) {
      this.defaultConfig = { ...this.defaultConfig, ...config };
    }
  }

  /**
   * 构建完整的请求 URL
   * @param url 请求路径
   * @param baseURL 基础 URL
   * @param params 查询参数
   * @returns 完整的 URL
   */
  private buildURL(
    url: string,
    baseURL?: string,
    params?: Record<string, string | number | boolean | null | undefined>
  ): string {
    // 如果 URL 已经是完整路径，直接返回
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return this.appendParams(url, params);
    }

    // 拼接 baseURL
    const base = baseURL || this.defaultConfig.baseURL || '';
    const fullURL = base ? `${base.replace(/\/$/, '')}/${url.replace(/^\//, '')}` : url;

    return this.appendParams(fullURL, params);
  }

  /**
   * 追加查询参数到 URL
   * @param url 原始 URL
   * @param params 查询参数
   * @returns 带参数的 URL
   */
  private appendParams(
    url: string,
    params?: Record<string, string | number | boolean | null | undefined>
  ): string {
    if (!params || Object.keys(params).length === 0) {
      return url;
    }

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    if (!queryString) {
      return url;
    }

    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${queryString}`;
  }

  /**
   * 解析响应数据
   * @param response Fetch Response 对象
   * @param autoParseJSON 是否自动解析 JSON
   * @returns 解析后的数据
   */
  private async parseResponse<T>(response: Response, autoParseJSON?: boolean): Promise<T> {
    const contentType = response.headers.get('content-type') || '';
    const shouldParseJSON =
      autoParseJSON !== false &&
      (contentType.includes('application/json') || contentType.includes('text/json'));

    if (shouldParseJSON) {
      try {
        return await response.json();
      } catch {
        // 如果 JSON 解析失败，返回文本
        return (await response.text()) as T;
      }
    }

    // 处理其他类型
    if (contentType.includes('text/')) {
      return (await response.text()) as T;
    }

    if (
      contentType.includes('application/octet-stream') ||
      contentType.includes('application/pdf')
    ) {
      return (await response.blob()) as T;
    }

    return (await response.text()) as T;
  }

  /**
   * 核心请求方法
   * @param url 请求路径
   * @param config 请求配置
   * @returns 返回一个包含 promise 和 cancel 函数的对象
   */
  private request<T = unknown>(
    url: string,
    config: RequestConfig = {}
  ): { promise: Promise<ResponseData<T>>; cancel: () => void } {
    // 合并配置
    const mergedConfig: RequestConfig = {
      ...this.defaultConfig,
      ...config,
      headers: {
        ...this.defaultConfig.headers,
        ...config.headers,
      },
    };

    // 创建 AbortController 用于取消请求
    const controller = new AbortController();
    const signal = controller.signal;

    // timeoutId 需要在外部定义，以便 cancel 函数可以访问
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    // 创建请求 Promise（异步处理拦截器）
    const requestPromise = (async (): Promise<ResponseData<T>> => {
      // 应用请求拦截器
      const finalConfig = await applyRequestInterceptors(mergedConfig, this.interceptors);

      // 构建完整 URL
      const fullURL = this.buildURL(url, finalConfig.baseURL, finalConfig.params);

      // 准备请求体
      let requestBody: string | FormData | URLSearchParams | undefined;
      if (finalConfig.data !== undefined) {
        if (finalConfig.data instanceof FormData || finalConfig.data instanceof URLSearchParams) {
          requestBody = finalConfig.data;
          // FormData 会自动设置 Content-Type，需要删除手动设置的
          const headers = new Headers(finalConfig.headers);
          headers.delete('Content-Type');
          finalConfig.headers = headers;
        } else {
          requestBody = JSON.stringify(finalConfig.data);
        }
      }


      // 获取超时时间（拦截器可能会修改）
      const timeout = finalConfig.timeout || this.defaultConfig.timeout || 10000;

      try {
        // 设置超时定时器
        timeoutId = setTimeout(() => {
          controller.abort();
        }, timeout);

        // 发送请求
        const response = await fetch(fullURL, {
          ...finalConfig,
          signal,
          body: requestBody,
        });

        // 清除超时定时器
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        // 解析响应数据
        const data = await this.parseResponse<T>(response, finalConfig.autoParseJSON);

        // 构建响应对象
        const responseData: ResponseData<T> = {
          data,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        };

        // 应用响应拦截器
        return await applyResponseInterceptors(responseData, this.interceptors);
      } catch (error) {
        // 清除超时定时器
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        // 处理错误
        const err =
          error instanceof Error ? error : new Error(error ? String(error) : 'Unknown error');

        // 如果是取消请求，特殊处理
        if (err.name === 'AbortError') {
          err.message = 'Request cancelled';
        }

        // 应用错误拦截器
        await applyErrorInterceptors(err, this.interceptors);

        throw err;
      }
    })();

    // 返回 Promise 和取消函数
    return {
      promise: requestPromise,
      cancel: () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        controller.abort();
      },
    };
  }

  /**
   * GET 请求
   * @param url 请求路径
   * @param config 请求配置
   * @returns 返回 Promise 和取消函数
   *
   * @example
   * // 基础使用
   * const { promise, cancel } = request.get('/api/users');
   * const data = await promise;
   *
   * // 带查询参数
   * const { promise } = request.get('/api/users', {
   *   params: { page: 1, limit: 10 }
   * });
   *
   * // 取消请求
   * const { promise, cancel } = request.get('/api/users');
   * cancel(); // 取消请求
   */
  get<T = unknown>(
    url: string,
    config?: Omit<RequestConfig, 'method' | 'data'>
  ): { promise: Promise<ResponseData<T>>; cancel: () => void } {
    return this.request<T>(url, { ...config, method: 'GET' });
  }

  /**
   * POST 请求
   * @param url 请求路径
   * @param data 请求体数据
   * @param config 请求配置
   * @returns 返回 Promise 和取消函数
   *
   * @example
   * // 基础使用
   * const { promise } = request.post('/api/users', { name: 'John', age: 30 });
   * const data = await promise;
   */
  post<T = unknown>(
    url: string,
    data?: unknown,
    config?: Omit<RequestConfig, 'method' | 'data'>
  ): { promise: Promise<ResponseData<T>>; cancel: () => void } {
    return this.request<T>(url, { ...(config || {}), method: 'POST', data });
  }

  /**
   * PUT 请求
   * @param url 请求路径
   * @param data 请求体数据
   * @param config 请求配置
   * @returns 返回 Promise 和取消函数
   *
   * @example
   * const { promise } = request.put('/api/users/1', { name: 'Jane' });
   * const data = await promise;
   */
  put<T = unknown>(
    url: string,
    data?: unknown,
    config?: Omit<RequestConfig, 'method' | 'data'>
  ): { promise: Promise<ResponseData<T>>; cancel: () => void } {
    return this.request<T>(url, { ...config, method: 'PUT', data });
  }

  /**
   * DELETE 请求
   * @param url 请求路径
   * @param config 请求配置
   * @returns 返回 Promise 和取消函数
   *
   * @example
   * const { promise } = request.delete('/api/users/1');
   * const data = await promise;
   */
  delete<T = unknown>(
    url: string,
    config?: Omit<RequestConfig, 'method' | 'data'>
  ): { promise: Promise<ResponseData<T>>; cancel: () => void } {
    return this.request<T>(url, { ...config, method: 'DELETE' });
  }

  /**
   * PATCH 请求
   * @param url 请求路径
   * @param data 请求体数据
   * @param config 请求配置
   * @returns 返回 Promise 和取消函数
   *
   * @example
   * const { promise } = request.patch('/api/users/1', { name: 'Updated' });
   * const data = await promise;
   */
  patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: Omit<RequestConfig, 'method' | 'data'>
  ): { promise: Promise<ResponseData<T>>; cancel: () => void } {
    return this.request<T>(url, { ...config, method: 'PATCH', data });
  }

  /**
   * 自定义请求方法
   * @param url 请求路径
   * @param config 请求配置（必须包含 method）
   * @returns 返回 Promise 和取消函数
   *
   * @example
   * const { promise } = request.request('/api/users', { method: 'OPTIONS' });
   * const data = await promise;
   */
  custom<T = unknown>(
    url: string,
    config: RequestConfig & { method: string }
  ): { promise: Promise<ResponseData<T>>; cancel: () => void } {
    return this.request<T>(url, config);
  }

  /**
   * 更新默认配置
   * @param config 新的默认配置
   */
  setDefaultConfig(config: Partial<RequestConfig>): void {
    this.defaultConfig = {
      ...this.defaultConfig,
      ...config,
      headers: {
        ...this.defaultConfig.headers,
        ...config.headers,
      },
    };
  }

  /**
   * 获取当前默认配置
   */
  getDefaultConfig(): RequestConfig {
    return { ...this.defaultConfig };
  }
}

/**
 * 创建请求实例的工厂函数
 * @param config 默认配置
 * @returns 请求实例
 *
 * @example
 * // 创建自定义实例
 * const apiRequest = createRequest({
 *   baseURL: 'https://api.example.com',
 *   timeout: 5000
 * });
 */
export function createRequest(config?: RequestConfig): Request {
  return new Request(config);
}

/**
 * 默认请求实例
 * 可以直接使用，也可以通过 createRequest 创建自定义实例
 *
 * @example
 * // 设置基础 URL
 * request.setDefaultConfig({ baseURL: 'https://api.example.com' });
 *
 * // 添加请求拦截器（添加 token）
 * request.interceptors.request.use((config) => {
 *   const token = localStorage.getItem('token');
 *   if (token) {
 *     config.headers = {
 *       ...config.headers,
 *       Authorization: `Bearer ${token}`
 *     };
 *   }
 *   return config;
 * });
 *
 * // 添加响应拦截器（统一错误处理）
 * request.interceptors.response.use((response) => {
 *   if (response.status >= 400) {
 *     throw new Error(`Request failed: ${response.statusText}`);
 *   }
 *   return response;
 * });
 *
 * // 添加错误拦截器
 * request.interceptors.error.use((error) => {
 *   console.error('Request error:', error);
 * });
 *
 * // 使用请求方法
 * const { promise, cancel } = request.get('/api/users');
 * promise.then((response) => {
 *   console.log(response.data);
 * }).catch((error) => {
 *   console.error(error);
 * });
 */
import { useAuthStore } from '@/store';

const request = new Request();

// 请求头统一添加 Authorization: Bearer <token>
request.interceptors.request.use(config => {
  const token = useAuthStore.getState().token;
  if (token) {
    const authValue = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    config.headers = new Headers(config.headers);
    config.headers.set('Authorization', authValue);
  }
  return config;
});

// 添加默认的错误拦截器，统一处理请求错误
request.interceptors.error.use(createRequestErrorInterceptor());

export default request;
export { Request };
