# 提交代码 Skill

## 何时使用本 Skill

当用户表达以下意图时，应使用本 Skill 并按下列规范执行：

- 提交代码 / 写 commit / 生成提交信息
- 帮我写一下 commit message / 这次改动怎么提交
- 准备提交、提交说明、git commit

项目提交规范见：`.cursor/rules/project.mdc` 中「代码提交」一节。

---

## 规范要点

### 格式

```
<type>(<scope>): <subject>
```

- **type**：必填，见下方类型。
- **scope**：可选，表示影响范围（如模块名、页面名），如 `blog`、`CursorGuide`、`router`。
- **subject**：必填，简短描述，建议使用祈使句、首字母小写、结尾不加句号。

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

### 示例

- `feat(blog): 博客编辑页增加全屏切换`
- `fix(auth): 登录过期后跳转错误`
- `docs: 在 AGENTS.md 中补充开发页面 Skill 说明`
- `refactor(MarkdownEditor): 抽离 html-to-markdown 与常量化`
- `chore(deps): 升级 ahooks`

---

## 执行步骤

1. **确认改动范围**：根据本次修改的文件与内容，确定合适的 `type` 和可选的 `scope`。
2. **撰写 subject**：用一句话概括本次提交，祈使句、简洁、首字母小写。
3. **输出完整 message**：按 `<type>(<scope>): <subject>` 输出，供用户直接用于 `git commit -m "..."` 或 Cursor 的提交框。

若一次提交包含多种改动（如既有新功能又修了 bug），建议拆成多次提交；若用户坚持一次提交，可选用最主要的 type，并在 subject 中简要并列说明。
