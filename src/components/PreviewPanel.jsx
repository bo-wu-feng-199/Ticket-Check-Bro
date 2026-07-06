import { useEffect, useRef, useState } from 'react'
import { FileText, Image, Loader2 } from 'lucide-react'
import { pdfjsLib } from '../core/extractor/PdfExtractor.js'
import { getFile } from '../store/fileRefs.js'

export default function PreviewPanel({ file }) {
  const canvasRef = useRef(null)
  const [pdfImageUrl, setPdfImageUrl] = useState(null)
  const [pdfLoading, setPdfLoading] = useState(false)

  const isImage = file?.mimeType?.startsWith('image/')
  const imagePreviewUrl = file?.previewUrl || null
  const isPdf = file?.fileName?.endsWith('.pdf')
  const fileName = file?.fileName || ''
  const isProcessing = file?.status === 'parsing'

  // Render PDF first page to canvas
  useEffect(() => {
    if (!isPdf || isProcessing) return
    if (pdfImageUrl) return // already rendered

    let cancelled = false
    setPdfLoading(true)

    ;(async () => {
      try {
        const fileObj = getFile(file.uid)
        if (!fileObj) return

        const arrayBuffer = await fileObj.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
        if (cancelled) return

        const page = await pdf.getPage(1)
        if (cancelled) return

        // Determine scale to fit within max 400px width
        const viewport = page.getViewport({ scale: 1 })
        const maxWidth = 600
        const scale = Math.min(maxWidth / viewport.width, 2)
        const scaled = page.getViewport({ scale })

        const canvas = document.createElement('canvas')
        canvas.width = scaled.width
        canvas.height = scaled.height
        const ctx = canvas.getContext('2d')

        await page.render({ canvasContext: ctx, viewport: scaled }).promise
        if (cancelled) return

        setPdfImageUrl(canvas.toDataURL('image/png'))
      } catch (err) {
        console.warn('PDF preview render failed:', err)
      } finally {
        if (!cancelled) setPdfLoading(false)
      }
    })()

    return () => { cancelled = true }
  }, [file?.uid, isPdf, isProcessing])

  return (
    <div className="preview-panel card">
      <div className="preview-header">
        <h3>Preview</h3>
        {isProcessing && <span className="preview-processing">Processing...</span>}
        {pdfLoading && <span className="preview-processing">Rendering PDF...</span>}
      </div>
      <div className="preview-content">
        {isProcessing ? (
          <div className="preview-placeholder">
            <div className="preview-spinner" />
            <span>Extracting content...</span>
          </div>
        ) : isImage && imagePreviewUrl ? (
          <div className="preview-image-wrapper">
            <img src={imagePreviewUrl} alt={fileName} className="preview-image" />
          </div>
        ) : isPdf && pdfImageUrl ? (
          <div className="preview-image-wrapper">
            <img src={pdfImageUrl} alt={fileName} className="preview-image" />
            <div className="preview-pdf-note">Page 1 of document</div>
          </div>
        ) : isPdf && pdfLoading ? (
          <div className="preview-placeholder">
            <Loader2 size="24" className="spin" />
            <span>Rendering PDF page...</span>
          </div>
        ) : isPdf ? (
          <div className="preview-placeholder">
            <FileText size="32" opacity="0.3" />
            <span>PDF preview unavailable</span>
          </div>
        ) : (
          <div className="preview-placeholder">
            <Image size="32" opacity="0.3" />
            <span>Preview unavailable</span>
          </div>
        )}
      </div>

      <style>{`
        .preview-panel { margin: 0 16px; overflow: hidden; }
        .preview-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 16px 0;
        }
        .preview-header h3 { font-size: 13px; font-weight: 600; color: var(--text-primary); }
        .preview-processing { font-size: 11px; color: var(--warning); font-weight: 500; }
        .preview-content { padding: 12px 16px; min-height: 120px; }
        .preview-placeholder {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 8px; color: var(--text-muted); font-size: 13px;
          padding: 24px; background: #FAFAFA;
          border-radius: var(--radius-sm); border: 1px dashed var(--border);
        }
        .preview-image-wrapper {
          max-height: 400px; overflow: auto;
          border-radius: var(--radius-sm); border: 1px solid var(--border);
          position: relative;
        }
        .preview-image { width: 100%; height: auto; display: block; }
        .preview-pdf-note {
          position: absolute; bottom: 8px; right: 8px;
          padding: 2px 8px; background: rgba(0,0,0,0.6);
          color: #fff; font-size: 11px; border-radius: 4px;
        }
        .preview-spinner {
          width: 24px; height: 24px;
          border: 2px solid var(--border); border-top-color: var(--primary);
          border-radius: 50%; animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  )
}
