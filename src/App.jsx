import { useTranslation } from 'react-i18next'
import { useInvoiceStore } from './store/invoiceStore.js'
import Header from './components/Header.jsx'
import DropZone from './components/DropZone.jsx'
import FilePanel from './components/FilePanel.jsx'
import DetailPanel from './components/DetailPanel.jsx'
import BottomBar from './components/BottomBar.jsx'
import Footer from './components/Footer.jsx'
import EmptyState from './components/EmptyState.jsx'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts.js'
import './App.css'

export default function App() {
  const { t } = useTranslation()
  const entries = useInvoiceStore(s => s.entries)
  const selectedUid = useInvoiceStore(s => s.selectedUid)

  useKeyboardShortcuts()

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
            <EmptyState />
          )}
        </section>
      </main>
      {entries.length > 0 && <BottomBar />}
      <Footer />
    </div>
  )
}
