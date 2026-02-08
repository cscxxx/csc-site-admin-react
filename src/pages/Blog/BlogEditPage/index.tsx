/**
 * 博客文章新增/编辑独立页面
 * 路由：/blog/edit（新增，无 id）、/blog/edit/:id（编辑）
 * 创建时间：仅新增时传当前时间戳，编辑不传，页面不展示，仅表格展示
 */

import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Form, Input, Select, Button, App, Space, Spin } from 'antd';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import { ImageUpload } from '@/components/upload';
import { getBlog, addBlog, updateBlog } from '../service';
import { getBlogtypeList } from '@/pages/Blogtype/service';
import type { BlogItem } from '../types';
import type { BlogtypeItem } from '@/pages/Blogtype/types';
import styles from './index.module.less';

/** 按 editId 缓存进行中的 getBlog 请求，避免 React Strict Mode 下 effect 双执行导致重复请求 */
const getBlogPromiseCache = new Map<number, Promise<BlogItem>>();

const MarkdownEditor = lazy(() =>
  import('@/components/MarkdownEditor').then(m => ({ default: m.MarkdownEditor }))
);

/** 包装编辑器并转发 Form.Item 注入的 value/onChange（Form.Item 直接子节点才能收到） */
function BlogEditorField({
  value,
  onChange,
  ...rest
}: {
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <Suspense fallback={<Spin style={{ padding: 24 }} tip="加载编辑器中…" />}>
      <MarkdownEditor
        value={value ?? ''}
        onChange={onChange ?? (() => {})}
        placeholder="支持 Markdown，可粘贴或上传图片"
        {...rest}
      />
    </Suspense>
  );
}

interface BlogFormValues {
  title: string;
  description: string;
  categoryId: number;
  htmlContent: string;
  thumb: string;
}

function BlogEditPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [form] = Form.useForm<BlogFormValues>();

  const isNew = !id;
  const editId = id ? Number(id) : null;

  const [categories, setCategories] = useState<BlogtypeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  const fullscreenRef = useRef<HTMLDivElement>(null);

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
    if (!isNew && editId != null) {
      let cancelled = false;
      setLoading(true);
      // 复用同 editId 的进行中请求，避免 Strict Mode 下 effect 双执行导致重复请求
      let promise = getBlogPromiseCache.get(editId);
      if (!promise) {
        promise = getBlog(editId);
        getBlogPromiseCache.set(editId, promise);
        promise.finally(() => {
          getBlogPromiseCache.delete(editId);
        });
      }
      promise
        .then(data => {
          if (!cancelled) {
            form.setFieldsValue({
              title: data.title,
              description: data.description,
              categoryId: data.categoryId,
              htmlContent: data.htmlContent ?? '',
              thumb: data.thumb,
            });
            setEditorKey(k => k + 1);
          }
        })
        .catch(err => {
          if (!cancelled) {
            message.error(err instanceof Error ? err.message : '获取文章失败');
          }
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
      return () => {
        cancelled = true;
      };
    } else {
      form.resetFields();
    }
  }, [isNew, editId, form, message]);

  const handleBack = () => {
    navigate('/blog');
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const body = {
        title: values.title,
        description: values.description,
        categoryId: values.categoryId,
        htmlContent: values.htmlContent ?? '',
        thumb: values.thumb ?? '',
        toc: [] as unknown[],
      };
      // 仅新增时传创建时间戳，编辑不传
      if (isNew) {
        (body as { createDate?: number }).createDate = Date.now();
      }
      setSubmitting(true);
      if (isNew) {
        await addBlog(body);
        message.success('新增成功');
      } else if (editId != null) {
        await updateBlog(editId, body);
        message.success('修改成功');
      }
      navigate('/blog');
    } catch (err) {
      if (err && typeof err === 'object' && 'errorFields' in err) {
        return;
      }
      message.error(err instanceof Error ? err.message : '操作失败');
    } finally {
      setSubmitting(false);
    }
  };

  const categoryOptions = categories.map(c => ({ value: c.id, label: c.name }));

  const pageContent = (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{isNew ? '新增文章' : '编辑文章'}</h1>
        <Button
          type="text"
          icon={fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
          onClick={() => setFullscreen(prev => !prev)}
          title={fullscreen ? '退出全屏' : '全屏'}
          className={styles.fullscreenBtn}
        />
      </div>
      <Form
        form={form}
        layout="vertical"
        className={styles.form}
        initialValues={{
          htmlContent: '',
          title: '',
          description: '',
          thumb: '',
          categoryId: undefined,
        }}
      >
        <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
          <Input placeholder="请输入标题" />
        </Form.Item>
        <Card className={styles.contentCard} loading={loading}>
          <Form.Item
            label="正文"
            name="htmlContent"
            rules={[{ required: true, message: '请输入正文' }]}
            className={styles.htmlContentItem}
          >
            <BlogEditorField key={isNew ? 'new' : `edit-${editId}-${editorKey}`} />
          </Form.Item>
        </Card>
        <Card className={styles.footerCard} loading={loading}>
          <div className={styles.footerRow}>
            <Form.Item
              label="缩略图"
              name="thumb"
              rules={[{ required: true, message: '请上传缩略图' }]}
              getValueFromEvent={(url: string | null) => url ?? ''}
              className={styles.thumbItem}
            >
              <ImageUpload placeholder="缩略图" />
            </Form.Item>
            <Form.Item
              label="分类"
              name="categoryId"
              rules={[{ required: true, message: '请选择分类' }]}
              className={styles.categoryItem}
            >
              <Select
                placeholder="请选择分类"
                options={categoryOptions}
                style={{ width: '100%' }}
                getPopupContainer={
                  fullscreen ? () => fullscreenRef.current ?? document.body : undefined
                }
              />
            </Form.Item>

            <Form.Item
              label="描述"
              name="description"
              rules={[{ required: true, message: '请输入描述' }]}
              className="flex-1 min-w-0"
            >
              <Input.TextArea placeholder="请输入描述" rows={7} />
            </Form.Item>
          </div>
          <Space>
            <Button onClick={handleBack}>返回</Button>
            <Button type="primary" onClick={handleSubmit} loading={submitting}>
              {isNew ? '新增' : '保存'}
            </Button>
          </Space>
        </Card>
      </Form>
    </>
  );

  const container = (
    <div className={`${styles.pageContainer} ${fullscreen ? styles.fullscreen : ''}`}>
      {pageContent}
    </div>
  );

  if (fullscreen && typeof document !== 'undefined') {
    return createPortal(
      <div ref={fullscreenRef} className={styles.fullscreenPortal}>
        {container}
      </div>,
      document.body
    );
  }

  return container;
}

export default BlogEditPage;
