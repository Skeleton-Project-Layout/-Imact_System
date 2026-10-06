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
  ChevronDown
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
import { ClipboardCheck, FileCheck2, UserCheck2, ShieldAlert, Clock as ClockIcon } from 'lucide-react';

export default function AdminShell() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [govDropdownOpen, setGovDropdownOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [overviewData, setOverviewData] = useState(null);
  const [explainModalOpen, setExplainModalOpen] = useState(false);
  const [explainTargetCode, setExplainTargetCode] = useState('EDU-01');
  const [traceDrawerOpen, setTraceDrawerOpen] = useState(false);
  const [traceTarget, setTraceTarget] = useState({ deliveryPointCode: 'EDU-01' });

  // Load district overview
  useEffect(() => {
    async function fetchOverview() {
      try {
        const token = localStorage.getItem('abhisaran_token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch('/api/v1/admin/overview', { headers });
        if (res.ok) {
          const data = await res.json();
          setOverviewData(data);
        }
      } catch (err) {
        console.warn('Overview API fetch failed:', err);
      }
    }
    fetchOverview();
  }, []);

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
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pilot District</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ffffff' }}>Ranchi Rural (Jharkhand)</div>
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
                  padding: '0.875rem 0',
                  border: 'none',
                  background: 'transparent',
                  color: isActive ? 'var(--brand-primary)' : 'var(--text-muted)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.875rem',
                  borderBottom: isActive ? '2px solid var(--brand-primary)' : '2px solid transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Governance & Audit Secondary Dropdown (keeps main strip clean) */}
        <div style={{ position: 'relative' }}>
          {(() => {
            const govTabs = [
              { id: 'briefings', label: 'Exit Briefings', icon: ClipboardCheck },
              { id: 'corrections', label: 'Factual Corrections', icon: FileCheck2 },
              { id: 'reviewer', label: 'Reviewer Pack', icon: UserCheck2 },
              { id: 'privacy', label: 'Privacy Incidents (2h Clock)', icon: ShieldAlert },
              { id: 'retention', label: 'Retention & Audit (30d)', icon: ClockIcon }
            ];
            const isGovActive = govTabs.some(t => t.id === activeTab);
            const currentGov = govTabs.find(t => t.id === activeTab);
            return (
              <>
                <button
                  type="button"
                  onClick={() => setGovDropdownOpen(!govDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.4rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    background: isGovActive ? 'rgba(59, 130, 246, 0.15)' : 'rgba(30, 41, 59, 0.5)',
                    color: isGovActive ? 'var(--brand-primary)' : 'var(--text-muted)',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  <ShieldCheck size={14} />
                  <span>{isGovActive ? `Governance: ${currentGov?.label}` : 'Governance & Compliance'}</span>
                  <ChevronDown size={14} />
                </button>

                {govDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 0.4rem)',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-lg)',
                      minWidth: '230px',
                      zIndex: 50,
                      padding: '0.35rem 0'
                    }}
                  >
                    {govTabs.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSelected = activeTab === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setActiveTab(sub.id);
                            setGovDropdownOpen(false);
                          }}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            padding: '0.55rem 1rem',
                            background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                            color: isSelected ? 'var(--brand-primary)' : 'var(--text-main)',
                            border: 'none',
                            textAlign: 'left',
                            fontSize: '0.8125rem',
                            cursor: 'pointer'
                          }}
                        >
                          <SubIcon size={14} />
                          {sub.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </nav>

      {/* Main Container */}
      <main style={{ padding: '1.5rem', maxWidth: '1280px', margin: '0 auto', width: '100%', flex: 1 }}>
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
          />
        )}

        {/* Tab 2: Convergence Heatmap */}
        {activeTab === 'heatmap' && (
          <ConvergenceHeatmap
            onSelectCell={(cell) => handleOpenTraceDrawer({ deliveryPointCode: 'EDU-01', ...cell })}
          />
        )}

        {/* Tab 3: Impact Passports */}
        {activeTab === 'passports' && (
          <ImpactPassportList
            onExplainScore={handleOpenExplainScore}
            onOpenTrace={handleOpenTraceDrawer}
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
          <strong>AEHT §15.1 Limitations:</strong> Small purposive pilot; not a district-wide statistical census. ACS is an operational continuity indicator, not a causal impact claim. Evidence reflects the designated field assessment window. Individual outcomes cannot be inferred from anonymized token records.
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
