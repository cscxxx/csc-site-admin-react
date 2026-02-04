/**
 * Mock 工具函数
 * 提供响应包装、延迟等常用功能
 */

/**
 * 统一响应格式
 */
export interface MockResponse<T = unknown> {
  code: number;
  message?: string;
  data: T;
}

/**
 * 成功响应包装函数
 * @param data 响应数据
 * @param message 响应消息
 * @returns 标准响应格式
 */
export function successResponse<T = unknown>(data: T, message: string = '操作成功'): MockResponse<T> {
  return {
    code: 200,
    message,
    data,
  };
}

/**
 * 错误响应包装函数
 * @param message 错误消息
 * @param code 错误码，默认 400
 * @returns 标准错误响应格式
 */
export function errorResponse(message: string = '操作失败', code: number = 400): MockResponse<null> {
  return {
    code,
    message,
    data: null,
  };
}

/**
 * 分页响应包装函数
 * @param list 列表数据
 * @param total 总数
 * @param page 当前页码
 * @param pageSize 每页数量
 * @returns 分页响应格式
 */
export function pageResponse<T = unknown>(
  list: T[],
  total: number,
  page: number = 1,
  pageSize: number = 10
): MockResponse<{
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}> {
  return successResponse({
    list,
    total,
    page,
    pageSize,
  });
}

/**
 * 延迟函数（用于模拟网络延迟）
 * @param ms 延迟毫秒数
 * @returns Promise
 */
export function delay(ms: number = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Mock 配置接口
 */
export interface MockConfig {
  url: string | RegExp;
  method: 'get' | 'post' | 'put' | 'delete' | 'patch' | string;
  response: (options: {
    url: string;
    method: string;
    body: unknown;
    query: Record<string, unknown>;
    headers: Record<string, unknown>;
  }) => unknown | Promise<unknown>;
  delay?: number;
  statusCode?: number;
}
