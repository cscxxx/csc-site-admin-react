/**
 * 设置服务
 * 对应接口 GET /api/setting
 */

import request from '@/utils/request';
import type { ApiResponse, SettingData } from '@/types';

/**
 * 获取设置信息
 * @returns 设置数据
 */
export async function getSetting(): Promise<SettingData> {
  const { promise } = request.get<ApiResponse<SettingData>>('/api/setting');
  const res = await promise;
  const body = res.data;

  if (body.code !== 0) {
    throw new Error(body.msg || '获取设置失败');
  }
  if (body.data == null) {
    throw new Error('获取设置失败');
  }
  return body.data;
}
