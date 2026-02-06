# API 接口规范

## 基础配置

### 基础 URL
- **开发环境**: 通过 Vite proxy 代理到 `http://localhost:3001`
- **API 前缀**: `/api` - 所有 API 接口使用此前缀
- **资源前缀**: `/res` - 静态资源接口（如图片、验证码等）

### Vite Proxy 配置
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
    '/res': {
      target: 'http://localhost:3001',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/res/, ''),
    },
  },
}
```

## 认证机制

### Token 存储
- **存储位置**: `localStorage`
- **存储键名**: `csc-site-admin-token`
- **Token 格式**: `Bearer {token}`

### Token 获取
- 登录接口响应头中包含 `authentication` 字段
- 需要手动添加 `Bearer ` 前缀后存储

### 请求头自动添加
- 请求拦截器自动从 localStorage 读取 token
- 自动添加 `Authorization: Bearer {token}` 请求头

### 认证失败处理
- HTTP 401 状态码表示未授权或 token 过期
- 自动跳转到登录页面
- 清除本地存储的 token

## 统一响应格式

所有 API 接口遵循以下响应格式：

```typescript
{
  code: number;    // 0 表示成功，非 0 表示失败
  msg: string;     // 响应消息（成功时通常为空字符串）
  data: T | null;  // 响应数据（失败时为 null）
}
```

### 响应码说明
- `0`: 请求成功
- `401`: 未授权，需要重新登录
- `400`: 请求参数错误
- `403`: 没有权限
- `404`: 资源不存在
- `500+`: 服务器错误

## 常见接口

### 认证相关

#### 登录
- **接口**: `POST /api/admin/login`
- **请求参数**:
  ```typescript
  {
    loginId: string;    // 登录 ID
    loginPwd: string;   // 登录密码
    captcha: string;    // 验证码
    remember: number;   // 记住我（天数，0 表示不记住）
  }
  ```
- **响应**: `ApiResponse<LoginResponseData>`
- **响应头**: `authentication` 字段包含 token

#### 获取验证码
- **接口**: `GET /res/captcha`
- **响应**: SVG 字符串（需要设置 `autoParseJSON: false`）

### 错误响应示例

```typescript
// 401 未授权
{
  code: 401,
  msg: "未登录，或者登录已经过期",
  data: null
}
```

## 请求工具使用

### 基础用法
```typescript
import request from '@/utils/request';
import type { ApiResponse } from '@/types';

// GET 请求
const { promise } = request.get<ApiResponse<UserInfo>>('/api/users/1');
const response = await promise;
const userInfo = response.data.data;

// POST 请求
const { promise } = request.post<ApiResponse<CreateResult>>('/api/users', {
  name: 'John',
  email: 'john@example.com'
});
const response = await promise;
```

### 错误处理
```typescript
try {
  const { promise } = request.get('/api/users');
  const response = await promise;
  if (response.data.code !== 0) {
    throw new Error(response.data.msg);
  }
  // 处理成功响应
} catch (error) {
  // 错误已通过拦截器统一处理
  console.error('请求失败:', error);
}
```

### 请求取消
```typescript
const { promise, cancel } = request.get('/api/users');

// 取消请求
cancel();
```

## 服务函数规范

API 服务函数的创建模式请参考：`.cursor/patterns/create-service.md`
