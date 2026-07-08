import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-version">{t('footer.version')}</span>
        <span className="footer-sep">&middot;</span>
        <span>{t('footer.tech')}
          <span className="footer-stack">
            <svg width="14" height="14" viewBox="0 0 32 32" fill="none" style={{marginLeft:4,verticalAlign:-3}}>
              <rect width="32" height="32" rx="4" fill="#61DAFB"/>
              <circle cx="16" cy="16" r="3" fill="#fff" opacity="0.8"/>
              <ellipse cx="16" cy="16" rx="10" ry="4" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.6"/>
              <ellipse cx="16" cy="16" rx="10" ry="4" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.6" transform="rotate(60 16 16)"/>
              <ellipse cx="16" cy="16" rx="10" ry="4" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.6" transform="rotate(120 16 16)"/>
            </svg>
            React
          </span>
          <span className="footer-stack">
            <svg width="14" height="14" viewBox="0 0 32 32" fill="none" style={{verticalAlign:-3}}>
              <rect y="2" width="32" height="28" rx="4" fill="#FFD43B"/>
              <path d="M18 6v7l3-1 3 1V6" fill="#306998"/>
              <path d="M10 6h7l-3.5 5L10 6" fill="#306998"/>
            </svg>
            Vite
          </span>
          <span className="footer-stack">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{verticalAlign:-3}}>
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#38BDF8" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </svg>
            Zustand
          </span>
        </span>
        <span className="footer-sep">&middot;</span>
        <a href="https://github.com/absolutelyZero/Ticket-Check-Bro/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">
          {t('footer.license')}
        </a>
        <span className="footer-sep">&middot;</span>
        <span className="footer-privacy">{t('footer.privacy')}</span>
      </div>

      <style>{`
        .footer {
          flex-shrink: 0;
          border-top: 1px solid var(--card-border);
          background: var(--card-bg);
        }
        .footer-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 24px;
          font-size: 12px;
          color: var(--text-muted);
          flex-wrap: wrap;
        }
        .footer a {
          color: var(--text-muted);
          text-decoration: none;
          transition: color var(--transition-fast);
        }
        .footer a:hover {
          color: var(--primary);
        }
        .footer-sep {
          opacity: 0.3;
        }
        .footer-version {
          padding: 1px 7px;
          background: var(--bg-alt);
          border-radius: 100px;
          font-size: 11px;
          font-weight: 600;
          color: var(--text-secondary);
          font-family: 'SF Mono', 'Cascadia Code', monospace;
        }
        .footer-stack {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          margin-left: 6px;
          font-weight: 500;
          color: var(--text-secondary);
        }
        @media (max-width: 640px) {
          .footer-stack, .footer-privacy { display: none; }
        }
      `}</style>
    </footer>
  )
}
