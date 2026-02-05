import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '@/layouts';
import ProtectedRoute from '@/components/ProtectedRoute';
import LazyRoute, { LoadingFallback } from '@/components/LazyRoute';

// 路由懒加载：使用 React.lazy 动态导入页面组件
const Login = lazy(() => import('@/pages/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Users = lazy(() => import('@/pages/Users'));
const Settings = lazy(() => import('@/pages/Settings'));
const Mock = lazy(() => import('@/pages/Mock'));
const NotFound = lazy(() => import('@/pages/NotFound'));

export const router = createBrowserRouter([
  // 公开路由：登录页面，无需登录验证
  {
    path: '/login',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Login />
      </Suspense>
    ),
  },
  // 受保护路由：所有需要登录的页面都在此路由下
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <LazyRoute component={Dashboard} />,
      },
      {
        path: 'users',
        element: <LazyRoute component={Users} />,
      },
      {
        path: 'settings',
        element: <LazyRoute component={Settings} />,
      },
      {
        path: 'mock',
        element: <LazyRoute component={Mock} />,
      },
    ],
  },
  // 公开路由：404 页面，无需登录验证
  {
    path: '*',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <NotFound />
      </Suspense>
    ),
  },
]);
