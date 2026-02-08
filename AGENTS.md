# Project Instructions

本项目使用 React 19 + Ant Design v6 + TypeScript 5.9 技术栈，并使用 ahooks 作为 Hooks 工具库（异步请求、防抖节流等优先使用 ahooks）。

## 核心原则

1. 使用函数组件和 Hooks
2. 严格 TypeScript 类型检查，禁止使用 `any`
3. 使用路径别名 `@/` 导入模块
4. 使用 Less 模块化样式
5. 遵循 Conventional Commits 提交规范

## 项目架构

详细的项目结构、API 规范、代码模式等信息请参考：

- **项目结构**: `.cursor/context/project-structure.md` - 完整的目录结构和文件组织说明
- **API 规范**: `.cursor/context/api.md` - API 接口规范和请求工具使用指南
- **代码模式**: `.cursor/patterns/` - 创建页面、服务、Store 的标准模式
- **代码示例**: `.cursor/examples/` - 完整的代码示例参考
- **开发页面 Skill**: `.cursor/skills/develop-page/SKILL.md` - 新增/开发页面时按此 Skill 执行，与 patterns 配合使用
- **提交代码 Skill**: `.cursor/skills/commit-code/SKILL.md` - 每次提交代码时按 Conventional Commits 生成 commit message

### 关键文件

- **类型定义**: `src/types/index.ts` - 统一导出所有类型定义
- **请求工具**: `src/utils/request/index.ts` - 基于 fetch 封装的请求工具
- **路由配置**: `src/router/index.tsx` - React Router DOM v7 路由配置
- **认证状态**: `src/store/authStore.ts` - Zustand 认证状态管理
- **布局组件**: `src/layouts/index.tsx` - 主布局组件

## 项目规则

详细规则请参考 `.cursor/rules/` 目录下的分类文件：

- `react.mdc` - React 组件和 Hooks 规范（始终应用）
- `typescript.mdc` - TypeScript 类型定义规范（始终应用）
- `code-style.mdc` - 代码风格和命名规范（始终应用）
- `project.mdc` - 项目特定规范（始终应用）
- `antd.mdc` - Ant Design v6 组件库规范（智能应用）
- `best-practices.mdc` - 最佳实践和禁止事项（智能应用）

