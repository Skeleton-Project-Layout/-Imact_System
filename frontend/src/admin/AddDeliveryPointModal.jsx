import React, { useState } from 'react';
import { Building2, X, Plus, ShieldCheck, MapPin, School, HeartPulse, Baby } from 'lucide-react';
import { MEGHALAYA_DISTRICTS } from '../data/districts';

export default function AddDeliveryPointModal({
  isOpen,
  onClose,
  currentDistrictId = 'east-khasi-hills',
  availableDistricts = MEGHALAYA_DISTRICTS,
  onDeliveryPointCreated = () => {}
}) {
  const [districtId, setDistrictId] = useState(currentDistrictId);
  const [sector, setSector] = useState('EDUCATION'); // EDUCATION, WCD_ANGANWADI, HEALTH_RBSK
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState('CONVERGENCE_INTENSIVE');
  const [blockLocality, setBlockLocality] = useState('');
  const [headDesignation, setHeadDesignation] = useState('Headmaster / Principal');
  const [selectionRationale, setSelectionRationale] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Auto-suggest code when sector or district changes
  const handleSectorChange = (newSector) => {
    setSector(newSector);
    const prefix = districtId === 'east-khasi-hills' ? 'EKH' : 'DP';
    const sectorCode = newSector === 'EDUCATION' ? 'EDU' : (newSector === 'WCD_ANGANWADI' ? 'WCD' : 'HLT');
    const randomSuffix = Math.floor(Math.random() * 90) + 10;
    if (!code || code.includes('-')) {
      setCode(`${prefix}-${sectorCode}-${randomSuffix}`);
    }
    if (newSector === 'EDUCATION') {
      setHeadDesignation('Headmaster / Principal');
    } else if (newSector === 'WCD_ANGANWADI') {
      setHeadDesignation('Anganwadi Worker (AWW)');
    } else {
      setHeadDesignation('Medical Officer In-Charge (MOIC)');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Institution name is required.');
      return;
    }

    const finalCode = (code.trim() || `${sector === 'EDUCATION' ? 'EDU' : sector === 'WCD_ANGANWADI' ? 'WCD' : 'HLT'}-${Date.now().toString().slice(-4)}`).toUpperCase();

    const newDp = {
      code: finalCode,
      name: name.trim(),
      sector,
      category,
      blockLocality: blockLocality.trim() || 'District Pilot Zone',
      headDesignation: headDesignation.trim(),
      selectionRationale: selectionRationale.trim() || 'Designated pilot delivery point for inter-departmental continuity scan.',
      districtId,
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    try {
      const stored = localStorage.getItem('abhisaran_custom_delivery_points');
      const existing = stored ? JSON.parse(stored) : [];
      existing.push(newDp);
      localStorage.setItem('abhisaran_custom_delivery_points', JSON.stringify(existing));
      window.dispatchEvent(new CustomEvent('abhisaran_delivery_points_updated', { detail: newDp }));
    } catch (err) {
      console.warn('Failed to save custom delivery point to storage', err);
    }

    onDeliveryPointCreated(newDp);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(5px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        style={{
          background: 'var(--bg-card)',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          borderRadius: 'var(--radius-lg, 12px)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'var(--brand-primary-light)',
                color: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Building2 size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-heading)' }}>
                Add Delivery Point (School / Anganwadi / PHC)
              </h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Onboard a new institutional touchpoint to East Khasi Hills scanning registry
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', overflowY: 'auto' }}>
          {errorMsg && (
            <div style={{ background: 'var(--band-red-bg)', border: '1px solid var(--band-red-border)', color: 'var(--band-red-text)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', marginBottom: '1rem' }}>
              {errorMsg}
            </div>
          )}

          {/* Sector Selection Cards */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Select Institution Type / Sector
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
              {[
                { id: 'EDUCATION', label: 'School', sub: 'Education', icon: School, color: '#2563eb' },
                { id: 'WCD_ANGANWADI', label: 'Anganwadi', sub: 'WCD / AWC', icon: Baby, color: '#ec4899' },
                { id: 'HEALTH_RBSK', label: 'PHC / Health', sub: 'Health / RBSK', icon: HeartPulse, color: '#10b981' }
              ].map((s) => {
                const Icon = s.icon;
                const isSelected = sector === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSectorChange(s.id)}
                    style={{
                      padding: '0.75rem 0.5rem',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? `2px solid ${s.color}` : '1px solid var(--border-color)',
                      background: isSelected ? 'var(--brand-primary-light)' : 'var(--bg-secondary)',
                      color: isSelected ? s.color : 'var(--text-main)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.35rem',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <Icon size={20} style={{ color: isSelected ? s.color : 'var(--text-muted)' }} />
                    <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>{s.label}</span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>{s.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Institution Name */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
              Institution Name *
            </label>
            <input
              type="text"
              required
              placeholder={sector === 'EDUCATION' ? 'e.g. Mawphlang Government Secondary School' : sector === 'WCD_ANGANWADI' ? 'e.g. Mylliem Mawiong Anganwadi Centre 2' : 'e.g. Pomlum Primary Health Centre'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              style={{ width: '100%', fontSize: '0.875rem' }}
            />
          </div>

          {/* Delivery Point Code & District */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                Delivery Point Code
              </label>
              <input
                type="text"
                placeholder="e.g. EKH-EDU-05"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="input-field"
                style={{ width: '100%', fontSize: '0.875rem', fontFamily: 'monospace', fontWeight: 700 }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                District
              </label>
              <select
                value={districtId}
                onChange={(e) => setDistrictId(e.target.value)}
                className="select-field"
                style={{ width: '100%', fontSize: '0.85rem' }}
              >
                {availableDistricts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.state})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category & Block */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                Pilot Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="select-field"
                style={{ width: '100%', fontSize: '0.85rem' }}
              >
                <option value="CONVERGENCE_INTENSIVE">Convergence Intensive</option>
                <option value="DIFFICULT_ACCESS">Difficult Access (Remote/Hilly)</option>
                <option value="LOW_PERFORMING">Low Performing / Follow-up Gaps</option>
                <option value="HIGH_PERFORMING">High Performing / Model Touchpoint</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                Block / Locality
              </label>
              <input
                type="text"
                placeholder="e.g. Mawphlang Block"
                value={blockLocality}
                onChange={(e) => setBlockLocality(e.target.value)}
                className="input-field"
                style={{ width: '100%', fontSize: '0.875rem' }}
              />
            </div>
          </div>

          {/* Head Designation */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
              Institution Leadership / Designation
            </label>
            <input
              type="text"
              placeholder="e.g. Headmaster, Anganwadi Worker, Medical Officer"
              value={headDesignation}
              onChange={(e) => setHeadDesignation(e.target.value)}
              className="input-field"
              style={{ width: '100%', fontSize: '0.875rem' }}
            />
          </div>

          {/* Selection Rationale */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
              Selection Rationale (AEHT Purposive Pilot)
            </label>
            <textarea
              rows={2}
              placeholder="Rationale for inclusion in district service continuity scan..."
              value={selectionRationale}
              onChange={(e) => setSelectionRationale(e.target.value)}
              className="input-field"
              style={{ width: '100%', fontSize: '0.82rem' }}
            />
          </div>

          {/* Zero-PII Notice */}
          <div style={{ background: 'var(--band-green-bg)', border: '1px solid var(--band-green-border)', borderRadius: 'var(--radius-md)', padding: '0.65rem 0.85rem', marginBottom: '1.25rem', fontSize: '0.75rem', color: 'var(--band-green-text)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck size={16} style={{ flexShrink: 0 }} />
            <span>Zero-PII Compliance: Delivery point registration operates exclusively at the institutional facility level without individual beneficiary identifiers.</span>
          </div>

          {/* Footer Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Plus size={16} /> Save Delivery Point
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
