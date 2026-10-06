import React from 'react';
import { Building2, ShieldCheck, AlertCircle, HelpCircle, Layers, ArrowRight } from 'lucide-react';

export default function DistrictOverview({ overviewData, onExplainScore, onNavigateTab }) {
  const data = overviewData || {
    totalDeliveryPoints: 10,
    schoolsCount: 4,
    healthCount: 3,
    anganwadiCount: 3,
    aggregateAcsScore: 56.0,
    aggregateBand: 'AMBER',
    applicableComponentsSummary: '3/4 Verified Touchpoints',
    zeroPiiIncidentsCount: 0,
    verifiedArtifactsCount: 32,
    activePriorityActionsCount: 4,
    highPriorityActionsCount: 3
  };

  const getBandBadgeClass = (band) => {
    switch (band) {
      case 'GREEN': return 'badge badge-green';
      case 'AMBER': return 'badge badge-amber';
      case 'RED': return 'badge badge-red';
      default: return 'badge badge-neutral';
    }
  };

  return (
    <div>
      {/* 4 Executive Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Card 1: Sample Size */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
              Pilot Sample Touchpoints
            </span>
            <Building2 size={18} style={{ color: 'var(--brand-primary)' }} />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 700, color: '#ffffff' }}>
            {data.totalDeliveryPoints} / 10
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
            {data.schoolsCount} Schools • {data.healthCount} PHC/Health • {data.anganwadiCount} Anganwadi
          </div>
        </div>

        {/* Card 2: Aggregate Continuity Score */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
              District Aggregate ACS
            </span>
            <button
              type="button"
              onClick={onExplainScore}
              style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.75rem' }}
            >
              <HelpCircle size={15} /> Explain
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.85rem', fontWeight: 700, color: data.aggregateBand === 'GREEN' ? '#34d399' : data.aggregateBand === 'AMBER' ? '#fbbf24' : '#f87171' }}>
              {data.aggregateAcsScore.toFixed(1)} / 100
            </span>
            <span className={getBandBadgeClass(data.aggregateBand)}>
              {data.aggregateBand}
            </span>
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
            Rebased: {data.applicableComponentsSummary}
          </div>
        </div>

        {/* Card 3: Zero-PII Compliance & Coverage */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
              Privacy & Audit Assurance
            </span>
            <ShieldCheck size={18} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 700, color: '#34d399' }}>
            100% Zero-PII
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
            {data.zeroPiiIncidentsCount} Privacy Incidents • {data.verifiedArtifactsCount} Verified Artifacts
          </div>
        </div>

        {/* Card 4: Priority Action Register */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
              Priority Remediation Actions
            </span>
            <AlertCircle size={18} style={{ color: '#f59e0b' }} />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 700, color: '#ffffff' }}>
            {data.highPriorityActionsCount} High Priority
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
            Urgency × Reach prioritized • Feasibility flagged
          </div>
        </div>
      </div>

      {/* Decision-Support Routing Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div
          onClick={() => onNavigateTab('heatmap')}
          style={{
            background: 'rgba(30, 41, 59, 0.4)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            cursor: 'pointer',
            transition: 'border-color 0.2s',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.25rem' }}>
              Convergence Heat-map (System Diagnosis)
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
              Pinpoints systemic disconnects across School ↔ Health ↔ Anganwadi hand-off loops without punitive school rankings.
            </p>
          </div>
          <ArrowRight size={20} style={{ color: 'var(--brand-primary)', flexShrink: 0, marginLeft: '1rem' }} />
        </div>

        <div
          onClick={() => onNavigateTab('passports')}
          style={{
            background: 'rgba(30, 41, 59, 0.4)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            cursor: 'pointer',
            transition: 'border-color 0.2s',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.25rem' }}>
              Impact Passports (Annexure A Format)
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
              Examine detailed strengths, verified gaps, and actionable triggers for all 10 pilot delivery points.
            </p>
          </div>
          <ArrowRight size={20} style={{ color: 'var(--brand-primary)', flexShrink: 0, marginLeft: '1rem' }} />
        </div>
      </div>
    </div>
  );
}
