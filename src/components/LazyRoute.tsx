import { Suspense } from 'react';
import { Spin } from 'antd';
import RouteTransition from './RouteTransition';

// 加载中占位组件
function LoadingFallback() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
      }}
    >
      <Spin size="large">
        <div style={{ minHeight: '200px' }} />
      </Spin>
    </div>
  );
}

// 带过渡动画的懒加载组件包装器
interface LazyRouteProps {
  component: React.LazyExoticComponent<React.ComponentType>;
}

function LazyRoute({ component: Component }: LazyRouteProps) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RouteTransition>
        <Component />
      </RouteTransition>
    </Suspense>
  );
}

export default LazyRoute;
export { LoadingFallback };
