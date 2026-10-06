-- =============================================================================
-- ABHISARAN – District Programme Continuity Scan
-- V9 30-Day Retention Schedules & Deletion Certificates Migration
-- =============================================================================

-- 1. Retention Schedules Table (AEHT §8.2, SEC-02)
CREATE TABLE IF NOT EXISTS retention_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pilot_district_id UUID REFERENCES districts(id),
    handover_date TIMESTAMP WITH TIME ZONE NOT NULL,
    retention_period_days INT NOT NULL DEFAULT 30,
    scheduled_purge_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE_COUNTDOWN', -- 'ACTIVE_COUNTDOWN', 'READY_FOR_PURGE', 'PURGED', 'EXTENDED_BY_DISTRICT'
    district_written_directive_ref TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_retention_status ON retention_schedules(status);

-- 2. Deletion Certificates Table (AEHT §8.2, SEC-03)
CREATE TABLE IF NOT EXISTS deletion_certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_number VARCHAR(100) UNIQUE NOT NULL,
    district_nodal_officer_name VARCHAR(100) NOT NULL,
    purged_by VARCHAR(100) NOT NULL,
    purged_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    scope_description TEXT NOT NULL,
    record_count INT NOT NULL,
    verification_hash VARCHAR(255) NOT NULL, -- SHA-256 cryptographic verification checksum
    statutory_compliance_note TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_deletion_cert_num ON deletion_certificates(certificate_number);

-- 3. Seed Initial Pilot Retention Schedule (Day 7 Handover)
INSERT INTO retention_schedules (
    id, pilot_district_id, handover_date, retention_period_days, scheduled_purge_date, status
) VALUES (
    '91000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    CURRENT_TIMESTAMP - INTERVAL '7 days',
    30,
    CURRENT_TIMESTAMP + INTERVAL '23 days',
    'ACTIVE_COUNTDOWN'
) ON CONFLICT (id) DO NOTHING;

-- 4. Seed Representative Pre-Pilot Deletion Certificate
INSERT INTO deletion_certificates (
    id, certificate_number, district_nodal_officer_name, purged_by, purged_at,
    scope_description, record_count, verification_hash, statutory_compliance_note
) VALUES (
    '92000000-0000-0000-0000-000000000001',
    'AEHT-DEL-2026-001',
    'Shri R. K. Soren, District Nodal Officer',
    'field_lead (Aryabhata Team Lead)',
    CURRENT_TIMESTAMP - INTERVAL '8 days',
    'Pre-pilot training device temporary cache files and practice question responses across 3 orientation tablets',
    42,
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    'Certified under AEHT §8.2 and Digital Personal Data Protection guidelines. All staging tokens irreversibly purged.'
) ON CONFLICT (id) DO NOTHING;
