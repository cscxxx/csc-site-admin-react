/**
 * 文章分类服务
 * GET 列表、GET 单条、POST 新增、PUT 修改、DELETE 删除
 */

import request from '@/utils/request';
import type { ApiResponse } from '@/types';
import type { BlogtypeItem, BlogtypeSubmitData } from './types';

/**
 * 获取所有分类
 */
export async function getBlogtypeList(): Promise<BlogtypeItem[]> {
  const { promise } = request.get<ApiResponse<BlogtypeItem[]>>('/api/blogtype');
  const res = await promise;
  const body = res.data;

  if (body.code !== 0) {
    throw new Error(body.msg || '获取分类列表失败');
  }
  if (!Array.isArray(body.data)) {
    return [];
  }
  return body.data;
}

/**
 * 获取单个分类
 */
export async function getBlogtype(id: number): Promise<BlogtypeItem> {
  const { promise } = request.get<ApiResponse<BlogtypeItem>>(`/api/blogtype/${id}`);
  const res = await promise;
  const body = res.data;

  if (body.code !== 0) {
    throw new Error(body.msg || '获取分类失败');
  }
  if (body.data == null) {
    throw new Error('获取分类失败');
  }
  return body.data;
}

/**
 * 新增分类
 */
export async function addBlogtype(data: BlogtypeSubmitData): Promise<BlogtypeItem> {
  const { promise } = request.post<ApiResponse<BlogtypeItem>>('/api/blogtype', {
    name: data.name,
    order: String(data.order),
  });
  const res = await promise;
  const body = res.data;

  if (body.code !== 0) {
    throw new Error(body.msg || '新增失败');
  }
  if (body.data == null) {
    throw new Error('新增失败');
  }
  return body.data;
}

/**
 * 修改分类
 */
export async function updateBlogtype(
  id: number,
  data: BlogtypeSubmitData
): Promise<BlogtypeItem> {
  const { promise } = request.put<ApiResponse<BlogtypeItem>>(`/api/blogtype/${id}`, {
    name: data.name,
    order: String(data.order),
  });
  const res = await promise;
  const body = res.data;

  if (body.code !== 0) {
    throw new Error(body.msg || '修改失败');
  }
  if (body.data == null) {
    throw new Error('修改失败');
  }
  return body.data;
}

/**
 * 删除分类
 */
export async function deleteBlogtype(id: number): Promise<void> {
  const { promise } = request.delete<ApiResponse<number>>(`/api/blogtype/${id}`);
  const res = await promise;
  const body = res.data;

  if (body.code !== 0) {
    throw new Error(body.msg || '删除失败');
  }
}
