import React, { useState, useEffect } from 'react';
import { Calendar, AlertCircle, AlertTriangle, CheckCircle2, UserCheck, ShieldAlert } from 'lucide-react';

export default function SchedulingGuard({
  sector,
  deliveryPointId,
  hasFemaleTeamMember = true,
  onGuardStatusChange
}) {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [femaleMember, setFemaleMember] = useState(hasFemaleTeamMember);
  const [isExamPeriod, setIsExamPeriod] = useState(false);

  // Determine day of week (0 = Sunday, 3 = Wednesday, etc.)
  const dateObj = new Date(selectedDate);
  const dayOfWeek = dateObj.getDay(); // 3 = Wednesday

  // Rules from AEHT §14:
  // 1. Health / WCD: Routine Immunisation (RI) day is Wednesday -> Block or alert
  const isImmunisationDay = dayOfWeek === 3 && (sector === 'HEALTH_RBSK' || sector === 'WCD_ANGANWADI');

  // 2. Education: School Exam Period (toggleable or check month e.g., March/April or user flag)
  const isSchoolExamBlocked = sector === 'EDUCATION' && isExamPeriod;

  // 3. WCD / Anganwadi: Team must have at least one female team member
  const lacksFemaleMember = sector === 'WCD_ANGANWADI' && !femaleMember;

  // Compute overall status
  const isBlocked = isSchoolExamBlocked || (dayOfWeek === 0) || (dayOfWeek === 3 && sector === 'HEALTH_RBSK');
  const hasWarning = isImmunisationDay || lacksFemaleMember || (!femaleMember && sector === 'EDUCATION');

  useEffect(() => {
    if (onGuardStatusChange) {
      onGuardStatusChange({
        isBlocked,
        hasWarning,
        reasons: [
          isSchoolExamBlocked ? 'School examination in progress: field scans prohibited during exams (AEHT §14).' : null,
          isImmunisationDay ? 'Designated Routine Immunisation (RI) day: health staff should not be distracted.' : null,
          lacksFemaleMember ? 'Anganwadi protocol requires at least one female field team member (AEHT §14).' : null,
          dayOfWeek === 0 ? 'Sunday / Institutional closure day.' : null
        ].filter(Boolean)
      });
    }
  }, [isBlocked, hasWarning, isSchoolExamBlocked, isImmunisationDay, lacksFemaleMember, dayOfWeek, onGuardStatusChange]);

  return (
    <div
      style={{
        background: isBlocked
          ? 'rgba(239, 68, 68, 0.12)'
          : hasWarning
          ? 'rgba(245, 158, 11, 0.12)'
          : 'rgba(16, 185, 129, 0.08)',
        border: `1px solid ${
          isBlocked
            ? 'rgba(239, 68, 68, 0.4)'
            : hasWarning
            ? 'rgba(245, 158, 11, 0.4)'
            : 'rgba(16, 185, 129, 0.3)'
        }`,
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem 1rem',
        marginBottom: '1rem'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={16} style={{ color: isBlocked ? '#f87171' : hasWarning ? '#fbbf24' : '#34d399' }} />
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Field Visit Protocol (AEHT §14)
          </span>
        </div>
        <span
          className={`badge ${isBlocked ? 'badge-red' : hasWarning ? 'badge-amber' : 'badge-green'}`}
          style={{ fontSize: '0.75rem' }}
        >
          {isBlocked ? 'VISIT BLOCKED' : hasWarning ? 'PROTOCOL ADVISORY' : 'SCHEDULE CLEARED'}
        </span>
      </div>

      {/* Date & Guard Toggles */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '0.2rem' }}>
            Scan Date:
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              width: '100%',
              padding: '0.4rem 0.5rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: '#ffffff',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '0.2rem' }}>
            Female Team Member Present?
          </label>
          <button
            type="button"
            onClick={() => setFemaleMember(!femaleMember)}
            style={{
              width: '100%',
              padding: '0.4rem 0.5rem',
              background: femaleMember ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              border: femaleMember ? '1px solid #10b981' : '1px solid #ef4444',
              color: '#ffffff',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem'
            }}
          >
            <UserCheck size={14} />
            {femaleMember ? 'Yes (Verified)' : 'No (Missing)'}
          </button>
        </div>
      </div>

      {sector === 'EDUCATION' && (
        <div style={{ marginTop: '0.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#cbd5e1', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isExamPeriod}
              onChange={(e) => setIsExamPeriod(e.target.checked)}
              style={{ accentColor: 'var(--brand-primary)' }}
            />
            <span>Active examination / test period ongoing at school (prohibits field distraction)</span>
          </label>
        </div>
      )}

      {/* Warning / Error Notices */}
      {isBlocked && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ShieldAlert size={15} style={{ flexShrink: 0 }} />
          <span>
            {isSchoolExamBlocked
              ? 'Visit blocked: examinations ongoing. Reschedule scan.'
              : dayOfWeek === 0
              ? 'Visit blocked: institutional closure day.'
              : 'Visit blocked: Routine Immunisation session in progress.'}
          </span>
        </div>
      )}

      {!isBlocked && lacksFemaleMember && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#fcd34d', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <AlertTriangle size={15} style={{ flexShrink: 0 }} />
          <span>AEHT §14 requirement: Anganwadi visits require at least one female team member present.</span>
        </div>
      )}

      {!isBlocked && dayOfWeek === 3 && sector === 'WCD_ANGANWADI' && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#fcd34d', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <AlertTriangle size={15} style={{ flexShrink: 0 }} />
          <span>Advisory: Wednesday is designated immunisation/nutrition day. Conduct observation without interrupting ANM/AWW.</span>
        </div>
      )}
    </div>
  );
}
