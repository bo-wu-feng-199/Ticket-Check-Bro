import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Upload, Lock } from 'lucide-react'
import { useFileManager } from '../hooks/useFileManager.js'

export default function DropZone() {
  const { t } = useTranslation()
  const { addFiles } = useFileManager()
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef(null)

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files)
    }
  }, [addFiles])

  const handleClick = () => inputRef.current?.click()

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      addFiles(e.target.files)
      e.target.value = ''
    }
  }

  return (
    <div
      className={`dropzone ${isDragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <div className="dropzone-ring" />
      <div className="dropzone-icon-wrap">
        <Upload size="28" className="dropzone-icon" />
      </div>
      <div className="dropzone-text">
        <span className="dropzone-primary">{t('dropzone.primary')}</span>
        <span className="dropzone-secondary">{t('dropzone.secondary')}</span>
      </div>
      <div className="dropzone-meta">
        <Lock size="12" />
        <span>{t('dropzone.badge')}</span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        multiple
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <style>{`
        .dropzone {
          position: relative;
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 16px 24px 0;
          padding: 22px 28px;
          border-radius: var(--radius-lg);
          background: var(--card-bg);
          border: 2px dashed var(--border);
          cursor: pointer;
          transition: all var(--transition-slow);
          overflow: hidden;
        }
        .dropzone::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          background: linear-gradient(135deg, rgba(37,99,235,0.08), rgba(124,58,237,0.08));
          opacity: 0;
          transition: opacity var(--transition-slow);
        }
        .dropzone:hover {
          border-color: var(--primary);
        }
        .dropzone:hover::before {
          opacity: 1;
        }
        .dropzone.dragging {
          border-color: var(--primary);
          border-style: solid;
          transform: scale(1.015);
          box-shadow: var(--shadow-glow);
          background: var(--primary-light);
        }
        .dropzone.dragging .dropzone-ring {
          opacity: 1;
          animation: ring-expand 0.8s ease-out forwards;
        }
        .dropzone-ring {
          position: absolute;
          inset: -8px;
          border-radius: calc(var(--radius-lg) + 6px);
          border: 2px solid var(--primary);
          opacity: 0;
          pointer-events: none;
        }
        @keyframes ring-expand {
          0%   { opacity: 0.6; transform: scale(0.95); }
          100% { opacity: 0;   transform: scale(1.04); }
        }

        .dropzone-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          background: var(--primary-light);
          flex-shrink: 0;
          transition: transform var(--transition);
        }
        .dropzone:hover .dropzone-icon-wrap {
          transform: scale(1.08) rotate(-4deg);
        }
        .dropzone-icon {
          color: var(--primary);
        }

        .dropzone-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .dropzone-primary {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
          letter-spacing: -0.2px;
        }
        .dropzone-secondary {
          font-size: 13px;
          color: var(--text-muted);
        }

        .dropzone-meta {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          background: var(--success-light);
          color: var(--success);
          font-size: 11px;
          font-weight: 600;
          border-radius: 100px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        @media (max-width: 640px) {
          .dropzone { margin: 8px 12px 0; padding: 14px 14px; flex-wrap: wrap; min-height: 80px; }
          .dropzone-meta { display: none; }
          .dropzone-primary { font-size: 14px; }
          .dropzone-secondary { font-size: 12px; }
        }
      `}</style>
    </div>
  )
}
