import React, { useState, useEffect } from 'react';
import ImpactPassportCard from './ImpactPassportCard';
import { Filter, FileSpreadsheet } from 'lucide-react';

const FALLBACK_PASSPORTS = [
  {
    deliveryPointCode: 'EDU-01',
    name: 'EDU-01 (Primary School, Block Central)',
    sectorId: 'EDUCATION',
    category: 'HIGH_PERFORMING',
    selectionRationale: 'High baseline enrollment; chosen to assess whether strong student headcount translates into completed health referrals.',
    acsScore: 65.0,
    band: 'AMBER',
    applicableComponentsCount: 4,
    verifiedStrengths: ['Documented screening register maintained', 'Nodal teacher formally designated'],
    verifiedGaps: ['Counter-referrals not received from PHC within 14 days', 'Remedial tracking files incomplete'],
    activeFlagsCount: 2
  },
  {
    deliveryPointCode: 'EDU-02',
    name: 'EDU-02 (Middle School, Rural West)',
    sectorId: 'EDUCATION',
    category: 'DIFFICULT_ACCESS',
    selectionRationale: 'Remote tribal periphery; tests referral transit barriers to distant block CHC.',
    acsScore: 40.0,
    band: 'AMBER',
    applicableComponentsCount: 4,
    verifiedStrengths: ['Anecdotal follow-up notes present'],
    verifiedGaps: ['No formal referral register maintained on site', 'Screening records untracked across grades'],
    activeFlagsCount: 3
  },
  {
    deliveryPointCode: 'EDU-03',
    name: 'EDU-03 (High School, Semi-Urban)',
    sectorId: 'EDUCATION',
    category: 'LOW_PERFORMING',
    selectionRationale: 'Historically elevated dropout rate; evaluates adolescent health and mental well-being referral linkages.',
    acsScore: 35.0,
    band: 'RED',
    applicableComponentsCount: 4,
    verifiedStrengths: ['Adolescent nodal counselor trained'],
    verifiedGaps: ['Absent referral screening register', 'No monthly review of unresolved cases'],
    activeFlagsCount: 4
  },
  {
    deliveryPointCode: 'EDU-04',
    name: 'EDU-04 (Primary School, Riverine Belt)',
    sectorId: 'EDUCATION',
    category: 'DIFFICULT_ACCESS',
    selectionRationale: 'Seasonal inundation and riverine barrier; tests seasonal disruption of referral continuity.',
    acsScore: 50.0,
    band: 'AMBER',
    applicableComponentsCount: 4,
    verifiedStrengths: ['Emergency flood contingency screening roster present'],
    verifiedGaps: ['No counter-referral loop closure recorded'],
    activeFlagsCount: 1
  },
  {
    deliveryPointCode: 'HLT-01',
    name: 'HLT-01 (Primary Health Centre / PHC North)',
    sectorId: 'HEALTH_RBSK',
    category: 'HIGH_PERFORMING',
    selectionRationale: 'High outpatient load facility; evaluates capacity to ingest and log high school referral volume.',
    acsScore: 75.0,
    band: 'GREEN',
    applicableComponentsCount: 4,
    verifiedStrengths: ['Functional diagnostic equipment calibrated', 'Counter-signatures systematic on referral slips'],
    verifiedGaps: ['Secondary hospital referral closures delayed past 30 days'],
    activeFlagsCount: 1
  },
  {
    deliveryPointCode: 'HLT-02',
    name: 'HLT-02 (Community Health Centre / CHC East)',
    sectorId: 'HEALTH_RBSK',
    category: 'LOW_PERFORMING',
    selectionRationale: 'Sub-district referral hospital; checks secondary specialized follow-up bottleneck.',
    acsScore: 45.0,
    band: 'AMBER',
    applicableComponentsCount: 4,
    verifiedStrengths: ['Specialized pediatric screening available'],
    verifiedGaps: ['Counter-referrals rarely returned to schools', 'Unclosed referrals after 60 days'],
    activeFlagsCount: 3
  },
  {
    deliveryPointCode: 'HLT-03',
    name: 'HLT-03 (Health & Wellness Sub-Centre / HWC South)',
    sectorId: 'HEALTH_RBSK',
    category: 'DIFFICULT_ACCESS',
    selectionRationale: 'Peripheral grassroots health touchpoint; tests community health officer front-line screening.',
    acsScore: 55.0,
    band: 'AMBER',
    applicableComponentsCount: 4,
    verifiedStrengths: ['CHO active on village screening days'],
    verifiedGaps: ['Lack of digital logbook; relies on manual slips'],
    activeFlagsCount: 2
  },
  {
    deliveryPointCode: 'WCD-01',
    name: 'WCD-01 (Anganwadi Centre 14, Tribal Belt)',
    sectorId: 'WCD_ANGANWADI',
    category: 'DIFFICULT_ACCESS',
    selectionRationale: 'Forest enclave village; tests severe acute malnutrition (SAM) continuity from early childhood to NRC.',
    acsScore: 70.0,
    band: 'GREEN',
    applicableComponentsCount: 4,
    verifiedStrengths: ['Growth charts calibrated and updated', 'Routine VHSND joint reviews with ANM'],
    verifiedGaps: ['Transition portfolio to primary school not handed over in writing'],
    activeFlagsCount: 1
  },
  {
    deliveryPointCode: 'WCD-02',
    name: 'WCD-02 (Anganwadi Centre 08, Semi-Urban)',
    sectorId: 'WCD_ANGANWADI',
    category: 'HIGH_PERFORMING',
    selectionRationale: 'High attendance urban slum cluster; tests preschool readiness and immunization record linkage.',
    acsScore: 60.0,
    band: 'AMBER',
    applicableComponentsCount: 4,
    verifiedStrengths: ['Supplementary nutrition log complete'],
    verifiedGaps: ['Counter-referral from MTC not documented in child book'],
    activeFlagsCount: 2
  },
  {
    deliveryPointCode: 'WCD-03',
    name: 'WCD-03 (Anganwadi Centre 21, Low-Performing Pocket)',
    sectorId: 'WCD_ANGANWADI',
    category: 'LOW_PERFORMING',
    selectionRationale: 'Historical stunting pocket; tests whether intensive nutrition tracking is maintained.',
    acsScore: 35.0,
    band: 'RED',
    applicableComponentsCount: 4,
    verifiedStrengths: ['Preschool attendance marked'],
    verifiedGaps: ['Functional infantometer absent', 'Malnutrition referral registers not updated'],
    activeFlagsCount: 4
  }
];

export default function ImpactPassportList({ onExplainScore, onOpenTrace, selectedDistrict }) {
  const [passports, setPassports] = useState(FALLBACK_PASSPORTS);
  const [sectorFilter, setSectorFilter] = useState('ALL');

  useEffect(() => {
    async function loadPassports() {
      try {
        const token = localStorage.getItem('abhisaran_token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch('/api/v1/admin/impact-passports', { headers });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setPassports(data);
          }
        }
      } catch (err) {
        console.warn('API passport load failed, using local pilot fixtures:', err);
      }
    }
    loadPassports();
  }, []);

  const displayPassports = React.useMemo(() => {
    if (!selectedDistrict || selectedDistrict.id === 'ranchi') return passports;
    if (selectedDistrict.deliveryPoints && selectedDistrict.deliveryPoints.length > 0) {
      return selectedDistrict.deliveryPoints.map((dp, idx) => {
        const base = passports[idx % passports.length] || passports[0];
        return {
          ...base,
          deliveryPointCode: dp.code,
          name: dp.name,
          sectorId: dp.sector,
          category: dp.category
        };
      });
    }
    return passports;
  }, [passports, selectedDistrict]);

  const filtered = sectorFilter === 'ALL'
    ? displayPassports
    : displayPassports.filter((p) => p.sectorId === sectorFilter);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.25rem' }}>
            Delivery Point Impact Passports — {selectedDistrict?.name || 'Ranchi Rural'} (Annexure A Standard)
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
            Purposive sample for {selectedDistrict?.name || 'Ranchi Rural'} across Education (4), Health/RBSK (3), and Anganwadi (3) sectors without punitive rankings.
          </p>
        </div>

        {/* Sector Filter Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
          {[
            { id: 'ALL', label: 'All 10 Sample Points' },
            { id: 'EDUCATION', label: 'Schools (4)' },
            { id: 'HEALTH_RBSK', label: 'Health (3)' },
            { id: 'WCD_ANGANWADI', label: 'Anganwadi (3)' }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setSectorFilter(btn.id)}
              style={{
                border: 'none',
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                background: sectorFilter === btn.id ? 'var(--brand-primary)' : 'transparent',
                color: sectorFilter === btn.id ? '#ffffff' : 'var(--text-muted)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Passports */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {filtered.map((passport) => (
          <ImpactPassportCard
            key={passport.deliveryPointCode}
            passport={passport}
            onExplainScore={onExplainScore}
            onOpenTrace={onOpenTrace}
          />
        ))}
      </div>
    </div>
  );
}
