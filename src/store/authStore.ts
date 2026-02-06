/**
 * 认证状态管理 Store
 * 
 * 使用 Zustand 管理应用的认证状态，包括登录状态和 token
 * 
 * 特性：
 * - 使用 persist middleware 实现状态持久化，存储在 localStorage
 * - 存储键名：csc-site-admin-token
 * - 支持多标签页同步：通过监听 storage 事件实现
 * - Token 格式：Bearer {token}
 * 
 * 使用示例：
 * ```ts
 * // 登录
 * const login = useAuthStore((state) => state.login);
 * login('your-token');
 * 
 * // 登出
 * const logout = useAuthStore((state) => state.logout);
 * logout();
 * 
 * // 获取认证状态
 * const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
 * const token = useAuthStore((state) => state.token);
 * ```
 * 
 * @module store/authStore
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      login: (token) => set({ token, isAuthenticated: true }),
      logout: () => set({ token: null, isAuthenticated: false }),
    }),
    {
      name: 'csc-site-admin-token',
      storage: createJSONStorage(() => localStorage),
      // 多标签页同步：persist middleware 会自动处理 storage 事件
    }
  )
);

// 监听 storage 事件以实现多标签页同步
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'csc-site-admin-token' && e.newValue) {
      // Zustand persist middleware 会自动处理，这里可以添加额外的同步逻辑
      useAuthStore.persist.rehydrate();
    }
  });
}
