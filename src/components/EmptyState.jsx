import { useTranslation } from 'react-i18next'
import { FileText, Upload, Wand2, FileSpreadsheet, Merge, Printer, ShieldCheck, Search, Plane, Wallet, Archive } from 'lucide-react'

/**
 * EmptyState — landing-style welcome screen shown when no files are loaded.
 * Follows best-practice SaaS landing patterns: hero CTA, numeric proof,
 * scenario sections, and a 4-step usage flow guide.
 */
export default function EmptyState() {
  const { t } = useTranslation()

  const steps = [
    { icon: Upload, title: t('empty.step1Title'), desc: t('empty.step1Desc') },
    { icon: Wand2, title: t('empty.step2Title'), desc: t('empty.step2Desc') },
    { icon: FileSpreadsheet, title: t('empty.step3Title'), desc: t('empty.step3Desc') },
    { icon: Merge, title: t('empty.step4Title'), desc: t('empty.step4Desc') }
  ]

  const stats = [
    { value: '8', label: t('empty.statTypes') },
    { value: '35', label: t('empty.statTests') },
    { value: '0', label: t('empty.statUploads') },
    { value: '7', label: t('empty.statLayouts') }
  ]

  const scenarios = [
    { icon: Plane, title: t('empty.scnTravelTitle'), desc: t('empty.scnTravelDesc') },
    { icon: Wallet, title: t('empty.scnReconTitle'), desc: t('empty.scnReconDesc') },
    { icon: Archive, title: t('empty.scnArchiveTitle'), desc: t('empty.scnArchiveDesc') }
  ]

  return (
    <div className="empty-landing">
      {/* ── Hero ── */}
      <div className="empty-hero">
        <h2 className="empty-hero-title">{t('empty.heroTitle')}</h2>
        <p className="empty-hero-sub">{t('empty.heroSub')}</p>
        <div className="empty-hero-badges">
          <span className="empty-badge"><ShieldCheck size="13" />{t('empty.noSignup')}</span>
          <span className="empty-badge"><ShieldCheck size="13" />{t('empty.privacy')}</span>
          <span className="empty-badge"><ShieldCheck size="13" />{t('empty.free')}</span>
        </div>
      </div>

      {/* ── Numbers ── */}
      <div className="empty-stats">
        {stats.map(s => (
          <div className="empty-stat" key={s.label}>
            <span className="empty-stat-value">{s.value}</span>
            <span className="empty-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Flow guide ── */}
      <div className="empty-flow">
        <h3 className="empty-section-title">{t('empty.flowTitle')}</h3>
        <div className="empty-flow-steps">
          {steps.map((s, i) => (
            <div className="empty-step" key={s.title}>
              <div className="empty-step-num">{i + 1}</div>
              <s.icon size="18" className="empty-step-icon" />
              <strong>{s.title}</strong>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Scenarios ── */}
      <div className="empty-scenarios">
        <h3 className="empty-section-title">{t('empty.scnTitle')}</h3>
        <div className="empty-scn-grid">
          {scenarios.map(sc => (
            <div className="empty-scn-card" key={sc.title}>
              <sc.icon size="20" className="empty-scn-icon" />
              <strong>{sc.title}</strong>
              <p>{sc.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="empty-drop-hint">
        <FileText size="14" />
        {t('empty.dropHint')}
      </p>

      <style>{`
        .empty-landing {
          max-width: 760px;
          margin: 0 auto;
          padding: 28px 24px 40px;
          display: flex;
          flex-direction: column;
          gap: 34px;
        }
        .empty-hero { text-align: center; }
        .empty-hero-title {
          font-size: 26px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.5px;
          margin: 0 0 8px;
        }
        .empty-hero-sub {
          font-size: 14px;
          color: var(--text-muted);
          margin: 0 0 16px;
          line-height: 1.6;
        }
        .empty-hero-badges {
          display: flex;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .empty-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 100px;
          background: var(--primary-light, rgba(37,99,235,0.08));
          color: var(--primary);
          font-size: 11px;
          font-weight: 600;
        }
        .empty-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        .empty-stat {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 16px 10px;
          text-align: center;
        }
        .empty-stat-value {
          display: block;
          font-size: 30px;
          font-weight: 900;
          color: var(--primary);
          letter-spacing: -1px;
          line-height: 1.1;
        }
        .empty-stat-label {
          display: block;
          font-size: 11px;
          color: var(--text-muted);
          margin-top: 4px;
          line-height: 1.4;
        }
        .empty-section-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 14px;
          text-align: center;
        }
        .empty-flow-steps {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }
        .empty-step {
          position: relative;
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 14px 12px 12px;
          text-align: center;
        }
        .empty-step-num {
          position: absolute;
          top: -9px;
          left: 50%;
          transform: translateX(-50%);
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--primary);
          color: #fff;
          font-size: 10px;
          font-weight: 800;
          display: grid;
          place-items: center;
        }
        .empty-step-icon {
          color: var(--primary);
          margin-bottom: 6px;
        }
        .empty-step strong {
          display: block;
          font-size: 12px;
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .empty-step p {
          margin: 0;
          font-size: 10px;
          color: var(--text-muted);
          line-height: 1.5;
        }
        .empty-scn-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .empty-scn-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 14px;
        }
        .empty-scn-icon { color: var(--primary); margin-bottom: 6px; }
        .empty-scn-card strong {
          display: block;
          font-size: 13px;
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .empty-scn-card p {
          margin: 0;
          font-size: 11px;
          color: var(--text-muted);
          line-height: 1.5;
        }
        .empty-drop-hint {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 12px;
          color: var(--text-muted);
          margin: 0;
        }
        @media (max-width: 640px) {
          .empty-stats { grid-template-columns: repeat(2, 1fr); }
          .empty-flow-steps { grid-template-columns: repeat(2, 1fr); }
          .empty-scn-grid { grid-template-columns: 1fr; }
          .empty-hero-title { font-size: 21px; }
        }
      `}</style>
    </div>
  )
}
