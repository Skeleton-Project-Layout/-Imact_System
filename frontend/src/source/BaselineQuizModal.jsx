import React, { useState, useEffect } from 'react';
import { X, ExternalLink, FileCheck, Layers, HelpCircle, ShieldCheck } from 'lucide-react';

export default function BaselineQuizModal({
  isOpen,
  onClose,
  targetQuestion,
  allQuestions = [],
  deliveryPointCode,
  onAttachPdf,
  onOpenQuestionSetup
}) {
  const [selectedQNum, setSelectedQNum] = useState(
    targetQuestion?.questionNumber || (allQuestions[0]?.questionNumber || 1)
  );
  const [lastAttachedNotice, setLastAttachedNotice] = useState('');

  // Synchronize target question when modal opens
  useEffect(() => {
    if (targetQuestion?.questionNumber) {
      setSelectedQNum(targetQuestion.questionNumber);
    } else if (allQuestions.length > 0) {
      setSelectedQNum(allQuestions[0].questionNumber);
    }
  }, [targetQuestion, allQuestions, isOpen]);

  // Listen for postMessage from the embedded iframe or popup
  useEffect(() => {
    const handleMessage = (event) => {
      if (!event.data || event.data.type !== 'ABHISARAN_PDF_EXPORTED') {
        return;
      }

      const { fileName, dataUrl, byteLength } = event.data;
      const targetQ = allQuestions.find((q) => q.questionNumber === selectedQNum) || targetQuestion;

      const formatSize = (bytes) => {
        if (!bytes) return '15 KB';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
      };

      const finalName = fileName || `Baseline_Survey_${deliveryPointCode || 'DP'}_Q${selectedQNum}.pdf`;

      const evidencePayload = {
        files: [
          {
            fileName: finalName,
            fileSize: formatSize(byteLength),
            fileType: 'application/pdf',
            documentKind: 'BASELINE_SURVEY_REPORT',
            dataUrl
          }
        ],
        fileCount: 1,
        documentKind: 'BASELINE_SURVEY_REPORT',
        fileName: finalName,
        fileSize: formatSize(byteLength),
        description: `Verified Baseline Assessment PDF report generated via Reference Field Quiz tool for ${deliveryPointCode || 'Delivery Point'}.`,
        piiConfirmedAt: new Date().toISOString(),
        questionNumber: selectedQNum,
        resultingRuleId: targetQ?.resultingRuleId || `RULE-Q${selectedQNum}`,
        dataUrl
      };

      if (onAttachPdf) {
        onAttachPdf(evidencePayload, selectedQNum);
      }

      setLastAttachedNotice(`✅ Attached ${finalName} to Question Q${selectedQNum} Verified Artifacts!`);
      setTimeout(() => {
        setLastAttachedNotice('');
        onClose();
      }, 2500);
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [selectedQNum, allQuestions, targetQuestion, deliveryPointCode, onAttachPdf, onClose]);

  if (!isOpen) return null;

  const currentQ = allQuestions.find((q) => q.questionNumber === selectedQNum) || targetQuestion;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(5px)',
        zIndex: 1050,
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
          width: '96vw',
          maxWidth: '1240px',
          height: '92vh',
          borderRadius: 'var(--radius-lg, 12px)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Modal Top Control Bar */}
        <div
          style={{
            padding: '0.75rem 1.25rem',
            borderBottom: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#059669',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.04em'
              }}
            >
              BASELINE QUIZ SETUP
            </span>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>
                ABHISARAN Field Reference Form (Q1–Q67)
              </h2>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Target Delivery Point: <strong style={{ color: 'var(--brand-primary)' }}>{deliveryPointCode}</strong>
              </div>
            </div>
          </div>

          {/* Question Selector & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                Attach PDF To:
              </label>
              <select
                value={selectedQNum}
                onChange={(e) => setSelectedQNum(parseInt(e.target.value, 10))}
                style={{
                  background: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm, 6px)',
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.8rem',
                  maxWidth: '280px',
                  fontWeight: 600
                }}
              >
                {allQuestions.map((q) => (
                  <option key={q.questionNumber} value={q.questionNumber}>
                    {q.convergenceQuestion || 'Q' + q.questionNumber}: {q.questionText.slice(0, 45)}...
                  </option>
                ))}
              </select>
            </div>

            {onOpenQuestionSetup && (
              <button
                type="button"
                onClick={onOpenQuestionSetup}
                className="btn btn-secondary"
                style={{
                  fontSize: '0.75rem',
                  padding: '0.35rem 0.65rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  color: 'var(--brand-primary)',
                  borderColor: 'var(--border-color)',
                  background: 'var(--bg-card)'
                }}
                title="Configure question catalogue (Check, Change, Add, and Delete)"
              >
                <HelpCircle size={13} />
                ⚙️ Manage Questions
              </button>
            )}

            <button
              type="button"
              onClick={() => window.open('/ref/abhisaran-field-form.html', '_blank')}
              className="btn btn-secondary"
              style={{
                fontSize: '0.75rem',
                padding: '0.35rem 0.65rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                color: 'var(--brand-primary)',
                borderColor: 'var(--border-color)'
              }}
              title="Open full standalone page in a new browser tab"
            >
              <ExternalLink size={13} />
              Open in Tab
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '0.25rem',
                borderRadius: '4px'
              }}
              title="Close Reference Quiz Setup"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Live Status Notice if PDF attached */}
        {lastAttachedNotice && (
          <div
            style={{
              background: 'var(--band-green-bg)',
              borderBottom: '1px solid var(--band-green-border)',
              color: 'var(--band-green-text)',
              padding: '0.5rem 1.25rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FileCheck size={16} />
            <span>{lastAttachedNotice}</span>
          </div>
        )}

        {/* Informational Guidance Ribbon */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            padding: '0.45rem 1.25rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck size={14} style={{ color: '#059669' }} />
            <span>
              Fill out the 67-question baseline survey below. Clicking <strong>⚡ Send &amp; Attach PDF to /source</strong> will immediately attach the signed report to <strong>{currentQ?.convergenceQuestion || 'Q' + selectedQNum}</strong> in your scan!
            </span>
          </div>
        </div>

        {/* Embedded Iframe Loading the Reference HTML */}
        <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%' }}>
          <iframe
            id="baseline-quiz-iframe"
            src="/ref/abhisaran-field-form.html"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block'
            }}
            title="ABHISARAN Baseline Field Assessment Reference Form"
          />
        </div>
      </div>
    </div>
  );
}
