/**
 * Banner 编辑弹窗组件
 */

import { useEffect } from 'react';
import { Modal, Form, Input, Button, Space, App } from 'antd';
import type { BannerFormData, EditModalProps } from '../types';
import styles from '../index.module.less';

/**
 * Banner 编辑弹窗组件
 */
function EditModal(props: EditModalProps) {
  const { open, editingItem, submitting, onCancel, onSubmit } = props;
  const { message } = App.useApp();
  const [form] = Form.useForm<BannerFormData>();

  // 当编辑项变化时，更新表单值
  useEffect(() => {
    if (editingItem && open) {
      form.setFieldsValue({
        midImg: editingItem.midImg,
        bigImg: editingItem.bigImg,
        title: editingItem.title,
        description: editingItem.description,
      });
    }
  }, [editingItem, open, form]);

  // 处理表单提交
  const handleSubmit = async (values: BannerFormData) => {
    try {
      await onSubmit(values);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '提交失败';
      message.error(errorMessage);
    }
  };

  // 处理取消
  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="编辑 Banner"
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className={styles.modalForm}
      >
        <Form.Item
          label="中等图片地址"
          name="midImg"
          rules={[{ required: true, message: '请输入中等图片地址' }]}
        >
          <Input placeholder="请输入中等图片地址" />
        </Form.Item>
        <Form.Item
          label="大图地址"
          name="bigImg"
          rules={[{ required: true, message: '请输入大图地址' }]}
        >
          <Input placeholder="请输入大图地址" />
        </Form.Item>
        <Form.Item
          label="标题"
          name="title"
          rules={[{ required: true, message: '请输入标题' }]}
        >
          <Input placeholder="请输入标题" />
        </Form.Item>
        <Form.Item
          label="描述"
          name="description"
          rules={[{ required: true, message: '请输入描述' }]}
        >
          <Input.TextArea
            placeholder="请输入描述"
            rows={4}
          />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={submitting}>
              提交
            </Button>
            <Button onClick={handleCancel}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EditModal;
