/**
 * 留言板相关类型
 */

/** 单条留言 */
export interface MessageItem {
  id: number;
  nickname: string;
  content: string;
  createDate: string;
  avatar: string;
  blogId: number;
}

/** 留言列表查询参数（对应地址栏） */
export interface MessageListParams {
  page: number;
  limit: number;
  keyword?: string;
  blogid?: number;
}

/** 留言列表接口返回的 data 结构 */
export interface MessageListData {
  total: number;
  rows: MessageItem[];
}
