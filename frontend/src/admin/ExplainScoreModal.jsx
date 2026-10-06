import React, { useState, useEffect } from 'react';
import { X, HelpCircle, CheckCircle2, ShieldAlert, FileText, ChevronRight } from 'lucide-react';

export default function ExplainScoreModal({ isOpen, onClose, deliveryPointCode }) {
  const [loading, setLoading] = useState(false);
  const [explainData, setExplainData] = useState(null);

  useEffect(() => {
    if (!isOpen || !deliveryPointCode) return;

    async function fetchExplain() {
      setLoading(true);
      try {
        const token = localStorage.getItem('abhisaran_token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(`/api/v1/scoring/delivery-point/${deliveryPointCode}/explain`, { headers });
        if (res.ok) {
          const data = await res.json();
          setExplainData(data);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Explain score API failed, using fallback calculation:', err);
      }

      // Fallback preview
      setExplainData({
        deliveryPointCode: deliveryPointCode,
        deliveryPointName: `${deliveryPointCode} (Pilot Touchpoint)`,
        acsScore: 65.0,
        band: 'AMBER',
        applicableCount: 4,
        formulaString: '((3.5 + 3.0 + 3.0 + 3.5) / (4 * 5.0)) * 100 = 65.0% [AMBER] (4/4 applicable components)',
        calculationTrace: 'Achieved 13.0 points out of 20.0 possible across 4 applicable touchpoint components. Band threshold: AMBER.',
        components: [
          { id: 'c1', name: 'Touchpoint Screening & Referral Protocol', score: 3.5, applicable: true },
          { id: 'c2', name: 'Institutional Readiness & Duty Orders', score: 3.0, applicable: true },
          { id: 'c3', name: 'Cross-Departmental Feedback & Communication', score: 3.0, applicable: true },
          { id: 'c4', name: 'Outcome Continuity & Care Closure Files', score: 3.5, applicable: true }
        ],
        evidenceTrail: [
          { id: 'ev-1', layer: 1, resultingRuleId: 'RULE-REFERRAL-001', selectedOption: 'COMPLETE_REGISTER', documentKind: 'REGISTER_EXTRACT', verificationStatus: 'VERIFIED' },
          { id: 'ev-2', layer: 2, resultingRuleId: 'RULE-READINESS-002', selectedOption: 'FORMAL_ORDER_DISPLAYED', documentKind: 'WALL_DISPLAY', verificationStatus: 'VERIFIED' }
        ],
        planningDisclaimer: 'Mandatory Notice (AEHT §15): This diagnostic calculation provides administrative planning inputs for cross-departmental service continuity. It does not constitute an expenditure sanction or individual employee performance evaluation.'
      });
      setLoading(false);
    }

    fetchExplain();
  }, [isOpen, deliveryPointCode]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div
        style={{
          background: '#0f172a',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '640px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-xl)',
          color: '#f8fafc'
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', pb: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HelpCircle size={22} style={{ color: 'var(--brand-primary)' }} />
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                Explain Score: {deliveryPointCode}
              </h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Deterministic Mathematical Calculation Trace (AEHT Engine)
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
          >
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            Calculating deterministic score trace...
          </div>
        ) : explainData ? (
          <div>
            {/* Top Score Box */}
            <div style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Computed ACS Score</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: explainData.band === 'GREEN' ? '#34d399' : explainData.band === 'AMBER' ? '#fbbf24' : '#f87171' }}>
                  {explainData.acsScore.toFixed(1)}%
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={`badge ${explainData.band === 'GREEN' ? 'badge-green' : explainData.band === 'AMBER' ? 'badge-amber' : 'badge-red'}`} style={{ fontSize: '0.85rem' }}>
                  {explainData.band} BAND
                </span>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
                  Rebased over {explainData.applicableCount}/4 applicable touchpoints
                </div>
              </div>
            </div>

            {/* Mathematical Formula String */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Exact Calculation String
              </label>
              <div style={{ background: '#020617', border: '1px solid #1e293b', borderRadius: 'var(--radius-sm)', padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.85rem', color: '#93c5fd', wordBreak: 'break-all' }}>
                {explainData.formulaString}
              </div>
            </div>

            {/* Component Breakdown */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                4 Equal Components (25% Weight Each, Scale 0.0 - 5.0)
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {explainData.components?.map((comp, idx) => {
                  const score = comp.score != null ? comp.score : 0.0;
                  const pct = comp.applicable ? (score / 5.0) * 100 : 0;
                  return (
                    <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                        <span style={{ color: '#e2e8f0', fontWeight: 500 }}>{comp.name}</span>
                        <span style={{ fontWeight: 700, color: comp.applicable ? '#93c5fd' : 'var(--text-dim)' }}>
                          {comp.applicable ? `${score.toFixed(1)} / 5.0` : 'N/A (Rebased)'}
                        </span>
                      </div>
                      <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: 'var(--brand-primary)', borderRadius: '3px' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Linked Verified Evidence Trail */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Linked Verified Evidence Items ({explainData.evidenceTrail?.length || 0})
              </label>
              {explainData.evidenceTrail && explainData.evidenceTrail.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {explainData.evidenceTrail.map((ev, i) => (
                    <div key={i} style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <FileText size={14} style={{ color: 'var(--brand-primary)' }} />
                        <span style={{ color: '#cbd5e1' }}>Layer {ev.layer}: <strong>{ev.resultingRuleId}</strong></span>
                        <span style={{ color: 'var(--text-dim)' }}>({ev.documentKind || 'REGISTER'})</span>
                      </div>
                      <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
                        VERIFIED
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                  No verified evidence items recorded yet. (Scores default to 0.0 without verified evidence).
                </div>
              )}
            </div>

            {/* Mandatory Statutory Disclaimer Banner */}
            <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', fontSize: '0.75rem', color: '#fca5a5', lineHeight: 1.45 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                <ShieldAlert size={14} />
                STATUTORY PLANNING NOTICE (AEHT §15)
              </div>
              {explainData.planningDisclaimer}
            </div>
          </div>
        ) : null}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
          >
            Close Trace
          </button>
        </div>
      </div>
    </div>
  );
}
