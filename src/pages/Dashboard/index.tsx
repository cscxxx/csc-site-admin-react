import { Card, Row, Col, Statistic } from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import styles from './index.module.less';
import { COLORS } from '../../styles/constants';
import { formatCurrency, formatPercentage, formatNumber } from '../../utils/formatNumber';

function Dashboard() {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>仪表盘</h1>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={1128}
              formatter={value => formatNumber(value as number)}
              prefix={<UserOutlined />}
              styles={{ content: { color: COLORS.success } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="订单总数"
              value={9324}
              formatter={value => formatNumber(value as number)}
              prefix={<ShoppingCartOutlined />}
              styles={{ content: { color: COLORS.primary } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总收入"
              value={112893}
              formatter={value => formatCurrency(value as number)}
              prefix={<DollarOutlined />}
              styles={{ content: { color: COLORS.error } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="增长率"
              value={9.3}
              formatter={value => formatPercentage(value as number)}
              prefix={<LineChartOutlined />}
              styles={{ content: { color: COLORS.success } }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
