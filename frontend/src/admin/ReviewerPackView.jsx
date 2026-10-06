import React from 'react';
import { 
  UserCheck2, 
  ShieldCheck, 
  CheckCircle, 
  AlertTriangle, 
  BookOpen, 
  FileCheck, 
  Building, 
  Award,
  Scale
} from 'lucide-react';

const mockReviewerPack = {
  id: '82000000-0000-0000-0000-000000000001',
  reviewerName: 'Dr. Sunita K.',
  designation: 'Senior Public Health & Primary Education Specialist',
  organization: 'Institute for Development Governance & Research',
  areaOfExpertise: 'Cross-sector Child Development Continuity & Quality Systems',
  noReportingLineToFieldTeam: true,
  notAehtEmployeeOrBoard3Years: true,
  confidentialityAgreed: true,
  districtApprovalStatus: 'ACCEPTED',
  districtDecisionBy: 'dm_magistrate (District Magistrate)',
  districtDecisionNotes: 'Confirmed independent standing and approved review scope per AEHT §8.3.',
  methodologyLimitationNotes: 'Purposive 10-point cross-sectional pilot provides valid descriptive diagnosis of cross-departmental referral friction. Strictly not a causal evaluation or district-wide statistical census. ACS serves as a continuity diagnostic only.',
  disagreementsLogged: 'Noted that RBSK specialist referrals face systemic blockages external to schools and primary health nodes (e.g. district hospital staffing constraints).',
  recommendations: 'Institutionalize monthly joint block coordination reviews between Education BEO, Health MOIC, and WCD CDPO to clear pending referral slips.',
  endorsementStatus: 'ENDORSED_WITH_LIMITATIONS',
  submittedAt: '2026-10-05T14:30:00Z'
};

export default function ReviewerPackView() {
  const r = mockReviewerPack;

  return (
    <div className="space-y-6">
      {/* AEHT §8.3 Governance Guardrail Banner */}
      <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4 text-xs text-indigo-300 flex items-start gap-3">
        <Scale className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-indigo-200">AEHT §8.3 Independent Reviewer Mandate:</span>
          {' '}The Independent Reviewer must maintain zero reporting lines to the field team and have no AEHT affiliation in the prior 3 years. The District Magistrate retains sovereign authority to accept or veto the reviewer. Review notes must document methodological limitations and substantive disagreements, prohibiting uncritical endorsement.
        </div>
      </div>

      {/* Reviewer Profile Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-900/40 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <UserCheck2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-base font-bold text-white">{r.reviewerName}</h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle className="w-3.5 h-3.5" />
                  District Approved
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                  {r.endorsementStatus.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">{r.designation}</p>
              <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                <Building className="w-3.5 h-3.5 text-slate-500" />
                <span>{r.organization}</span>
                <span>•</span>
                <Award className="w-3.5 h-3.5 text-slate-500" />
                <span>{r.areaOfExpertise}</span>
              </div>
            </div>
          </div>

          <div className="text-left md:text-right bg-slate-950/60 p-3 rounded border border-slate-800">
            <div className="text-[11px] text-slate-400">Approval Authority</div>
            <div className="text-xs font-semibold text-slate-200 mt-0.5">{r.districtDecisionBy}</div>
            <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
              Signed {new Date(r.submittedAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Conflict of Interest Declarations */}
        <div className="mt-5">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Independent Standing & Conflict-of-Interest (COI) Clearances
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-lg flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200 block">No Reporting Line</span>
                <span className="text-slate-400 text-[11px]">Strictly independent from Aryabhata field data collection team</span>
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-lg flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200 block">No AEHT Affiliation (3 Years)</span>
                <span className="text-slate-400 text-[11px]">Not an employee, board member, donor, or paid consultant</span>
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-lg flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200 block">Confidentiality Undertaking</span>
                <span className="text-slate-400 text-[11px]">Signed Zero-PII non-disclosure and ethical data covenant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mandatory Methodology Limitation Notes */}
        <div className="mt-5 bg-amber-950/20 border border-amber-900/40 rounded-lg p-4">
          <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Mandatory Methodological Limitations (AEHT §8.3 / §15.1)
          </h4>
          <p className="text-xs text-amber-100/90 leading-relaxed font-mono">
            "{r.methodologyLimitationNotes}"
          </p>
        </div>

        {/* Disagreements Logged & Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 text-xs">
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-lg">
            <h5 className="font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-slate-400" />
              Observations & Disagreements Logged
            </h5>
            <p className="text-slate-400 leading-relaxed">
              {r.disagreementsLogged}
            </p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-lg">
            <h5 className="font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-slate-400" />
              Reviewer Strategic Recommendations
            </h5>
            <p className="text-slate-400 leading-relaxed">
              {r.recommendations}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
