/**
 * Mock 相关类型定义
 * 用于 Mock 数据拦截和响应
 */

/**
 * Mock 响应格式
 */
export interface MockResponse<T = unknown> {
  /** 响应码 */
  code: number;
  /** 响应消息 */
  message?: string;
  /** 响应数据 */
  data: T;
}

/**
 * Mock 配置选项
 */
export interface MockConfigOptions {
  /** 请求 URL */
  url: string;
  /** 请求方法 */
  method: string;
  /** 请求体 */
  body: unknown;
  /** 查询参数 */
  query: Record<string, unknown>;
  /** 请求头 */
  headers: Record<string, unknown>;
}

/**
 * Mock 配置
 */
export interface MockConfig {
  /** URL 匹配规则（字符串或正则表达式） */
  url: string | RegExp;
  /** HTTP 方法 */
  method: 'get' | 'post' | 'put' | 'delete' | 'patch' | string;
  /** 响应函数 */
  response: (options: MockConfigOptions) => unknown | Promise<unknown>;
  /** 延迟时间（毫秒） */
  delay?: number;
  /** HTTP 状态码 */
  statusCode?: number;
}
