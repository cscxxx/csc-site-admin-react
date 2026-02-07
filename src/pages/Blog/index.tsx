import styles from './index.module.less';

function Blog() {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>文章</h1>
      <p>文章管理，功能开发中。</p>
    </div>
  );
}

export default Blog;
