/**
 * 博客文章相关类型
 */

/** 文章项（列表/详情，createDate 仅展示用） */
export interface BlogItem {
  id: number;
  title: string;
  description: string;
  createDate: number;
  categoryId: number;
  toc?: unknown[];
  htmlContent?: string;
  thumb: string;
}

/** 列表查询参数（地址栏） */
export interface BlogListParams {
  page: number;
  limit: number;
  keyword?: string;
  categoryid?: number;
}

/** 列表接口返回的 data 结构 */
export interface BlogListData {
  total: number;
  rows: BlogItem[];
}

/** 新增/修改提交体（toc 提交时固定 []；createDate 仅新增时传当前时间戳，编辑不传） */
export interface BlogSubmitData {
  title: string;
  description: string;
  categoryId: number;
  toc: unknown[];
  htmlContent: string;
  thumb: string;
  /** 仅新增时传，前端传当前时间戳；编辑时不传 */
  createDate?: number;
}

export interface BlogColumnsProps {
  categoryMap: Map<number, string>;
  onEdit: (record: BlogItem) => void;
  onDelete: (record: BlogItem) => void;
}

export interface BlogModalProps {
  open: boolean;
  editingItem: BlogItem | null;
  categories: { id: number; name: string }[];
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (values: Omit<BlogSubmitData, 'toc'> & { toc?: never }) => Promise<void>;
}
