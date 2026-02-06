/**
 * Zustand Store 示例
 * 
 * 展示如何正确创建和使用 Zustand Store
 * 此文件仅作为参考示例，不会被实际使用
 * 
 * 注意：以下代码中的导入语句在实际项目中会正确解析
 * 实际使用时，取消注释并确保路径别名 @/ 已配置
 */

/**
 * 用户 Store（带持久化）示例
 * 
 * @example
 * ```typescript
 * import { create } from 'zustand';
 * import { persist, createJSONStorage } from 'zustand/middleware';
 * import type { UserInfo } from '@/types';
 * 
 * interface UserState {
 *   userInfo: UserInfo | null;
 *   loading: boolean;
 *   error: string | null;
 *   setUserInfo: (userInfo: UserInfo) => void;
 *   setLoading: (loading: boolean) => void;
 *   setError: (error: string | null) => void;
 *   clearUserInfo: () => void;
 *   fetchUserInfo: (id: number) => Promise<void>;
 * }
 * 
 * export const useUserStore = create<UserState>()(
 *   persist(
 *     (set, get) => ({
 *       userInfo: null,
 *       loading: false,
 *       error: null,
 *       setUserInfo: (userInfo) => set({ userInfo }),
 *       setLoading: (loading) => set({ loading }),
 *       setError: (error) => set({ error }),
 *       clearUserInfo: () => set({ userInfo: null, error: null }),
 *       fetchUserInfo: async (id: number) => {
 *         set({ loading: true, error: null });
 *         try {
 *           // 动态导入服务函数（避免循环依赖）
 *           const { getUserById } = await import('@/pages/Users/service');
 *           const userInfo = await getUserById(id);
 *           set({ userInfo, loading: false });
 *         } catch (error) {
 *           set({
 *             error: error instanceof Error ? error.message : '获取用户信息失败',
 *             loading: false,
 *           });
 *         }
 *       },
 *     }),
 *     {
 *       name: 'user-storage',
 *       storage: createJSONStorage(() => localStorage),
 *       partialize: (state) => ({ userInfo: state.userInfo }),
 *     }
 *   )
 * );
 * 
 * // 多标签页同步
 * if (typeof window !== 'undefined') {
 *   window.addEventListener('storage', (e) => {
 *     if (e.key === 'user-storage' && e.newValue) {
 *       useUserStore.persist.rehydrate();
 *     }
 *   });
 * }
 * ```
 */

/**
 * 简单 Store 示例（无持久化）
 * 
 * @example
 * ```typescript
 * interface CounterState {
 *   count: number;
 *   increment: () => void;
 *   decrement: () => void;
 *   reset: () => void;
 * }
 * 
 * export const useCounterStore = create<CounterState>((set) => ({
 *   count: 0,
 *   increment: () => set((state) => ({ count: state.count + 1 })),
 *   decrement: () => set((state) => ({ count: state.count - 1 })),
 *   reset: () => set({ count: 0 }),
 * }));
 * ```
 */
