import { Github } from 'lucide-react'

export default function Header() {
  return (
    <header className="header">
      <div className="header-brand">
        <div className="header-logo">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="6" fill="#2196F3"/>
            <path d="M8 10h16v2H8zm0 5h16v2H8zm0 5h10v2H8z" fill="#fff" opacity="0.9"/>
            <circle cx="24" cy="22" r="4" fill="#fff"/>
            <path d="M23 22h2m-1-1v2" stroke="#2196F3" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="header-text">
          <h1 className="header-title">Ticket-Check-Bro</h1>
          <p className="header-subtitle">Intelligent Document Intelligence Platform</p>
        </div>
      </div>
      <div className="header-tagline">Drop. Parse. Export. Done.</div>
      <a
        href="https://github.com/absolutelyZero/Ticket-Check-Bro"
        target="_blank"
        rel="noopener noreferrer"
        className="header-gh-link"
        title="View on GitHub"
      >
        <Github size="20" />
        <span>GitHub</span>
      </a>

      <style>{`
        .header {
          display: flex;
          align-items: center;
          padding: 12px 20px;
          background: var(--card-bg);
          border-bottom: 1px solid var(--border);
          gap: 16px;
          flex-shrink: 0;
        }
        .header-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .header-logo {
          display: flex;
        }
        .header-text {
          display: flex;
          flex-direction: column;
        }
        .header-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.3px;
        }
        .header-subtitle {
          font-size: 11px;
          color: var(--text-muted);
          letter-spacing: 0.3px;
          font-weight: 400;
        }
        .header-tagline {
          flex: 1;
          text-align: center;
          font-size: 13px;
          color: var(--text-secondary);
          font-weight: 400;
          letter-spacing: 0.5px;
        }
        .header-gh-link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 13px;
          transition: all var(--transition);
        }
        .header-gh-link:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: var(--primary-light);
        }
        @media (max-width: 640px) {
          .header-tagline { display: none; }
        }
      `}</style>
    </header>
  )
}
