/**
 * 头部下拉菜单配置
 * 个人中心、设置、退出登录
 */

import { useMemo } from 'react';
import type { MenuProps } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';

export function useHeaderMenu(): MenuProps['items'] {
  return useMemo<MenuProps['items']>(
    () => [
      {
        key: 'admin',
        icon: <UserOutlined />,
        label: '个人中心',
      },
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: '设置',
      },
      {
        type: 'divider',
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '退出登录',
      },
    ],
    []
  );
}
