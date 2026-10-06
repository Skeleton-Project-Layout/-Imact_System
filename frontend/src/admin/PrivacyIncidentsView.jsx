import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileLock2, 
  UserCheck, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const mockIncidents = [
  {
    id: '95000000-0000-0000-0000-000000000001',
    deliveryPointCode: 'EDU-01',
    status: 'NODAL_NOTIFIED',
    detectionSource: 'OCR_SCANNER',
    detectedAt: '2026-10-06T10:15:00Z',
    containedAt: '2026-10-06T10:20:00Z',
    nodalNotifiedAt: '2026-10-06T10:55:00Z',
    districtDirectedAt: null,
    closedAt: null,
    nonIdentifyingDescription: 'Field register photo upload flagged unredacted student guardian telephone column header during automated OCR pre-check.',
    containmentAction: 'Attachment quarantined immediately; deleted from local device cache. Excluded from all analytic pipelines.',
    districtDirectionNotes: null,
    closingJustification: null,
    isOverdue: false,
    minutesRemaining: 0
  },
  {
    id: '95000000-0000-0000-0000-000000000002',
    deliveryPointCode: 'HLT-02',
    status: 'CLOSED',
    detectionSource: 'FIELD_VALIDATION',
    detectedAt: '2026-10-04T09:00:00Z',
    containedAt: '2026-10-04T09:10:00Z',
    nodalNotifiedAt: '2026-10-04T09:40:00Z',
    districtDirectedAt: '2026-10-04T11:00:00Z',
    closedAt: '2026-10-04T12:30:00Z',
    nonIdentifyingDescription: 'Field observation note contained draft initials resembling beneficiary name.',
    containmentAction: 'Field worker draft destroyed; non-identifying continuity token assigned.',
    districtDirectionNotes: 'Re-issue tokenized sheet and re-verify screening count with MOIC.',
    closingJustification: 'Re-assessment verified zero-PII compliance and accepted by District Nodal Officer.',
    isOverdue: false,
    minutesRemaining: 0
  }
];

const STAGES = ['DETECTED', 'CONTAINED', 'NODAL_NOTIFIED', 'DISTRICT_DIRECTED', 'CLOSED'];

export default function PrivacyIncidentsView() {
  const [incidents] = useState(mockIncidents);

  return (
    <div className="space-y-6">
      {/* Zero-PII Emergency Protocol Banner */}
      <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-4 text-xs text-rose-300 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-rose-200">AEHT §8.1 / §13 Zero-PII Immediate Containment Mandate:</span>
          {' '}Any suspected PII instantly pauses processing, quarantines the attachment, and triggers an automated <strong>2-hour escalation clock (120 min)</strong> to notify the District Nodal Officer. Incident records must remain strictly non-identifying. The 5-stage workflow ensures complete containment through final district direction.
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FileLock2 className="w-5 h-5 text-rose-400" />
            Privacy Incident Management Register
          </h2>
          <p className="text-xs text-slate-400">
            Automated PII breach containment tracking with statutory 2-hour District Nodal Officer notification countdown.
          </p>
        </div>
      </div>

      {/* Incidents List */}
      <div className="space-y-4">
        {incidents.map((inc) => {
          const currentStageIndex = STAGES.indexOf(inc.status);

          return (
            <div
              key={inc.id}
              className="bg-slate-900/90 border border-slate-800 rounded-lg p-5 transition shadow-sm space-y-4"
            >
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-white bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
                    {inc.deliveryPointCode}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200">
                      Detection Source: <span className="font-mono text-rose-300">{inc.detectionSource}</span>
                    </h3>
                    <div className="text-xs text-slate-400">
                      Detected: {new Date(inc.detectedAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* 2-Hour Notification Clock Badge */}
                <div className="flex items-center gap-2">
                  {inc.nodalNotifiedAt ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      DNO Notified in {Math.round((new Date(inc.nodalNotifiedAt) - new Date(inc.detectedAt)) / 60000)}m (Clock Stopped)
                    </span>
                  ) : inc.isOverdue ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/50 animate-pulse">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      OVERDUE (&gt; 120 min)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      <Clock className="w-3.5 h-3.5" />
                      {inc.minutesRemaining} min remaining on 2h clock
                    </span>
                  )}
                </div>
              </div>

              {/* 5-Stage Progression Tracker */}
              <div className="py-2">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Statutory 5-Stage Containment Progression:
                </div>
                <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-mono font-semibold">
                  {STAGES.map((stage, idx) => {
                    const isPast = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    return (
                      <div
                        key={stage}
                        className={`p-2 rounded border transition ${
                          isCurrent
                            ? 'bg-rose-500/20 text-rose-200 border-rose-500/50 ring-1 ring-rose-500/50'
                            : isPast
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : 'bg-slate-950 text-slate-600 border-slate-800'
                        }`}
                      >
                        {stage.replace(/_/g, ' ')}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Description & Action */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  <span className="font-semibold text-slate-300">Non-Identifying Description:</span>
                  <p className="text-slate-400 mt-1 leading-relaxed">
                    {inc.nonIdentifyingDescription}
                  </p>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  <span className="font-semibold text-emerald-400">Immediate Containment Action:</span>
                  <p className="text-slate-300 mt-1 leading-relaxed">
                    {inc.containmentAction}
                  </p>
                </div>
              </div>

              {/* District Direction Notes if available */}
              {inc.districtDirectionNotes && (
                <div className="bg-indigo-950/20 border border-indigo-900/40 p-3 rounded-lg text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-indigo-300 font-semibold">
                    <UserCheck className="w-3.5 h-3.5" />
                    District Direction & Remediation:
                  </div>
                  <p className="text-slate-300">
                    {inc.districtDirectionNotes}
                  </p>
                  {inc.closingJustification && (
                    <div className="text-emerald-400 pt-1 text-[11px]">
                      <strong>Closure Note:</strong> {inc.closingJustification}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
