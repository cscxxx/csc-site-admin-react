/**
 * 富文本编辑器：基于 MDXEditor，支持 Markdown 编辑与图片上传，对外暴露 HTML 接口
 * 图片走服务端上传（与 @/components/upload 同接口），粘贴/拖拽/工具栏插入均上传后插入 URL
 */

import { useEffect, useRef, useCallback, useMemo, memo } from 'react';
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
import { uploadImage } from '@/components/upload/service';
import { htmlToMarkdown } from './html-to-markdown';
import type { MarkdownEditorProps } from './types';

marked.use({ gfm: true, pedantic: false });

const NOOP = () => {};
const MIN_HEIGHT_CLASS = 'min-h-[320px]';
const EDITOR_CONTENT_MIN_H = 280;

/** 代码块语言选项（CodeMirror 插件） */
const CODE_BLOCK_LANGUAGES: Record<string, string> = {
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
};

/** 编辑器内容区样式（随内容增高、用外层滚动，无内滚动条） */
const CONTENTEDITABLE_CLASS =
  '[&_.mdxeditor-root-contenteditable]:px-3 [&_.mdxeditor-root-contenteditable]:py-2 [&_.mdxeditor-root-contenteditable]:min-h-[280px] [&_.mdxeditor-root-contenteditable]:overflow-visible [&_.mdxeditor-root-contenteditable]:max-h-none'.replace(
    '280',
    String(EDITOR_CONTENT_MIN_H)
  );

function MarkdownEditorInner({
  value = '',
  onChange = NOOP,
  placeholder,
  disabled = false,
  className,
  height = MIN_HEIGHT_CLASS,
  onUploadImage,
}: MarkdownEditorProps) {
  const { message } = App.useApp();
  const editorRef = useRef<MDXEditorMethods | null>(null);
  const lastHtmlRef = useRef<string | undefined>(undefined);

  const uploadHandler = useCallback(
    async (file: File): Promise<string> => {
      const upload = onUploadImage ?? uploadImage;
      try {
        return await upload(file);
      } catch (err) {
        message.error(err instanceof Error ? err.message : '图片上传失败');
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
      codeMirrorPlugin({ codeBlockLanguages: CODE_BLOCK_LANGUAGES }),
      imagePlugin({ imageUploadHandler: uploadHandler }),
      tablePlugin(),
      thematicBreakPlugin(),
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

  useEffect(() => {
    if (lastHtmlRef.current !== undefined && value === lastHtmlRef.current) return;
    lastHtmlRef.current = value;
    const markdown = htmlToMarkdown(value);
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

  const isHeightNumber = typeof height === 'number';
  const wrapperStyle = isHeightNumber ? { minHeight: height } : undefined;
  const innerHeightClass = isHeightNumber ? MIN_HEIGHT_CLASS : (height as string);
  const innerClass = [
    'w-full overflow-hidden rounded-md border border-(--ant-color-border) bg-(--ant-color-bg-container)',
    innerHeightClass,
    CONTENTEDITABLE_CLASS,
  ]
    .join(' ')
    .trim();

  return (
    <div className={['w-full', className].filter(Boolean).join(' ')} style={wrapperStyle}>
      <div className={innerClass}>
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

const MarkdownEditor = memo(MarkdownEditorInner);

export default MarkdownEditor;
