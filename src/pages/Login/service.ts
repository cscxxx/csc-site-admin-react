import request from '@/utils/request';

/**
 * 登录请求参数
 */
export interface LoginParams {
  loginId: string;
  loginPwd: string;
  captcha: string;
  remember: number;
}

/**
 * 登录响应数据
 */
export interface LoginResponseData {
  id: number;
  loginId: string;
  name: string;
}

/**
 * 登录响应（成功时）
 */
export interface LoginResponse {
  code: number;
  msg: string;
  data: LoginResponseData | null;
}

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
