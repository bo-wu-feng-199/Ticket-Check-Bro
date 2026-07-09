# SEO & Promotion Plan — Ticket-Check-Bro

**Tool定位**: Free online invoice/receipt OCR parser. 100% client-side. No server upload.
**目标**: 获取自然搜索流量，不投付费广告。

---

## 1. 关键词策略

### 核心关键词（高意图，中等竞争）

| 关键词 | 月搜索量估算 | 优化页面 |
|--------|-------------|---------|
| free invoice OCR online | 中 | 首页 title + H1 |
| PDF invoice parser free | 中 | 首页 |
| extract data from invoice | 低-中 | `/how-to-extract-invoice-data` |
| Chinese invoice reader | 低 | 首页（差异化关键词） |
| receipt scanner free online | 高 | 首页 |
| online invoice data extraction | 低 | `/invoice-data-extraction-guide` |

### 长尾关键词（低竞争，高转化）

- "extract invoice number from PDF online"
- "parse Chinese VAT invoice without server"
- "free receipt OCR no upload"
- "browser-based document parser"
- "Tesseract OCR invoice online"
- "extract total amount from invoice PDF"

### 技术关键词（开发者流量）

- "pdfjs-dist invoice parser"
- "pdf-lib merge PDFs"
- "Tesseract.js OCR browser"
- "React invoice app open source"
- "Zustand state management example"

---

## 2. 内容文章计划

### 优先级 P0（影响最大，产出最快）

| # | 标题 | 目标关键词 | 类型 | 字数 |
|---|------|-----------|------|------|
| 1 | How to Extract Data from Invoices in Browser (No Server Upload) | invoice OCR browser, free invoice parser | 教程 | 1500 |
| 2 | Free Online Invoice OCR: Parse Receipts Without Uploading | free invoice OCR, receipt scanner online | 工具对比 | 1200 |
| 3 | How to Parse Chinese VAT Invoices Using a Browser | Chinese invoice parser, VAT invoice OCR | 教程 | 1800 |

### 优先级 P1（SEO 长尾，建立权威）

| # | 标题 | 目标关键词 | 类型 |
|---|------|-----------|------|
| 4 | PDF Invoice Parsing vs Image OCR: Which Is Better? | PDF OCR, image OCR invoice | 对比 |
| 5 | Top 5 Free Invoice OCR Tools for Small Business | free invoice tools, OCR comparison | 列表 |
| 6 | What Is Document Intelligence? A Simple Guide | document intelligence, data extraction | 科普 |

### 发布渠道

- **Dev.to** — #opensource #react #javascript #ocr 标签，自然 SEO 高
- **Medium** — 复制 + 微调，利用 Medium domain authority
- **GitHub Discussions** — 贴链接到 repo 的 Discussions
- **自建 SEO 页面** — 在 Vercel 上创建 `/guide/` 路径（静态 page）

---

## 3. GitHub 推广

| 方法 | 操作 | 预期 |
|------|------|------|
| GitHub Explore | v1.3.0 Release 已发布，持续更新 release notes | 触发 GitHub trending 算法 |
| Topics | 已配 20 个 topic ✅ | 搜索曝光 |
| README 截图 | 已配 3 张截图 ✅ | 转化率提升 |
| Star History | 已加 badge ✅ | 社会证明 |
| awesome-list PR | 投 `awesome-react`、`awesome-ocr`、`awesome-invoicing`、`awesome-selfhosted` | 直接流量 |
| GitHub Sponsor | 已加 Buy Me a Coffee ✅ | 社区支持 |

**待办**: 给以下仓库提 PR 加 Ticket-Check-Bro：
- https://github.com/unicodeveloper/awesome-nextjs (if applicable)
- https://github.com/marmelab/awesome-restyaboard (or similar)
- Search GitHub for "awesome OCR" / "awesome invoice"

---

## 4. Reddit 策略

| Subreddit | 内容形式 | 注意事项 |
|-----------|---------|---------|
| r/SideProject | "I built a free invoice OCR that runs entirely in your browser" | 直接分享，附 demo 链接 |
| r/webdev | Show & Tell 帖 | 侧重技术实现（React + pdfjs-dist + Tesseract.js） |
| r/selfhosted | 强调"no server, fully client-side" | 偏差自部署用户 |
| r/SaaS | 免费工具分享 | 不要推销，focus 对开发者的价值 |
| r/programming | Show HN 风格 | 代码量大，但门槛高 |

**规则**: 不要硬推。分享"做了个啥工具，解决了啥问题"，附带 GitHub + demo 链接。

---

## 5. Product Hunt 发布方案

前置条件：
- 确保首页 100% 打磨好
- 收集 5-10 个朋友的 upvote
- 准备 PH 第一评论（介绍技术栈 + 为什么做）

PH 发布要素：
- **Title**: Ticket-Check-Bro — Parse invoices in your browser, zero server upload
- **Tagline**: Free, open-source invoice parser & data extractor. PDF + image OCR. Export to spreadsheet.
- **Topics**: Developer Tools, Open Source, SaaS
- **First comment**: 介绍技术背景，为什么纯前端，支持哪些文档类型
- **Post-launch**: 在 Twitter/Reddit 上同步发帖引流

建议发布时间：**北京时间周二早上 7 点**（美东周一晚 7 点，用户活跃）

---

## 6. 技术 SEO（已做 vs 待做）

| 项目 | 状态 |
|------|------|
| title + meta description 优化 | ✅ 已做 |
| Keywords | ✅ 已做 |
| Open Graph | ✅ 已做 |
| Twitter Card | ✅ 已做 |
| Schema.org JSON-LD | ✅ 已做 |
| robots.txt | ✅ 已做 |
| sitemap.xml | ✅ 已做 |
| canonical URL | ✅ 已做 |
| 性能优化（动态 import） | ✅ 已做（index 796KB→496KB） |
| 字体优化（preconnect + non-blocking CSS） | ✅ 已做 |
| 内容页面（/guide/） | ❌ 待做 |
| 内部链接结构 | ❌ 待做 |
| 结构化数据扩展 | ⚠️ 可以加如何操作视频（如何视频 Schema） |

---

## 7. 执行时间线

| 阶段 | 内容 | 时间 |
|------|------|------|
| Week 1 | Dev.to 发文章 #1 + #2 | 2h |
| Week 2 | awesome-list PR + Reddit r/SideProject | 1h |
| Week 3 | Product Hunt 发布 | 1h 准备 |
| Week 4 | 分析 Google Search Console 数据，调整关键词 | 1h/月 |

**总投入**: 约 5 小时一次性 + 每月 1 小时维护。
