import { Card, Form, Input, Button, Switch, App } from 'antd';
import styles from './index.module.less';

function Settings() {
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const onFinish = (values: Record<string, unknown>) => {
    console.log('Settings values:', values);
    message.success('设置已保存！');
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>设置</h1>
      <Card title="基本设置" className={styles.settingsCard}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            siteName: 'CSC Site',
            siteDescription: '这是一个示例网站',
            emailNotifications: true,
            smsNotifications: false,
          }}
        >
          <Form.Item label="网站名称" name="siteName">
            <Input placeholder="请输入网站名称" />
          </Form.Item>
          <Form.Item label="网站描述" name="siteDescription">
            <Input.TextArea rows={4} placeholder="请输入网站描述" />
          </Form.Item>
          <Form.Item label="邮件通知" name="emailNotifications" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="短信通知" name="smsNotifications" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              保存设置
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Settings;
