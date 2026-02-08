import { useState, useEffect, useCallback } from 'react';
import { Form, Input, Button, Card, App, theme, Space, Checkbox } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useSettingStore } from '@/store';
import { getCaptcha, login } from './service';
import { getSetting } from '@/pages/Settings/service';
import styles from './index.module.less';

function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.login);
  const setSetting = useSettingStore(state => state.setSetting);
  const [form] = Form.useForm();
  const { token } = theme.useToken();
  const { message } = App.useApp();
  const [captchaSvg, setCaptchaSvg] = useState<string>('');
  const [loadingCaptcha, setLoadingCaptcha] = useState(false);
  const [loading, setLoading] = useState(false);

  // 加载验证码
  const loadCaptcha = useCallback(async () => {
    try {
      setLoadingCaptcha(true);
      const svg = await getCaptcha();
      setCaptchaSvg(svg);
    } catch (error) {
      message.error('获取验证码失败，请重试');
      console.error('Failed to load captcha:', error);
    } finally {
      setLoadingCaptcha(false);
    }
  }, [message]);

  // 组件挂载时加载验证码
  useEffect(() => {
    loadCaptcha();
  }, [loadCaptcha]);

  const onFinish = async (values: {
    loginId: string;
    loginPwd: string;
    captcha: string;
    remember?: boolean;
  }) => {
    try {
      setLoading(true);
      const { response, token } = await login({
        loginId: values.loginId,
        loginPwd: values.loginPwd,
        captcha: values.captcha,
        remember: values.remember ? 7 : 0,
      });

      if (response.code === 0 && token) {
        setAuth(token);
        try {
          const settingData = await getSetting();
          setSetting(settingData);
        } catch {
          message.warning('登录成功，但获取设置信息失败');
        }
        message.success('登录成功！');
        navigate('/dashboard', { replace: true });
      } else {
        message.error(response.msg || '登录失败，请重试');
        loadCaptcha();
        form.setFieldsValue({ captcha: '' });
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : '登录失败，请检查网络连接';
      message.error(msg);
      loadCaptcha();
      form.setFieldsValue({ captcha: '' });
    } finally {
      setLoading(false);
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
        <Form form={form} name="login" onFinish={onFinish} autoComplete="off" layout="vertical">
          <Form.Item
            label="用户名"
            name="loginId"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="loginPwd"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>

          <Form.Item
            label="验证码"
            name="captcha"
            rules={[{ required: true, message: '请输入验证码!' }]}
          >
            <Input placeholder="请输入验证码" />
          </Form.Item>

          <Form.Item>
            <div
              className={styles.captchaContainer}
              onClick={loadCaptcha}
              style={{ cursor: loadingCaptcha ? 'not-allowed' : 'pointer' }}
              title="点击刷新验证码"
            >
              {captchaSvg ? (
                <div
                  dangerouslySetInnerHTML={{ __html: captchaSvg }}
                  className={styles.captchaSvg}
                />
              ) : (
                <div className={styles.captchaPlaceholder}>加载中...</div>
              )}
            </div>
          </Form.Item>

          <Form.Item>
            <Space orientation="vertical" style={{ width: '100%' }}>
              <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: 0 }}>
                <Checkbox>记住我（7天）</Checkbox>
              </Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                登录
              </Button>
            </Space>
          </Form.Item>
        </Form>
        <div className={styles.loginTip}>
          <p>提示：请输入用户名、密码和验证码进行登录</p>
        </div>
      </Card>
      <footer className={styles.loginFooter}>鄂ICP备2026005471号</footer>
    </div>
  );
}

export default Login;
