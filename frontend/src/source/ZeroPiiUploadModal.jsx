import React, { useState } from 'react';
import { ShieldCheck, AlertOctagon, Upload, Camera, X, CheckCircle, FileText } from 'lucide-react';

export default function ZeroPiiUploadModal({
  isOpen,
  onClose,
  targetQuestion,
  onAttachEvidence
}) {
  const [documentKind, setDocumentKind] = useState('REGISTER_EXTRACT');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [piiConfirmed, setPiiConfirmed] = useState(false);
  const [description, setDescription] = useState('');
  const [uploadError, setUploadError] = useState('');

  if (!isOpen) return null;

  const permittedKinds = [
    { value: 'REGISTER_EXTRACT', label: 'Register Extract (Anonymised rows only)' },
    { value: 'PROCESS_DOCUMENT', label: 'Process / Circular / Counter-Referral Notice' },
    { value: 'WALL_DISPLAY', label: 'Wall Display / Duty Chart / Nodal Board' },
    { value: 'INFRASTRUCTURE', label: 'Diagnostic / Physical Infrastructure Setup' }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size (< 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds 10MB limit.');
      return;
    }

    setUploadError('');
    setFileName(file.name);
    setFileSize((file.size / 1024).toFixed(1) + ' KB');
  };

  const handleConfirmAndAttach = () => {
    if (!piiConfirmed) {
      setUploadError('You must explicitly verify and confirm the Zero-PII check.');
      return;
    }
    if (!fileName) {
      setUploadError('Please select or capture an evidence document.');
      return;
    }

    onAttachEvidence({
      documentKind,
      fileName,
      fileSize,
      description: description.trim() || 'Documented field evidence artifact',
      piiConfirmedAt: new Date().toISOString(),
      questionNumber: targetQuestion?.questionNumber,
      resultingRuleId: targetQuestion?.resultingRuleId
    });

    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div
        style={{
          background: '#0f172a',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '520px',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-xl)',
          color: '#f8fafc'
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} style={{ color: '#38bdf8' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Evidence Attachment & Zero-PII Check</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Mandatory Red Warning Box */}
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem',
            marginBottom: '1.25rem',
            fontSize: '0.8125rem',
            color: '#fca5a5',
            lineHeight: 1.45
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            <AlertOctagon size={16} />
            CRITICAL ZERO-PII DIRECTIVE
          </div>
          Do <strong>NOT</strong> upload images showing faces of children or staff, beneficiary names, Aadhaar numbers, phone numbers, or residential addresses. Ensure any register extract has personal columns cropped or redacted.
        </div>

        {/* Permitted Document Kind */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
            Permitted Evidence Category
          </label>
          <select
            value={documentKind}
            onChange={(e) => setDocumentKind(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: '#ffffff',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem'
            }}
          >
            {permittedKinds.map((k) => (
              <option key={k.value} value={k.value}>
                {k.label}
              </option>
            ))}
          </select>
        </div>

        {/* File / Camera Input */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
            Select Artifact File / Photo
          </label>
          <div
            style={{
              border: '2px dashed var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              textAlign: 'center',
              background: 'rgba(30, 41, 59, 0.3)',
              cursor: 'pointer'
            }}
          >
            <input
              type="file"
              accept="image/*,application/pdf"
              id="evidence-file-input"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="evidence-file-input" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--brand-primary)' }}>
                <Camera size={24} />
                <Upload size={24} />
              </div>
              <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                {fileName ? fileName : 'Tap to take photo or choose PDF / image'}
              </span>
              {fileSize && (
                <span style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: 600 }}>
                  Size: {fileSize}
                </span>
              )}
            </label>
          </div>
        </div>

        {/* Context / Notes */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
            Sanitized Description (No PII)
          </label>
          <input
            type="text"
            placeholder="e.g. RBSK screening register index page / referral counter-signatures"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: '#ffffff',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem'
            }}
          />
        </div>

        {/* Mandatory Attestation Checkbox */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.6)',
            padding: '0.85rem',
            borderRadius: 'var(--radius-sm)',
            border: piiConfirmed ? '1px solid #10b981' : '1px solid var(--border-color)',
            marginBottom: '1rem'
          }}
        >
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', cursor: 'pointer', fontSize: '0.8125rem', color: '#e2e8f0', lineHeight: 1.4 }}>
            <input
              type="checkbox"
              checked={piiConfirmed}
              onChange={(e) => setPiiConfirmed(e.target.checked)}
              style={{ marginTop: '0.2rem', accentColor: '#10b981', width: '16px', height: '16px' }}
            />
            <span>
              <strong>I formally certify</strong> that this artifact does not contain visible student/patient names, Aadhaar numbers, phone numbers, or facial photos of children.
            </span>
          </label>
        </div>

        {uploadError && (
          <div style={{ fontSize: '0.75rem', color: '#f87171', marginBottom: '1rem', textAlign: 'center' }}>
            {uploadError}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '0.65rem 1rem', fontSize: '0.85rem' }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmAndAttach}
            disabled={!piiConfirmed || !fileName}
            className="btn btn-primary"
            style={{
              padding: '0.65rem 1.25rem',
              fontSize: '0.85rem',
              opacity: piiConfirmed && fileName ? 1 : 0.5,
              cursor: piiConfirmed && fileName ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <CheckCircle size={16} /> Attach Document
          </button>
        </div>
      </div>
    </div>
  );
}
