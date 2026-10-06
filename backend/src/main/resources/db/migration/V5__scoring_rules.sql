-- =============================================================================
-- ABHISARAN – District Programme Continuity Scan
-- V5 Scoring Rules & Gap Rule Definitions Migration
-- =============================================================================

INSERT INTO rule_definitions (rule_id, version, name, layer, convergence_question, condition_expression, flag_code, severity, explanation_template) VALUES
    ('RULE-SCORE-001', 1, 'Aggregate Continuity Score (ACS) 4-Component Deterministic Calculation', 0, 'ALL',
     'ACS = (SUM(applicable_components) / (count(applicable) * 5.0)) * 100', 'FLAG_ACS_CALCULATION', 'INFO',
     'Evaluates service continuity across 4 equal 25% components with automatic rebasing over applicable touchpoints (Green >=70, Amber 40-69, Red <40).'),

    ('RULE-REFERRAL-001', 1, 'Documented Screening and Referral Register Gap', 1, 'Q1',
     'selected_option IN (''ABSENT'', ''ANECDOTAL_ONLY'')', 'FLAG_TOUCHPOINT_DISCONTINUITY', 'HIGH',
     'Outgoing referral screening register is absent or maintained only through anecdotal notes at touchpoint.'),

    ('RULE-READINESS-002', 1, 'Institutional Readiness and Nodal Duty Order Gap', 2, 'Q2',
     'selected_option IN (''UNASSIGNED'', ''NON_FUNCTIONAL_ABSENT'', ''ABSENT'')', 'FLAG_INSTITUTIONAL_UNREADINESS', 'HIGH',
     'Touchpoint lacks designated nodal personnel order or functional screening equipment.'),

    ('RULE-TIME-003', 1, '14-Day Cross-Departmental Counter-Referral Hand-Off Delay', 3, 'Q3',
     'selected_option IN (''NEVER_RECEIVED'', ''NEVER_RETURNED'')', 'FLAG_HANDOFF_BREAKDOWN', 'HIGH',
     'Cross-departmental counter-referral loop not completed within standard 14-day protocol window.'),

    ('RULE-CLOSURE-004', 1, 'Beneficiary Continuity and Care Closure Outcome Gap', 4, 'Q4',
     'selected_option IN (''UNTRACKED'', ''NO_TRANSITION_RECORD'')', 'FLAG_OUTCOME_LEAKAGE', 'HIGH',
     'Transition or remedial closure outcome not recorded in beneficiary continuity file.'),

    ('RULE-SUSTAIN-005', 1, 'Routine Joint Review and Sustainability Gap', 5, 'Q5',
     'selected_option IN (''NO_REVIEW'', ''NO_COORDINATION'', ''NO_JOINT_REVIEW'')', 'FLAG_SUSTAINABILITY_DEFICIT', 'MEDIUM',
     'Routine monthly or block-level coordination review not conducted across departments.')
ON CONFLICT (rule_id, version) DO NOTHING;
