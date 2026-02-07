/**
 * Ant Design 全局语言配置
 * 在 zh_CN 基础上覆盖分页等组件的文案，便于全局统一为中文
 */

import zhCN from 'antd/locale/zh_CN';
import type { Locale } from 'antd/es/locale';

/** 分页组件中文文案（覆盖默认的 "10/page" 等英文） */
const paginationLocale = {
  items_per_page: '条/页',
  jump_to: '跳至',
  jump_to_confirm: '确定',
  page: '页',
  prev_page: '上一页',
  next_page: '下一页',
  prev_5: '向前 5 页',
  next_5: '向后 5 页',
  prev_3: '向前 3 页',
  next_3: '向后 3 页',
  total: (total: number) => `共 ${total} 条`,
};

/**
 * 项目使用的 Ant Design 语言包
 * 通过 ConfigProvider locale 注入后，所有 Table/Pagination 等组件会使用此处配置
 */
export const appLocale: Locale = {
  ...zhCN,
  Pagination: {
    ...zhCN.Pagination,
    ...paginationLocale,
  },
};
