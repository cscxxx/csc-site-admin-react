/**
 * 博客文章服务
 * GET 列表、GET 单条、POST 新增、PUT 修改、DELETE 删除
 */

import request from '@/utils/request';
import type { ApiResponse } from '@/types';
import type { BlogItem, BlogListParams, BlogListData, BlogSubmitData } from './types.ts';

/**
 * 获取文章列表（分页、关键词、分类）
 */
export async function getBlogList(params: BlogListParams): Promise<BlogListData> {
  const { promise } = request.get<ApiResponse<BlogListData>>('/api/blog', {
    params: {
      page: params.page,
      limit: params.limit,
      ...(params.keyword ? { keyword: params.keyword } : {}),
      ...(params.categoryid != null ? { categoryid: params.categoryid } : {}),
    },
  });
  const res = await promise;
  const body = res.data;

  if (body.code !== 0) {
    throw new Error(body.msg || '获取文章列表失败');
  }
  if (body.data == null) {
    return { total: 0, rows: [] };
  }
  return body.data;
}

/**
 * 获取单篇文章
 */
export async function getBlog(id: number): Promise<BlogItem> {
  const { promise } = request.get<ApiResponse<BlogItem>>(`/api/blog/${id}`);
  const res = await promise;
  const body = res.data;

  if (body.code !== 0) {
    throw new Error(body.msg || '获取文章失败');
  }
  if (body.data == null) {
    throw new Error('获取文章失败');
  }
  return body.data;
}

/**
 * 新增文章
 */
export async function addBlog(data: BlogSubmitData): Promise<BlogItem> {
  const { promise } = request.post<ApiResponse<BlogItem>>('/api/blog', {
    ...data,
    toc: data.toc ?? [],
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
 * 修改文章
 */
export async function updateBlog(id: number, data: BlogSubmitData): Promise<BlogItem> {
  const { promise } = request.put<ApiResponse<BlogItem>>(`/api/blog/${id}`, {
    ...data,
    toc: data.toc ?? [],
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
 * 删除文章
 */
export async function deleteBlog(id: number): Promise<void> {
  const { promise } = request.delete<ApiResponse<unknown>>(`/api/blog/${id}`);
  const res = await promise;
  const body = res.data;

  if (body.code !== 0) {
    throw new Error(body.msg || '删除失败');
  }
}
