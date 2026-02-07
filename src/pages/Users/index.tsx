import { Table } from 'antd';
import { useUserColumns, type UserRow } from './use-user-columns.tsx';
import styles from './index.module.less';

const data: UserRow[] = [
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
  const columns = useUserColumns();
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>用户管理</h1>
      <Table columns={columns} dataSource={data} />
    </div>
  );
}

export default Users;
