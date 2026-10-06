import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wifi, WifiOff, ShieldCheck, ArrowLeft, CheckCircle2, AlertTriangle, Send } from 'lucide-react';

export default function SourceShell() {
  const [online, setOnline] = useState(true);
  const [activeLayer, setActiveLayer] = useState(1);
  const [deliveryPoint, setDeliveryPoint] = useState('EDU-01');

  const layers = [
    { num: 1, name: 'Beneficiary Experience', desc: 'Touchpoints & referrals' },
    { num: 2, name: 'Institutional Readiness', desc: 'Duty records & protocols' },
    { num: 3, name: 'Departmental Alignment', desc: 'Hand-off & feedback loops' },
    { num: 4, name: 'Outcome-Readiness', desc: 'Closure & follow-up records' },
    { num: 5, name: 'Sustainability', desc: 'Routine reviews & ownership' }
  ];

  return (
    <div className="app-container" style={{ maxWidth: '640px', margin: '0 auto', background: '#0b1120' }}>
      {/* Top Mobile Bar */}
      <header className="top-bar" style={{ padding: '0.75rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>ABHISARAN SOURCE</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>Field Evidence Collection</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setOnline(!online)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            className={`badge ${online ? 'badge-green' : 'badge-amber'}`}
          >
            {online ? <Wifi size={12} /> : <WifiOff size={12} />}
            {online ? 'ONLINE' : 'OFFLINE'}
          </button>
        </div>
      </header>

      {/* Zero-PII Mandatory Safety Header */}
      <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderBottom: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#fca5a5' }}>
        <ShieldCheck size={16} style={{ flexShrink: 0 }} />
        <span><strong>ZERO-PII POLICY:</strong> Never record names, phone numbers, Aadhaar, or take photos showing faces of children or staff.</span>
      </div>

      {/* Delivery Point Selection */}
      <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Assigned Delivery Point
        </label>
        <select
          value={deliveryPoint}
          onChange={(e) => setDeliveryPoint(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'var(--bg-card)',
            color: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.95rem',
            fontWeight: 600
          }}
        >
          <option value="EDU-01">EDU-01 (Primary School - Sample A)</option>
          <option value="EDU-02">EDU-02 (Middle School - Sample B)</option>
          <option value="HLT-01">HLT-01 (Primary Health Centre / PHC)</option>
          <option value="WCD-01">WCD-01 (Anganwadi Centre - Village 1)</option>
        </select>
      </div>

      {/* 5-Layer Stepper */}
      <div style={{ display: 'flex', overflowX: 'auto', padding: '0.75rem 1rem', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)' }}>
        {layers.map((l) => (
          <button
            key={l.num}
            onClick={() => setActiveLayer(l.num)}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              border: activeLayer === l.num ? '1px solid var(--brand-primary)' : '1px solid var(--border-color)',
              background: activeLayer === l.num ? 'rgba(59, 130, 246, 0.2)' : 'var(--bg-card)',
              color: activeLayer === l.num ? '#ffffff' : 'var(--text-muted)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontSize: '0.8125rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <span>L{l.num}</span> {l.name.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Main Content Area: Structured Question Card */}
      <main style={{ padding: '1rem', flex: 1 }}>
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span className="badge badge-amber">Layer {activeLayer}: {layers[activeLayer - 1].name}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Q1 of 5</span>
          </div>

          <h3 style={{ fontSize: '1.05rem', marginBottom: '0.5rem', fontWeight: 600 }}>
            Is the documented referral register present and maintained at this touchpoint?
          </h3>

          <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            <strong>Why am I collecting this?</strong> Verifies whether institutional procedures document outgoing cross-sector referrals (Convergence Question Q1).
          </div>

          {/* Minimal Typing Option Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {['Complete & Verified', 'Partially Maintained', 'Anecdotal Only', 'Absent / No Record'].map((opt, i) => (
              <button
                key={opt}
                className="btn btn-secondary"
                style={{
                  padding: '1rem 0.5rem',
                  fontSize: '0.85rem',
                  textAlign: 'center',
                  fontWeight: 600,
                  border: i === 0 ? '1px solid var(--band-green-border)' : '1px solid var(--border-color)',
                  background: i === 0 ? 'var(--band-green-bg)' : 'var(--bg-primary)',
                  color: i === 0 ? 'var(--band-green-text)' : 'var(--text-main)'
                }}
              >
                {opt}
              </button>
            ))}
          </div>

          <button className="btn btn-primary" style={{ width: '100%', padding: '0.875rem' }}>
            Record Observation & Continue <Send size={16} />
          </button>
        </div>
      </main>
    </div>
  );
}
