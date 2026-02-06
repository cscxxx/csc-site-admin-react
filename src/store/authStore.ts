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
