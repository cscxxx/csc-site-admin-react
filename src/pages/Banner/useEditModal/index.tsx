/**
 * Banner 新增/编辑弹窗
 * 新增：editingItem 为 null；编辑：回填表单并 PUT 更新
 */

import { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Row, Col, Switch } from 'antd';
import { ImageUpload } from '@/components/upload';
import type { BannerFormData, EditModalProps } from '../types';
import styles from '../index.module.less';

function EditModal(props: EditModalProps) {
  const { open, editingItem, submitting, onCancel, onSubmit } = props;
  const [form] = Form.useForm<BannerFormData>();
  const isEdit = editingItem != null;

  useEffect(() => {
    if (open) {
      if (editingItem) {
        form.setFieldsValue({
          midImg: editingItem.midImg,
          bigImg: editingItem.bigImg,
          title: editingItem.title,
          description: editingItem.description,
          order: editingItem.order ?? 0,
          isShow: editingItem.isShow ?? true,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ order: 0, isShow: true });
      }
    }
  }, [open, editingItem, form]);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    try {
      await onSubmit(values);
      handleCancel();
    } catch {
      throw undefined;
    }
  };

  return (
    <Modal
      title={isEdit ? '编辑 Banner' : '新增 Banner'}
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      okText="确认"
      cancelText="取消"
      confirmLoading={submitting}
      centered
      width={640}
      destroyOnHidden
      styles={{ body: { maxHeight: '80vh', overflowY: 'auto', overflowX: 'hidden' } }}
    >
      <Form form={form} layout="vertical" className={styles.modalForm}>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              label="中等尺寸图片"
              name="midImg"
              rules={[{ required: false, message: '请上传中等图片' }]}
              getValueFromEvent={(url: string | null) => url ?? ''}
            >
              <ImageUpload placeholder="点击或拖拽上传" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="大尺寸图片"
              name="bigImg"
              rules={[{ required: true, message: '请上传大图' }]}
              getValueFromEvent={(url: string | null) => url ?? ''}
            >
              <ImageUpload placeholder="点击或拖拽上传" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
          <Input placeholder="请输入标题" />
        </Form.Item>
        <Form.Item
          label="描述"
          name="description"
          rules={[{ required: true, message: '请输入描述' }]}
        >
          <Input.TextArea placeholder="请输入描述" rows={3} />
        </Form.Item>
        <Form.Item
          label="排序"
          name="order"
          tooltip="数值越小越靠前"
          rules={[{ type: 'number', min: 0, message: '排序不能为负数' }]}
        >
          <InputNumber min={0} placeholder="0" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="是否展示" name="isShow" valuePropName="checked">
          <Switch checkedChildren="展示" unCheckedChildren="隐藏" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EditModal;
