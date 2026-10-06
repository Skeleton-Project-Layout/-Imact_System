-- =============================================================================
-- ABHISARAN – District Programme Continuity Scan
-- V3 Question Catalogue Migration: 5 Layers, 5 Convergence Questions, Rule Links
-- =============================================================================

CREATE TABLE IF NOT EXISTS question_catalogue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_number INT NOT NULL,
    sector_id VARCHAR(50) NOT NULL REFERENCES sectors(id),
    layer INT NOT NULL CHECK (layer BETWEEN 1 AND 5),
    convergence_question VARCHAR(10) NOT NULL, -- 'Q1', 'Q2', 'Q3', 'Q4', 'Q5'
    question_text TEXT NOT NULL,
    explanation_why TEXT NOT NULL,
    evidence_requirement VARCHAR(100) NOT NULL, -- e.g. 'REGISTER_EXTRACT', 'PROCESS_DOCUMENT', 'OBSERVATION'
    resulting_rule_id VARCHAR(50) NOT NULL,
    options_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_question_sector_layer ON question_catalogue(sector_id, layer);

-- Seed Core Questions for Education, Health/RBSK, and Anganwadi (AEHT §4-§6)

-- 1. Education (School Touchpoints)
INSERT INTO question_catalogue (question_number, sector_id, layer, convergence_question, question_text, explanation_why, evidence_requirement, resulting_rule_id, options_json) VALUES
    (1, 'EDUCATION', 1, 'Q1', 'Is the documented student health screening / referral register maintained on site?', 
     'Verifies if outgoing health needs and referrals are formally logged rather than handled ad-hoc.', 'REGISTER_EXTRACT', 'RULE-REFERRAL-001',
     '{"options": ["COMPLETE_REGISTER", "PARTIAL_NOTES", "ANECDOTAL_ONLY", "ABSENT"]}'::jsonb),

    (2, 'EDUCATION', 2, 'Q2', 'Are institutional duties and designated nodal teacher contacts clearly displayed?', 
     'Checks whether designated staff are formally tasked with health follow-ups.', 'WALL_DISPLAY', 'RULE-READINESS-002',
     '{"options": ["FORMAL_ORDER_DISPLAYED", "INFORMAL_ROLE", "UNASSIGNED"]}'::jsonb),

    (3, 'EDUCATION', 3, 'Q3', 'Does the school receive formal acknowledgement of completed referrals from PHC/RBSK within 14 days?', 
     'Evaluates cross-departmental hand-off loop and timeliness of counter-referral.', 'PROCESS_DOCUMENT', 'RULE-TIME-003',
     '{"options": ["ROUTINE_RECEIPT_LOGGED", "OCCASIONAL_RECEIPT", "NEVER_RECEIVED"]}'::jsonb),

    (4, 'EDUCATION', 4, 'Q4', 'Are remedial support or medical closure outcomes recorded in student continuity files?', 
     'Verifies whether the child received required closure care or remedial intervention.', 'ANONYMISED_REFERRAL_RECORD', 'RULE-CLOSURE-004',
     '{"options": ["CLOSURE_DOCUMENTED", "PENDING_FOLLOWUP", "UNTRACKED"]}'::jsonb),

    (5, 'EDUCATION', 5, 'Q5', 'Does the school administration conduct monthly reviews of unresolved referrals?', 
     'Checks ongoing institutional ownership and routine bottleneck diagnosis.', 'PROCESS_DOCUMENT', 'RULE-SUSTAIN-005',
     '{"options": ["MONTHLY_MINUTES_PRESENT", "INFORMAL_REVIEW", "NO_REVIEW"]}'::jsonb);

-- 2. Health / RBSK (Screening & Referral)
INSERT INTO question_catalogue (question_number, sector_id, layer, convergence_question, question_text, explanation_why, evidence_requirement, resulting_rule_id, options_json) VALUES
    (6, 'HEALTH_RBSK', 1, 'Q1', 'Are RBSK screening cards and 4D referral slips documented in the facility register?', 
     'Verifies formal recording of identified health conditions (Defects, Deficiencies, Diseases, Development delays).', 'REGISTER_EXTRACT', 'RULE-REFERRAL-001',
     '{"options": ["COMPLETE_REGISTER", "PARTIAL_NOTES", "ANECDOTAL_ONLY", "ABSENT"]}'::jsonb),

    (7, 'HEALTH_RBSK', 2, 'Q2', 'Is the specialized referral diagnostic equipment functional at the touchpoint?', 
     'Ensures institutional readiness to deliver secondary medical screening.', 'INFRASTRUCTURE', 'RULE-READINESS-002',
     '{"options": ["FUNCTIONAL_AND_CALIBRATED", "PARTIALLY_FUNCTIONAL", "NON_FUNCTIONAL_ABSENT"]}'::jsonb),

    (8, 'HEALTH_RBSK', 3, 'Q3', 'Does the receiving medical officer counter-sign and return referral slips to the referring school/centre?', 
     'Checks cross-departmental bidirectional communication and referral completion.', 'PROCESS_DOCUMENT', 'RULE-FOLLOWUP-002',
     '{"options": ["COUNTER_SIGNED_SYSTEMATIC", "OCCASIONAL_SLIP", "NEVER_RETURNED"]}'::jsonb),

    (9, 'HEALTH_RBSK', 4, 'Q4', 'Is treatment completion or secondary hospital referral closure logged?', 
     'Assesses clinical closure documentation without claiming causal impact.', 'ANONYMISED_REFERRAL_RECORD', 'RULE-CLOSURE-004',
     '{"options": ["CLOSURE_DOCUMENTED", "PENDING_FOLLOWUP", "UNTRACKED"]}'::jsonb),

    (10, 'HEALTH_RBSK', 5, 'Q5', 'Is there a shared block-level coordination meeting record between Health and Education?', 
     'Evaluates systemic sustainability and bottleneck resolution mechanisms.', 'PROCESS_DOCUMENT', 'RULE-SUSTAIN-005',
     '{"options": ["JOINT_MINUTES_AVAILABLE", "AD_HOC_MEETINGS", "NO_COORDINATION"]}'::jsonb);

-- 3. Anganwadi (WCD Touchpoints)
INSERT INTO question_catalogue (question_number, sector_id, layer, convergence_question, question_text, explanation_why, evidence_requirement, resulting_rule_id, options_json) VALUES
    (11, 'WCD_ANGANWADI', 1, 'Q1', 'Are preschool growth monitoring and malnutrition referral registers documented?', 
     'Verifies tracking of children identified as severely or moderately underweight.', 'REGISTER_EXTRACT', 'RULE-REFERRAL-001',
     '{"options": ["COMPLETE_REGISTER", "PARTIAL_NOTES", "ANECDOTAL_ONLY", "ABSENT"]}'::jsonb),

    (12, 'WCD_ANGANWADI', 2, 'Q2', 'Are functional stadiometers, infantometers, and growth charts present and calibrated?', 
     'Assesses institutional readiness for accurate anthropometric screening.', 'INFRASTRUCTURE', 'RULE-READINESS-002',
     '{"options": ["AVAILABLE_AND_FUNCTIONAL", "AVAILABLE_NOT_FUNCTIONAL", "ABSENT"]}'::jsonb),

    (13, 'WCD_ANGANWADI', 3, 'Q3', 'Does the Anganwadi receive counter-referral notes from MTC / NRC / PHC?', 
     'Checks departmental alignment for nutritional rehabilitation follow-up.', 'PROCESS_DOCUMENT', 'RULE-FOLLOWUP-002',
     '{"options": ["COUNTER_SIGNED_SYSTEMATIC", "OCCASIONAL_SLIP", "NEVER_RETURNED"]}'::jsonb),

    (14, 'WCD_ANGANWADI', 4, 'Q4', 'Is transition to primary school recorded with child development readiness profile?', 
     'Assesses pathway continuity between early childhood education and primary school.', 'PROCESS_DOCUMENT', 'RULE-CLOSURE-004',
     '{"options": ["TRANSITION_PORTFOLIO_HANDED_OVER", "NAME_ONLY_SENT", "NO_TRANSITION_RECORD"]}'::jsonb),

    (15, 'WCD_ANGANWADI', 5, 'Q5', 'Does the Anganwadi worker participate in scheduled VHSND joint reviews with ASHA and ANM?', 
     'Verifies village health sanitation and nutrition day coordination sustainability.', 'PROCESS_DOCUMENT', 'RULE-SUSTAIN-005',
     '{"options": ["ROUTINE_VHSND_MINUTES", "OCCASIONAL_JOINT_REVIEW", "NO_JOINT_REVIEW"]}'::jsonb);
