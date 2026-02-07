/**
 * Mock 页面 API 列表配置 Hook
 */

import { useMemo } from 'react';

export interface ApiItem {
  key: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  description: string;
  category: string;
  params?: Record<string, unknown>;
}

const MOCK_API_LIST: ApiItem[] = [
  {
    key: 'users-list',
    name: '获取用户列表',
    method: 'GET',
    url: '/api/users',
    description: '获取分页用户列表，支持关键词搜索',
    category: '用户管理',
    params: { page: 1, pageSize: 10, keyword: '' },
  },
  {
    key: 'user-detail',
    name: '获取用户详情',
    method: 'GET',
    url: '/api/users/1',
    description: '根据用户 ID 获取用户详细信息',
    category: '用户管理',
  },
  {
    key: 'user-create',
    name: '创建用户',
    method: 'POST',
    url: '/api/users',
    description: '创建新用户',
    category: '用户管理',
    params: { name: '新用户', email: 'user@example.com', role: '用户' },
  },
  {
    key: 'user-update',
    name: '更新用户',
    method: 'PUT',
    url: '/api/users/1',
    description: '更新用户信息',
    category: '用户管理',
    params: { name: '更新后的用户名', email: 'updated@example.com' },
  },
  {
    key: 'user-delete',
    name: '删除用户',
    method: 'DELETE',
    url: '/api/users/1',
    description: '删除指定用户',
    category: '用户管理',
  },
  {
    key: 'dashboard-statistics',
    name: '获取统计数据',
    method: 'GET',
    url: '/api/dashboard/statistics',
    description: '获取仪表盘统计数据',
    category: '仪表盘',
  },
  {
    key: 'dashboard-chart',
    name: '获取图表数据',
    method: 'GET',
    url: '/api/dashboard/chart',
    description: '获取图表数据，支持不同类型和天数',
    category: '仪表盘',
    params: { type: 'line', days: 7 },
  },
  {
    key: 'dashboard-activities',
    name: '获取最近活动',
    method: 'GET',
    url: '/api/dashboard/activities',
    description: '获取最近的活动记录',
    category: '仪表盘',
    params: { limit: 10 },
  },
  {
    key: 'settings-get',
    name: '获取系统配置',
    method: 'GET',
    url: '/api/settings',
    description: '获取系统配置信息',
    category: '通用',
  },
  {
    key: 'settings-update',
    name: '更新系统配置',
    method: 'PUT',
    url: '/api/settings',
    description: '更新系统配置',
    category: '通用',
    params: { siteName: 'CSC Site', theme: 'light' },
  },
  {
    key: 'upload',
    name: '上传文件',
    method: 'POST',
    url: '/api/upload',
    description: '上传文件接口',
    category: '通用',
  },
];

export function useMockApiList(): ApiItem[] {
  return useMemo(() => MOCK_API_LIST, []);
}
