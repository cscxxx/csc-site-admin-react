import { Component, type ReactNode } from 'react';
import { Result, Button, Space, Collapse } from 'antd';
import { HomeOutlined, ReloadOutlined, BugOutlined, WifiOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { handleError } from '@/utils/error/logger';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import styles from './ErrorBoundary.module.less';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * React 错误边界组件
 * 捕获子组件树中的 JavaScript 错误，并显示友好的错误提示界面
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 记录错误信息
    this.setState({
      error,
      errorInfo,
    });

    // 处理错误（记录日志、上报等）
    handleError(error, errorInfo, 'react');
  }

  handleReset = () => {
    // 重置错误状态
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // 如果提供了自定义 fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 默认错误提示界面
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * 错误提示界面组件
 */
interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  onReset: () => void;
}

function ErrorFallback({ error, errorInfo, onReset }: ErrorFallbackProps) {
  const navigate = useNavigate();
  const isOnline = useNetworkStatus();

  // 判断是否为网络相关错误
  const isNetworkError =
    !isOnline ||
    error?.message?.includes('fetch') ||
    error?.message?.includes('network') ||
    error?.message?.includes('Network') ||
    error?.name === 'TypeError';

  const handleGoHome = () => {
    onReset();
    navigate('/dashboard', { replace: true });
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className={styles.errorBoundary}>
      <Result
        status={isNetworkError ? 'warning' : 'error'}
        icon={isNetworkError ? <WifiOutlined /> : undefined}
        title={isNetworkError ? '网络连接异常' : '页面出现错误'}
        subTitle={
          isNetworkError
            ? '当前网络连接异常，请检查您的网络设置后重试。'
            : '抱歉，页面遇到了一个错误。您可以尝试刷新页面或返回首页。'
        }
        extra={
          <Space>
            <Button type="primary" icon={<ReloadOutlined />} onClick={handleReload}>
              刷新页面
            </Button>
            <Button icon={<HomeOutlined />} onClick={handleGoHome}>
              返回首页
            </Button>
            <Button icon={<ReloadOutlined />} onClick={onReset}>
              重试
            </Button>
          </Space>
        }
      >
        {import.meta.env.DEV && (error || errorInfo) && (
          <div className={styles.errorDetails}>
            <Collapse
              items={[
                {
                  key: 'error',
                  label: (
                    <span>
                      <BugOutlined /> 错误详情（仅开发环境显示）
                    </span>
                  ),
                  children: (
                    <div>
                      {error && (
                        <div>
                          <h4>错误信息：</h4>
                          <pre className={styles.errorStack}>{error.message}</pre>
                        </div>
                      )}
                      {error?.stack && (
                        <div>
                          <h4>错误堆栈：</h4>
                          <pre className={styles.errorStack}>{error.stack}</pre>
                        </div>
                      )}
                      {errorInfo?.componentStack && (
                        <div>
                          <h4>组件堆栈：</h4>
                          <pre className={styles.errorStack}>{errorInfo.componentStack}</pre>
                        </div>
                      )}
                    </div>
                  ),
                },
              ]}
            />
          </div>
        )}
      </Result>
    </div>
  );
}

export default ErrorBoundary;
