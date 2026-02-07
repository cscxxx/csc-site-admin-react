import { useState, useEffect } from 'react';
import { Card, Form, Input, Button, App, Row, Col } from 'antd';
import { ImageUpload } from '@/components/upload';
import { useSettingStore } from '@/store';
import { getSetting, updateSetting } from './service';
import type { SettingData } from '@/types';
import styles from './index.module.less';

function Settings() {
  const [form] = Form.useForm<SettingData>();
  const { message } = App.useApp();
  const setting = useSettingStore(state => state.setting);
  const setSetting = useSettingStore(state => state.setSetting);

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSetting, setLoadingSetting] = useState(false);

  // 从 store 取设置，若无则请求接口并写入 store
  useEffect(() => {
    if (setting) {
      form.setFieldsValue(setting);
      return;
    }
    let cancelled = false;
    setLoadingSetting(true);
    getSetting()
      .then(data => {
        if (!cancelled) {
          setSetting(data);
          form.setFieldsValue(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          message.error('获取设置失败');
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingSetting(false);
      });
    return () => {
      cancelled = true;
    };
  }, [setting, setSetting, form, message]);

  // store 更新后同步表单
  useEffect(() => {
    if (setting) {
      form.setFieldsValue(setting);
    }
  }, [setting, form]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    if (setting) {
      form.setFieldsValue(setting);
    }
  };

  const onFinish = async (values: SettingData) => {
    try {
      setLoading(true);
      const data = await updateSetting(values);
      setSetting(data);
      message.success('修改成功');
      setEditing(false);
    } catch (error) {
      message.error(error instanceof Error ? error.message : '修改失败');
    } finally {
      setLoading(false);
    }
  };

  if (loadingSetting && !setting) {
    return (
      <div className={styles.pageContainer}>
        <h1 className={styles.pageTitle}>设置</h1>
        <Card className={styles.settingsCard}>加载中...</Card>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>设置</h1>
      <Card
        title="全局设置"
        className={styles.settingsCard}
        extra={
          !editing ? (
            <Button type="primary" onClick={handleEdit}>
              修改
            </Button>
          ) : (
            <Button onClick={handleCancel}>取消</Button>
          )
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={setting ?? undefined}
        >
          <Form.Item name="id" hidden>
            <Input type="hidden" />
          </Form.Item>

          <div className={styles.formSection}>
            <div className={styles.sectionLabel}>基础信息</div>
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="头像"
                  name="avatar"
                  rules={[{ required: true, message: '请上传头像' }]}
                  getValueFromEvent={(url: string | null) => url ?? ''}
                >
                  <ImageUpload placeholder="点击或拖拽上传头像" disabled={!editing} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Favicon"
                  name="favicon"
                  rules={[{ required: true, message: '请上传 Favicon' }]}
                  getValueFromEvent={(url: string | null) => url ?? ''}
                >
                  <ImageUpload placeholder="点击或拖拽上传 Favicon" disabled={!editing} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="网站标题" name="siteTitle" rules={[{ required: true, message: '请输入网站标题' }]}>
              <Input placeholder="网站标题" disabled={!editing} />
            </Form.Item>
          </div>

          <div className={styles.formSection}>
            <div className={styles.sectionLabel}>社交与联系</div>
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item label="GitHub" name="github" rules={[{ required: true, message: '请输入 GitHub 链接' }]}>
                  <Input placeholder="GitHub 链接" disabled={!editing} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="GitHub 用户名" name="githubName" rules={[{ required: true, message: '请输入 GitHub 用户名' }]}>
                  <Input placeholder="GitHub 用户名" disabled={!editing} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="QQ" name="qq" rules={[{ required: true, message: '请输入 QQ' }]}>
                  <Input placeholder="QQ" disabled={!editing} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="QQ 二维码"
                  name="qqQrCode"
                  rules={[{ required: true, message: '请上传 QQ 二维码' }]}
                  getValueFromEvent={(url: string | null) => url ?? ''}
                >
                  <ImageUpload placeholder="点击或拖拽上传 QQ 二维码" disabled={!editing} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="微信" name="weixin" rules={[{ required: true, message: '请输入微信' }]}>
                  <Input placeholder="微信" disabled={!editing} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="微信二维码"
                  name="weixinQrCode"
                  rules={[{ required: true, message: '请上传微信二维码' }]}
                  getValueFromEvent={(url: string | null) => url ?? ''}
                >
                  <ImageUpload placeholder="点击或拖拽上传微信二维码" disabled={!editing} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="邮箱" name="mail" rules={[{ required: true, message: '请输入邮箱' }]}>
                  <Input placeholder="邮箱" disabled={!editing} />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div className={styles.formSection}>
            <div className={styles.sectionLabel}>备案信息</div>
            <Form.Item label="ICP 备案号" name="icp" rules={[{ required: true, message: '请输入 ICP 备案号' }]}>
              <Input placeholder="ICP 备案号" disabled={!editing} />
            </Form.Item>
          </div>

          {editing && (
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                提交
              </Button>
            </Form.Item>
          )}
        </Form>
      </Card>
    </div>
  );
}

export default Settings;
