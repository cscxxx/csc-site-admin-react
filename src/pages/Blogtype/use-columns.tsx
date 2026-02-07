/**
 * 文章分类表格列定义 Hook
 * 文本列超宽省略、hover 展示
 */

import { useMemo } from 'react';
import { Button, Space, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { BlogtypeItem } from './types';
import type { BlogtypeColumnsProps } from './types';

const ELLIPSIS_WIDTH = 120;
const ellipsisStyle = {
  display: 'block' as const,
  maxWidth: ELLIPSIS_WIDTH,
  overflow: 'hidden' as const,
  textOverflow: 'ellipsis' as const,
  whiteSpace: 'nowrap' as const,
};

export function useBlogtypeColumns(
  props: BlogtypeColumnsProps
): ColumnsType<BlogtypeItem> {
  const { onEdit, onDelete } = props;

  return useMemo<ColumnsType<BlogtypeItem>>(
    () => [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 80,
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width: ELLIPSIS_WIDTH + 24,
        ellipsis: true,
        render: (name: string) =>
          name ? (
            <Tooltip title={name}>
              <span style={ellipsisStyle}>{name}</span>
            </Tooltip>
          ) : (
            '-'
          ),
      },
      {
        title: '文章数',
        dataIndex: 'articleCount',
        key: 'articleCount',
        width: 100,
      },
      {
        title: '排序',
        dataIndex: 'order',
        key: 'order',
        width: 80,
      },
      {
        title: '操作',
        key: 'action',
        width: 140,
        align: 'center',
        fixed: 'right',
        render: (_, record) => (
          <Space size="small">
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            >
              修改
            </Button>
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record)}
            >
              删除
            </Button>
          </Space>
        ),
      },
    ],
    [onEdit, onDelete]
  );
}
