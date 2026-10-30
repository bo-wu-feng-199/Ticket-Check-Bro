# Ticket-Check-Bro 项目完整指南

> **版本** v1.5.0 | **许可证** MIT | **作者** bo-wu-feng-199
> **仓库** https://github.com/bo-wu-feng-199/Ticket-Check-Bro
> **线上** https://ticket-check-bro.vercel.app/（中国大陆 DNS 污染，建议本地使用或绑定自定义域名）
> **文档生成日期** 2026-10-08（数据基线见第 12 节）

---

## 1. 项目概述

**Ticket-Check-Bro** 是一款智能票据处理平台，纯浏览器端运行（**零后端、零服务器**）。
上传 PDF / 图片发票，自动解析结构化字段（发票代码、号码、日期、金额、买卖方信息等），支持多类型票据识别、OCR、导出 Excel/CSV/JSON、PDF 合并与排版合并。

**核心定位**：报销、财务对账、差旅管理场景的本地化工具，数据不出浏览器，隐私性强。

### 主要功能

| 模块 | 能力 |
|------|------|
| 票据解析 | **8 种**票据解析器：增值税发票、火车票、机票行程单、机动车发票、出租车票、定额发票、通行费发票、英文发票 |
| 上传方式 | PDF（pdfjs-dist 文本提取）+ 图片（Tesseract.js OCR）+ 拖拽上传 |
| 批量处理 | 批量重命名、批量导出、去重标记 |
| 导出 | Excel（含 3 套模板：All Fields / Reconciliation / Travel）、CSV、JSON |
| PDF 合并 | 普通合并 + 排版合并（7 种布局预设），合并后可打印 |
| Excel 增强 | 重复项高亮（金融/对账场景） |
| 搜索/统计 | 全文搜索、仪表盘统计（8 种票据类型 / 32 个唯一字段 / 0 服务器上传 / 7 种排版布局） |
| i18n | 中英双语（i18next） |
| PWA | Service Worker 离线支持 |

---

## 2. 技术栈

| 层 | 技术 | 说明 |
|----|------|------|
| 框架 | React 18 + Vite 5 | SPA，ESM |
| 状态 | Zustand 4 | store 管理 |
| PDF | pdfjs-dist 4 + pdf-lib | 文本提取 / 生成合并 |
| OCR | Tesseract.js 5 | 图片文字识别 |
| 导出 | xlsx (SheetJS)、jszip | Excel/CSV/JSON |
| 合并 | html2canvas | 排版合并渲染 |
| 拖拽 | @dnd-kit | 文件排序 |
| 测试 | Vitest 4 | 35 个单测 |
| CI | GitHub Actions | ci.yml + evolve.yml |
| 依赖管理 | npm workspaces | `packages/core` 独立包 |

---

## 3. 目录结构

```
Ticket-Check-Bro/
├── src/                      # 应用层源码
│   ├── App.jsx               # 根组件
│   ├── main.jsx              # 入口（含 SW 注册）
│   ├── i18n.js               # 国际化
│   ├── index.css / App.css
│   ├── components/           # 15 个 UI 组件
│   │   ├── Header / Footer / StatsBar / EmptyState
│   │   ├── DropZone / FileList / FilePanel / InvoiceCard
│   │   ├── DetailPanel / PreviewPanel / MergeModal
│   │   ├── BatchRenameModal / FileActions / BottomBar
│   ├── core/                 # 核心逻辑（应用内）
│   │   ├── parser/           # 解析器桥接（re-export 自 core 包）
│   │   ├── extractor/        # PDF/图片文本提取
│   │   ├── exporter/         # CSV/Excel/JSON/PDF 合并/排版合并/Excel 模板
│   │   ├── renamer.js / deduplicator.js
│   ├── data/schemas.js       # 字段 schema（re-export 自 core）
│   ├── utils/                # 工具（re-export 自 core）
│   ├── hooks/                # useFileManager / useStats / useKeyboardShortcuts
│   └── store/                # Zustand store
├── packages/core/            # 独立核心包 @ticket-check-bro/core
│   └── src/
│       ├── parser/           # 8 个解析器 + 基类 + 插件注册表
│       ├── data/schemas.js   # 字段 schema 权威实现
│       └── utils/formatHelper.js  # 格式化工具权威实现
├── public/                   # sw.js / manifest / robots / sitemap / favicon
├── tests/                    # 6 个测试文件，35 用例
├── scripts/evolve.mjs        # 自我进化引擎
├── docs/                     # engineering-plan / tech-stack / evolution-log 等
├── .github/workflows/        # ci.yml + evolve.yml
└── 根配置                    # package.json / vite.config.js / vitest.config.js / vercel.json / .eslintrc.cjs / .prettierrc / .editorconfig / EVOLUTION.md
```

---

## 4. 核心架构

### 4.1 解析引擎（策略模式 + 插件注册表）

- `packages/core/src/parser/InvoiceParser.js` 为抽象基类，定义 `canParse()` / `parse()` 接口。
- 8 个具体解析器（火车/机票/机动车/出租车/定额/通行费/增值税/英文发票）实现该接口。
- `ParserFactory`（插件注册表）支持 `register(Class)` / `unregister(typeId)` 动态扩展新票据类型。
- `src/core/parser/index.js` 桥接导出，应用通过 `parserFactory` 统一获取解析器。

### 4.2 单源原则（core 化）

- `packages/core` 是解析器、schema、格式化工具的**权威实现**。
- `src/data/schemas.js`、`src/utils/formatHelper.js`、`src/core/parser/index.js` 均为 **re-export 桥接**（`export * from '@ticket-check-bro/core'`）。
- 新增字段/格式化逻辑只改 core 包，应用层自动同步，**无双份源码漂移风险**。

### 4.3 数据流

```
上传(PDF/图片) → extractor 提取文本 → parserFactory 匹配解析器
  → 结构化字段 → Zustand store → 详情/预览/统计/导出/合并
```

---

## 5. 安装与运行

```bash
# 环境要求：Node.js ≥ 18（开发用 22.x）
npm install          # 安装依赖（npm workspaces 会自动链接 core 包）

npm run dev          # 开发模式，热更新 → http://localhost:5173
npm run start        # 生产预览：build + preview → http://localhost:4173
npm run build        # 构建到 dist/
npm run preview      # 预览 dist/
```

**注意**：应用为纯前端，`npm run dev` / `npm run start` 后浏览器直接可用；也可将 `dist/` 部署到任意静态托管。

---

## 6. 测试与 CI

```bash
npm test             # vitest run，35 用例
npm run test:watch   # 监听模式
```

| 测试文件 | 覆盖内容 |
|---------|---------|
| parsers.test.js | 各解析器解析正确性 |
| formatHelper.test.js | 格式化工具 |
| excelTemplates.test.js | Excel 模板 |
| registry.test.js | 插件注册表 |
| layoutMerger.test.js | 排版合并 |
| edge-cases.test.js | 边界情况 |

CI（`.github/workflows/ci.yml`）：push/PR 时跑测试，作为分支保护的状态检查。

---

## 7. 部署

### 7.1 Vercel（原线上）

- 配置在 `vercel.json`（framework: vite，outputDirectory: dist）。
- **已知问题**：`*.vercel.app` 域名在中国大陆被 DNS 污染（GFW 注入 Facebook 段 IP），无法直连。诊断证据：`face:b00c` 特征 IP、vercel.com 官网 200 正常、本地 build 正常。
- 解决：绑定自定义域名（Vercel → Domains，CNAME → `cname.vercel-dns.com`）或迁移国内托管。

### 7.2 本地（推荐，数据不出本机）

```bash
npm run start        # → http://localhost:4173
```

### 7.3 静态部署

将 `dist/` 上传到任意静态托管（腾讯云 COS / EdgeOne Pages / GitHub Pages / WorkBuddy Sites）。

---

## 8. 自我进化机制（v1.5.0 新增）

项目内置"自我进化闭环"，每次 push 自动评估并记录：

| 组件 | 作用 |
|------|------|
| `scripts/evolve.mjs` | 纯 Node 零依赖：健康度评分(0-100)、进化轨迹记录、改进建议生成、回归门禁（测试失败 exit 1 / 测试数下降 exit 2） |
| `.github/workflows/evolve.yml` | push 到 main 后自动运行，回写 `docs/evolution-log.md` |
| `EVOLUTION.md` | 协议文档：评分模型（测试 40 / 构建 20 / 依赖 15 / 扩展 15）、门禁规则、扩展指南 |

本地手动运行：`npm run evolve`

---

## 9. 工程化状态

| 项 | 状态 |
|----|------|
| ESLint + Prettier 配置 | ✅ 配置已就位（.eslintrc.cjs / .prettierrc / .editorconfig） |
| ESLint 依赖 | ⚠️ 本地未安装（火绒 EPERM 锁定 npm cache），新环境执行 `npm i -D eslint prettier eslint-plugin-react eslint-plugin-react-hooks eslint-config-prettier` 后 `npm run lint` 可用 |
| TypeScript | ❌ 未采用（纯 JS） |
| E2E | ❌ 未配置 |

---

## 10. 已知问题与注意事项

1. **Vercel 域名被污染**：线上无法从大陆直连，优先本地使用或绑定自定义域名。
2. **火绒杀软 EPERM**：本地 Windows + 火绒实时防护会偶发锁定项目文件（npm install / 文件写入），遇 EPERM 重试或对项目目录加白名单。
3. **CI failure 均为 dependabot PR 所致**：不影响 main 分支与部署，可忽略。
4. **无 TS/ESLint 依赖/E2E**：工程化欠账，详见第 9 节。
5. **Service Worker 缓存**：已修复（network-first HTML + sw.js no-store），老缓存需硬刷新一次清除。

---

## 11. 转移/迁移说明

本包为**完整源码包**（不含 node_modules / dist / .git）：

1. 解压后在新环境执行 `npm install`（自动重建 node_modules 并链接 core 包）。
2. `npm run dev` 或 `npm run start` 即可运行。
3. 测试：`npm test`；构建：`npm run build`。
4. git 历史不包含在包内，需在 GitHub 重新 clone 或 `git init` 后关联远程。
5. ESLint 依赖安装命令见第 9 节。

---

## 12. 数据基线（权威值与来源）

以下为 **2026-10-30 复核**数据（与 2026-10-08 完全一致，项目处于稳定态），修改文档数字时以此为准：

| 数据项 | 实测值 | 权威来源 |
|--------|--------|----------|
| 版本 | 1.5.0 | `package.json` |
| commit | 9276701 | `.git/refs/heads/main` |
| 票据类型 | 8 | `packages/core/src/data/schemas.js` → `DOCUMENT_TYPES` |
| 解析器插件 | 8 | `packages/core/src/parser/*.js`（排除 `index.js` 与基类 `InvoiceParser.js`） |
| 唯一字段 | 32 | `getFieldSchema()` 全类型字段 key 去重 |
| 测试 | 35/35 通过 | `npx vitest run --reporter=json` |
| 测试文件 | 6 | `tests/*.test.js` |
| 排版布局 | 7 | `src/core/exporter/LayoutMerger.js` → `LAYOUT_PRESETS` |
| src 文件 | 48 | `src/**/*.{js,jsx}` |
| 依赖 | 14 prod + 3 dev | `package.json` |
| dist 体积 | 3.03 MB | `dist/` 实际大小 |
| 健康度评分 | 90/100 | `npm run evolve` |

**重新采集命令**：`npm run evolve`（自动写入 `docs/evolution-log.md` 与 `docs/.evolution-state.json`）

---

## 附：CHANGELOG 摘要

- **Unreleased**：自我进化引擎、Excel 3 模板、落地页空状态、SW 缓存修复、prerender 清理、ESLint/Prettier 配置、PROJECT_GUIDE
- **v1.5.0**（2026-08-08）：排版合并（7 布局）、合并后打印、Excel 重复高亮、核心包抽取、插件解析器注册表、Vitest 35 测试、CI
- **v1.4.x**：导出菜单、仪表盘、搜索、自动解析
- 完整变更见 `CHANGELOG.md`
