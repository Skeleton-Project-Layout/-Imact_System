-- =============================================================================
-- ABHISARAN – District Programme Continuity Scan
-- V1 Baseline Schema: Pure Zero-PII, Relational Entities, Append-Only Auditing
-- =============================================================================

-- Ensure UUID extension is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Districts Configuration
CREATE TABLE IF NOT EXISTS districts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pilot_status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Sectors
CREATE TABLE IF NOT EXISTS sectors (
    id VARCHAR(50) PRIMARY KEY, -- 'EDUCATION', 'HEALTH_RBSK', 'WCD_ANGANWADI'
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO sectors (id, display_name, description) VALUES
    ('EDUCATION', 'Education (Schools)', 'School-based touchpoints, screening records, and referrals'),
    ('HEALTH_RBSK', 'Health / RBSK', 'RBSK screening teams, primary health centers, and referral hospitals'),
    ('WCD_ANGANWADI', 'Women & Child Development (Anganwadi)', 'Anganwadi centres, supplementary nutrition, and growth monitoring')
ON CONFLICT (id) DO NOTHING;

-- 3. Delivery Points (Non-identifying codes e.g. EDU-01, HLT-01, WCD-01)
-- Absolute Principle: No institutional personal names in analytic views
CREATE TABLE IF NOT EXISTS delivery_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    district_id UUID NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
    code VARCHAR(20) NOT NULL UNIQUE, -- 'EDU-01', 'EDU-02', 'HLT-01', etc.
    sector_id VARCHAR(50) NOT NULL REFERENCES sectors(id),
    category VARCHAR(50) NOT NULL, -- 'HIGH_PERFORMING', 'LOW_PERFORMING', 'DIFFICULT_ACCESS'
    selection_rationale TEXT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Users and Roles (RBAC)
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(50) PRIMARY KEY,
    description TEXT NOT NULL
);

INSERT INTO roles (id, description) VALUES
    ('DISTRICT_MAGISTRATE', 'Administrative oversight, pilot approval, authorises use of findings'),
    ('DISTRICT_NODAL_OFFICER', 'Day-to-day coordination, sample confirmation, validates factual corrections'),
    ('ARYABHATA_FIELD_TEAM', 'Evidence collection, process mapping, draft outputs; no sanctioning authority'),
    ('INDEPENDENT_REVIEWER', 'Methodology and analytical assurance; no implementation authority'),
    ('INSTITUTION_HEAD', 'Reviews factual observations, exit briefing participant')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(150),
    role_id VARCHAR(50) NOT NULL REFERENCES roles(id),
    district_id UUID REFERENCES districts(id),
    delivery_point_code VARCHAR(20),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Pathways
CREATE TABLE IF NOT EXISTS pathways (
    id VARCHAR(50) PRIMARY KEY, -- 'SCHOOL_TO_HEALTH', 'ANGANWADI_TO_SCHOOL', 'COMMUNITY_TO_FACILITY'
    name VARCHAR(150) NOT NULL,
    from_sector VARCHAR(50) NOT NULL REFERENCES sectors(id),
    to_sector VARCHAR(50) NOT NULL REFERENCES sectors(id),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO pathways (id, name, from_sector, to_sector, description) VALUES
    ('ANGANWADI_TO_SCHOOL', 'Preschool to Primary School Transition', 'WCD_ANGANWADI', 'EDUCATION', 'Preschool readiness and nutrition hand-off to primary school'),
    ('SCHOOL_TO_HEALTH', 'School Health Screening to PHC/CHC Referral', 'EDUCATION', 'HEALTH_RBSK', 'RBSK health screening identification to medical follow-up'),
    ('HEALTH_TO_WCD', 'Nutrition Rehabilitation Follow-Up', 'HEALTH_RBSK', 'WCD_ANGANWADI', 'Post-screening care continuity to Anganwadi nutrition support')
ON CONFLICT (id) DO NOTHING;

-- 6. Zero-PII Continuity Tokens
-- Absolute Principle: Token-to-identity belongs solely to the District. No mapping table exists here.
CREATE TABLE IF NOT EXISTS continuity_tokens (
    token_id VARCHAR(64) PRIMARY KEY, -- Opaque cryptographic hash/token
    district_id UUID NOT NULL REFERENCES districts(id),
    pathway_id VARCHAR(50) NOT NULL REFERENCES pathways(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Rule Definitions (Configurable, Versioned Rule rows)
CREATE TABLE IF NOT EXISTS rule_definitions (
    rule_id VARCHAR(50) NOT NULL,
    version INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    layer INT NOT NULL,
    convergence_question VARCHAR(10) NOT NULL,
    condition_expression TEXT NOT NULL,
    flag_code VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL, -- 'HIGH', 'MEDIUM', 'LOW'
    explanation_template TEXT NOT NULL,
    effective_from TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (rule_id, version)
);

-- 8. Action Definitions Catalogue
CREATE TABLE IF NOT EXISTS action_definitions (
    action_id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    responsible_system VARCHAR(100) NOT NULL,
    escalation_condition TEXT,
    indicative_timeline VARCHAR(50),
    required_next_approval VARCHAR(100)
);

-- 9. Append-Only Audit Log
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    user_role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    previous_state JSONB,
    new_state JSONB,
    reason TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Privacy Incidents (2-hour escalation clock)
CREATE TABLE IF NOT EXISTS privacy_incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    delivery_point_id UUID REFERENCES delivery_points(id),
    status VARCHAR(50) NOT NULL DEFAULT 'DETECTED', -- DETECTED, CONTAINED, NODAL_NOTIFIED, CLOSED
    detection_source VARCHAR(100) NOT NULL, -- 'OCR_SCANNER', 'FIELD_VALIDATION', 'AUDIT'
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    nodal_notified_at TIMESTAMP WITH TIME ZONE,
    contained_at TIMESTAMP WITH TIME ZONE,
    closed_at TIMESTAMP WITH TIME ZONE,
    non_identifying_description TEXT NOT NULL,
    containment_action TEXT NOT NULL
);

-- Seed a default pilot district for immediate out-of-the-box readiness
INSERT INTO districts (id, name, state)
VALUES ('00000000-0000-0000-0000-000000000001', 'Ranchi Rural Pilot', 'Jharkhand')
ON CONFLICT (id) DO NOTHING;
