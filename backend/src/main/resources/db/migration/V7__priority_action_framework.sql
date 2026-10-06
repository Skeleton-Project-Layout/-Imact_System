-- =============================================================================
-- ABHISARAN – District Programme Continuity Scan
-- V7 Priority Action Framework Migration
-- =============================================================================

CREATE TABLE IF NOT EXISTS priority_action_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flag_evaluation_id UUID NOT NULL REFERENCES flag_evaluations(id) ON DELETE CASCADE,
    delivery_point_code VARCHAR(20) NOT NULL REFERENCES delivery_points(code),
    urgency INT NOT NULL CHECK (urgency BETWEEN 1 AND 5),
    reach INT NOT NULL CHECK (reach BETWEEN 1 AND 5),
    priority_score INT NOT NULL CHECK (priority_score BETWEEN 1 AND 25),
    priority_band VARCHAR(20) NOT NULL, -- 'VERY_HIGH', 'HIGH', 'MEDIUM', 'LOW'
    feasibility INT NOT NULL CHECK (feasibility BETWEEN 1 AND 5),
    feasibility_label VARCHAR(50) NOT NULL,
    rationale TEXT NOT NULL,
    decision_owner_id UUID REFERENCES users(id),
    decision_owner_role VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PROPOSED',
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_prio_dp ON priority_action_items(delivery_point_code);
CREATE INDEX IF NOT EXISTS idx_prio_score ON priority_action_items(priority_score DESC);
CREATE INDEX IF NOT EXISTS idx_prio_band ON priority_action_items(priority_band);
