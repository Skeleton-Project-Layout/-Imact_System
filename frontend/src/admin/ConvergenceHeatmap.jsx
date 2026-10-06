import React from 'react';
import { Info, ExternalLink } from 'lucide-react';

export default function ConvergenceHeatmap({ onSelectCell }) {
  const pathways = [
    {
      id: 'ANGANWADI_TO_SCHOOL',
      name: 'Preschool (WCD) → Primary School Hand-off',
      description: 'Preschool child development profiles, nutrition continuity, and formal enrollment transition.',
      scores: [
        { layer: 1, score: 4.2, label: '4.2 Strong', band: 'GREEN', ruleId: 'RULE-REFERRAL-001' },
        { layer: 2, score: 3.5, label: '3.5 Partial', band: 'AMBER', ruleId: 'RULE-READINESS-002' },
        { layer: 3, score: 4.0, label: '4.0 Strong', band: 'GREEN', ruleId: 'RULE-TIME-003' },
        { layer: 4, score: 2.2, label: '2.2 Gap', band: 'AMBER', ruleId: 'RULE-CLOSURE-004' },
        { layer: 5, score: 4.5, label: '4.5 Strong', band: 'GREEN', ruleId: 'RULE-SUSTAIN-005' }
      ]
    },
    {
      id: 'SCHOOL_TO_HEALTH',
      name: 'School Health Screening → PHC / RBSK Referral Loop',
      description: 'Screening register documentation, secondary diagnostic hand-off, and 14-day counter-referrals.',
      scores: [
        { layer: 1, score: 3.0, label: '3.0 Partial', band: 'AMBER', ruleId: 'RULE-REFERRAL-001' },
        { layer: 2, score: 1.8, label: '1.8 Weak', band: 'RED', ruleId: 'RULE-READINESS-002' },
        { layer: 3, score: 2.5, label: '2.5 Gap', band: 'AMBER', ruleId: 'RULE-TIME-003' },
        { layer: 4, score: 1.5, label: '1.5 Weak', band: 'RED', ruleId: 'RULE-CLOSURE-004' },
        { layer: 5, score: 3.2, label: '3.2 Partial', band: 'AMBER', ruleId: 'RULE-SUSTAIN-005' }
      ]
    },
    {
      id: 'HEALTH_TO_WCD',
      name: 'PHC / RBSK Care → Anganwadi Nutrition Rehabilitation',
      description: 'MTC/NRC counter-referral notes, severe malnutrition follow-up, and joint VHSND reviews.',
      scores: [
        { layer: 1, score: 4.0, label: '4.0 Strong', band: 'GREEN', ruleId: 'RULE-REFERRAL-001' },
        { layer: 2, score: 4.2, label: '4.2 Strong', band: 'GREEN', ruleId: 'RULE-READINESS-002' },
        { layer: 3, score: 3.0, label: '3.0 Partial', band: 'AMBER', ruleId: 'RULE-TIME-003' },
        { layer: 4, score: 3.5, label: '3.5 Partial', band: 'AMBER', ruleId: 'RULE-CLOSURE-004' },
        { layer: 5, score: 4.1, label: '4.1 Strong', band: 'GREEN', ruleId: 'RULE-SUSTAIN-005' }
      ]
    }
  ];

  const layerHeaders = [
    { num: 1, title: 'Layer 1: Touchpoint' },
    { num: 2, title: 'Layer 2: Readiness' },
    { num: 3, title: 'Layer 3: Alignment' },
    { num: 4, title: 'Layer 4: Outcome' },
    { num: 5, title: 'Layer 5: Sustainability' }
  ];

  const getCellBg = (band) => {
    switch (band) {
      case 'GREEN': return 'rgba(16, 185, 129, 0.15)';
      case 'AMBER': return 'rgba(245, 158, 11, 0.15)';
      case 'RED': return 'rgba(239, 68, 68, 0.18)';
      default: return 'var(--bg-secondary)';
    }
  };

  const getCellBorder = (band) => {
    switch (band) {
      case 'GREEN': return '1px solid rgba(16, 185, 129, 0.4)';
      case 'AMBER': return '1px solid rgba(245, 158, 11, 0.4)';
      case 'RED': return '1px solid rgba(239, 68, 68, 0.5)';
      default: return '1px solid var(--border-color)';
    }
  };

  const getCellTextColor = (band) => {
    switch (band) {
      case 'GREEN': return '#34d399';
      case 'AMBER': return '#fbbf24';
      case 'RED': return '#f87171';
      default: return '#cbd5e1';
    }
  };

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem' }}>
            Cross-Sector Convergence Heat-map
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
            Systemic diagnosis across inter-departmental hand-off pathways (Click any cell to inspect verifiable evidence trace).
          </p>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#34d399' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#10b981' }}></span> High Continuity (≥70%)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#fbbf24' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#f59e0b' }}></span> Vulnerable / Partial (40–69%)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#f87171' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#ef4444' }}></span> Critical Discontinuity (&lt;40%)
          </span>
        </div>
      </div>

      {/* Heatmap Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0.5rem', fontSize: '0.85rem' }}>
          <thead>
            <tr>
              <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, width: '32%' }}>
                Convergence Pathway
              </th>
              {layerHeaders.map((l) => (
                <th key={l.num} style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {l.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pathways.map((p) => (
              <tr key={p.id}>
                <td style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', verticalAlign: 'middle' }}>
                  <div style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '0.2rem' }}>{p.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', lineHeight: 1.35 }}>{p.description}</div>
                </td>
                {p.scores.map((s) => (
                  <td
                    key={s.layer}
                    onClick={() => onSelectCell && onSelectCell({ pathway: p, layerScore: s })}
                    style={{
                      background: getCellBg(s.band),
                      border: getCellBorder(s.band),
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'center',
                      padding: '1rem 0.5rem',
                      cursor: 'pointer',
                      transition: 'transform 0.15s, box-shadow 0.15s',
                      verticalAlign: 'middle'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.03)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: getCellTextColor(s.band) }}>
                      {s.label}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
                      <span>{s.ruleId}</span>
                      <ExternalLink size={10} />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '1rem', background: 'rgba(30, 41, 59, 0.4)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Info size={15} style={{ color: 'var(--brand-primary)', flexShrink: 0 }} />
        <span><strong>AEHT Non-Punitive Assurance:</strong> The convergence heat-map measures system hand-offs between departments. It explicitly prohibits and avoids ranking individual schools, clinics, or field staff against one another.</span>
      </div>
    </div>
  );
}
