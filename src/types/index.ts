/**
 * 类型定义统一导出
 * 按模块分类导出所有类型，方便统一管理和使用
 *
 * @example
 * ```ts
 * import type { ApiResponse, UserInfo, LoginParams } from '@/types';
 * ```
 */

// API 相关类型
export type { ApiResponse, PaginationParams, PaginatedData, PaginatedResponse } from './api';

// 用户相关类型
export type { UserInfo, LoginParams, LoginResponseData, LoginResponse, UserListItem } from './user';

// 请求工具相关类型
export type {
  RequestConfig,
  ResponseData,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
} from './request';

// 错误相关类型
export type { ErrorType, ErrorInfo, ErrorReportConfig } from './error';

// 性能监控相关类型
export type { MetricRating, VitalMetric, PerformanceRecord, MetricThreshold } from './performance';

// 通用类型
export type { MenuItem, TableColumn, OptionItem, KeyValuePair } from './common';

// Mock 相关类型
export type { MockResponse, MockConfigOptions, MockConfig } from './mock';

// Banner 相关类型
export type {
  BannerItem,
  BannerSubmitItem,
  BannerListResponse,
} from './banner';

// 设置相关类型
export type { SettingData } from './setting';
