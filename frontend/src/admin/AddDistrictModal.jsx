import React, { useState } from 'react';
import { X, Building2, MapPin, Check, Plus, AlertCircle } from 'lucide-react';

export default function AddDistrictModal({ isOpen, onClose, onDistrictCreated }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [division, setDivision] = useState('North Chotanagpur Division');
  const [nodalOfficer, setNodalOfficer] = useState('');
  const [dmTitle, setDmTitle] = useState('');
  const [status, setStatus] = useState('EXPANSION_READY');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('District name is required.');
      return;
    }

    const cleanName = name.trim();
    const id = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const autoCode = code.trim() || `JH-${cleanName.substring(0, 3).toUpperCase()}`;
    const prefix = cleanName.substring(0, 3).toUpperCase();

    // Auto-generate AEHT §2.2 Purposive Sample Delivery Points (10 points: 4 Education, 3 Health, 3 WCD)
    const deliveryPoints = [
      { code: `${prefix}-EDU-01`, name: `${prefix}-EDU-01 (Primary School, Block Central)`, sector: 'EDUCATION', category: 'DIFFICULT_ACCESS' },
      { code: `${prefix}-EDU-02`, name: `${prefix}-EDU-02 (Middle School, Rural West)`, sector: 'EDUCATION', category: 'LOW_PERFORMING' },
      { code: `${prefix}-EDU-03`, name: `${prefix}-EDU-03 (High School, Semi-Urban)`, sector: 'EDUCATION', category: 'HIGH_PERFORMING' },
      { code: `${prefix}-EDU-04`, name: `${prefix}-EDU-04 (KGBV Residential Girls School)`, sector: 'EDUCATION', category: 'CONVERGENCE_INTENSIVE' },
      { code: `${prefix}-HLT-01`, name: `${prefix}-HLT-01 (Primary Health Centre / PHC North)`, sector: 'HEALTH_RBSK', category: 'DIFFICULT_ACCESS' },
      { code: `${prefix}-HLT-02`, name: `${prefix}-HLT-02 (Community Health Centre / CHC East)`, sector: 'HEALTH_RBSK', category: 'HIGH_PERFORMING' },
      { code: `${prefix}-HLT-03`, name: `${prefix}-HLT-03 (Sub-Divisional Referral Hospital)`, sector: 'HEALTH_RBSK', category: 'LOW_PERFORMING' },
      { code: `${prefix}-WCD-01`, name: `${prefix}-WCD-01 (Anganwadi Centre 01, Rural)`, sector: 'WCD_ANGANWADI', category: 'DIFFICULT_ACCESS' },
      { code: `${prefix}-WCD-02`, name: `${prefix}-WCD-02 (Anganwadi Centre 02, Semi-Urban)`, sector: 'WCD_ANGANWADI', category: 'LOW_PERFORMING' },
      { code: `${prefix}-WCD-03`, name: `${prefix}-WCD-03 (Model Anganwadi Centre 03)`, sector: 'WCD_ANGANWADI', category: 'HIGH_PERFORMING' }
    ];

    const badgeMap = {
      PILOT_ACTIVE: { text: 'Phase 1 Active Pilot', badgeClass: 'badge-blue' },
      ASPIRATIONAL_ACTIVE: { text: 'Aspirational District', badgeClass: 'badge-amber' },
      EXPANSION_READY: { text: 'Expansion Node', badgeClass: 'badge-blue' }
    };

    const newDistrict = {
      id,
      code: autoCode,
      name: cleanName,
      fullName: `${cleanName} (${division})`,
      state: 'Jharkhand',
      division,
      status,
      badgeText: badgeMap[status]?.text || 'Expansion Node',
      badgeClass: badgeMap[status]?.badgeClass || 'badge-blue',
      nodalOfficer: nodalOfficer.trim() || `Shri/Smt. In-Charge, District Nodal Officer, ${cleanName}`,
      dmTitle: dmTitle.trim() || `Deputy Commissioner / District Magistrate, ${cleanName}`,
      sampleSize: 10,
      schoolsCount: 4,
      healthCount: 3,
      anganwadiCount: 3,
      aggregateAcsScore: 50.0,
      aggregateBand: 'AMBER',
      applicableComponentsSummary: '3/4 Verified Touchpoints',
      zeroPiiIncidentsCount: 0,
      verifiedArtifactsCount: 0,
      activePriorityActionsCount: 3,
      highPriorityActionsCount: 2,
      deliveryPoints
    };

    onDistrictCreated(newDistrict);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '1rem'
      }}
    >
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '540px',
          width: '100%',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(30, 41, 59, 0.4)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Plus size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
                Onboard New District
              </h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                AEHT District Programme Continuity Scan Registry
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {error && (
            <div
              style={{
                padding: '0.75rem',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--radius-sm)',
                color: '#fca5a5',
                fontSize: '0.8125rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                District Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Hazaribagh, Deoghar, Palamu"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                  if (!code && e.target.value.length >= 3) {
                    setCode(`JH-${e.target.value.substring(0, 3).toUpperCase()}`);
                  }
                }}
                required
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#ffffff',
                  fontSize: '0.875rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                District Code
              </label>
              <input
                type="text"
                placeholder="JH-HAZ"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#ffffff',
                  fontSize: '0.875rem'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
              Administrative Division
            </label>
            <select
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                background: '#0f172a',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: '#ffffff',
                fontSize: '0.875rem'
              }}
            >
              <option value="North Chotanagpur Division">North Chotanagpur Division</option>
              <option value="South Chotanagpur Division">South Chotanagpur Division</option>
              <option value="Santhal Pargana Division">Santhal Pargana Division</option>
              <option value="Kolhan Division">Kolhan Division</option>
              <option value="Palamu Division">Palamu Division</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                District Nodal Officer (DNO)
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. S. K. Verma, DNO"
                value={nodalOfficer}
                onChange={(e) => setNodalOfficer(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#ffffff',
                  fontSize: '0.875rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                Pilot Rollout Category
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  background: '#0f172a',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#ffffff',
                  fontSize: '0.875rem'
                }}
              >
                <option value="EXPANSION_READY">Expansion Node (Ready)</option>
                <option value="ASPIRATIONAL_ACTIVE">Aspirational District (NITI Aayog)</option>
                <option value="PILOT_ACTIVE">Phase 1 Active Pilot</option>
              </select>
            </div>
          </div>

          {/* AEHT §2.2 Auto-Provisioning Notice */}
          <div
            style={{
              padding: '0.75rem',
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              color: 'var(--text-dim)',
              marginBottom: '1.5rem',
              lineHeight: 1.4
            }}
          >
            <strong style={{ color: '#38bdf8' }}>AEHT §2.2 Purposive Sample Auto-Provisioning:</strong>{' '}
            Upon saving, the platform will automatically configure a 10-point cross-sectional cluster (4 Schools, 3 Health/RBSK Centres, 3 Anganwadis) ensuring immediate readiness for `/source` field evidence collection and `/admin` convergence scan.
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ padding: '0.55rem 1rem', fontSize: '0.875rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '0.55rem 1.25rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Check size={16} />
              <span>Save & Monitor District</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
