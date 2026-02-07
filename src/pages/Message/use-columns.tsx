/**
 * 留言板表格列定义 Hook
 */

import { useMemo } from 'react';
import { Button, Image } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { MessageItem } from './types';

export interface MessageColumnsProps {
  onDelete: (record: MessageItem) => void;
}

export function useMessageColumns(props: MessageColumnsProps): ColumnsType<MessageItem> {
  const { onDelete } = props;

  return useMemo<ColumnsType<MessageItem>>(
    () => [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 80,
      },
      {
        title: '头像',
        dataIndex: 'avatar',
        key: 'avatar',
        width: 72,
        render: (avatar: string) =>
          avatar ? (
            <Image
              src={avatar}
              alt="头像"
              width={40}
              height={40}
              style={{ objectFit: 'cover', borderRadius: '50%' }}
              preview
            />
          ) : (
            '-'
          ),
      },
      {
        title: '昵称',
        dataIndex: 'nickname',
        key: 'nickname',
        width: 120,
        ellipsis: true,
      },
      {
        title: '内容',
        dataIndex: 'content',
        key: 'content',
        ellipsis: true,
      },
      {
        title: '留言时间',
        dataIndex: 'createDate',
        key: 'createDate',
        width: 180,
        render: (createDate: string) =>
          dayjs(Number(createDate)).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '博客ID',
        dataIndex: 'blogId',
        key: 'blogId',
        width: 88,
      },
      {
        title: '操作',
        key: 'action',
        width: 100,
        align: 'center',
        fixed: 'right',
        render: (_, record) => (
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record)}
          >
            删除
          </Button>
        ),
      },
    ],
    [onDelete]
  );
}
