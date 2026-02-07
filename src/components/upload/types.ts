/**
 * 图片上传组件相关类型
 */

/** 上传接口返回的数据结构 */
export interface UploadApiResponse {
  code: number;
  msg: string;
  data: string;
}

/** 图片上传组件 Props */
export interface ImageUploadProps {
  /** 当前图片地址（受控） */
  value?: string | null;
  /** 图片地址变化回调 */
  onChange?: (url: string | null) => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 占位提示文案 */
  placeholder?: string;
  /** 可选样式类名 */
  className?: string;
}
