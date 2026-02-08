/**
 * HTML 转 Markdown：供 MarkdownEditor 回显与同步使用
 * 使用 TurndownService，表格转为 GFM，代码块保留语言标识
 */

import TurndownService from 'turndown';

const turndownService = new TurndownService({
  codeBlockStyle: 'fenced',
  fence: '```',
});

/** 从 <code> 的 class 中解析语言（marked 输出为 language-xxx 或 lang-xxx） */
function getCodeBlockLanguage(codeEl: HTMLElement): string {
  const className = codeEl.className ?? '';
  const match = className.match(/\b(?:language|lang)-([\w+-]+)/i);
  return match ? match[1].toLowerCase() : 'text';
}

// 表格 → GFM Markdown
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

// <pre><code> → 围栏代码块并保留语言
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

/**
 * 确保围栏代码块带语言标识，便于 MDXEditor 正确识别代码块区域
 */
function ensureCodeBlockLanguage(markdown: string): string {
  return markdown.replace(/(^|\n\n)(```(?![a-zA-Z0-9+-])\s*\n)/g, '$1```text\n');
}

/**
 * 转义 Markdown 中会被解析为 HTML 的“标签形”文本（如 &lt;!DOCTYPE&gt; 转成 <!DOCTYPE> 后会被当成标签）
 * 只处理代码块外的内容，避免破坏围栏代码块
 */
function escapeTagLikeInMarkdown(markdown: string): string {
  const parts = markdown.split(/(```[\s\S]*?```)/g);
  return parts
    .map(part => {
      if (part.startsWith('```') && part.endsWith('```')) return part;
      return part.replace(/<(![^>]*?)>/g, '\\<$1\\>');
    })
    .join('');
}

/**
 * 将 HTML 转为 Markdown（用于编辑器回显）
 */
export function htmlToMarkdown(html: string): string {
  if (!html) return '';
  try {
    const markdown = turndownService.turndown(html);
    const withCodeLang = ensureCodeBlockLanguage(markdown);
    return escapeTagLikeInMarkdown(withCodeLang);
  } catch (err) {
    console.error('[htmlToMarkdown] 转换失败:', err);
    return '';
  }
}
