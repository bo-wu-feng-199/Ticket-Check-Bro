# Platform Post Drafts (Updated for v1.4.1)

---

## V2EX

标题：分享一个纯浏览器端的发票/文档解析工具，支持中英文

正文：

做报销发票处理时发现一个痛点：每次都要把发票拍照发给别人处理，数据还要手动录入 Excel。

于是写了个纯浏览器端工具 [Ticket-Check-Bro](https://ticket-check-bro.vercel.app/)，特点：

- **拖拽 PDF/JPG/PNG 即自动解析**（支持多文件并行解析）
- **支持 8 种文档类型**：增值税发票、火车票、机票、出租车票、定额发票、过路费发票、机动车发票、英文发票
- **PDF 全页提取**（不限前 3 页）+ 图片 OCR 双引擎
- **多格式导出**：Excel / CSV / JSON，金额字段为原始数值（Excel 可排序求和）
- **字段置信度提示**：低可信度字段黄色标记
- **批量重命名**（模板编辑 + ZIP 打包下载）+ **PDF 合并**（按页选择）
- **文件搜索**、**统计面板**（总金额 + 类型分布）
- **多 PDF 合并、批量重命名、暗色模式、中英文界面**
- **100% 浏览器端运行，不上传任何数据到服务器**

技术栈：React + Vite + pdfjs-dist + Tesseract.js + pdf-lib + Zustand
开源地址：https://github.com/bo-wu-feng-199/Ticket-Check-Bro

欢迎 Star / 试用 / 提 Issue

---

## Dev.to

Title: How I Built a Free Invoice OCR That Runs 100% in Your Browser (Open Source)

Tags: opensource, react, javascript, ocr

Body:

Every expense report tool I've tried either required uploading sensitive invoices to someone else's server or couldn't handle Chinese invoices properly. So I built a browser-native solution.

**Ticket-Check-Bro** is an open-source, client-side invoice parser that extracts structured data from PDFs and images — all within the browser, no server upload.

### What's New in v1.4.1

- **Multi-page PDF**: reads ALL pages, not just the first 3
- **Multi-format export**: Excel (.xlsx) / CSV / JSON — amount fields exported as raw numbers
- **Search & filter**: find files by name, invoice number, or amount
- **Summary dashboard**: total amount + document type breakdown
- **Confidence indicators**: per-field confidence scores, low-confidence fields highlighted

### Key Features

- **8 document types**: Chinese VAT invoices, train tickets, flight itineraries, taxi receipts, fixed-amount receipts, toll invoices, vehicle invoices, and English invoices
- **Dual engine**: PDF text extraction (pdfjs-dist) + image OCR (Tesseract.js WASM)
- **PDF merge** with per-page selection
- **Batch rename** with template variables → ZIP download
- **Drag-and-drop sort** for file ordering
- **i18n**: English & Chinese UI
- **Dark mode** with system preference detection
- **PWA**: installable, works offline
- **Keyboard shortcuts**: Ctrl+O / Delete / Ctrl+E
- **Session persistence**: auto-save/restore via localStorage

### Tech Stack

React 18 + Vite 5 + Zustand + pdfjs-dist + pdf-lib + Tesseract.js + SheetJS + JSZip

### Links

- Live demo: https://ticket-check-bro.vercel.app/
- GitHub: https://github.com/bo-wu-feng-199/Ticket-Check-Bro

No signup. No install. Just open and drag your files in.

---

## Reddit — r/SideProject (or r/webdev)

Title: I built a free invoice OCR that runs 100% in your browser — PDF + image, no server upload

Body:

Hey everyone,

I built [Ticket-Check-Bro](https://ticket-check-bro.vercel.app/), a free open-source tool that extracts structured data from invoices and receipts — entirely in your browser.

**No server. No uploads. No signup.** Your files never leave your machine.

**What it does:**
- Drop PDFs or photos → auto-detects document type → extracts fields → export to Excel/CSV/JSON
- 8 document types including Chinese VAT invoices, train/flight tickets, English invoices
- PDF text extraction + image OCR (Tesseract.js)
- Multi-page PDF support (reads all pages, not just first 3)

**Recent improvements (v1.4.1):**
- Multi-format export (CSV, JSON) + raw numbers in Excel
- File search by name / invoice number / amount
- Summary dashboard with total amounts & doc breakdown  
- Per-field confidence indicators for low-confidence results

Built with React 18 + Vite + Tesseract.js + pdfjs-dist + pdf-lib.

**Links:**
- Live demo: https://ticket-check-bro.vercel.app/
- GitHub: https://github.com/bo-wu-feng-199/Ticket-Check-Bro (⭐ welcome!)

Happy to answer any questions about the architecture or implementation!

---

## Product Hunt (alternative — use Dev.to + Reddit first, build audience)

Title: Ticket-Check-Bro — Free invoice OCR, 100% in-browser

Tagline: Open-source invoice parser. PDF + image OCR. Multi-format export. No server upload.

Description:
Ticket-Check-Bro is a browser-native document intelligence platform. Extract structured fields from invoices, receipts, and financial documents — without uploading anything to any server.

Key features: 8 document types, PDF all-page extraction, image OCR, Excel/CSV/JSON export, PDF merge, batch rename, file search, dark mode, i18n (EN/ZH), PWA offline.

Tech: React 18, Vite 5, Zustand, pdfjs-dist, pdf-lib, Tesseract.js, SheetJS

Links:
- Live demo: https://ticket-check-bro.vercel.app/
- GitHub: https://github.com/bo-wu-feng-199/Ticket-Check-Bro
