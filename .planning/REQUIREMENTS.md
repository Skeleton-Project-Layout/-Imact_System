# Requirements: ABHISARAN – District Programme Continuity Scan

**Defined:** 2026-10-06  
**Core Value:** Deterministic, verifiable, and zero-PII continuity tracking that connects field evidence directly to district administrative action without black-box scoring or punitive ranking.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Architecture & Monorepo (`ARCH`)

- [x] **ARCH-01**: Root monorepo workspace containing `backend/` (Java Spring Boot), `frontend/` (React Vite), and `ai-service/` (FastAPI)
- [x] **ARCH-02**: Docker Compose orchestration for local multi-container development and verification
- [x] **ARCH-03**: Supabase PostgreSQL database integration with Flyway version-controlled migrations
- [x] **ARCH-04**: Supabase Storage integration with backend pre-signed URLs for sanitized document uploads

### Security & Zero-PII Safeguards (`SEC`)

- [x] **SEC-01**: Client-side and server-side Zero-PII validation blocking names, Aadhaar, phones, addresses, and facial photos
- [x] **SEC-02**: Non-identifying continuity token architecture without any database table or mapping for beneficiary PII
- [x] **SEC-03**: Automatic PrivacyIncident creation, containment, and 2-hour notification countdown on suspected PII
- [x] **SEC-04**: 30-day post-handover retention countdown with auditable deletion and deletion certificate generation

### Role-Based Access Control (`RBAC`)

- [x] **RBAC-01**: Backend-enforced role authentication covering DM, Nodal Officer, Field Team, Reviewer, and Institution Head
- [x] **RBAC-02**: Endpoint-level security tests verifying unauthorized data and action denial per role

### Field Evidence Collection / Front A (`SRCE`)

- [x] **SRCE-01**: Mobile-first Abhisaran Source web app (`/source/*`) with offline queue, autosave, and minimal typing
- [x] **SRCE-02**: Versioned question catalogue seeded across 5 layers and 5 convergence questions with "Why am I collecting this?" metadata
- [x] **SRCE-03**: Scheduling guard preventing field visits on exam days, immunisation days, or Anganwadi visits without female team member
- [x] **SRCE-04**: Finite state machine for evidence verification (`VERIFIED`, `NOT_VERIFIED`, `PENDING_REVIEW`, `REJECTED`, `CORRECTED`)

### Deterministic Scoring & Rule Engine (`SCOR`)

- [x] **SCOR-01**: Canonical JavaScript reference implementation of scoring (`engine.js`) with shared JSON golden fixtures
- [x] **SCOR-02**: Java Spring Boot port of scoring engine with 100% mathematical parity against golden fixtures
- [x] **SCOR-03**: Four equally weighted components (25% each) rebased over applicable count with N/A exclusion handling
- [x] **SCOR-04**: Declarative RuleDefinition catalogue and Flag engine mapping verified gaps to deterministic flags

### Priority Action Framework (`PRIO`)

- [x] **PRIO-01**: Human decision-owner entry of Urgency (1–5) and Reach (1–5) with `PriorityScore = Urgency × Reach`
- [x] **PRIO-02**: Feasibility (1–5) displayed strictly as an independent decision flag without modifying priority score
- [x] **PRIO-03**: Mandatory legal planning disclaimer displayed on every action brief and register

### Decision-Support Panel / Front B (`DASH`)

- [x] **DASH-01**: Professional government admin panel (`/admin/*`) answering where, why, and what action is needed
- [x] **DASH-02**: Aggregate convergence heat-map (pathway × layer/component) using non-punitive system language
- [x] **DASH-03**: Impact Passport generation for up to 10 delivery points with verified strengths and gaps
- [x] **DASH-04**: Drill-down trace drawer linking every score and flag back to assessment, pathway, evidence, rule ID, and verifier
- [x] **DASH-05**: Explain Score modal showing formula calculation string, component breakdown, and evidence trail

### Governance & Corrections (`GOVN`)

- [x] **GOVN-01**: Delivery point exit briefing workflow recording factual observations, signatures, or non-adverse refusal
- [x] **GOVN-02**: Immutable, audited correction workflow retaining original values and verifier justification
- [x] **GOVN-03**: Independent reviewer declaration, conflict-of-interest check, and methodology limitation notes

### Assistive AI Microservice (`AIMS`)

- [x] **AIMS-01**: Python FastAPI service restricted to OCR text extraction, PII pre-check, and drafting action briefs
- [x] **AIMS-02**: Complete write-path isolation ensuring AI cannot write to scores, flags, priorities, or verification states

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

- **V2-01**: Additional sectors (water/sanitation, rural development, agriculture, skills)
- **V2-02**: Native mobile application (React Native / Android APK)
- **V2-03**: Multi-district comparative analysis (governed by state-level permissions)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Beneficiary / Child PII Storage | Zero-PII architectural mandate; continuity tracked solely via non-identifying district tokens |
| School / Institution League Tables & Rankings | Prohibited by AEHT (§3.2); non-punitive design focused on system pathway continuity |
| Autonomous / Black-Box AI Scoring | Prohibited by AEHT (§3.4); AI is strictly assistive with no write permissions to scores or flags |
| Broad inter-district or causal impact claims | Prohibited by AEHT (§15.1); small purposive pilot measures continuity, not causal impact |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| ARCH-01 | Phase 1 | Complete |
| ARCH-02 | Phase 1 | Complete |
| ARCH-03 | Phase 1 | Complete |
| ARCH-04 | Phase 1 | Complete |
| RBAC-01 | Phase 2 | Complete |
| RBAC-02 | Phase 2 | Complete |
| SRCE-01 | Phase 3 | Complete |
| SRCE-02 | Phase 3 | Complete |
| SRCE-03 | Phase 3 | Complete |
| SRCE-04 | Phase 3 | Complete |
| SCOR-01 | Phase 4 | Complete |
| SCOR-02 | Phase 4 | Complete |
| SCOR-03 | Phase 4 | Complete |
| SCOR-04 | Phase 4 | Complete |
| PRIO-01 | Phase 5 | Complete |
| PRIO-02 | Phase 5 | Complete |
| PRIO-03 | Phase 5 | Complete |
| DASH-01 | Phase 6 | Complete |
| DASH-02 | Phase 6 | Complete |
| DASH-03 | Phase 6 | Complete |
| DASH-04 | Phase 6 | Complete |
| DASH-05 | Phase 6 | Complete |
| GOVN-01 | Phase 7 | Complete |
| GOVN-02 | Phase 7 | Complete |
| GOVN-03 | Phase 7 | Complete |
| SEC-01 | Phase 8 | Complete |
| SEC-02 | Phase 8 | Complete |
| SEC-03 | Phase 8 | Complete |
| SEC-04 | Phase 8 | Complete |
| AIMS-01 | Phase 9 | Complete |
| AIMS-02 | Phase 9 | Complete |

**Coverage:**
- v1 requirements: 29 total
- Mapped to phases: 29
- Unmapped: 0 ✅

---
*Requirements defined: 2026-10-06*
*Last updated: 2026-10-06 after initial definition*
