# 项目结构说明

## 目录结构

```
src/
├── pages/           # 页面组件
│   ├── Login/       # 登录页面
│   │   ├── index.tsx
│   │   ├── index.module.less
│   │   └── service.ts        # API 服务函数
│   ├── Dashboard/   # 仪表盘
│   └── ...
│
├── components/      # 通用组件
│   ├── ProtectedRoute.tsx    # 路由守卫
│   ├── LazyRoute.tsx         # 懒加载路由包装器
│   └── ErrorBoundary.tsx    # 错误边界
│
├── layouts/         # 布局组件
│   ├── index.tsx    # 主布局（侧边栏+内容区）
│   └── index.module.less
│
├── router/          # 路由配置
│   └── index.tsx    # 路由定义
│
├── store/           # Zustand 状态管理
│   ├── authStore.ts      # 认证状态
│   ├── performanceStore.ts # 性能监控状态
│   └── index.ts          # Store 统一导出
│
├── types/           # 类型定义（按模块分类）
│   ├── api.ts       # API 相关类型
│   ├── user.ts      # 用户相关类型
│   ├── request.ts   # 请求工具类型
│   ├── error.ts     # 错误相关类型
│   ├── performance.ts # 性能监控类型
│   ├── common.ts    # 通用类型
│   ├── mock.ts      # Mock 相关类型
│   └── index.ts     # 统一导出
│
├── utils/           # 工具函数
│   ├── request/     # 请求工具
│   │   ├── index.ts         # 请求类
│   │   ├── interceptors.ts # 拦截器
│   │   ├── errorHandler.ts  # 错误处理
│   │   └── types.ts         # 类型定义
│   ├── error/       # 错误处理
│   │   ├── logger.ts        # 错误日志
│   │   ├── globalHandler.ts # 全局错误处理
│   │   └── types.ts         # 类型定义
│   ├── performance/ # 性能监控
│   │   └── vitals.ts        # Web Vitals
│   └── formatNumber.ts     # 数字格式化
│
├── hooks/           # 自定义 Hooks
│   ├── useAuth.ts   # 认证 Hook
│   └── useGSAP.ts   # GSAP 动画 Hook
│
├── contexts/        # React Context
│   ├── AuthContext.tsx      # 认证上下文
│   └── authContext.ts       # 上下文类型
│
├── config/          # 配置文件
│   ├── theme.ts     # Ant Design 主题配置
│   ├── dayjs.ts     # dayjs 配置
│   ├── numeral.ts   # numeral 配置
│   └── gsap.ts      # GSAP 配置
│
└── styles/          # 全局样式
    └── variables.less # Less 变量
```

## 文件命名规范

### 页面组件
- 目录名：PascalCase（如 `UserProfile`）
- 主文件：`index.tsx`
- 样式文件：`index.module.less`
- 服务文件：`service.ts`

### 通用组件
- 文件名：PascalCase（如 `ProtectedRoute.tsx`）
- 样式文件：`{ComponentName}.module.less`

### Store 文件
- 命名格式：`*Store.ts`（如 `authStore.ts`）

### 工具函数
- 文件名：camelCase（如 `formatNumber.ts`）
- 目录名：功能模块名（如 `request/`, `error/`）

## 文件组织原则

### 页面组件
- 每个页面一个目录
- 目录内包含：`index.tsx`、`index.module.less`、`service.ts`（可选）
- 页面组件使用默认导出

### 通用组件
- 放在 `src/components/` 目录
- 每个组件一个文件
- 组件名与文件名一致

### 类型定义
- 统一放在 `src/types/` 目录
- 按功能模块分类（api.ts, user.ts 等）
- 通过 `index.ts` 统一导出

### 工具函数
- 按功能分类放在 `src/utils/` 子目录
- 通用工具函数直接放在 `src/utils/` 根目录

### Store
- 所有 Store 文件放在 `src/store/` 目录
- 通过 `index.ts` 统一导出

## 导入路径规范

### 使用路径别名 `@/`
```typescript
// ✅ 正确
import request from '@/utils/request';
import type { UserInfo } from '@/types';
import { useAuthStore } from '@/store';

// ❌ 错误（不要使用相对路径）
import request from '../../utils/request';
```

### 类型导入使用 `import type`
```typescript
// ✅ 正确
import type { UserInfo, ApiResponse } from '@/types';

// ❌ 错误（类型导入不要使用 import）
import { UserInfo } from '@/types';
```

## 代码组织最佳实践

### 1. 页面组件结构
```typescript
// index.tsx
import { App } from 'antd';
import styles from './index.module.less';
import { getUserList } from './service';

function UserPage() {
  // 组件逻辑
}

export default UserPage;
```

### 2. 服务函数组织
```typescript
// service.ts
import request from '@/utils/request';
import type { ApiResponse, UserInfo } from '@/types';

export async function getUserList(): Promise<UserInfo[]> {
  // API 调用
}
```

### 3. Store 组织
```typescript
// authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(...);
```
