/**
 * 认证状态管理 Store
 * 本地只存 token 字符串（如 eyJhbGci...），不存任何对象
 *
 * @module store/authStore
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const TOKEN_KEY = 'csc-site-admin-token';

/** 仅存 token 字符串：写入只写 token，读取只读 token（persist 所需格式仅在内存中拼给库用，不写入） */
const tokenOnlyStorage = createJSONStorage(() => {
  const toPersistFormat = (token: string | null) =>
    JSON.stringify({ state: { token, isAuthenticated: !!token }, version: 0 });
  if (typeof localStorage === 'undefined') {
    return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
  }
  return {
    getItem: (name: string) => {
      const raw = localStorage.getItem(name);
      return raw === null ? null : toPersistFormat(raw === '' ? null : raw);
    },
    setItem: (name: string, value: string) => {
      const token =
        (JSON.parse(value) as { state?: { token?: string | null } })?.state?.token ?? '';
      const s = typeof token === 'string' ? token : '';
      if (s) localStorage.setItem(name, s);
      else localStorage.removeItem(name);
    },
    removeItem: (name: string) => localStorage.removeItem(name),
  };
});

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      isAuthenticated: false,
      token: null,
      login: token => set({ token, isAuthenticated: true }),
      logout: () => set({ token: null, isAuthenticated: false }),
    }),
    {
      name: TOKEN_KEY,
      storage: tokenOnlyStorage,
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
