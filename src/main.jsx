import React from 'react'
import ReactDOM from 'react-dom/client'
import './i18n.js'
import App from './App.jsx'
import './index.css'

// Signal pre-renderer that DOM is ready
document.dispatchEvent(new Event('prerender-ready'))

// Register service worker for PWA offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
