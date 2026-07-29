# Changelog

## v1.4.1 (2026-07-16)

- **Export menu**: Excel / CSV / JSON multi-format dropdown
- **Summary dashboard**: total amount + doc type breakdown in StatsBar
- **File search**: filter by name, invoice number, or amount
- **Auto-parse on drop**: confirmed working (no change needed)

## v1.4.0 (2026-07-16)

- **Full-page PDF extraction**: removed 3-page cap, reads all pages
- **Amount normalization**: structured `{ value, numeric, currency }` — Excel exports raw numbers
- **Per-field confidence**: yellow dot + bar for low-confidence (<60%) fields
- **Parallel batch parsing**: 4-concurrency worker pool

## v1.3.2 (2026-07-09)

- **Responsive audit**: 3-level breakpoints, iOS safe area, touch targets ≥44px
- **Footer About**: SEO-friendly description with i18n tags

## v1.3.1 (2026-07-09)

- **Performance**: dynamic import html2canvas (201KB) + jszip (97KB)
- **Font**: non-blocking Google Fonts via preconnect + media=print
- **index.js**: 796KB → 496KB (-38%)

## v1.3.0 (2026-07-08)

- **i18n**: Full zh/en translation (88 keys), react-i18next, lang toggle
- **Dark mode**: CSS variable swap, system preference detection, localStorage
- **ZIP export**: JSZip replaces sequential download
- **Screenshot share**: html2canvas → clipboard
- **Drag sort**: @dnd-kit SortableContext
- **Multi-select**: checkboxes + batch delete
- **Export filename dialog**: custom filename before export
- **Error retry**: retry button on failed items
- **Session persistence**: localStorage save/restore
- **Keyboard shortcuts**: Ctrl+O / Delete / Ctrl+E
- **PDF page picker**: per-page checkbox before merge
- **English invoice parser**: new strategy for $ amounts
- **Demo data**: 2 sample invoices
- **PWA offline**: service worker cache-first

## v1.2.0 (2026-07-07)

- **PDF merge**: combine multiple PDFs
- **Batch rename**: template-driven with variable chips
- **Duplicate detection**: content-aware hash comparison
- Bug fixes: PreviewPanel caching, handleMerge exception, sellerName logic

## v1.1.0 (2026-07-06)

- **i18n preparation**: i18next setup
- **Type selector**: manual document type override
- **Bottom bar**: parsed count and export actions

## v1.0.0 (2026-07-05)

- Initial release
- 7 Chinese document parsers
- PDF text extraction + image OCR
- Excel export
- Drag-and-drop file upload
