# Roadmap: ABHISARAN – District Programme Continuity Scan

## Overview

A phased journey to construct the ABHISARAN District Programme Continuity Scan decision-support system. Starting from a clean full-stack monorepo foundation with Supabase PostgreSQL and Docker Compose, we progress through domain modeling and RBAC, mobile-first field evidence collection, deterministic ACS scoring parity, the Priority Action Framework, administrative decision-support dashboards, governance workflows, privacy incident automation, assistive AI isolation, and end-to-end security verification.

## Phases

- [x] **Phase 1: Monorepo Foundation & Container Environment** - Monorepo architecture (`frontend/`, `backend/`, `ai-service/`), Supabase PostgreSQL Flyway baseline, and Docker Compose
- [x] **Phase 2: Domain Modeling, Auth & RBAC** - Core entities (District, Delivery Points, Sectors, Pathways) and Spring Security 5-role RBAC with denial tests
- [x] **Phase 3: Field Source Workflow & Evidence Safeguards** - Mobile-first Front A (`/source/*`), 5-layer question catalogue, offline queue, scheduling guards, and Zero-PII pre-check
- [x] **Phase 4: Deterministic Scoring & ACS Engine** - Canonical JavaScript scoring engine (`engine.js`) with shared JSON golden fixtures, ported to Java Spring Boot with provable parity
- [x] **Phase 5: Flag Engine, Action Catalogue & Priority Action Framework** - Deterministic gap-to-flag evaluation, predefined ActionDefinition catalogue, and human-owned Priority Action Framework (Urgency × Reach, Feasibility flag)
- [ ] **Phase 6: Admin Decision-Support Panel & Impact Passports** - Front B (`/admin/*`) featuring district overview, convergence heat-map, delivery point Impact Passports, and drill-down trace drawer
- [ ] **Phase 7: Governance, Reviewer & Exit Briefings** - Institutional exit briefing logging, factual correction windows, and independent reviewer declarations
- [ ] **Phase 8: Privacy Incident Management, Retention & Audit Hardening** - 2-hour PII notification countdown, 30-day retention countdown, deletion certificate generation, and append-only audit logging
- [ ] **Phase 9: Assistive AI Microservice** - Python FastAPI microservice for OCR extraction, PII text screening, and draft action brief generation with strict read-only boundary
- [ ] **Phase 10: End-to-End Verification, Security Audit & Docker Deployment** - Comprehensive automated integration test suite, Zero-PII audit, and production Docker Compose build

## Phase Details

### Phase 1: Monorepo Foundation & Container Environment
**Goal**: Establish clean monorepo architecture with `frontend/`, `backend/`, and `ai-service/`, local environment configs, Supabase PostgreSQL connectivity via Flyway baseline, and Docker Compose orchestration.  
**Depends on**: Nothing  
**Requirements**: ARCH-01, ARCH-02, ARCH-03, ARCH-04  
**Success Criteria**:
1. Monorepo folder layout exists with clear separation for React frontend, Java Spring Boot backend, and Python FastAPI microservice.
2. Flyway baseline migration runs against Supabase/PostgreSQL schema successfully.
3. Multi-service Docker Compose and development scripts run without port or dependency conflicts.
**Plans**: 3 plans

Plans:
- [x] 01-01: Monorepo directory structure, environment templates, and Docker Compose configuration
- [x] 01-02: Java 21 Spring Boot skeleton with PostgreSQL driver and initial Flyway migration
- [x] 01-03: React Vite frontend skeleton (dual shells `/source/*` and `/admin/*`) and Python FastAPI skeleton

### Phase 2: Domain Modeling, Auth & RBAC
**Goal**: Implement core domain models (District, Delivery Points, Sectors, Pathways) and Spring Security RBAC covering all 5 AEHT roles with denial tests.  
**Depends on**: Phase 1  
**Requirements**: RBAC-01, RBAC-02  
**Success Criteria**:
1. All 5 user roles authenticated and authorized via JWT/session.
2. Role-denial tests pass for unauthorized analytical access or modification.
3. Delivery point sample selection registry initialized with non-identifying codes (e.g., `EDU-01`).
**Plans**: 2 plans

Plans:
- [x] 02-01: JPA entity modeling for User, Role, District, DeliveryPoint, Sector, and Pathway
- [x] 02-02: Spring Security authentication filter, role definitions, and role-denial test suite

### Phase 3: Field Source Workflow & Evidence Safeguards
**Goal**: Deliver mobile-first Front A (`/source/*`) for field workers with 5-layer question catalogue, offline tolerance, scheduling guards, and Zero-PII pre-check.  
**Depends on**: Phase 2  
**Requirements**: SRCE-01, SRCE-02, SRCE-03, SRCE-04  
**Success Criteria**:
1. Field workers can record structured observations with minimal typing across the 5 layers.
2. Scheduling guard warns/blocks visits on exam or immunisation days.
3. Client-side and server-side validation blocks any upload containing names, Aadhaar, phones, or faces.
4. Finite state machine enforces auditable verification state transitions.
**Plans**: 3 plans

Plans:
- [x] 03-01: Seeded, versioned question catalogue carrying layer, convergence question, and "Why am I collecting this?" metadata
- [x] 03-02: Front A React mobile-first collection UI with offline queue and field-day scheduling guards
- [x] 03-03: Evidence submission API, attachment validation pre-check, and verification state machine

### Phase 4: Deterministic Scoring & ACS Engine
**Goal**: Implement the canonical JavaScript reference scoring engine (`engine.js`) with shared JSON golden fixtures, and port it to Java Spring Boot with provable parity.  
**Depends on**: Phase 3  
**Requirements**: SCOR-01, SCOR-02, SCOR-03, SCOR-04  
**Success Criteria**:
1. JavaScript canonical engine and Java Spring Boot scoring service produce bit-identical results on all golden fixtures.
2. N/A component rebasing accurately calculates ACS and displays applicable count (e.g., 3/4).
3. Unverified evidence cannot contribute to ACS calculation or verified gap status.
4. Explain Score API returns formula string, weighted breakdown, and linked evidence IDs.
**Plans**: 3 plans

Plans:
- [x] 04-01: Canonical `abhisaran-core/engine.js` scoring logic and comprehensive JSON golden fixtures
- [x] 04-02: Java Spring Boot scoring service port with unit tests validating golden-fixture parity
- [x] 04-03: Versioned scoring rule table (`RULE-SCORE-001`) and Explain Score calculation breakdown endpoint

### Phase 5: Flag Engine, Action Catalogue & Priority Action Framework
**Goal**: Implement deterministic gap-to-flag evaluation, predefined ActionDefinition catalogue, and the human-governed Priority Action Framework (Urgency × Reach, Feasibility flag).  
**Depends on**: Phase 4  
**Requirements**: PRIO-01, PRIO-02, PRIO-03  
**Success Criteria**:
1. Deterministic rules evaluate verified evidence to emit standard flags and recommended actions.
2. Human decision-owner can set Urgency (1–5) and Reach (1–5) yielding PriorityScore; unverified gaps reject priority scoring.
3. Feasibility is displayed strictly as a separate decision flag and never downgrades priority score.
4. Statutory planning disclaimer appears on every action brief and register view.
**Plans**: 2 plans

Plans:
- [x] 05-01: RuleDefinition evaluation engine and ActionDefinition catalogue linking gaps to responsible systems
- [x] 05-02: Priority Action Framework register, audit trail, and mandatory planning disclaimer banner

### Phase 6: Admin Decision-Support Panel & Impact Passports
**Goal**: Build Front B (`/admin/*`) featuring district overview, aggregate convergence heat-map, delivery point Impact Passports, and drill-down trace drawer.  
**Depends on**: Phase 5  
**Requirements**: DASH-01, DASH-02, DASH-03, DASH-04, DASH-05  
**Success Criteria**:
1. Admin dashboard answers where, why, and what action is needed with zero punitive ranking.
2. Convergence heat-map visualizes cross-sector handoffs without league tables.
3. Impact Passports generated per delivery point showing verified strengths and gaps.
4. Every dashboard figure and badge is clickable to an auditable evidence trace drawer.
**Plans**: 3 plans

Plans:
- [ ] 06-01: Front B government layout, navigation, and district overview metrics
- [ ] 06-02: Aggregate convergence heat-map and Impact Passport view (Annexure A)
- [ ] 06-03: Drill-down trace drawer and Explain Score modal connecting findings to raw evidence

### Phase 7: Governance, Reviewer & Exit Briefings
**Goal**: Implement delivery point exit briefing logging, factual correction windows, and independent reviewer conflict-of-interest declarations.  
**Depends on**: Phase 6  
**Requirements**: GOVN-01, GOVN-02, GOVN-03  
**Success Criteria**:
1. Exit briefing records plain-language discussion, institutional acknowledgement, or unsigned reasons without adverse scoring.
2. Correction window allows auditable factual corrections retaining original values.
3. Independent reviewer pack captures conflict declarations and methodological limitations.
**Plans**: 2 plans

Plans:
- [ ] 07-01: Exit briefing record management with institutional acknowledgement and non-adverse refusal handling
- [ ] 07-02: Factual correction submission/audit workflow and Independent Reviewer pack

### Phase 8: Privacy Incident Management, Retention & Audit Hardening
**Goal**: Implement automated PII breach containment, 2-hour notification clock, 30-day retention countdown, deletion certificate generation, and append-only audit logging.  
**Depends on**: Phase 7  
**Requirements**: SEC-01, SEC-02, SEC-03, SEC-04  
**Success Criteria**:
1. Suspected PII instantly pauses processing, logs a non-identifying PrivacyIncident, and activates the 2-hour notification countdown.
2. 30-day post-handover retention countdown triggers automated deletion workflow.
3. Formal Deletion Certificate is generated for the District Nodal Officer.
4. Append-only audit log records every critical state change with user, timestamp, and justification.
**Plans**: 2 plans

Plans:
- [ ] 08-01: Privacy incident state machine (`DETECTED` to `CLOSED`) and 2-hour notification countdown
- [ ] 08-02: 30-day retention countdown, authorized data purging, deletion certificate generator, and append-only audit logging

### Phase 9: Assistive AI Microservice
**Goal**: Build the Python FastAPI assistive microservice for OCR extraction, PII text screening, and draft action brief generation, with strict read-only boundary.  
**Depends on**: Phase 8  
**Requirements**: AIMS-01, AIMS-02  
**Success Criteria**:
1. FastAPI service receives only sanitized, verified inputs and assists in drafting plain-language briefs.
2. Security and schema tests verify AI microservice has zero write paths to scores, flags, or verification states.
3. All AI-generated text is flagged as `DRAFT` requiring explicit human review and acceptance.
**Plans**: 2 plans

Plans:
- [ ] 09-01: FastAPI application skeleton, OCR/PII text screening endpoint, and assistive draft generation
- [ ] 09-02: Backend integration client and negative security tests verifying read-only boundaries

### Phase 10: End-to-End Verification, Security Audit & Docker Deployment
**Goal**: Execute comprehensive automated integration test suite, golden-fixture parity verification, OWASP/Zero-PII security audit, and production Docker Compose build.  
**Depends on**: Phase 9  
**Requirements**: ARCH-01, ARCH-02, ARCH-03, ARCH-04, RBAC-01, RBAC-02, SRCE-01, SRCE-02, SRCE-03, SRCE-04, SCOR-01, SCOR-02, SCOR-03, SCOR-04, PRIO-01, PRIO-02, PRIO-03, DASH-01, DASH-02, DASH-03, DASH-04, DASH-05, GOVN-01, GOVN-02, GOVN-03, SEC-01, SEC-02, SEC-03, SEC-04, AIMS-01, AIMS-02  
**Success Criteria**:
1. Full test suite passes across backend, frontend, and AI microservice.
2. No school rankings or individual PII identifiable across any API endpoint or database table.
3. Docker Compose boots all services cleanly with healthy status.
**Plans**: 2 plans

Plans:
- [ ] 10-01: Comprehensive end-to-end integration and golden-fixture parity test execution
- [ ] 10-02: Security verification, zero-PII audit, and production container packaging

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Monorepo Foundation & Container Environment | 3/3 | Complete | 2026-10-06 |
| 2. Domain Modeling, Auth & RBAC | 2/2 | Complete | 2026-10-06 |
| 3. Field Source Workflow & Evidence Safeguards | 3/3 | Complete | 2026-10-06 |
| 4. Deterministic Scoring & ACS Engine | 3/3 | Complete | 2026-10-06 |
| 5. Flag Engine, Action Catalogue & Priority Action Framework | 2/2 | Complete | 2026-10-06 |
| 6. Admin Decision-Support Panel & Impact Passports | 0/3 | Not started | - |
| 7. Governance, Reviewer & Exit Briefings | 0/2 | Not started | - |
| 8. Privacy Incident Management, Retention & Audit Hardening | 0/2 | Not started | - |
| 9. Assistive AI Microservice | 0/2 | Not started | - |
| 10. End-to-End Verification, Security Audit & Docker Deployment | 0/2 | Not started | - |
