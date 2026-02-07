/**
 * Banner 页面本地类型定义
 */

import type { BannerItem } from '@/types';

/**
 * Banner 编辑表单数据
 */
export interface BannerFormData {
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
 * 表格列定义 Props
 */
export interface BannerColumnsProps {
  /** 编辑处理函数 */
  onEdit: (record: BannerItem) => void;
}

/**
 * EditModal Props
 */
export interface EditModalProps {
  /** 是否显示弹窗 */
  open: boolean;
  /** 正在编辑的 Banner 项 */
  editingItem: BannerItem | null;
  /** 是否正在提交 */
  submitting: boolean;
  /** 关闭弹窗处理函数 */
  onCancel: () => void;
  /** 提交表单处理函数 */
  onSubmit: (values: BannerFormData) => Promise<void>;
}
