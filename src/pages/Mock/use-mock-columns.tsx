/**
 * Mock 页面 API 表格列定义 Hook
 */

import { useMemo } from 'react';
import { Button, Tag } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { ApiItem } from './use-mock-api-list.ts';

export interface UseMockColumnsProps {
  onTest: (api: ApiItem) => void;
  loading: string | null;
}

export function useMockColumns(props: UseMockColumnsProps): ColumnsType<ApiItem> {
  const { onTest, loading } = props;

  return useMemo<ColumnsType<ApiItem>>(
    () => [
      {
        title: 'API 名称',
        dataIndex: 'name',
        key: 'name',
        width: 200,
      },
      {
        title: '方法',
        dataIndex: 'method',
        key: 'method',
        width: 100,
        render: (method: string) => {
          const colorMap: Record<string, string> = {
            GET: 'blue',
            POST: 'green',
            PUT: 'orange',
            DELETE: 'red',
          };
          return <Tag color={colorMap[method]}>{method}</Tag>;
        },
      },
      {
        title: 'URL',
        dataIndex: 'url',
        key: 'url',
        ellipsis: true,
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
      },
      {
        title: '操作',
        key: 'action',
        width: 120,
        render: (_, record) => (
          <Button
            type="primary"
            size="small"
            icon={<PlayCircleOutlined />}
            onClick={() => onTest(record)}
            loading={loading === record.key}
          >
            测试
          </Button>
        ),
      },
    ],
    [onTest, loading]
  );
}
