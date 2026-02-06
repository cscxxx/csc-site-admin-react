/**
 * 性能监控相关类型定义
 * 用于 Web Vitals 性能指标收集
 */

/**
 * Web Vitals 指标评级
 */
export type MetricRating = 'good' | 'needs-improvement' | 'poor';

/**
 * Web Vitals 指标
 */
export interface VitalMetric {
  /** 指标名称（LCP、INP、CLS、FCP、TTFB） */
  name: string;
  /** 指标值 */
  value: number;
  /** 指标评级 */
  rating: MetricRating;
  /** 指标增量 */
  delta: number;
  /** 指标 ID */
  id: string;
  /** 时间戳 */
  timestamp: number;
}

/**
 * 性能记录
 * 包含一次性能采集的所有指标
 */
export interface PerformanceRecord {
  /** 记录唯一 ID */
  id: string;
  /** 记录时间戳 */
  timestamp: number;
  /** 指标数据 */
  metrics: Record<string, VitalMetric>;
}

/**
 * 指标阈值配置
 */
export interface MetricThreshold {
  /** 良好阈值 */
  good: number;
  /** 较差阈值 */
  poor: number;
}
