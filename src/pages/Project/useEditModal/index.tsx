/**
 * 示例项目新增/编辑弹窗（共用）
 */

import { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, App, Row, Col } from 'antd';
import { ImageUpload } from '@/components/upload';
import type { ProjectItem, ProjectFormData, ProjectSubmitFormData } from '../types';

export interface ProjectEditModalProps {
  open: boolean;
  editingItem: ProjectItem | null;
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (values: ProjectSubmitFormData) => Promise<void>;
}

function parseDescription(description: ProjectItem['description']): string[] {
  if (Array.isArray(description)) return description;
  if (typeof description === 'string') {
    try {
      const parsed = JSON.parse(description) as unknown;
      return Array.isArray(parsed) ? (parsed as string[]) : [description];
    } catch {
      return [description];
    }
  }
  return [];
}

function ProjectEditModal(props: ProjectEditModalProps) {
  const { open, editingItem, submitting, onCancel, onSubmit } = props;
  const { message } = App.useApp();
  const [form] = Form.useForm<ProjectFormData>();

  useEffect(() => {
    if (open) {
      if (editingItem) {
        const desc = parseDescription(editingItem.description);
        form.setFieldsValue({
          name: editingItem.name,
          url: editingItem.url,
          github: editingItem.github,
          description: desc.join('\n'),
          thumb: editingItem.thumb,
          order: editingItem.order,
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
      const description = values.description
        ? values.description
            .split('\n')
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [];
      await onSubmit({
        ...values,
        description,
      });
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
      title={editingItem ? '编辑项目' : '新增项目'}
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      okText="确认"
      cancelText="取消"
      confirmLoading={submitting}
      centered
      width={640}
      styles={{ body: { maxHeight: '80vh', overflowY: 'auto', overflowX: 'hidden' } }}
    >
      <Form form={form} layout="vertical">
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              label="名称"
              name="name"
              rules={[{ required: true, message: '请输入名称' }]}
            >
              <Input placeholder="请输入项目名称" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="链接"
              name="url"
              rules={[{ required: true, message: '请输入链接' }]}
            >
              <Input placeholder="请输入项目链接" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="GitHub"
              name="github"
              rules={[{ required: true, message: '请输入 GitHub 地址' }]}
            >
              <Input placeholder="请输入 GitHub 地址" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="排序"
              name="order"
              rules={[{ required: true, message: '请输入排序' }]}
            >
              <InputNumber min={0} placeholder="数字越小越靠前" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="缩略图"
              name="thumb"
              rules={[{ required: true, message: '请上传缩略图' }]}
              getValueFromEvent={(url: string | null) => url ?? ''}
            >
              <ImageUpload placeholder="点击或拖拽上传缩略图" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="描述"
              name="description"
              rules={[{ required: true, message: '请输入描述' }]}
            >
              <Input.TextArea placeholder="每行一条描述" rows={4} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default ProjectEditModal;
