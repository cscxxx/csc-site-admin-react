/**
 * 性能监控指标配置与格式化 Hook
 */

import { useMemo } from 'react';
import { formatNumber } from '@/utils/formatNumber';
import { COLORS } from '@/styles/constants';

export type MetricInfoItem = {
  label: string;
  description: string;
  unit: string;
  thresholds: { good: number; poor: number };
};

const METRIC_INFO: Record<string, MetricInfoItem> = {
  LCP: {
    label: '最大内容绘制',
    description: 'Largest Contentful Paint - 衡量页面加载性能',
    unit: 'ms',
    thresholds: { good: 2500, poor: 4000 },
  },
  INP: {
    label: '交互到下次绘制',
    description: 'Interaction to Next Paint - 衡量页面交互性（替代 FID）',
    unit: 'ms',
    thresholds: { good: 200, poor: 500 },
  },
  CLS: {
    label: '累积布局偏移',
    description: 'Cumulative Layout Shift - 衡量视觉稳定性',
    unit: '',
    thresholds: { good: 0.1, poor: 0.25 },
  },
  FCP: {
    label: '首次内容绘制',
    description: 'First Contentful Paint - 首次内容渲染时间',
    unit: 'ms',
    thresholds: { good: 1800, poor: 3000 },
  },
  TTFB: {
    label: '首字节时间',
    description: 'Time to First Byte - 服务器响应时间',
    unit: 'ms',
    thresholds: { good: 800, poor: 1800 },
  },
};

function getRatingColor(rating: 'good' | 'needs-improvement' | 'poor'): string {
  switch (rating) {
    case 'good':
      return COLORS.success;
    case 'needs-improvement':
      return COLORS.warning;
    case 'poor':
      return COLORS.error;
    default:
      return COLORS.primary;
  }
}

function getRatingText(rating: 'good' | 'needs-improvement' | 'poor'): string {
  switch (rating) {
    case 'good':
      return '好';
    case 'needs-improvement':
      return '需要改进';
    case 'poor':
      return '差';
    default:
      return '未知';
  }
}

function formatMetricValue(name: string, value: number): string {
  const info = METRIC_INFO[name];
  if (!info) return formatNumber(value);

  if (name === 'CLS') {
    return value.toFixed(3);
  }

  return `${formatNumber(Math.round(value))} ${info.unit}`;
}

export function useMetricInfo(): {
  metricInfo: Record<string, MetricInfoItem>;
  getRatingColor: (rating: 'good' | 'needs-improvement' | 'poor') => string;
  getRatingText: (rating: 'good' | 'needs-improvement' | 'poor') => string;
  formatMetricValue: (name: string, value: number) => string;
} {
  return useMemo(
    () => ({
      metricInfo: METRIC_INFO,
      getRatingColor,
      getRatingText,
      formatMetricValue,
    }),
    []
  );
}
