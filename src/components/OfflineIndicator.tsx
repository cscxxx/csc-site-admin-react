/**
 * 离线提示组件
 * 当网络离线时显示提示横幅
 */

import { Alert } from 'antd';
import { WifiOutlined } from '@ant-design/icons';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import styles from './OfflineIndicator.module.less';

function OfflineIndicator() {
  const isOnline = useNetworkStatus();

  // 在线时不显示
  if (isOnline) {
    return null;
  }

  return (
    <div className={styles.offlineIndicator}>
      <Alert
        message="网络连接已断开"
        description="当前处于离线状态，部分功能可能无法正常使用。请检查您的网络连接。"
        type="warning"
        icon={<WifiOutlined />}
        showIcon
        closable={false}
        banner
      />
    </div>
  );
}

export default OfflineIndicator;
