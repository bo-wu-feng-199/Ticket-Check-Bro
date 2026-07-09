# Ticket-Check-Bro

[![Live Demo](https://img.shields.io/badge/Try%20it%20live-Vercel-2563EB?style=for-the-badge&logo=vercel&logoColor=white)](https://ticket-check-bro.vercel.app/)
[![Star History](https://img.shields.io/badge/Star%20History-Star%20History-FFD700?style=for-the-badge&logo=star&logoColor=white)](https://star-history.com/#bo-wu-feng-199/Ticket-Check-Bro&Date)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Support-FF813F?style=for-the-badge&logo=buy-me-a-coffee&logoColor=white)](https://buymeacoffee.com/bo.wu.feng.199)

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Zustand](https://img.shields.io/badge/Zustand-4-433E38?style=flat-square)](https://github.com/pmndrs/zustand)
[![pdfjs-dist](https://img.shields.io/badge/pdfjs--dist-4-FD4F00?style=flat-square)](https://mozilla.github.io/pdf.js/)
[![pdf-lib](https://img.shields.io/badge/pdf--lib-1.17-003D7A?style=flat-square)](https://pdf-lib.js.org/)
[![Tesseract.js](https://img.shields.io/badge/Tesseract.js-5-00A859?style=flat-square)](https://tesseract.projectnaptha.com/)
[![SheetJS](https://img.shields.io/badge/SheetJS-0.18-00A7E5?style=flat-square)](https://sheetjs.com/)
[![Lucide](https://img.shields.io/badge/Lucide-0.468-F56565?style=flat-square)](https://lucide.dev/)
[![PNPM](https://img.shields.io/badge/PNPM-9-F69220?style=flat-square&logo=pnpm&logoColor=white)](https://pnpm.io)

> Intelligent Document Intelligence Platform — Parse invoices, receipts, and financial documents in your browser.

Upload PDFs and images — automatic document type detection, structured field extraction, spreadsheet export. **100% client-side. No server upload.** Supports Chinese & English invoices.

[⬆ v1.3.2](https://github.com/bo-wu-feng-199/Ticket-Check-Bro/releases) &mdash; 20 features, dark mode, i18n, PWA, responsive.

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
| **8 document types** | VAT invoice, train/flight/taxi tickets, vehicle/fixed-amount/toll invoices, English invoices |
| **Schema-aware field recognition** | 8 specialized parser strategies |
| **Structured visualization** | Card-based detail panel with inline field editing |
| **Bulk export** | Unified spreadsheet download (.xlsx) via SheetJS |
| **PDF merge** | Combine multiple PDFs with per-page selection |
| **Batch rename** | Template-driven with variable chips + ZIP download |
| **Duplicate detection** | Content-aware hash comparison |
| **Drag-and-drop sort** | Reorder files for merge/export order |
| **Multi-select & batch delete** | Checkboxes + select all |
| **i18n** | Full Chinese & English UI |
| **Dark mode** | CSS variables, system preference detection, persistent toggle |
| **Keyboard shortcuts** | Ctrl+O (open), Delete/Backspace (remove), Ctrl+E (export) |
| **Session persistence** | Auto save/restore via localStorage |
| **Share screenshot** | html2canvas → clipboard + social share (Twitter/LinkedIn) |
| **Demo data** | One-click sample invoices |
| **PWA** | Installable, offline service worker |
| **Responsive** | Desktop / tablet / phone with iOS safe-area |
| **Privacy-first** | All processing in-browser, zero server upload |

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
Layer            │ Technology                     │ Responsibility
─────────────────┼────────────────────────────────┼─────────────────────────────
Presentation     │ React 18 + Vite 5              │ Component tree, state, routing
State            │ Zustand                        │ Reactive store, derived stats
PDF Engine       │ pdfjs-dist + pdf-lib           │ Text extraction + page merge
OCR Engine       │ Tesseract.js (WASM)            │ Image-to-text via LSTM models
Parsing          │ Strategy Pattern × 8           │ Document-type-specific parsers
Export           │ SheetJS (xlsx)                 │ Spreadsheet generation
i18n             │ react-i18next                  │ Chinese & English UI
PWA              │ Service Worker                 │ Offline cache + installable
Icons            │ Lucide React                   │ Consistent SVG iconography
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
