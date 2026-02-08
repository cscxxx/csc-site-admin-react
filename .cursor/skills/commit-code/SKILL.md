---
name: commit-code
description: 按 Conventional Commits 规范生成中文、汇总式的 git commit message。在用户提交代码、写 commit、生成提交信息或提及 commit message 时使用。
---

# 提交代码 Skill

## 何时使用本 Skill

当用户表达以下意图时，应使用本 Skill 并按下列规范执行：

- 提交代码 / 写 commit / 生成提交信息
- 帮我写一下 commit message / 这次改动怎么提交
- 准备提交、提交说明、git commit

项目提交规范见：`.cursor/rules/project.mdc` 中「代码提交」一节。

**本 Skill 要求**：commit 的 subject 必须使用**中文**，且对本次改动做**汇总**（一句话概括要点，不罗列文件）。

---

## 规范要点

### 格式

```
<type>(<scope>): <subject>
```

- **type**：必填，见下方类型。
- **scope**：可选，表示影响范围（如模块名、页面名），如 `blog`、`CursorGuide`、`router`。
- **subject**：必填，**使用中文**；用一句话**汇总**本次改动的要点（多文件、多改动时归纳成一条主线或并列要点，不要逐条罗列文件）；祈使句或概括句、简洁、结尾不加句号。

### 类型（type）

| 类型 | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | 修复 bug |
| `docs` | 仅文档（含注释、README） |
| `style` | 代码格式、样式（不影响逻辑，如空格、分号） |
| `refactor` | 重构（既非新功能也非修 bug） |
| `perf` | 性能优化 |
| `test` | 测试相关 |
| `chore` | 构建、工具、依赖等杂项 |

### 示例（中文、汇总式）

- `feat(blog): 博客编辑页增加全屏切换与分类下拉修复`
- `fix(auth): 修复登录过期后跳转错误`
- `docs: 补充开发页面与提交代码 Skill 说明`
- `refactor(MarkdownEditor): 抽离 html-to-markdown 并常量化与 memo 优化`
- `feat: 新增 Cursor 指南页与 Skills，替换用户管理入口并调整侧栏顺序`
- `chore(deps): 升级 ahooks`

---

## 执行步骤

1. **确认改动范围**：根据本次修改的文件与内容，确定合适的 `type` 和可选的 `scope`。
2. **汇总并撰写 subject**：用**中文**、**一句话**概括本次提交的主线（例如「新增 XX 页面并接入路由与菜单」而非「修改 A 文件、B 文件、C 文件」）；多类改动可并列（如「修复 XX 并优化 YY」），保持简洁。
3. **输出完整 message**：按 `<type>(<scope>): <subject>` 输出，**subject 必须为中文**，供用户直接用于 `git commit -m "..."` 或 Cursor 的提交框。

若一次提交包含多种改动，选用最主要的 type，在 subject 中**汇总**说明，不逐条罗列；必要时可拆成多次提交。
