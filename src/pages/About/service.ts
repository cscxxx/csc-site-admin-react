/**
 * 关于页面服务
 * GET /api/about 获取关于链接，POST /api/about 提交关于链接
 */

import request from '@/utils/request';
import type { ApiResponse } from '@/types';

/**
 * 获取关于页面链接
 * @returns 关于页面的 URL 字符串
 */
export async function getAbout(): Promise<string> {
  const { promise } = request.get<ApiResponse<string>>('/api/about');
  const res = await promise;
  const body = res.data;

  if (body.code !== 0) {
    throw new Error(body.msg || '获取关于信息失败');
  }
  if (body.data == null) {
    return '';
  }
  return body.data;
}

/**
 * 更新关于页面链接
 * @param url 关于页面的 URL
 * @returns 更新后的 URL
 */
export async function updateAbout(url: string): Promise<string> {
  const { promise } = request.post<ApiResponse<string>>('/api/about', { url });
  const res = await promise;
  const body = res.data;

  if (body.code !== 0) {
    throw new Error(body.msg || '修改关于信息失败');
  }
  if (body.data == null) {
    throw new Error('修改关于信息失败');
  }
  return body.data;
}
