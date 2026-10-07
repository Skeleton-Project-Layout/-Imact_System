import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Image as ImageIcon,
  History,
  Filter,
  CheckSquare,
  FileCheck2,
  Eye,
  Clock,
  UserCheck,
  ArrowRight,
  X,
  AlertOctagon
} from 'lucide-react';

const INITIAL_MOCK_EVIDENCE = [
  {
    id: 'ev-01',
    deliveryPointCode: 'EDU-01',
    sectorId: 'EDUCATION',
    layer: 1,
    questionNumber: 1,
    convergenceQuestion: 'Q1',
    resultingRuleId: 'RULE-REFERRAL-001',
    sourceType: 'REGISTER_EXTRACT',
    documentKind: 'REGISTER_EXTRACT',
    selectedOption: 'COMPLETE_REGISTER',
    sampleTotal: 10,
    sampleCompliant: 9,
    description: 'Documented student health screening and referral ledger index without individual student names.',
    files: [
      { fileName: 'EDU01_screening_register_index.pdf', fileSize: '340 KB', fileType: 'application/pdf' },
      { fileName: 'EDU01_referral_dispatch_leaf.jpg', fileSize: '1.2 MB', fileType: 'image/jpeg' }
    ],
    fileCount: 2,
    verificationStatus: 'PENDING_REVIEW',
    submittedByRole: 'ARYABHATA_FIELD_TEAM',
    createdAt: '2026-10-06T09:30:00Z',
    history: [
      {
        previousStatus: 'INITIAL_CAPTURE',
        newStatus: 'PENDING_REVIEW',
        verifierRole: 'ARYABHATA_FIELD_TEAM',
        justification: 'Field observation submitted with 2 anonymised register artifacts.',
        timestamp: '2026-10-06T09:30:00Z'
      }
    ]
  },
  {
    id: 'ev-02',
    deliveryPointCode: 'EDU-01',
    sectorId: 'EDUCATION',
    layer: 2,
    questionNumber: 2,
    convergenceQuestion: 'Q2',
    resultingRuleId: 'RULE-READINESS-002',
    sourceType: 'WALL_DISPLAY',
    documentKind: 'WALL_DISPLAY',
    selectedOption: 'FORMAL_ORDER_DISPLAYED',
    sampleTotal: null,
    sampleCompliant: null,
    description: 'Nodal teacher appointment order posted on institutional notice board.',
    files: [
      { fileName: 'EDU01_nodal_teacher_order_board.jpg', fileSize: '980 KB', fileType: 'image/jpeg' }
    ],
    fileCount: 1,
    verificationStatus: 'VERIFIED',
    submittedByRole: 'ARYABHATA_FIELD_TEAM',
    createdAt: '2026-10-06T10:15:00Z',
    history: [
      {
        previousStatus: 'PENDING_REVIEW',
        newStatus: 'VERIFIED',
        verifierRole: 'DISTRICT_NODAL_OFFICER',
        justification: 'Wall display verified on site; formal administrative order confirms teacher role.',
        timestamp: '2026-10-06T14:20:00Z'
      }
    ]
  },
  {
    id: 'ev-03',
    deliveryPointCode: 'HLT-01',
    sectorId: 'HEALTH_RBSK',
    layer: 3,
    questionNumber: 8,
    convergenceQuestion: 'Q3',
    resultingRuleId: 'RULE-FOLLOWUP-002',
    sourceType: 'PROCESS_DOCUMENT',
    documentKind: 'PROCESS_DOCUMENT',
    selectedOption: 'NEVER_RETURNED',
    sampleTotal: 12,
    sampleCompliant: 1,
    description: 'Log of unacknowledged referral counterfoils from secondary hospital beyond 14-day window.',
    files: [
      { fileName: 'HLT01_unclosed_referrals_log.pdf', fileSize: '420 KB', fileType: 'application/pdf' }
    ],
    fileCount: 1,
    verificationStatus: 'PENDING_REVIEW',
    submittedByRole: 'ARYABHATA_FIELD_TEAM',
    createdAt: '2026-10-06T11:45:00Z',
    history: [
      {
        previousStatus: 'INITIAL_CAPTURE',
        newStatus: 'PENDING_REVIEW',
        verifierRole: 'ARYABHATA_FIELD_TEAM',
        justification: 'Documented 11 unreturned referral slips over 14 days old.',
        timestamp: '2026-10-06T11:45:00Z'
      }
    ]
  },
  {
    id: 'ev-04',
    deliveryPointCode: 'WCD-01',
    sectorId: 'WCD_ANGANWADI',
    layer: 2,
    questionNumber: 12,
    convergenceQuestion: 'Q2',
    resultingRuleId: 'RULE-READINESS-002',
    sourceType: 'INFRASTRUCTURE',
    documentKind: 'INFRASTRUCTURE',
    selectedOption: 'AVAILABLE_NOT_FUNCTIONAL',
    sampleTotal: null,
    sampleCompliant: null,
    description: 'Infantometer spring broken; stadiometer calibration out by 4cm.',
    files: [
      { fileName: 'WCD01_infantometer_damage.jpg', fileSize: '1.4 MB', fileType: 'image/jpeg' },
      { fileName: 'WCD01_calibration_log_error.pdf', fileSize: '210 KB', fileType: 'application/pdf' }
    ],
    fileCount: 2,
    verificationStatus: 'PENDING_REVIEW',
    submittedByRole: 'ARYABHATA_FIELD_TEAM',
    createdAt: '2026-10-06T12:30:00Z',
    history: [
      {
        previousStatus: 'INITIAL_CAPTURE',
        newStatus: 'PENDING_REVIEW',
        verifierRole: 'ARYABHATA_FIELD_TEAM',
        justification: 'Photos and calibration register demonstrate equipment defect.',
        timestamp: '2026-10-06T12:30:00Z'
      }
    ]
  },
  {
    id: 'ev-05',
    deliveryPointCode: 'HLT-02',
    sectorId: 'HEALTH_RBSK',
    layer: 4,
    questionNumber: 9,
    convergenceQuestion: 'Q4',
    resultingRuleId: 'RULE-CLOSURE-004',
    sourceType: 'ANONYMISED_REFERRAL_RECORD',
    documentKind: 'PROCESS_DOCUMENT',
    selectedOption: 'CLOSURE_DOCUMENTED',
    sampleTotal: 8,
    sampleCompliant: 7,
    description: 'Adolescent clinic follow-up and clinical resolution file counter-signed by MOIC.',
    files: [
      { fileName: 'HLT02_closure_register_sample.pdf', fileSize: '510 KB', fileType: 'application/pdf' }
    ],
    fileCount: 1,
    verificationStatus: 'VERIFIED',
    submittedByRole: 'ARYABHATA_FIELD_TEAM',
    createdAt: '2026-10-06T13:10:00Z',
    history: [
      {
        previousStatus: 'PENDING_REVIEW',
        newStatus: 'VERIFIED',
        verifierRole: 'DISTRICT_NODAL_OFFICER',
        justification: 'MOIC counter-signatures and closure entries verified in clinical records.',
        timestamp: '2026-10-06T15:00:00Z'
      }
    ]
  },
  {
    id: 'ev-06',
    deliveryPointCode: 'EDU-02',
    sectorId: 'EDUCATION',
    layer: 1,
    questionNumber: 1,
    convergenceQuestion: 'Q1',
    resultingRuleId: 'RULE-REFERRAL-001',
    sourceType: 'REGISTER_EXTRACT',
    documentKind: 'REGISTER_EXTRACT',
    selectedOption: 'ANECDOTAL_ONLY',
    sampleTotal: null,
    sampleCompliant: null,
    description: 'Loose paper notes without bound institutional ledger or teacher signature.',
    files: [
      { fileName: 'EDU02_loose_notes_scan.jpg', fileSize: '850 KB', fileType: 'image/jpeg' }
    ],
    fileCount: 1,
    verificationStatus: 'REJECTED',
    submittedByRole: 'ARYABHATA_FIELD_TEAM',
    createdAt: '2026-10-06T14:00:00Z',
    history: [
      {
        previousStatus: 'PENDING_REVIEW',
        newStatus: 'REJECTED',
        verifierRole: 'DISTRICT_NODAL_OFFICER',
        justification: 'Unbound handwritten scrap sheets cannot qualify as institutional register per AEHT §6 standard.',
        timestamp: '2026-10-06T16:15:00Z'
      }
    ]
  }
];

export default function EvidenceVerificationView({ selectedDistrict }) {
  const [evidenceList, setEvidenceList] = useState(INITIAL_MOCK_EVIDENCE);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [dpFilter, setDpFilter] = useState('ALL');
  
  // Verification Modal State
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [targetStatus, setTargetStatus] = useState('VERIFIED');
  const [justification, setJustification] = useState('');
  const [actionError, setActionError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Preview & History Modal States
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyItem, setHistoryItem] = useState(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);

  const districtName = selectedDistrict?.name || 'Ranchi Rural';

  // Load evidence from backend if available
  useEffect(() => {
    async function fetchEvidence() {
      try {
        const token = localStorage.getItem('abhisaran_token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch('/api/v1/evidence', { headers });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setEvidenceList(data);
          }
        }
      } catch (err) {
        console.warn('API evidence fetch failed, using local pilot cache:', err);
      }
    }
    fetchEvidence();
  }, []);

  const handleOpenVerifyModal = (item, presetStatus = 'VERIFIED') => {
    setActiveItem(item);
    setTargetStatus(presetStatus);
    setJustification(
      presetStatus === 'VERIFIED'
        ? 'Institutional documentation and zero-PII compliance verified on site.'
        : presetStatus === 'REJECTED'
        ? 'Discrepancy observed; artifact does not meet AEHT §6 verification threshold.'
        : 'Factual discrepancy noted during exit debriefing; transitioning to corrected state.'
    );
    setActionError('');
    setVerifyModalOpen(true);
  };

  const handleExecuteVerification = async () => {
    if (!justification || justification.trim().length < 5) {
      setActionError('Audit justification must be at least 5 characters.');
      return;
    }

    setSubmitting(true);
    setActionError('');

    try {
      const token = localStorage.getItem('abhisaran_token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };

      const res = await fetch(`/api/v1/evidence/${activeItem.id}/verification`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          targetStatus,
          justification: justification.trim()
        })
      });

      if (!res.ok && res.status !== 404) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Verification failed with HTTP ${res.status}`);
      }
    } catch (err) {
      console.warn('Backend patch failed or offline, updating local state optimistically:', err.message);
    }

    // Optimistic State Update
    const newHistoryEntry = {
      previousStatus: activeItem.verificationStatus,
      newStatus: targetStatus,
      verifierRole: 'DISTRICT_NODAL_OFFICER',
      justification: justification.trim(),
      timestamp: new Date().toISOString()
    };

    setEvidenceList((prev) =>
      prev.map((item) => {
        if (item.id === activeItem.id) {
          return {
            ...item,
            verificationStatus: targetStatus,
            history: [newHistoryEntry, ...(item.history || [])]
          };
        }
        return item;
      })
    );

    setSubmitting(false);
    setVerifyModalOpen(false);
  };

  const filteredItems = evidenceList.filter((item) => {
    if (statusFilter !== 'ALL' && item.verificationStatus !== statusFilter) return false;
    if (sectorFilter !== 'ALL' && item.sectorId !== sectorFilter) return false;
    if (dpFilter !== 'ALL' && item.deliveryPointCode !== dpFilter) return false;
    return true;
  });

  const countByStatus = {
    ALL: evidenceList.length,
    PENDING_REVIEW: evidenceList.filter((i) => i.verificationStatus === 'PENDING_REVIEW').length,
    VERIFIED: evidenceList.filter((i) => i.verificationStatus === 'VERIFIED').length,
    REJECTED: evidenceList.filter((i) => i.verificationStatus === 'REJECTED').length,
    CORRECTED: evidenceList.filter((i) => i.verificationStatus === 'CORRECTED').length
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'VERIFIED':
        return <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><CheckCircle2 size={12} /> Verified</span>;
      case 'PENDING_REVIEW':
        return <span className="badge badge-amber" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12} /> Pending Review</span>;
      case 'REJECTED':
        return <span className="badge badge-red" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><XCircle size={12} /> Rejected</span>;
      case 'CORRECTED':
        return <span className="badge badge-blue" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><FileCheck2 size={12} /> Corrected</span>;
      default:
        return <span className="badge badge-neutral">{status}</span>;
    }
  };

  return (
    <div>
      {/* Header Banner */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
            <CheckSquare size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>
              Evidence & Document Verification Desk — {districtName}
            </h2>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              AEHT §6 & §17 Annexure B Protocol • Direct administrative oversight for uploaded source field artifacts
            </div>
          </div>
        </div>

        {/* Protocol Directives Card */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1.15rem',
            marginTop: '0.75rem',
            fontSize: '0.8125rem',
            color: 'var(--text-main)',
            lineHeight: 1.45
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '0.2rem' }}>
            <ShieldCheck size={16} />
            MANDATORY ADMINISTRATIVE QUALITY GATE
          </div>
          All multi-file attachments, photos, and register scans uploaded in <code>/source</code> must be inspected by the District Nodal Officer or designated reviewer. Only submissions transitioned to <strong style={{ color: '#16a34a' }}>VERIFIED</strong> or <strong style={{ color: 'var(--brand-primary)' }}>CORRECTED</strong> enter the deterministic scoring engine. Missing or unverified records remain <code style={{ color: 'var(--text-muted)' }}>NOT VERIFIED</code> and cannot be punitively scored as zero.
        </div>
      </div>

      {/* Filter Toolbar */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1rem', marginBottom: '1.25rem' }}>
        {/* Status Tab Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
          {[
            { id: 'ALL', label: `All Artifacts (${countByStatus.ALL})` },
            { id: 'PENDING_REVIEW', label: `Pending Review (${countByStatus.PENDING_REVIEW})`, badgeClass: 'badge-amber' },
            { id: 'VERIFIED', label: `Verified (${countByStatus.VERIFIED})`, badgeClass: 'badge-green' },
            { id: 'REJECTED', label: `Rejected (${countByStatus.REJECTED})`, badgeClass: 'badge-red' },
            { id: 'CORRECTED', label: `Factual Correction (${countByStatus.CORRECTED})`, badgeClass: 'badge-blue' }
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: isActive ? '1px solid var(--brand-primary)' : '1px solid var(--border-color)',
                  background: isActive ? 'var(--brand-primary)' : 'var(--bg-secondary)',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.8125rem',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Dropdowns */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Sector:
            </span>
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              style={{
                padding: '0.4rem 0.65rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-main)',
                fontSize: '0.8125rem'
              }}
            >
              <option value="ALL">All Sectors</option>
              <option value="EDUCATION">Education (Schools)</option>
              <option value="HEALTH_RBSK">Health / RBSK</option>
              <option value="WCD_ANGANWADI">WCD (Anganwadi)</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Delivery Point:
            </span>
            <select
              value={dpFilter}
              onChange={(e) => setDpFilter(e.target.value)}
              style={{
                padding: '0.4rem 0.65rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-main)',
                fontSize: '0.8125rem'
              }}
            >
              <option value="ALL">All Delivery Points</option>
              {Array.from(new Set(evidenceList.map((i) => i.deliveryPointCode))).map((code) => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
          </div>

          <div style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Showing <strong>{filteredItems.length}</strong> of {evidenceList.length} evidence records
          </div>
        </div>
      </div>

      {/* Evidence Cards List */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
        {filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
            <FileText size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
            <p>No evidence records found matching selected filters.</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              style={{
                background: 'var(--bg-card)',
                border: item.verificationStatus === 'PENDING_REVIEW' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {/* Header Badges */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-blue" style={{ fontWeight: 700 }}>
                    {item.deliveryPointCode}
                  </span>
                  <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                    {item.sectorId}
                  </span>
                  <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                    Layer {item.layer} • {item.convergenceQuestion}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'monospace' }}>
                    {item.resultingRuleId}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {getStatusBadge(item.verificationStatus)}
                </div>
              </div>

              {/* Observation & Description */}
              <div style={{ marginBottom: '0.85rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-heading)', marginBottom: '0.25rem' }}>
                  Observation: <span style={{ color: 'var(--brand-primary)' }}>{item.selectedOption.replace(/_/g, ' ')}</span>
                  {item.sampleTotal && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 400, marginLeft: '0.5rem' }}>
                      (Compliant: {item.sampleCompliant} / {item.sampleTotal})
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.45 }}>
                  {item.description}
                </p>
              </div>

              {/* Multi-File Uploaded Documents Box */}
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 1rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Attached Artifacts ({item.files?.length || item.fileCount || 1}):
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {(item.files || [{ fileName: item.attachmentRef || 'artifact_doc.pdf', fileSize: '450 KB', fileType: 'pdf' }]).map((f, idx) => {
                      const isPdf = f.fileType?.includes('pdf') || f.fileName?.toLowerCase().endsWith('.pdf');
                      return (
                        <span
                          key={idx}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            fontSize: '0.75rem',
                            padding: '0.25rem 0.55rem',
                            borderRadius: '4px',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-main)'
                          }}
                        >
                          {isPdf ? (
                            <FileText size={13} style={{ color: '#f87171' }} />
                          ) : (
                            <ImageIcon size={13} style={{ color: '#38bdf8' }} />
                          )}
                          <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={f.fileName}>
                            {f.fileName}
                          </span>
                          <span style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>({f.fileSize})</span>
                        </span>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setPreviewItem(item);
                    setPreviewModalOpen(true);
                  }}
                  style={{
                    background: 'none',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.35rem 0.65rem',
                    color: '#38bdf8',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <Eye size={13} /> Inspect Scan
                </button>
              </div>

              {/* Bottom Actions Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                  Submitted: {new Date(item.createdAt).toLocaleDateString()} • Category: <strong>{item.documentKind}</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setHistoryItem(item);
                      setHistoryModalOpen(true);
                    }}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <History size={13} /> Audit History ({item.history?.length || 1})
                  </button>

                  {item.verificationStatus === 'PENDING_REVIEW' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleOpenVerifyModal(item, 'VERIFIED')}
                        className="btn btn-primary"
                        style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#10b981', borderColor: '#10b981' }}
                      >
                        <CheckCircle2 size={13} /> Verify Artifact
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenVerifyModal(item, 'REJECTED')}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                      >
                        <XCircle size={13} /> Reject
                      </button>
                    </>
                  )}

                  {item.verificationStatus === 'VERIFIED' && (
                    <button
                      type="button"
                      onClick={() => handleOpenVerifyModal(item, 'CORRECTED')}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#60a5fa' }}
                    >
                      <FileCheck2 size={13} /> Factual Correction
                    </button>
                  )}

                  {item.verificationStatus === 'REJECTED' && (
                    <button
                      type="button"
                      onClick={() => handleOpenVerifyModal(item, 'CORRECTED')}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#fbbf24' }}
                    >
                      <CheckCircle2 size={13} /> Re-verify on Correction
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Verification Action Modal */}
      {verifyModalOpen && activeItem && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
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
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              width: '100%',
              maxWidth: '520px',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-xl)',
              color: 'var(--text-main)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-heading)' }}>
                <CheckSquare size={18} style={{ color: 'var(--brand-primary)' }} />
                Administrative Evidence Verification
              </h3>
              <button
                type="button"
                onClick={() => setVerifyModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.8125rem' }}>
              <div>Target Item: <strong>{activeItem.deliveryPointCode} ({activeItem.resultingRuleId})</strong></div>
              <div style={{ color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                Category: {activeItem.documentKind} • Current: <strong>{activeItem.verificationStatus}</strong>
              </div>
            </div>

            {/* Target Status Selection */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                Designated Verification State
              </label>
              <select
                value={targetStatus}
                onChange={(e) => setTargetStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem'
                }}
              >
                <option value="VERIFIED">VERIFIED (Accepted into Scoring Engine)</option>
                <option value="REJECTED">REJECTED (Non-compliant / Unverifiable)</option>
                <option value="CORRECTED">CORRECTED (Factual Correction Accepted)</option>
                <option value="NOT_VERIFIED">NOT_VERIFIED (Pending Subsequent Field Audit)</option>
              </select>
            </div>

            {/* Mandatory Justification */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                Administrative Justification & Review Notes (Mandatory)
              </label>
              <textarea
                rows={3}
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="e.g. Physical counterfoil register verified on site by District Nodal Officer without beneficiary personal details."
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8125rem',
                  resize: 'none'
                }}
              />
            </div>

            {actionError && (
              <div style={{ fontSize: '0.75rem', color: '#f87171', marginBottom: '1rem' }}>
                {actionError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setVerifyModalOpen(false)}
                className="btn btn-secondary"
                style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteVerification}
                disabled={submitting || !justification.trim()}
                className="btn btn-primary"
                style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <CheckCircle2 size={16} />
                {submitting ? 'Recording...' : 'Commit Verification'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Artifact Preview Modal */}
      {previewModalOpen && previewItem && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
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
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              width: '100%',
              maxWidth: '560px',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-xl)',
              color: 'var(--text-main)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-heading)' }}>
                <Eye size={18} style={{ color: 'var(--brand-primary)' }} />
                Inspecting Uploaded Evidence Artifacts
              </h3>
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.8125rem' }}>
              <div>Delivery Point: <strong>{previewItem.deliveryPointCode} ({previewItem.sectorId})</strong></div>
              <div>Convergence Inquiry: <strong>{previewItem.convergenceQuestion} (Layer {previewItem.layer})</strong></div>
              <div style={{ color: 'var(--text-dim)', marginTop: '0.35rem' }}>{previewItem.description}</div>
            </div>

            {/* List of files in artifact */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--brand-primary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Uploaded File Attachments ({previewItem.files?.length || 1})
              </div>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {(previewItem.files || [{ fileName: previewItem.attachmentRef, fileSize: '450 KB', fileType: 'pdf' }]).map((f, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      {f.fileType?.includes('pdf') || f.fileName?.toLowerCase().endsWith('.pdf') ? (
                        <FileText size={20} style={{ color: '#dc2626' }} />
                      ) : (
                        <ImageIcon size={20} style={{ color: 'var(--brand-primary)' }} />
                      )}
                      <div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-heading)' }}>{f.fileName}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Size: {f.fileSize} • Category: {previewItem.documentKind}</div>
                      </div>
                    </div>
                    <span className="badge badge-green" style={{ fontSize: '0.68rem' }}>Zero-PII Cleared</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Immutable History Modal */}
      {historyModalOpen && historyItem && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
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
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              width: '100%',
              maxWidth: '560px',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-xl)',
              color: 'var(--text-main)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-heading)' }}>
                <History size={18} style={{ color: 'var(--brand-primary)' }} />
                Immutable Verification Audit Trail
              </h3>
              <button
                type="button"
                onClick={() => setHistoryModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ maxHeight: '280px', overflowY: 'auto', marginBottom: '1.25rem' }}>
              {(historyItem.history || []).map((h, i) => (
                <div
                  key={i}
                  style={{
                    padding: '0.75rem',
                    borderLeft: '3px solid var(--brand-primary)',
                    background: 'var(--bg-secondary)',
                    borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                    marginBottom: '0.75rem',
                    fontSize: '0.8125rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--brand-primary)' }}>
                      {h.previousStatus} → <strong style={{ color: '#16a34a' }}>{h.newStatus}</strong>
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                      {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div style={{ color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                    {h.justification}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    Audited by: <strong>{h.verifierRole}</strong>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setHistoryModalOpen(false)}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
