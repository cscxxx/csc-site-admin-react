# 项目术语表

## 核心概念

### Store
使用 Zustand 创建的状态管理单元。文件命名格式：`*Store.ts`（如 `authStore.ts`）。

**特性：**
- 使用 `create` 创建
- 支持 `persist` middleware 持久化
- 支持多标签页同步

### Service
API 服务函数文件，通常放在页面目录下，命名：`service.ts`。

**职责：**
- 封装 API 调用逻辑
- 定义请求和响应类型
- 处理错误响应

### LazyRoute
懒加载路由包装组件，用于代码分割和过渡动画。

**用途：**
- 包装使用 `React.lazy` 加载的组件
- 提供加载状态和过渡动画
- 优化首屏加载性能

### ProtectedRoute
路由守卫组件，用于保护需要认证的路由。

**功能：**
- 检查用户认证状态
- 未认证时重定向到登录页
- 已认证时渲染子组件

## 技术栈术语

### React Router DOM v7
项目使用的路由库，使用 `createBrowserRouter` 创建路由。

### Zustand
轻量级状态管理库，用于管理应用状态。

### Ant Design v6
UI 组件库，提供丰富的组件和样式。

### Web Vitals
Web 性能指标，包括 LCP、INP、CLS、FCP、TTFB。

## 代码组织术语

### 路径别名 `@/`
TypeScript 路径别名，指向 `src/` 目录。

**使用：**
```typescript
import request from '@/utils/request';
```

### Less 模块化样式
使用 `.module.less` 后缀的样式文件，通过 CSS Modules 实现样式隔离。

### 类型定义
TypeScript 类型和接口定义，统一放在 `src/types/` 目录。

## API 相关术语

### Token
认证令牌，存储在 localStorage，格式：`Bearer {token}`。

### 请求拦截器
在发送请求前执行的函数，用于修改请求配置（如添加 token）。

### 响应拦截器
在收到响应后执行的函数，用于处理响应数据。

### 错误拦截器
在请求失败时执行的函数，用于统一处理错误。

## 性能相关术语

### LCP (Largest Contentful Paint)
最大内容绘制，衡量页面加载性能。

### INP (Interaction to Next Paint)
交互到下次绘制，衡量交互响应性能（替代 FID）。

### CLS (Cumulative Layout Shift)
累积布局偏移，衡量视觉稳定性。

### FCP (First Contentful Paint)
首次内容绘制，衡量页面首次渲染时间。

### TTFB (Time to First Byte)
首字节时间，衡量服务器响应速度。

## 开发术语

### Conventional Commits
提交信息规范，格式：`<type>(<scope>): <subject>`。

### Fast Refresh
React 快速刷新功能，修改代码后自动更新组件。

### Error Boundary
React 错误边界，用于捕获组件树中的 JavaScript 错误。

### Mock
模拟数据，用于开发和测试阶段模拟后端 API。
