/**
 * Banner 表格列定义 Hook
 */

import { useMemo } from 'react';
import { Button, Image, Space, Spin, Switch, Tooltip } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { BannerItem } from '@/types';
import type { BannerColumnsProps } from './types';
import styles from './index.module.less';

/**
 * 获取 Banner 表格列定义的 Hook
 * @param props 列定义配置
 * @returns 表格列配置数组
 */
export function useColumns(props: BannerColumnsProps): ColumnsType<BannerItem> {
  const { onEdit, onDelete, onShowChange } = props;

  return useMemo(
    () => [
      {
        title: '序号',
        key: 'index',
        width: 80,
        align: 'center',
        render: (_: unknown, __: BannerItem, index: number) => index + 1,
      },
      {
        title: '中等图片',
        dataIndex: 'midImg',
        key: 'midImg',
        width: 150,
        render: (url: string) => (
          <div className={styles.imageWrapper}>
            <Image
              src={url}
              alt="中等图片"
              width={100}
              height={60}
              style={{ objectFit: 'cover', borderRadius: 4 }}
              preview
              loading="lazy"
              placeholder={
                <div className={styles.imagePlaceholder}>
                  <Spin size="small" />
                </div>
              }
            />
          </div>
        ),
      },
      {
        title: '大图',
        dataIndex: 'bigImg',
        key: 'bigImg',
        width: 150,
        render: (url: string) => (
          <div className={styles.imageWrapper}>
            <Image
              src={url}
              alt="大图"
              width={100}
              height={60}
              style={{ objectFit: 'cover', borderRadius: 4 }}
              preview
              loading="lazy"
              placeholder={
                <div className={styles.imagePlaceholder}>
                  <Spin size="small" />
                </div>
              }
            />
          </div>
        ),
      },
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        ellipsis: {
          showTitle: false,
        },
        render: (text: string) => (
          <Tooltip placement="topLeft" title={text}>
            <span>{text}</span>
          </Tooltip>
        ),
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
        ellipsis: {
          showTitle: false,
        },
        render: (text: string) => (
          <Tooltip placement="topLeft" title={text}>
            <span>{text}</span>
          </Tooltip>
        ),
      },
      {
        title: '排序',
        dataIndex: 'order',
        key: 'order',
        width: 80,
        align: 'center',
        render: (order: number | undefined) => order ?? '-',
      },
      {
        title: '操作',
        key: 'action',
        width: 200,
        fixed: 'right',
        render: (_, record) => (
          <Space className={styles.actionColumn} size="small">
            <Switch
              checked={record.isShow ?? true}
              checkedChildren="展示"
              unCheckedChildren="隐藏"
              onChange={checked => onShowChange(record, checked)}
            />
            <Button type="link" size="small" icon={<EditOutlined />} onClick={() => onEdit(record)}>
              编辑
            </Button>
            <Button type="link" size="small" danger onClick={() => onDelete(record)}>
              删除
            </Button>
          </Space>
        ),
      },
    ],
    [onEdit, onDelete, onShowChange]
  );
}
