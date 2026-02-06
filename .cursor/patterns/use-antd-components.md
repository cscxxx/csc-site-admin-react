# Ant Design 组件使用模式

## App 实例使用

### 获取 App 实例

```typescript
import { App } from 'antd';

function MyComponent() {
  const { message, notification, modal } = App.useApp();
  
  // 使用 message
  message.success('操作成功');
  message.error('操作失败');
  
  // 使用 notification
  notification.info({
    message: '通知标题',
    description: '通知内容',
  });
  
  // 使用 modal
  modal.confirm({
    title: '确认删除',
    content: '确定要删除吗？',
    onOk: () => {
      // 确认操作
    },
  });
}
```

### 注意事项

- 必须在组件顶层调用 `App.useApp()`，不能在条件语句中调用
- 组件必须被 `<App>` 包裹（通常在 `main.tsx` 中）

## Form 表单使用

### 基础表单

```typescript
import { Form, Input, Button, App } from 'antd';

function MyForm() {
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const onFinish = async (values: FormValues) => {
    try {
      // 提交数据
      await submitData(values);
      message.success('提交成功');
    } catch (error) {
      message.error('提交失败');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          { required: true, message: '请输入用户名' },
          { min: 3, message: '用户名至少3个字符' },
        ]}
      >
        <Input placeholder="请输入用户名" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
}
```

### 表单验证

```typescript
<Form.Item
  name="email"
  label="邮箱"
  rules={[
    { required: true, message: '请输入邮箱' },
    { type: 'email', message: '请输入有效的邮箱地址' },
  ]}
>
  <Input placeholder="请输入邮箱" />
</Form.Item>
```

## Table 表格使用

### 基础表格

```typescript
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { UserInfo } from '@/types';

const columns: ColumnsType<UserInfo> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '操作',
    key: 'action',
    render: (_, record) => (
      <Space>
        <Button onClick={() => handleEdit(record)}>编辑</Button>
        <Button danger onClick={() => handleDelete(record.id)}>删除</Button>
      </Space>
    ),
  },
];

function UserTable() {
  const [dataSource, setDataSource] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(false);

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      rowKey="id" // 使用数据本身的唯一标识
    />
  );
}
```

### 注意事项

- `rowKey` 必须使用数据本身的唯一标识字段（如 `id`），不要使用 `index`
- `dataIndex` 和 `key` 应该一致（除非有特殊需求）

## Space 和 Button 组合

```typescript
import { Space, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

<Space size="middle">
  <Button type="primary" icon={<EditOutlined />}>
    编辑
  </Button>
  <Button danger icon={<DeleteOutlined />}>
    删除
  </Button>
</Space>
```

## Card 卡片使用

```typescript
import { Card } from 'antd';

<Card
  title="卡片标题"
  extra={<Button>操作</Button>}
  className={styles.card}
>
  {/* 卡片内容 */}
</Card>
```

## Modal 对话框使用

### 基础 Modal

```typescript
import { Modal, App } from 'antd';

function MyComponent() {
  const { modal } = App.useApp();
  const [open, setOpen] = useState(false);

  const showModal = () => {
    modal.confirm({
      title: '确认操作',
      content: '确定要执行此操作吗？',
      onOk: async () => {
        // 执行操作
        await doSomething();
      },
    });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>打开对话框</Button>
      <Modal
        title="对话框标题"
        open={open}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
      >
        {/* 对话框内容 */}
      </Modal>
    </>
  );
}
```

## 响应式布局

### Row 和 Col

```typescript
import { Row, Col } from 'antd';

<Row gutter={16}>
  <Col xs={24} sm={12} md={8} lg={6}>
    {/* 内容 */}
  </Col>
  <Col xs={24} sm={12} md={8} lg={6}>
    {/* 内容 */}
  </Col>
</Row>
```

### 响应式断点

- `xs`: < 576px
- `sm`: ≥ 576px
- `md`: ≥ 768px
- `lg`: ≥ 992px
- `xl`: ≥ 1200px
- `xxl`: ≥ 1600px

## 样式使用

### 使用 Less 模块化样式

```typescript
import styles from './index.module.less';

<div className={styles.container}>
  <h1 className={styles.title}>标题</h1>
</div>
```

### 全局样式变量

```less
@import '@/styles/variables.less';

.container {
  padding: @spacing-lg;
  background: @bg-container;
  border-radius: @border-radius-base;
}
```

## 常见组件组合模式

### 搜索表单 + 表格

```typescript
<Card>
  <Form form={form} layout="inline" onFinish={handleSearch}>
    <Form.Item name="keyword">
      <Input placeholder="搜索关键词" />
    </Form.Item>
    <Form.Item>
      <Button type="primary" htmlType="submit">搜索</Button>
    </Form.Item>
  </Form>
  
  <Table
    columns={columns}
    dataSource={dataSource}
    rowKey="id"
  />
</Card>
```

### 操作栏 + 表格

```typescript
<Card
  title="用户列表"
  extra={
    <Space>
      <Button onClick={handleRefresh}>刷新</Button>
      <Button type="primary" onClick={handleAdd}>新增</Button>
    </Space>
  }
>
  <Table columns={columns} dataSource={dataSource} rowKey="id" />
</Card>
```

## 注意事项

1. **不要使用已弃用的 API**: 参考 Ant Design 官方文档使用最新 API
2. **Table rowKey**: 使用数据本身的唯一标识，不使用 `index` 参数
3. **App.useApp()**: 必须在组件顶层调用，不能在条件语句中调用
4. **样式隔离**: 使用 `.module.less` 避免样式冲突
5. **类型导入**: 使用 `import type` 导入类型（如 `ColumnsType`）
