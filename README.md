# CSC Site Admin React

CSC 站点管理后台 React 项目

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 代码检查
pnpm lint
```

## 代码提交规范

本项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范来规范提交信息。

### 提交信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档变更
- `style`: 代码格式（不影响代码运行）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动
- `ci`: CI 配置变更
- `revert`: 回滚

### 提交示例

```bash
# 新功能
git commit -m "feat: 添加用户管理页面"

# 修复 bug
git commit -m "fix: 修复登录状态丢失问题"

# 文档更新
git commit -m "docs: 更新 README 文档"

# 代码重构
git commit -m "refactor: 重构请求工具类"

# 带 scope 的提交
git commit -m "feat(auth): 添加 JWT 认证功能"

# 带详细描述的提交
git commit -m "feat: 添加 Mock 数据测试页面

- 支持测试常用 API
- 展示请求和响应数据
- 支持 GET/POST/PUT/DELETE 方法"
```

### 提交前检查

项目配置了以下 Git hooks：

- **pre-commit**: 自动运行 lint-staged，检查并修复代码格式问题
- **commit-msg**: 验证提交信息是否符合 Conventional Commits 规范

如果提交信息不符合规范，提交将被拒绝。请按照上述格式修改提交信息后重新提交。