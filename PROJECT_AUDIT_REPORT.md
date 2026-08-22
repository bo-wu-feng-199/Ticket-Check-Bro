# Ticket-Check-Bro 项目体检与整改报告

生成时间：2026-08-22
版本：v1.5.0

## 一、整体状态（体检结论）

| 项目 | 状态 | 说明 |
|------|------|------|
| 构建 | ✅ 通过 | `npm run build` 成功，dist 3.1M，chunk 拆分合理 |
| 测试 | ✅ 通过 | `vitest` 35/35 全绿 |
| CI | ✅ 存在 | `.github/workflows/ci.yml` + 分支保护 |
| core workspace | ✅ 正常 | `node_modules/@ticket-check-bro/core` 软链到 `packages/core` |
| 部署 | ⚠️ 待推送 | 本地领先 origin/main 16 commits 未推送 |

**结论：项目可构建、可运行，无阻断性错误。**

## 二、主要组成部分

- **应用层 `src/`**：React 18 + Zustand，15 个组件（Header/DropZone/FileList/DetailPanel/PreviewPanel/MergeModal 等），UI 完整。
- **解析引擎 `src/core/parser/`**：7 类票据解析器 + common 通用解析；插件注册表 `parserFactory` 已抽出到 core 包。
- **导出层 `src/core/exporter/`**：CSV/Excel/JSON 导出、PDF 合并、排版合并、3 套 Excel 模板。
- **核心包 `packages/core/`**：`@ticket-check-bro/core`（parser + schemas + formatHelper），npm workspaces 单源。
- **文档**：README/CHANGELOG/PRIVACY/SECURITY/CONTRIBUTING + `docs/` 5 份。

## 三、初次误判的澄清（重要）

初次体检时，diff 显示 `src/data/schemas.js`、`src/utils/formatHelper.js` 与 core 包"不同"。
经复核，这两个文件**已经是干净的 re-export 桥接**（`export * from '@ticket-check-bro/core'`），
差异仅在于 core 包持有完整实现、src 持有桥接。

**修正结论：core 化已完成，schemas/formatHelper 为单源，不存在双份源码漂移风险。**
`src/core/exporter/*`、`src/core/renamer.js` 引用 `../../data/schemas.js`（桥接文件）是正确的，无需改动。

## 四、本轮已完成的整改

### 1. 清理 prerender 死代码（P2）
- 问题：`vite-plugin-prerender` 装在 devDependencies 但未在 `vite.config.js` 配置，仅 `src/main.jsx` 有一行 `dispatchEvent('prerender-ready')` 无消费者，属死代码。
- 处理：
  - 删除 `src/main.jsx` 第 7-8 行 dispatch 死代码；
  - `npm uninstall vite-plugin-prerender`（移除无效依赖，package.json + lock 同步）。
- 验证：test 35/35 通过，build 成功。

### 2. 提交并推送全部本地改动（P2）
- `git add` 未跟踪的 `docs/tech-stack-inventory.md` 及本轮修改；
- commit 后 `git push origin main`，同步 16 个落后 commit（含关键的 SW 缓存修复 `6d8c201`）。

## 五、遗留的已知工程化缺口（非阻断，建议后续）

- 无 TypeScript（纯 JS）；
- 无 ESLint / Prettier；
- 无 E2E（仅 Vitest 单测）。

这些是对新项目迁移的明确负债，但当前不影响运行，建议作为后续独立任务补齐。
