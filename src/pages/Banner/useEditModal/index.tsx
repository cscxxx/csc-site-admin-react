/**
 * Banner 编辑弹窗组件
 */

import { useEffect } from 'react';
import { Modal, Form, Input, Row, Col, App } from 'antd';
import { ImageUpload } from '@/components/upload';
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

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    try {
      await onSubmit(values);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '提交失败';
      message.error(errorMessage);
      throw error;
    }
  };

  return (
    <Modal
      title="编辑 Banner"
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
      <Form form={form} layout="vertical" className={styles.modalForm}>
        <div className={styles.formSection}>
          <div className={styles.sectionLabel}>Banner 图片</div>
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="中等尺寸"
                name="midImg"
                rules={[{ required: true, message: '请上传中等图片' }]}
                getValueFromEvent={(url: string | null) => url ?? ''}
              >
                <ImageUpload placeholder="点击或拖拽上传" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="大尺寸"
                name="bigImg"
                rules={[{ required: true, message: '请上传大图' }]}
                getValueFromEvent={(url: string | null) => url ?? ''}
              >
                <ImageUpload placeholder="点击或拖拽上传" />
              </Form.Item>
            </Col>
          </Row>
        </div>
        <div className={styles.formSection}>
          <div className={styles.sectionLabel}>文案</div>
          <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="请输入标题" />
          </Form.Item>
          <Form.Item
            label="描述"
            name="description"
            rules={[{ required: true, message: '请输入描述' }]}
          >
            <Input.TextArea placeholder="请输入描述" rows={4} />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}

export default EditModal;
