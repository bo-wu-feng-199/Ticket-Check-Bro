import { FileText, Image } from 'lucide-react'

export default function PreviewPanel({ file }) {
  const isImage = file?.mimeType?.startsWith('image/')
  const previewUrl = file?.previewUrl || null

  const fileName = file?.fileName || ''
  const isProcessing = file?.status === 'parsing'

  return (
    <div className="preview-panel card">
      <div className="preview-header">
        <h3>Preview</h3>
        {isProcessing && <span className="preview-processing">Processing...</span>}
      </div>
      <div className="preview-content">
        {isProcessing ? (
          <div className="preview-placeholder">
            <div className="preview-spinner" />
            <span>Extracting content...</span>
          </div>
        ) : isImage && previewUrl ? (
          <div className="preview-image-wrapper">
            <img src={previewUrl} alt={fileName} className="preview-image" />
          </div>
        ) : fileName.endsWith('.pdf') ? (
          <div className="preview-placeholder">
            <FileText size="32" opacity="0.3" />
            <span>PDF content preview not available in browser</span>
            <span className="preview-note">Text data has been extracted and parsed. See fields below.</span>
          </div>
        ) : (
          <div className="preview-placeholder">
            <Image size="32" opacity="0.3" />
            <span>Preview unavailable</span>
          </div>
        )}
      </div>

      <style>{`
        .preview-panel {
          margin: 0 16px;
          overflow: hidden;
        }
        .preview-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px 0;
        }
        .preview-header h3 {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
        }
        .preview-processing {
          font-size: 11px;
          color: var(--warning);
          font-weight: 500;
        }
        .preview-content {
          padding: 12px 16px;
          min-height: 120px;
        }
        .preview-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: var(--text-muted);
          font-size: 13px;
          padding: 24px;
          background: #FAFAFA;
          border-radius: var(--radius-sm);
          border: 1px dashed var(--border);
        }
        .preview-note {
          font-size: 11px;
          opacity: 0.7;
        }
        .preview-image-wrapper {
          max-height: 300px;
          overflow: hidden;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border);
        }
        .preview-image {
          width: 100%;
          height: auto;
          display: block;
        }
        .preview-spinner {
          width: 24px;
          height: 24px;
          border: 2px solid var(--border);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
