# Ticket-Check-Bro

> Intelligent Document Intelligence Platform

Parse invoices, receipts, and financial documents directly in your browser. Upload PDFs and images — the engine extracts structured fields, presents a human-readable summary, and exports everything to a unified spreadsheet.

**100% client-side. Your data never touches a server.**

---

## Capabilities

| Feature | Description |
|---|---|
| **Multi-format ingestion** | PDF, JPG, JPEG, PNG via drag-and-drop |
| **Dual extraction pipeline** | PDF text extraction (pdfjs-dist) + image OCR (Tesseract.js) |
| **Schema-aware field recognition** | 7 document types, each with a dedicated strategy |
| **Structured visualization** | Card-based detail panel with field-level rendering |
| **Bulk export** | Unified spreadsheet download (.xlsx) via SheetJS |
| **Duplicate detection** | Content-aware hash comparison across the corpus |
| **Batch rename** | Template-driven file renaming using extracted metadata |

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
PDF Engine       │ pdfjs-dist            │ Text extraction from PDF layers
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
git clone https://github.com/absolutelyZero/Ticket-Check-Bro.git
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
git commit -m "chore: initial scaffold"
git push origin main
```

The Vercel project auto-detects the Vite framework. No additional configuration needed.

---

## License

MIT — free to use, modify, and distribute.

---

*Built with precision. Powered by React + Vite.*
