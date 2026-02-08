/**
 * 路由配置
 *
 * 使用 React Router DOM v7 的 createBrowserRouter 创建路由
 *
 * 路由结构：
 * - 公开路由：/login（登录页面）、*（404 页面）
 * - 受保护路由：所有需要登录的页面都在 / 路由下，使用 ProtectedRoute 组件进行认证检查
 *
 * 路由特性：
 * - 使用 React.lazy 进行代码分割和懒加载
 * - 受保护路由使用 LazyRoute 组件包装，提供加载状态和过渡动画
 * - 默认路由（/）重定向到 /dashboard
 *
 * @module router
 */

import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '@/layouts';
import ProtectedRoute from '@/components/ProtectedRoute';
import LazyRoute, { LoadingFallback } from '@/components/LazyRoute';

// 路由懒加载：使用 React.lazy 动态导入页面组件
const Login = lazy(() => import('@/pages/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const CursorGuide = lazy(() => import('@/pages/CursorGuide'));
const Settings = lazy(() => import('@/pages/Settings'));
const Mock = lazy(() => import('@/pages/Mock'));
const Performance = lazy(() => import('@/pages/Performance'));
const Banner = lazy(() => import('@/pages/Banner'));
const Admin = lazy(() => import('@/pages/Admin'));
const About = lazy(() => import('@/pages/About'));
const Message = lazy(() => import('@/pages/Message'));
const Project = lazy(() => import('@/pages/Project'));
const Blogtype = lazy(() => import('@/pages/Blogtype/index.tsx'));
const Blog = lazy(() => import('@/pages/Blog/index.tsx'));
const BlogEditPage = lazy(() => import('@/pages/Blog/BlogEditPage/index.tsx'));
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
        element: <Navigate to="/cursor-guide" replace />,
      },
      {
        path: 'cursor-guide',
        element: <LazyRoute component={CursorGuide} />,
      },
      {
        path: 'admin',
        element: <LazyRoute component={Admin} />,
      },
      {
        path: 'settings',
        element: <LazyRoute component={Settings} />,
      },
      {
        path: 'mock',
        element: <LazyRoute component={Mock} />,
      },
      {
        path: 'performance',
        element: <LazyRoute component={Performance} />,
      },
      {
        path: 'banner',
        element: <LazyRoute component={Banner} />,
      },
      {
        path: 'about',
        element: <LazyRoute component={About} />,
      },
      {
        path: 'message',
        element: <LazyRoute component={Message} />,
      },
      {
        path: 'project',
        element: <LazyRoute component={Project} />,
      },
      {
        path: 'blogtype',
        element: <LazyRoute component={Blogtype} />,
      },
      {
        path: 'blog',
        element: <LazyRoute component={Blog} />,
      },
      {
        path: 'blog/edit',
        element: <LazyRoute component={BlogEditPage} />,
      },
      {
        path: 'blog/edit/:id',
        element: <LazyRoute component={BlogEditPage} />,
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
