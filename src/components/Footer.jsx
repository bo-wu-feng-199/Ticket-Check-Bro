export default function Footer() {
  return (
    <footer className="footer">
      <span>Built with precision &middot; Powered by React + Vite</span>
      <span className="footer-sep">&middot;</span>
      <span>
        <a href="https://github.com/absolutelyZero/Ticket-Check-Bro" target="_blank" rel="noopener noreferrer">
          MIT License
        </a>
      </span>
      <span className="footer-sep">&middot;</span>
      <span className="footer-privacy">Your data never leaves your browser</span>

      <style>{`
        .footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 20px;
          font-size: 12px;
          color: var(--text-muted);
          border-top: 1px solid var(--border);
          flex-shrink: 0;
        }
        .footer a {
          color: var(--text-muted);
          text-decoration: none;
        }
        .footer a:hover {
          color: var(--primary);
        }
        .footer-sep {
          opacity: 0.4;
        }
        @media (max-width: 480px) {
          .footer-privacy { display: none; }
        }
      `}</style>
    </footer>
  )
}
