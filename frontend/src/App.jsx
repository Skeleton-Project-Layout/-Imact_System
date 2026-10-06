import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import SourceShell from './source/SourceShell';
import AdminShell from './admin/AdminShell';
import { ShieldCheck, Smartphone, LayoutDashboard } from 'lucide-react';

function LandingPage() {
  return (
    <div style={{ maxWidth: '900px', margin: '4rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }} className="badge badge-amber">
        <ShieldCheck size={14} /> Zero-PII • Deterministic Decision Support
      </div>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem', fontWeight: 700 }}>
        ABHISARAN
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', marginBottom: '2.5rem', maxWidth: '650px', marginInline: 'auto' }}>
        District Programme Continuity Scan for Aryabhata Educational & Health Trust (AEHT).
        Bridging Education, Health/RBSK, and Anganwadi continuity.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', textAlign: 'left' }}>
        {/* Front A Card */}
        <Link to="/source" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            height: '100%',
            transition: 'border-color 0.2s',
            cursor: 'pointer'
          }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: 'var(--radius-md)',
              background: 'rgba(59, 130, 246, 0.15)', color: 'var(--brand-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem'
            }}>
              <Smartphone size={24} />
            </div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>FRONT A — Abhisaran Source</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Mobile-first field evidence collection. Offline-tolerant, minimal typing, with automated Zero-PII safeguards.
            </p>
            <div className="badge badge-green">/source/*</div>
          </div>
        </Link>

        {/* Front B Card */}
        <Link to="/admin" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            height: '100%',
            transition: 'border-color 0.2s',
            cursor: 'pointer'
          }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: 'var(--radius-md)',
              background: 'rgba(245, 158, 11, 0.15)', color: 'var(--brand-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem'
            }}>
              <LayoutDashboard size={24} />
            </div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>FRONT B — Admin Decision Panel</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Government decision-support dashboard: aggregate heat-map, delivery point Impact Passports, and Priority Action Framework.
            </p>
            <div className="badge badge-amber">/admin/*</div>
          </div>
        </Link>
      </div>

      <div className="disclaimer-banner" style={{ marginTop: '3rem', textAlign: 'left' }}>
        <strong>Mandatory AEHT Notice:</strong> ABHISARAN is a non-punitive decision-support tool. It produces no officer rankings or school league tables. Continuity tracking operates exclusively via anonymous district tokens with zero individual PII.
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/source/*" element={<SourceShell />} />
      <Route path="/admin/*" element={<AdminShell />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
