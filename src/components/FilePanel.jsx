import FileActions from './FileActions.jsx'
import FileList from './FileList.jsx'
import StatsBar from './StatsBar.jsx'

export default function FilePanel() {
  return (
    <div className="file-panel card">
      <div className="file-panel-header">
        <h2>Documents</h2>
      </div>
      <FileActions />
      <FileList />
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
      `}</style>
    </div>
  )
}
