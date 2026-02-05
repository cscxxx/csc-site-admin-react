/**
 * 错误类型定义
 */

/**
 * 错误信息接口
 */
export interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: number;
  userAgent: string;
  url: string;
  errorType: 'react' | 'javascript' | 'promise' | 'network' | 'unknown';
}

/**
 * 错误上报配置
 */
export interface ErrorReportConfig {
  enabled: boolean;
  endpoint?: string;
  maxRetries?: number;
}
