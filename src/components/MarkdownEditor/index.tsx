/**
 * 富文本编辑器：基于 MDXEditor，支持 Markdown 编辑与图片上传，对外暴露 HTML 接口
 * 图片走服务端上传（与 @/components/upload 同接口），粘贴/拖拽/工具栏插入均上传后插入 URL
 */

import { useEffect, useRef, useCallback, useMemo, memo, useState } from 'react';
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
  markdownShortcutPlugin,
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
import 'github-markdown-css/github-markdown-light.css';
import './markdown-body-override.css';
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

/**
 * 富文本编辑器内部实现：HTML 受控、Markdown 编辑、图片上传，带 Markdown 快捷输入
 */
function MarkdownEditorInner({
  value = '',
  onChange = NOOP,
  placeholder = '支持 Markdown，可粘贴或上传图片',
  disabled = false,
  className,
  height = MIN_HEIGHT_CLASS,
  onUploadImage,
}: MarkdownEditorProps) {
  const { message } = App.useApp();
  const editorRef = useRef<MDXEditorMethods | null>(null);
  const lastHtmlRef = useRef<string | undefined>(undefined);
  const [editorReady, setEditorReady] = useState(false);

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

  const setRef = useCallback((r: MDXEditorMethods | null) => {
    editorRef.current = r;
    setEditorReady(Boolean(r));
  }, []);

  const valueForConvert = value ?? '';
  const initialMarkdown = useMemo(() => htmlToMarkdown(valueForConvert), [valueForConvert]);

  useEffect(() => {
    if (!editorRef.current) return;
    if (lastHtmlRef.current !== undefined && value === lastHtmlRef.current) return;
    lastHtmlRef.current = value;
    try {
      editorRef.current.setMarkdown(initialMarkdown);
    } catch (err) {
      console.error('[MarkdownEditor] setMarkdown 失败:', err);
    }
  }, [value, editorReady, initialMarkdown]);

  const handleChange = useCallback(
    (markdown: string) => {
      let html = '';
      if (markdown) {
        try {
          html = marked.parse(markdown, { async: false, gfm: true }) as string;
        } catch (err) {
          console.error('[MarkdownEditor] markdown 转 HTML 失败:', err);
        }
      }
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
          ref={setRef}
          markdown={initialMarkdown}
          onChange={handleChange}
          plugins={plugins}
          placeholder={placeholder}
          readOnly={disabled}
          className="w-full"
          contentEditableClassName="markdown-body min-h-full focus:outline-none"
        />
      </div>
    </div>
  );
}

const MarkdownEditor = memo(MarkdownEditorInner);

export default MarkdownEditor;
