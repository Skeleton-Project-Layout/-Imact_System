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
  Inbox,
  MapPin,
  Sparkles,
  Settings,
  HelpCircle
} from 'lucide-react';
import QuestionCard from './QuestionCard';
import SchedulingGuard from './SchedulingGuard';
import ZeroPiiUploadModal from './ZeroPiiUploadModal';
import BaselineQuizModal from './BaselineQuizModal';
import { OfflineQueueService } from './OfflineQueueService';
import { MEGHALAYA_DISTRICTS, getDistrictById } from '../data/districts';
import { QuestionService } from '../data/questionService';
import QuestionManagementView from '../admin/QuestionManagementView';
import ThemeToggle from '../ThemeToggle';

export default function SourceShell() {
  const [online, setOnline] = useState(navigator.onLine);
  const [activeLayer, setActiveLayer] = useState(1);
  
  // Operational District selection state (Default: East Khasi Hills, Meghalaya)
  const [districtId, setDistrictId] = useState(() => {
    return localStorage.getItem('abhisaran_field_district') || localStorage.getItem('abhisaran_monitored_district') || 'east-khasi-hills';
  });

  const allDistricts = React.useMemo(() => {
    try {
      const saved = localStorage.getItem('abhisaran_custom_districts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const customIds = new Set(parsed.map((d) => d.id));
          return [...MEGHALAYA_DISTRICTS.filter((d) => !customIds.has(d.id)), ...parsed];
        }
      }
    } catch (e) {
      console.warn(e);
    }
    return MEGHALAYA_DISTRICTS;
  }, []);

  const activeDistrict = allDistricts.find((d) => d.id === districtId || d.code === districtId) || getDistrictById(districtId);
  const availableDeliveryPoints = activeDistrict.deliveryPoints || [];

  const [deliveryPointCode, setDeliveryPointCode] = useState(() => {
    return availableDeliveryPoints[0]?.code || 'EKH-EDU-01';
  });

  const [questions, setQuestions] = useState(() => QuestionService.getAllQuestions());
  const [questionSetupModalOpen, setQuestionSetupModalOpen] = useState(false);
  const [recordedAnswers, setRecordedAnswers] = useState({});
  const [evidenceAttachments, setEvidenceAttachments] = useState({});
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [activeTargetQuestion, setActiveTargetQuestion] = useState(null);
  const [quizTargetQuestion, setQuizTargetQuestion] = useState(null);
  const [guardStatus, setGuardStatus] = useState({ isBlocked: false, hasWarning: false, reasons: [] });
  const [pendingDraftsCount, setPendingDraftsCount] = useState(OfflineQueueService.getQueueCount());
  const [syncStatusMsg, setSyncStatusMsg] = useState('');

  const currentDp = availableDeliveryPoints.find((dp) => dp.code === deliveryPointCode) || availableDeliveryPoints[0] || { code: 'EDU-01', sector: 'EDUCATION', name: 'EDU-01' };
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

  const handleDistrictChange = (newDistrictId) => {
    setDistrictId(newDistrictId);
    localStorage.setItem('abhisaran_field_district', newDistrictId);
    const newDist = allDistricts.find((d) => d.id === newDistrictId) || getDistrictById(newDistrictId);
    if (newDist.deliveryPoints && newDist.deliveryPoints.length > 0) {
      setDeliveryPointCode(newDist.deliveryPoints[0].code);
    }
  };

  // Subscribe to real-time question catalogue updates from Question Setup
  useEffect(() => {
    const handleQuestionsUpdate = () => {
      setQuestions(QuestionService.getAllQuestions());
    };
    window.addEventListener('abhisaran_questions_updated', handleQuestionsUpdate);
    return () => window.removeEventListener('abhisaran_questions_updated', handleQuestionsUpdate);
  }, []);

  // Fetch questions from API if online, or fallback to local QuestionService catalogue
  useEffect(() => {
    async function loadQuestions() {
      if (!online) {
        setQuestions(QuestionService.getAllQuestions());
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
        console.warn('API question load failed, using local QuestionService catalogue:', err);
      }
      setQuestions(QuestionService.getAllQuestions());
    }
    loadQuestions();
  }, [currentSector, online]);

  // Questions for active layer & sector
  const currentQuestions = questions.filter(
    (q) => (q.sectorId === currentSector || !q.sectorId) && q.layer === activeLayer
  );

  const handleSaveAnswer = (answerPayload) => {
    const key = `${deliveryPointCode}_${answerPayload.questionNumber}`;
    const existingAttachment = evidenceAttachments[key] || answerPayload.attachment;
    const completePayload = {
      ...answerPayload,
      attachment: existingAttachment
    };
    const updated = { ...recordedAnswers, [key]: completePayload };
    setRecordedAnswers(updated);

    // Save/Enqueue to OfflineQueueService
    OfflineQueueService.enqueueDraft({
      districtId: activeDistrict.id,
      districtName: activeDistrict.name,
      deliveryPointCode,
      sector: currentSector,
      layer: activeLayer,
      ...completePayload
    });
    setPendingDraftsCount(OfflineQueueService.getQueueCount());
  };

  const handleOpenUploadModal = (question) => {
    setActiveTargetQuestion(question);
    setUploadModalOpen(true);
  };

  const handleAttachEvidence = (evidenceData) => {
    const key = `${deliveryPointCode}_${evidenceData.questionNumber}`;
    setEvidenceAttachments((prev) => ({
      ...prev,
      [key]: evidenceData
    }));

    // If answer is already recorded, update queue with new attachments
    if (recordedAnswers[key]) {
      const updatedAnswer = {
        ...recordedAnswers[key],
        attachment: evidenceData
      };
      setRecordedAnswers((prev) => ({
        ...prev,
        [key]: updatedAnswer
      }));
      OfflineQueueService.enqueueDraft({
        districtId: activeDistrict.id,
        districtName: activeDistrict.name,
        deliveryPointCode,
        sector: currentSector,
        layer: activeLayer,
        ...updatedAnswer
      });
      setPendingDraftsCount(OfflineQueueService.getQueueCount());
    }
  };

  const handleOpenQuizModal = (question) => {
    const targetQ = question || currentQuestions[0] || questions[0];
    setActiveTargetQuestion(targetQ);
    setQuizTargetQuestion(targetQ);
    setQuizModalOpen(true);
  };

  const handleDirectAttachPdf = (evidencePayload, questionNumber) => {
    const targetQNum = questionNumber || evidencePayload?.questionNumber || 1;
    const key = `${deliveryPointCode}_${targetQNum}`;

    setEvidenceAttachments((prev) => ({
      ...prev,
      [key]: evidencePayload
    }));

    if (recordedAnswers[key]) {
      const updatedAnswer = {
        ...recordedAnswers[key],
        attachment: evidencePayload
      };
      setRecordedAnswers((prev) => ({
        ...prev,
        [key]: updatedAnswer
      }));
      OfflineQueueService.enqueueDraft({
        districtId: activeDistrict.id,
        districtName: activeDistrict.name,
        deliveryPointCode,
        sector: currentSector,
        layer: activeLayer,
        ...updatedAnswer
      });
      setPendingDraftsCount(OfflineQueueService.getQueueCount());
    } else {
      const defaultAnswer = {
        questionNumber: targetQNum,
        resultingRuleId: evidencePayload.resultingRuleId,
        selectedOption: 'COMPLIANT_AND_VERIFIED',
        attachment: evidencePayload,
        notes: `Auto-attached verified baseline survey report: ${evidencePayload.fileName}`
      };
      setRecordedAnswers((prev) => ({
        ...prev,
        [key]: defaultAnswer
      }));
      OfflineQueueService.enqueueDraft({
        districtId: activeDistrict.id,
        districtName: activeDistrict.name,
        deliveryPointCode,
        sector: currentSector,
        layer: activeLayer,
        ...defaultAnswer
      });
      setPendingDraftsCount(OfflineQueueService.getQueueCount());
    }

    setSyncStatusMsg(`✅ Baseline PDF attached to Verified Artifacts for Question Q${targetQNum}!`);
    setTimeout(() => setSyncStatusMsg(''), 4500);
  };

  // Global listener for postMessage if user submits via popup/tab
  useEffect(() => {
    const handleGlobalPdfMessage = (event) => {
      if (!event.data || event.data.type !== 'ABHISARAN_PDF_EXPORTED') return;
      const { fileName, dataUrl, byteLength } = event.data;
      const targetQ = quizTargetQuestion || currentQuestions[0] || questions[0];
      const qNum = targetQ?.questionNumber || 1;

      const formatSize = (bytes) => {
        if (!bytes) return '15 KB';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
      };

      const finalName = fileName || `Baseline_Survey_${deliveryPointCode}_Q${qNum}.pdf`;
      const payload = {
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
        description: `Verified Baseline Assessment PDF report generated via Reference Field Quiz tool for ${deliveryPointCode}.`,
        piiConfirmedAt: new Date().toISOString(),
        questionNumber: qNum,
        resultingRuleId: targetQ?.resultingRuleId || `RULE-Q${qNum}`,
        dataUrl
      };

      handleDirectAttachPdf(payload, qNum);
    };

    window.addEventListener('message', handleGlobalPdfMessage);
    return () => window.removeEventListener('message', handleGlobalPdfMessage);
  }, [quizTargetQuestion, currentQuestions, questions, deliveryPointCode]);

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
    <div className="app-container" style={{ maxWidth: '680px', margin: '0 auto', background: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }}>
      {/* National Civic Ribbon */}
      <div className="civic-ribbon" />

      {/* Top Mobile Bar */}
      <header className="top-bar" style={{ padding: '0.75rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em' }}>ABHISARAN SOURCE</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-heading)' }}>Field Evidence Collection</div>
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
          <ThemeToggle />
        </div>
      </header>

      {/* Zero-PII Mandatory Safety Header */}
      <div style={{ background: 'var(--band-red-bg)', borderBottom: '1px solid var(--band-red-border)', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--band-red-text)' }}>
        <ShieldCheck size={16} style={{ flexShrink: 0 }} />
        <span><strong>ZERO-PII POLICY:</strong> Never record names, phone numbers, Aadhaar, or take photos showing faces of children or staff.</span>
      </div>

      {/* Offline Queue Bar */}
      {pendingDraftsCount > 0 && (
        <div style={{ background: 'rgba(59, 130, 246, 0.12)', borderBottom: '1px solid rgba(59, 130, 246, 0.25)', padding: '0.5rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--brand-primary)' }}>
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
        <div style={{ background: 'var(--band-green-bg)', borderBottom: '1px solid var(--band-green-border)', padding: '0.4rem 1rem', fontSize: '0.75rem', color: 'var(--band-green-text)', textAlign: 'center' }}>
          {syncStatusMsg}
        </div>
      )}

      {/* Operational District & Delivery Point Selection Bar */}
      <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', background: 'var(--bg-card)' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Operational District
          </label>
          <select
            value={districtId}
            onChange={(e) => handleDistrictChange(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 0.75rem',
              background: 'var(--bg-secondary)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
          >
            {allDistricts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} {d.status === 'PILOT_ACTIVE' ? '★' : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Delivery Point ({availableDeliveryPoints.length})
          </label>
          <select
            value={deliveryPointCode}
            onChange={(e) => setDeliveryPointCode(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 0.75rem',
              background: 'var(--bg-secondary)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
          >
            {availableDeliveryPoints.map((dp) => (
              <option key={dp.code} value={dp.code}>
                {dp.code}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Scheduling Guard (AEHT §14 Protocol) */}
      <div style={{ padding: '0.85rem 1rem 0' }}>
        <SchedulingGuard
          sector={currentSector}
          deliveryPointId={deliveryPointCode}
          onGuardStatusChange={setGuardStatus}
        />
      </div>

      {/* 5-Layer Stepper & Baseline Quiz Setup */}
      <div style={{ display: 'flex', overflowX: 'auto', padding: '0.75rem 1rem', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          {layers.map((l) => (
            <button
              key={l.num}
              onClick={() => setActiveLayer(l.num)}
              style={{
                padding: '0.5rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: activeLayer === l.num ? '1px solid var(--brand-primary)' : '1px solid var(--border-color)',
                background: activeLayer === l.num ? 'var(--brand-primary)' : 'var(--bg-card)',
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

        {/* Action Buttons: Question Setup & Reference Quiz */}
        <div style={{ display: 'flex', gap: '0.4rem', marginLeft: 'auto', flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => setQuestionSetupModalOpen(true)}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-card)',
              color: 'var(--text-main)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontSize: '0.8125rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
            title="Configure questions: Check, Change, Add, and Delete"
          >
            <Settings size={14} style={{ color: 'var(--brand-primary)' }} />
            <span>⚙️ Question Setup</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenQuizModal(currentQuestions[0] || questions[0])}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(245, 158, 11, 0.5)',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2))',
              color: '#d97706',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontSize: '0.8125rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
            }}
            title="Open reference baseline survey setup and attach signed PDF artifact"
          >
            <Sparkles size={14} style={{ color: '#f59e0b' }} />
            <span>⚡ Reference Form (Q1-Q67)</span>
          </button>
        </div>
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
                onOpenQuizModal={handleOpenQuizModal}
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

      {/* Multi-File Zero PII Upload Modal */}
      <ZeroPiiUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        targetQuestion={activeTargetQuestion}
        onAttachEvidence={handleAttachEvidence}
      />

      {/* Baseline Quiz Reference Form Modal */}
      <BaselineQuizModal
        isOpen={quizModalOpen}
        onClose={() => setQuizModalOpen(false)}
        targetQuestion={quizTargetQuestion || currentQuestions[0] || questions[0]}
        allQuestions={questions.filter((q) => q.sectorId === currentSector || !q.sectorId)}
        deliveryPointCode={deliveryPointCode}
        onAttachPdf={handleDirectAttachPdf}
        onOpenQuestionSetup={() => {
          setQuizModalOpen(false);
          setQuestionSetupModalOpen(true);
        }}
      />

      {/* Question Management Setup Modal (Check, Change, Add, Delete) */}
      {questionSetupModalOpen && (
        <QuestionManagementView
          isModal={true}
          onClose={() => setQuestionSetupModalOpen(false)}
        />
      )}
    </div>
  );
}
