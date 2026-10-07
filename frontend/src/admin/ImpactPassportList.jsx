import React, { useState, useEffect } from 'react';
import ImpactPassportCard from './ImpactPassportCard';
import { Filter, FileSpreadsheet, ShieldCheck, AlertCircle } from 'lucide-react';

export default function ImpactPassportList({ selectedDistrict, onExplainScore, onOpenTrace }) {
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [passports, setPassports] = useState([]);

  useEffect(() => {
    async function loadPassports() {
      try {
        const token = localStorage.getItem('abhisaran_token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const districtName = selectedDistrict?.name || 'East Khasi Hills';
        const res = await fetch(`/api/v1/admin/passports?district=${encodeURIComponent(districtName)}`, { headers });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setPassports(data);
            return;
          }
        }
      } catch (err) {
        console.warn('API passport load failed, building delivery point passports:', err);
      }
      setPassports([]);
    }
    loadPassports();
  }, [selectedDistrict]);

  const displayPassports = React.useMemo(() => {
    if (passports.length > 0) return passports;

    // Build clean unassessed passports from active district's delivery points
    if (selectedDistrict?.deliveryPoints && selectedDistrict.deliveryPoints.length > 0) {
      return selectedDistrict.deliveryPoints.map((dp) => {
        return {
          deliveryPointCode: dp.code,
          name: dp.name,
          sectorId: dp.sector,
          category: dp.category || 'REGULAR',
          selectionRationale: `Purposive touchpoint in ${selectedDistrict.name} (${selectedDistrict.state}) selected for cross-departmental service continuity scan.`,
          acsScore: null,
          band: 'NOT_ASSESSED',
          applicableComponentsCount: 0,
          verifiedStrengths: [],
          verifiedGaps: [],
          activeFlagsCount: 0
        };
      });
    }

    return [];
  }, [passports, selectedDistrict]);

  const filtered = sectorFilter === 'ALL'
    ? displayPassports
    : displayPassports.filter((p) => p.sectorId === sectorFilter);

  const distName = selectedDistrict?.name || 'East Khasi Hills';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.25rem' }}>
            Delivery Point Impact Passports — {distName} (Annexure A Standard)
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
            Purposive sample for {distName} across Education, Health/RBSK, and Anganwadi sectors without punitive rankings.
          </p>
        </div>

        {/* Sector Filter Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
          {[
            { id: 'ALL', label: `All Sample Points (${displayPassports.length})` },
            { id: 'EDUCATION', label: 'Schools' },
            { id: 'HEALTH_RBSK', label: 'Health' },
            { id: 'WCD_ANGANWADI', label: 'Anganwadi' }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setSectorFilter(btn.id)}
              style={{
                fontSize: '0.75rem',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: sectorFilter === btn.id ? 'var(--bg-card)' : 'transparent',
                color: sectorFilter === btn.id ? 'var(--brand-primary)' : 'var(--text-muted)',
                fontWeight: sectorFilter === btn.id ? 700 : 500,
                boxShadow: sectorFilter === btn.id ? 'var(--shadow-xs)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div
          style={{
            padding: '3.5rem 1.5rem',
            textAlign: 'center',
            background: 'var(--bg-card)',
            border: '1px dashed var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            color: 'var(--text-muted)'
          }}
        >
          <AlertCircle size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.6 }} />
          <h3 style={{ margin: '0 0 0.4rem', color: 'var(--text-heading)' }}>No delivery points found</h3>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>Select a sector filter or add delivery points to the district configuration.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '1.25rem'
          }}
        >
          {filtered.map((passport) => (
            <ImpactPassportCard
              key={passport.deliveryPointCode}
              passport={passport}
              onExplainScore={onExplainScore}
              onOpenTrace={onOpenTrace}
            />
          ))}
        </div>
      )}

      {/* AEHT §15 Statutory Planning Notice Footer */}
      <div
        className="disclaimer-banner"
        style={{
          marginTop: '2rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem'
        }}
      >
        <ShieldCheck size={18} style={{ color: 'var(--brand-accent)', flexShrink: 0, marginTop: '0.15rem' }} />
        <div style={{ fontSize: '0.75rem', lineHeight: 1.5 }}>
          <strong>Statutory Governance Notice (AEHT §15.1):</strong> Delivery Point Impact Passports provide administrative diagnostic guidance for cross-departmental service continuity in {distName}. Continuity scores reflect verified evidence and do not imply employee appraisal, disciplinary ranking, or expenditure sanction.
        </div>
      </div>
    </div>
  );
}
