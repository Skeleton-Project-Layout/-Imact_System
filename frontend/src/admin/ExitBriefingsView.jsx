import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  FileText, 
  ShieldCheck,
  Building2,
  Calendar
} from 'lucide-react';

const mockBriefings = [
  {
    id: '80000000-0000-0000-0000-000000000001',
    deliveryPointCode: 'EDU-01',
    sector: 'Education',
    institution: 'Forest Cluster Primary School',
    briefingDate: '2026-10-04T10:30:00Z',
    conductedBy: 'field_lead (Aryabhata Team)',
    institutionHeadDesignation: 'Headmaster',
    status: 'ACKNOWLEDGED',
    acknowledgementText: 'Factual Observations Shared and discussed in 15-minute briefing session.',
    refusalReason: null,
    nonAdverseDeclaration: true,
    factualDiscrepanciesNotes: 'Flagged clarification regarding monthly RBSK referral slips stored in separate headmaster cupboard.',
    materialCorrectionsLogged: true,
    correctionWindowClosesAt: '2026-10-07T10:30:00Z',
    finalized: false
  },
  {
    id: '80000000-0000-0000-0000-000000000002',
    deliveryPointCode: 'EDU-02',
    sector: 'Education',
    institution: 'Cluster Middle School',
    briefingDate: '2026-10-04T12:00:00Z',
    conductedBy: 'field_lead (Aryabhata Team)',
    institutionHeadDesignation: 'Principal',
    status: 'ACKNOWLEDGED',
    acknowledgementText: 'Factual Observations Shared. Discussion framed around system screening intervals.',
    refusalReason: null,
    nonAdverseDeclaration: true,
    factualDiscrepanciesNotes: 'No material factual discrepancy raised.',
    materialCorrectionsLogged: false,
    correctionWindowClosesAt: '2026-10-07T12:00:00Z',
    finalized: false
  },
  {
    id: '80000000-0000-0000-0000-000000000003',
    deliveryPointCode: 'HLT-01',
    sector: 'Health/RBSK',
    institution: 'Block Boundary Primary Health Centre',
    briefingDate: '2026-10-04T14:15:00Z',
    conductedBy: 'field_lead (Aryabhata Team)',
    institutionHeadDesignation: 'Medical Officer In-Charge',
    status: 'SHARED_UNSIGNED',
    acknowledgementText: null,
    refusalReason: 'Medical Officer on urgent emergency referral duty; briefing pack received by Senior Nursing Officer. Unsigned status explicitly non-adverse.',
    nonAdverseDeclaration: true,
    factualDiscrepanciesNotes: 'Head requested digital review of adolescent clinic register counts.',
    materialCorrectionsLogged: false,
    correctionWindowClosesAt: '2026-10-07T14:15:00Z',
    finalized: false
  },
  {
    id: '80000000-0000-0000-0000-000000000004',
    deliveryPointCode: 'WCD-01',
    sector: 'WCD/Anganwadi',
    institution: 'Tribal Tola Anganwadi Centre',
    briefingDate: '2026-10-05T09:45:00Z',
    conductedBy: 'field_lead (Aryabhata Team)',
    institutionHeadDesignation: 'Anganwadi Worker Lead',
    status: 'ACKNOWLEDGED',
    acknowledgementText: 'Factual Observations Shared. Discussion on VHSND register handoff.',
    refusalReason: null,
    nonAdverseDeclaration: true,
    factualDiscrepanciesNotes: 'None recorded.',
    materialCorrectionsLogged: false,
    correctionWindowClosesAt: '2026-10-08T09:45:00Z',
    finalized: false
  },
  {
    id: '80000000-0000-0000-0000-000000000005',
    deliveryPointCode: 'WCD-02',
    sector: 'WCD/Anganwadi',
    institution: 'Sector Anganwadi Centre',
    briefingDate: '2026-10-05T11:30:00Z',
    conductedBy: 'field_lead (Aryabhata Team)',
    institutionHeadDesignation: 'Anganwadi Worker',
    status: 'REFUSED_NON_ADVERSE',
    acknowledgementText: null,
    refusalReason: 'Worker attending mandatory district POSHAN abhiyan training session; non-adverse recording logged per AEHT §14.1.',
    nonAdverseDeclaration: true,
    factualDiscrepanciesNotes: 'None; re-briefing scheduled with block supervisor.',
    materialCorrectionsLogged: false,
    correctionWindowClosesAt: '2026-10-08T11:30:00Z',
    finalized: false
  }
];

export default function ExitBriefingsView() {
  const [filter, setFilter] = useState('ALL');

  const filteredBriefings = mockBriefings.filter(b => {
    if (filter === 'ALL') return true;
    return b.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Statutory & Non-Adverse Notice Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 text-xs text-amber-300 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-amber-200">AEHT §14.1 Exit Briefing Protection Rule:</span>
          {' '}Exit briefings are 15-minute structured observations shared with institution leadership. Refusal to attend or an unsigned briefing is strictly <strong>non-adverse evidence</strong>. It does not constitute a dispute, disciplinary finding, or adverse score weighting. Dashboard results finalize only after the factual correction window concludes.
        </div>
      </div>

      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-emerald-400" />
            Delivery Point Exit Briefing Register
          </h2>
          <p className="text-xs text-slate-400">
            Tracking post-assessment factual debriefs and institutional acknowledgement status.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded font-medium transition ${
              filter === 'ALL' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Briefings
          </button>
          <button
            onClick={() => setFilter('ACKNOWLEDGED')}
            className={`px-3 py-1.5 rounded font-medium transition ${
              filter === 'ACKNOWLEDGED' ? 'bg-emerald-900/60 text-emerald-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            Acknowledged
          </button>
          <button
            onClick={() => setFilter('SHARED_UNSIGNED')}
            className={`px-3 py-1.5 rounded font-medium transition ${
              filter === 'SHARED_UNSIGNED' ? 'bg-amber-900/60 text-amber-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            Shared Unsigned
          </button>
          <button
            onClick={() => setFilter('REFUSED_NON_ADVERSE')}
            className={`px-3 py-1.5 rounded font-medium transition ${
              filter === 'REFUSED_NON_ADVERSE' ? 'bg-slate-800 text-slate-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            Non-Adverse Refusal
          </button>
        </div>
      </div>

      {/* Briefings List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredBriefings.map((briefing) => {
          const isAck = briefing.status === 'ACKNOWLEDGED';
          const isUnsigned = briefing.status === 'SHARED_UNSIGNED';
          const isRefused = briefing.status === 'REFUSED_NON_ADVERSE';

          return (
            <div
              key={briefing.id}
              className="bg-slate-900/90 border border-slate-800 rounded-lg p-5 transition hover:border-slate-700 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-3 mb-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-white bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
                    {briefing.deliveryPointCode}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200">
                      {briefing.institution}
                    </h3>
                    <div className="text-xs text-slate-400 flex items-center gap-2">
                      <span>{briefing.sector}</span>
                      <span>•</span>
                      <span>Head: {briefing.institutionHeadDesignation}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isAck && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Factual Observations Shared
                    </span>
                  )}
                  {isUnsigned && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      <Clock className="w-3.5 h-3.5" />
                      Shared but not signed (Non-adverse)
                    </span>
                  )}
                  {isRefused && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                      Refused / Absent (Non-adverse)
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <div className="text-slate-400">
                    <span className="font-medium text-slate-300">Briefing Record:</span>
                    <p className="mt-1 text-slate-300 bg-slate-950/60 p-2.5 rounded border border-slate-800">
                      {isAck ? briefing.acknowledgementText : briefing.refusalReason}
                    </p>
                  </div>

                  {briefing.factualDiscrepanciesNotes && (
                    <div className="text-slate-400">
                      <span className="font-medium text-slate-300">Factual Notes Raised:</span>
                      <p className="mt-1 text-slate-400 italic">
                        "{briefing.factualDiscrepanciesNotes}"
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2.5 bg-slate-950/40 p-3 rounded-lg border border-slate-800/60">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      Briefing Conducted:
                    </span>
                    <span className="text-slate-300 font-mono">
                      {new Date(briefing.briefingDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      Correction Window Closes:
                    </span>
                    <span className="text-amber-300 font-mono font-medium">
                      {new Date(briefing.correctionWindowClosesAt).toLocaleDateString()} (Active)
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                    <span className="text-slate-400">Material Correction Logged:</span>
                    <span className={`font-semibold ${briefing.materialCorrectionsLogged ? 'text-cyan-400' : 'text-slate-400'}`}>
                      {briefing.materialCorrectionsLogged ? 'Yes (Under DNO Review)' : 'None'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
