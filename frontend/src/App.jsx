import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import SourceShell from './source/SourceShell';
import AdminShell from './admin/AdminShell';
import ThemeToggle from './ThemeToggle';
import { ShieldCheck, Smartphone, LayoutDashboard, ArrowRight, Activity, CheckCircle2 } from 'lucide-react';

function LandingPage() {
  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="civic-ribbon" />

      {/* Top Header Bar with AEHT Branding & Theme Toggle */}
      <header className="top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '40px',
            height: '36px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            color: '#ffffff',
            fontSize: '0.82rem',
            letterSpacing: '0.04em',
            boxShadow: '0 2px 4px rgba(37, 99, 235, 0.25)'
          }}>
            AEHT
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--brand-accent)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Aryabhata Educational & Health Trust
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-heading)' }}>
              ABHISARAN Decision-Support Platform
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="badge badge-green" style={{ display: 'none', md: 'inline-flex' }}>
            <Activity size={12} style={{ marginRight: '0.3rem' }} /> Pilot Ready
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <main style={{ flex: 1, maxWidth: '980px', width: '100%', margin: '0 auto', padding: '3.5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', padding: '0.35rem 0.85rem' }} className="badge badge-amber">
          <ShieldCheck size={14} /> Zero-PII • Deterministic Decision Support • AEHT Validated
        </div>

        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.85rem)', marginBottom: '1rem', fontWeight: 800, color: 'var(--text-heading)', letterSpacing: '-0.025em' }}>
          District Programme Continuity Scan
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', marginBottom: '3rem', maxWidth: '680px', marginInline: 'auto', lineHeight: 1.6 }}>
          Diagnose, assess, and strengthen cross-departmental service continuity for vulnerable beneficiaries across Education (Schools), Health (RBSK screening & referral), and WCD (Anganwadi) at the district level.
        </p>

        {/* 2 Main Entryway Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem', textAlign: 'left' }}>
          {/* Front A Card */}
          <Link to="/source" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div
              className="card-lift"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                height: '100%',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-sm)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--brand-primary)' }} />
              <div>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--brand-primary-light)',
                  color: 'var(--brand-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}>
                  <Smartphone size={26} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-heading)' }}>
                    FRONT A — Abhisaran Source
                  </h2>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--brand-primary)', fontWeight: 600, marginBottom: '0.75rem' }}>
                  Field Evidence Collection & Assessment Tool
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  Mobile-first field tool with minimal typing. Capture 5-layer continuity questions, attach multi-file verified documents, and auto-enforce Zero-PII protection.
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                <span className="badge badge-green">/source/*</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  Open Field Tool <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </Link>

          {/* Front B Card */}
          <Link to="/admin" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div
              className="card-lift"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                height: '100%',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-sm)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--brand-accent)' }} />
              <div>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--brand-accent-light)',
                  color: 'var(--brand-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}>
                  <LayoutDashboard size={26} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-heading)' }}>
                    FRONT B — Admin Decision Panel
                  </h2>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--brand-accent)', fontWeight: 600, marginBottom: '0.75rem' }}>
                  District Administrative Leadership Console
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  Executive decision dashboard: interactive district monitoring, cross-sector convergence heat-map, delivery point Impact Passports (Annexure A), and verification desk.
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                <span className="badge badge-amber">/admin/*</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand-accent)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  Enter Decision Panel <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Mandatory AEHT Notice */}
        <div className="disclaimer-banner" style={{ marginTop: '3.5rem', textAlign: 'left', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <ShieldCheck size={20} style={{ color: 'var(--brand-accent)', flexShrink: 0, marginTop: '0.1rem' }} />
          <div>
            <strong style={{ display: 'block', marginBottom: '0.2rem', color: 'var(--banner-text)' }}>
              Mandatory AEHT Governance Guarantee:
            </strong>
            ABHISARAN is a non-punitive decision-support tool. It produces no officer rankings or school league tables. Continuity tracking operates exclusively via anonymous district tokens with zero individual PII.
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-dim)', background: 'var(--bg-secondary)' }}>
        Aryabhata Educational & Health Trust (AEHT) • District Programme Continuity Scan Platform • Vidya · Arogya · Samriddhi
      </footer>
    </div>
  );
}

function RefFormRedirect() {
  React.useEffect(() => {
    if (window.location.pathname !== '/ref/abhisaran-field-form.html') {
      window.location.replace('/ref/abhisaran-field-form.html');
    }
  }, []);
  return null;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/source/*" element={<SourceShell />} />
      <Route path="/admin/*" element={<AdminShell />} />
      <Route path="/dc/*" element={<AdminShell />} />
      <Route path="/ref/abhisaran-field-form" element={<RefFormRedirect />} />
      <Route path="/ref/abhisaran-field-form/" element={<RefFormRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
