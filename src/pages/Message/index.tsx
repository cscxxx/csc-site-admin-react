import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Table, Input, Button, Space, App } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { getMessageList, deleteMessage } from './service';
import { useMessageColumns } from './use-columns';
import type { MessageItem, MessageListParams } from './types';
import styles from './index.module.less';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

function Message() {
  const { message, modal } = App.useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page')) || DEFAULT_PAGE;
  const limit = Number(searchParams.get('limit')) || DEFAULT_LIMIT;
  const keyword = searchParams.get('keyword') ?? '';
  const blogid = Number(searchParams.get('blogid')) || 1;

  const [list, setList] = useState<MessageItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [keywordInput, setKeywordInput] = useState(keyword);

  const fetchList = useCallback(async () => {
    try {
      setLoading(true);
      const params: MessageListParams = { page, limit, blogid };
      if (keyword.trim()) params.keyword = keyword.trim();
      const data = await getMessageList(params);
      setList(data.rows);
      setTotal(data.total);
    } catch (err) {
      message.error(err instanceof Error ? err.message : '获取留言列表失败');
    } finally {
      setLoading(false);
    }
  }, [page, limit, keyword, blogid, message]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // 同步地址栏 keyword 到输入框
  useEffect(() => {
    setKeywordInput(keyword);
  }, [keyword]);

  const setParams = useCallback(
    (updates: Record<string, string | number>) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([k, v]) => {
        const s = String(v);
        if (
          s === '' ||
          (k === 'page' && s === '1') ||
          (k === 'limit' && s === String(DEFAULT_LIMIT))
        ) {
          if (k === 'keyword') next.delete(k);
          else if (k === 'page') next.set(k, '1');
          else if (k === 'limit') next.set(k, String(DEFAULT_LIMIT));
        } else {
          next.set(k, s);
        }
      });
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const handleSearch = () => {
    setParams({ keyword: keywordInput.trim(), page: 1 });
  };

  const handleTableChange = (pagination: { current?: number; pageSize?: number }) => {
    const nextPage = pagination.current ?? page;
    const nextLimit = pagination.pageSize ?? limit;
    setSearchParams(
      prev => {
        const next = new URLSearchParams(prev);
        next.set('page', String(nextPage));
        next.set('limit', String(nextLimit));
        return next;
      },
      { replace: true }
    );
  };

  const handleDelete = (record: MessageItem) => {
    modal.confirm({
      title: '确认删除',
      content: `确定要删除昵称「${record.nickname}」的这条留言吗？`,
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteMessage(record.id);
          message.success('删除成功');
          await fetchList();
        } catch (err) {
          message.error(err instanceof Error ? err.message : '删除失败');
          throw err;
        }
      },
    });
  };

  const columns = useMessageColumns({ onDelete: handleDelete });

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>留言板管理</h1>
      <div className={styles.toolbar}>
        <Space wrap>
          <Input
            className={styles.searchInput}
            placeholder="关键词搜索"
            value={keywordInput}
            onChange={e => setKeywordInput(e.target.value)}
            onPressEnter={handleSearch}
            allowClear
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            搜索
          </Button>
        </Space>
      </div>
      <Table<MessageItem>
        columns={columns}
        dataSource={list}
        rowKey="id"
        loading={loading}
        pagination={{
          current: page,
          pageSize: limit,
          total,
          showSizeChanger: true,
          showTotal: t => `共 ${t} 条`,
          pageSizeOptions: ['10', '20', '50'],
        }}
        onChange={pagination => {
          handleTableChange({
            current: pagination.current,
            pageSize: pagination.pageSize,
          });
        }}
        scroll={{ x: 900 }}
      />
    </div>
  );
}

export default Message;
