# Platform Post Drafts

## V2EX

标题：分享一个纯浏览器端的发票/文档解析工具，支持中英文

正文：

做报销发票处理时发现一个痛点：每次都要把发票拍照/截图发给别人处理，数据还要手动录入 Excel。

于是写了个纯浏览器端工具 [Ticket-Check-Bro](https://ticket-check-bro.vercel.app/)，特点：

- 拖拽 PDF/JPG/PNG 即可自动解析
- 支持 8 种文档类型：增值税发票、火车票、机票、出租车票、定额发票、过路费发票、机动车发票、英文发票
- PDF 文本提取 + 图片 OCR 双引擎
- 解析结果导出 Excel（一键）
- 多 PDF 合并、批量重命名、暗色模式
- 中英文双语界面
- 100% 浏览器端运行，不上传任何数据到服务器

技术栈：React + Vite + pdfjs-dist + Tesseract.js + pdf-lib
开源地址：https://github.com/bo-wu-feng-199/Ticket-Check-Bro

欢迎 Star / 试用 / 提 Issue

---

## Product Hunt

Title: Ticket-Check-Bro — Parse invoices in your browser, zero server upload

Tagline: Free, open-source invoice parser & data extractor. PDF + image OCR. Export to spreadsheet. 100% client-side.

Description:

Ticket-Check-Bro is a browser-native document intelligence platform that extracts structured fields from invoices, receipts, and financial documents — without uploading anything to any server.

**Key features:**
- **8 document types**: Chinese VAT invoices, train tickets, flight itineraries, taxi receipts, fixed-amount receipts, toll invoices, vehicle invoices, and English invoices
- **Dual engine**: PDF text extraction (pdfjs-dist) + image OCR (Tesseract.js WASM)
- **Structured output**: Card-based field display with inline editing
- **Bulk export**: One-click .xlsx spreadsheet export
- **PDF merge**: Combine multiple PDFs into a single document
- **Batch rename**: Template-driven file renaming using extracted metadata
- **Multi-language**: English and Chinese UI
- **Dark mode**: Full theme support
- **PWA**: Installable, works offline
- **Privacy**: All processing happens in-browser. Your files never leave your machine

**Tech stack**: React 18, Vite 5, Zustand, pdfjs-dist, pdf-lib, Tesseract.js, SheetJS

**Links:**
- Live demo: https://ticket-check-bro.vercel.app/
- GitHub: https://github.com/bo-wu-feng-199/Ticket-Check-Bro

---

## Hacker News — Show HN

Title: Show HN: Ticket-Check-Bro – Open-source invoice OCR & data extraction, 100% in-browser

Body:

I built a tool that parses invoices and receipts entirely in your browser — no server, no API keys, nothing leaves your machine.

**What it does:**
- Drag-and-drop PDFs or images → auto-detects document type → extracts structured fields → exports to Excel
- Handles Chinese VAT invoices, train/flight/taxi tickets, fixed-amount receipts, toll invoices, and English-language invoices

**Why I built it:**
Every expense report tool I tried either required uploading files to someone else's server or couldn't handle Chinese invoices properly. This runs completely client-side using pdfjs-dist for PDF text extraction and Tesseract.js WASM for image OCR.

**Tech:**
React 18 + Vite 5 + Zustand + pdfjs-dist + pdf-lib + Tesseract.js + SheetJS

**Links:**
- Live demo (no signup): https://ticket-check-bro.vercel.app/
- GitHub: https://github.com/bo-wu-feng-199/Ticket-Check-Bro

Happy to answer any questions. All feedback welcome!
