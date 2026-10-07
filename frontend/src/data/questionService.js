// ABHISARAN – Question Catalogue & Quiz Setup Service
// Manages custom, editable, and extensible question sets for field continuity scans

export const BASELINE_CORE_QUESTIONS = [
  // EDUCATION (5 Layers)
  {
    questionNumber: 1,
    sectorId: 'EDUCATION',
    layer: 1,
    convergenceQuestion: 'Q1',
    questionText: 'Is the documented student health screening / referral register maintained on site?',
    explanationWhy: 'Verifies if outgoing health needs and referrals are formally logged rather than handled ad-hoc.',
    evidenceRequirement: 'REGISTER_EXTRACT',
    resultingRuleId: 'RULE-REFERRAL-001',
    optionsJson: '{"options": ["COMPLETE_REGISTER", "PARTIAL_NOTES", "ANECDOTAL_ONLY", "ABSENT"]}'
  },
  {
    questionNumber: 2,
    sectorId: 'EDUCATION',
    layer: 2,
    convergenceQuestion: 'Q2',
    questionText: 'Are institutional duties and designated nodal teacher contacts clearly displayed?',
    explanationWhy: 'Checks whether designated staff are formally tasked with health follow-ups.',
    evidenceRequirement: 'WALL_DISPLAY',
    resultingRuleId: 'RULE-READINESS-002',
    optionsJson: '{"options": ["FORMAL_ORDER_DISPLAYED", "INFORMAL_ROLE", "UNASSIGNED"]}'
  },
  {
    questionNumber: 3,
    sectorId: 'EDUCATION',
    layer: 3,
    convergenceQuestion: 'Q3',
    questionText: 'Does the school receive formal acknowledgement of completed referrals from PHC/RBSK within 14 days?',
    explanationWhy: 'Evaluates cross-departmental hand-off loop and timeliness of counter-referral.',
    evidenceRequirement: 'PROCESS_DOCUMENT',
    resultingRuleId: 'RULE-TIME-003',
    optionsJson: '{"options": ["ROUTINE_RECEIPT_LOGGED", "OCCASIONAL_RECEIPT", "NEVER_RECEIVED"]}'
  },
  {
    questionNumber: 4,
    sectorId: 'EDUCATION',
    layer: 4,
    convergenceQuestion: 'Q4',
    questionText: 'Are remedial support or medical closure outcomes recorded in student continuity files?',
    explanationWhy: 'Verifies whether the child received required closure care or remedial intervention.',
    evidenceRequirement: 'ANONYMISED_REFERRAL_RECORD',
    resultingRuleId: 'RULE-CLOSURE-004',
    optionsJson: '{"options": ["CLOSURE_DOCUMENTED", "PENDING_FOLLOWUP", "UNTRACKED"]}'
  },
  {
    questionNumber: 5,
    sectorId: 'EDUCATION',
    layer: 5,
    convergenceQuestion: 'Q5',
    questionText: 'Does the school administration conduct monthly reviews of unresolved referrals?',
    explanationWhy: 'Checks ongoing institutional ownership and routine bottleneck diagnosis.',
    evidenceRequirement: 'PROCESS_DOCUMENT',
    resultingRuleId: 'RULE-SUSTAIN-005',
    optionsJson: '{"options": ["MONTHLY_MINUTES_PRESENT", "INFORMAL_REVIEW", "NO_REVIEW"]}'
  },

  // HEALTH_RBSK (5 Layers)
  {
    questionNumber: 6,
    sectorId: 'HEALTH_RBSK',
    layer: 1,
    convergenceQuestion: 'Q1',
    questionText: 'Are RBSK screening cards and 4D referral slips documented in the facility register?',
    explanationWhy: 'Verifies formal recording of identified health conditions.',
    evidenceRequirement: 'REGISTER_EXTRACT',
    resultingRuleId: 'RULE-REFERRAL-001',
    optionsJson: '{"options": ["COMPLETE_REGISTER", "PARTIAL_NOTES", "ANECDOTAL_ONLY", "ABSENT"]}'
  },
  {
    questionNumber: 7,
    sectorId: 'HEALTH_RBSK',
    layer: 2,
    convergenceQuestion: 'Q2',
    questionText: 'Is the specialized referral diagnostic equipment functional at the touchpoint?',
    explanationWhy: 'Ensures institutional readiness to deliver secondary medical screening.',
    evidenceRequirement: 'INFRASTRUCTURE',
    resultingRuleId: 'RULE-READINESS-002',
    optionsJson: '{"options": ["FUNCTIONAL_AND_CALIBRATED", "PARTIALLY_FUNCTIONAL", "NON_FUNCTIONAL_ABSENT"]}'
  },
  {
    questionNumber: 8,
    sectorId: 'HEALTH_RBSK',
    layer: 3,
    convergenceQuestion: 'Q3',
    questionText: 'Does the receiving medical officer counter-sign and return referral slips to the referring school/centre?',
    explanationWhy: 'Checks cross-departmental bidirectional communication.',
    evidenceRequirement: 'PROCESS_DOCUMENT',
    resultingRuleId: 'RULE-FOLLOWUP-002',
    optionsJson: '{"options": ["COUNTER_SIGNED_SYSTEMATIC", "OCCASIONAL_SLIP", "NEVER_RETURNED"]}'
  },
  {
    questionNumber: 9,
    sectorId: 'HEALTH_RBSK',
    layer: 4,
    convergenceQuestion: 'Q4',
    questionText: 'Is treatment completion or secondary hospital referral closure logged?',
    explanationWhy: 'Assesses clinical closure documentation without claiming causal impact.',
    evidenceRequirement: 'ANONYMISED_REFERRAL_RECORD',
    resultingRuleId: 'RULE-CLOSURE-004',
    optionsJson: '{"options": ["CLOSURE_DOCUMENTED", "PENDING_FOLLOWUP", "UNTRACKED"]}'
  },
  {
    questionNumber: 10,
    sectorId: 'HEALTH_RBSK',
    layer: 5,
    convergenceQuestion: 'Q5',
    questionText: 'Is there a shared block-level coordination meeting record between Health and Education?',
    explanationWhy: 'Evaluates systemic sustainability and bottleneck resolution mechanisms.',
    evidenceRequirement: 'PROCESS_DOCUMENT',
    resultingRuleId: 'RULE-SUSTAIN-005',
    optionsJson: '{"options": ["JOINT_MINUTES_AVAILABLE", "AD_HOC_MEETINGS", "NO_COORDINATION"]}'
  },

  // WCD_ANGANWADI (5 Layers)
  {
    questionNumber: 11,
    sectorId: 'WCD_ANGANWADI',
    layer: 1,
    convergenceQuestion: 'Q1',
    questionText: 'Are preschool growth monitoring and malnutrition referral registers documented?',
    explanationWhy: 'Verifies tracking of children identified as underweight.',
    evidenceRequirement: 'REGISTER_EXTRACT',
    resultingRuleId: 'RULE-REFERRAL-001',
    optionsJson: '{"options": ["COMPLETE_REGISTER", "PARTIAL_NOTES", "ANECDOTAL_ONLY", "ABSENT"]}'
  },
  {
    questionNumber: 12,
    sectorId: 'WCD_ANGANWADI',
    layer: 2,
    convergenceQuestion: 'Q2',
    questionText: 'Are functional stadiometers, infantometers, and growth charts present and calibrated?',
    explanationWhy: 'Assesses institutional readiness for accurate anthropometric screening.',
    evidenceRequirement: 'INFRASTRUCTURE',
    resultingRuleId: 'RULE-READINESS-002',
    optionsJson: '{"options": ["AVAILABLE_AND_FUNCTIONAL", "AVAILABLE_NOT_FUNCTIONAL", "ABSENT"]}'
  },
  {
    questionNumber: 13,
    sectorId: 'WCD_ANGANWADI',
    layer: 3,
    convergenceQuestion: 'Q3',
    questionText: 'Does the Anganwadi receive counter-referral notes from MTC / NRC / PHC?',
    explanationWhy: 'Checks departmental alignment for nutritional rehabilitation follow-up.',
    evidenceRequirement: 'PROCESS_DOCUMENT',
    resultingRuleId: 'RULE-FOLLOWUP-002',
    optionsJson: '{"options": ["COUNTER_SIGNED_SYSTEMATIC", "OCCASIONAL_SLIP", "NEVER_RETURNED"]}'
  },
  {
    questionNumber: 14,
    sectorId: 'WCD_ANGANWADI',
    layer: 4,
    convergenceQuestion: 'Q4',
    questionText: 'Is transition to primary school recorded with child development readiness profile?',
    explanationWhy: 'Assesses pathway continuity between early childhood and primary school.',
    evidenceRequirement: 'PROCESS_DOCUMENT',
    resultingRuleId: 'RULE-CLOSURE-004',
    optionsJson: '{"options": ["TRANSITION_PORTFOLIO_HANDED_OVER", "NAME_ONLY_SENT", "NO_TRANSITION_RECORD"]}'
  },
  {
    questionNumber: 15,
    sectorId: 'WCD_ANGANWADI',
    layer: 5,
    convergenceQuestion: 'Q5',
    questionText: 'Does the Anganwadi worker participate in scheduled VHSND joint reviews with ASHA and ANM?',
    explanationWhy: 'Verifies village health sanitation and nutrition day coordination sustainability.',
    evidenceRequirement: 'PROCESS_DOCUMENT',
    resultingRuleId: 'RULE-SUSTAIN-005',
    optionsJson: '{"options": ["ROUTINE_VHSND_MINUTES", "OCCASIONAL_JOINT_REVIEW", "NO_JOINT_REVIEW"]}'
  }
];

const STORAGE_KEY = 'abhisaran_custom_questions';

export const QuestionService = {
  getAllQuestions() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored questions from localStorage:', e);
    }
    return [...BASELINE_CORE_QUESTIONS];
  },

  getQuestionsBySector(sectorId) {
    const all = this.getAllQuestions();
    if (!sectorId) return all;
    return all.filter((q) => q.sectorId === sectorId);
  },

  getQuestionsByLayer(sectorId, layer) {
    const sectorQs = this.getQuestionsBySector(sectorId);
    if (!layer) return sectorQs;
    return sectorQs.filter((q) => q.layer === Number(layer));
  },

  saveAllQuestions(questions) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
      window.dispatchEvent(new CustomEvent('abhisaran_questions_updated', { detail: questions }));
    } catch (e) {
      console.error('Failed to write questions to localStorage:', e);
    }
  },

  addQuestion(newQuestion) {
    const all = this.getAllQuestions();
    const nextNum = all.length > 0 ? Math.max(...all.map((q) => q.questionNumber || 0)) + 1 : 1;
    const formatted = {
      ...newQuestion,
      questionNumber: newQuestion.questionNumber ? Number(newQuestion.questionNumber) : nextNum,
      layer: Number(newQuestion.layer) || 1,
      optionsJson: typeof newQuestion.optionsJson === 'string'
        ? newQuestion.optionsJson
        : JSON.stringify({ options: newQuestion.options || ['COMPLIANT', 'PARTIAL', 'ABSENT'] })
    };
    all.push(formatted);
    this.saveAllQuestions(all);
    return formatted;
  },

  updateQuestion(questionNumber, updatedFields) {
    const all = this.getAllQuestions();
    const index = all.findIndex((q) => q.questionNumber === Number(questionNumber));
    if (index === -1) return null;

    const current = all[index];
    all[index] = {
      ...current,
      ...updatedFields,
      questionNumber: Number(questionNumber),
      layer: updatedFields.layer !== undefined ? Number(updatedFields.layer) : current.layer,
      optionsJson: typeof updatedFields.optionsJson === 'string'
        ? updatedFields.optionsJson
        : (updatedFields.options
          ? JSON.stringify({ options: updatedFields.options })
          : current.optionsJson)
    };
    this.saveAllQuestions(all);
    return all[index];
  },

  deleteQuestion(questionNumber) {
    const all = this.getAllQuestions();
    const filtered = all.filter((q) => q.questionNumber !== Number(questionNumber));
    this.saveAllQuestions(filtered);
    return filtered;
  },

  resetToDefaults() {
    this.saveAllQuestions([...BASELINE_CORE_QUESTIONS]);
    return [...BASELINE_CORE_QUESTIONS];
  }
};
