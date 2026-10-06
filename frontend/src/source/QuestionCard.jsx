import React, { useState } from 'react';
import { HelpCircle, Paperclip, CheckCircle2, ChevronRight, FileText } from 'lucide-react';

export default function QuestionCard({
  question,
  recordedAnswer,
  onSaveAnswer,
  onOpenUploadModal,
  evidenceAttachment
}) {
  const [selectedOption, setSelectedOption] = useState(recordedAnswer?.selectedOption || '');
  const [notes, setNotes] = useState(recordedAnswer?.notes || '');
  const [sampleTotal, setSampleTotal] = useState(recordedAnswer?.sampleTotal || '');
  const [sampleCompliant, setSampleCompliant] = useState(recordedAnswer?.sampleCompliant || '');
  const [showWhy, setShowWhy] = useState(false);

  if (!question) {
    return <div style={{ color: 'var(--text-muted)', padding: '1rem' }}>No question available.</div>;
  }

  // Parse options from question.optionsJson or fallback options
  let options = [];
  try {
    if (typeof question.optionsJson === 'string') {
      const parsed = JSON.parse(question.optionsJson);
      options = parsed.options || [];
    } else if (question.optionsJson?.options) {
      options = question.optionsJson.options;
    }
  } catch (e) {
    options = ['COMPLIANT_AND_VERIFIED', 'PARTIAL_OR_ANECDOTAL', 'NON_COMPLIANT_ABSENT'];
  }

  if (options.length === 0) {
    options = ['COMPLIANT_AND_VERIFIED', 'PARTIAL_OR_ANECDOTAL', 'NON_COMPLIANT_ABSENT'];
  }

  const formatOptionLabel = (opt) => {
    return opt
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleSelect = (opt) => {
    setSelectedOption(opt);
    onSaveAnswer({
      questionNumber: question.questionNumber,
      resultingRuleId: question.resultingRuleId,
      selectedOption: opt,
      sampleTotal: sampleTotal ? parseInt(sampleTotal, 10) : null,
      sampleCompliant: sampleCompliant ? parseInt(sampleCompliant, 10) : null,
      notes,
      attachment: evidenceAttachment
    });
  };

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        border: '1px solid var(--border-color)',
        marginBottom: '1rem',
        boxShadow: 'var(--shadow-md)'
      }}
    >
      {/* Header Badges */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span className="badge badge-blue" style={{ fontSize: '0.75rem' }}>
            {question.convergenceQuestion || 'Q' + question.questionNumber}
          </span>
          <span className="badge badge-amber" style={{ fontSize: '0.75rem' }}>
            Layer {question.layer}
          </span>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'monospace' }}>
          Rule: {question.resultingRuleId}
        </span>
      </div>

      {/* Question Text */}
      <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.5rem', lineHeight: 1.4 }}>
        {question.questionText}
      </h3>

      {/* Evidence Requirement Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <FileText size={14} style={{ color: 'var(--brand-primary)' }} />
        <span>Required Evidence: <strong style={{ color: '#e2e8f0' }}>{question.evidenceRequirement || 'REGISTER_EXTRACT'}</strong></span>
      </div>

      {/* "Why am I collecting this?" Collapsible Tooltip */}
      <div style={{ marginBottom: '1rem' }}>
        <button
          type="button"
          onClick={() => setShowWhy(!showWhy)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--brand-primary)',
            fontSize: '0.8125rem',
            cursor: 'pointer',
            padding: 0,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontWeight: 600
          }}
        >
          <HelpCircle size={15} />
          {showWhy ? 'Hide field rationale' : 'Why am I collecting this?'}
        </button>

        {showWhy && (
          <div
            style={{
              marginTop: '0.5rem',
              background: 'rgba(30, 41, 59, 0.7)',
              borderLeft: '3px solid var(--brand-primary)',
              padding: '0.75rem',
              borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
              fontSize: '0.8rem',
              color: '#cbd5e1',
              lineHeight: 1.45
            }}
          >
            {question.explanationWhy || 'Collects field observation to assess service continuity and institutional hand-offs.'}
          </div>
        )}
      </div>

      {/* Minimal-Typing Structured Options Grid (Never ask user to type 0-5) */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Select Documented Observation
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
          {options.map((opt) => {
            const isSelected = selectedOption === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelect(opt)}
                style={{
                  padding: '0.85rem 1rem',
                  fontSize: '0.875rem',
                  textAlign: 'left',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontWeight: isSelected ? 700 : 500,
                  border: isSelected ? '1px solid var(--brand-primary)' : '1px solid var(--border-color)',
                  background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-secondary)',
                  color: isSelected ? '#93c5fd' : '#e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{formatOptionLabel(opt)}</span>
                {isSelected ? <CheckCircle2 size={18} style={{ color: 'var(--brand-primary)' }} /> : <ChevronRight size={16} style={{ color: 'var(--text-dim)' }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Optional Objective Sampling Inputs (e.g. 5 records checked, 4 had counter-referrals) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem', background: 'rgba(15, 23, 42, 0.4)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>
            Sample Total Checked
          </label>
          <input
            type="number"
            min="0"
            max="100"
            placeholder="e.g. 10"
            value={sampleTotal}
            onChange={(e) => {
              setSampleTotal(e.target.value);
              if (selectedOption) {
                onSaveAnswer({
                  questionNumber: question.questionNumber,
                  resultingRuleId: question.resultingRuleId,
                  selectedOption,
                  sampleTotal: e.target.value ? parseInt(e.target.value, 10) : null,
                  sampleCompliant: sampleCompliant ? parseInt(sampleCompliant, 10) : null,
                  notes,
                  attachment: evidenceAttachment
                });
              }
            }}
            style={{
              width: '100%',
              padding: '0.5rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: '#ffffff',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem'
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>
            Compliant Records Count
          </label>
          <input
            type="number"
            min="0"
            max="100"
            placeholder="e.g. 8"
            value={sampleCompliant}
            onChange={(e) => {
              setSampleCompliant(e.target.value);
              if (selectedOption) {
                onSaveAnswer({
                  questionNumber: question.questionNumber,
                  resultingRuleId: question.resultingRuleId,
                  selectedOption,
                  sampleTotal: sampleTotal ? parseInt(sampleTotal, 10) : null,
                  sampleCompliant: e.target.value ? parseInt(e.target.value, 10) : null,
                  notes,
                  attachment: evidenceAttachment
                });
              }
            }}
            style={{
              width: '100%',
              padding: '0.5rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: '#ffffff',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem'
            }}
          />
        </div>
      </div>

      {/* Evidence Safeguard & Attachment */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
        <button
          type="button"
          onClick={() => onOpenUploadModal(question)}
          className="btn btn-secondary"
          style={{
            fontSize: '0.8125rem',
            padding: '0.5rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: evidenceAttachment ? 'var(--band-green-text)' : 'var(--text-main)',
            border: evidenceAttachment ? '1px solid var(--band-green-border)' : '1px solid var(--border-color)'
          }}
        >
          <Paperclip size={15} />
          {evidenceAttachment ? 'Attached: ' + (evidenceAttachment.documentKind || 'Document') : 'Attach Verified Artifact'}
        </button>

        {selectedOption && (
          <span style={{ fontSize: '0.75rem', color: 'var(--band-green-text)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <CheckCircle2 size={14} /> Recorded
          </span>
        )}
      </div>
    </div>
  );
}
