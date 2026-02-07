/**
 * 博客文章新增/编辑独立页面
 * 路由：/blog/edit（新增，无 id）、/blog/edit/:id（编辑）
 * 创建时间：仅新增时传当前时间戳，编辑不传，页面不展示，仅表格展示
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Form, Input, Select, Button, App } from 'antd';
import { ImageUpload } from '@/components/upload';
import { getBlog, addBlog, updateBlog } from '../service';
import { getBlogtypeList } from '@/pages/Blogtype/service';
import type { BlogtypeItem } from '@/pages/Blogtype/types';
import styles from './index.module.less';

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
      getBlog(editId)
        .then(data => {
          if (!cancelled) {
            form.setFieldsValue({
              title: data.title,
              description: data.description,
              categoryId: data.categoryId,
              htmlContent: data.htmlContent ?? '',
              thumb: data.thumb,
            });
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

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>{isNew ? '新增文章' : '编辑文章'}</h1>
      <Form form={form} layout="vertical" className={styles.form}>
        <Card className={styles.metaCard} loading={loading}>
          <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="请输入标题" />
          </Form.Item>
        </Card>
        <Card className={styles.contentCard} loading={loading}>
          <Form.Item
            label="正文（HTML）"
            name="htmlContent"
            rules={[{ required: true, message: '请输入正文' }]}
            className={styles.htmlContentItem}
          >
            <Input.TextArea
              placeholder="Markdown 转成的 HTML 字符串"
              className={styles.htmlContentTextarea}
            />
          </Form.Item>
        </Card>
        <Card className={styles.footerCard} loading={loading}>
          <div className={styles.footerRow}>
            <Form.Item
              label="描述"
              name="description"
              rules={[{ required: true, message: '请输入描述' }]}
            >
              <Input.TextArea placeholder="请输入描述" rows={2} />
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
              />
            </Form.Item>
            <Form.Item
              label="缩略图"
              name="thumb"
              rules={[{ required: true, message: '请上传缩略图' }]}
              getValueFromEvent={(url: string | null) => url ?? ''}
              className={styles.thumbItem}
            >
              <ImageUpload placeholder="缩略图" />
            </Form.Item>
          </div>
          <div className={styles.formActions}>
            <Button onClick={handleBack}>返回</Button>
            <Button type="primary" onClick={handleSubmit} loading={submitting}>
              {isNew ? '新增' : '保存'}
            </Button>
          </div>
        </Card>
      </Form>
    </div>
  );
}

export default BlogEditPage;
