# Mock 数据使用文档

本项目使用 Mock.js 和 vite-plugin-mock 来模拟后端 API 数据，支持开发环境下的快速开发和测试。

## 目录结构

```
src/mock/
├── index.ts              # Mock 入口，统一导出所有 mock 配置
├── utils.ts              # Mock 工具函数（响应包装、延迟等）
├── modules/              # 按模块组织的 mock 数据
│   ├── auth.ts          # 认证相关 API mock
│   ├── user.ts          # 用户相关 API mock
│   ├── dashboard.ts     # 仪表盘数据 mock
│   └── common.ts        # 通用 API mock
└── README.md            # 本文档
```

## 快速开始

### 1. 启用/禁用 Mock

通过环境变量 `VITE_USE_MOCK` 控制 Mock 的启用：

- **开发环境** (`.env.development`): `VITE_USE_MOCK=true` (默认启用)
- **生产环境** (`.env.production`): `VITE_USE_MOCK=false` (默认禁用)

### 2. 添加新的 Mock 数据

在 `src/mock/modules/` 目录下创建新的模块文件，或修改现有文件：

```typescript
import Mock from 'mockjs';
import type { MockConfig } from '../utils';
import { successResponse, delay } from '../utils';

const myMocks: MockConfig[] = [
  {
    url: '/api/my-endpoint',
    method: 'get',
    response: async ({ query }) => {
      await delay(300); // 模拟网络延迟

      return successResponse({
        data: Mock.mock({
          'list|10': [
            {
              'id|+1': 1,
              name: '@cname',
              email: '@email',
            },
          ],
        }),
      });
    },
  },
];

export default myMocks;
```

然后在 `src/mock/index.ts` 中导入并导出：

```typescript
import myMocks from './modules/my-module';

const mockConfigs: MockConfig[] = [
  ...myMocks,
  // ... 其他模块
];
```

## Mock 配置格式

每个 Mock 配置包含以下字段：

```typescript
interface MockConfig {
  url: string | RegExp;           // 请求 URL（支持字符串或正则）
  method: 'get' | 'post' | ...;   // HTTP 方法
  response: (options) => any;     // 响应函数
  delay?: number;                 // 延迟时间（毫秒）
  statusCode?: number;            // HTTP 状态码（默认 200）
}
```

### Response 函数参数

```typescript
response: (options: {
  url: string; // 完整请求 URL
  method: string; // HTTP 方法
  body: any; // 请求体（POST/PUT 等）
  query: Record<string, any>; // 查询参数
  headers: Record<string, any>; // 请求头
}) => any;
```

## 工具函数

### 响应包装函数

- `successResponse(data, message?)` - 成功响应
- `errorResponse(message?, code?)` - 错误响应
- `pageResponse(list, total, page?, pageSize?)` - 分页响应

### 其他工具

- `delay(ms)` - 延迟函数，用于模拟网络延迟

## Mock.js 语法

Mock.js 提供了丰富的数据生成语法，常用示例：

```typescript
Mock.mock({
  // 字符串
  name: '@cname', // 中文姓名
  email: '@email', // 邮箱
  url: '@url', // URL
  word: '@word', // 单词

  // 数字
  'age|18-60': 1, // 18-60 之间的随机数
  'score|1-100.1-2': 1, // 1-100 之间的小数，保留 1-2 位

  // 布尔值
  'isActive|1': true, // 50% 概率为 true

  // 数组
  'list|5-10': [
    {
      // 5-10 个元素
      'id|+1': 1, // 自增 ID
      name: '@cname',
    },
  ],

  // 对象
  user: {
    name: '@cname',
    'age|18-60': 1,
  },

  // 日期时间
  createTime: '@datetime("yyyy-MM-dd HH:mm:ss")',

  // 图片
  avatar: '@image("200x200", "@color", "@name")',

  // 随机选择
  role: '@pick(["admin", "user", "guest"])',
});
```

更多语法请参考 [Mock.js 文档](http://mockjs.com/)

## 使用示例

### 1. GET 请求

```typescript
{
  url: '/api/users',
  method: 'get',
  response: async ({ query }) => {
    const page = Number(query?.page) || 1;
    const pageSize = Number(query?.pageSize) || 10;

    return successResponse({
      list: Mock.mock({
        [`list|${pageSize}`]: [{
          'id|+1': (page - 1) * pageSize + 1,
          'name': '@cname',
        }]
      }).list,
      total: 100,
    });
  },
}
```

### 2. POST 请求

```typescript
{
  url: '/api/users',
  method: 'post',
  response: async ({ body }) => {
    await delay(500);

    return successResponse({
      id: Mock.Random.integer(1000, 9999),
      ...body,
    }, '创建成功');
  },
}
```

### 3. 使用正则匹配 URL

```typescript
{
  url: /^\/api\/users\/(\d+)$/,
  method: 'get',
  response: async ({ url }) => {
    const userId = url.match(/\/(\d+)$/)?.[1];
    // ...
  },
}
```

## 工作原理

项目支持两种 Mock 方式：

1. **vite-plugin-mock** (推荐，开发环境)
   - 在 Vite 开发服务器层面拦截请求
   - 无需修改业务代码
   - 仅在开发环境生效

2. **请求拦截器** (备用方案)
   - 在请求工具类中拦截
   - 支持生产环境使用（需手动启用）
   - 通过环境变量控制

## 注意事项

1. Mock 数据仅在开发环境默认启用，生产环境默认禁用
2. 修改 Mock 配置后需要重启开发服务器
3. Mock 数据应该尽量模拟真实 API 的响应格式
4. 使用 `delay()` 函数模拟网络延迟，提升真实感
5. 建议按业务模块组织 Mock 文件，便于维护

## 常见问题

### Q: Mock 不生效？

A: 检查以下几点：

- 确认 `VITE_USE_MOCK=true` 已设置
- 检查 URL 和方法是否匹配
- 查看控制台是否有错误信息
- 尝试重启开发服务器

### Q: 如何调试 Mock？

A:

- 在 `response` 函数中添加 `console.log` 输出
- 检查浏览器 Network 面板，查看请求是否被拦截
- 查看 Vite 控制台的 Mock 日志

### Q: 如何临时禁用某个 Mock？

A: 在对应的 Mock 配置前添加注释，或从 `src/mock/index.ts` 中移除导入。

## 参考资源

- [Mock.js 官方文档](http://mockjs.com/)
- [vite-plugin-mock GitHub](https://github.com/vbenjs/vite-plugin-mock)
