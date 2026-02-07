import { useState } from 'react';
import { Form, Input, Button, App, Card } from 'antd';
import { updateAdmin } from './service';
import type { UpdateAdminParams } from './service';
import styles from './index.module.less';

/** 表单值类型 */
interface AdminFormValues {
  name: string;
  loginId: string;
  oldLoginPwd: string;
  loginPwd: string;
  confirm: string;
}

function Admin() {
  const [form] = Form.useForm<AdminFormValues>();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: AdminFormValues) => {
    try {
      setLoading(true);
      const params: UpdateAdminParams = {
        name: values.name,
        loginId: values.loginId,
        loginPwd: values.loginPwd,
        oldLoginPwd: values.oldLoginPwd,
      };
      await updateAdmin(params);
      message.success('修改成功');
      form.setFieldsValue({ oldLoginPwd: '', loginPwd: '', confirm: '' });
    } catch (error) {
      message.error(error instanceof Error ? error.message : '修改失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>个人中心</h1>
      <Card className={styles.formCard}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{ name: '管理员', loginId: 'admin' }}
        >
          <Form.Item
            label="用户名"
            name="name"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            label="登录账号"
            name="loginId"
            rules={[{ required: true, message: '请输入登录账号' }]}
          >
            <Input placeholder="请输入登录账号" />
          </Form.Item>
          <Form.Item
            label="旧密码"
            name="oldLoginPwd"
            rules={[{ required: true, message: '请输入旧密码' }]}
          >
            <Input.Password placeholder="请输入旧密码" autoComplete="current-password" />
          </Form.Item>
          <Form.Item
            label="新密码"
            name="loginPwd"
            rules={[{ required: true, message: '请输入新密码' }]}
          >
            <Input.Password placeholder="请输入新密码" autoComplete="new-password" />
          </Form.Item>
          <Form.Item
            label="新密码确认"
            name="confirm"
            dependencies={['loginPwd']}
            rules={[
              { required: true, message: '请再次输入新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('loginPwd') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的新密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入新密码" autoComplete="new-password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              修改
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Admin;
