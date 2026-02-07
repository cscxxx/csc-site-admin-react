/**
 * 留言板服务
 * GET /api/message 分页查询，DELETE /api/message/:id 删除（需 token）
 */

import request from '@/utils/request';
import type { ApiResponse } from '@/types';
import type { MessageListParams, MessageListData } from './types';

/**
 * 获取留言列表
 * @param params page、limit、keyword、blogid
 */
export async function getMessageList(
  params: MessageListParams
): Promise<MessageListData> {
  const { promise } = request.get<ApiResponse<MessageListData>>('/api/message', {
    params: {
      page: params.page,
      limit: params.limit,
      ...(params.keyword ? { keyword: params.keyword } : {}),
      ...(params.blogid != null ? { blogid: params.blogid } : {}),
    },
  });
  const res = await promise;
  const body = res.data;

  if (body.code !== 0) {
    throw new Error(body.msg || '获取留言列表失败');
  }
  if (body.data == null) {
    return { total: 0, rows: [] };
  }
  return body.data;
}

/**
 * 删除一条留言（需 token）
 * @param id 留言 id
 */
export async function deleteMessage(id: number): Promise<boolean> {
  const { promise } = request.delete<ApiResponse<boolean>>(`/api/message/${id}`);
  const res = await promise;
  const body = res.data;

  if (body.code !== 0) {
    throw new Error(body.msg || '删除失败');
  }
  return body.data === true;
}
