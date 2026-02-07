import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { VitalMetric, PerformanceRecord } from '@/types';
import { getPerformanceHistory, clearPerformanceHistory } from '@/utils/performance/vitals';

/**
 * 性能监控状态
 */
interface PerformanceState {
  // 当前性能指标
  currentMetrics: Record<string, VitalMetric>;
  // 历史性能记录
  history: PerformanceRecord[];
  // 更新当前指标
  updateMetrics: (metrics: Record<string, VitalMetric>) => void;
  // 刷新历史记录
  refreshHistory: () => void;
  // 清除历史记录
  clearHistory: () => void;
}

export const usePerformanceStore = create<PerformanceState>()(
  devtools(
    set => ({
      currentMetrics: {},
      history: getPerformanceHistory(),

      updateMetrics: metrics => {
        set({ currentMetrics: metrics });
      },

      refreshHistory: () => {
        set({ history: getPerformanceHistory() });
      },

      clearHistory: () => {
        clearPerformanceHistory();
        set({ history: [] });
      },
    }),
    { name: 'PerformanceStore' }
  )
);
