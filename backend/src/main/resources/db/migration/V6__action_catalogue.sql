-- =============================================================================
-- ABHISARAN – District Programme Continuity Scan
-- V6 Action Catalogue & Flag Evaluations Migration
-- =============================================================================

-- 1. Seed Predefined Action Definitions Catalogue
INSERT INTO action_definitions (action_id, title, description, responsible_system, escalation_condition, indicative_timeline, required_next_approval) VALUES
    ('ACT-REF-01', 'Establish Standardized Referral Register & Designate Nodal Desk',
     'Issue standard bilingual physical/digital screening registers and formally designate a trained nodal teacher or worker with counter-signature responsibility.',
     'District Education Office / District Social Welfare', 'Absence of screening log exceeds 30 days', '7 Days', 'DISTRICT_NODAL_OFFICER'),

    ('ACT-READ-02', 'Deploy Functional Diagnostic Screening Equipment & Duty Orders',
     'Re-calibrate anthropometric stadiometers or replace defective RBSK 4D screening kits. Publish formal duty order for touchpoint nodal lead.',
     'Chief Medical Officer / RBSK Nodal Wing', 'Equipment unavailable during routine scan', '14 Days', 'DISTRICT_MAGISTRATE'),

    ('ACT-HANDOFF-03', 'Operationalize 14-Day Cross-Sector Counter-Referral Tracking',
     'Establish mandatory return loop: PHC / CHC medical officers must countersign and return referral slips to referring schools/AWCs within 14 days.',
     'Block Medical Officer of Health / PHC In-Charge', 'Counter-referral delay exceeds 21 days', '14 Days', 'DISTRICT_NODAL_OFFICER'),

    ('ACT-CLOSURE-04', 'Audit Medical Care Closure & Primary School Transition Portfolios',
     'Institute monthly verification of completed clinical treatments and verify transition readiness portfolios handed over from Anganwadi to primary school.',
     'Block Education Office / CDPO Joint Committee', 'More than 20% referrals unclosed after 60 days', '30 Days', 'DISTRICT_NODAL_OFFICER'),

    ('ACT-SUSTAIN-05', 'Mandate Monthly Inter-Departmental Block Convergence Review',
     'Institutionalize monthly block coordination meetings between Health (MOIC), Education (BEO), and WCD (CDPO) with mandatory documented minutes.',
     'Block Development Officer / District Administration', 'No joint meeting held for 2 consecutive months', 'Monthly Routine', 'DISTRICT_MAGISTRATE')
ON CONFLICT (action_id) DO NOTHING;

-- 2. Create Flag Evaluations Table
CREATE TABLE IF NOT EXISTS flag_evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evidence_id UUID NOT NULL REFERENCES evidence(id) ON DELETE CASCADE,
    delivery_point_code VARCHAR(20) NOT NULL REFERENCES delivery_points(code),
    sector_id VARCHAR(50) NOT NULL REFERENCES sectors(id),
    layer INT NOT NULL CHECK (layer BETWEEN 1 AND 5),
    rule_id VARCHAR(50) NOT NULL,
    rule_version INT NOT NULL DEFAULT 1,
    flag_code VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    recommended_action_id VARCHAR(50) REFERENCES action_definitions(action_id),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_flag_eval_dp ON flag_evaluations(delivery_point_code);
CREATE INDEX IF NOT EXISTS idx_flag_eval_code ON flag_evaluations(flag_code);
CREATE INDEX IF NOT EXISTS idx_flag_eval_status ON flag_evaluations(status);
