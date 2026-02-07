import { useState, useEffect } from 'react';
import { Card, Button, Input, App } from 'antd';
import { getAbout, updateAbout } from './service';
import styles from './index.module.less';

function About() {
  const { message } = App.useApp();
  const [url, setUrl] = useState('');
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoadingData(true);
    getAbout()
      .then(data => {
        if (!cancelled) {
          setUrl(data);
          setInputValue(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          message.error('获取关于信息失败');
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingData(false);
      });
    return () => {
      cancelled = true;
    };
  }, [message]);

  const handleEdit = () => {
    setInputValue(url);
    setEditing(true);
  };

  const handleCancel = () => {
    setInputValue(url);
    setEditing(false);
  };

  const handleSubmit = async () => {
    const value = inputValue.trim();
    if (!value) {
      message.warning('请输入关于页面链接');
      return;
    }
    try {
      setLoading(true);
      const newUrl = await updateAbout(value);
      setUrl(newUrl);
      setInputValue(newUrl);
      setEditing(false);
      message.success('修改成功');
    } catch (err) {
      message.error(err instanceof Error ? err.message : '修改失败');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData && !url) {
    return (
      <div className={styles.pageContainer}>
        <h1 className={styles.pageTitle}>关于</h1>
        <Card className={styles.aboutCard}>加载中...</Card>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>关于</h1>
      <Card
        title="关于页面链接"
        className={styles.aboutCard}
        extra={
          !editing ? (
            <Button type="primary" onClick={handleEdit}>
              编辑
            </Button>
          ) : (
            <>
              <Button onClick={handleCancel} style={{ marginRight: 8 }}>
                取消
              </Button>
              <Button type="primary" onClick={handleSubmit} loading={loading}>
                提交
              </Button>
            </>
          )
        }
      >
        {editing ? (
          <Input
            className={styles.urlInput}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="请输入关于页面链接"
          />
        ) : (
          <div className={styles.urlDisplay}>{url || '暂无链接'}</div>
        )}
      </Card>
    </div>
  );
}

export default About;
