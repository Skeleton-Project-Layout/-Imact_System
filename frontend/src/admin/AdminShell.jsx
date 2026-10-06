import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  LayoutDashboard,
  Grid3X3,
  FileText,
  AlertCircle,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  RefreshCw,
  Building2
} from 'lucide-react';

export default function AdminShell() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analyzing, setAnalyzing] = useState(false);

  const handleRunAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => setAnalyzing(false), 800);
  };

  return (
    <div className="app-container">
      {/* Top Government Official Bar */}
      <header className="top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
            <ArrowLeft size={18} />
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '4px', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#ffffff', fontSize: '1rem' }}>
              A
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--brand-accent)', fontWeight: 600, letterSpacing: '0.05em' }}>
                ARYABHATA EDUCATIONAL & HEALTH TRUST (AEHT)
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
      <nav style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', padding: '0 1.5rem', display: 'flex', gap: '1.5rem', overflowX: 'auto' }}>
        {[
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'heatmap', label: 'Convergence Heat-map', icon: Grid3X3 },
          { id: 'passports', label: 'Impact Passports', icon: FileText },
          { id: 'gaps', label: 'Verified Gaps', icon: AlertCircle },
          { id: 'privacy', label: 'Privacy Incidents (Zero-PII)', icon: ShieldCheck }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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
      </nav>

      {/* Main Container */}
      <main style={{ padding: '1.5rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        {/* Statutory Action Brief Disclaimer Banner */}
        <div className="disclaimer-banner">
          <strong>Planning Boundary Notice:</strong> Action briefs and continuity scores are decision-support planning inputs only. They do not authorize expenditure, constitute sanctions, guarantee funding, or rank individual institutions or personnel. District officials retain final prioritization authority.
        </div>

        {/* Executive Overview Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Delivery Points Sample</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#ffffff' }}>10 / 10</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>4 Schools • 3 PHC/Health • 3 Anganwadi</div>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Aryabhata Continuity Score</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--band-amber-text)' }}>56 / 100</span>
              <span className="badge badge-amber">Amber (3/4 Applicable)</span>
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>Rebased across 3 verified components</div>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Evidence Coverage Status</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--band-green-text)' }}>100% Zero-PII</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>0 PII incidents • 32 verified artifacts</div>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Priority Action Register</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#ffffff' }}>4 High Priority</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>Urgency × Reach evaluated • Feasibility flagged</div>
          </div>
        </div>

        {/* Convergence Heat-map Placeholder Frame */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Cross-Sector Convergence Heat-map</h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Aggregate continuity across School ↔ Health/RBSK ↔ Anganwadi hand-off pathways.</p>
            </div>
            <span className="badge badge-neutral">Aggregate / Non-Punitive</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem' }}>Pathway</th>
                  <th style={{ padding: '0.75rem' }}>Layer 1: Experience</th>
                  <th style={{ padding: '0.75rem' }}>Layer 2: Readiness</th>
                  <th style={{ padding: '0.75rem' }}>Layer 3: Alignment</th>
                  <th style={{ padding: '0.75rem' }}>Layer 4: Outcome</th>
                  <th style={{ padding: '0.75rem' }}>Layer 5: Continuity</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>Preschool → Primary School</td>
                  <td style={{ padding: '0.75rem' }}><span className="badge badge-green">4/5 Strong</span></td>
                  <td style={{ padding: '0.75rem' }}><span className="badge badge-amber">3/5 Partial</span></td>
                  <td style={{ padding: '0.75rem' }}><span className="badge badge-green">4/5 Strong</span></td>
                  <td style={{ padding: '0.75rem' }}><span className="badge badge-amber">2/5 Gap</span></td>
                  <td style={{ padding: '0.75rem' }}><span className="badge badge-green">4/5 Strong</span></td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>School Screening → PHC/RBSK</td>
                  <td style={{ padding: '0.75rem' }}><span className="badge badge-amber">3/5 Partial</span></td>
                  <td style={{ padding: '0.75rem' }}><span className="badge badge-red">1/5 Weak</span></td>
                  <td style={{ padding: '0.75rem' }}><span className="badge badge-amber">2/5 Gap</span></td>
                  <td style={{ padding: '0.75rem' }}><span className="badge badge-red">1/5 Weak</span></td>
                  <td style={{ padding: '0.75rem' }}><span className="badge badge-amber">3/5 Partial</span></td>
                </tr>
                <tr>
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>Health PHC → Anganwadi Nutrition</td>
                  <td style={{ padding: '0.75rem' }}><span className="badge badge-green">4/5 Strong</span></td>
                  <td style={{ padding: '0.75rem' }}><span className="badge badge-green">4/5 Strong</span></td>
                  <td style={{ padding: '0.75rem' }}><span className="badge badge-amber">3/5 Partial</span></td>
                  <td style={{ padding: '0.75rem' }}><span className="badge badge-amber">3/5 Partial</span></td>
                  <td style={{ padding: '0.75rem' }}><span className="badge badge-green">4/5 Strong</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Limitations Note (AEHT §15.1) */}
        <footer style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', fontSize: '0.75rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>
          <strong>AEHT §15.1 Limitations:</strong> Small purposive pilot; not a district-wide statistical census. ACS is an operational continuity indicator, not a causal impact claim. Evidence reflects the designated field assessment window. Individual outcomes cannot be inferred from anonymized token records.
        </footer>
      </main>
    </div>
  );
}
