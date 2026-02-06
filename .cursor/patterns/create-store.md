# 创建 Zustand Store 的标准模式

## 文件位置和命名

- **位置**: `src/store/` 目录
- **命名**: `*Store.ts`（如 `authStore.ts`, `userStore.ts`）
- **导出**: 通过 `src/store/index.ts` 统一导出

## 标准模式

### 1. 基础 Store（无持久化）

```typescript
import { create } from 'zustand';

interface UserState {
  userInfo: UserInfo | null;
  setUserInfo: (userInfo: UserInfo) => void;
  clearUserInfo: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  userInfo: null,
  setUserInfo: (userInfo) => set({ userInfo }),
  clearUserInfo: () => set({ userInfo: null }),
}));
```

### 2. 带持久化的 Store

```typescript
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
      name: 'auth-storage', // localStorage 键名
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

### 3. 多标签页同步

```typescript
// 监听 storage 事件以实现多标签页同步
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'auth-storage' && e.newValue) {
      useAuthStore.persist.rehydrate();
    }
  });
}
```

## 完整示例

### 认证 Store

```typescript
/**
 * 认证状态管理 Store
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
    }
  )
);

// 多标签页同步
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'csc-site-admin-token' && e.newValue) {
      useAuthStore.persist.rehydrate();
    }
  });
}
```

### 复杂状态 Store

```typescript
import { create } from 'zustand';
import type { UserInfo } from '@/types';

interface UserState {
  // 状态
  userInfo: UserInfo | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  setUserInfo: (userInfo: UserInfo) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearUserInfo: () => void;
  
  // 异步 Actions
  fetchUserInfo: (id: number) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  // 初始状态
  userInfo: null,
  loading: false,
  error: null,
  
  // 同步 Actions
  setUserInfo: (userInfo) => set({ userInfo }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearUserInfo: () => set({ userInfo: null, error: null }),
  
  // 异步 Actions
  fetchUserInfo: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const { getUserById } = await import('@/pages/Users/service');
      const userInfo = await getUserById(id);
      set({ userInfo, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '获取用户信息失败',
        loading: false,
      });
    }
  },
}));
```

## 使用 Store

### 在组件中使用

```typescript
import { useAuthStore } from '@/store';

function MyComponent() {
  // 方式 1: 直接使用（会订阅整个 store）
  const { isAuthenticated, token, login, logout } = useAuthStore();
  
  // 方式 2: 使用 selector（推荐，避免不必要的重渲染）
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useAuthStore((state) => state.login);
  
  // 方式 3: 多个 selector
  const { isAuthenticated, token } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    token: state.token,
  }));
  
  return (
    <div>
      {isAuthenticated ? (
        <button onClick={logout}>登出</button>
      ) : (
        <button onClick={() => login('token')}>登录</button>
      )}
    </div>
  );
}
```

### 在非组件中使用

```typescript
import { useAuthStore } from '@/store';

// 获取当前状态（不订阅更新）
const token = useAuthStore.getState().token;

// 调用 action
useAuthStore.getState().login('new-token');

// 订阅状态变化
const unsubscribe = useAuthStore.subscribe(
  (state) => state.token,
  (token) => {
    console.log('Token changed:', token);
  }
);

// 取消订阅
unsubscribe();
```

## 最佳实践

1. **文件命名**: 使用 `*Store.ts` 格式
2. **类型定义**: 为 State 接口定义完整类型
3. **持久化**: 需要持久化的状态使用 `persist` middleware
4. **存储键名**: 使用有意义的键名，格式：`*-storage`
5. **多标签页同步**: 需要同步的 Store 监听 `storage` 事件
6. **Selector 使用**: 在组件中使用 selector 避免不必要的重渲染
7. **异步 Actions**: 异步操作放在 Store 的 action 中
8. **错误处理**: 异步操作要有错误处理逻辑

## 性能优化

### 使用 shallow 比较

```typescript
import { shallow } from 'zustand/shallow';

// 避免对象引用变化导致的重渲染
const { userInfo, loading } = useUserStore(
  (state) => ({ userInfo: state.userInfo, loading: state.loading }),
  shallow
);
```

### 拆分 Store

如果 Store 太大，可以按功能拆分：

```typescript
// userStore.ts - 用户信息
export const useUserStore = create(...);

// userSettingsStore.ts - 用户设置
export const useUserSettingsStore = create(...);
```
