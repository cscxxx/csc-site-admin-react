/**
 * React 组件示例
 * 
 * 展示如何正确编写 React 组件
 * 此文件仅作为参考示例，不会被实际使用
 * 
 * 注意：以下代码中的导入语句在实际项目中会正确解析
 * 实际使用时，取消注释并确保路径别名 @/ 已配置
 */

/**
 * 用户管理组件示例
 * 
 * 展示完整的 CRUD 操作页面组件
 * 
 * @example
 * ```tsx
 * import { useState, useEffect, useCallback } from 'react';
 * import { App, Table, Button, Space, Card, Form, Input, Modal } from 'antd';
 * import type { ColumnsType } from 'antd/es/table';
 * import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
 * import styles from './index.module.less';
 * import { getUserList, createUser, updateUser, deleteUser } from './service';
 * import type { UserInfo } from '@/types';
 * 
 * function UserManagementExample() {
 *   const { message, modal } = App.useApp();
 *   const [form] = Form.useForm();
 *   
 *   // 状态管理
 *   const [loading, setLoading] = useState(false);
 *   const [dataSource, setDataSource] = useState<UserInfo[]>([]);
 *   const [editingUser, setEditingUser] = useState<UserInfo | null>(null);
 *   const [modalOpen, setModalOpen] = useState(false);
 * 
 *   // 加载数据
 *   const loadData = useCallback(async () => {
 *     setLoading(true);
 *     try {
 *       const users = await getUserList();
 *       setDataSource(users);
 *     } catch (error) {
 *       message.error('加载用户列表失败');
 *     } finally {
 *       setLoading(false);
 *     }
 *   }, [message]);
 * 
 *   useEffect(() => {
 *     loadData();
 *   }, [loadData]);
 * 
 *   const columns: ColumnsType<UserInfo> = [
 *     {
 *       title: 'ID',
 *       dataIndex: 'id',
 *       key: 'id',
 *     },
 *     {
 *       title: '姓名',
 *       dataIndex: 'name',
 *       key: 'name',
 *     },
 *     {
 *       title: '操作',
 *       key: 'action',
 *       render: (_, record) => (
 *         <Space size="middle">
 *           <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
 *             编辑
 *           </Button>
 *           <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
 *             删除
 *           </Button>
 *         </Space>
 *       ),
 *     },
 *   ];
 * 
 *   const handleEdit = (user: UserInfo) => {
 *     setEditingUser(user);
 *     form.setFieldsValue(user);
 *     setModalOpen(true);
 *   };
 * 
 *   const handleDelete = (id: number) => {
 *     modal.confirm({
 *       title: '确认删除',
 *       content: '确定要删除此用户吗？',
 *       onOk: async () => {
 *         try {
 *           await deleteUser(id);
 *           message.success('删除成功');
 *           loadData();
 *         } catch (error) {
 *           message.error('删除失败');
 *         }
 *       },
 *     });
 *   };
 * 
 *   const handleSubmit = async () => {
 *     try {
 *       const values = await form.validateFields();
 *       
 *       if (editingUser) {
 *         await updateUser(editingUser.id, values);
 *         message.success('更新成功');
 *       } else {
 *         await createUser(values);
 *         message.success('创建成功');
 *       }
 *       
 *       setModalOpen(false);
 *       form.resetFields();
 *       loadData();
 *     } catch (error) {
 *       if (error?.errorFields) return;
 *       message.error(editingUser ? '更新失败' : '创建失败');
 *     }
 *   };
 * 
 *   return (
 *     <div className={styles.pageContainer}>
 *       <Card
 *         title="用户管理"
 *         extra={
 *           <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
 *             新增用户
 *           </Button>
 *         }
 *       >
 *         <Table
 *           columns={columns}
 *           dataSource={dataSource}
 *           loading={loading}
 *           rowKey="id"
 *         />
 *       </Card>
 * 
 *       <Modal
 *         title={editingUser ? '编辑用户' : '新增用户'}
 *         open={modalOpen}
 *         onOk={handleSubmit}
 *         onCancel={() => {
 *           setModalOpen(false);
 *           form.resetFields();
 *         }}
 *       >
 *         <Form form={form} layout="vertical">
 *           <Form.Item
 *             name="name"
 *             label="姓名"
 *             rules={[{ required: true, message: '请输入姓名' }]}
 *           >
 *             <Input placeholder="请输入姓名" />
 *           </Form.Item>
 *           <Form.Item
 *             name="email"
 *             label="邮箱"
 *             rules={[
 *               { required: true, message: '请输入邮箱' },
 *               { type: 'email', message: '请输入有效的邮箱地址' },
 *             ]}
 *           >
 *             <Input placeholder="请输入邮箱" />
 *           </Form.Item>
 *         </Form>
 *       </Modal>
 *     </div>
 *   );
 * }
 * 
 * export default UserManagementExample;
 * ```
 */
