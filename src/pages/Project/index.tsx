import { useState, useEffect, useCallback } from 'react';
import { Table, Button, App } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getProjectList, addProject, updateProject, deleteProject } from './service';
import { useProjectColumns } from './use-columns';
import ProjectEditModal from './useEditModal';
import type { ProjectItem, ProjectSubmitFormData } from './types';
import styles from './index.module.less';

function Project() {
  const { message, modal } = App.useApp();
  const [list, setList] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProjectItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadList = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProjectList();
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

  const handleEdit = (record: ProjectItem) => {
    setEditingItem(record);
    setModalOpen(true);
  };

  const handleCancel = () => {
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (values: ProjectSubmitFormData) => {
    try {
      setSubmitting(true);
      if (editingItem) {
        await updateProject(editingItem.id, values);
        message.success('修改成功');
      } else {
        await addProject(values);
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

  const handleDelete = (record: ProjectItem) => {
    modal.confirm({
      title: '确认删除',
      content: `确定要删除项目「${record.name}」吗？`,
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteProject(record.id);
          message.success('删除成功');
          await loadList();
        } catch (err) {
          message.error(err instanceof Error ? err.message : '删除失败');
          throw err;
        }
      },
    });
  };

  const columns = useProjectColumns({ onEdit: handleEdit, onDelete: handleDelete });

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>示例项目</h1>
      <div className={styles.toolbar}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增
        </Button>
      </div>
      <Table<ProjectItem>
        columns={columns}
        dataSource={list}
        rowKey="id"
        loading={loading}
        scroll={{ x: 1000 }}
      />
      <ProjectEditModal
        open={modalOpen}
        editingItem={editingItem}
        submitting={submitting}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default Project;
