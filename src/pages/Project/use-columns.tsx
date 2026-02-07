/**
 * 示例项目表格列定义 Hook
 * 文本列超过 100px 省略，hover 时 Tooltip 展示全部内容
 */

import { useMemo } from 'react';
import { Button, Image, Space, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { ProjectItem } from './types';
import type { ProjectColumnsProps } from './types';

const ELLIPSIS_WIDTH = 100;
const ellipsisStyle = {
  display: 'block' as const,
  maxWidth: ELLIPSIS_WIDTH,
  overflow: 'hidden' as const,
  textOverflow: 'ellipsis' as const,
  whiteSpace: 'nowrap' as const,
};

function parseDescription(description: ProjectItem['description']): string[] {
  if (Array.isArray(description)) return description;
  if (typeof description === 'string') {
    try {
      const parsed = JSON.parse(description) as unknown;
      return Array.isArray(parsed) ? (parsed as string[]) : [description];
    } catch {
      return [description];
    }
  }
  return [];
}

export function useProjectColumns(props: ProjectColumnsProps): ColumnsType<ProjectItem> {
  const { onEdit, onDelete } = props;

  return useMemo<ColumnsType<ProjectItem>>(
    () => [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 72,
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
        title: '链接',
        dataIndex: 'url',
        key: 'url',
        width: ELLIPSIS_WIDTH + 24,
        ellipsis: true,
        render: (url: string) =>
          url ? (
            <Tooltip title={url}>
              <span style={ellipsisStyle}>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {url}
                </a>
              </span>
            </Tooltip>
          ) : (
            '-'
          ),
      },
      {
        title: 'GitHub',
        dataIndex: 'github',
        key: 'github',
        width: ELLIPSIS_WIDTH + 24,
        ellipsis: true,
        render: (github: string) =>
          github ? (
            <Tooltip title={github}>
              <span style={ellipsisStyle}>
                <a href={github} target="_blank" rel="noopener noreferrer">
                  {github}
                </a>
              </span>
            </Tooltip>
          ) : (
            '-'
          ),
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
        width: ELLIPSIS_WIDTH + 24,
        ellipsis: true,
        render: (description: ProjectItem['description']) => {
          const arr = parseDescription(description);
          const text = arr.length ? arr.join('；') : '-';
          return text !== '-' ? (
            <Tooltip title={text}>
              <span style={ellipsisStyle}>{text}</span>
            </Tooltip>
          ) : (
            text
          );
        },
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
    [onEdit, onDelete]
  );
}
