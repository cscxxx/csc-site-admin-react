import { useState, useCallback } from 'react';
import { Card, Button, Space, Table, Tag, Input, Form, App, Spin, Descriptions, Tabs } from 'antd';
import { PlayCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import request from '@/utils/request';
import { useMockApiList, type ApiItem } from './use-mock-api-list.ts';
import { useMockColumns } from './use-mock-columns.tsx';
import styles from './index.module.less';

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

  const apiList = useMockApiList();

  const handleTestApi = useCallback(
    async (api: ApiItem) => {
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
    },
    [form, message]
  );

  const columns = useMockColumns({ onTest: handleTestApi, loading });

  // 按分类分组
  const groupedApis = apiList.reduce(
    (acc, api) => {
      if (!acc[api.category]) {
        acc[api.category] = [];
      }
      acc[api.category].push(api);
      return acc;
    },
    {} as Record<string, ApiItem[]>
  );

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

  const tabItems = Object.keys(groupedApis).map(category => ({
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
                  <Tag
                    color={
                      selectedApi.method === 'GET'
                        ? 'blue'
                        : selectedApi.method === 'POST'
                          ? 'green'
                          : selectedApi.method === 'PUT'
                            ? 'orange'
                            : 'red'
                    }
                  >
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
              <Spin size="large" tip="请求中...">
                <div style={{ minHeight: '200px' }} />
              </Spin>
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
