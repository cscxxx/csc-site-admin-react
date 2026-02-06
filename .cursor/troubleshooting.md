# 常见问题和解决方案

## 路由相关问题

### 路由不工作

**问题：** 路由跳转后页面没有变化或显示 404。

**解决方案：**
1. 检查路由是否在 `src/router/index.tsx` 中定义
2. 检查是否使用了 `ProtectedRoute` 包装受保护路由
3. 检查路由路径是否正确（区分大小写）
4. 检查是否使用了 `LazyRoute` 包装懒加载组件

**示例：**
```typescript
// ✅ 正确
{
  path: 'users',
  element: <LazyRoute component={Users} />,
}

// ❌ 错误（缺少 LazyRoute）
{
  path: 'users',
  element: <Users />,
}
```

### 路由守卫不生效

**问题：** 未登录用户可以访问受保护的路由。

**解决方案：**
1. 检查 `ProtectedRoute` 组件是否正确检查认证状态
2. 检查 `useAuthStore` 是否正确初始化
3. 检查 token 是否正确存储在 localStorage

## API 请求相关问题

### API 请求失败

**问题：** API 请求返回错误或无法连接。

**解决方案：**
1. 检查 Vite proxy 配置是否正确
2. 检查请求拦截器是否正确添加 token
3. 检查 API 路径是否正确（注意 `/api` 前缀）
4. 检查后端服务是否启动（`http://localhost:3001`）

**检查清单：**
- [ ] `vite.config.ts` 中的 proxy 配置
- [ ] 请求拦截器中 token 添加逻辑
- [ ] 后端服务是否运行
- [ ] 网络请求是否被浏览器阻止

### Token 未自动添加

**问题：** 请求头中没有 `Authorization` 字段。

**解决方案：**
1. 检查请求拦截器是否正确注册
2. 检查 localStorage 中是否有 token（键名：`csc-site-admin-token`）
3. 检查 token 格式是否正确（`Bearer {token}`）

**调试方法：**
```typescript
// 在请求拦截器中添加日志
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('csc-site-admin-token');
  console.log('Token:', token);
  // ...
});
```

### 401 未授权错误

**问题：** 请求返回 401 状态码。

**解决方案：**
1. 检查 token 是否过期
2. 检查 token 格式是否正确
3. 检查后端是否正确验证 token
4. 重新登录获取新 token

## 状态管理问题

### Store 状态不更新

**问题：** 修改 Store 状态后组件没有重新渲染。

**解决方案：**
1. 检查是否使用了 selector 选择状态
2. 检查组件是否正确订阅了 Store
3. 检查状态更新逻辑是否正确

**示例：**
```typescript
// ✅ 正确（使用 selector）
const userInfo = useUserStore((state) => state.userInfo);

// ❌ 错误（会订阅整个 Store，可能导致不必要的重渲染）
const { userInfo } = useUserStore();
```

### 持久化不生效

**问题：** Store 状态刷新页面后丢失。

**解决方案：**
1. 检查是否使用了 `persist` middleware
2. 检查 `name` 配置是否正确
3. 检查 localStorage 是否可用
4. 检查浏览器是否禁用了 localStorage

## 样式问题

### 样式不生效

**问题：** 样式文件修改后没有效果。

**解决方案：**
1. 检查样式文件是否使用 `.module.less` 后缀
2. 检查类名是否正确导入和使用
3. 检查是否有样式冲突（CSS 优先级）
4. 清除浏览器缓存并重新加载

**示例：**
```typescript
// ✅ 正确
import styles from './index.module.less';
<div className={styles.container}>

// ❌ 错误（直接使用字符串）
<div className="container">
```

### Less 变量未定义

**问题：** 编译时提示 Less 变量未定义。

**解决方案：**
1. 检查变量是否在 `src/styles/variables.less` 中定义
2. 检查是否在样式文件中导入了变量文件
3. 使用已定义的变量或直接使用值

## TypeScript 问题

### 类型错误

**问题：** TypeScript 编译报错。

**解决方案：**
1. 检查是否使用了 `any`（应使用 `unknown`）
2. 检查类型定义是否正确
3. 检查导入路径是否正确（使用 `@/` 别名）
4. 检查类型导入是否使用了 `import type`

### 模块找不到

**问题：** 导入模块时提示找不到。

**解决方案：**
1. 检查文件路径是否正确
2. 检查是否使用了路径别名 `@/`
3. 检查文件扩展名是否正确
4. 检查 `tsconfig.json` 中的路径配置

## 性能问题

### 页面加载慢

**问题：** 页面首次加载时间过长。

**解决方案：**
1. 检查是否使用了路由懒加载
2. 检查是否有未使用的依赖
3. 检查图片和资源是否过大
4. 使用浏览器 DevTools 分析性能

### 组件渲染慢

**问题：** 组件更新时渲染缓慢。

**解决方案：**
1. 检查是否使用了 `React.memo` 优化纯组件
2. 检查是否使用了 `useCallback` 和 `useMemo`
3. 检查是否有不必要的重渲染
4. 使用 React DevTools Profiler 分析

## 构建问题

### 构建失败

**问题：** `pnpm build` 命令执行失败。

**解决方案：**
1. 检查 TypeScript 类型错误
2. 检查 ESLint 错误
3. 清除 `node_modules` 和 `dist` 目录后重新安装
4. 检查 Node.js 版本是否兼容

### 开发服务器启动失败

**问题：** `pnpm dev` 无法启动。

**解决方案：**
1. 检查端口是否被占用
2. 检查 `vite.config.ts` 配置是否正确
3. 清除缓存：`rm -rf node_modules/.vite`
4. 重新安装依赖：`pnpm install`

## 常见错误信息

### "Cannot access refs during render"
**原因：** 在渲染期间访问了 ref。

**解决：** 将 ref 访问移到 `useEffect` 或事件处理器中。

### "React Hook useEffect has missing dependencies"
**原因：** `useEffect` 依赖数组不完整。

**解决：** 添加所有外部依赖到依赖数组，或使用 ESLint 注释忽略。

### "[antd: Table] `index` parameter of `rowKey` function is deprecated"
**原因：** Table 的 `rowKey` 使用了已弃用的 `index` 参数。

**解决：** 使用数据本身的唯一标识字段（如 `id`）。

### "Fast refresh only works when a file only exports components"
**原因：** 文件同时导出了组件和其他内容。

**解决：** 将非组件内容移到单独的文件中。
