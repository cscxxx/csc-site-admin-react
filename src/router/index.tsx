import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '../layouts';
import ProtectedRoute from '../components/ProtectedRoute';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Users from '../pages/Users';
import Settings from '../pages/Settings';
import Mock from '../pages/Mock';
import NotFound from '../pages/NotFound';

export const router = createBrowserRouter([
  // 公开路由：登录页面，无需登录验证
  {
    path: '/login',
    element: <Login />,
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
        element: <Dashboard />,
      },
      {
        path: 'users',
        element: <Users />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: 'mock',
        element: <Mock />,
      },
    ],
  },
  // 公开路由：404 页面，无需登录验证
  {
    path: '*',
    element: <NotFound />,
  },
]);
