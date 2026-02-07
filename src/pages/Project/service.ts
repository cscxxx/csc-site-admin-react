/**
 * 示例项目服务
 * GET 列表；POST 新增、PUT 修改、DELETE 删除（需 token）
 */

import request from '@/utils/request';
import type { ApiResponse } from '@/types';
import type { ProjectItem, ProjectSubmitData } from './types';

/**
 * 获取项目列表
 */
export async function getProjectList(): Promise<ProjectItem[]> {
  const { promise } = request.get<ApiResponse<ProjectItem[]>>('/api/project');
  const res = await promise;
  const body = res.data;

  if (body.code !== 0) {
    throw new Error(body.msg || '获取项目列表失败');
  }
  if (!Array.isArray(body.data)) {
    return [];
  }
  return body.data;
}

/**
 * 新增项目
 */
export async function addProject(data: ProjectSubmitData): Promise<ProjectItem[]> {
  const { promise } = request.post<ApiResponse<ProjectItem[]>>('/api/project', data);
  const res = await promise;
  const body = res.data;

  if (body.code !== 0) {
    throw new Error(body.msg || '新增失败');
  }
  return Array.isArray(body.data) ? body.data : [];
}

/**
 * 修改项目（请求体与新增一致，不含 id）
 */
export async function updateProject(
  id: number,
  data: ProjectSubmitData
): Promise<ProjectItem[]> {
  const { promise } = request.put<ApiResponse<ProjectItem[]>>(`/api/project/${id}`, data);
  const res = await promise;
  const body = res.data;

  if (body.code !== 0) {
    throw new Error(body.msg || '修改失败');
  }
  return Array.isArray(body.data) ? body.data : [];
}

/**
 * 删除项目
 */
export async function deleteProject(id: number): Promise<boolean> {
  const { promise } = request.delete<ApiResponse<boolean>>(`/api/project/${id}`);
  const res = await promise;
  const body = res.data;

  if (body.code !== 0) {
    throw new Error(body.msg || '删除失败');
  }
  return body.data === true;
}
