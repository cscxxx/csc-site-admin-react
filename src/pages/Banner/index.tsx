/**
 * 首页标语（Banner）管理
 * 接口：GET 列表、POST 新增、PUT /:id 更新、DELETE /:id 删除
 */

import { useState, useEffect, useCallback } from 'react';
import { Table, Button, App } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getBannerList, addBanner, updateBanner, deleteBanner } from './service';
import { useColumns } from './use-columns';
import EditModal from './useEditModal';
import type { BannerItem, BannerSubmitItem } from '@/types';
import type { BannerFormData } from './types';
import styles from './index.module.less';

function Banner() {
  const { message, modal } = App.useApp();
  const [list, setList] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BannerItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadList = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getBannerList();
      setList(data);
    } catch (err) {
      message.error(err instanceof Error ? err.message : '获取列表失败');
    } finally {
      setLoading(false);
    }
  }, [message]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const handleAdd = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEdit = (record: BannerItem) => {
    setEditingItem(record);
    setModalOpen(true);
  };

  const handleCancel = () => {
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (values: BannerFormData) => {
    try {
      setSubmitting(true);
      const body: BannerSubmitItem = {
        midImg: values.midImg,
        bigImg: values.bigImg,
        title: values.title,
        description: values.description,
        order: values.order ?? 0,
        isShow: values.isShow ?? true,
      };
      if (editingItem) {
        await updateBanner(editingItem.id, body);
        message.success('更新成功');
      } else {
        await addBanner(body);
        message.success('新增成功');
      }
      await loadList();
      handleCancel();
    } catch (err) {
      message.error(err instanceof Error ? err.message : '操作失败');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (record: BannerItem) => {
    modal.confirm({
      title: '确认删除',
      content: `确定要删除「${record.title}」吗？`,
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteBanner(record.id);
          message.success('删除成功');
          await loadList();
        } catch (err) {
          message.error(err instanceof Error ? err.message : '删除失败');
        }
      },
    });
  };

  const handleShowChange = async (record: BannerItem, isShow: boolean) => {
    try {
      await updateBanner(record.id, { isShow });
      message.success(isShow ? '已设为展示' : '已设为隐藏');
      setList(prev =>
        prev.map(item => (item.id === record.id ? { ...item, isShow } : item))
      );
    } catch (err) {
      message.error(err instanceof Error ? err.message : '操作失败');
    }
  };

  const columns = useColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onShowChange: handleShowChange,
  });

  return (
    <div className={styles.pageContainer}>
      <div className={styles.toolbar}>
        <h1 className={styles.pageTitle}>首页标语管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增
        </Button>
      </div>
      <Table<BannerItem>
        columns={columns}
        dataSource={list}
        rowKey="id"
        loading={loading}
        scroll={{ x: 900 }}
      />
      <EditModal
        open={modalOpen}
        editingItem={editingItem}
        submitting={submitting}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default Banner;
