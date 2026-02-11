/**
 * Banner 相关类型定义
 */

/**
 * Banner 数据项（GET 列表不返回 isShow）
 */
export interface BannerItem {
  id: number;
  midImg: string;
  bigImg: string;
  title: string;
  description: string;
  /** 排序，数值越小越靠前 */
  order?: number;
  /** 仅编辑时使用，列表接口可能不返回 */
  isShow?: boolean;
}

/**
 * 新增 Banner 请求体（POST）
 */
export interface BannerSubmitItem {
  midImg: string;
  bigImg: string;
  title: string;
  description: string;
  order?: number;
  isShow?: boolean;
}

/**
 * 更新 Banner 请求体（PUT，部分字段）
 */
export type BannerUpdateItem = Partial<BannerSubmitItem>;

/**
 * 获取 Banner 列表响应
 */
export interface BannerListResponse {
  /** 响应码 */
  code: number;
  /** 响应消息 */
  msg: string;
  /** Banner 列表数据 */
  data: BannerItem[];
}
