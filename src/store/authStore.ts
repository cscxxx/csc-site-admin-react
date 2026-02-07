/**
 * 认证状态管理 Store
 * 使用 persist 将 token 持久化到 localStorage，刷新后自动恢复
 *
 * @module store/authStore
 */

import { create } from 'zustand';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';

const TOKEN_KEY = 'csc-site-admin-token';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    devtools(
      set => ({
        isAuthenticated: false,
        token: null,
        login: token => set({ token, isAuthenticated: true }),
        logout: () => set({ token: null, isAuthenticated: false }),
      }),
      { name: 'AuthStore' }
    ),
    {
      name: TOKEN_KEY,
      storage: createJSONStorage(() => localStorage),
    }
  )
);

if (typeof window !== 'undefined') {
  window.addEventListener('storage', e => {
    if (e.key === TOKEN_KEY && e.newValue !== undefined) {
      useAuthStore.persist.rehydrate();
    }
  });
}
