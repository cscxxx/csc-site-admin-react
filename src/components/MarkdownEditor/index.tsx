/**
 * 富文本编辑器：基于 MDXEditor，支持 Markdown 编辑与图片上传，对外暴露 HTML 接口
 * 图片一律走服务端上传（与 @/components/upload 同接口 /api/upload），粘贴/拖拽/工具栏插入均上传后插入 URL，不转 base64
 */

import { useEffect, useRef, useCallback, useMemo } from 'react';
import { App } from 'antd';
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  linkPlugin,
  linkDialogPlugin,
  quotePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  imagePlugin,
  tablePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  ListsToggle,
  CreateLink,
  InsertImage,
  InsertCodeBlock,
  InsertThematicBreak,
  InsertTable,
  CodeToggle,
  Separator,
  type MDXEditorMethods,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import { marked } from 'marked';
import TurndownService from 'turndown';

// 启用 GFM（含表格），确保 Insert Table 输出的 Markdown 表格能正确转成 HTML <table>
marked.use({ gfm: true, pedantic: false });
import { uploadImage } from '@/components/upload/service';
import type { MarkdownEditorProps } from './types';

const turndownService = new TurndownService({
  codeBlockStyle: 'fenced',
  fence: '```',
});

// 将 HTML 表格转成 GFM Markdown 表格，便于编辑回显时表格正确显示
turndownService.addRule('table', {
  filter: 'table',
  replacement(_content: string, node: HTMLElement) {
    const table = node as HTMLTableElement;
    const rows = Array.from(table.rows);
    if (rows.length === 0) return '';
    const lines: string[] = [];
    const hasHeader = table.querySelector('th') != null;
    rows.forEach((row, i) => {
      const cells = Array.from(row.cells).map(cell =>
        (cell.textContent ?? '').trim().replace(/\n/g, ' ').replace(/\|/g, '\\|')
      );
      lines.push('| ' + cells.join(' | ') + ' |');
      if (i === 0 && hasHeader) {
        lines.push('| ' + cells.map(() => '---').join(' | ') + ' |');
      }
    });
    return '\n\n' + lines.join('\n') + '\n\n';
  },
});

/** 从 <code> 的 class 中解析语言（marked 输出为 language-xxx 或 lang-xxx） */
function getCodeBlockLanguage(codeEl: HTMLElement): string {
  const className = codeEl.className ?? '';
  const match = className.match(/\b(?:language|lang)-([\w+-]+)/i);
  return match ? match[1].toLowerCase() : 'text';
}

/**
 * 确保围栏代码块带语言标识：仅对「无语言的开始围栏」补 text，不误改结束围栏，便于 MDXEditor 正确识别代码块区域
 * 开始围栏：字符串开头或紧接在 \n\n 后的 ```\n（不用 /m，避免 ^ 匹配到行首误改结束围栏）
 */
function ensureCodeBlockLanguage(markdown: string): string {
  return markdown.replace(/(^|\n\n)(```(?![a-zA-Z0-9+-])\s*\n)/g, '$1```text\n');
}

// 将 <pre><code> 转成 GFM 围栏代码块并保留语言标识（marked 输出 class="language-xxx"），回显时代码块有区域和语言标签
turndownService.addRule('preCodeBlockWithLang', {
  filter(node: HTMLElement) {
    if (node.nodeName !== 'PRE') return false;
    const first = node.firstElementChild;
    return first?.nodeName === 'CODE' && node.childElementCount === 1;
  },
  replacement(_content: string, node: HTMLElement) {
    const codeEl = node.firstElementChild as HTMLElement | null;
    const lang = codeEl ? getCodeBlockLanguage(codeEl) : 'text';
    const raw = codeEl?.textContent ?? '';
    const code = raw.replace(/\n+$/, '').replace(/^\n+/, '');
    return '\n\n```' + lang + '\n' + code + '\n```\n\n';
  },
});

function MarkdownEditor({
  value = '',
  onChange = () => {},
  placeholder,
  disabled = false,
  className,
  height = 'min-h-[320px]',
  onUploadImage,
}: MarkdownEditorProps) {
  const { message } = App.useApp();
  const editorRef = useRef<MDXEditorMethods | null>(null);
  /** 上次通过 onChange 抛出的 HTML，用于区分外部更新与自身输出，避免重复同步 */
  const lastHtmlRef = useRef<string | undefined>(undefined);

  /** 图片上传：与上传组件一致（/api/upload，返回 body.data 为 URL），粘贴/拖拽/工具栏均走此逻辑，不使用 base64 */
  const uploadHandler = useCallback(
    async (file: File): Promise<string> => {
      const upload = onUploadImage ?? uploadImage;
      try {
        return await upload(file);
      } catch (err) {
        const msg = err instanceof Error ? err.message : '图片上传失败';
        message.error(msg);
        throw err;
      }
    },
    [onUploadImage, message]
  );

  const plugins = useMemo(
    () => [
      headingsPlugin(),
      listsPlugin(),
      linkPlugin(),
      linkDialogPlugin(),
      quotePlugin(),
      codeBlockPlugin({ defaultCodeBlockLanguage: 'text' }),
      codeMirrorPlugin({
        codeBlockLanguages: {
          text: 'Plain Text',
          js: 'JavaScript',
          ts: 'TypeScript',
          jsx: 'JSX',
          tsx: 'TSX',
          css: 'CSS',
          html: 'HTML',
          json: 'JSON',
          md: 'Markdown',
          bash: 'Bash',
          shell: 'Shell',
        },
      }),
      imagePlugin({
        imageUploadHandler: uploadHandler,
      }),
      tablePlugin(),
      thematicBreakPlugin(),
      markdownShortcutPlugin(),
      toolbarPlugin({
        toolbarContents: () => (
          <>
            <UndoRedo />
            <Separator />
            <BoldItalicUnderlineToggles />
            <CodeToggle />
            <Separator />
            <BlockTypeSelect />
            <ListsToggle />
            <CreateLink />
            <InsertImage />
            <InsertTable />
            <InsertCodeBlock />
            <InsertThematicBreak />
          </>
        ),
      }),
    ],
    [uploadHandler]
  );

  // 外部 value 更新时（如 form.setFieldsValue 加载文章），将 HTML 转为 Markdown 写入编辑器；避免与自己刚输出的 value 重复同步
  useEffect(() => {
    if (lastHtmlRef.current !== undefined && value === lastHtmlRef.current) return;
    lastHtmlRef.current = value;
    let markdown = value ? turndownService.turndown(value) : '';
    markdown = ensureCodeBlockLanguage(markdown);
    editorRef.current?.setMarkdown(markdown);
  }, [value]);

  const handleChange = useCallback(
    (markdown: string) => {
      const html = markdown ? (marked.parse(markdown, { async: false, gfm: true }) as string) : '';
      lastHtmlRef.current = html;
      onChange(html);
    },
    [onChange]
  );

  const containerHeight = typeof height === 'number' ? { minHeight: height } : undefined;
  const containerClass = typeof height === 'string' ? height : undefined;

  return (
    <div className={`w-full ${className ?? ''}`.trim()} style={containerHeight}>
      <div
        className={`w-full overflow-hidden rounded-md border border-(--ant-color-border) bg-(--ant-color-bg-container) ${containerClass ?? 'min-h-[320px]'} [&_.mdxeditor-root-contenteditable]:px-3 [&_.mdxeditor-root-contenteditable]:py-2 [&_.mdxeditor-root-contenteditable]:min-h-[280px]`.trim()}
      >
        <MDXEditor
          ref={editorRef}
          markdown=""
          onChange={handleChange}
          plugins={plugins}
          placeholder={placeholder}
          readOnly={disabled}
          className="w-full"
        />
      </div>
    </div>
  );
}

export default MarkdownEditor;
