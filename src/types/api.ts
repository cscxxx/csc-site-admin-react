/**
 * API 相关类型定义
 * 统一管理 API 请求和响应的类型
 */

/**
 * API 统一响应格式
 * 所有 API 接口都遵循此格式
 */
export interface ApiResponse<T = unknown> {
  /** 响应码，0 表示成功，非 0 表示失败 */
  code: number;
  /** 响应消息 */
  msg: string;
  /** 响应数据 */
  data: T | null;
}

/**
 * 分页请求参数
 */
export interface PaginationParams {
  /** 当前页码，从 1 开始 */
  page?: number;
  /** 每页数量 */
  pageSize?: number;
}

/**
 * 分页响应数据
 */
export interface PaginatedData<T> {
  /** 数据列表 */
  list: T[];
  /** 总记录数 */
  total: number;
  /** 当前页码 */
  page: number;
  /** 每页数量 */
  pageSize: number;
}

/**
 * 分页响应（API 响应格式）
 */
export type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>;
