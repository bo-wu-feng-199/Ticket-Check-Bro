# Privacy & Security

**Ticket-Check-Bro** is designed around a single principle: **your data never leaves your machine**. All processing happens in-browser — no files are uploaded to any server.

---

## Data Lifecycle

```
File (PDF/Image) → Browser memory → Text extraction → Parsing → Export (optional)
       │                    │                    │              │
       └─── No upload ─────┘                    │              └─── Download only
                                                 └─── localStorage (session only)
```

1. **Input**: Files are read into browser memory via `FileReader` API. No network request is made.
2. **Processing**: PDF text extraction (pdfjs-dist) and image OCR (Tesseract.js WASM) run entirely client-side.
3. **Result storage**: Parsed results are stored in:
   - **localStorage** — for session persistence (`tcb-session` key). Contains only text fields (document type, invoice numbers, amounts). **No file content is stored.**
   - **Browser memory** — file references held via `Map` in `fileRefs.js`, freed on page unload.
4. **Export**: Generated spreadsheet/CSV/JSON files are downloaded directly via Blob URLs. No external service receives this data.
5. **Cleanup**: On page refresh, only minimal session metadata survives in localStorage. File blobs and preview URLs are revoked.

---

## What We Store

| Storage | Data | Duration | User Control |
|---------|------|----------|-------------|
| **localStorage** | Parsed field values, UI preferences (theme, language), session state | Until cleared | Clear via DevTools or `Clear Session` button |
| **Service Worker cache** | Static app assets (`index.html`, JS, CSS) | Until SW version change | Automatic on new deploy |
| **No cookies** | — | — | — |
| **No analytics** | — | — | — |
| **No telemetry** | — | — | — |
| **No user accounts** | — | — | — |

---

## Third-Party Dependencies

All are loaded as static npm packages. No runtime data is sent to any third-party:

| Dependency | Purpose | Data Sent |
|-----------|---------|-----------|
| **pdfjs-dist** | PDF text extraction | None. Fully local. |
| **Tesseract.js (WASM)** | Image OCR | None. WASM runs in-browser. |
| **pdf-lib** | PDF merge/manipulation | None. Fully local. |
| **SheetJS (xlsx)** | Spreadsheet generation | None. Fully local. |
| **JSZip** | ZIP archive creation | None. Fully local. |
| **html2canvas** | Screenshot capture | None. Fully local. |
| **Google Fonts** | Inter font rendering | `fonts.googleapis.com` CSS request (no data). Font files cached by SW. |
| **CDN (jsDelivr)** | Tesseract.js WASM model | Tesseract WASM model download (~4MB). No document data. |

---

## Network Requests (what leaves the browser)

1. **Initial page load**: HTML, JS, CSS — served from Vercel CDN.
2. **Google Fonts**: One-time CSS fetch from `fonts.googleapis.com`.
3. **Tesseract.js WASM**: Model file from `cdn.jsdelivr.net` (~4MB). Downloaded once and cached.
4. **Service Worker**: Pre-caches static assets after first visit.

**No document data, file content, or parsed results are ever transmitted over the network.**

---

## Threat Model

| Threat | Mitigation |
|--------|-----------|
| **Malicious PDF exploiting pdfjs-dist** | pdfjs-dist runs in a Web Worker with limited scope. No DOM access. |
| **XSS via document metadata** | All extracted text is rendered as React text nodes (not dangerouslySetInnerHTML). |
| **localStorage tampering** | Only session metadata stored. No credentials or sensitive data. |
| **CDN compromise** | Subresource integrity is used where possible; WASM model is pinned to specific version. |
| **Third-party tracking** | No analytics, cookies, or tracking scripts are included. |

---

## Reporting a Vulnerability

See [SECURITY.md](./SECURITY.md) for the disclosure process.
