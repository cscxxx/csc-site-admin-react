import { App as AntdApp } from 'antd';
import { RouterProvider } from 'react-router-dom';
import ErrorBoundary from '@/components/ErrorBoundary';
import { router } from '@/router';

function App() {
  return (
    <ErrorBoundary>
      <AntdApp>
        <RouterProvider router={router} />
      </AntdApp>
    </ErrorBoundary>
  );
}

export default App;
