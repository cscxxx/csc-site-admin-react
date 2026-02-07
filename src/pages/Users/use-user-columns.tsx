/**
 * 用户管理表格列定义 Hook
 */

import { useMemo } from 'react';
import { Button, Space, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

export interface UserRow {
  key: string;
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

export function useUserColumns(): ColumnsType<UserRow> {
  return useMemo<ColumnsType<UserRow>>(
    () => [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '角色',
        dataIndex: 'role',
        key: 'role',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => (
          <Tag color={status === '活跃' ? 'green' : 'red'}>{status}</Tag>
        ),
      },
      {
        title: '操作',
        key: 'action',
        render: () => (
          <Space size="middle">
            <Button type="link" icon={<EditOutlined />}>
              编辑
            </Button>
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Space>
        ),
      },
    ],
    []
  );
}
