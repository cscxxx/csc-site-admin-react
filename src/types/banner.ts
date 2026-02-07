/**
 * Banner 相关类型定义
 */

/**
 * Banner 数据项
 */
export interface BannerItem {
  /** Banner ID */
  id: number;
  /** 中等尺寸图片地址 */
  midImg: string;
  /** 大尺寸图片地址 */
  bigImg: string;
  /** 标题 */
  title: string;
  /** 描述 */
  description: string;
}

/**
 * Banner 提交数据项（不包含 id）
 */
export interface BannerSubmitItem {
  /** 中等尺寸图片地址 */
  midImg: string;
  /** 大尺寸图片地址 */
  bigImg: string;
  /** 标题 */
  title: string;
  /** 描述 */
  description: string;
}

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
