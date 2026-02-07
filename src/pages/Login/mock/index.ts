/**
 * Login Mock 数据
 * 用于开发时模拟 API 响应
 */

import Mock from 'mockjs';
import { delay } from '@/mock/utils';
import type { LoginParams, LoginResponse } from '@/types';

/**
 * 获取登录验证码 Mock
 * @returns 返回 SVG 字符串
 */
export async function getCaptchaMock(): Promise<string> {
  await delay(200);

  // 返回一个简单的 SVG 验证码
  return `<svg width="100" height="40" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="40" fill="#f0f0f0"/>
    <text x="50" y="25" font-family="Arial" font-size="20" text-anchor="middle" fill="#333">1234</text>
  </svg>`;
}

/**
 * 登录 Mock
 * @param params 登录参数
 * @returns 返回登录响应和 token
 */
export async function loginMock(params: LoginParams): Promise<{
  response: LoginResponse;
  token: string;
}> {
  await delay(500);

  const { loginId, loginPwd } = params;

  // 模拟登录验证
  if (loginId === 'admin' && loginPwd === 'admin') {
    const mockResponse: LoginResponse = {
      code: 0,
      msg: '登录成功',
      data: {
        id: 1,
        loginId: 'admin',
        name: '管理员',
        avatar: Mock.Random.image('100x100', Mock.Random.color(), 'Admin'),
      },
    };

    const token = `Bearer ${Mock.mock('@guid')}`;

    return {
      response: mockResponse,
      token,
    };
  }

  // 登录失败
  const errorResponseData: LoginResponse = {
    code: 401,
    msg: '用户名或密码错误',
    data: null,
  };

  return {
    response: errorResponseData,
    token: '',
  };
}
