/**
 * 管理员（Admin）服务
 * 对应接口 /api/admin，管理员信息与修改密码
 */

import request from '@/utils/request';
import type { ApiResponse } from '@/types';

/** 修改管理员信息（含密码）请求参数 */
export interface UpdateAdminParams {
  /** 显示名称 */
  name: string;
  /** 登录账号 */
  loginId: string;
  /** 新密码 */
  loginPwd: string;
  /** 旧密码 */
  oldLoginPwd: string;
}

/** 修改成功返回的数据 */
export interface UpdateAdminResult {
  loginId: string;
  name: string;
  id: number;
}

/**
 * 修改管理员信息（含密码）
 * @param params 请求体
 * @returns 成功时返回 data
 */
export async function updateAdmin(
  params: UpdateAdminParams
): Promise<UpdateAdminResult> {
  const { promise } = request.put<ApiResponse<UpdateAdminResult>>(
    '/api/admin',
    params
  );
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
