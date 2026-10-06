import React from 'react';
import { Building2, ShieldCheck, AlertCircle, HelpCircle, ArrowRight, MapPin, CheckCircle2 } from 'lucide-react';

export default function DistrictOverview({
  overviewData,
  onExplainScore,
  onNavigateTab,
  selectedDistrict,
  availableDistricts = [],
  onSelectDistrict
}) {
  const currentDist = selectedDistrict || {
    id: 'ranchi',
    name: 'Ranchi Rural',
    fullName: 'Ranchi Rural (South Chotanagpur)',
    state: 'Jharkhand',
    division: 'South Chotanagpur Division',
    badgeText: 'Phase 1 Active Pilot',
    badgeClass: 'badge-blue',
    nodalOfficer: 'Shri R. K. Soren, District Nodal Officer',
    dmTitle: 'District Magistrate / Deputy Commissioner',
    sampleSize: 10,
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

  const data = {
    totalDeliveryPoints: currentDist.sampleSize || 10,
    schoolsCount: currentDist.schoolsCount || 4,
    healthCount: currentDist.healthCount || 3,
    anganwadiCount: currentDist.anganwadiCount || 3,
    aggregateAcsScore: currentDist.aggregateAcsScore ?? (overviewData?.aggregateAcsScore || 56.0),
    aggregateBand: currentDist.aggregateBand || (overviewData?.aggregateBand || 'AMBER'),
    applicableComponentsSummary: currentDist.applicableComponentsSummary || '3/4 Verified Touchpoints',
    zeroPiiIncidentsCount: currentDist.zeroPiiIncidentsCount ?? (overviewData?.zeroPiiIncidentsCount || 0),
    verifiedArtifactsCount: currentDist.verifiedArtifactsCount ?? (overviewData?.verifiedArtifactsCount || 32),
    activePriorityActionsCount: currentDist.activePriorityActionsCount ?? (overviewData?.activePriorityActionsCount || 4),
    highPriorityActionsCount: currentDist.highPriorityActionsCount ?? (overviewData?.highPriorityActionsCount || 3)
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
      {/* Active Monitored District Banner with In-line Switcher */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.85))',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
              flexShrink: 0
            }}
          >
            <MapPin size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                Active Monitored District
              </span>
              <span className={`badge ${currentDist.badgeClass || 'badge-blue'}`} style={{ fontSize: '0.7rem' }}>
                {currentDist.badgeText || 'Phase 1 Active Pilot'}
              </span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#f8fafc', margin: '0.2rem 0' }}>
              {currentDist.name} ({currentDist.state})
            </h2>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-dim)' }}>
              {currentDist.division} • Coordinator: <strong style={{ color: '#cbd5e1' }}>{currentDist.nodalOfficer}</strong>
            </div>
          </div>
        </div>

        {/* District Switcher Selector */}
        {availableDistricts && availableDistricts.length > 0 && onSelectDistrict && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <label htmlFor="district-monitor-select" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              Switch District:
            </label>
            <select
              id="district-monitor-select"
              value={currentDist.id}
              onChange={(e) => onSelectDistrict(e.target.value)}
              style={{
                padding: '0.55rem 0.9rem',
                background: '#0f172a',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                borderRadius: 'var(--radius-md)',
                color: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {availableDistricts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} {d.status === 'PILOT_ACTIVE' ? '★ (Pilot)' : ''}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 4 Executive Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Card 1: Sample Size */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
              Sample Touchpoints ({currentDist.name})
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
              {currentDist.name} Aggregate ACS
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
              Convergence Heat-map ({currentDist.name})
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
              Pinpoints systemic disconnects across School ↔ Health ↔ Anganwadi hand-off loops without punitive rankings.
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
              Examine detailed strengths, verified gaps, and actionable triggers for all {data.totalDeliveryPoints} delivery points in {currentDist.name}.
            </p>
          </div>
          <ArrowRight size={20} style={{ color: 'var(--brand-primary)', flexShrink: 0, marginLeft: '1rem' }} />
        </div>
      </div>
    </div>
  );
}
