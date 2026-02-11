/**
 * Banner 服务：对接 /api/banner 增删改查
 * GET 列表、POST 新增、PUT /:id 更新、DELETE /:id 删除
 */

import request from '@/utils/request';
import type { ApiResponse } from '@/types';
import type { BannerItem, BannerSubmitItem, BannerUpdateItem } from '@/types';

/**
 * 获取 Banner 列表（GET /api/banner）
 */
export async function getBannerList(): Promise<BannerItem[]> {
  const { promise } = request.get<ApiResponse<BannerItem[]>>('/api/bannerAll');
  const res = await promise;
  const body = res.data;
  if (body.code !== 0) {
    throw new Error(body.msg || '获取 Banner 列表失败');
  }
  if (!Array.isArray(body.data)) {
    return [];
  }
  return body.data;
}

/**
 * 新增一条 Banner（POST /api/banner）
 */
export async function addBanner(data: BannerSubmitItem): Promise<boolean> {
  const { promise } = request.post<ApiResponse<boolean>>('/api/banner', {
    ...data,
    order: data.order ?? 0,
    isShow: data.isShow ?? true,
  });
  const res = await promise;
  const body = res.data;
  if (body.code !== 0) {
    throw new Error(body.msg || '新增失败');
  }
  return body.data === true;
}

/**
 * 根据 id 更新一条 Banner（PUT /api/banner/:id）
 */
export async function updateBanner(id: number, data: BannerUpdateItem): Promise<boolean> {
  const { promise } = request.put<ApiResponse<boolean>>(`/api/banner/${id}`, data);
  const res = await promise;
  const body = res.data;
  if (body.code !== 0) {
    throw new Error(body.msg || '更新失败');
  }
  return body.data === true;
}

/**
 * 根据 id 删除一条 Banner（DELETE /api/banner/:id）
 */
export async function deleteBanner(id: number): Promise<boolean> {
  const { promise } = request.delete<ApiResponse<boolean>>(`/api/banner/${id}`);
  const res = await promise;
  const body = res.data;
  if (body.code !== 0) {
    throw new Error(body.msg || '删除失败');
  }
  return body.data === true;
}
