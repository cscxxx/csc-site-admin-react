import request from '@/utils/request';
import type { LoginParams, LoginResponse } from '@/types';
// 使用 Mock 数据（取消注释以启用）
// import { getCaptchaMock, loginMock } from './mock';

/**
 * 登录错误响应
 */
export interface LoginErrorResponse {
  code: number;
  msg: string;
  data: null;
}

/**
 * 获取登录验证码
 * @returns 返回 SVG 字符串
 */
export async function getCaptcha(): Promise<string> {
  // 使用 Mock 数据（取消注释以启用）
  // return await getCaptchaMock();

  const { promise } = request.get<string>('/res/captcha', {
    autoParseJSON: false, // SVG 是文本格式，不需要解析 JSON
  });
  const response = await promise;
  return response.data;
}

/**
 * 登录
 * @param params 登录参数
 * @returns 返回登录响应和 token
 */
export async function login(params: LoginParams): Promise<{
  response: LoginResponse;
  token: string;
}> {
  // 使用 Mock 数据（取消注释以启用）
  // return await loginMock(params);

  const { promise } = request.post<LoginResponse>('/api/admin/login', params);
  const res = await promise;
  const body = res.data as LoginResponse;

  // 业务失败：code 非 0 或 HTTP 未成功
  if (body.code !== 0) {
    throw new Error(body.msg || '登录失败');
  }
  if (res.status >= 400) {
    throw new Error(body.msg || '请求失败');
  }

  // 从响应头获取 token（仅保存原始值，不含 Bearer 前缀）
  const authHeader =
    res.headers.get('authentication') || res.headers.get('Authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  if (!token) {
    throw new Error('未获取到登录凭证，请重试');
  }

  return {
    response: body,
    token,
  };
}
