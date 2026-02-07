import { useEffect } from 'react';
import { Card, Row, Col, Statistic, Tag, Button, Space, Table, App, Descriptions } from 'antd';
import { ReloadOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { usePerformanceStore } from '@/store';
import {
  initWebVitals,
  getCurrentMetrics,
  clearPerformanceHistory,
} from '@/utils/performance/vitals';
import type { PerformanceRecord } from '@/types';
import { COLORS } from '@/styles/constants';
import { useMetricInfo } from './use-metric-info.ts';
import styles from './index.module.less';
import dayjs from 'dayjs';

function Performance() {
  const { message } = App.useApp();
  const { currentMetrics, history, updateMetrics, refreshHistory, clearHistory } =
    usePerformanceStore();
  const { metricInfo: METRIC_INFO, getRatingColor, getRatingText, formatMetricValue } =
    useMetricInfo();

  // 刷新当前指标
  const handleRefresh = () => {
    const metrics = getCurrentMetrics();
    updateMetrics(metrics);
    refreshHistory();
    message.success('性能数据已刷新');
  };

  // 清除历史记录
  const handleClearHistory = () => {
    clearPerformanceHistory();
    clearHistory();
    message.success('历史记录已清除');
  };

  // 初始化性能监控（如果当前没有指标）
  useEffect(() => {
    // 页面挂载时刷新历史记录
    refreshHistory();

    if (Object.keys(currentMetrics).length === 0) {
      initWebVitals(metrics => {
        updateMetrics(metrics);
        // 指标更新后刷新历史记录
        refreshHistory();
      });
    }
  }, [currentMetrics, updateMetrics, refreshHistory]);

  // 历史记录表格列定义
  const historyColumns: ColumnsType<PerformanceRecord> = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (timestamp: number) => dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'LCP',
      key: 'lcp',
      width: 120,
      render: (_, record) => {
        const metric = record.metrics.LCP;
        if (!metric) return '-';
        return (
          <Space>
            <span>{formatMetricValue('LCP', metric.value)}</span>
            <Tag color={getRatingColor(metric.rating)}>{getRatingText(metric.rating)}</Tag>
          </Space>
        );
      },
    },
    {
      title: 'INP',
      key: 'inp',
      width: 120,
      render: (_, record) => {
        const metric = record.metrics.INP;
        if (!metric) return '-';
        return (
          <Space>
            <span>{formatMetricValue('INP', metric.value)}</span>
            <Tag color={getRatingColor(metric.rating)}>{getRatingText(metric.rating)}</Tag>
          </Space>
        );
      },
    },
    {
      title: 'CLS',
      key: 'cls',
      width: 120,
      render: (_, record) => {
        const metric = record.metrics.CLS;
        if (!metric) return '-';
        return (
          <Space>
            <span>{formatMetricValue('CLS', metric.value)}</span>
            <Tag color={getRatingColor(metric.rating)}>{getRatingText(metric.rating)}</Tag>
          </Space>
        );
      },
    },
    {
      title: 'FCP',
      key: 'fcp',
      width: 120,
      render: (_, record) => {
        const metric = record.metrics.FCP;
        if (!metric) return '-';
        return (
          <Space>
            <span>{formatMetricValue('FCP', metric.value)}</span>
            <Tag color={getRatingColor(metric.rating)}>{getRatingText(metric.rating)}</Tag>
          </Space>
        );
      },
    },
    {
      title: 'TTFB',
      key: 'ttfb',
      width: 120,
      render: (_, record) => {
        const metric = record.metrics.TTFB;
        if (!metric) return '-';
        return (
          <Space>
            <span>{formatMetricValue('TTFB', metric.value)}</span>
            <Tag color={getRatingColor(metric.rating)}>{getRatingText(metric.rating)}</Tag>
          </Space>
        );
      },
    },
  ];

  // 获取当前指标卡片数据
  const getMetricCards = () => {
    const metrics = ['LCP', 'INP', 'CLS', 'FCP', 'TTFB'] as const;
    return metrics.map(name => {
      const metric = currentMetrics[name];
      const info = METRIC_INFO[name];
      const hasMetric = !!metric;

      return (
        <Col xs={24} sm={12} lg={8} key={name}>
          <Card>
            <Statistic
              title={
                <Space>
                  <span>{info.label}</span>
                  {hasMetric && (
                    <Tag color={getRatingColor(metric.rating)}>{getRatingText(metric.rating)}</Tag>
                  )}
                </Space>
              }
              value={hasMetric ? formatMetricValue(name, metric.value) : '-'}
              styles={{
                content: {
                  color: hasMetric ? getRatingColor(metric.rating) : COLORS.primary,
                },
              }}
            />
            <Descriptions
              size="small"
              column={1}
              style={{ marginTop: 16 }}
              items={[
                {
                  label: '说明',
                  children: info.description,
                },
                ...(hasMetric
                  ? [
                      {
                        label: '阈值',
                        children: `好: ≤${formatMetricValue(name, info.thresholds.good)}, 差: >${formatMetricValue(name, info.thresholds.poor)}`,
                      },
                    ]
                  : []),
              ]}
            />
          </Card>
        </Col>
      );
    });
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>性能监控</h1>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
            刷新数据
          </Button>
          <Button icon={<DeleteOutlined />} danger onClick={handleClearHistory}>
            清除历史
          </Button>
        </Space>
      </div>

      <Card title="Core Web Vitals" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>{getMetricCards()}</Row>
      </Card>

      <Card title="历史记录">
        <Table
          columns={historyColumns}
          dataSource={history}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: '暂无历史记录' }}
        />
      </Card>
    </div>
  );
}

export default Performance;
