import { useRef } from 'react';
import { Layout, Menu, Button, Space } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  ApiOutlined,
  BarChartOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/store';
import { useTitleAnimation } from './use-anime';
import styles from './index.module.less';

const { Header, Footer, Sider, Content } = Layout;

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore(state => state.logout);

  // 为每个单词创建 ref
  const cscRef = useRef<HTMLSpanElement>(null);
  const siteRef = useRef<HTMLSpanElement>(null);

  // 定义每个单词的颜色
  const colors = ['#4A90E2', '#50C878']; // CSC 蓝色，Site 绿色

  // 应用标题动画效果
  useTitleAnimation([cscRef, siteRef], colors, {
    duration: 0.6,
    jumpHeight: -15,
    delay: 0.15,
  });

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: '用户管理',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      key: '/mock',
      icon: <ApiOutlined />,
      label: 'Mock 数据',
    },
    {
      key: '/performance',
      icon: <BarChartOutlined />,
      label: '性能监控',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // 获取当前选中的菜单项
  const selectedKeys = [location.pathname];

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.headerTitle}>
          <span ref={cscRef} className={styles.titleWord}>
            CSC
          </span>
          <span className={styles.titleSpace}> </span>
          <span ref={siteRef} className={styles.titleWord}>
            Site
          </span>
        </div>
        <Space>
          <span>欢迎，管理员</span>
          <Button type="primary" icon={<LogoutOutlined />} onClick={handleLogout}>
            退出登录
          </Button>
        </Space>
      </Header>
      <Layout>
        <Sider width={200} className={styles.sider}>
          <Menu
            mode="inline"
            selectedKeys={selectedKeys}
            items={menuItems}
            onClick={handleMenuClick}
            className={styles.menu}
          />
        </Sider>
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
      <Footer className={styles.footer}>Footer © 2026 CSC Site</Footer>
    </Layout>
  );
}

export default AppLayout;
