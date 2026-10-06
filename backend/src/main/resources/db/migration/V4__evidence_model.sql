-- =============================================================================
-- ABHISARAN – District Programme Continuity Scan
-- V4 Evidence Model & Verification History Migration
-- =============================================================================

CREATE TABLE IF NOT EXISTS evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    delivery_point_code VARCHAR(20) NOT NULL REFERENCES delivery_points(code),
    sector_id VARCHAR(50) NOT NULL REFERENCES sectors(id),
    layer INT NOT NULL CHECK (layer BETWEEN 1 AND 5),
    question_number INT NOT NULL,
    convergence_question VARCHAR(10) NOT NULL,
    resulting_rule_id VARCHAR(50) NOT NULL,
    source_type VARCHAR(50) NOT NULL,
    selected_option VARCHAR(100) NOT NULL,
    sample_total INT,
    sample_compliant INT,
    attachment_ref VARCHAR(255),
    document_kind VARCHAR(100),
    description TEXT,
    verification_status VARCHAR(50) NOT NULL DEFAULT 'PENDING_REVIEW',
    submitted_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_evidence_delivery_point ON evidence(delivery_point_code);
CREATE INDEX IF NOT EXISTS idx_evidence_sector_layer ON evidence(sector_id, layer);
CREATE INDEX IF NOT EXISTS idx_evidence_status ON evidence(verification_status);

CREATE TABLE IF NOT EXISTS evidence_verification_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evidence_id UUID NOT NULL REFERENCES evidence(id) ON DELETE CASCADE,
    verifier_id UUID REFERENCES users(id),
    verifier_role VARCHAR(50) NOT NULL,
    previous_status VARCHAR(50) NOT NULL,
    new_status VARCHAR(50) NOT NULL,
    justification_reason TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_evidence_history_evidence_id ON evidence_verification_history(evidence_id);
