import { useInvoiceStore } from './store/invoiceStore.js'
import Header from './components/Header.jsx'
import DropZone from './components/DropZone.jsx'
import FilePanel from './components/FilePanel.jsx'
import DetailPanel from './components/DetailPanel.jsx'
import BottomBar from './components/BottomBar.jsx'
import Footer from './components/Footer.jsx'
import './App.css'

export default function App() {
  const entries = useInvoiceStore(s => s.entries)
  const selectedUid = useInvoiceStore(s => s.selectedUid)

  return (
    <div className="app-shell">
      <Header />
      <DropZone />
      <main className="app-main">
        <aside className="sidebar">
          <FilePanel />
        </aside>
        <section className="detail-area">
          {selectedUid && entries.find(e => e.uid === selectedUid) ? (
            <DetailPanel />
          ) : (
            <div className="empty-state">
              <div className="empty-art">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                  <rect x="30" y="20" width="60" height="80" rx="8" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1.5"/>
                  <rect x="40" y="32" width="20" height="3" rx="1.5" fill="#93C5FD"/>
                  <rect x="40" y="40" width="28" height="3" rx="1.5" fill="#93C5FD"/>
                  <rect x="40" y="48" width="14" height="3" rx="1.5" fill="#93C5FD"/>
                  <rect x="40" y="60" width="40" height="2" rx="1" fill="#E2E8F0"/>
                  <rect x="40" y="66" width="38" height="2" rx="1" fill="#E2E8F0"/>
                  <rect x="40" y="72" width="36" height="2" rx="1" fill="#E2E8F0"/>
                  <rect x="40" y="78" width="34" height="2" rx="1" fill="#E2E8F0"/>
                  <circle cx="80" cy="80" r="16" fill="#2563EB" opacity="0.12"/>
                  <circle cx="80" cy="80" r="10" fill="#2563EB" opacity="0.08"/>
                  <path d="M76 80h8m-4-4v8" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" opacity="0.5"/>
                  <rect x="68" y="42" width="20" height="3" rx="1.5" fill="#E2E8F0"/>
                  <rect x="68" y="48" width="14" height="3" rx="1.5" fill="#E2E8F0"/>
                </svg>
              </div>
              <h3 className="empty-title">No document selected</h3>
              <p className="empty-desc">Drop your files in the area above, then click any entry in the list to inspect its parsed fields.</p>
            </div>
          )}
        </section>
      </main>
      {entries.length > 0 && <BottomBar />}
      <Footer />
    </div>
  )
}
