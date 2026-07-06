import { Github, Star } from 'lucide-react'

export default function Header() {
  return (
    <header className="header">
      <div className="header-bg" />
      <div className="header-inner">
        <div className="header-brand">
          <div className="header-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <defs>
                <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
              <rect width="32" height="32" rx="8" fill="url(#logo-grad)" />
              <path d="M7 11h10v1.5H7zm0 4.5h10V17H7zm0 4.5h7v1.5H7z" fill="#fff" opacity="0.9" />
              <circle cx="24" cy="23" r="4.5" fill="#fff" />
              <path d="M23 23h2m-1-1v2" stroke="url(#logo-grad)" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </div>
          <div className="header-text">
            <h1 className="header-title">Ticket-Check-Bro</h1>
            <p className="header-subtitle">Intelligent Document Intelligence Platform</p>
          </div>
        </div>

        <div className="header-tagline">
          <span className="tagline-dot" />
          Drop. Parse. Export. Done.
        </div>

        <a
          href="https://github.com/absolutelyZero/Ticket-Check-Bro"
          target="_blank"
          rel="noopener noreferrer"
          className="header-gh-link"
          title="View on GitHub"
        >
          <Github size="18" />
          <span>GitHub</span>
          <span className="gh-badge">
            <Star size="12" />
            Star
          </span>
        </a>
      </div>

      <style>{`
        .header {
          position: relative;
          flex-shrink: 0;
          overflow: hidden;
        }
        .header-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .header-inner {
          position: relative;
          display: flex;
          align-items: center;
          padding: 14px 24px;
          gap: 16px;
          z-index: 1;
        }
        .header-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .header-logo {
          display: flex;
          filter: drop-shadow(0 2px 8px rgba(37,99,235,0.3));
          animation: logoFloat 4s ease-in-out infinite;
        }
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        .header-text {
          display: flex;
          flex-direction: column;
        }
        .header-title {
          font-size: 17px;
          font-weight: 700;
          color: #F8FAFC;
          letter-spacing: -0.4px;
          line-height: 1.3;
        }
        .header-subtitle {
          font-size: 11px;
          color: #64748B;
          letter-spacing: 0.4px;
          font-weight: 400;
          text-transform: uppercase;
        }
        .header-tagline {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 13px;
          color: #94A3B8;
          font-weight: 400;
          letter-spacing: 0.5px;
        }
        .tagline-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #22C55E;
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .header-gh-link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: var(--radius-sm);
          color: #94A3B8;
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          transition: all var(--transition);
          background: rgba(255,255,255,0.03);
        }
        .header-gh-link:hover {
          border-color: rgba(255,255,255,0.2);
          color: #F8FAFC;
          background: rgba(255,255,255,0.06);
          transform: translateY(-1px);
        }
        .gh-badge {
          display: flex;
          align-items: center;
          gap: 3px;
          padding: 1px 7px;
          background: rgba(255,255,255,0.08);
          border-radius: 100px;
          font-size: 11px;
          color: #94A3B8;
        }
        @media (max-width: 640px) {
          .header-tagline { display: none; }
          .gh-badge { display: none; }
          .header-inner { padding: 12px 16px; }
        }
      `}</style>
    </header>
  )
}
