import { Form, Input, Button, Card, App, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';
import styles from './index.module.less';

function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [form] = Form.useForm();
  const { token } = theme.useToken();
  const { message } = App.useApp();

  const onFinish = async (values: { username: string; password: string }) => {
    // 模拟登录逻辑
    if (values.username === 'admin' && values.password === 'admin') {
      // 登录成功
      login('mock_token_' + Date.now());
      message.success('登录成功！');
      navigate('/dashboard', { replace: true });
    } else {
      message.error('用户名或密码错误！');
    }
  };

  return (
    <div
      className={styles.loginContainer}
      style={{
        background: `linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorPrimaryHover} 100%)`,
      }}
    >
      <Card className={styles.loginCard} title="登录" variant="borderless">
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              登录
            </Button>
          </Form.Item>
        </Form>
        <div className={styles.loginTip}>
          <p>提示：用户名和密码均为 admin</p>
        </div>
      </Card>
    </div>
  );
}

export default Login;
