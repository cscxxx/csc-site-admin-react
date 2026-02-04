/**
 * 认证相关 API Mock
 */
import Mock from 'mockjs';
import type { MockConfig } from '../utils';
import { successResponse, errorResponse, delay } from '../utils';

const authMocks: MockConfig[] = [
  // 登录接口
  {
    url: '/api/auth/login',
    method: 'post',
    response: async ({ body }) => {
      await delay(500); // 模拟网络延迟

      const { username, password } = body || {};

      // 模拟登录验证
      if (username === 'admin' && password === 'admin') {
        return successResponse(
          {
            token: Mock.mock('@guid'),
            userInfo: {
              id: 1,
            username: 'admin',
              name: '管理员',
              email: 'admin@example.com',
              avatar: Mock.Random.image('100x100', Mock.Random.color(), 'Admin'),
              role: 'admin',
            },
          },
          '登录成功'
        );
      }

      return errorResponse('用户名或密码错误', 401);
    },
  },

  // 登出接口
  {
    url: '/api/auth/logout',
    method: 'post',
    response: async () => {
      await delay(200);
      return successResponse(null, '登出成功');
    },
  },

  // 获取当前用户信息
  {
    url: '/api/auth/userinfo',
    method: 'get',
    response: async () => {
      await delay(300);
      return successResponse({
        id: 1,
        username: 'admin',
        name: '管理员',
        email: 'admin@example.com',
        avatar: Mock.Random.image('100x100', Mock.Random.color(), 'Admin'),
        role: 'admin',
        permissions: ['dashboard', 'users', 'settings'],
      });
    },
  },

  // 刷新 token
  {
    url: '/api/auth/refresh',
    method: 'post',
    response: async () => {
      await delay(200);
      return successResponse({
        token: Mock.mock('@guid'),
        expiresIn: 7200,
      });
    },
  },
];

export default authMocks;
