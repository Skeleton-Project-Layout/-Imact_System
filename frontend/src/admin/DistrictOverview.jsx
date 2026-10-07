import React from 'react';
import { Building2, ShieldCheck, AlertCircle, HelpCircle, ArrowRight, MapPin, CheckCircle2, CheckSquare, Plus } from 'lucide-react';

export default function DistrictOverview({
  overviewData,
  onExplainScore,
  onNavigateTab,
  selectedDistrict,
  availableDistricts = [],
  onSelectDistrict,
  onAddDistrict
}) {
  const currentDist = selectedDistrict || {
    id: 'east-khasi-hills',
    name: 'East Khasi Hills',
    fullName: 'East Khasi Hills District (Shillong)',
    state: 'Meghalaya',
    division: 'Khasi Hills Division',
    badgeText: 'Active Pilot District',
    badgeClass: 'badge-blue',
    nodalOfficer: 'District Nodal Officer (Health & Social Welfare Convergence), East Khasi Hills',
    dmTitle: 'Deputy Commissioner & District Magistrate, East Khasi Hills District, Shillong',
    sampleSize: 10,
    schoolsCount: 4,
    healthCount: 3,
    anganwadiCount: 3,
    aggregateAcsScore: null,
    aggregateBand: 'NOT_ASSESSED',
    applicableComponentsSummary: '0/4 Touchpoints Assessed',
    zeroPiiIncidentsCount: 0,
    verifiedArtifactsCount: 0,
    activePriorityActionsCount: 0,
    highPriorityActionsCount: 0
  };

  const data = {
    totalDeliveryPoints: currentDist.sampleSize || 10,
    schoolsCount: currentDist.schoolsCount || 4,
    healthCount: currentDist.healthCount || 3,
    anganwadiCount: currentDist.anganwadiCount || 3,
    aggregateAcsScore: currentDist.aggregateAcsScore ?? (overviewData?.aggregateAcsScore ?? null),
    aggregateBand: currentDist.aggregateBand || (overviewData?.aggregateBand || 'NOT_ASSESSED'),
    applicableComponentsSummary: currentDist.applicableComponentsSummary || '0/4 Touchpoints Assessed',
    zeroPiiIncidentsCount: currentDist.zeroPiiIncidentsCount ?? (overviewData?.zeroPiiIncidentsCount || 0),
    verifiedArtifactsCount: currentDist.verifiedArtifactsCount ?? (overviewData?.verifiedArtifactsCount || 0),
    activePriorityActionsCount: currentDist.activePriorityActionsCount ?? (overviewData?.activePriorityActionsCount || 0),
    highPriorityActionsCount: currentDist.highPriorityActionsCount ?? (overviewData?.highPriorityActionsCount || 0)
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
        className="card-lift"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-sm)',
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
              background: 'var(--brand-primary-light)',
              border: '1px solid var(--band-blue-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--brand-primary)',
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
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-heading)', margin: '0.2rem 0' }}>
              {currentDist.name} ({currentDist.state})
            </h2>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-dim)' }}>
              {currentDist.division} • Coordinator: <strong style={{ color: 'var(--text-main)' }}>{currentDist.nodalOfficer}</strong>
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
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {availableDistricts.map((d) => (
                <option key={d.id} value={d.id} style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>
                  {d.name} {d.status === 'PILOT_ACTIVE' ? '★ (Pilot)' : ''}
                </option>
              ))}
            </select>
            {onAddDistrict && (
              <button
                type="button"
                onClick={onAddDistrict}
                className="btn btn-secondary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.55rem 0.85rem',
                  fontSize: '0.8125rem',
                  borderColor: 'var(--band-blue-border)',
                  color: 'var(--brand-primary)',
                  background: 'var(--brand-primary-light)'
                }}
              >
                <Plus size={14} />
                <span>+ Add District</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* 4 Executive Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Card 1: Sample Size */}
        <div className="card-lift" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
              Sample Touchpoints ({currentDist.name})
            </span>
            <Building2 size={18} style={{ color: 'var(--brand-primary)' }} />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--text-heading)' }}>
            {data.totalDeliveryPoints} / 10
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
            {data.schoolsCount} Schools • {data.healthCount} PHC/Health • {data.anganwadiCount} Anganwadi
          </div>
        </div>

        {/* Card 2: Aggregate Continuity Score */}
        <div className="card-lift" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
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
            <span style={{ fontSize: '1.85rem', fontWeight: 700, color: data.aggregateBand === 'GREEN' ? 'var(--band-green-text)' : data.aggregateBand === 'AMBER' ? 'var(--band-amber-text)' : data.aggregateBand === 'RED' ? 'var(--band-red-text)' : 'var(--text-heading)' }}>
              {data.aggregateAcsScore !== null && data.aggregateAcsScore !== undefined ? `${data.aggregateAcsScore.toFixed(1)} / 100` : '—'}
            </span>
            <span className={getBandBadgeClass(data.aggregateBand)}>
              {data.aggregateBand === 'NOT_ASSESSED' ? 'NOT ASSESSED' : data.aggregateBand}
            </span>
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
            Rebased: {data.applicableComponentsSummary}
          </div>
        </div>

        {/* Card 3: Zero-PII Compliance & Coverage */}
        <div
          className="card-lift"
          onClick={() => onNavigateTab && onNavigateTab('verification')}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-sm)',
            cursor: onNavigateTab ? 'pointer' : 'default'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
              Privacy & Audit Assurance
            </span>
            <ShieldCheck size={18} style={{ color: 'var(--band-green-text)' }} />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--band-green-text)' }}>
            100% Zero-PII
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', marginTop: '0.35rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{data.zeroPiiIncidentsCount} Incidents • {data.verifiedArtifactsCount} Verified Docs</span>
            <span style={{ color: 'var(--brand-primary)', fontWeight: 600, fontSize: '0.75rem' }}>Verify Desk →</span>
          </div>
        </div>

        {/* Card 4: Priority Action Register */}
        <div className="card-lift" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
              Priority Remediation Actions
            </span>
            <AlertCircle size={18} style={{ color: 'var(--brand-accent)' }} />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--text-heading)' }}>
            {data.highPriorityActionsCount} High Priority
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
            Urgency × Reach prioritized • Feasibility flagged
          </div>
        </div>
      </div>

      {/* Decision-Support Routing Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div
          className="card-lift"
          onClick={() => onNavigateTab('heatmap')}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-heading)', marginBottom: '0.25rem' }}>
              Convergence Heat-map ({currentDist.name})
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
              Pinpoints systemic disconnects across School ↔ Health ↔ Anganwadi hand-off loops without punitive rankings.
            </p>
          </div>
          <ArrowRight size={20} style={{ color: 'var(--brand-primary)', flexShrink: 0, marginLeft: '1rem' }} />
        </div>

        <div
          className="card-lift"
          onClick={() => onNavigateTab('passports')}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-heading)', marginBottom: '0.25rem' }}>
              Impact Passports (Annexure A Format)
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
              Examine detailed strengths, verified gaps, and actionable triggers for all {data.totalDeliveryPoints} delivery points in {currentDist.name}.
            </p>
          </div>
          <ArrowRight size={20} style={{ color: 'var(--brand-primary)', flexShrink: 0, marginLeft: '1rem' }} />
        </div>

        <div
          className="card-lift"
          onClick={() => onNavigateTab('verification')}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--band-blue-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
              <CheckSquare size={16} style={{ color: 'var(--brand-primary)' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-heading)', margin: 0 }}>
                Verify Evidence & Scans (§17 B)
              </h3>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
              Audit multi-file field scans, registers, and certificates submitted from /source before score calculation.
            </p>
          </div>
          <ArrowRight size={20} style={{ color: 'var(--brand-primary)', flexShrink: 0, marginLeft: '1rem' }} />
        </div>
      </div>
    </div>
  );
}
