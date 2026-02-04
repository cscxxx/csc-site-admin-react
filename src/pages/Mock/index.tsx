import { useState } from 'react';
import { Card, Button, Space, Table, Tag, Input, Form, App, Spin, Descriptions, Tabs } from 'antd';
import { PlayCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import request from '../../utils/request';
import styles from './index.module.less';

interface ApiItem {
  key: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  description: string;
  category: string;
  params?: Record<string, unknown>;
}

interface ResponseData {
  code: number;
  message?: string;
  data: unknown;
}

function Mock() {
  const { message } = App.useApp();
  const [loading, setLoading] = useState<string | null>(null);
  const [responseData, setResponseData] = useState<ResponseData | null>(null);
  const [selectedApi, setSelectedApi] = useState<ApiItem | null>(null);
  const [form] = Form.useForm();

  // 定义常用的 Mock API 列表
  const apiList: ApiItem[] = [
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

  // 按分类分组
  const groupedApis = apiList.reduce((acc, api) => {
    if (!acc[api.category]) {
      acc[api.category] = [];
    }
    acc[api.category].push(api);
    return acc;
  }, {} as Record<string, ApiItem[]>);

  const columns: ColumnsType<ApiItem> = [
    {
      title: 'API 名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '方法',
      dataIndex: 'method',
      key: 'method',
      width: 100,
      render: (method: string) => {
        const colorMap: Record<string, string> = {
          GET: 'blue',
          POST: 'green',
          PUT: 'orange',
          DELETE: 'red',
        };
        return <Tag color={colorMap[method]}>{method}</Tag>;
      },
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      ellipsis: true,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<PlayCircleOutlined />}
          onClick={() => handleTestApi(record)}
          loading={loading === record.key}
        >
          测试
        </Button>
      ),
    },
  ];

  const handleTestApi = async (api: ApiItem) => {
    setLoading(api.key);
    setSelectedApi(api);
    setResponseData(null);

    try {
      let response;
      const formValues = form.getFieldsValue();

      switch (api.method) {
        case 'GET':
          response = await request.get(api.url, {
            params: { ...api.params, ...formValues },
          }).promise;
          break;
        case 'POST':
          response = await request.post(api.url, { ...api.params, ...formValues }).promise;
          break;
        case 'PUT':
          response = await request.put(api.url, { ...api.params, ...formValues }).promise;
          break;
        case 'DELETE':
          response = await request.delete(api.url).promise;
          break;
        default:
          throw new Error(`Unsupported method: ${api.method}`);
      }

      // 响应数据在 response.data 中
      const responseBody = response.data as ResponseData;
      setResponseData(responseBody);
      message.success('请求成功！');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      message.error(`请求失败: ${errorMessage}`);
      setResponseData({
        code: 500,
        message: errorMessage,
        data: null,
      });
    } finally {
      setLoading(null);
    }
  };

  const handleReset = () => {
    setResponseData(null);
    setSelectedApi(null);
    form.resetFields();
  };

  const formatJSON = (obj: unknown): string => {
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return String(obj);
    }
  };

  const tabItems = Object.keys(groupedApis).map((category) => ({
    key: category,
    label: category,
    children: (
      <Table
        columns={columns}
        dataSource={groupedApis[category]}
        pagination={false}
        size="small"
        rowKey="key"
      />
    ),
  }));

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Mock 数据测试</h1>

      <div className={styles.contentWrapper}>
        <Card title="API 列表" className={styles.apiCard}>
          <Tabs items={tabItems} />
        </Card>

        <Card
          title="请求参数"
          className={styles.paramsCard}
          extra={
            <Space>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
            </Space>
          }
        >
          {selectedApi ? (
            <Form form={form} layout="vertical">
              <Descriptions column={1} size="small" bordered>
                <Descriptions.Item label="API 名称">{selectedApi.name}</Descriptions.Item>
                <Descriptions.Item label="请求方法">
                  <Tag color={selectedApi.method === 'GET' ? 'blue' : selectedApi.method === 'POST' ? 'green' : selectedApi.method === 'PUT' ? 'orange' : 'red'}>
                    {selectedApi.method}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="请求 URL">{selectedApi.url}</Descriptions.Item>
                <Descriptions.Item label="描述">{selectedApi.description}</Descriptions.Item>
              </Descriptions>

              {selectedApi.params && Object.keys(selectedApi.params).length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <h4>参数设置</h4>
                  {Object.entries(selectedApi.params).map(([key, value]) => (
                    <Form.Item key={key} label={key} name={key} initialValue={value}>
                      <Input placeholder={`请输入 ${key}`} />
                    </Form.Item>
                  ))}
                </div>
              )}

              <Form.Item>
                <Button
                  type="primary"
                  icon={<PlayCircleOutlined />}
                  onClick={() => handleTestApi(selectedApi)}
                  loading={loading === selectedApi.key}
                  block
                >
                  发送请求
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <div className={styles.emptyState}>请选择一个 API 进行测试</div>
          )}
        </Card>

        <Card title="响应结果" className={styles.responseCard}>
          {loading ? (
            <div className={styles.loadingWrapper}>
              <Spin size="large" tip="请求中..." />
            </div>
          ) : responseData ? (
            <div>
              <Descriptions column={1} size="small" bordered style={{ marginBottom: 16 }}>
                <Descriptions.Item label="状态码">
                  <Tag color={responseData.code === 200 ? 'success' : 'error'}>
                    {responseData.code}
                  </Tag>
                </Descriptions.Item>
                {responseData.message && (
                  <Descriptions.Item label="消息">{responseData.message}</Descriptions.Item>
                )}
              </Descriptions>

              <div>
                <h4>响应数据：</h4>
                <pre className={styles.jsonPreview}>{formatJSON(responseData.data)}</pre>
              </div>
            </div>
          ) : (
            <div className={styles.emptyState}>暂无响应数据</div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default Mock;
