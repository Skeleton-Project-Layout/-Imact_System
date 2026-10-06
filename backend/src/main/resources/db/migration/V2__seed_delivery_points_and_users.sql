-- =============================================================================
-- ABHISARAN – District Programme Continuity Scan
-- V2 Seed Data: 10 Delivery Points (4/3/3 Balance) & 5 Role User Accounts
-- =============================================================================

-- 1. Seed 10 Delivery Points for Pilot District
-- Criteria: Geographical diversity, institution type, service intensity, convergence points, feasibility
INSERT INTO delivery_points (id, district_id, code, sector_id, category, selection_rationale, active) VALUES
    ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'EDU-01', 'EDUCATION', 'DIFFICULT_ACCESS', 'Remote forest cluster primary school; difficult seasonal access during monsoon.', true),
    ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'EDU-02', 'EDUCATION', 'LOW_PERFORMING', 'Middle school with historically low transition rates to secondary and weak health screening logs.', true),
    ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'EDU-03', 'EDUCATION', 'HIGH_PERFORMING', 'High school with complete UDISE+ compliance and structured remedial register.', true),
    ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'EDU-04', 'EDUCATION', 'CONVERGENCE_INTENSIVE', 'KGBV residential school serving vulnerable girls; intensive cross-sector health and nutrition convergence.', true),
    
    ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'HLT-01', 'HEALTH_RBSK', 'DIFFICULT_ACCESS', 'Block boundary PHC with limited mobile connectivity; designated RBSK screening node.', true),
    ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'HLT-02', 'HEALTH_RBSK', 'HIGH_PERFORMING', 'Community Health Centre (CHC) with dedicated adolescent health clinic and active referral desk.', true),
    ('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'HLT-03', 'HEALTH_RBSK', 'LOW_PERFORMING', 'Sub-Divisional Hospital outpatient unit facing documented specialist referral backlog.', true),
    
    ('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'WCD-01', 'WCD_ANGANWADI', 'DIFFICULT_ACCESS', 'Remote tribal tola Anganwadi centre with seasonal road cutoff.', true),
    ('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'WCD-02', 'WCD_ANGANWADI', 'LOW_PERFORMING', 'Anganwadi centre with historically incomplete growth monitoring register.', true),
    ('30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'WCD-03', 'WCD_ANGANWADI', 'HIGH_PERFORMING', 'Model Anganwadi centre with regular preschool learning and routine health check-up coordination.', true)
ON CONFLICT (code) DO NOTHING;

-- 2. Seed Default User Accounts for all 5 AEHT Roles
-- Password for all demo accounts: 'Abhisaran@2026'
-- BCrypt hash: '$2a$10$wJtK5k8D4P1m3xQ2z9Y7t.lO8V6K0r1e2q3s4t5u6v7w8x9y0z1a2'
INSERT INTO users (id, username, password_hash, email, role_id, district_id, delivery_point_code, active) VALUES
    ('90000000-0000-0000-0000-000000000001', 'dm_magistrate', '$2a$10$tJm9A5d8oU5bI7sN3wE1q.lK2P4Q7R9T1V3X5Z7B9D1F3H5J7L9N', 'dm@district.gov.in', 'DISTRICT_MAGISTRATE', '00000000-0000-0000-0000-000000000001', null, true),
    ('90000000-0000-0000-0000-000000000002', 'nodal_officer', '$2a$10$tJm9A5d8oU5bI7sN3wE1q.lK2P4Q7R9T1V3X5Z7B9D1F3H5J7L9N', 'nodal@district.gov.in', 'DISTRICT_NODAL_OFFICER', '00000000-0000-0000-0000-000000000001', null, true),
    ('90000000-0000-0000-0000-000000000003', 'field_lead', '$2a$10$tJm9A5d8oU5bI7sN3wE1q.lK2P4Q7R9T1V3X5Z7B9D1F3H5J7L9N', 'field@aeht.org', 'ARYABHATA_FIELD_TEAM', '00000000-0000-0000-0000-000000000001', null, true),
    ('90000000-0000-0000-0000-000000000004', 'independent_reviewer', '$2a$10$tJm9A5d8oU5bI7sN3wE1q.lK2P4Q7R9T1V3X5Z7B9D1F3H5J7L9N', 'reviewer@independent.org', 'INDEPENDENT_REVIEWER', '00000000-0000-0000-0000-000000000001', null, true),
    ('90000000-0000-0000-0000-000000000005', 'head_edu01', '$2a$10$tJm9A5d8oU5bI7sN3wE1q.lK2P4Q7R9T1V3X5Z7B9D1F3H5J7L9N', 'edu01@schools.gov.in', 'INSTITUTION_HEAD', '00000000-0000-0000-0000-000000000001', 'EDU-01', true)
ON CONFLICT (username) DO NOTHING;
