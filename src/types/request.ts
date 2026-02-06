/**
 * 请求工具相关类型定义
 * 用于自定义请求工具的类型声明
 */

/**
 * 请求配置接口
 * 扩展了原生 RequestInit，添加了自定义配置项
 */
export interface RequestConfig extends RequestInit {
  /** 基础 URL，会自动拼接在请求路径前 */
  baseURL?: string;
  /** 请求超时时间（毫秒），默认 10000ms */
  timeout?: number;
  /** 请求参数（用于 GET 请求的 query 参数） */
  params?: Record<string, string | number | boolean | null | undefined>;
  /** 请求体数据（会自动序列化为 JSON） */
  data?: unknown;
  /** 是否自动处理 JSON 响应，默认 true */
  autoParseJSON?: boolean;
}

/**
 * 响应数据接口
 * 封装了 fetch Response 的常用属性
 */
export interface ResponseData<T = unknown> {
  /** 响应数据 */
  data: T;
  /** HTTP 状态码 */
  status: number;
  /** HTTP 状态文本 */
  statusText: string;
  /** 响应头 */
  headers: Headers;
}

/**
 * 请求拦截器函数类型
 * 用于在发送请求前修改配置
 */
export type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;

/**
 * 响应拦截器函数类型
 * 用于在收到响应后处理数据
 */
export type ResponseInterceptor = <T>(
  response: ResponseData<T>
) => ResponseData<T> | Promise<ResponseData<T>>;

/**
 * 错误拦截器函数类型
 * 用于处理请求错误
 */
export type ErrorInterceptor = (error: Error) => void | Promise<void>;
