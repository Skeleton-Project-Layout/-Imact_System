import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
  FileText,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Save,
  Download,
  Layers,
  Building2
} from 'lucide-react';
import { analyzeAssessment, saveJudgementToPassport } from '../data/aiAnalysisService';

export default function AiJudgementModal({
  isOpen,
  onClose,
  deliveryPoint,
  district,
  recordedAnswers = {},
  evidenceAttachments = {},
  onJudgementSaved = () => {}
}) {
  const [analyzing, setAnalyzing] = useState(false);
  const [judgementResult, setJudgementResult] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const dpCode = deliveryPoint?.code || 'EKH-EDU-01';
  const sector = deliveryPoint?.sector || 'EDUCATION';
  const distName = district?.name || 'East Khasi Hills';
  const answersList = Object.values(recordedAnswers || {});

  // Find any attached Quiz PDF in evidence attachments
  const attachedPdf = Object.values(evidenceAttachments || {}).find(
    (att) => att?.documentKind === 'BASELINE_SURVEY_REPORT' || att?.fileName?.endsWith('.pdf')
  );

  const handleRunScan = async () => {
    setAnalyzing(true);
    setErrorMsg('');
    setSavedSuccess(false);

    try {
      const payload = {
        deliveryPointCode: dpCode,
        districtId: district?.id || 'east-khasi-hills',
        districtName: distName,
        sector,
        answers: answersList,
        quizPdf: attachedPdf
          ? {
              file_name: attachedPdf.fileName,
              data_url: attachedPdf.dataUrl,
              document_kind: 'BASELINE_SURVEY_REPORT'
            }
          : {
              file_name: `Baseline_Field_Scan_${dpCode}.pdf`,
              document_kind: 'BASELINE_SURVEY_REPORT'
            }
      };

      const result = await analyzeAssessment(payload);
      setJudgementResult(result);
    } catch (err) {
      console.error('AI Scan execution failed', err);
      setErrorMsg(`Failed to complete continuity scan: ${err.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveToPassport = () => {
    if (!judgementResult) return;
    const ok = saveJudgementToPassport(judgementResult);
    if (ok) {
      setSavedSuccess(true);
      onJudgementSaved(judgementResult);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
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
          maxWidth: '740px',
          maxHeight: '92vh',
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
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Sparkles size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0, color: 'var(--text-heading)' }}>
                AI Continuity Scan & Judgement Synthesis
              </h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                AEHT §15 Decision-Support Engine • Continuous 45-Parameter Scan
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

          {/* Target Facility Context Card */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Building2 size={24} style={{ color: 'var(--brand-primary)' }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-heading)' }}>
                  {dpCode} • {deliveryPoint?.name || dpCode}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {distName} ({district?.state || 'Meghalaya'}) • Sector: {sector}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span className="badge badge-blue" style={{ fontSize: '0.72rem' }}>
                {answersList.length} Answers Recorded
              </span>
              {attachedPdf ? (
                <span className="badge badge-green" style={{ fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <FileText size={12} /> Quiz PDF Attached
                </span>
              ) : (
                <span className="badge badge-amber" style={{ fontSize: '0.72rem' }}>
                  Survey PDF Standby
                </span>
              )}
            </div>
          </div>

          {/* Action Trigger Banner if Not Yet Analyzed */}
          {!judgementResult && (
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(59, 130, 246, 0.04))',
                border: '1px solid rgba(37, 99, 235, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.85rem'
              }}
            >
              <Sparkles size={36} style={{ color: 'var(--brand-primary)' }} />
              <div>
                <h4 style={{ margin: '0 0 0.35rem', fontSize: '1rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                  Ready to Run Continuity Scan on All Layers (L1 - L5)
                </h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: '520px' }}>
                  The AI Assistive Service evaluates your answers against the AEHT Master 45-parameter continuity framework, cross-references attached baseline survey artifacts, detects systemic friction red flags, and prepares an administrative Action Brief.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRunScan}
                disabled={analyzing}
                className="btn btn-primary"
                style={{ padding: '0.75rem 1.75rem', fontSize: '0.9rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                {analyzing ? <RefreshCw size={18} className="spin" /> : <Sparkles size={18} />}
                <span>{analyzing ? 'Running Analysis on Master Parameters...' : '🚀 Execute AI Continuity Scan Now'}</span>
              </button>
            </div>
          )}

          {/* Judgement Results View */}
          {judgementResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Score & Band Header */}
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr 2fr',
                  gap: '1.25rem'
                }}
              >
                {/* Composite ACS Card */}
                <div
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Continuity Score (ACS)
                  </div>
                  <div
                    style={{
                      fontSize: '2.4rem',
                      fontWeight: 900,
                      color:
                        judgementResult.continuity_band === 'GREEN'
                          ? '#10b981'
                          : judgementResult.continuity_band === 'AMBER'
                          ? '#f59e0b'
                          : '#ef4444',
                      lineHeight: 1.1,
                      margin: '0.35rem 0'
                    }}
                  >
                    {judgementResult.overall_acs_score}%
                  </div>
                  <span
                    className={`badge ${
                      judgementResult.continuity_band === 'GREEN'
                        ? 'badge-green'
                        : judgementResult.continuity_band === 'AMBER'
                        ? 'badge-amber'
                        : 'badge-red'
                    }`}
                    style={{ fontSize: '0.78rem', fontWeight: 800 }}
                  >
                    BAND: {judgementResult.continuity_band} ({judgementResult.continuity_band === 'GREEN' ? 'OPTIMAL' : judgementResult.continuity_band === 'AMBER' ? 'FRAGILE' : 'CRITICAL'})
                  </span>
                </div>

                {/* Layer Score Breakdown (L1-L5) */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem' }}>
                    Layer-by-Layer Continuity Scores
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem' }}>
                    {[
                      { key: 'L1', label: 'L1 Exp', score: judgementResult.layer_scores?.L1 },
                      { key: 'L2', label: 'L2 Inst', score: judgementResult.layer_scores?.L2 },
                      { key: 'L3', label: 'L3 Align', score: judgementResult.layer_scores?.L3 },
                      { key: 'L4', label: 'L4 Outc', score: judgementResult.layer_scores?.L4 },
                      { key: 'L5', label: 'L5 Sust', score: judgementResult.layer_scores?.L5 }
                    ].map((l) => (
                      <div
                        key={l.key}
                        style={{
                          background: 'var(--bg-card)',
                          padding: '0.5rem 0.25rem',
                          borderRadius: '6px',
                          border: '1px solid var(--border-color)',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>{l.label}</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-heading)', marginTop: '0.15rem' }}>
                          {l.score}%
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <ShieldCheck size={14} style={{ color: '#10b981', flexShrink: 0 }} />
                    <span>Engine: {judgementResult.model_id} • Strictly Zero-PII Deterministic Judgement</span>
                  </div>
                </div>
              </div>

              {/* Quiz PDF Corroboration Badge & Citation */}
              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={18} style={{ color: '#d97706' }} />
                  <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#d97706', textTransform: 'uppercase' }}>
                    Baseline Survey PDF Ingested in Judgement
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: 600 }}>
                  {judgementResult.quiz_pdf_citation?.citation_notice}
                </div>
                {judgementResult.quiz_pdf_citation?.corroborated_findings?.length > 0 && (
                  <ul style={{ margin: '0.25rem 0 0', paddingLeft: '1.25rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {judgementResult.quiz_pdf_citation.corroborated_findings.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Detected Red Flags */}
              {judgementResult.detected_red_flags?.length > 0 ? (
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.06)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertTriangle size={18} style={{ color: '#ef4444' }} />
                    <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#ef4444', textTransform: 'uppercase' }}>
                      {judgementResult.detected_red_flags.length} Red Flag Parameter(s) Detected
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {judgementResult.detected_red_flags.map((rf, i) => (
                      <div
                        key={i}
                        style={{
                          background: 'var(--bg-card)',
                          padding: '0.75rem',
                          borderRadius: '6px',
                          border: '1px solid rgba(239, 68, 68, 0.2)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-heading)' }}>
                            [{rf.question_id}] {rf.parameter}
                          </span>
                          <span className="badge badge-red" style={{ fontSize: '0.65rem' }}>
                            {rf.severity}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#ef4444', marginBottom: '0.35rem' }}>
                          ⚠️ Condition: {rf.condition_detected}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--brand-primary)' }}>
                          💡 Suggested Intervention: {rf.suggested_intervention}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.82rem',
                    color: '#10b981'
                  }}
                >
                  <CheckCircle2 size={18} />
                  <span>No acute red-flag breaches detected across master continuity parameters.</span>
                </div>
              )}

              {/* Action Brief Draft */}
              {judgementResult.action_brief && (
                <div
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {judgementResult.action_brief.draft_title}
                    </span>
                    <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                      STATUS: DRAFT (AEHT §15)
                    </span>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                      Problem Statement
                    </div>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
                      {judgementResult.action_brief.problem_statement}
                    </p>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                      Indicative Next Step
                    </div>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
                      {judgementResult.action_brief.indicative_next_step}
                    </p>
                  </div>

                  {judgementResult.action_brief.suggested_interventions?.length > 0 && (
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                        Priority Recommended Interventions
                      </div>
                      <ul style={{ margin: '0.25rem 0 0', paddingLeft: '1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {judgementResult.action_brief.suggested_interventions.map((item, idx) => (
                          <li key={idx} style={{ marginBottom: '0.2rem' }}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontStyle: 'italic', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
                    {judgementResult.action_brief.statutory_planning_notice}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {judgementResult ? (
            <>
              <div>
                {savedSuccess && (
                  <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CheckCircle2 size={16} /> Saved to District Impact Passport!
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={handleRunScan}
                  disabled={analyzing}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <RefreshCw size={14} className={analyzing ? 'spin' : ''} /> Re-Scan
                </button>
                <button
                  type="button"
                  onClick={handleSaveToPassport}
                  className="btn btn-primary"
                  style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Save size={16} /> Save to Impact Passport
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
