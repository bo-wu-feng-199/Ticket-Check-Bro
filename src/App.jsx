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
              <div className="empty-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              </div>
              <h3>No document selected</h3>
              <p>Drop your files above, then click any entry in the file list to inspect its parsed data.</p>
            </div>
          )}
        </section>
      </main>
      {entries.length > 0 && <BottomBar />}
      <Footer />
    </div>
  )
}
