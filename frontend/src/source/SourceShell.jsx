import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Wifi,
  WifiOff,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Send,
  RefreshCw,
  Layers,
  Inbox
} from 'lucide-react';
import QuestionCard from './QuestionCard';
import SchedulingGuard from './SchedulingGuard';
import ZeroPiiUploadModal from './ZeroPiiUploadModal';
import { OfflineQueueService } from './OfflineQueueService';

// Fallback question catalogue in case backend is offline or disconnected
const FALLBACK_QUESTIONS = [
  // EDUCATION
  { questionNumber: 1, sectorId: 'EDUCATION', layer: 1, convergenceQuestion: 'Q1', questionText: 'Is the documented student health screening / referral register maintained on site?', explanationWhy: 'Verifies if outgoing health needs and referrals are formally logged rather than handled ad-hoc.', evidenceRequirement: 'REGISTER_EXTRACT', resultingRuleId: 'RULE-REFERRAL-001', optionsJson: '{"options": ["COMPLETE_REGISTER", "PARTIAL_NOTES", "ANECDOTAL_ONLY", "ABSENT"]}' },
  { questionNumber: 2, sectorId: 'EDUCATION', layer: 2, convergenceQuestion: 'Q2', questionText: 'Are institutional duties and designated nodal teacher contacts clearly displayed?', explanationWhy: 'Checks whether designated staff are formally tasked with health follow-ups.', evidenceRequirement: 'WALL_DISPLAY', resultingRuleId: 'RULE-READINESS-002', optionsJson: '{"options": ["FORMAL_ORDER_DISPLAYED", "INFORMAL_ROLE", "UNASSIGNED"]}' },
  { questionNumber: 3, sectorId: 'EDUCATION', layer: 3, convergenceQuestion: 'Q3', questionText: 'Does the school receive formal acknowledgement of completed referrals from PHC/RBSK within 14 days?', explanationWhy: 'Evaluates cross-departmental hand-off loop and timeliness of counter-referral.', evidenceRequirement: 'PROCESS_DOCUMENT', resultingRuleId: 'RULE-TIME-003', optionsJson: '{"options": ["ROUTINE_RECEIPT_LOGGED", "OCCASIONAL_RECEIPT", "NEVER_RECEIVED"]}' },
  { questionNumber: 4, sectorId: 'EDUCATION', layer: 4, convergenceQuestion: 'Q4', questionText: 'Are remedial support or medical closure outcomes recorded in student continuity files?', explanationWhy: 'Verifies whether the child received required closure care or remedial intervention.', evidenceRequirement: 'ANONYMISED_REFERRAL_RECORD', resultingRuleId: 'RULE-CLOSURE-004', optionsJson: '{"options": ["CLOSURE_DOCUMENTED", "PENDING_FOLLOWUP", "UNTRACKED"]}' },
  { questionNumber: 5, sectorId: 'EDUCATION', layer: 5, convergenceQuestion: 'Q5', questionText: 'Does the school administration conduct monthly reviews of unresolved referrals?', explanationWhy: 'Checks ongoing institutional ownership and routine bottleneck diagnosis.', evidenceRequirement: 'PROCESS_DOCUMENT', resultingRuleId: 'RULE-SUSTAIN-005', optionsJson: '{"options": ["MONTHLY_MINUTES_PRESENT", "INFORMAL_REVIEW", "NO_REVIEW"]}' },

  // HEALTH_RBSK
  { questionNumber: 6, sectorId: 'HEALTH_RBSK', layer: 1, convergenceQuestion: 'Q1', questionText: 'Are RBSK screening cards and 4D referral slips documented in the facility register?', explanationWhy: 'Verifies formal recording of identified health conditions.', evidenceRequirement: 'REGISTER_EXTRACT', resultingRuleId: 'RULE-REFERRAL-001', optionsJson: '{"options": ["COMPLETE_REGISTER", "PARTIAL_NOTES", "ANECDOTAL_ONLY", "ABSENT"]}' },
  { questionNumber: 7, sectorId: 'HEALTH_RBSK', layer: 2, convergenceQuestion: 'Q2', questionText: 'Is the specialized referral diagnostic equipment functional at the touchpoint?', explanationWhy: 'Ensures institutional readiness to deliver secondary medical screening.', evidenceRequirement: 'INFRASTRUCTURE', resultingRuleId: 'RULE-READINESS-002', optionsJson: '{"options": ["FUNCTIONAL_AND_CALIBRATED", "PARTIALLY_FUNCTIONAL", "NON_FUNCTIONAL_ABSENT"]}' },
  { questionNumber: 8, sectorId: 'HEALTH_RBSK', layer: 3, convergenceQuestion: 'Q3', questionText: 'Does the receiving medical officer counter-sign and return referral slips to the referring school/centre?', explanationWhy: 'Checks cross-departmental bidirectional communication.', evidenceRequirement: 'PROCESS_DOCUMENT', resultingRuleId: 'RULE-FOLLOWUP-002', optionsJson: '{"options": ["COUNTER_SIGNED_SYSTEMATIC", "OCCASIONAL_SLIP", "NEVER_RETURNED"]}' },
  { questionNumber: 9, sectorId: 'HEALTH_RBSK', layer: 4, convergenceQuestion: 'Q4', questionText: 'Is treatment completion or secondary hospital referral closure logged?', explanationWhy: 'Assesses clinical closure documentation without claiming causal impact.', evidenceRequirement: 'ANONYMISED_REFERRAL_RECORD', resultingRuleId: 'RULE-CLOSURE-004', optionsJson: '{"options": ["CLOSURE_DOCUMENTED", "PENDING_FOLLOWUP", "UNTRACKED"]}' },
  { questionNumber: 10, sectorId: 'HEALTH_RBSK', layer: 5, convergenceQuestion: 'Q5', questionText: 'Is there a shared block-level coordination meeting record between Health and Education?', explanationWhy: 'Evaluates systemic sustainability and bottleneck resolution mechanisms.', evidenceRequirement: 'PROCESS_DOCUMENT', resultingRuleId: 'RULE-SUSTAIN-005', optionsJson: '{"options": ["JOINT_MINUTES_AVAILABLE", "AD_HOC_MEETINGS", "NO_COORDINATION"]}' },

  // WCD_ANGANWADI
  { questionNumber: 11, sectorId: 'WCD_ANGANWADI', layer: 1, convergenceQuestion: 'Q1', questionText: 'Are preschool growth monitoring and malnutrition referral registers documented?', explanationWhy: 'Verifies tracking of children identified as underweight.', evidenceRequirement: 'REGISTER_EXTRACT', resultingRuleId: 'RULE-REFERRAL-001', optionsJson: '{"options": ["COMPLETE_REGISTER", "PARTIAL_NOTES", "ANECDOTAL_ONLY", "ABSENT"]}' },
  { questionNumber: 12, sectorId: 'WCD_ANGANWADI', layer: 2, convergenceQuestion: 'Q2', questionText: 'Are functional stadiometers, infantometers, and growth charts present and calibrated?', explanationWhy: 'Assesses institutional readiness for accurate anthropometric screening.', evidenceRequirement: 'INFRASTRUCTURE', resultingRuleId: 'RULE-READINESS-002', optionsJson: '{"options": ["AVAILABLE_AND_FUNCTIONAL", "AVAILABLE_NOT_FUNCTIONAL", "ABSENT"]}' },
  { questionNumber: 13, sectorId: 'WCD_ANGANWADI', layer: 3, convergenceQuestion: 'Q3', questionText: 'Does the Anganwadi receive counter-referral notes from MTC / NRC / PHC?', explanationWhy: 'Checks departmental alignment for nutritional rehabilitation follow-up.', evidenceRequirement: 'PROCESS_DOCUMENT', resultingRuleId: 'RULE-FOLLOWUP-002', optionsJson: '{"options": ["COUNTER_SIGNED_SYSTEMATIC", "OCCASIONAL_SLIP", "NEVER_RETURNED"]}' },
  { questionNumber: 14, sectorId: 'WCD_ANGANWADI', layer: 4, convergenceQuestion: 'Q4', questionText: 'Is transition to primary school recorded with child development readiness profile?', explanationWhy: 'Assesses pathway continuity between early childhood and primary school.', evidenceRequirement: 'PROCESS_DOCUMENT', resultingRuleId: 'RULE-CLOSURE-004', optionsJson: '{"options": ["TRANSITION_PORTFOLIO_HANDED_OVER", "NAME_ONLY_SENT", "NO_TRANSITION_RECORD"]}' },
  { questionNumber: 15, sectorId: 'WCD_ANGANWADI', layer: 5, convergenceQuestion: 'Q5', questionText: 'Does the Anganwadi worker participate in scheduled VHSND joint reviews with ASHA and ANM?', explanationWhy: 'Verifies village health sanitation and nutrition day coordination sustainability.', evidenceRequirement: 'PROCESS_DOCUMENT', resultingRuleId: 'RULE-SUSTAIN-005', optionsJson: '{"options": ["ROUTINE_VHSND_MINUTES", "OCCASIONAL_JOINT_REVIEW", "NO_JOINT_REVIEW"]}' }
];

const DELIVERY_POINTS = [
  { code: 'EDU-01', name: 'EDU-01 (Govt Primary School, Block Central)', sector: 'EDUCATION' },
  { code: 'EDU-02', name: 'EDU-02 (Govt Middle School, Rural West)', sector: 'EDUCATION' },
  { code: 'HLT-01', name: 'HLT-01 (Primary Health Centre / PHC North)', sector: 'HEALTH_RBSK' },
  { code: 'HLT-02', name: 'HLT-02 (Community Health Centre / CHC East)', sector: 'HEALTH_RBSK' },
  { code: 'WCD-01', name: 'WCD-01 (Anganwadi Centre 14, Tribal Belt)', sector: 'WCD_ANGANWADI' },
  { code: 'WCD-02', name: 'WCD-02 (Anganwadi Centre 08, Semi-Urban)', sector: 'WCD_ANGANWADI' }
];

export default function SourceShell() {
  const [online, setOnline] = useState(navigator.onLine);
  const [activeLayer, setActiveLayer] = useState(1);
  const [deliveryPointCode, setDeliveryPointCode] = useState('EDU-01');
  const [questions, setQuestions] = useState(FALLBACK_QUESTIONS);
  const [recordedAnswers, setRecordedAnswers] = useState({});
  const [evidenceAttachments, setEvidenceAttachments] = useState({});
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [activeTargetQuestion, setActiveTargetQuestion] = useState(null);
  const [guardStatus, setGuardStatus] = useState({ isBlocked: false, hasWarning: false, reasons: [] });
  const [pendingDraftsCount, setPendingDraftsCount] = useState(OfflineQueueService.getQueueCount());
  const [syncStatusMsg, setSyncStatusMsg] = useState('');

  const currentDp = DELIVERY_POINTS.find((dp) => dp.code === deliveryPointCode) || DELIVERY_POINTS[0];
  const currentSector = currentDp.sector;

  const layers = [
    { num: 1, name: 'Beneficiary Experience', desc: 'Touchpoints & referrals' },
    { num: 2, name: 'Institutional Readiness', desc: 'Duty records & protocols' },
    { num: 3, name: 'Departmental Alignment', desc: 'Hand-off & feedback loops' },
    { num: 4, name: 'Outcome-Readiness', desc: 'Closure & follow-up records' },
    { num: 5, name: 'Sustainability', desc: 'Routine reviews & ownership' }
  ];

  // Monitor connectivity
  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch questions from API if online, or fallback
  useEffect(() => {
    async function loadQuestions() {
      if (!online) {
        setQuestions(FALLBACK_QUESTIONS);
        return;
      }
      try {
        const token = localStorage.getItem('abhisaran_token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(`/api/v1/source/questions?sector=${currentSector}`, { headers });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setQuestions(data);
            return;
          }
        }
      } catch (err) {
        console.warn('API question load failed, using local fallback:', err);
      }
      setQuestions(FALLBACK_QUESTIONS);
    }
    loadQuestions();
  }, [currentSector, online]);

  // Questions for active layer & sector
  const currentQuestions = questions.filter(
    (q) => (q.sectorId === currentSector || !q.sectorId) && q.layer === activeLayer
  );

  const handleSaveAnswer = (answerPayload) => {
    const key = `${deliveryPointCode}_${answerPayload.questionNumber}`;
    const updated = { ...recordedAnswers, [key]: answerPayload };
    setRecordedAnswers(updated);

    // Save/Enqueue to OfflineQueueService
    OfflineQueueService.enqueueDraft({
      deliveryPointCode,
      sector: currentSector,
      layer: activeLayer,
      ...answerPayload
    });
    setPendingDraftsCount(OfflineQueueService.getQueueCount());
  };

  const handleOpenUploadModal = (question) => {
    setActiveTargetQuestion(question);
    setUploadModalOpen(true);
  };

  const handleAttachEvidence = (evidenceData) => {
    const key = `${deliveryPointCode}_${evidenceData.questionNumber}`;
    setEvidenceAttachments({
      ...evidenceAttachments,
      [key]: evidenceData
    });
  };

  const handleSyncQueue = async () => {
    setSyncStatusMsg('Syncing queued field scans with district server...');
    const result = await OfflineQueueService.syncDrafts(async (draft) => {
      // Simulate API submit or post to /api/v1/source/evidence
      const token = localStorage.getItem('abhisaran_token');
      const res = await fetch('/api/v1/source/observations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(draft)
      });
      if (!res.ok && res.status !== 404) {
        throw new Error(`Sync failed with status ${res.status}`);
      }
      return true;
    });

    setPendingDraftsCount(OfflineQueueService.getQueueCount());
    setSyncStatusMsg(`Sync complete: ${result.syncedCount} uploaded.`);
    setTimeout(() => setSyncStatusMsg(''), 4000);
  };

  return (
    <div className="app-container" style={{ maxWidth: '680px', margin: '0 auto', background: '#0b1120', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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

      {/* Offline Queue Bar */}
      {pendingDraftsCount > 0 && (
        <div style={{ background: 'rgba(59, 130, 246, 0.15)', borderBottom: '1px solid rgba(59, 130, 246, 0.3)', padding: '0.5rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#93c5fd' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Inbox size={15} />
            <span>{pendingDraftsCount} observation draft(s) stored locally</span>
          </div>
          <button
            type="button"
            onClick={handleSyncQueue}
            className="btn btn-secondary"
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <RefreshCw size={12} /> Sync Now
          </button>
        </div>
      )}

      {syncStatusMsg && (
        <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '0.4rem 1rem', fontSize: '0.75rem', color: '#34d399', textAlign: 'center' }}>
          {syncStatusMsg}
        </div>
      )}

      {/* Delivery Point Selection */}
      <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--border-color)' }}>
        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Assigned Delivery Point
        </label>
        <select
          value={deliveryPointCode}
          onChange={(e) => setDeliveryPointCode(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'var(--bg-card)',
            color: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.9rem',
            fontWeight: 600
          }}
        >
          {DELIVERY_POINTS.map((dp) => (
            <option key={dp.code} value={dp.code}>
              {dp.name}
            </option>
          ))}
        </select>
      </div>

      {/* Scheduling Guard (AEHT §14 Protocol) */}
      <div style={{ padding: '0.85rem 1rem 0' }}>
        <SchedulingGuard
          sector={currentSector}
          deliveryPointId={deliveryPointCode}
          onGuardStatusChange={setGuardStatus}
        />
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

      {/* Main Content Area: Questions for Selected Layer */}
      <main style={{ padding: '1rem', flex: 1 }}>
        {guardStatus.isBlocked ? (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem 1.5rem',
              textAlign: 'center',
              color: '#fca5a5'
            }}
          >
            <AlertTriangle size={36} style={{ margin: '0 auto 1rem', color: '#f87171' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Field Scan Blocked for This Session</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.5, color: '#e2e8f0', maxWidth: '480px', margin: '0 auto' }}>
              The AEHT §14 field protocol prohibits scanning under current conditions:
            </p>
            <ul style={{ textAlign: 'left', display: 'inline-block', margin: '1rem auto', fontSize: '0.85rem' }}>
              {guardStatus.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        ) : currentQuestions.length > 0 ? (
          currentQuestions.map((q) => {
            const answerKey = `${deliveryPointCode}_${q.questionNumber}`;
            return (
              <QuestionCard
                key={q.questionNumber}
                question={q}
                recordedAnswer={recordedAnswers[answerKey]}
                evidenceAttachment={evidenceAttachments[answerKey]}
                onSaveAnswer={handleSaveAnswer}
                onOpenUploadModal={handleOpenUploadModal}
              />
            );
          })
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <Layers size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
            <p>No questions configured for Layer {activeLayer} in {currentSector}.</p>
          </div>
        )}
      </main>

      {/* Zero PII Upload Modal */}
      <ZeroPiiUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        targetQuestion={activeTargetQuestion}
        onAttachEvidence={handleAttachEvidence}
      />
    </div>
  );
}
