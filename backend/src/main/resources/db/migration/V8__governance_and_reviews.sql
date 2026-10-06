-- =============================================================================
-- ABHISARAN – District Programme Continuity Scan
-- V8 Governance, Exit Briefings, Factual Corrections & Reviewer Pack Migration
-- =============================================================================

-- 1. Exit Briefings Table (AEHT §14.1)
CREATE TABLE IF NOT EXISTS exit_briefings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    delivery_point_code VARCHAR(20) NOT NULL REFERENCES delivery_points(code),
    briefing_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    conducted_by VARCHAR(100) NOT NULL,
    institution_head_designation VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'ACKNOWLEDGED', 'SHARED_UNSIGNED', 'REFUSED_NON_ADVERSE'
    acknowledgement_text TEXT,
    refusal_reason TEXT,
    non_adverse_declaration BOOLEAN NOT NULL DEFAULT TRUE, -- Invariant: refusal is never adverse evidence
    factual_discrepancies_notes TEXT,
    material_corrections_logged BOOLEAN NOT NULL DEFAULT FALSE,
    correction_window_closes_at TIMESTAMP WITH TIME ZONE,
    finalized BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_briefing_dp ON exit_briefings(delivery_point_code);
CREATE INDEX IF NOT EXISTS idx_briefing_status ON exit_briefings(status);

-- 2. Factual Corrections Table (AEHT §14.1 / §8, GOVN-02)
CREATE TABLE IF NOT EXISTS factual_corrections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    delivery_point_code VARCHAR(20) NOT NULL REFERENCES delivery_points(code),
    evidence_id UUID REFERENCES evidence(id),
    metric_target VARCHAR(100) NOT NULL,
    original_value TEXT NOT NULL, -- Invariant: permanent retention of original value
    corrected_value TEXT NOT NULL,
    justification TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED', -- 'SUBMITTED', 'VALIDATED', 'REJECTED'
    submitted_by VARCHAR(100) NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    validated_by VARCHAR(100),
    validated_at TIMESTAMP WITH TIME ZONE,
    decision_notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_corr_dp ON factual_corrections(delivery_point_code);
CREATE INDEX IF NOT EXISTS idx_corr_status ON factual_corrections(status);

-- 3. Reviewer Declarations Table (AEHT §8.3, GOVN-03)
CREATE TABLE IF NOT EXISTS reviewer_declarations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reviewer_name VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    organization VARCHAR(100) NOT NULL,
    area_of_expertise VARCHAR(150) NOT NULL,
    no_reporting_line_to_field_team BOOLEAN NOT NULL,
    not_aeht_employee_or_board_3_years BOOLEAN NOT NULL,
    confidentiality_agreed BOOLEAN NOT NULL,
    district_approval_status VARCHAR(50) NOT NULL DEFAULT 'ACCEPTED', -- 'PENDING', 'ACCEPTED', 'ALTERNATIVE_PROPOSED', 'VETOED'
    district_decision_by VARCHAR(100),
    district_decision_notes TEXT,
    methodology_limitation_notes TEXT NOT NULL,
    disagreements_logged TEXT,
    recommendations TEXT,
    endorsement_status VARCHAR(50) NOT NULL DEFAULT 'ENDORSED_WITH_LIMITATIONS', -- 'ENDORSED_WITH_LIMITATIONS', 'SUBSTANTIVE_DISAGREEMENT', 'METHODOLOGY_INCOMPLETE'
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Seed Representative Exit Briefings for Pilot Delivery Points
INSERT INTO exit_briefings (
    id, delivery_point_code, briefing_date, conducted_by, institution_head_designation,
    status, acknowledgement_text, refusal_reason, non_adverse_declaration,
    factual_discrepancies_notes, material_corrections_logged, correction_window_closes_at, finalized
) VALUES
    (
        '80000000-0000-0000-0000-000000000001', 'EDU-01', CURRENT_TIMESTAMP - INTERVAL '2 days', 'field_lead', 'Headmaster',
        'ACKNOWLEDGED', 'Factual Observations Shared and discussed in 15-minute briefing session.', NULL, TRUE,
        'Flagged clarification regarding monthly RBSK referral slips stored in separate headmaster cupboard.', TRUE, CURRENT_TIMESTAMP + INTERVAL '24 hours', FALSE
    ),
    (
        '80000000-0000-0000-0000-000000000002', 'EDU-02', CURRENT_TIMESTAMP - INTERVAL '2 days', 'field_lead', 'Principal',
        'ACKNOWLEDGED', 'Factual Observations Shared. Discussion framed around system screening intervals.', NULL, TRUE,
        'No material factual discrepancy raised.', FALSE, CURRENT_TIMESTAMP + INTERVAL '24 hours', FALSE
    ),
    (
        '80000000-0000-0000-0000-000000000003', 'HLT-01', CURRENT_TIMESTAMP - INTERVAL '2 days', 'field_lead', 'Medical Officer In-Charge',
        'SHARED_UNSIGNED', NULL, 'Medical Officer on urgent emergency referral duty; briefing pack received by Senior Nursing Officer. Unsigned status explicitly non-adverse.', TRUE,
        'Head requested digital review of adolescent clinic register counts.', FALSE, CURRENT_TIMESTAMP + INTERVAL '24 hours', FALSE
    ),
    (
        '80000000-0000-0000-0000-000000000004', 'WCD-01', CURRENT_TIMESTAMP - INTERVAL '1 days', 'field_lead', 'Anganwadi Worker Lead',
        'ACKNOWLEDGED', 'Factual Observations Shared. Discussion on VHSND register handoff.', NULL, TRUE,
        'None recorded.', FALSE, CURRENT_TIMESTAMP + INTERVAL '48 hours', FALSE
    ),
    (
        '80000000-0000-0000-0000-000000000005', 'WCD-02', CURRENT_TIMESTAMP - INTERVAL '1 days', 'field_lead', 'Anganwadi Worker',
        'REFUSED_NON_ADVERSE', NULL, 'Worker attending mandatory district POSHAN abhiyan training session; non-adverse recording logged per AEHT §14.1.', TRUE,
        'None; re-briefing scheduled with supervisor.', FALSE, CURRENT_TIMESTAMP + INTERVAL '48 hours', FALSE
    )
ON CONFLICT (id) DO NOTHING;

-- 5. Seed Representative Factual Correction
INSERT INTO factual_corrections (
    id, delivery_point_code, evidence_id, metric_target, original_value, corrected_value,
    justification, status, submitted_by, submitted_at, validated_by, validated_at, decision_notes
) VALUES
    (
        '81000000-0000-0000-0000-000000000001', 'EDU-01', NULL, 'DOCUMENTED_REFERRAL',
        'Physical referral counterfoil not found in primary office shelf (Captured as NOT_VERIFIED)',
        'Physical referral counterfoils located in secure headmaster archive (18 of 20 verified present)',
        'RBSK referral counterfoils were maintained in locked headmaster almirah during visit, produced during exit briefing window with zero PII visible.',
        'VALIDATED', 'field_lead', CURRENT_TIMESTAMP - INTERVAL '1 days', 'nodal_officer', CURRENT_TIMESTAMP - INTERVAL '12 hours',
        'District Nodal Officer validated physical counterfoils without beneficiary names.'
    )
ON CONFLICT (id) DO NOTHING;

-- 6. Seed Independent Reviewer Declaration Pack
INSERT INTO reviewer_declarations (
    id, reviewer_name, designation, organization, area_of_expertise,
    no_reporting_line_to_field_team, not_aeht_employee_or_board_3_years, confidentiality_agreed,
    district_approval_status, district_decision_by, district_decision_notes,
    methodology_limitation_notes, disagreements_logged, recommendations, endorsement_status, submitted_at
) VALUES
    (
        '82000000-0000-0000-0000-000000000001', 'Dr. Sunita K.', 'Senior Public Health & Primary Education Specialist',
        'Institute for Development Governance & Research', 'Cross-sector Child Development Continuity & Quality Systems',
        TRUE, TRUE, TRUE,
        'ACCEPTED', 'dm_magistrate', 'Confirmed independent standing and approved review scope per AEHT §8.3.',
        'Purposive 10-point cross-sectional pilot provides valid descriptive diagnosis of cross-departmental referral friction. Strictly not a causal evaluation or district-wide statistical census. ACS serves as a continuity diagnostic only.',
        'Noted that RBSK specialist referrals face systemic blockages beyond the control of primary delivery nodes.',
        'Recommended institutionalizing monthly joint block review between Education BEO and Health MOIC.',
        'ENDORSED_WITH_LIMITATIONS', CURRENT_TIMESTAMP - INTERVAL '1 days'
    )
ON CONFLICT (id) DO NOTHING;
