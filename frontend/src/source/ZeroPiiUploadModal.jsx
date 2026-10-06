import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  AlertOctagon,
  Upload,
  Camera,
  X,
  CheckCircle,
  FileText,
  Image as ImageIcon,
  Trash2,
  Plus
} from 'lucide-react';

export default function ZeroPiiUploadModal({
  isOpen,
  onClose,
  targetQuestion,
  onAttachEvidence
}) {
  const [documentKind, setDocumentKind] = useState('REGISTER_EXTRACT');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [piiConfirmed, setPiiConfirmed] = useState(false);
  const [description, setDescription] = useState('');
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const permittedKinds = [
    { value: 'REGISTER_EXTRACT', label: 'Register Extract (Anonymised rows only)' },
    { value: 'PROCESS_DOCUMENT', label: 'Process / Circular / Counter-Referral Notice' },
    { value: 'WALL_DISPLAY', label: 'Wall Display / Duty Chart / Nodal Board' },
    { value: 'INFRASTRUCTURE', label: 'Diagnostic / Physical Infrastructure Setup' }
  ];

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handleFilesSelected = (e) => {
    const rawFiles = Array.from(e.target.files || []);
    if (!rawFiles.length) return;

    let error = '';
    const newFiles = [];

    rawFiles.forEach((file) => {
      // Check 10MB limit per file
      if (file.size > 10 * 1024 * 1024) {
        error = `"${file.name}" exceeds 10MB limit.`;
        return;
      }
      // Check duplicate by name and size
      const exists = selectedFiles.some((f) => f.name === file.name && f.size === file.size);
      if (!exists) {
        newFiles.push({
          id: `${file.name}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          file,
          name: file.name,
          size: file.size,
          formattedSize: formatFileSize(file.size),
          type: file.type,
          documentKind: documentKind
        });
      }
    });

    if (error) {
      setUploadError(error);
    } else {
      setUploadError('');
    }

    setSelectedFiles((prev) => [...prev, ...newFiles]);

    // Reset input value so same files can be re-selected if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (fileId) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const totalBytes = selectedFiles.reduce((acc, f) => acc + f.size, 0);

  const handleConfirmAndAttach = () => {
    if (!piiConfirmed) {
      setUploadError('You must explicitly verify and confirm the Zero-PII check.');
      return;
    }
    if (selectedFiles.length === 0) {
      setUploadError('Please select or capture at least one evidence document.');
      return;
    }

    onAttachEvidence({
      files: selectedFiles.map((f) => ({
        fileName: f.name,
        fileSize: f.formattedSize,
        fileType: f.type,
        documentKind: f.documentKind || documentKind
      })),
      fileCount: selectedFiles.length,
      documentKind,
      fileName: selectedFiles.map((f) => f.name).join(', '),
      fileSize: formatFileSize(totalBytes),
      description: description.trim() || `${selectedFiles.length} documented field artifact(s)`,
      piiConfirmedAt: new Date().toISOString(),
      questionNumber: targetQuestion?.questionNumber,
      resultingRuleId: targetQuestion?.resultingRuleId
    });

    // Reset state and close
    setSelectedFiles([]);
    setPiiConfirmed(false);
    setDescription('');
    setUploadError('');
    onClose();
  };

  const handleModalClose = () => {
    setSelectedFiles([]);
    setPiiConfirmed(false);
    setDescription('');
    setUploadError('');
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
        background: 'rgba(0, 0, 0, 0.82)',
        backdropFilter: 'blur(5px)',
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
          maxWidth: '560px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-xl)',
          color: '#f8fafc',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8'
              }}
            >
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
                Attach Field Evidence (Multi-Upload)
              </h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Upload multiple images, register scans, or PDF documents at once
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleModalClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', flex: 1 }}>
          {/* Mandatory Zero-PII Directive */}
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              marginBottom: '1.25rem',
              fontSize: '0.8125rem',
              color: '#fca5a5',
              lineHeight: 1.45
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              <AlertOctagon size={16} />
              CRITICAL ZERO-PII DIRECTIVE (AEHT §8.1)
            </div>
            Do <strong>NOT</strong> upload images showing faces of children or staff, beneficiary names, Aadhaar numbers, phone numbers, or residential addresses. Ensure any register extract has personal columns cropped or redacted.
          </div>

          {/* Permitted Document Kind */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Primary Evidence Category
            </label>
            <select
              value={documentKind}
              onChange={(e) => setDocumentKind(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
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

          {/* Multi-File Upload Drop Area */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Select Artifact Files / Photos (Multiple Allowed)
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem 1rem',
                textAlign: 'center',
                background: 'rgba(30, 41, 59, 0.35)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,application/pdf"
                id="evidence-file-input"
                onChange={handleFilesSelected}
                style={{ display: 'none' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.6rem', color: 'var(--brand-primary)' }}>
                  <Camera size={26} />
                  <Upload size={26} />
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f1f5f9' }}>
                  Tap to take photos or select multiple images & PDFs
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Supports multiple selections • Up to 10MB per file • JPG, PNG, PDF
                </div>
              </div>
            </div>
          </div>

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--brand-accent)', textTransform: 'uppercase' }}>
                  Selected Artifacts ({selectedFiles.length})
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Total Size: <strong>{formatFileSize(totalBytes)}</strong>
                </span>
              </div>
              <div
                style={{
                  maxHeight: '160px',
                  overflowY: 'auto',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(15, 23, 42, 0.6)'
                }}
              >
                {selectedFiles.map((f, idx) => {
                  const isPdf = f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf');
                  return (
                    <div
                      key={f.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0.75rem',
                        borderBottom: idx < selectedFiles.length - 1 ? '1px solid rgba(255, 255, 255, 0.06)' : 'none',
                        fontSize: '0.8125rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                        {isPdf ? (
                          <FileText size={16} style={{ color: '#f87171', flexShrink: 0 }} />
                        ) : (
                          <ImageIcon size={16} style={{ color: '#38bdf8', flexShrink: 0 }} />
                        )}
                        <span
                          style={{
                            color: '#e2e8f0',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '260px'
                          }}
                          title={f.name}
                        >
                          {f.name}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', flexShrink: 0 }}>
                          ({f.formattedSize})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(f.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-dim)',
                          cursor: 'pointer',
                          padding: '0.2rem',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        title="Remove this file"
                      >
                        <Trash2 size={14} style={{ color: '#94a3b8' }} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Context / Notes */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Sanitized Description / Context (No PII)
            </label>
            <input
              type="text"
              placeholder="e.g. RBSK screening register index page / referral counter-signatures batch"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
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
              padding: '0.85rem 1rem',
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
                <strong>I formally certify</strong> that none of the selected artifacts contain visible student/patient names, Aadhaar numbers, phone numbers, or facial photos of children.
              </span>
            </label>
          </div>

          {uploadError && (
            <div style={{ fontSize: '0.75rem', color: '#f87171', marginBottom: '1rem', textAlign: 'center' }}>
              {uploadError}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'flex-end',
            background: 'rgba(15, 23, 42, 0.95)'
          }}
        >
          <button
            type="button"
            onClick={handleModalClose}
            className="btn btn-secondary"
            style={{ padding: '0.65rem 1.1rem', fontSize: '0.85rem' }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmAndAttach}
            disabled={!piiConfirmed || selectedFiles.length === 0}
            className="btn btn-primary"
            style={{
              padding: '0.65rem 1.35rem',
              fontSize: '0.85rem',
              opacity: piiConfirmed && selectedFiles.length > 0 ? 1 : 0.5,
              cursor: piiConfirmed && selectedFiles.length > 0 ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <CheckCircle size={16} />
            Attach {selectedFiles.length > 1 ? `${selectedFiles.length} Documents` : 'Document'}
          </button>
        </div>
      </div>
    </div>
  );
}
