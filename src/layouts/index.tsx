import { useRef, useMemo, useState } from 'react';
import { Layout, Menu, Dropdown, theme } from 'antd';
import type { MenuProps } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { DownOutlined } from '@ant-design/icons';
import { useAuthStore, useSettingStore } from '@/store';
import { useTitleAnimation } from './use-anime';
import { useHeaderMenu } from './use-header-menu.tsx';
import { useSideMenu } from './use-side-menu.tsx';
import styles from './index.module.less';

const { Header, Footer, Sider, Content } = Layout;

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore(state => state.logout);
  const clearSetting = useSettingStore(state => state.clearSetting);
  const setting = useSettingStore(state => state.setting);
  const { token } = theme.useToken();

  const cscRef = useRef<HTMLSpanElement>(null);
  const siteRef = useRef<HTMLSpanElement>(null);

  // 标题两词使用主题色（浅色字 + 主色浅底）
  const titleColors = [token.colorTextLightSolid, token.colorPrimaryBg];

  useTitleAnimation([cscRef, siteRef], titleColors, {
    duration: 0.6,
    jumpHeight: -15,
    delay: 0.15,
  });

  const menuItems = useSideMenu();
  const headerMenuItems = useHeaderMenu();

  const handleMenuClick = ({ key }: { key: string }) => {
    // 仅对带路径的叶子项导航，父项（如 article）点击只展开/收起，不跳转
    if (key.startsWith('/')) {
      navigate(key);
    }
  };

  const handleLogout = () => {
    logout();
    clearSetting();
    navigate('/login', { replace: true });
  };

  const onHeaderMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      handleLogout();
    } else if (key === 'admin') {
      navigate('/admin');
    } else if (key === 'settings') {
      navigate('/settings');
    }
  };

  // /blog/edit 或 /blog/edit/:id 时高亮「新增与编辑文章」
  const selectedKeys =
    location.pathname === '/blog/edit' || location.pathname.startsWith('/blog/edit/')
      ? ['/blog/edit']
      : [location.pathname];

  // 侧栏子菜单展开：路径在 blogtype/blog 下时强制展开「文章管理」；否则用用户点击的展开状态
  const pathnameOpenKeys = useMemo(
    () =>
      location.pathname.startsWith('/blogtype') || location.pathname.startsWith('/blog')
        ? ['article']
        : [],
    [location.pathname]
  );
  const [userOpenKeys, setUserOpenKeys] = useState<string[]>([]);
  const openKeys = pathnameOpenKeys.length > 0 ? pathnameOpenKeys : userOpenKeys;

  // 头部下拉：当前在个人中心/设置页时高亮对应菜单项
  const headerSelectedKeys =
    location.pathname === '/admin'
      ? ['admin']
      : location.pathname === '/settings'
        ? ['settings']
        : [];

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
        <Dropdown
          trigger={['hover']}
          popupRender={() => (
            <Menu
              selectedKeys={headerSelectedKeys}
              items={headerMenuItems}
              onClick={onHeaderMenuClick}
              style={{ minWidth: 160 }}
            />
          )}
        >
          <span className={styles.headerUserTrigger} style={{ color: token.colorTextLightSolid }}>
            {setting?.avatar ? (
              <img src={setting.avatar} alt="头像" className={styles.headerAvatar} />
            ) : (
              <span>欢迎，管理员</span>
            )}
            <DownOutlined />
          </span>
        </Dropdown>
      </Header>
      <div className={styles.bodyWrap}>
        <Sider width={200} className={styles.sider}>
          <div className={styles.siderInner}>
            <Menu
              mode="inline"
              selectedKeys={selectedKeys}
              openKeys={openKeys}
              onOpenChange={setUserOpenKeys}
              items={menuItems}
              onClick={handleMenuClick}
              className={styles.menu}
            />
            <Footer className={styles.footer}>{setting?.icp ?? 'Footer © 2026 CSC Site'}</Footer>
          </div>
        </Sider>
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </div>
    </Layout>
  );
}

export default AppLayout;
