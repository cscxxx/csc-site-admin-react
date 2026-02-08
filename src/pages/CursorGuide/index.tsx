/**
 * Cursor 指南：介绍 Rules、Skills、Subagents 的用法
 */

import { Card, Typography } from 'antd';
import {
  ReadOutlined,
  ToolOutlined,
  PartitionOutlined,
  BookOutlined,
  CodeOutlined,
} from '@ant-design/icons';
import styles from './index.module.less';

const { Title, Paragraph } = Typography;

function CursorGuide() {
  return (
    <div className={styles.pageContainer}>
      <Title level={2} className={styles.pageTitle}>
        Cursor 指南
      </Title>
      <Paragraph className={styles.intro}>
        以下介绍 Cursor 中 Rules、Skills、Subagents 的用途与使用方式，便于在项目中统一 AI 行为与协作流程。
      </Paragraph>

      <Card
        className={styles.sectionCard}
        title={
          <span>
            <ReadOutlined className={styles.cardIcon} />
            Rules（规则）
          </span>
        }
      >
        <Paragraph>
          <strong>作用：</strong>为 AI 设定「在本项目中该如何写代码、如何做事」的约定与约束，使回答和修改更符合当前项目规范。
        </Paragraph>
        <Paragraph>
          <strong>存放位置：</strong>通常放在项目根目录的 <code>.cursor/rules/</code> 下（如
          <code> project.mdc</code>、<code>react.mdc</code>），或根目录的 <code>AGENTS.md</code> 中说明给 AI 看的项目约定。
        </Paragraph>
        <Paragraph>
          <strong>配置方式：</strong>使用 Markdown 书写，可在文件头部加 YAML frontmatter，例如
          <code> alwaysApply: true</code> 表示该规则在每次对话中都会生效；
          <code> description: '...'</code> 用于简要描述，便于被「智能应用」时做匹配。
        </Paragraph>
        <Paragraph>
          <strong>常见用途：</strong>技术栈说明、命名与代码风格、目录结构、必用/禁用的库与规范（如 ahooks、Ant Design）、提交规范等。
        </Paragraph>
      </Card>

      <Card
        className={styles.sectionCard}
        title={
          <span>
            <ToolOutlined className={styles.cardIcon} />
            Skills（技能）
          </span>
        }
      >
        <Paragraph>
          <strong>作用：</strong>把「某类任务该如何一步步完成」写成可复用的流程说明；当检测到用户在做这类事情时，AI 会读取对应 Skill 并按其中步骤执行。
        </Paragraph>
        <Paragraph>
          <strong>存放位置：</strong>一般为用户级或项目内的 Skill 文件（如 <code>SKILL.md</code>），或 Cursor 可识别的技能目录。
        </Paragraph>
        <Paragraph>
          <strong>内容形式：</strong>步骤化说明（先做什么、再做什么）、注意事项、可选模板或示例。例如「创建 Cursor 规则」「编写 Agent Skill」「修改 Cursor/VS Code 设置」可各自对应一个 Skill。
        </Paragraph>
        <Paragraph>
          <strong>与 Rules 的区别：</strong>Rules 偏「约束与约定」；Skills 偏「执行流程」，按任务类型触发，保证某类操作每次都按同一套步骤执行。
        </Paragraph>
      </Card>

      <Card
        className={styles.sectionCard}
        title={
          <span>
            <PartitionOutlined className={styles.cardIcon} />
            Subagents（子代理）
          </span>
        }
      >
        <Paragraph>
          <strong>作用：</strong>在主对话之外，将一部分工作交给「专门做某类事的 AI 代理」执行，相当于拆出子任务线，由专门代理负责。
        </Paragraph>
        <Paragraph>
          <strong>典型用法：</strong>主对话负责整体需求理解与任务拆分；某一具体任务（如「只跑测试」「只生成文档」「只做某模块重构」）交给 Subagent 执行，再汇总结果。
        </Paragraph>
        <Paragraph>
          <strong>总结：</strong>Subagents 用于任务分工与聚焦，适合测试、文档、某一层代码等专项工作。
        </Paragraph>
      </Card>

      <Card
        className={styles.sectionCard}
        title={
          <span>
            <BookOutlined className={styles.cardIcon} />
            本项目的 Rules
          </span>
        }
      >
        <Paragraph className={styles.subIntro}>
          以下为当前项目 <code>.cursor/rules/</code> 中的规则文件，AI 会按「始终应用」或「智能应用」加载。
        </Paragraph>
        <ul className={styles.docList}>
          <li>
            <code>project.mdc</code> — 项目特定规范（技术栈、状态管理、路由、请求、ahooks、代码提交）。<em>始终应用</em>
          </li>
          <li>
            <code>code-style.mdc</code> — 代码风格与命名规范（文件组织、样式、配置抽离 use*）。<em>始终应用</em>
          </li>
          <li>
            <code>react.mdc</code> — React 组件与 Hooks 规范。<em>始终应用</em>
          </li>
          <li>
            <code>typescript.mdc</code> — TypeScript 类型定义规范（禁止 any、import type）。<em>始终应用</em>
          </li>
          <li>
            <code>antd.mdc</code> — Ant Design v6 使用规范（App、表单、Modal 等）。<em>智能应用</em>
          </li>
          <li>
            <code>best-practices.mdc</code> — 最佳实践与禁止事项（错误处理、可访问性、安全）。<em>智能应用</em>
          </li>
        </ul>
      </Card>

      <Card
        className={styles.sectionCard}
        title={
          <span>
            <CodeOutlined className={styles.cardIcon} />
            本项目的 Skills
          </span>
        }
      >
        <Paragraph className={styles.subIntro}>
          以下为当前项目 <code>.cursor/skills/</code> 中的技能，Agent 会根据描述在相关对话中自动调用，也可通过 <code>/技能名</code> 手动调用。
        </Paragraph>
        <ul className={styles.docList}>
          <li>
            <strong>commit-code</strong>（<code>.cursor/skills/commit-code/SKILL.md</code>）— 按 Conventional Commits 生成中文、汇总式的 commit message；在提交代码、写 commit、生成提交信息时使用。
          </li>
          <li>
            <strong>develop-page</strong>（<code>.cursor/skills/develop-page/SKILL.md</code>）— 新增/开发页面时的标准流程（目录、组件、样式、路由、侧栏菜单）；在新增页面、加管理页/列表页时使用。
          </li>
        </ul>
      </Card>

      <Card className={styles.summaryCard} size="small">
        <Title level={5}>对比一览</Title>
        <ul className={styles.summaryList}>
          <li>
            <strong>Rules</strong>：约定与约束；按配置「始终应用」或按描述「智能应用」。
          </li>
          <li>
            <strong>Skills</strong>：某类任务的执行流程；当用户请求匹配到该技能时应用。
          </li>
          <li>
            <strong>Subagents</strong>：子任务由专门代理执行；由用户或主对话将任务派发给子代理。
          </li>
        </ul>
      </Card>
    </div>
  );
}

export default CursorGuide;
