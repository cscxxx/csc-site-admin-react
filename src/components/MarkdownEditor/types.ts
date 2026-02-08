/**
 * MarkdownEditor 组件 props
 * 对外使用 HTML：value / onChange(html)；内部用 Markdown 编辑
 */

export interface MarkdownEditorProps {
  /** 当前内容（HTML 字符串），与表单 htmlContent 等字段对接；在 Form.Item 内使用时由表单注入 */
  value?: string;
  /** 内容变化时回调，传出 HTML 字符串；在 Form.Item 内使用时由表单注入 */
  onChange?: (html: string) => void;
  /** 占位符 */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 容器类名 */
  className?: string;
  /** 编辑器高度，如 '320px' 或 320 */
  height?: string | number;
  /** 图片上传：接收文件，返回图片 URL；不传则使用与上传组件一致的 /api/upload（FormData.file，返回 body.data）。粘贴/拖拽/工具栏插入均走此逻辑，不转 base64 */
  onUploadImage?: (file: File) => Promise<string>;
}
