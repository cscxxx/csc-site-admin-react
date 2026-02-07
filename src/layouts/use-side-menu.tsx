/**
 * 侧边栏菜单配置
 * 仪表盘、用户管理、首页标语、设置、Mock 数据、性能监控
 */

import { useMemo } from 'react';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  SettingOutlined,
  ApiOutlined,
  BarChartOutlined,
  InfoCircleOutlined,
  MessageOutlined,
  ProjectOutlined,
  FolderOutlined,
} from '@ant-design/icons';

export function useSideMenu(): MenuProps['items'] {
  return useMemo<MenuProps['items']>(
    () => [
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
        key: '/banner',
        icon: <FileTextOutlined />,
        label: '首页标语',
      },
      {
        key: '/settings',
        icon: <SettingOutlined />,
        label: '设置',
      },
      {
        key: '/about',
        icon: <InfoCircleOutlined />,
        label: '关于',
      },
      {
        key: '/message',
        icon: <MessageOutlined />,
        label: '留言板管理',
      },
      {
        key: '/project',
        icon: <ProjectOutlined />,
        label: '示例项目',
      },
      {
        key: 'article',
        icon: <FolderOutlined />,
        label: '文章管理',
        children: [
          { key: '/blogtype', label: '文章分类' },
          { key: '/blog', label: '文章列表' },
          { key: '/blog/edit', label: '新增与编辑文章' },
        ],
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
    ],
    []
  );
}
