# 创建新页面的标准流程

## 步骤

### 1. 创建页面目录和文件

在 `src/pages/` 目录下创建新页面目录：

```
src/pages/NewPage/
├── index.tsx          # 页面组件
├── index.module.less  # 页面样式
└── service.ts         # API 服务函数（可选）
```

### 2. 创建页面组件

```typescript
// src/pages/NewPage/index.tsx
import { App } from 'antd';
import styles from './index.module.less';

/**
 * 新页面组件
 */
function NewPage() {
  const { message } = App.useApp();

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>新页面</h1>
      {/* 页面内容 */}
    </div>
  );
}

export default NewPage;
```

### 3. 创建样式文件

```less
// src/pages/NewPage/index.module.less
@import '@/styles/variables.less';

.pageContainer {
  padding: @spacing-lg;
}

.pageTitle {
  margin-bottom: @spacing-md;
  font-size: @font-size-xl;
  font-weight: 600;
}
```

### 4. 添加路由配置

在 `src/router/index.tsx` 中添加路由：

```typescript
// 1. 添加懒加载导入
const NewPage = lazy(() => import('@/pages/NewPage'));

// 2. 在路由配置中添加
{
  path: 'new-page',
  element: <LazyRoute component={NewPage} />,
}
```

### 5. 添加菜单项（如需要）

在 `src/layouts/index.tsx` 中添加菜单项：

```typescript
const menuItems = [
  // ... 其他菜单项
  {
    key: 'new-page',
    label: '新页面',
    icon: <SomeIcon />,
    path: '/new-page',
  },
];
```

## 完整示例

### 页面组件示例

```typescript
import { useState, useEffect } from 'react';
import { App, Table, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.module.less';
import { getDataList } from './service';
import type { DataItem } from '@/types';

function NewPage() {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<DataItem[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getDataList();
      setDataSource(data);
    } catch (error) {
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<DataItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    // ... 其他列
  ];

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>新页面</h1>
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        rowKey="id"
      />
    </div>
  );
}

export default NewPage;
```

### 服务函数

服务函数的创建模式请参考：`.cursor/patterns/create-service.md`

## 注意事项

1. **组件命名**: 使用 PascalCase，与目录名一致
2. **默认导出**: 页面组件使用默认导出
3. **样式文件**: 必须使用 `.module.less` 后缀
4. **路径别名**: 使用 `@/` 导入，不要使用相对路径
5. **类型导入**: 使用 `import type` 导入类型
6. **路由懒加载**: 使用 `React.lazy` 和 `LazyRoute` 组件
7. **页面内弹框（Modal）**: 居正中（`centered`）、body 最大高度 80vh（`styles.body`）、确认/取消使用弹框自带按钮（`onOk`/`onCancel`、`okText`/`cancelText`），详见 `.cursor/rules/antd.mdc` 弹框（Modal）章节
