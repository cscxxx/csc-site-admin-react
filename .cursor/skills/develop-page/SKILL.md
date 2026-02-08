---
name: develop-page
description: 在本项目中新增或开发一个页面时的标准流程。在用户要新增页面、开发页面、加一个管理页/列表页或需要新路由与侧栏菜单时使用。
---

# 开发页面 Skill

## 何时使用本 Skill

当用户表达以下意图时，应使用本 Skill 并按下列步骤执行：

- 新增一个页面 / 开发一个页面 / 加一个页面
- 创建一个管理页、列表页、功能页
- 需要新路由并带侧栏菜单的页面

完整流程也可参考：`.cursor/patterns/create-page.md`。

---

## 前置

- **接口**：若页面需要请求接口，先确认或创建该页面的 `service.ts`，规范见 `.cursor/patterns/create-service.md`。
- **表格列**：若页面有表格且列较多，将列配置抽离为 `use-*-columns.tsx`（kebab-case），见 `.cursor/rules/code-style.mdc` 中「配置与逻辑抽离」一节。

---

## 步骤 1：创建页面目录与文件

在 `src/pages/` 下创建页面目录，目录名使用 **PascalCase**，与页面组件名一致。

- 必需：`index.tsx`（页面组件）、`index.module.less`（样式）
- 可选：`service.ts`（API）、`types.ts`（页面级类型）

示例结构：

```
src/pages/PageName/
├── index.tsx
├── index.module.less
├── service.ts    # 可选
└── types.ts      # 可选
```

---

## 步骤 2：编写页面组件

- 使用**函数组件**，**默认导出**，组件名与目录名一致（PascalCase）。
- 使用路径别名 **`@/`** 导入，类型用 **`import type`**。
- 需要请求数据时，优先使用 **ahooks** 的 `useRequest`，配合 `service.ts` 中的方法。
- 使用 **`App.useApp()`** 获取 `message` 等，不要直接 `message.success` 裸用。
- 样式类名使用 **`styles.xxx`**（Less 模块化），见 `.cursor/rules/code-style.mdc`。

---

## 步骤 3：编写样式文件

- 在 `index.module.less` 顶部：**`@import '@/styles/variables.less';`**
- 至少提供 **`.pageContainer`**、**`.pageTitle`**。
- 页面宽度**自适应**：`width: 100%`、`min-width: 0`、`box-sizing: border-box`；不写死 `max-width`，除非需求明确。

---

## 步骤 4：添加路由

在 **`src/router/index.tsx`** 中：

1. 在文件顶部懒加载导入：  
   `const PageName = lazy(() => import('@/pages/PageName'));`
2. 在布局的 `children` 数组中新增一项：  
   `{ path: 'page-name', element: <LazyRoute component={PageName} /> }`  
   路径使用 **kebab-case**，与菜单 `key` 对应（见下一步）。

---

## 步骤 5：添加侧栏菜单

在 **`src/layouts/use-side-menu.tsx`** 的 `useMemo` 返回的菜单数组中添加一项：

- **`key`**：`'/page-name'`，与路由 path 一致（前导斜杠）。
- **`label`**：菜单显示文案。
- **`icon`**：从 `@ant-design/icons` 引入合适图标。
- 若有子菜单，使用 **`children`** 数组，结构同上。

注意：菜单配置在 `use-side-menu.tsx`，不在 `layouts/index.tsx`。

---

## 收尾与规范

- **类型**：页面专属类型可放在 `src/types/` 或该页目录下的 `types.ts`，并在 `src/types/index.ts` 中按需导出。
- **规则**：遵守 `.cursor/rules/` 下的 React、TypeScript、code-style、project 规则。
- **Modal / 弹框**：居中使用 `centered`，内容区高度等见 `.cursor/rules/antd.mdc` 弹框（Modal）章节。

完成以上步骤后，新页面应可通过侧栏菜单访问，且风格与现有页面一致。
