import { useTranslation } from 'react-i18next'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useInvoiceStore } from '../store/invoiceStore.js'
import { formatFileSize } from '../utils/fileHelper.js'
import { FileText, Image, Loader2, AlertCircle, CheckCircle, GripVertical, RefreshCw } from 'lucide-react'
import { useFileManager } from '../hooks/useFileManager.js'

function SortableItem({ entry, index, isSelected, isImage, selectedUids, toggleSelect, selectEntry, retryFile }) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging
  } = useSortable({ id: entry.uid })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`file-item ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
      onClick={() => selectEntry(entry.uid)}
    >
      <div className="file-item-checkbox" onClick={e => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={selectedUids.includes(entry.uid)}
          onChange={() => toggleSelect(entry.uid)}
        />
      </div>
      <div className="file-item-drag-handle" {...attributes} {...listeners} onClick={e => e.stopPropagation()}>
        <GripVertical size="14" />
      </div>
      <div className="file-item-icon">
        {entry.status === 'parsing' ? (
          <Loader2 size="18" className="spin" />
        ) : entry.status === 'failed' ? (
          <AlertCircle size="18" color="var(--danger)" />
        ) : entry.status === 'parsed' ? (
          <CheckCircle size="18" color="var(--success)" />
        ) : (
          isImage ? <Image size="18" /> : <FileText size="18" />
        )}
      </div>
      <div className="file-item-info">
        <span className="file-item-name">{entry.fileName}</span>
        <span className="file-item-meta">
          {formatFileSize(entry.fileSize)} &middot; #{index + 1}
        </span>
      </div>
      {entry.status === 'failed' && (
        <button
          className="file-item-retry"
          onClick={e => { e.stopPropagation(); retryFile(entry.uid) }}
          title="Retry"
        >
          <RefreshCw size="14" />
        </button>
      )}
    </div>
  )
}

export default function FileList({ searchTerm = '' }) {
  const { t } = useTranslation()
  const entries = useInvoiceStore(s => s.entries)
  const results = useInvoiceStore(s => s.results)
  const selectedUid = useInvoiceStore(s => s.selectedUid)
  const selectEntry = useInvoiceStore(s => s.selectEntry)
  const moveEntry = useInvoiceStore(s => s.moveEntry)
  const selectedUids = useInvoiceStore(s => s.selectedUids)
  const toggleSelect = useInvoiceStore(s => s.toggleSelect)
  const { retryFile } = useFileManager()

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = entries.findIndex(e => e.uid === active.id)
    const newIndex = entries.findIndex(e => e.uid === over.id)
    if (oldIndex !== -1 && newIndex !== -1) {
      moveEntry(oldIndex, newIndex)
    }
  }

  if (entries.length === 0) {
    return (
      <div className="file-list-empty">
        <FileText size="24" opacity="0.3" />
        <p>{t('fileList.empty')}</p>
        <p className="file-list-hint">{t('fileList.hint')}</p>

        <style>{`
          .file-list-empty {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: var(--text-muted);
            gap: 8px;
            padding: 40px 20px;
          }
          .file-list-hint {
            font-size: 12px;
            opacity: 0.7;
          }
        `}</style>
      </div>
    )
  }

  const filteredEntries = searchTerm
    ? entries.filter(e =>
        e.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        results[e.uid]?.fields?.invoiceNumber?.value?.includes(searchTerm) ||
        results[e.uid]?.fields?.totalAmount?.value?.includes(searchTerm)
      )
    : entries

  if (filteredEntries.length === 0) {
    return (
      <div className="file-list-empty">
        <FileText size="24" opacity="0.3" />
        <p>No results</p>
        <p className="file-list-hint">Try a different search term</p>

        <style>{`
          .file-list-empty {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: var(--text-muted);
            gap: 8px;
            padding: 40px 20px;
          }
          .file-list-hint {
            font-size: 12px;
            opacity: 0.7;
          }
        `}</style>
      </div>
    )
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={filteredEntries.map(e => e.uid)} strategy={verticalListSortingStrategy}>
        <div className="file-list">
          {filteredEntries.map((entry, index) => {
            const isSelected = entry.uid === selectedUid
            const isImage = entry.mimeType?.startsWith('image/')
            return (
              <SortableItem
                key={entry.uid}
                entry={entry}
                index={index}
                isSelected={isSelected}
                isImage={isImage}
                selectedUids={selectedUids}
                toggleSelect={toggleSelect}
                selectEntry={selectEntry}
                retryFile={retryFile}
              />
            )
          })}

          <style>{`
            .file-list {
              flex: 1;
              overflow-y: auto;
              padding: 4px 8px;
            }
            .file-item {
              display: flex;
              align-items: center;
              gap: 6px;
              padding: 8px 10px;
              border-radius: var(--radius-sm);
              cursor: pointer;
              transition: all var(--transition);
            }
            .file-item:hover {
              background: #F5F5F5;
            }
            .file-item.selected {
              background: var(--primary-light);
              border: 1px solid rgba(33, 150, 243, 0.3);
            }
            .file-item.dragging {
              z-index: 10;
              box-shadow: var(--shadow-md);
              background: #fff;
            }
            .file-item-checkbox {
              display: flex;
              align-items: center;
              flex-shrink: 0;
            }
            .file-item-checkbox input[type="checkbox"] {
              width: 14px;
              height: 14px;
              cursor: pointer;
              accent-color: var(--primary);
            }
            .file-item-drag-handle {
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
              width: 20px;
              height: 20px;
              color: var(--text-muted);
              cursor: grab;
              opacity: 0;
              transition: opacity var(--transition);
              border-radius: 3px;
              touch-action: none;
            }
            .file-item:hover .file-item-drag-handle {
              opacity: 0.6;
            }
            .file-item-drag-handle:hover {
              opacity: 1 !important;
              background: #E8E8E8;
            }
            .file-item-drag-handle:active {
              cursor: grabbing;
            }
            .file-item-icon {
              flex-shrink: 0;
              width: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: var(--text-muted);
            }
            .file-item-info {
              flex: 1;
              min-width: 0;
              display: flex;
              flex-direction: column;
              gap: 1px;
            }
            .file-item-name {
              font-size: 13px;
              font-weight: 500;
              color: var(--text-primary);
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .file-item-meta {
              font-size: 11px;
              color: var(--text-muted);
            }
            .file-item-retry {
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
              width: 26px;
              height: 26px;
              border: 1px solid var(--border);
              border-radius: var(--radius-sm);
              background: var(--card-bg);
              color: var(--text-secondary);
              cursor: pointer;
              transition: all var(--transition);
            }
            .file-item-retry:hover {
              border-color: var(--primary);
              color: var(--primary);
            }
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .spin {
              animation: spin 1s linear infinite;
            }
          `}</style>
        </div>
      </SortableContext>
    </DndContext>
  )
}
