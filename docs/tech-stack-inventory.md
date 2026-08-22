# Ticket-Check-Bro 技术栈全景清单（v1.5.0）

> 用途：技术栈盘点 + 新项目复用决策参考。每项含**用途 / 应用位置 / 可迁移性 / 耦合度 / 替换建议**。
> 架构基线：**100% 客户端 SPA，零后端**。所有处理在浏览器内完成（PDF 解析 / OCR / 导出 / 合并）。

---

## 1. 项目总览

| 维度 | 现状 |
|------|------|
| 架构形态 | 纯前端 SPA（Vite + React），无服务器端代码 |
| 运行时 | 浏览器（Chrome/Firefox/Safari/Edge 现代版本） |
| 语言 | JavaScript（ESM），无 TypeScript |
| 包管理 | npm + npm workspaces（monorepo 起步） |
| 部署 | Vercel（静态托管） |
| 数据流 | 文件 → 浏览器内存 → 提取 → 解析 → 导出/合并，全程本地 |

---

## 2. 后端框架与语言

| 技术 | 用途 | 应用位置 | 可迁移性 | 耦合度 | 替换建议 |
|------|------|---------|---------|--------|---------|
| **无后端** | 隐私卖点（0 上传） | 全项目 | — | — | 若新项目需多端同步/云存储，可加：Supabase（BaaS）、Cloudflare Workers（边缘函数）、Node/Fastify |

---

## 3. 前端框架与语言

| 技术 | 版本 | 用途 | 应用位置 | 可迁移性 | 耦合度 | 替换建议 |
|------|------|------|---------|---------|--------|---------|
| **React 18** | ^18.3.1 | UI 框架 | `src/App.jsx`, `src/components/*` | ✅ 高（通用技能） | 低 | 可换 Vue/Svelte，但 React 生态最全 |
| **Vite 5** | ^5.4.14 | 构建工具 + 开发服务器 | `vite.config.js` | ✅ 极高 | 低 | 事实标准，无需替换 |
| **JavaScript (ESM)** | — | 主语言 | 全项目 | ✅ 高 | 低 | 新项目建议 **TypeScript**（见 §11） |
| **JSX** | — | 组件语法 | `*.jsx` | ✅ 高 | 低 | — |

---

## 4. 状态管理与数据缓存

| 技术 | 版本 | 用途 | 应用位置 | 可迁移性 | 耦合度 | 替换建议 |
|------|------|------|---------|---------|--------|---------|
| **Zustand** | ^4.5.5 | 全局状态（entries/results/config） | `src/store/invoiceStore.js` | ✅ 极高 | 低 | Redux Toolkit / Jotai，但 Zustand 最轻 |
| **localStorage** | 浏览器原生 | 会话持久化 + 主题/语言偏好 | `invoiceStore.js`（`tcb-session`）、`Header.jsx` | ✅ 高 | 低 | 大数据量换 IndexedDB（Dexie.js）；同步需求换云端 |
| **fileRefs Map** | 内存 | 文件对象引用（非持久） | `src/store/fileRefs.js` | ✅ 高 | 中 | — |
| **Service Worker 缓存** | 浏览器原生 | PWA 离线 + 静态资源缓存 | `public/sw.js` | ✅ 高 | 低 | Workbox 增强 |

> **数据库**：无传统数据库。全内存 + localStorage。新项目若需结构化存储，推荐 **SQLite（浏览器 WASM）** 或 **IndexedDB + Dexie.js**。

---

## 5. API 设计规范

| 技术 | 用途 | 应用位置 | 可迁移性 | 耦合度 | 替换建议 |
|------|------|---------|---------|--------|---------|
| **无外部 REST API**（架构决策） | 0 上传隐私承诺 | 全项目 | — | — | 新项目如需 API：REST（OpenAPI 规范）或 GraphQL（Apollo） |
| **内部模块接口** | Parser 策略接口 + 导出函数签名 | `packages/core/src/parser/*`、`src/core/exporter/*` | ✅ 高 | 低 | 可作为新项目的模块设计模板 |
| **领域输出契约** | `{ documentType, confidence, fields: { key: { label, value, numeric? } } }` | 所有 parser 返回 | ✅ 极高 | 中 | 建议新项目直接采用此结构 |

---

## 6. 鉴权与安全机制

| 技术 | 用途 | 应用位置 | 可迁移性 | 耦合度 | 替换建议 |
|------|------|---------|---------|--------|---------|
| **无鉴权** | 免登录即用（产品卖点） | 全项目 | — | — | 新项目需登录：Auth.js（NextAuth）、Supabase Auth、Clerk |
| **安全响应头** | X-Frame-Options / nosniff / Referrer-Policy / Permissions-Policy | `vercel.json` + `_headers` | ✅ 极高（复制即用） | 低 | — |
| **XSS 防护** | React 默认转义，无 dangerouslySetInnerHTML | 全项目 | ✅ 高 | 低 | — |
| **隐私威胁模型** | 文档化数据流与风险 | `PRIVACY.md`, `SECURITY.md` | ✅ 高（模板可复用） | 低 | — |
| **内容安全策略（CSP）** | ❌ 未配置 | — | — | — | ⚠️ 建议新项目补：`Content-Security-Policy` 响应头 |

---

## 7. 第三方服务与 SDK 集成

| 技术 | 版本 | 用途 | 应用位置 | 可迁移性 | 耦合度 | 替换建议 |
|------|------|------|---------|---------|--------|---------|
| **pdfjs-dist** | ^4.9.155 | PDF 文本提取（核心引擎） | `src/core/extractor/PdfExtractor.js` | ✅ 高 | 低 | pdf.js 是事实标准 |
| **pdf-lib** | ^1.17.1 | PDF 合并/排版/生成 | `PdfMerger.js`, `LayoutMerger.js` | ✅ 极高 | 低 | — |
| **Tesseract.js** | ^5.1.1 | 图片 OCR（WASM，浏览器内） | `src/core/extractor/ImageExtractor.js` | ✅ 高 | 低 | OCR 精度需求高时：PaddleOCR.js / 云端 API |
| **SheetJS (xlsx)** | ^0.18.5 | Excel 生成/导出 | `ExcelExporter.js` | ✅ 高 | 低 | ⚠️ 注意社区版许可；换 exceljs |
| **JSZip** | ^3.10.1 | ZIP 打包（批量重命名下载） | `BatchRenameModal.jsx` | ✅ 极高 | 低 | — |
| **html2canvas** | ^1.4.1 | 截图分享（卡片转图片） | `BottomBar.jsx` | ✅ 高 | 低 | html-to-image（更现代） |
| **@dnd-kit/core + sortable** | ^6/^8 | 拖拽排序 | `FileList.jsx` | ✅ 极高 | 低 | SortableJS（更简单场景） |
| **lucide-react** | ^0.468 | 图标库 | 全组件 | ✅ 极高 | 低 | heroicons / phosphor |
| **i18next + react-i18next** | ^26/^17 | 中英双语 | `src/i18n.js`, `src/locales/*` | ✅ 极高 | 低 | vue-i18n（若换框架） |
| **Google Fonts** | — | Inter 字体 | `index.html` | ✅ 高 | 低 | 本地字体（隐私增强） |

---

## 8. 部署与运维工具

| 技术 | 用途 | 应用位置 | 可迁移性 | 耦合度 | 替换建议 |
|------|------|---------|---------|--------|---------|
| **Vercel** | 静态托管 + 自动部署（Git push 触发） | `vercel.json` | ✅ 极高 | 低 | Cloudflare Pages / Netlify（等价） |
| **vercel.json** | 构建命令、SPA rewrite、安全头 | 根目录 | ✅ 极高（模板复用） | 低 | — |
| **PWA** | 离线可用 + 可安装 | `public/manifest.json`, `public/sw.js` | ✅ 高 | 低 | — |
| **SEO 基建** | robots.txt / sitemap.xml / og:meta / JSON-LD | `public/`, `index.html` | ✅ 高 | 低 | — |

---

## 9. CI/CD 流程

| 技术 | 用途 | 应用位置 | 可迁移性 | 耦合度 | 替换建议 |
|------|------|---------|---------|--------|---------|
| **GitHub Actions** | push/PR 触发 test + build | `.github/workflows/ci.yml` | ✅ 极高（复制即用） | 低 | GitLab CI / CircleCI |
| **Dependabot** | 每周 npm 依赖更新 | `.github/dependabot.yml` | ✅ 极高 | 低 | Renovate（更灵活） |
| **分支保护** | main 需 PR + CI 通过（手动配置） | GitHub Settings | ✅ 高（流程级） | 低 | — |
| **Vercel 自动部署** | 无独立 CD 步骤，push 即上线 | Vercel Dashboard | ✅ 极高 | 低 | — |

---

## 10. 测试框架

| 技术 | 版本 | 用途 | 应用位置 | 可迁移性 | 耦合度 | 替换建议 |
|------|------|------|---------|---------|--------|---------|
| **Vitest** | ^4.1.10 | 单元 + 回归测试（与 Vite 同构） | `vitest.config.js`, `tests/*.test.js` | ✅ 极高 | 低 | Jest（生态更老但全） |
| **测试夹具（fixtures）** | — | 8 种票据脱敏样本 + 预期 JSON | `fixtures/sanitized/`, `fixtures/expected/` | ✅ 高（方法论可复制） | 中 | — |
| **测试覆盖** | — | 35 项：parser 回归 / 边界 / 格式化 / 模板 / 布局 / registry | `tests/` | ✅ 高 | 低 | 建议新项目加覆盖率工具：Vitest `--coverage` |
| **E2E** | ❌ 缺失 | — | — | — | ⚠️ 建议新项目加 Playwright（已有 `.playwright-cli` 痕迹） |

---

## 11. 代码质量与规范化工具

| 技术 | 状态 | 用途 | 可迁移性 | 耦合度 | 替换建议 |
|------|------|------|---------|--------|---------|
| **ESLint** | ❌ 未配置 | 静态检查 | — | — | ⚠️ 新项目必配：ESLint 9 flat config + typescript-eslint |
| **Prettier** | ❌ 未配置 | 格式化 | — | — | ⚠️ 新项目必配 |
| **TypeScript** | ❌ 未使用 | 类型安全 | — | — | ⚠️ 新项目强烈建议（parser 契约/导出函数收益最大） |
| **Husky + lint-staged** | ❌ 未配置 | 提交前检查 | — | — | 建议加 |
| **EditorConfig** | ❌ 未配置 | 编辑器统一 | — | — | 建议加 |
| **JSDoc 注释** | ✅ 已用 | 模块文档 | ✅ 高 | 低 | 迁移 TS 后可保留或转 d.ts |
| **CHANGELOG / 语义化版本** | ✅ 已用 | 版本治理 | ✅ 高 | 低 | 建议新项目加 Release Please 自动化 |

---

## 12. 架构模式与设计原则

| 模式/原则 | 用途 | 应用位置 | 可迁移性 | 耦合度 | 替换建议 |
|-----------|------|---------|---------|--------|---------|
| **策略模式（Parser 工厂）** | 8 种票据类型各自解析器，运行时按置信度择优 | `packages/core/src/parser/index.js`（ParserFactory） | ✅ 极高 | 低 | **新项目直接复用此设计** |
| **插件注册机制** | 第三方 parser 可动态 register/unregister | `ParserFactory.register()` | ✅ 极高 | 低 | — |
| **抽象基类** | InvoiceParser 定义 typeId/confidence/parse 契约 | `packages/core/src/parser/InvoiceParser.js` | ✅ 极高 | 低 | — |
| **Monorepo（npm workspaces）** | core 包与 web app 解耦 | `package.json` workspaces | ✅ 高 | 中 | pnpm workspaces / Turborepo（更大规模） |
| **核心/UI 分层** | parser 逻辑独立于 React，UI 仅消费 | `packages/core/` vs `src/` | ✅ 极高 | 低 | 保持，勿回退耦合 |
| **状态集中管理** | Zustand store 单点管理 entries/results | `invoiceStore.js` | ✅ 高 | 低 | — |
| **Hooks 抽象** | 业务逻辑封装进自定义 hooks | `src/hooks/*` | ✅ 高 | 低 | — |
| **懒加载/代码分割** | OCR/JSZip/html2canvas 动态 import，vendor 手动分包 | `vite.config.js` manualChunks | ✅ 高 | 低 | — |
| **隐私优先（数据本地化）** | 核心产品原则，架构级约束 | 全项目 | ✅ 高（理念可移植） | 低 | — |
| **测试驱动（fixture 回归）** | 解析器改动必须有样本验证 | `tests/parsers.test.js` | ✅ 高 | 低 | — |

---

## 13. 可迁移性总览（决策速查）

### ✅ 直接复用（低耦合，复制即用）
- **Vite 5 + React 18 + Zustand** 三件套（新 SPA 标准起点）
- **Parser 策略模式 + 插件注册**（任何"多格式文档/数据源解析"场景）
- **fixture 回归测试方法论**（解析类项目必备）
- **GitHub Actions CI + Dependabot + vercel.json**（全套工程模板）
- **安全响应头 + PRIVACY/SECURITY 文档模板**

### ⚠️ 需评估（中耦合）
- **npm workspaces**（单包项目可简化；多包才需要）
- **Tesseract.js**（浏览器内 OCR 有精度上限，企业级需换云端/本地模型）
- **SheetJS xlsx**（注意许可，可换 exceljs）

### ❌ 建议替换/升级（新项目改进项）
- **JS → TypeScript**（parser 输出契约 + 导出函数最受益）
- **补 ESLint + Prettier + Husky**（当前完全缺失）
- **补 CSP 响应头**（安全基线）
- **补 E2E（Playwright）**（当前仅单测）
- **localStorage → IndexedDB**（数据量超过几百条时）

---

## 14. 核心文件速查索引

| 文件 | 角色 |
|------|------|
| `vite.config.js` | 构建/分包/别名 |
| `src/main.jsx` | 入口 + SW 注册 |
| `src/store/invoiceStore.js` | 全局状态 + localStorage 持久化 |
| `src/hooks/useFileManager.js` | 文件增删 + 并发解析调度 |
| `packages/core/src/parser/index.js` | ParserFactory（策略 + 注册） |
| `packages/core/src/parser/InvoiceParser.js` | 解析器抽象基类 |
| `src/core/extractor/index.js` | PDF/OCR 双引擎路由 |
| `src/core/exporter/*` | 6 个导出/合并模块 |
| `public/sw.js` | PWA Service Worker |
| `.github/workflows/ci.yml` | CI 流水线 |

---

*生成于 2026-08-18 · 基于 v1.5.0 代码库 · 供新项目技术选型参考*
