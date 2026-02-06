/**
 * 错误相关类型定义
 * 用于全局错误处理和日志记录
 */

/**
 * 错误类型枚举
 */
export type ErrorType = 'react' | 'javascript' | 'promise' | 'network' | 'unknown';

/**
 * 错误信息接口
 * 记录错误的详细信息
 */
export interface ErrorInfo {
  /** 错误消息 */
  message: string;
  /** 错误堆栈 */
  stack?: string;
  /** React 组件堆栈（React 错误边界捕获） */
  componentStack?: string;
  /** 错误发生时间戳 */
  timestamp: number;
  /** 用户代理信息 */
  userAgent: string;
  /** 错误发生时的 URL */
  url: string;
  /** 错误类型 */
  errorType: ErrorType;
}

/**
 * 错误上报配置
 */
export interface ErrorReportConfig {
  /** 是否启用错误上报 */
  enabled: boolean;
  /** 错误上报接口地址 */
  endpoint?: string;
  /** 最大重试次数 */
  maxRetries?: number;
}
