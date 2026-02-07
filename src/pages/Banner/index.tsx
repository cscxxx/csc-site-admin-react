import { useState, useEffect, useCallback } from 'react';
import { Table, App } from 'antd';
import { getBannerList, updateBannerList } from './service';
import { useColumns } from './use-columns.tsx';
import EditModal from './useEditModal';
import type { BannerItem, BannerSubmitItem } from '@/types';
import type { BannerFormData } from './types';
import styles from './index.module.less';

function Banner() {
  const { message } = App.useApp();
  const [bannerList, setBannerList] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<BannerItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 加载 Banner 列表
  const loadBannerList = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getBannerList();
      setBannerList(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取 Banner 列表失败';
      message.error(errorMessage);
      console.error('Failed to load banner list:', error);
    } finally {
      setLoading(false);
    }
  }, [message]);

  // 组件挂载时加载数据
  useEffect(() => {
    loadBannerList();
  }, [loadBannerList]);

  // 打开编辑弹窗
  const handleEdit = (record: BannerItem) => {
    setEditingItem(record);
    setModalVisible(true);
  };

  // 关闭弹窗
  const handleCancel = () => {
    setModalVisible(false);
    setEditingItem(null);
  };

  // 提交表单
  const handleSubmit = async (values: BannerFormData) => {
    if (!editingItem) {
      return;
    }

    try {
      setSubmitting(true);

      // 构建提交数据：更新对应项，其他项保持不变
      const submitData: BannerSubmitItem[] = bannerList.map(item => {
        if (item.id === editingItem.id) {
          return {
            midImg: values.midImg,
            bigImg: values.bigImg,
            title: values.title,
            description: values.description,
          };
        }
        return {
          midImg: item.midImg,
          bigImg: item.bigImg,
          title: item.title,
          description: item.description,
        };
      });

      await updateBannerList(submitData);
      message.success('更新成功！');
      handleCancel();
      // 重新加载列表
      await loadBannerList();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新失败';
      message.error(errorMessage);
      console.error('Failed to update banner:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // 获取表格列定义
  const columns = useColumns({ onEdit: handleEdit });

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>首页标语管理</h1>
      <Table
        columns={columns}
        dataSource={bannerList}
        loading={loading}
        rowKey="id"
        scroll={{ x: 1000 }}
      />
      <EditModal
        open={modalVisible}
        editingItem={editingItem}
        submitting={submitting}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default Banner;
