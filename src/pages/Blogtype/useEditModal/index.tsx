/**
 * 文章分类新增/编辑弹窗（共用）
 */

import { useEffect } from 'react';
import { Modal, Form, Input, Select, App } from 'antd';
import type { BlogtypeItem, BlogtypeSubmitData } from '../types';

export interface BlogtypeEditModalProps {
  open: boolean;
  editingItem: BlogtypeItem | null;
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (values: BlogtypeSubmitData) => Promise<void>;
}

function BlogtypeEditModal(props: BlogtypeEditModalProps) {
  const { open, editingItem, submitting, onCancel, onSubmit } = props;
  const { message } = App.useApp();
  const [form] = Form.useForm<BlogtypeSubmitData>();

  useEffect(() => {
    if (open) {
      if (editingItem) {
        const orderNum =
          typeof editingItem.order === 'string' ? Number(editingItem.order) : editingItem.order;
        const order = Number.isFinite(orderNum) ? Math.min(6, Math.max(1, orderNum)) : 1;
        form.setFieldsValue({
          name: editingItem.name,
          order,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, editingItem, form]);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
    } catch (err) {
      if (err && typeof err === 'object' && 'errorFields' in err) {
        return;
      }
      message.error(err instanceof Error ? err.message : '提交失败');
      throw err;
    }
  };

  return (
    <Modal
      title={editingItem ? '编辑分类' : '新增分类'}
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      okText="确认"
      cancelText="取消"
      confirmLoading={submitting}
      centered
      width={400}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入分类名称' }]}>
          <Input placeholder="请输入分类名称" />
        </Form.Item>
        <Form.Item label="排序" name="order" rules={[{ required: true, message: '请选择排序' }]}>
          <Select
            placeholder="请选择排序"
            options={[1, 2, 3, 4, 5, 6].map(v => ({ value: v, label: String(v) }))}
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default BlogtypeEditModal;
