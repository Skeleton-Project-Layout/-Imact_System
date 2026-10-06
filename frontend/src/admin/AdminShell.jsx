import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  LayoutDashboard,
  Grid3X3,
  FileText,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  Building2,
  ChevronDown,
  MapPin,
  ClipboardCheck,
  FileCheck2,
  UserCheck2,
  ShieldAlert,
  Clock as ClockIcon
} from 'lucide-react';
import DistrictOverview from './DistrictOverview';
import ConvergenceHeatmap from './ConvergenceHeatmap';
import ImpactPassportList from './ImpactPassportList';
import ExplainScoreModal from './ExplainScoreModal';
import TraceDrawer from './TraceDrawer';
import ExitBriefingsView from './ExitBriefingsView';
import FactualCorrectionsView from './FactualCorrectionsView';
import ReviewerPackView from './ReviewerPackView';
import PrivacyIncidentsView from './PrivacyIncidentsView';
import RetentionAndAuditView from './RetentionAndAuditView';
import { JHARKHAND_DISTRICTS, getDistrictById } from '../data/districts';

export default function AdminShell() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [govDropdownOpen, setGovDropdownOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [availableDistricts, setAvailableDistricts] = useState(JHARKHAND_DISTRICTS);
  
  // Monitored District selection state with localStorage persistence
  const [selectedDistrictId, setSelectedDistrictId] = useState(() => {
    return localStorage.getItem('abhisaran_monitored_district') || 'ranchi';
  });

  const selectedDistrict = getDistrictById(selectedDistrictId);

  const [overviewData, setOverviewData] = useState(null);
  const [explainModalOpen, setExplainModalOpen] = useState(false);
  const [explainTargetCode, setExplainTargetCode] = useState('EDU-01');
  const [traceDrawerOpen, setTraceDrawerOpen] = useState(false);
  const [traceTarget, setTraceTarget] = useState({ deliveryPointCode: 'EDU-01' });

  // Fetch available districts from API if online
  useEffect(() => {
    async function fetchDistricts() {
      try {
        const token = localStorage.getItem('abhisaran_token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch('/api/v1/admin/districts', { headers });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            // Merge with local rich metadata
            const merged = JHARKHAND_DISTRICTS.map((local) => {
              const apiMatch = data.find((d) => d.id === local.id || d.name === local.name);
              return apiMatch ? { ...local, ...apiMatch } : local;
            });
            setAvailableDistricts(merged);
          }
        }
      } catch (err) {
        console.warn('Districts API fetch failed, using local registry:', err);
      }
    }
    fetchDistricts();
  }, []);

  // Load district overview for selected district
  useEffect(() => {
    async function fetchOverview() {
      try {
        const token = localStorage.getItem('abhisaran_token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(`/api/v1/admin/overview?districtName=${encodeURIComponent(selectedDistrict.name)}`, { headers });
        if (res.ok) {
          const data = await res.json();
          setOverviewData(data);
        }
      } catch (err) {
        console.warn('Overview API fetch failed:', err);
      }
    }
    fetchOverview();
  }, [selectedDistrict.name]);

  const handleDistrictChange = (newDistrictId) => {
    setSelectedDistrictId(newDistrictId);
    localStorage.setItem('abhisaran_monitored_district', newDistrictId);
  };

  const handleRunAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
    }, 800);
  };

  const handleOpenExplainScore = (dpCode) => {
    setExplainTargetCode(dpCode || 'EDU-01');
    setExplainModalOpen(true);
  };

  const handleOpenTraceDrawer = (target) => {
    setTraceTarget(target || { deliveryPointCode: 'EDU-01' });
    setTraceDrawerOpen(true);
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top AEHT Trust Decision Support Bar */}
      <header className="top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
            <ArrowLeft size={18} />
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '36px', borderRadius: '6px', background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#ffffff', fontSize: '0.8rem', border: '1px solid rgba(255, 255, 255, 0.15)', letterSpacing: '0.04em' }}>
              AEHT
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--brand-accent)', fontWeight: 600, letterSpacing: '0.05em' }}>
                ARYABHATA EDUCATIONAL & HEALTH TRUST • Vidya · Arogya · Samriddhi
              </div>
              <h1 style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                ABHISARAN — District Programme Continuity Scan (Admin Panel)
              </h1>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Interactive District Monitor Option */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              background: 'rgba(30, 41, 59, 0.7)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '0.35rem 0.75rem'
            }}
          >
            <MapPin size={18} style={{ color: '#38bdf8', flexShrink: 0 }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                Monitoring District
              </div>
              <select
                aria-label="Select District to Monitor"
                value={selectedDistrictId}
                onChange={(e) => handleDistrictChange(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  outline: 'none',
                  padding: 0
                }}
              >
                {availableDistricts.map((d) => (
                  <option key={d.id} value={d.id} style={{ background: '#0f172a', color: '#ffffff' }}>
                    {d.name} ({d.state}) {d.status === 'PILOT_ACTIVE' ? '★ Pilot' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRunAnalysis}
            className="btn btn-primary"
            disabled={analyzing}
            style={{ fontSize: '0.8125rem', padding: '0.45rem 0.9rem' }}
          >
            <RefreshCw size={14} className={analyzing ? 'spin' : ''} />
            {analyzing ? 'Computing...' : 'Run Analysis'}
          </button>
        </div>
      </header>

      {/* Navigation Sub-bar */}
      <nav style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', padding: '0 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {[
            { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
            { id: 'heatmap', label: 'Convergence Heat-map', icon: Grid3X3 },
            { id: 'passports', label: 'Impact Passports (Annexure A)', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setGovDropdownOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 0',
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '2px solid var(--brand-primary)' : '2px solid transparent',
                  color: isActive ? 'var(--brand-primary)' : 'var(--text-muted)',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Governance & Compliance Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setGovDropdownOpen(!govDropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.85rem',
              background: govDropdownOpen || ['briefings', 'corrections', 'reviewer', 'privacy', 'retention'].includes(activeTab) ? 'rgba(59, 130, 246, 0.15)' : 'rgba(30, 41, 59, 0.5)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              color: ['briefings', 'corrections', 'reviewer', 'privacy', 'retention'].includes(activeTab) ? 'var(--brand-primary)' : 'var(--text-muted)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            <ShieldCheck size={14} style={{ color: 'var(--brand-accent)' }} />
            <span>Governance & Compliance</span>
            <ChevronDown size={14} style={{ transform: govDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
          </button>

          {govDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '0.35rem',
                width: '230px',
                background: '#0f172a',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-xl)',
                zIndex: 50,
                overflow: 'hidden'
              }}
            >
              {[
                { id: 'briefings', label: 'Exit Briefings (§14.1)', icon: ClipboardCheck },
                { id: 'corrections', label: 'Factual Corrections', icon: FileCheck2 },
                { id: 'reviewer', label: 'Reviewer Pack (COI)', icon: UserCheck2 },
                { id: 'privacy', label: 'Privacy Incidents (Zero-PII)', icon: ShieldAlert },
                { id: 'retention', label: 'Retention & Audit (30-Day)', icon: ClockIcon }
              ].map((sub) => {
                const SubIcon = sub.icon;
                const isSubActive = activeTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setActiveTab(sub.id);
                      setGovDropdownOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      width: '100%',
                      padding: '0.65rem 0.9rem',
                      background: isSubActive ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                      border: 'none',
                      borderLeft: isSubActive ? '3px solid var(--brand-primary)' : '3px solid transparent',
                      color: isSubActive ? '#ffffff' : '#cbd5e1',
                      fontSize: '0.8125rem',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <SubIcon size={14} style={{ color: isSubActive ? 'var(--brand-primary)' : 'var(--text-dim)' }} />
                    {sub.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main style={{ padding: '1.5rem', flex: 1 }}>
        {/* Statutory Action Brief Disclaimer Banner */}
        <div className="disclaimer-banner" style={{ marginBottom: '1.5rem' }}>
          <strong>Planning Boundary Notice (AEHT §15):</strong> Action briefs and continuity scores are decision-support planning inputs only. They do not authorize expenditure, constitute sanctions, guarantee funding, or rank individual institutions or personnel. District officials retain final prioritization authority.
        </div>

        {/* Tab 1: Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <DistrictOverview
            overviewData={overviewData}
            onExplainScore={() => handleOpenExplainScore('EDU-01')}
            onNavigateTab={setActiveTab}
            selectedDistrict={selectedDistrict}
            availableDistricts={availableDistricts}
            onSelectDistrict={handleDistrictChange}
          />
        )}

        {/* Tab 2: Convergence Heatmap */}
        {activeTab === 'heatmap' && (
          <ConvergenceHeatmap
            onSelectCell={(cell) => handleOpenTraceDrawer({ deliveryPointCode: 'EDU-01', ...cell })}
            selectedDistrict={selectedDistrict}
          />
        )}

        {/* Tab 3: Impact Passports */}
        {activeTab === 'passports' && (
          <ImpactPassportList
            onExplainScore={handleOpenExplainScore}
            onOpenTrace={handleOpenTraceDrawer}
            selectedDistrict={selectedDistrict}
          />
        )}

        {/* Tab 4: Exit Briefings */}
        {activeTab === 'briefings' && (
          <ExitBriefingsView />
        )}

        {/* Tab 5: Factual Corrections */}
        {activeTab === 'corrections' && (
          <FactualCorrectionsView />
        )}

        {/* Tab 6: Reviewer Pack */}
        {activeTab === 'reviewer' && (
          <ReviewerPackView />
        )}

        {/* Tab 7: Privacy Incidents */}
        {activeTab === 'privacy' && (
          <PrivacyIncidentsView />
        )}

        {/* Tab 8: Retention & Audit */}
        {activeTab === 'retention' && (
          <RetentionAndAuditView />
        )}

        {/* Footer Limitations Note (AEHT §15.1) */}
        <footer style={{ borderTop: '1px solid var(--border-color)', marginTop: '2rem', paddingTop: '1rem', fontSize: '0.75rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>
          <strong>AEHT §15.1 Limitations:</strong> Small purposive pilot in {selectedDistrict.name}; not a district-wide statistical census. ACS is an operational continuity indicator, not a causal impact claim. Evidence reflects the designated field assessment window. Individual outcomes cannot be inferred from anonymized token records.
        </footer>
      </main>

      {/* Explain Score Modal */}
      <ExplainScoreModal
        isOpen={explainModalOpen}
        onClose={() => setExplainModalOpen(false)}
        deliveryPointCode={explainTargetCode}
      />

      {/* Drill-down Trace Drawer */}
      <TraceDrawer
        isOpen={traceDrawerOpen}
        onClose={() => setTraceDrawerOpen(false)}
        traceTarget={traceTarget}
      />
    </div>
  );
}
