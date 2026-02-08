/**
 * 侧边栏菜单配置
 * 顺序：首页总览 → 核心业务（文章）→ 内容与互动 → 设置与关于 → 帮助与示例 → 开发工具
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
        key: '/banner',
        icon: <FileTextOutlined />,
        label: '首页标语',
      },
      {
        key: '/message',
        icon: <MessageOutlined />,
        label: '留言板管理',
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
        key: '/cursor-guide',
        icon: <UserOutlined />,
        label: 'Cursor 指南',
      },
      {
        key: '/project',
        icon: <ProjectOutlined />,
        label: '示例项目',
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
