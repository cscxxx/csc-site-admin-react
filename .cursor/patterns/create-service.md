# 创建 API 服务函数的标准模式

## 文件位置

API 服务函数应放在对应页面的 `service.ts` 文件中：

```
src/pages/Users/
├── index.tsx
├── index.module.less
└── service.ts  ← API 服务函数
```

## 标准模式

### 1. 导入依赖

```typescript
import request from '@/utils/request';
import type { ApiResponse, UserInfo } from '@/types';
```

### 2. 定义请求/响应类型

```typescript
// 请求参数类型
export interface GetUserListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

// 响应数据类型（如果不在 types 中定义）
export interface UserListData {
  list: UserInfo[];
  total: number;
}
```

### 3. 创建服务函数

```typescript
/**
 * 获取用户列表
 * @param params 查询参数
 * @returns 用户列表数据
 */
export async function getUserList(
  params?: GetUserListParams
): Promise<UserListData> {
  const { promise } = request.get<ApiResponse<UserListData>>('/api/users', {
    params,
  });
  const response = await promise;
  
  if (response.data.code !== 0) {
    throw new Error(response.data.msg);
  }
  
  return response.data.data!;
}
```

## 完整示例

### GET 请求示例

```typescript
import request from '@/utils/request';
import type { ApiResponse, UserInfo, PaginationParams } from '@/types';

/**
 * 获取用户列表
 */
export async function getUserList(
  params?: PaginationParams
): Promise<UserInfo[]> {
  const { promise } = request.get<ApiResponse<UserInfo[]>>('/api/users', {
    params,
  });
  const response = await promise;
  
  if (response.data.code !== 0) {
    throw new Error(response.data.msg);
  }
  
  return response.data.data || [];
}

/**
 * 获取用户详情
 */
export async function getUserById(id: number): Promise<UserInfo> {
  const { promise } = request.get<ApiResponse<UserInfo>>(`/api/users/${id}`);
  const response = await promise;
  
  if (response.data.code !== 0) {
    throw new Error(response.data.msg);
  }
  
  if (!response.data.data) {
    throw new Error('用户不存在');
  }
  
  return response.data.data;
}
```

### POST 请求示例

```typescript
import request from '@/utils/request';
import type { ApiResponse, UserInfo } from '@/types';

export interface CreateUserParams {
  name: string;
  email: string;
  role?: string;
}

export interface CreateUserResult {
  id: number;
}

/**
 * 创建用户
 */
export async function createUser(
  params: CreateUserParams
): Promise<CreateUserResult> {
  const { promise } = request.post<ApiResponse<CreateUserResult>>(
    '/api/users',
    params
  );
  const response = await promise;
  
  if (response.data.code !== 0) {
    throw new Error(response.data.msg);
  }
  
  if (!response.data.data) {
    throw new Error('创建失败');
  }
  
  return response.data.data;
}
```

### PUT/DELETE 请求示例

```typescript
/**
 * 更新用户
 */
export async function updateUser(
  id: number,
  params: Partial<CreateUserParams>
): Promise<void> {
  const { promise } = request.put<ApiResponse<void>>(
    `/api/users/${id}`,
    params
  );
  const response = await promise;
  
  if (response.data.code !== 0) {
    throw new Error(response.data.msg);
  }
}

/**
 * 删除用户
 */
export async function deleteUser(id: number): Promise<void> {
  const { promise } = request.delete<ApiResponse<void>>(`/api/users/${id}`);
  const response = await promise;
  
  if (response.data.code !== 0) {
    throw new Error(response.data.msg);
  }
}
```

## 错误处理

### 标准错误处理模式

```typescript
export async function getUserList(): Promise<UserInfo[]> {
  try {
    const { promise } = request.get<ApiResponse<UserInfo[]>>('/api/users');
    const response = await promise;
    
    if (response.data.code !== 0) {
      throw new Error(response.data.msg);
    }
    
    return response.data.data || [];
  } catch (error) {
    // 错误已通过请求拦截器统一处理（显示 message.error）
    // 这里可以添加额外的错误处理逻辑
    throw error;
  }
}
```

## 特殊请求处理

### 非 JSON 响应（如 SVG）

```typescript
/**
 * 获取验证码（返回 SVG）
 */
export async function getCaptcha(): Promise<string> {
  const { promise } = request.get<string>('/res/captcha', {
    autoParseJSON: false, // SVG 是文本格式，不需要解析 JSON
  });
  const response = await promise;
  return response.data;
}
```

### 从响应头获取数据

```typescript
/**
 * 登录（从响应头获取 token）
 */
export async function login(params: LoginParams): Promise<{
  response: LoginResponse;
  token: string;
}> {
  const { promise } = request.post<LoginResponse>('/api/admin/login', params);
  const response = await promise;
  
  // 从响应头获取 authentication
  const authentication = response.headers.get('authentication') || '';
  const token = authentication ? `Bearer ${authentication}` : '';
  
  return {
    response: response.data,
    token,
  };
}
```

## 最佳实践

1. **类型安全**: 为所有函数参数和返回值定义类型
2. **错误处理**: 统一检查 `code !== 0` 并抛出错误
3. **空值处理**: 使用 `|| []` 或 `|| null` 处理可能的空值
4. **函数命名**: 使用动词开头（get, create, update, delete）
5. **JSDoc 注释**: 为每个函数添加注释说明用途
6. **类型导入**: 使用 `import type` 导入类型
7. **统一导出**: 所有服务函数在同一文件中导出
