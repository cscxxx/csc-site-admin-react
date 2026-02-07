/**
 * Banner 服务函数
 * 处理首页标语（Banner）相关的 API 请求
 */

import request from '@/utils/request';
import type { ApiResponse, BannerItem, BannerSubmitItem } from '@/types';
// 使用 Mock 数据（取消注释以启用）
// import { getBannerListMock, updateBannerListMock } from './mock';

/**
 * 获取 Banner 列表
 * @returns Banner 列表数据
 */
export async function getBannerList(): Promise<BannerItem[]> {
  // 使用 Mock 数据（取消注释以启用）
  // return await getBannerListMock();

  const { promise } = request.get<ApiResponse<BannerItem[]>>('/api/banner');
  const response = await promise;

  if (response.data.code === 0 && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.msg || '获取 Banner 列表失败');
}

/**
 * 更新 Banner 列表
 * @param data Banner 提交数据数组（不包含 id）
 * @returns 更新结果
 */
export async function updateBannerList(
  data: BannerSubmitItem[]
): Promise<ApiResponse<unknown>> {
  // 使用 Mock 数据（取消注释以启用）
  // return await updateBannerListMock(data);

  const { promise } = request.post<ApiResponse<unknown>>('/api/banner', data);
  const response = await promise;

  if (response.data.code === 0) {
    return response.data;
  }

  throw new Error(response.data.msg || '更新 Banner 列表失败');
}
