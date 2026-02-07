/**
 * 图片上传服务
 * 调用 /api/upload 接口，请求头由全局拦截器自动添加 Authorization: Bearer <token>
 */

import type { ApiResponse } from '@/types';
import type { UploadApiResponse } from './types';
import request from '@/utils/request';

const UPLOAD_URL = '/api/upload';

/**
 * 上传单张图片
 * @param file 文件对象
 * @returns 上传成功后的图片地址
 */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const { promise } = request.post<ApiResponse<string>>(UPLOAD_URL, formData);

  const response = await promise;
  const body = response.data as UploadApiResponse;

  if (body.code !== 0 || body.data == null) {
    throw new Error(body.msg || '上传失败');
  }

  return body.data;
}
