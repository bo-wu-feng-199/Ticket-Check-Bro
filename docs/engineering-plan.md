# Ticket-Check-Bro 工程基线改造方案

**目标**: 消除 P0 ��程可信度问题，建立 CI/测试/发布闭环。纯工程治理，不堆功能。

---

## Phase 0 — 可信度清理（~30min）

**验收标准**: package.json、README、Git tag、License、主页显示完全一致。

| # | 操作 | 文件 | 说明 |
|---|------|------|------|
| 0.1 | author → `bo-wu-feng-199` | `package.json` | 当前为 `absolutelyZero` |
| 0.2 | version → `1.4.1` | `package.json` | 当前 `1.2.0` |
| 0.3 | 确认 repository URL | `package.json` | 指向当前 repo |
| 0.4 | 统一版本引用 | `README.md` | 同步 v1.4.1 |
| 0.5 | 新建 CHANGELOG | `CHANGELOG.md` | 从 git log 提取 |
| 0.6 | 正式 Release | GitHub API | v1.4.1 release body |
| 0.7 | 基础安全策略 | `SECURITY.md` | 漏洞报告流程 |

---

## Phase 1 — 测试基座（~3h）

**验收标准**: `npm test` 通过，每种解析器至少 1 个 fixture。

| # | 操作 | 说明 |
|---|------|------|
| 1.1 | 安装 Vitest | `npm install -D vitest` |
| 1.2 | `vitest.config.js` | 与 Vite 共用配置 |
| 1.3 | 8 个 parser fixture | `fixtures/sanitized/` + 预期 JSON |
| 1.4 | parser regression 测试 | 8 组 parser(fixture) → match(expected) |
| 1.5 | 边界测试 | 空文本 / 模糊 OCR / 超大文件 |
| 1.6 | formatHelper 单元测试 | 金额/日期/格式化 |
| 1.7 | `test` script | `package.json` → `vitest run` |

---

## Phase 2 — CI 治理（~1h）

**验收标准**: 每次 push 自动跑测试。

| # | 操作 | 说明 |
|---|------|------|
| 2.1 | `.github/workflows/ci.yml` | lint + test + build |
| 2.2 | `.github/dependabot.yml` | 每周 npm 依赖检查 |
| 2.3 | 验证 CI 通过 | 推空 commit 触发 |
| 2.4 | main 分支保护 | **需你手动在 GitHub Settings 开** |
| 2.5 | PR 模板 | `.github/PULL_REQUEST_TEMPLATE.md` |

---

## 执行顺序

```
Phase 0 ──→ Phase 1 ──→ Phase 2
  30min        3h          1h
```

Phase 0 全部我直接改。Phase 1-2 部分需你配合（装 Vitest 时可能会有冲突、开分支保护）。

**先执行 Phase 0？** 确认后直接动手。