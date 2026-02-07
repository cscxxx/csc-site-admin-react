/**
 * 示例项目相关类型
 */

/** 列表项（接口返回的 description 可能为 string[] 或 JSON 字符串） */
export interface ProjectItem {
  id: number;
  name: string;
  url: string;
  github: string;
  description: string[] | string;
  thumb: string;
  order: number;
}

/** 新增/修改提交体（无 id 为新增，有 id 为修改） */
export interface ProjectSubmitData {
  name: string;
  url: string;
  github: string;
  description: string[];
  thumb: string;
  order: number;
}

/** 弹窗表单值：description 用换行拼接成字符串编辑 */
export interface ProjectFormData extends Omit<ProjectSubmitData, 'description'> {
  description: string;
}

/** 弹窗提交时的值（description 已转为数组） */
export type ProjectSubmitFormData = Omit<ProjectFormData, 'description'> & {
  description: string[];
};

export interface ProjectModalProps {
  open: boolean;
  editingItem: ProjectItem | null;
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (values: ProjectSubmitFormData) => Promise<void>;
}

export interface ProjectColumnsProps {
  onEdit: (record: ProjectItem) => void;
  onDelete: (record: ProjectItem) => void;
}
