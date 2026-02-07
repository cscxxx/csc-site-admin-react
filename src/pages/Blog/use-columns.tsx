/**
 * 博客文章表格列定义 Hook
 * 标题超长省略、hover 展示
 */

import { useMemo } from 'react';
import { Button, Space, Tooltip, Image } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { BlogItem } from './types.ts';
import type { BlogColumnsProps } from './types.ts';

const ELLIPSIS_WIDTH = 140;
const ellipsisStyle = {
  display: 'block' as const,
  maxWidth: ELLIPSIS_WIDTH,
  overflow: 'hidden' as const,
  textOverflow: 'ellipsis' as const,
  whiteSpace: 'nowrap' as const,
};

export function useBlogColumns(props: BlogColumnsProps): ColumnsType<BlogItem> {
  const { categoryMap, onEdit, onDelete } = props;

  return useMemo<ColumnsType<BlogItem>>(
    () => [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 80,
      },
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        width: ELLIPSIS_WIDTH + 24,
        ellipsis: true,
        render: (title: string) =>
          title ? (
            <Tooltip title={title}>
              <span style={ellipsisStyle}>{title}</span>
            </Tooltip>
          ) : (
            '-'
          ),
      },
      {
        title: '分类',
        dataIndex: 'categoryId',
        key: 'categoryId',
        width: 100,
        render: (categoryId: number) => categoryMap.get(categoryId) ?? categoryId,
      },
      {
        title: '缩略图',
        dataIndex: 'thumb',
        key: 'thumb',
        width: 80,
        render: (thumb: string) =>
          thumb ? (
            <Image
              src={thumb}
              alt="缩略图"
              width={48}
              height={48}
              style={{ objectFit: 'cover', borderRadius: 4 }}
              preview
            />
          ) : (
            '-'
          ),
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate',
        width: 180,
        render: (createDate: number) => {
          // 兼容秒（10 位）与毫秒（13 位），统一按毫秒传给 dayjs
          const ms =
            createDate != null && Number(createDate) < 1e12
              ? Number(createDate) * 1000
              : Number(createDate);
          return dayjs(ms).format('YYYY-MM-DD HH:mm:ss');
        },
      },
      {
        title: '操作',
        key: 'action',
        width: 140,
        align: 'center',
        fixed: 'right',
        render: (_, record) => (
          <Space size="small">
            <Button type="link" size="small" icon={<EditOutlined />} onClick={() => onEdit(record)}>
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
    [categoryMap, onEdit, onDelete]
  );
}
