import { useCallback, useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import { useFileManager } from '../hooks/useFileManager.js'

export default function DropZone() {
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

  const handleClick = () => {
    inputRef.current?.click()
  }

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
      <Upload size="32" className="dropzone-icon" />
      <div className="dropzone-text">
        <span className="dropzone-primary">Drop your documents here</span>
        <span className="dropzone-secondary">or click to browse — PDF, JPG, JPEG, PNG supported</span>
      </div>
      <span className="dropzone-badge">100% client-side — zero server upload</span>
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
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 16px 16px 0;
          padding: 20px 24px;
          border: 2px dashed var(--border);
          border-radius: var(--radius-lg);
          background: var(--card-bg);
          cursor: pointer;
          transition: all 250ms ease;
        }
        .dropzone:hover {
          border-color: var(--primary);
          background: var(--primary-light);
        }
        .dropzone.dragging {
          border-color: var(--primary);
          background: var(--primary-light);
          transform: scale(1.01);
          box-shadow: 0 0 0 4px rgba(33, 150, 243, 0.15);
        }
        .dropzone-icon {
          color: var(--primary);
          flex-shrink: 0;
          opacity: 0.8;
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
        }
        .dropzone-secondary {
          font-size: 13px;
          color: var(--text-secondary);
        }
        .dropzone-badge {
          padding: 4px 10px;
          background: #E8F5E9;
          color: #2E7D32;
          font-size: 11px;
          font-weight: 600;
          border-radius: 100px;
          white-space: nowrap;
          flex-shrink: 0;
        }
        @media (max-width: 640px) {
          .dropzone { flex-wrap: wrap; }
          .dropzone-badge { display: none; }
        }
      `}</style>
    </div>
  )
}
