/**
 * Banner 表格列定义 Hook
 */

import { useMemo } from 'react';
import { Button, Image, Spin } from 'antd';
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
  const { onEdit } = props;

  return useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 80,
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
        fixed: 'right',
        render: (_, record) => (
          <Button type="link" icon={<EditOutlined />} onClick={() => onEdit(record)}>
            编辑
          </Button>
        ),
      },
    ],
    [onEdit]
  );
}
