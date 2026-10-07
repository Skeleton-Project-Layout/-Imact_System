import React, { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  X,
  RefreshCw,
  Cpu,
  ShieldCheck,
  FileText,
  Clock,
  ArrowRight,
  Server
} from 'lucide-react';
import { checkAiHealth, analyzeAssessment } from '../data/aiAnalysisService';

export default function AiDiagnosticsModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [testingJudgement, setTestingJudgement] = useState(false);
  const [healthData, setHealthData] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      runHealthCheck();
    }
  }, [isOpen]);

  const runHealthCheck = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await checkAiHealth();
      setHealthData(data);
    } catch (err) {
      setErrorMsg('Failed to check AI service status.');
    } finally {
      setLoading(false);
    }
  };

  const handleTestSynthesis = async () => {
    setTestingJudgement(true);
    setErrorMsg('');
    try {
      const samplePayload = {
        deliveryPointCode: 'EKH-EDU-01',
        districtId: 'east-khasi-hills',
        districtName: 'East Khasi Hills',
        sector: 'EDUCATION',
        answers: [
          { questionNumber: 1, selectedOption: 'COMPLIANT_AND_VERIFIED', notes: 'Touchpoint logbook verified' },
          { questionNumber: 2, selectedOption: 'DEFICIT_OBSERVED', notes: 'Ramp gradient non-compliant for CwSN' },
          { questionNumber: 5, selectedOption: 'COMPLIANT_AND_VERIFIED', notes: 'First aid kit stocked' }
        ],
        quizPdf: {
          file_name: 'Baseline_Survey_EKH-EDU-01_Signed.pdf',
          data_url: 'data:application/pdf;base64,JVBERi0xLjQK...',
          document_kind: 'BASELINE_SURVEY_REPORT'
        }
      };

      const result = await analyzeAssessment(samplePayload);
      setTestResult(result);
    } catch (err) {
      setErrorMsg(`Synthesis test failed: ${err.message}`);
    } finally {
      setTestingJudgement(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
          maxWidth: '680px',
          maxHeight: '90vh',
          borderRadius: 'var(--radius-lg, 12px)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
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
                background: healthData?.online ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                color: healthData?.online ? '#10b981' : 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Cpu size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-heading)' }}>
                AI Service Status & Diagnostics
              </h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Verify FastAPI Python Microservice & Judgement Synthesis Engine
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

        {/* Content */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {errorMsg && (
            <div style={{ background: 'var(--band-red-bg)', border: '1px solid var(--band-red-border)', color: 'var(--band-red-text)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem' }}>
              {errorMsg}
            </div>
          )}

          {/* Service Live Card */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${healthData?.online ? 'rgba(16, 185, 129, 0.35)' : 'rgba(59, 130, 246, 0.35)'}`,
              background: healthData?.online ? 'rgba(16, 185, 129, 0.06)' : 'rgba(59, 130, 246, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: healthData?.online ? '#10b981' : '#3b82f6',
                    boxShadow: `0 0 8px ${healthData?.online ? '#10b981' : '#3b82f6'}`
                  }}
                />
                <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-heading)' }}>
                  {healthData?.online ? 'FastAPI Python Microservice: ACTIVE' : 'Local Deterministic Decision Engine: READY'}
                </span>
              </div>
              <span className={`badge ${healthData?.online ? 'badge-green' : 'badge-blue'}`} style={{ fontSize: '0.75rem' }}>
                {healthData?.status || 'CHECKING...'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginTop: '0.25rem' }}>
              <div style={{ background: 'var(--bg-card)', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Mode</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {healthData?.mode || 'DETECTING'}
                </div>
              </div>
              <div style={{ background: 'var(--bg-card)', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Latency</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={12} /> {healthData?.latencyMs ? `${healthData.latencyMs}ms` : '—'}
                </div>
              </div>
              <div style={{ background: 'var(--bg-card)', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Role Safety</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <ShieldCheck size={12} /> Read-Only Assistive
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
              {healthData?.message}
            </div>
          </div>

          {/* Test Live Judgement Button */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              type="button"
              onClick={handleTestSynthesis}
              disabled={testingJudgement || loading}
              className="btn btn-primary"
              style={{ flex: 1, padding: '0.65rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
            >
              {testingJudgement ? <RefreshCw size={16} className="spin" /> : <Activity size={16} />}
              <span>{testingJudgement ? 'Executing AI Continuity Scan...' : 'Test AI Continuity Judgement on Sample Scan'}</span>
            </button>

            <button
              type="button"
              onClick={runHealthCheck}
              disabled={loading}
              className="btn btn-secondary"
              style={{ padding: '0.65rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem' }}
              title="Refresh connection"
            >
              <RefreshCw size={14} className={loading ? 'spin' : ''} />
              <span>Ping</span>
            </button>
          </div>

          {/* Live Test Synthesis Output */}
          {testResult && (
            <div
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={18} style={{ color: '#10b981' }} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-heading)' }}>
                    AI Synthesis Verification Passed!
                  </span>
                </div>
                <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>
                  {testResult.execution_source}
                </span>
              </div>

              {/* Score Gauges */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
                <div style={{ background: 'var(--bg-card)', padding: '0.6rem', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Composite ACS</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: testResult.overall_acs_score >= 70 ? '#10b981' : '#f59e0b' }}>
                    {testResult.overall_acs_score}%
                  </div>
                  <span className={`badge ${testResult.continuity_band === 'GREEN' ? 'badge-green' : 'badge-amber'}`} style={{ fontSize: '0.65rem' }}>
                    {testResult.continuity_band}
                  </span>
                </div>
                <div style={{ background: 'var(--bg-card)', padding: '0.6rem', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Layer Scores</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                    L1: {testResult.layer_scores?.L1}% | L2: {testResult.layer_scores?.L2}%
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    L3: {testResult.layer_scores?.L3}% | L4: {testResult.layer_scores?.L4}% | L5: {testResult.layer_scores?.L5}%
                  </div>
                </div>
                <div style={{ background: 'var(--bg-card)', padding: '0.6rem', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Red Flags Detected</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: testResult.detected_red_flags?.length > 0 ? '#ef4444' : '#10b981' }}>
                    {testResult.detected_red_flags?.length || 0}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Master 45 Rules</div>
                </div>
              </div>

              {/* Quiz PDF Citation Verification */}
              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  fontSize: '0.78rem'
                }}
              >
                <FileText size={16} style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 700, color: '#d97706', marginBottom: '0.2rem' }}>
                    Quiz PDF Corroborated in Judgement:
                  </div>
                  <div style={{ color: 'var(--text-main)' }}>
                    {testResult.quiz_pdf_citation?.citation_notice}
                  </div>
                </div>
              </div>

              {/* Action Brief Sample */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '0.25rem' }}>
                  {testResult.action_brief?.draft_title}
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
                  {testResult.action_brief?.problem_statement}
                </p>
              </div>
            </div>
          )}

          {/* Quick Setup Instructions for Local Server */}
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '0.85rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <div style={{ fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.25rem' }}>
              ℹ️ Local AI Microservice Command (Optional):
            </div>
            <code>cd ai-service &amp;&amp; .venv\Scripts\uvicorn main:app --port 8000 --reload</code>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', background: 'var(--bg-secondary)', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
}
