# Ticket-Check-Bro

[![Live Demo](https://img.shields.io/badge/Try%20it%20live-Vercel-2563EB?style=for-the-badge&logo=vercel&logoColor=white)](https://ticket-check-bro.vercel.app/)
[![Star History](https://img.shields.io/badge/Star%20History-Star%20History-FFD700?style=for-the-badge&logo=star&logoColor=white)](https://star-history.com/#bo-wu-feng-199/Ticket-Check-Bro&Date)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Support-FF813F?style=for-the-badge&logo=buy-me-a-coffee&logoColor=white)](https://buymeacoffee.com/bo.wu.feng.199)

> Intelligent Document Intelligence Platform

Parse invoices, receipts, and financial documents directly in your browser. Upload PDFs and images — the engine extracts structured fields, presents a human-readable summary, and exports everything to a unified spreadsheet.

**100% client-side. Your data never touches a server.**

---

## Try It Now

👉 **[ticket-check-bro.vercel.app](https://ticket-check-bro.vercel.app/)** — no signup, no install, just open and drop your files.

<p align="center">
  <img src="docs/screenshots/screenshot-1.png" alt="Ticket-Check-Bro - Full interface showing parsed documents" width="800"/>
  <br/>
  <em>Upload, parse, and export — all in your browser</em>
</p>

<p align="center">
  <img src="docs/screenshots/screenshot-2.png" alt="Upload interface with drag-and-drop zone" width="640"/>
  <br/>
  <em>Drag-and-drop file upload with instant parsing</em>
</p>

<p align="center">
  <img src="docs/screenshots/screenshot-3.png" alt="Parsed invoice details with editable fields" width="800"/>
  <br/>
  <em>Extracted fields displayed in a structured card layout — click to edit</em>
</p>

---

## Capabilities

| Feature | Description |
|---|---|
| **Multi-format ingestion** | PDF, JPG, JPEG, PNG via drag-and-drop |
| **Dual extraction pipeline** | PDF text extraction (pdfjs-dist) + image OCR (Tesseract.js) |
| **Schema-aware field recognition** | 7 document types, each with a dedicated strategy |
| **Structured visualization** | Card-based detail panel with field-level rendering |
| **Bulk export** | Unified spreadsheet download (.xlsx) via SheetJS |
| **PDF merge** | Combine multiple PDFs into a single document |
| **Batch rename** | Template-driven file renaming using extracted metadata |
| **Duplicate detection** | Content-aware hash comparison across the corpus |

### Supported Document Types

- Value-Added Tax Invoice
- Train Ticket
- Flight Itinerary
- Vehicle Invoice
- Taxi Receipt
- Fixed-Amount Receipt
- Toll Invoice

---

## Architecture

```
Layer            │ Technology            │ Responsibility
─────────────────┼───────────────────────┼─────────────────────────────
Presentation     │ React 18 + Vite       │ Component tree, state, routing
State            │ Zustand               │ Reactive store, derived stats
PDF Engine       │ pdfjs-dist + pdf-lib  │ Text extraction + merge
OCR Engine       │ Tesseract.js (WASM)   │ Image-to-text via LSTM models
Parsing          │ Strategy Pattern      │ 7 specialized parser strategies
Export           │ SheetJS (xlsx)        │ Spreadsheet generation
Icons            │ Lucide React          │ Consistent SVG iconography
```

### Data Pipeline

```
Upload → FileHelper.typeCheck()
  ├── PDF → PdfExtractor.extract() → raw text
  └── Image → ImageExtractor.recognize() → raw text (async OCR)
               ↓
ParserFactory.detect(rawText) → matching strategy → parse(text)
               ↓
{ type, confidence, fields: { invoiceCode, issueDate, amount, ... } }
               ↓
Zustand Store → React Re-render → UI + Export
```

---

## Quick Start

```bash
git clone https://github.com/bo-wu-feng-199/Ticket-Check-Bro.git
cd Ticket-Check-Bro
npm install
npm run dev
```

Open `http://localhost:5173` — the app is fully functional in development mode.

### Build for Production

```bash
npm run build     # outputs to dist/
npm run preview   # preview the production build
```

---

## Deployment

Push to GitHub `main` branch — Vercel auto-deploys:

```bash
git add .
git commit -m "chore: update"
git push origin main
```

The Vercel project auto-detects the Vite framework. No additional configuration needed.

---

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=bo-wu-feng-199/Ticket-Check-Bro&type=Date)](https://star-history.com/#bo-wu-feng-199/Ticket-Check-Bro&Date)

---

## License

MIT — free to use, modify, and distribute.

---

*Built with precision. Powered by React + Vite.*
