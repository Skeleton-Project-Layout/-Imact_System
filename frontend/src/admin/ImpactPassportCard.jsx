import React from 'react';
import { Building2, CheckCircle2, AlertOctagon, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function ImpactPassportCard({ passport, onExplainScore, onOpenTrace }) {
  if (!passport) return null;

  const getBandBadgeClass = (band) => {
    switch (band) {
      case 'GREEN': return 'badge badge-green';
      case 'AMBER': return 'badge badge-amber';
      case 'RED': return 'badge badge-red';
      default: return 'badge badge-neutral';
    }
  };

  const getSectorBadge = (sectorId) => {
    switch (sectorId) {
      case 'EDUCATION': return { label: 'Education (School)', color: '#60a5fa' };
      case 'HEALTH_RBSK': return { label: 'Health / RBSK', color: '#34d399' };
      case 'WCD_ANGANWADI': return { label: 'WCD (Anganwadi)', color: '#f472b6' };
      default: return { label: sectorId, color: '#94a3b8' };
    }
  };

  const sectorMeta = getSectorBadge(passport.sectorId);

  return (
    <div
      className="card-lift"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <div>
        {/* Header Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                {passport.deliveryPointCode}
              </span>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  padding: '0.15rem 0.45rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--brand-primary-light)',
                  color: 'var(--brand-primary)',
                  border: '1px solid var(--band-blue-border)'
                }}
              >
                {sectorMeta.label}
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Category: <strong style={{ color: 'var(--text-main)' }}>{passport.category}</strong>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-heading)' }}>
                {passport.acsScore?.toFixed(1) || '0.0'}%
              </span>
              <span className={getBandBadgeClass(passport.band)}>
                {passport.band}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onExplainScore && onExplainScore(passport.deliveryPointCode)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--brand-primary)',
                fontSize: '0.7rem',
                cursor: 'pointer',
                padding: 0,
                marginTop: '0.2rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.2rem',
                fontWeight: 600
              }}
            >
              <HelpCircle size={12} /> Explain Score
            </button>
          </div>
        </div>

        {/* Selection Rationale */}
        <div style={{ background: 'var(--bg-card-subtle)', border: '1px solid var(--border-color)', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.4 }}>
          <strong>Sample Rationale:</strong> {passport.selectionRationale}
        </div>

        {/* Verified Strengths */}
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--band-green-text)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
            <CheckCircle2 size={14} /> Verified Continuity Strengths
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.75rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
            {passport.verifiedStrengths?.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>

        {/* Verified Gaps */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--band-red-text)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
            <AlertOctagon size={14} /> Verified Continuity Gaps
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.75rem', color: 'var(--band-red-text)', lineHeight: 1.45 }}>
            {passport.verifiedGaps?.map((g, i) => (
              <li key={i}>{g}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
          {passport.activeFlagsCount} Active Flag(s)
        </span>
        <button
          type="button"
          onClick={() => onOpenTrace && onOpenTrace({ deliveryPointCode: passport.deliveryPointCode })}
          className="btn btn-secondary"
          style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
        >
          Inspect Evidence Trace <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}
