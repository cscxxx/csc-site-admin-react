/**
 * Web Vitals 性能监控工具
 * 收集和存储 Core Web Vitals 指标
 */

import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';
import type { VitalMetric, PerformanceRecord } from '@/types';

/**
 * 指标阈值配置
 */
const THRESHOLDS: Record<string, { good: number; poor: number }> = {
  LCP: { good: 2500, poor: 4000 },
  INP: { good: 200, poor: 500 }, // INP 替代 FID，阈值不同
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
};

/**
 * 评估指标评级
 * @param name - 指标名称（LCP、INP、CLS、FCP、TTFB）
 * @param value - 指标值
 * @returns 评级结果：'good' | 'needs-improvement' | 'poor'
 */
function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name];
  if (!threshold) return 'good';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * 格式化指标数据
 * @param metric - Web Vitals 原始指标数据
 * @returns 格式化后的指标数据，包含评级和时间戳
 */
function formatMetric(metric: Metric): VitalMetric {
  return {
    name: metric.name,
    value: metric.value,
    rating: getRating(metric.name, metric.value),
    delta: metric.delta,
    id: metric.id,
    timestamp: Date.now(),
  };
}

/**
 * 存储键名
 */
const STORAGE_KEY = 'web-vitals-history';
const MAX_RECORDS = 50;

/**
 * 保存性能数据到 localStorage
 * @param metrics - 性能指标数据对象
 * @remarks 最多保存 MAX_RECORDS 条记录，超出部分会被删除
 */
export function savePerformanceRecord(metrics: Record<string, VitalMetric>): void {
  try {
    const record: PerformanceRecord = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: Date.now(),
      metrics,
    };

    const existing = getPerformanceHistory();
    const updated = [record, ...existing].slice(0, MAX_RECORDS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save performance record:', error);
  }
}

/**
 * 获取历史性能数据
 * @returns 历史性能记录数组，如果获取失败或不存在则返回空数组
 * @remarks 会自动为旧数据（没有 id）生成唯一 ID 并迁移
 */
export function getPerformanceHistory(): PerformanceRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const records = JSON.parse(data) as PerformanceRecord[];
    // 为旧数据（没有 id）生成唯一 ID，并保存回 localStorage
    const needsMigration = records.some(record => !record.id);
    if (needsMigration) {
      const migrated = records.map(record => ({
        ...record,
        id: record.id || `${record.timestamp}-${Math.random().toString(36).substring(2, 9)}`,
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }
    return records;
  } catch (error) {
    console.error('Failed to get performance history:', error);
    return [];
  }
}

/**
 * 清除历史性能数据
 * @remarks 从 localStorage 中删除所有历史性能记录
 */
export function clearPerformanceHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear performance history:', error);
  }
}

/**
 * 当前收集到的指标
 */
let currentMetrics: Record<string, VitalMetric> = {};
/**
 * 指标更新回调函数
 */
let metricsCallback: ((metrics: Record<string, VitalMetric>) => void) | null = null;
/**
 * 防抖定时器
 */
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * 触发指标更新回调（使用防抖）
 */
function triggerMetricsCallback(): void {
  if (!metricsCallback || Object.keys(currentMetrics).length === 0) {
    return;
  }

  // 清除之前的定时器
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  // 使用防抖，避免频繁触发回调
  debounceTimer = setTimeout(() => {
    if (metricsCallback && Object.keys(currentMetrics).length > 0) {
      metricsCallback({ ...currentMetrics });
    }
    debounceTimer = null;
  }, 500);
}

/**
 * 指标收集回调
 */
function onMetricReport(metric: Metric): void {
  const formatted = formatMetric(metric);
  currentMetrics[metric.name] = formatted;

  // 触发指标更新回调
  triggerMetricsCallback();

  // 当所有核心指标都收集完成后，保存记录
  // 注意：某些指标可能不会在单次页面加载中触发（如 INP，需要用户交互）
  if (Object.keys(currentMetrics).length >= 3) {
    // 延迟保存，确保所有指标都有机会被收集
    setTimeout(() => {
      savePerformanceRecord({ ...currentMetrics });
    }, 1000);
  }
}

/**
 * 初始化 Web Vitals 监控
 *
 * 开始收集 Core Web Vitals 指标：
 * - LCP (Largest Contentful Paint)
 * - INP (Interaction to Next Paint)
 * - CLS (Cumulative Layout Shift)
 * - FCP (First Contentful Paint)
 * - TTFB (Time to First Byte)
 *
 * @param onReport - 指标更新回调函数（可选），当指标更新时会调用此函数
 * @remarks
 * - 使用防抖机制避免频繁触发回调
 * - 当收集到至少 3 个指标时会自动保存记录
 * - 应在应用启动时调用（main.tsx）
 *
 * @example
 * ```typescript
 * initWebVitals((metrics) => {
 *   console.log('性能指标更新:', metrics);
 * });
 * ```
 */
export function initWebVitals(onReport?: (metrics: Record<string, VitalMetric>) => void): void {
  // 重置当前指标
  currentMetrics = {};
  metricsCallback = onReport || null;

  // 清除之前的防抖定时器
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }

  // 收集所有 Web Vitals 指标
  onCLS(onMetricReport);
  onFCP(onMetricReport);
  onINP(onMetricReport); // onFID 已弃用，使用 onINP (Interaction to Next Paint) 替代
  onLCP(onMetricReport);
  onTTFB(onMetricReport);
}

/**
 * 获取当前收集到的性能指标
 * @returns 当前性能指标数据对象的副本
 * @remarks 返回的是副本，修改返回值不会影响原始数据
 */
export function getCurrentMetrics(): Record<string, VitalMetric> {
  return { ...currentMetrics };
}
