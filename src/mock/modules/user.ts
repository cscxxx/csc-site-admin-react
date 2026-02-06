/**
 * 用户相关 API Mock
 */
import Mock from 'mockjs';
import type { MockConfig } from '../utils';
import { successResponse, pageResponse, delay } from '../utils';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  avatar: string;
  createTime: string;
  lastLoginTime: string;
}

const userMocks: MockConfig[] = [
  // 获取用户列表
  {
    url: '/api/users',
    method: 'get',
    response: async ({ query }) => {
      await delay(400);

      const page = Number(query?.page) || 1;
      const pageSize = Number(query?.pageSize) || 10;
      const keyword = query?.keyword || '';

      // 生成用户列表数据
      const total = Mock.Random.integer(50, 200);
      const list = Mock.mock({
        [`list|${pageSize}`]: [
          {
            'id|+1': (page - 1) * pageSize + 1,
            name: '@cname',
            email: '@email',
            phone: /^1[3-9]\d{9}$/,
            role: '@pick(["管理员", "用户", "访客"])',
            status: '@pick(["活跃", "禁用", "待激活"])',
            avatar: '@image("100x100", "@color", "@name")',
            createTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
            lastLoginTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
          },
        ],
      }).list;

      // 如果有关键词，过滤数据
      const filteredList = keyword
        ? list.filter((user: User) => user.name.includes(keyword) || user.email.includes(keyword))
        : list;

      return pageResponse(filteredList, total, page, pageSize);
    },
  },

  // 获取用户详情
  {
    url: /^\/api\/users\/(\d+)$/,
    method: 'get',
    response: async ({ url }) => {
      await delay(300);

      const userId = url.match(/\/(\d+)$/)?.[1] || '1';

      return successResponse({
        id: Number(userId),
        name: Mock.Random.cname(),
        email: Mock.Random.email(),
        phone: Mock.Random.pattern(/^1[3-9]\d{9}$/),
        role: Mock.Random.pick(['管理员', '用户', '访客']),
        status: Mock.Random.pick(['活跃', '禁用', '待激活']),
        avatar: Mock.Random.image('200x200', Mock.Random.color(), 'User'),
        createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
        lastLoginTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
        bio: Mock.Random.cparagraph(1, 3),
        department: Mock.Random.pick(['技术部', '产品部', '运营部', '市场部']),
      });
    },
  },

  // 创建用户
  {
    url: '/api/users',
    method: 'post',
    response: async ({ body }) => {
      await delay(500);

      return successResponse(
        {
          id: Mock.Random.integer(1000, 9999),
          ...(typeof body === 'object' && body !== null ? body : {}),
          createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
        },
        '创建用户成功'
      );
    },
  },

  // 更新用户
  {
    url: /^\/api\/users\/(\d+)$/,
    method: 'put',
    response: async ({ body, url }) => {
      await delay(400);

      const userId = url.match(/\/(\d+)$/)?.[1] || '1';

      return successResponse(
        {
          id: Number(userId),
          ...(typeof body === 'object' && body !== null ? body : {}),
          updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
        },
        '更新用户成功'
      );
    },
  },

  // 删除用户
  {
    url: /^\/api\/users\/(\d+)$/,
    method: 'delete',
    response: async () => {
      await delay(300);

      return successResponse(null, '删除用户成功');
    },
  },

  // 批量删除用户
  {
    url: '/api/users/batch',
    method: 'delete',
    response: async ({ body }) => {
      await delay(400);

      const { ids } = body || {};
      return successResponse(
        { deletedCount: Array.isArray(ids) ? ids.length : 0 },
        `成功删除 ${Array.isArray(ids) ? ids.length : 0} 个用户`
      );
    },
  },
];

export default userMocks;
