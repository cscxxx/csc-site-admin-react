import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Table, Input, Button, Space, Select, App } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { getBlogList, deleteBlog } from './service';
import { getBlogtypeList } from '@/pages/Blogtype/service';
import { useBlogColumns } from './use-columns';
import type { BlogItem, BlogListParams } from './types.ts';
import type { BlogtypeItem } from '@/pages/Blogtype/types';
import styles from './index.module.less';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

function Blog() {
  const { message, modal } = App.useApp();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page')) || DEFAULT_PAGE;
  const limit = Number(searchParams.get('limit')) || DEFAULT_LIMIT;
  const keyword = searchParams.get('keyword') ?? '';
  const categoryidParam = searchParams.get('categoryid');
  const categoryid = categoryidParam ? Number(categoryidParam) : undefined;

  const [list, setList] = useState<BlogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<BlogtypeItem[]>([]);
  const [keywordInput, setKeywordInput] = useState(keyword);

  const categoryMap = useMemo(() => new Map(categories.map(c => [c.id, c.name])), [categories]);

  const fetchList = useCallback(async () => {
    try {
      setLoading(true);
      const params: BlogListParams = { page, limit };
      if (keyword.trim()) params.keyword = keyword.trim();
      if (categoryid != null) params.categoryid = categoryid;
      const data = await getBlogList(params);
      setList(data.rows);
      setTotal(data.total);
    } catch (err) {
      message.error(err instanceof Error ? err.message : '获取文章列表失败');
    } finally {
      setLoading(false);
    }
  }, [page, limit, keyword, categoryid, message]);

  const loadCategories = useCallback(async () => {
    try {
      const data = await getBlogtypeList();
      setCategories(data);
    } catch {
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  useEffect(() => {
    setKeywordInput(keyword);
  }, [keyword]);

  const setParams = useCallback(
    (updates: Record<string, string | number | undefined>) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([k, v]) => {
        if (v === undefined || v === '') {
          next.delete(k);
        } else {
          next.set(k, String(v));
        }
      });
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const handleSearch = () => {
    setParams({ keyword: keywordInput.trim(), page: 1 });
  };

  const handleCategoryChange = (value: number | undefined) => {
    setParams({ categoryid: value, page: 1 });
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

  const handleAdd = () => {
    navigate('/blog/edit');
  };

  const handleEdit = (record: BlogItem) => {
    navigate(`/blog/edit/${record.id}`);
  };

  const handleDelete = (record: BlogItem) => {
    modal.confirm({
      title: '确认删除',
      content: `确定要删除文章「${record.title}」吗？`,
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteBlog(record.id);
          message.success('删除成功');
          await fetchList();
        } catch (err) {
          message.error(err instanceof Error ? err.message : '删除失败');
          throw err;
        }
      },
    });
  };

  const columns = useBlogColumns({
    categoryMap,
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  const categoryOptions = useMemo(
    () => categories.map(c => ({ value: c.id, label: c.name })),
    [categories]
  );

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>文章</h1>
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
          <Select
            className={styles.categorySelect}
            placeholder="分类（可清空为全部）"
            value={categoryid ?? undefined}
            onChange={handleCategoryChange}
            options={categoryOptions}
            allowClear
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            搜索
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增
          </Button>
        </Space>
      </div>
      <Table<BlogItem>
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
        scroll={{ x: 800 }}
      />
    </div>
  );
}

export default Blog;
