import { useState, useEffect, useCallback } from 'react';
import { Table, Button, App } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getBlogtypeList, addBlogtype, updateBlogtype, deleteBlogtype } from './service';
import { useBlogtypeColumns } from './use-columns';
import BlogtypeEditModal from './useEditModal';
import type { BlogtypeItem, BlogtypeSubmitData } from './types';
import styles from './index.module.less';

function Blogtype() {
  const { message, modal } = App.useApp();
  const [list, setList] = useState<BlogtypeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BlogtypeItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadList = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getBlogtypeList();
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

  const handleEdit = (record: BlogtypeItem) => {
    setEditingItem(record);
    setModalOpen(true);
  };

  const handleCancel = () => {
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (values: BlogtypeSubmitData) => {
    try {
      setSubmitting(true);
      if (editingItem) {
        await updateBlogtype(editingItem.id, values);
        message.success('修改成功');
      } else {
        await addBlogtype(values);
        message.success('新增成功');
      }
      handleCancel();
      await loadList();
    } catch (err) {
      message.error(err instanceof Error ? err.message : '操作失败');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (record: BlogtypeItem) => {
    modal.confirm({
      title: '确认删除',
      content: `确定要删除分类「${record.name}」吗？`,
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteBlogtype(record.id);
          message.success('删除成功');
          await loadList();
        } catch (err) {
          message.error(err instanceof Error ? err.message : '删除失败');
          throw err;
        }
      },
    });
  };

  const columns = useBlogtypeColumns({ onEdit: handleEdit, onDelete: handleDelete });

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>文章分类</h1>
      <div className={styles.toolbar}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增
        </Button>
      </div>
      <Table<BlogtypeItem>
        columns={columns}
        dataSource={list}
        rowKey="id"
        loading={loading}
        scroll={{ x: 500 }}
      />
      <BlogtypeEditModal
        open={modalOpen}
        editingItem={editingItem}
        submitting={submitting}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default Blogtype;
