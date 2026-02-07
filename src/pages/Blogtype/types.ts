/**
 * 文章分类相关类型
 */

/** 分类项（接口返回的 order 可能为 number 或 string） */
export interface BlogtypeItem {
  id: number;
  name: string;
  articleCount: number;
  order: number | string;
}

/** 新增/修改提交体 */
export interface BlogtypeSubmitData {
  name: string;
  order: number | string;
}

export interface BlogtypeColumnsProps {
  onEdit: (record: BlogtypeItem) => void;
  onDelete: (record: BlogtypeItem) => void;
}

export interface BlogtypeModalProps {
  open: boolean;
  editingItem: BlogtypeItem | null;
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (values: BlogtypeSubmitData) => Promise<void>;
}
