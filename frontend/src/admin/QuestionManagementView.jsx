import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  CheckCircle2,
  Filter,
  Search,
  ExternalLink,
  ShieldCheck,
  Layers,
  FileText,
  X,
  AlertCircle
} from 'lucide-react';
import { QuestionService } from '../data/questionService';

const SECTOR_LABELS = {
  EDUCATION: { label: 'Education (School)', color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
  HEALTH_RBSK: { label: 'Health / RBSK', color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0' },
  WCD_ANGANWADI: { label: 'WCD (Anganwadi)', color: '#ec4899', bg: '#fdf2f8', border: '#fbcfe8' }
};

const LAYER_NAMES = {
  1: 'Layer 1: Protocol & Screening',
  2: 'Layer 2: Readiness & Duty Orders',
  3: 'Layer 3: Cross-Department Feedback',
  4: 'Layer 4: Care Continuity & Closure',
  5: 'Layer 5: System Sustainability'
};

export default function QuestionManagementView({ isModal = false, onClose }) {
  const [questions, setQuestions] = useState([]);
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [selectedLayer, setSelectedLayer] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const loadQuestions = () => {
    setQuestions(QuestionService.getAllQuestions());
  };

  useEffect(() => {
    loadQuestions();
    const handleUpdate = () => loadQuestions();
    window.addEventListener('abhisaran_questions_updated', handleUpdate);
    return () => window.removeEventListener('abhisaran_questions_updated', handleUpdate);
  }, []);

  const showNotification = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  // Filter questions
  const filteredQuestions = questions.filter((q) => {
    if (selectedSector !== 'ALL' && q.sectorId !== selectedSector) return false;
    if (selectedLayer !== 'ALL' && Number(q.layer) !== Number(selectedLayer)) return false;
    if (searchQuery.trim()) {
      const qText = (q.questionText || '').toLowerCase();
      const qRule = (q.resultingRuleId || '').toLowerCase();
      const qWhy = (q.explanationWhy || '').toLowerCase();
      const qTerm = searchQuery.toLowerCase();
      return qText.includes(qTerm) || qRule.includes(qTerm) || qWhy.includes(qTerm);
    }
    return true;
  });

  const handleDelete = (qNum) => {
    if (window.confirm(`Are you sure you want to delete Question Q${qNum}? This will remove it from the field assessment tool.`)) {
      QuestionService.deleteQuestion(qNum);
      showNotification(`Deleted question Q${qNum}.`);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all questions to default AEHT baseline catalogue? Custom additions and edits will be reverted.')) {
      QuestionService.resetToDefaults();
      showNotification('Questions restored to standard AEHT baseline catalogue.');
    }
  };

  const handleOpenEdit = (q) => {
    setIsCreatingNew(false);
    let optionsArray = ['COMPLIANT', 'PARTIAL', 'ABSENT'];
    try {
      if (q.optionsJson) {
        const parsed = JSON.parse(q.optionsJson);
        if (Array.isArray(parsed.options)) optionsArray = parsed.options;
      }
    } catch (e) {
      // ignore
    }
    setEditingQuestion({
      ...q,
      optionsText: optionsArray.join(', ')
    });
  };

  const handleOpenNew = () => {
    setIsCreatingNew(true);
    const nextNum = questions.length > 0 ? Math.max(...questions.map((q) => q.questionNumber || 0)) + 1 : 1;
    setEditingQuestion({
      questionNumber: nextNum,
      sectorId: selectedSector !== 'ALL' ? selectedSector : 'EDUCATION',
      layer: selectedLayer !== 'ALL' ? Number(selectedLayer) : 1,
      convergenceQuestion: 'Q1',
      questionText: '',
      explanationWhy: '',
      evidenceRequirement: 'REGISTER_EXTRACT',
      resultingRuleId: `RULE-CUSTOM-${nextNum}`,
      optionsText: 'COMPLETE_REGISTER, PARTIAL_NOTES, ANECDOTAL_ONLY, ABSENT'
    });
  };

  const handleSaveQuestion = (e) => {
    e.preventDefault();
    if (!editingQuestion.questionText?.trim()) {
      alert('Question text is required.');
      return;
    }

    const options = editingQuestion.optionsText
      .split(',')
      .map((s) => s.trim().toUpperCase().replace(/\s+/g, '_'))
      .filter(Boolean);

    const payload = {
      questionNumber: Number(editingQuestion.questionNumber),
      sectorId: editingQuestion.sectorId,
      layer: Number(editingQuestion.layer),
      convergenceQuestion: editingQuestion.convergenceQuestion || 'Q1',
      questionText: editingQuestion.questionText.trim(),
      explanationWhy: editingQuestion.explanationWhy?.trim() || '',
      evidenceRequirement: editingQuestion.evidenceRequirement?.trim() || 'PROCESS_DOCUMENT',
      resultingRuleId: editingQuestion.resultingRuleId?.trim() || `RULE-Q${editingQuestion.questionNumber}`,
      optionsJson: JSON.stringify({ options: options.length > 0 ? options : ['YES', 'PARTIAL', 'NO'] })
    };

    if (isCreatingNew) {
      QuestionService.addQuestion(payload);
      showNotification(`Added new Question Q${payload.questionNumber}!`);
    } else {
      QuestionService.updateQuestion(payload.questionNumber, payload);
      showNotification(`Updated Question Q${payload.questionNumber}!`);
    }
    setEditingQuestion(null);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isModal ? '1rem' : '0' }}>
      {/* Header banner */}
      <div
        className="card-lift"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-blue">Field Quiz Setup</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Total Questions: <strong>{questions.length}</strong>
            </span>
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-heading)' }}>
            Continuity Assessment Question Catalogue
          </h2>
          <p style={{ margin: '0.3rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Check, customize, add, or remove questions used across Education, Health/RBSK, and Anganwadi in the field scan tool.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => window.open('/ref/abhisaran-field-form.html', '_blank')}
            className="btn btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}
            title="Open the 67-question baseline survey reference form"
          >
            <ExternalLink size={14} /> 67-Q Baseline Form
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="btn btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}
            title="Reset questions to standard AEHT baseline"
          >
            <RotateCcw size={14} /> Restore Baseline
          </button>

          <button
            type="button"
            onClick={handleOpenNew}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 600 }}
          >
            <Plus size={16} /> Add Question
          </button>

          {isModal && onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.4rem', color: 'var(--text-muted)' }}
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {feedbackMsg && (
        <div
          style={{
            background: 'var(--band-green-bg)',
            border: '1px solid var(--band-green-border)',
            color: 'var(--band-green-text)',
            padding: '0.65rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <CheckCircle2 size={16} />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.85rem'
        }}
      >
        {/* Sector Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: '0.3rem' }}>
            Sector:
          </span>
          {['ALL', 'EDUCATION', 'HEALTH_RBSK', 'WCD_ANGANWADI'].map((sec) => {
            const isSelected = selectedSector === sec;
            const meta = SECTOR_LABELS[sec] || { label: 'All Sectors' };
            return (
              <button
                key={sec}
                type="button"
                onClick={() => setSelectedSector(sec)}
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  padding: '0.3rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  border: isSelected ? '1px solid var(--brand-primary)' : '1px solid var(--border-color)',
                  background: isSelected ? 'var(--brand-primary)' : 'var(--bg-card)',
                  color: isSelected ? '#ffffff' : 'var(--text-main)',
                  cursor: 'pointer'
                }}
              >
                {meta.label}
              </button>
            );
          })}
        </div>

        {/* Layer Selector & Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>Layer:</span>
            <select
              value={selectedLayer}
              onChange={(e) => setSelectedLayer(e.target.value)}
              className="select-field"
              style={{ fontSize: '0.78rem', padding: '0.3rem 0.5rem', borderRadius: 'var(--radius-sm)' }}
            >
              <option value="ALL">All Layers (1–5)</option>
              <option value="1">Layer 1: Protocol</option>
              <option value="2">Layer 2: Readiness</option>
              <option value="3">Layer 3: Feedback</option>
              <option value="4">Layer 4: Continuity</option>
              <option value="5">Layer 5: Sustainability</option>
            </select>
          </div>

          <div style={{ position: 'relative', minWidth: '220px' }}>
            <Search size={14} style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search question text or rule..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ fontSize: '0.78rem', padding: '0.35rem 0.6rem 0.35rem 1.8rem', width: '100%', borderRadius: 'var(--radius-sm)' }}
            />
          </div>
        </div>
      </div>

      {/* Questions Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {filteredQuestions.length === 0 ? (
          <div
            style={{
              gridColumn: '1 / -1',
              padding: '3rem 1rem',
              textAlign: 'center',
              background: 'var(--bg-card)',
              border: '1px dashed var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              color: 'var(--text-muted)'
            }}
          >
            <AlertCircle size={28} style={{ margin: '0 auto 0.5rem', opacity: 0.6 }} />
            <h4 style={{ margin: '0 0 0.3rem', color: 'var(--text-heading)' }}>No questions match your filter</h4>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>Try clearing your search query or add a new question.</p>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const sectorMeta = SECTOR_LABELS[q.sectorId] || { label: q.sectorId, color: '#64748b', bg: '#f1f5f9', border: '#cbd5e1' };
            let options = [];
            try {
              if (q.optionsJson) options = JSON.parse(q.optionsJson).options || [];
            } catch (e) {
              // ignore
            }

            return (
              <div
                key={q.questionNumber}
                className="card-lift"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.15rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div>
                  {/* Card top badges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          background: 'var(--brand-primary-light)',
                          color: 'var(--brand-primary)',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px'
                        }}
                      >
                        Q{q.questionNumber}
                      </span>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          color: sectorMeta.color,
                          background: sectorMeta.bg,
                          border: `1px solid ${sectorMeta.border}`
                        }}
                      >
                        {sectorMeta.label}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                        Layer {q.layer}
                      </span>
                      <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>
                        {q.convergenceQuestion || 'Q' + q.questionNumber}
                      </span>
                    </div>
                  </div>

                  {/* Question text */}
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.5rem', color: 'var(--text-heading)', lineHeight: 1.4 }}>
                    {q.questionText}
                  </h4>

                  {/* Why rationale */}
                  {q.explanationWhy && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.75rem', lineHeight: 1.45 }}>
                      <strong style={{ color: 'var(--text-main)' }}>Why:</strong> {q.explanationWhy}
                    </p>
                  )}

                  {/* Options preview */}
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Answer Choices ({options.length}):
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {options.map((opt, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 600,
                            padding: '0.15rem 0.4rem',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '3px',
                            color: 'var(--text-main)'
                          }}
                        >
                          {opt}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Meta tag info */}
                  <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.72rem', color: 'var(--text-dim)', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
                    <span>Rule: <code style={{ fontSize: '0.7rem' }}>{q.resultingRuleId}</code></span>
                    <span>Evidence: <strong>{q.evidenceRequirement}</strong></span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem', paddingTop: '0.65rem', borderTop: '1px solid var(--border-color)' }}>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(q)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <Edit2 size={13} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(q.questionNumber)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', color: 'var(--band-red-text)', borderColor: 'var(--band-red-border)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit / Add Modal */}
      {editingQuestion && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(3px)',
            zIndex: 10000,
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
              maxWidth: '620px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-lg)'
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
              <div>
                <span className="badge badge-blue">
                  {isCreatingNew ? 'Add New Question' : `Edit Question Q${editingQuestion.questionNumber}`}
                </span>
                <h3 style={{ margin: '0.35rem 0 0', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                  {isCreatingNew ? 'Create Assessment Question' : `Edit Q${editingQuestion.questionNumber} Parameters`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingQuestion(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveQuestion} style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="field-label">Question Number:</label>
                  <input
                    type="number"
                    className="input-field"
                    value={editingQuestion.questionNumber}
                    disabled={!isCreatingNew}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, questionNumber: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="field-label">Convergence Code (e.g. Q1..Q5):</label>
                  <input
                    type="text"
                    className="input-field"
                    value={editingQuestion.convergenceQuestion || 'Q1'}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, convergenceQuestion: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="field-label">Sector:</label>
                  <select
                    className="select-field"
                    value={editingQuestion.sectorId}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, sectorId: e.target.value })}
                  >
                    <option value="EDUCATION">Education (School)</option>
                    <option value="HEALTH_RBSK">Health / RBSK</option>
                    <option value="WCD_ANGANWADI">WCD (Anganwadi)</option>
                  </select>
                </div>

                <div>
                  <label className="field-label">Continuity Layer:</label>
                  <select
                    className="select-field"
                    value={editingQuestion.layer}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, layer: Number(e.target.value) })}
                  >
                    <option value={1}>Layer 1: Protocol & Screening</option>
                    <option value={2}>Layer 2: Readiness & Duty Orders</option>
                    <option value={3}>Layer 3: Cross-Department Feedback</option>
                    <option value={4}>Layer 4: Care Continuity & Closure</option>
                    <option value={5}>Layer 5: System Sustainability</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="field-label">Question Text:</label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={editingQuestion.questionText}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, questionText: e.target.value })}
                  placeholder="Enter clear, verifiable field assessment question..."
                  required
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="field-label">Explanation / Rationale ("Why am I collecting this?"):</label>
                <textarea
                  className="input-field"
                  rows={2}
                  value={editingQuestion.explanationWhy}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, explanationWhy: e.target.value })}
                  placeholder="Explains the operational continuity purpose to field officers..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="field-label">Evidence Requirement:</label>
                  <select
                    className="select-field"
                    value={editingQuestion.evidenceRequirement}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, evidenceRequirement: e.target.value })}
                  >
                    <option value="REGISTER_EXTRACT">Register Extract (Index / Logs)</option>
                    <option value="WALL_DISPLAY">Wall Display / Institutional Notice</option>
                    <option value="PROCESS_DOCUMENT">Process Document / Minutes</option>
                    <option value="ANONYMISED_REFERRAL_RECORD">Anonymised Referral Slip</option>
                    <option value="INFRASTRUCTURE">Infrastructure Calibration</option>
                    <option value="BASELINE_SURVEY_REPORT">Baseline Survey PDF Report</option>
                  </select>
                </div>

                <div>
                  <label className="field-label">Resulting Rule ID:</label>
                  <input
                    type="text"
                    className="input-field"
                    value={editingQuestion.resultingRuleId}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, resultingRuleId: e.target.value })}
                    placeholder="e.g. RULE-REFERRAL-001"
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label className="field-label">Answer Choices (comma-separated):</label>
                <input
                  type="text"
                  className="input-field"
                  value={editingQuestion.optionsText}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, optionsText: e.target.value })}
                  placeholder="COMPLETE_REGISTER, PARTIAL_NOTES, ANECDOTAL_ONLY, ABSENT"
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
                  Options define the selectable observations for field officers (e.g. COMPLIANT, PARTIAL, ABSENT).
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setEditingQuestion(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ fontWeight: 700 }}
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
