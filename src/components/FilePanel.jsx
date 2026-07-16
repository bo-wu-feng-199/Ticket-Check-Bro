import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'
import FileActions from './FileActions.jsx'
import FileList from './FileList.jsx'
import StatsBar from './StatsBar.jsx'

export default function FilePanel() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="file-panel card">
      <div className="file-panel-header">
        <h2>{t('filePanel.title')}</h2>
      </div>
      <FileActions />
      <div className="file-search-wrap">
        <Search size="14" className="file-search-icon" />
        <input
          className="file-search"
          type="text"
          placeholder="Search files..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <FileList searchTerm={searchTerm} />
      <StatsBar />

      <style>{`
        .file-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .file-panel-header {
          padding: 14px 16px 0;
        }
        .file-panel-header h2 {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }
        .file-search-wrap { position: relative; padding: 0 18px; margin-top: 10px; }
        .file-search-icon { position: absolute; left: 26px; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none; }
        .file-search { width: 100%; padding: 8px 10px 8px 32px; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--bg); color: var(--text-primary); font-size: 13px; outline: none; transition: border-color var(--transition-fast); }
        .file-search:focus { border-color: var(--border-focus); }
        .file-search::placeholder { color: var(--text-muted); }
      `}</style>
    </div>
  )
}
