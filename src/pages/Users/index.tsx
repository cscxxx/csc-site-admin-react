import { Table, Button, Space, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.module.less';

interface User {
  key: string;
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const columns: ColumnsType<User> = [
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
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => <Tag color={status === '活跃' ? 'green' : 'red'}>{status}</Tag>,
  },
  {
    title: '操作',
    key: 'action',
    render: () => (
      <Space size="middle">
        <Button type="link" icon={<EditOutlined />}>
          编辑
        </Button>
        <Button type="link" danger icon={<DeleteOutlined />}>
          删除
        </Button>
      </Space>
    ),
  },
];

const data: User[] = [
  {
    key: '1',
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    role: '管理员',
    status: '活跃',
  },
  {
    key: '2',
    id: 2,
    name: '李四',
    email: 'lisi@example.com',
    role: '用户',
    status: '活跃',
  },
  {
    key: '3',
    id: 3,
    name: '王五',
    email: 'wangwu@example.com',
    role: '用户',
    status: '禁用',
  },
];

function Users() {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>用户管理</h1>
      <Table columns={columns} dataSource={data} />
    </div>
  );
}

export default Users;
