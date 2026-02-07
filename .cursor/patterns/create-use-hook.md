# 配置与逻辑抽离（use* Hook）

当菜单项、表格列、列表配置等与页面主逻辑混在一起时，应抽离为独立的 use* Hook 文件，便于维护。规范见 **代码风格 - 配置与逻辑抽离**。

## 文件与命名

- **文件名**：短横线命名（kebab-case），如 `use-header-menu.tsx`、`use-columns.tsx`
- **Hook 名**：camelCase，以 `use` 开头，如 `useHeaderMenu`、`useColumns`
- **扩展名**：含 JSX 用 `.tsx`，仅类型/逻辑用 `.ts`

## 导入方式

若项目开启 `allowImportingTsExtensions`，导入时写完整扩展名，避免解析到错误文件：

```ts
import { useHeaderMenu } from './use-header-menu.tsx';
import { useMockApiList } from './use-mock-api-list.ts';
```

## 示例：菜单配置

```tsx
// use-header-menu.tsx
import { useMemo } from 'react';
import type { MenuProps } from 'antd';
import { UserOutlined } from '@ant-design/icons';

export function useHeaderMenu(): MenuProps['items'] {
  return useMemo<MenuProps['items']>(
    () => [
      { key: 'admin', icon: <UserOutlined />, label: '个人中心' },
      // ...
    ],
    []
  );
}
```

## 示例：表格列（含 JSX）

```tsx
// use-user-columns.tsx
import { useMemo } from 'react';
import type { ColumnsType } from 'antd/es/table';

export function useUserColumns(): ColumnsType<RowType> {
  return useMemo(() => [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    // ...
  ], []);
}
```

## 示例：带参数的 Hook

```tsx
// use-mock-columns.tsx
export interface UseMockColumnsProps {
  onTest: (api: ApiItem) => void;
  loading: string | null;
}

export function useMockColumns(props: UseMockColumnsProps): ColumnsType<ApiItem> {
  const { onTest, loading } = props;
  return useMemo(() => [/* columns 使用 onTest、loading */], [onTest, loading]);
}
```

## 使用方

在页面或布局中按需引入并调用：

```tsx
const menuItems = useSideMenu();
const columns = useUserColumns();
```
