import React, { useState } from 'react';
import { 
  FileCheck2, 
  History, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  ShieldAlert,
  ArrowRight,
  UserCheck
} from 'lucide-react';

const mockCorrections = [
  {
    id: '81000000-0000-0000-0000-000000000001',
    deliveryPointCode: 'EDU-01',
    institution: 'Forest Cluster Primary School',
    metricTarget: 'DOCUMENTED_REFERRAL',
    originalValue: 'Physical referral counterfoil not found in primary office shelf (Captured as NOT_VERIFIED)',
    correctedValue: 'Physical referral counterfoils located in secure headmaster archive (18 of 20 verified present)',
    justification: 'RBSK referral counterfoils were maintained in locked headmaster almirah during field visit, produced during exit briefing window with zero PII visible.',
    status: 'VALIDATED',
    submittedBy: 'institution_head (Headmaster)',
    submittedAt: '2026-10-05T08:30:00Z',
    validatedBy: 'nodal_officer (District Nodal Officer)',
    validatedAt: '2026-10-05T16:00:00Z',
    decisionNotes: 'District Nodal Officer validated physical counterfoils without beneficiary names. Evidence transitioned to CORRECTED.'
  },
  {
    id: '81000000-0000-0000-0000-000000000002',
    deliveryPointCode: 'HLT-01',
    institution: 'Block Boundary Primary Health Centre',
    metricTarget: 'DUTY_ROSTER_TIMELINESS',
    originalValue: 'Specialist adolescent clinic duty register missing August weekly endorsement',
    correctedValue: 'Specialist adolescent clinic duty register signed in duplicate block CMO logbook',
    justification: 'Duplicate logbook verified from CMO block record with corresponding date stamps.',
    status: 'SUBMITTED',
    submittedBy: 'institution_head (Medical Officer In-Charge)',
    submittedAt: '2026-10-06T09:15:00Z',
    validatedBy: null,
    validatedAt: null,
    decisionNotes: 'Awaiting District Nodal Officer formal register verification.'
  }
];

export default function FactualCorrectionsView() {
  const [corrections] = useState(mockCorrections);

  return (
    <div className="space-y-6">
      {/* Immutability & Audit Guarantee Banner */}
      <div className="bg-sky-500/10 border border-sky-500/30 rounded-lg p-4 text-xs text-sky-300 flex items-start gap-3">
        <History className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-sky-200">AEHT §8 / §14.1 Immutable Correction Protocol:</span>
          {' '}Factual corrections submitted during the exit briefing window permanently retain the <strong>original captured value</strong> alongside the corrected submission. Field assessments are never overwritten; state transitions are validated by the District Nodal Officer, and validated items transition evidence status to <code>CORRECTED</code>.
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-sky-400" />
            Audited Factual Corrections Register
          </h2>
          <p className="text-xs text-slate-400">
            Immutable log of institutional factual discrepancy submissions and District Nodal Officer validations.
          </p>
        </div>
      </div>

      {/* Corrections List */}
      <div className="space-y-4">
        {corrections.map((corr) => {
          const isValidated = corr.status === 'VALIDATED';
          const isSubmitted = corr.status === 'SUBMITTED';

          return (
            <div
              key={corr.id}
              className="bg-slate-900/90 border border-slate-800 rounded-lg p-5 transition shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-white bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
                    {corr.deliveryPointCode}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200">
                      {corr.institution}
                    </h3>
                    <div className="text-xs text-slate-400">
                      Metric Target: <span className="font-mono text-slate-300">{corr.metricTarget}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isValidated && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Validated by District Nodal Officer
                    </span>
                  )}
                  {isSubmitted && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      <Clock className="w-3.5 h-3.5" />
                      Submitted (Under Review)
                    </span>
                  )}
                </div>
              </div>

              {/* Before & After Values (Immutable retention) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-rose-950/20 border border-rose-900/40 rounded-lg p-3 text-xs">
                  <div className="flex items-center justify-between text-rose-300 font-semibold mb-1">
                    <span>Original Captured Value (Retained)</span>
                    <span className="text-[10px] bg-rose-900/50 px-2 py-0.5 rounded text-rose-200">IMMUTABLE</span>
                  </div>
                  <p className="text-slate-300 font-mono">
                    {corr.originalValue}
                  </p>
                </div>

                <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-lg p-3 text-xs">
                  <div className="flex items-center justify-between text-emerald-300 font-semibold mb-1">
                    <span>Corrected Factual Evidence</span>
                    <span className="text-[10px] bg-emerald-900/50 px-2 py-0.5 rounded text-emerald-200">NEW STATE</span>
                  </div>
                  <p className="text-slate-200 font-mono">
                    {corr.correctedValue}
                  </p>
                </div>
              </div>

              {/* Justification & Validation Notes */}
              <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800 text-xs space-y-2">
                <div>
                  <span className="font-semibold text-slate-300">Factual Justification:</span>
                  <p className="text-slate-400 mt-0.5">
                    "{corr.justification}"
                  </p>
                </div>

                {corr.decisionNotes && (
                  <div className="pt-2 border-t border-slate-800/80 flex items-start gap-2 text-slate-300">
                    <UserCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-emerald-400">DNO Validation Decision:</span>
                      {' '}{corr.decisionNotes}
                    </div>
                  </div>
                )}
              </div>

              {/* Audit Meta */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 pt-1">
                <div>
                  Submitted by <span className="text-slate-400 font-mono">{corr.submittedBy}</span> at {new Date(corr.submittedAt).toLocaleString()}
                </div>
                {corr.validatedBy && (
                  <div>
                    Validated by <span className="text-slate-400 font-mono">{corr.validatedBy}</span> at {new Date(corr.validatedAt).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
