import React, { useState } from 'react';
import { 
  Trash2, 
  Clock, 
  Award, 
  FileCheck, 
  ShieldCheck, 
  History, 
  Hash, 
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';

const mockCertificate = {
  id: '92000000-0000-0000-0000-000000000001',
  certificateNumber: 'AEHT-DEL-2026-001',
  districtNodalOfficerName: 'Shri R. K. Soren, District Nodal Officer',
  purgedBy: 'field_lead (Aryabhata Team Lead)',
  purgedAt: '2026-09-28T16:00:00Z',
  scopeDescription: 'Pre-pilot training device temporary cache files and practice question responses across 3 orientation tablets',
  recordCount: 42,
  verificationHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  statutoryComplianceNote: 'Certified under AEHT §8.2 and Digital Personal Data Protection guidelines. All staging tokens irreversibly purged.'
};

const mockAuditLogs = [
  {
    id: '99000000-0000-0000-0000-000000000001',
    userRole: 'DISTRICT_NODAL_OFFICER',
    action: 'DATA_PURGE_EXECUTED',
    entityName: 'RETENTION_SCHEDULE',
    entityId: 'SCH-01',
    previousState: 'ACTIVE_COUNTDOWN',
    newState: 'PURGED',
    reason: 'Statutory 30-day post-handover retention purge executed. Certificate: AEHT-DEL-2026-001',
    ruleVersion: 'v1.0',
    timestamp: '2026-09-28T16:00:00Z'
  },
  {
    id: '99000000-0000-0000-0000-000000000002',
    userRole: 'DISTRICT_NODAL_OFFICER',
    action: 'CORRECTION_VALIDATED',
    entityName: 'FACTUAL_CORRECTION',
    entityId: 'CORR-01',
    previousState: 'SUBMITTED',
    newState: 'VALIDATED',
    reason: 'Verified RBSK referral counterfoils in secure almirah with zero beneficiary PII',
    ruleVersion: 'v1.0',
    timestamp: '2026-10-05T16:00:00Z'
  },
  {
    id: '99000000-0000-0000-0000-000000000003',
    userRole: 'DISTRICT_MAGISTRATE',
    action: 'REVIEWER_ACCEPTED',
    entityName: 'REVIEWER_DECLARATION',
    entityId: 'REV-01',
    previousState: 'PENDING',
    newState: 'ACCEPTED',
    reason: 'Confirmed independent standing and approved review scope per AEHT §8.3',
    ruleVersion: 'v1.0',
    timestamp: '2026-10-05T14:30:00Z'
  },
  {
    id: '99000000-0000-0000-0000-000000000004',
    userRole: 'DISTRICT_NODAL_OFFICER',
    action: 'EVIDENCE_VERIFIED',
    entityName: 'EVIDENCE',
    entityId: 'EV-EDU-01',
    previousState: 'PENDING_REVIEW',
    newState: 'VERIFIED',
    reason: 'Physical inspection of duty roster completed without child names',
    ruleVersion: 'v1.0',
    timestamp: '2026-10-04T11:00:00Z'
  }
];

export default function RetentionAndAuditView() {
  const [cert] = useState(mockCertificate);
  const [logs] = useState(mockAuditLogs);

  return (
    <div className="space-y-6">
      {/* Statutory Retention Mandate Banner */}
      <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 text-xs text-cyan-300 flex items-start gap-3">
        <Clock className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-cyan-200">AEHT §8.2 30-Day Post-Handover Retention Protocol:</span>
          {' '}By statutory rule, all tokenized and working field files must be irreversibly deleted within <strong>30 days of Day-7 handover</strong> unless the District Magistrate directs otherwise in writing. Following execution, a cryptographic <strong>Deletion Certificate</strong> is generated for the District Nodal Officer.
        </div>
      </div>

      {/* 30-Day Retention Countdown Widget */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              Pilot Retention Countdown (Day 7 + 30 Days)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Target purge date: <strong>October 29, 2026</strong>
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-400">Status:</span>
            <span className="px-2.5 py-0.5 rounded font-mono font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              ACTIVE_COUNTDOWN
            </span>
            <span className="text-slate-500">|</span>
            <span className="font-mono text-emerald-400 font-bold">23 Days Remaining</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400 font-mono">
            <span>Handover: Sept 29, 2026 (Day 7)</span>
            <span>Target Purge: Oct 29, 2026</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: '23%' }} />
          </div>
          <div className="text-[11px] text-slate-500 text-right">
            7 of 30 days elapsed (23% elapsed)
          </div>
        </div>
      </div>

      {/* Deletion Certificate Preview */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Statutory Deletion Certificate
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                  {cert.certificateNumber}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Recipient: <span className="text-slate-300 font-medium">{cert.districtNodalOfficerName}</span>
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Purge Verified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-950/60 p-3.5 rounded border border-slate-800 space-y-2">
            <div>
              <span className="text-slate-400 font-medium">Scope of Destroyed Working Data:</span>
              <p className="text-slate-300 mt-0.5 leading-relaxed">
                {cert.scopeDescription}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Total Purged Record Count:</span>
              <span className="font-mono text-white font-bold">{cert.recordCount} items</span>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded border border-slate-800 space-y-2">
            <div>
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-cyan-400" />
                SHA-256 Cryptographic Verification Checksum:
              </span>
              <p className="font-mono text-[11px] text-cyan-300 mt-1 break-all bg-slate-900 p-2 rounded border border-slate-800">
                {cert.verificationHash}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 italic">
              {cert.statutoryComplianceNote}
            </div>
          </div>
        </div>
      </div>

      {/* Append-Only Audit Log Viewer */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            Append-Only Audit Trail (SEC-04)
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {logs.length} Immutable Events
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Entity</th>
                <th className="py-2.5 px-3">State Transition</th>
                <th className="py-2.5 px-3">Reason / Justification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-indigo-300">
                    {log.userRole}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-200">
                    {log.action}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">
                    {log.entityName} ({log.entityId})
                  </td>
                  <td className="py-2.5 px-3 text-[11px]">
                    <span className="text-amber-400">{log.previousState}</span>
                    <span className="text-slate-500 mx-1">→</span>
                    <span className="text-emerald-400">{log.newState}</span>
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-300 max-w-xs truncate">
                    {log.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
