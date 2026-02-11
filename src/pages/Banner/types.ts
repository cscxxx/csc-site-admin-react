/**
 * Banner 页面本地类型定义
 */

import type { BannerItem } from '@/types';

/** 表单字段（新增/编辑共用） */
export interface BannerFormData {
  midImg: string;
  bigImg: string;
  title: string;
  description: string;
  order?: number;
  isShow?: boolean;
}

/** 表格列 Hook 入参 */
export interface BannerColumnsProps {
  onEdit: (record: BannerItem) => void;
  onDelete: (record: BannerItem) => void;
  /** 切换「是否展示」时调用，由父组件请求 PUT 并刷新列表 */
  onShowChange: (record: BannerItem, isShow: boolean) => void | Promise<void>;
}

/** 新增/编辑弹窗 Props */
export interface EditModalProps {
  open: boolean;
  /** null 表示新增，否则为编辑 */
  editingItem: BannerItem | null;
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (values: BannerFormData) => Promise<void>;
}
