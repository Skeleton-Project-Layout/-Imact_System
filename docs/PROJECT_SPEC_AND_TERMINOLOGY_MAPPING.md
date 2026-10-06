# ABHISARAN: Project Terminology & Specification Mapping

> **Source of Truth:** Aryabhata Educational & Health Trust (AEHT) — *District Programme Continuity Scan: Convergence & Decision-Support Framework (Administrative Approval Submission / Phase 1 Pilot DPR, September 2026)*  
> **Supporting Technical Contracts:** `ANTIGRAVITY_PROMPT.md`, `abhisaran-core/SPEC.md`, and `abhisaran-core/fixtures/scoring_golden_fixtures.json`.

This document provides a comprehensive, rigorous traceability matrix associating **every term, concept, component, and architectural part** of the ABHISARAN codebase with its specific source section, page number, and operational mandate in the provided AEHT documentation.

---

## Table of Contents

1. [Project Identity & Core Mission](#1-project-identity--core-mission)
2. [Architectural Layout & Subsystems](#2-architectural-layout--subsystems)
3. [Core Safeguards & Non-Negotiable Assurances](#3-core-safeguards--non-negotiable-assurances)
4. [Methodology: The Five Layers of Assessment](#4-methodology-the-five-layers-of-assessment)
5. [The Five Convergence Questions](#5-the-five-convergence-questions)
6. [Evidence Standards & Field Collection Lifecycle](#6-evidence-standards--field-collection-lifecycle)
7. [Deterministic Scoring: Abhisaran Continuity Score (ACS)](#7-deterministic-scoring-abhisaran-continuity-score-acs)
8. [Deterministic Rule Engine, Flags & Action Catalogue](#8-deterministic-rule-engine-flags--action-catalogue)
9. [Priority Action Framework (PAF)](#9-priority-action-framework-paf)
10. [Executive Decision-Support Panel Deliverables](#10-executive-decision-support-panel-deliverables)
11. [Governance, Reviewers & Exit Protocols](#11-governance-reviewers--exit-protocols)
12. [Privacy Incident Management & Retention Controls](#12-privacy-incident-management--retention-controls)
13. [Role-Based Access Control (RBAC) & District Actors](#13-role-based-access-control-rbac--district-actors)
14. [Statutory Boundaries & Limitations Disclaimers](#14-statutory-boundaries--limitations-disclaimers)

---

## 1. Project Identity & Core Mission

| Term / Part | Document Citation | Explanation & Operational Purpose ("A Line About This Part") | Codebase Implementation |
| :--- | :--- | :--- | :--- |
| **Aryabhata Educational & Health Trust (AEHT)** | PDF Cover, §2.1 (p. 4), §11 (p. 13), §12 (p. 14), pp. 21–24 | A Jharkhand-rooted non-profit trust established in 2010 providing in-kind technical assistance for public programme continuity across education, health, and livelihoods. | Global branding, copyright footers, entity seed files (`TrustSeed.java`). |
| **Vidya • Arogya • Samriddhi** | PDF pp. 1, 21 | The organizational motto of AEHT ("Knowledge, Health, Prosperity") defining the cross-sector scope of its welfare interventions. | Displayed in top navigation branding and legal notices ([AdminShell.jsx](file:///c:/Users/abhin/Desktop/Arijit%20Backend/Imact_System/frontend/src/admin/AdminShell.jsx)). |
| **ABHISARAN (अभिसरण)** | PDF §5 (p. 7), §7 (p. 9); Prompt §0 (p. 1) | Sanskrit word meaning "convergence", representing the platform's focus on connecting disparate departmental touchpoints into unified beneficiary journeys. | Root platform namespace, repository name, database schema names. |
| **District Programme Continuity Scan** | PDF Title, §1 (p. 3), §2 (p. 4) | A rapid, short-duration (5–7 working days), no-cost diagnostic pilot to assess service hand-offs across district delivery systems without parallel inspection. | Application title, main dashboard header, API documentation metadata. |
| **Education–Health/RBSK–WCD Triad** | PDF §1 (p. 3), §4.1 (p. 6), §5 (p. 7) | The three converging district departments (Schools, RBSK screening/PHCs, and Anganwadi centres) forming the boundaries of the Phase 1 pilot. | Sector models (`Sector.java`), database migration `V1__baseline_schema.sql`. |
| **Purposive Pilot Sample** | PDF §4.2 (p. 6), §15.1 (p. 17) | A deliberate 10-point sample including rural, urban, tribal, and difficult-to-reach settings, explicitly noted as a non-statistical, non-census scan. | Seed configurations, sample rationale in Impact Passports (`ImpactPassportList.jsx`). |
| **Indicative 4/3/3 Sample Mix** | PDF §4.2 (p. 6); Prompt §2 (p. 1) | The recommended balance of pilot delivery points: 4 Education schools, 3 Health/RBSK touchpoints, and 3 Anganwadi centres. | Delivery point seed data (`DeliveryPoint.java`, `V1__baseline_schema.sql`). |
| **No-Cost In-Kind Contribution** | PDF §1 (p. 3), §12 (p. 14) | ₹5.20 lakh notional value borne entirely by AEHT, creating zero financial liability, procurement claim, or recurring cost for the district. | Documented in MoU templates, legal disclaimer headers. |

---

## 2. Architectural Layout & Subsystems

| Term / Part | Document Citation | Explanation & Operational Purpose ("A Line About This Part") | Codebase Implementation |
| :--- | :--- | :--- | :--- |
| **Monorepo Layout** | Prompt §0, §1 (p. 1); Roadmap Phase 1 | A multi-project repository containing frontend, backend, scoring reference, and AI microservice for unified versioning and deployment. | Root workspace containing `frontend/`, `backend/`, `ai-service/`, `abhisaran-core/`. |
| **FRONT A — Abhisaran Source** | Prompt §1, §9 (pp. 1, 3); PDF §9 (p. 10) | The mobile-first, offline-tolerant web application (`/source/*`) for field surveyors to collect structured, pre-validated observations. | Located at [`frontend/src/source/`](file:///c:/Users/abhin/Desktop/Arijit%20Backend/Imact_System/frontend/src/source), router path `/source/*`. |
| **FRONT B — Admin Decision-Support Panel** | Prompt §1, §10 (pp. 1, 3); PDF §9 (p. 10) | The executive district dashboard (`/admin/*`) rendering heat-maps, Impact Passports, verified gaps, and Priority Action matrices. | Located at [`frontend/src/admin/`](file:///c:/Users/abhin/Desktop/Arijit%20Backend/Imact_System/frontend/src/admin), router path `/admin/*` and `/dc/*`. |
| **Backend Core (Spring Boot)** | Prompt §0 (p. 1); Roadmap Phase 1–2 | Java 21 Spring Boot REST backend providing RBAC enforcement, database transactions, Flyway migrations, and deterministic calculations. | Located at [`backend/`](file:///c:/Users/abhin/Desktop/Arijit%20Backend/Imact_System/backend). |
| **Assistive AI Microservice (AIMS)** | Prompt §0, §3.4 (pp. 1, 2); Roadmap Phase 9 | Python FastAPI service restricted to optical character recognition (OCR), text PII pre-screening, and drafting concept notes in `DRAFT` status. | Located at [`ai-service/`](file:///c:/Users/abhin/Desktop/Arijit%20Backend/Imact_System/ai-service), exposed on port 8000. |
| **`abhisaran-core` Reference Engine** | Prompt §0, §6 (pp. 1, 2) | The canonical JavaScript implementation of the scoring logic with shared golden fixtures ensuring bit-identical outputs in both JS and Java. | Located at [`abhisaran-core/engine.js`](file:///c:/Users/abhin/Desktop/Arijit%20Backend/Imact_System/abhisaran-core/engine.js). |
| **Docker Compose Orchestration** | Prompt §0; Roadmap Phase 1, Phase 10 | Containerization configuration managing local multi-service networking across backend (8080), frontend (5173/3000), AI (8000), and Postgres (5432). | Defined in [docker-compose.yml](file:///c:/Users/abhin/Desktop/Arijit%20Backend/Imact_System/docker-compose.yml). |

---

## 3. Core Safeguards & Non-Negotiable Assurances

| Term / Part | Document Citation | Explanation & Operational Purpose ("A Line About This Part") | Codebase Implementation |
| :--- | :--- | :--- | :--- |
| **Zero-PII Architecture** | PDF §3 (p. 5), §8.1 (p. 10), §17 (p. 19); Prompt §3.1 (p. 1) | Strict architectural ban on collecting, storing, processing, or logging names, Aadhaar, phones, addresses, or photos of beneficiaries and children. | Enforced via tests ([ZeroPiiAndNonPunitiveAuditTests.java](file:///c:/Users/abhin/Desktop/Arijit%20Backend/Imact_System/backend/src/test/java/org/aeht/abhisaran/e2e/ZeroPiiAndNonPunitiveAuditTests.java)), regex scanners, no `Beneficiary` entity. |
| **Continuity Token** | PDF §8.1 (p. 10), §17 (p. 19); Prompt §3.1 (p. 1) | A non-identifying district-issued token tracking longitudinal hand-offs where the identity mapping remains exclusively with the government IT cell. | Model `ContinuityToken.java`, token verification filters. |
| **No Beneficiary / Child Table** | PDF §3 (p. 5), §8.1 (p. 10); Prompt §3.1 (p. 1) | Explicit rule prohibiting any database table, class, or API representing individual children or beneficiaries. | Audited via Java reflection and Flyway schema audit tests. |
| **Non-Punitive Design** | PDF §3 (p. 5), §7.1 (p. 9), §17 (p. 19); Prompt §3.2 (p. 1) | Ban on institutional performance grading, officer appraisals, and vigilance/disciplinary framing, focusing exclusively on systemic pathway health. | Audited via reflection tests blocking sorting/ranking algorithms in controllers. |
| **Prohibition of League Tables** | PDF §3 (p. 5), §7.1 (p. 9), §17 (p. 19); Prompt §3.2 (p. 1) | Hard restriction ensuring institutions are never ranked by score or publicly listed in order of performance. | Enforced in [AdminDashboardController.java](file:///c:/Users/abhin/Desktop/Arijit%20Backend/Imact_System/backend/src/main/java/org/aeht/abhisaran/admin/AdminDashboardController.java). |
| **Evidence-First Principle** | PDF §3 (p. 5), §17 (p. 19); Prompt §3.3 (p. 1) | Mandatory requirement that every reported gap cite observable documentary evidence, with missing data labeled `NOT VERIFIED` rather than scored as zero. | `Evidence.java`, verification FSM, scoring engine gap validator. |
| **No Black-Box AI Scoring** | PDF §1 (p. 3); Prompt §3.4 (p. 2); Roadmap Phase 9 | Strict isolation preventing artificial intelligence from calculating scores, flags, priorities, or overriding human verification states. | Negative security tests in `AiIsolationSecurityTests.java`. |
| **Complete Traceability** | PDF §17 Annexure A (p. 19); Prompt §3.5 (p. 2) | Audit trail linking every score, flag, and brief back to delivery point, question, evidence attachment, verifier ID, and rule version. | Trace drawer subsystem ([TraceDrawer.jsx](file:///c:/Users/abhin/Desktop/Arijit%20Backend/Imact_System/frontend/src/admin/TraceDrawer.jsx)), `AuditLog.java`. |

---

## 4. Methodology: The Five Layers of Assessment

*Source: AEHT DPR §6 ("Methodology: Five Layers of Assessment", p. 8)*

| Assessment Layer | Document Focus (What is Assessed) | Permitted Evidence Examples | Codebase Representation |
| :--- | :--- | :--- | :--- |
| **Layer 1: Beneficiary Experience** | Actual beneficiary touchpoints, pathway completeness, anonymized steps, and referral receipt status. | Anonymized register entries, counter-referral slips, service logs. | `layer: 1` in `QuestionItem.java`, `V3__question_catalogue.sql`. |
| **Layer 2: Institutional Readiness** | Staffing availability, diagnostic equipment calibration, displayed protocols, and institutional duty rosters. | Functional equipment logs, wall-displayed duty charts, order books. | `layer: 2` in `QuestionItem.java`, infrastructure evidence uploads. |
| **Layer 3: Departmental Alignment** | Cross-departmental linkages, shared referral formats, designated nodal contacts, and feedback loops. | Joint meeting minutes, counter-signed referral receipts, inter-agency notes. | `layer: 3` in `QuestionItem.java`, hand-off tracking logic. |
| **Layer 4: Outcome-Readiness** | Early operational signals that the service hand-off produces intended care, strictly excluding causal claims. | Completed clinical checkups, nutritional rehabilitation discharge slips. | `layer: 4` in `QuestionItem.java`, closure indicators. |
| **Layer 5: Sustainability** | Departmental capacity to maintain pathway continuity through routine reviews and feasible local actions. | Monthly review minutes, VHSND coordination logs, local remedial orders. | `layer: 5` in `QuestionItem.java`, bottleneck analysis. |

---

## 5. The Five Convergence Questions

*Source: AEHT DPR §5.1 ("Convergence Questions", p. 7)*

| Convergence Question ID | Core Inquiry | Standard Verification Test | Codebase Mapping |
| :--- | :--- | :--- | :--- |
| **Q1: Documentation** | *Is the required service or referral step documented?* | Verification that outgoing referrals are formally recorded in registers rather than handled informally. | `convergence_question = 'Q1'` in `question_catalogue`. |
| **Q2: Acknowledgement** | *Does the receiving institution acknowledge or complete the referral?* | Verification that receiving PHCs or centres counter-sign and log arrival of referred beneficiaries. | `convergence_question = 'Q2'` in `question_catalogue`. |
| **Q3: Timeliness** | *Is the hand-off completed within a reasonable programme-defined time?* | Checking if hand-offs transpire within prescribed operational norms (e.g., 14 days for school-to-PHC). | `convergence_question = 'Q3'` in `question_catalogue`. |
| **Q4: Outcome / Closure** | *Is the outcome or next step recorded in an anonymized, auditable manner?* | Ensuring case resolution, continuing care, or clinical follow-up is archived in institutional files. | `convergence_question = 'Q4'` in `question_catalogue`. |
| **Q5: System Bottleneck** | *Can the district identify which system-level bottleneck causes continuity to break?* | Pinpointing systemic constraints (staffing, coordination, transit, supplies) causing drops. | `convergence_question = 'Q5'` in `question_catalogue`. |

---

## 6. Evidence Standards & Field Collection Lifecycle

| Term / Part | Document Citation | Explanation & Operational Purpose ("A Line About This Part") | Codebase Implementation |
| :--- | :--- | :--- | :--- |
| **Evidence Record** | PDF §6 (p. 8), §17 Annexure B (p. 19); Prompt §5 (p. 2) | The immutable unit of field observation documenting a question answer, source type, attachment, and verification state. | Entity [Evidence.java](file:///c:/Users/abhin/Desktop/Arijit%20Backend/Imact_System/backend/src/main/java/org/aeht/abhisaran/model/Evidence.java), table `evidence`. |
| **Permitted Evidence Types** | PDF §6 (p. 8), §17 Annexure B (p. 19); Prompt §5 (p. 2) | The strictly controlled sources: `PERMITTED_OBSERVATION`, `INSTITUTIONAL_RECORD`, `PROCESS_DOCUMENT`, `ANONYMISED_REFERRAL_RECORD`, `STRUCTURED_DISCUSSION`. | Enum column `source_type` validated in backend service. |
| **Permitted Document Kinds** | PDF §17 Annexure B (p. 19); Prompt §5 (p. 2) | Allowed photographic evidence categories: `PROCESS_DOCUMENT`, `WALL_DISPLAY`, `INFRASTRUCTURE`, `REGISTER_EXTRACT`. | Upload validator in `ZeroPiiUploadModal.jsx`. |
| **Prohibited Capture** | PDF §8.1 (p. 10), §17 Annexure B (p. 19) | Mandatory camera/upload ban on photos of children, beneficiaries, facial images, Aadhaar, phones, or home addresses. | Client pre-check + AI OCR pre-scanner (`ai-service/main.py`). |
| **Verification State Machine** | Prompt §5 (p. 2); Roadmap Phase 3 | 5-state finite state machine: `PENDING_REVIEW` → `VERIFIED`, `NOT_VERIFIED`, `REJECTED`, or `CORRECTED`. | FSM enforced in `EvidenceService.java`. |
| **Verified Evidence Threshold** | PDF §17 Annexure B (p. 19); Prompt §5 (p. 2) | Rule dictating that only `VERIFIED` and `CORRECTED` evidence can trigger flags or support priority actions. | Evaluated in `FlagEngineService.java` and `PriorityService.java`. |
| **Scheduling Guard** | PDF §14 (p. 16); Prompt §9 (p. 3) | Scheduling engine blocking visits during school exam days, immunisation days, or Anganwadi visits without female team members. | Service [SchedulingGuard.java](file:///c:/Users/abhin/Desktop/Arijit%20Backend/Imact_System/backend/src/main/java/org/aeht/abhisaran/evidence/SchedulingGuard.java) and UI component. |
| **Offline Draft Queue** | Prompt §9 (p. 3); Roadmap Phase 3 | Local encrypted in-browser queue allowing surveyors to capture observations offline with automatic synchronization upon reconnecting. | Implemented in `OfflineQueueService.js`. |
| **"Why am I collecting this?"** | Prompt §4, §9 (pp. 2, 3); PDF §6 (p. 8) | Plain-language pedagogical rationale displayed directly below every assessment question in the mobile tool to orient field staff. | Column `explanation_why` in `QuestionItem.java`, displayed in UI. |

---

## 7. Deterministic Scoring: Abhisaran Continuity Score (ACS)

*Source: AEHT DPR §7 ("Abhisaran Continuity Score (ACS)", p. 9)*

| Term / Part | Document Citation | Explanation & Operational Purpose ("A Line About This Part") | Codebase Implementation |
| :--- | :--- | :--- | :--- |
| **Abhisaran Continuity Score (ACS)** | PDF §7 (p. 9), §17 (p. 19); Prompt §6 (p. 2) | A composite 0–100 index summarizing cross-service linkage strength across 4 equally weighted components, used for decision support, not grading. | Calculated by [DeterministicScoringEngine.java](file:///c:/Users/abhin/Desktop/Arijit%20Backend/Imact_System/backend/src/main/java/org/aeht/abhisaran/scoring/DeterministicScoringEngine.java). |
| **Component 1: Documented Referral** | PDF §7 (p. 9) | Evaluates whether formal documentation exists for required referrals or inter-departmental hand-offs (Weight: 25%). | Component `c1_screening_referral` in scoring engine. |
| **Component 2: Follow-up Completion** | PDF §7 (p. 9) | Evaluates evidence that the receiving delivery point acknowledged or completed the referral action (Weight: 25%). | Component `c2_institutional_readiness` in scoring engine. |
| **Component 3: Timeliness** | PDF §7 (p. 9) | Evaluates whether actions transpire within established programme benchmarks (e.g. 14 days) (Weight: 25%). | Component `c3_departmental_alignment` in scoring engine. |
| **Component 4: Outcome / Closure** | PDF §7 (p. 9) | Evaluates whether final closure, remedial support, or unresolved case status is recorded in an auditable manner (Weight: 25%). | Component `c4_outcome_continuity` in scoring engine. |
| **0–5 Evidence Scale** | PDF §7.1 (p. 9) | The standardized scoring scale: 0 (Absent), 1 (Anecdotal), 2 (Partial/weak), 3 (Usually present), 4 (Repeatable/minor gaps), 5 (Complete & timely). | Enforced in scoring validation logic (0.0 to 5.0). |
| **Denominator Rebasing** | PDF §7.1 (p. 9); Prompt §6 (p. 2) | Formula rebasing total possible score over applicable touchpoints when a component is legitimately not applicable: `(Σ achieved / (applicable × 5)) × 100`. | Implemented with `BigDecimal` half-up rounding in scoring engine. |
| **Applicable Ratio (e.g. 3/4)** | PDF §7.1 (p. 9); Prompt §6 (p. 2) | Mandatory ratio indicator displayed alongside ACS everywhere it appears to signify how many of the 4 components apply to that delivery point. | Field `applicableCount` and formula string in `ScoringResult.java`. |
| **GREEN Band (70.0–100.0%)** | PDF §7.1 (p. 9); Prompt §6 (p. 2) | Performance band indicating *Strong Continuity* with repeatable, documented institutional linkage. | Method `assignBand()` in `DeterministicScoringEngine.java`. |
| **AMBER Band (40.0–69.99%)** | PDF §7.1 (p. 9); Prompt §6 (p. 2) | Performance band indicating *Developing Continuity* with partial documentation or unclosed hand-offs. | Method `assignBand()` in `DeterministicScoringEngine.java`. |
| **RED Band (0.0–39.99%)** | PDF §7.1 (p. 9); Prompt §6 (p. 2) | Performance band indicating *Needs Attention* where referral documentation is absent or ad hoc. | Method `assignBand()` in `DeterministicScoringEngine.java`. |
| **Explain Score Modal** | Prompt §6, §10 (pp. 2, 3) | Interactive admin modal showing the step-by-step arithmetic equation, component breakdown, and evidence references behind an ACS score. | Implemented in [ExplainScoreModal.jsx](file:///c:/Users/abhin/Desktop/Arijit%20Backend/Imact_System/frontend/src/admin/ExplainScoreModal.jsx). |
| **Golden Fixture Parity** | Prompt §0, §6 (pp. 1, 2) | Automated suite of 8 shared JSON test vectors verifying bit-identical formula strings and numbers between JavaScript and Java engines. | Validated in [engine.test.js](file:///c:/Users/abhin/Desktop/Arijit%20Backend/Imact_System/abhisaran-core/test/engine.test.js) & `ScoringGoldenFixtureTests.java`. |

---

## 8. Deterministic Rule Engine, Flags & Action Catalogue

*Source: AEHT DPR §7 (p. 9), §10 (p. 12); Prompt §7 (p. 2)*

| Term / Part | Document Citation | Explanation & Operational Purpose ("A Line About This Part") | Codebase Implementation |
| :--- | :--- | :--- | :--- |
| **`RuleDefinition`** | Prompt §7 (p. 2); Roadmap Phase 5 | Declarative rule specification containing condition logic, flag code, severity, and mapping to predefined actions without runtime hardcoding. | Entity `RuleDefinition.java`, seeded via Flyway `V4__rules_and_flags.sql`. |
| **`FlagEvaluation`** | Prompt §7 (p. 2); Roadmap Phase 5 | Concrete occurrence of a diagnosed continuity gap tied to an evidence record, delivery point, rule ID, and version number. | Entity [FlagEvaluation.java](file:///c:/Users/abhin/Desktop/Arijit%20Backend/Imact_System/backend/src/main/java/org/aeht/abhisaran/model/FlagEvaluation.java), table `flag_evaluations`. |
| **`DOCUMENTED_REFERRAL_GAP`** | Prompt §7 (p. 2); PDF §7 (p. 9) | Flag triggered when outgoing referral documentation is missing or partial (Rule: `RULE-REFERRAL-001`). | Seeded rule row in database. |
| **`FOLLOWUP_GAP`** | Prompt §7 (p. 2); PDF §7 (p. 9) | Flag triggered when counter-referral acknowledgement is not received from the receiving facility (Rule: `RULE-FOLLOWUP-002`). | Seeded rule row in database. |
| **`TIMELINESS_GAP`** | Prompt §7 (p. 2); PDF §7 (p. 9) | Flag triggered when the service hand-off exceeds the established timeline benchmark (Rule: `RULE-TIME-003`). | Seeded rule row in database. |
| **`CLOSURE_DOCUMENTATION_GAP`** | Prompt §7 (p. 2); PDF §7 (p. 9) | Flag triggered when remedial care or medical treatment resolution is untracked (Rule: `RULE-CLOSURE-004`). | Seeded rule row in database. |
| **`ActionDefinition` Catalogue** | Prompt §7 (p. 2); PDF §10 (p. 12) | Predefined register of corrective actions containing responsible department, escalation conditions, and indicative timelines. | Entity [ActionDefinition.java](file:///c:/Users/abhin/Desktop/Arijit%20Backend/Imact_System/backend/src/main/java/org/aeht/abhisaran/model/ActionDefinition.java). |
| **Responsible System** | PDF §10 (p. 12); Prompt §7 (p. 2) | The competent governmental administrative cell or department designated to own and execute a corrective action. | Field `responsibleSystem` in `ActionDefinition` and `PriorityActionItem`. |
| **Trace Drawer** | Prompt §7, §10 (pp. 2, 3) | A slide-out panel allowing district officials to inspect the raw question response, timestamp, verifier, and rule that created any flag or score. | Component [TraceDrawer.jsx](file:///c:/Users/abhin/Desktop/Arijit%20Backend/Imact_System/frontend/src/admin/TraceDrawer.jsx). |

---

## 9. Priority Action Framework (PAF)

*Source: AEHT DPR §10 ("Priority Action Framework & Scale Conversion", p. 12)*

| Term / Part | Document Citation | Explanation & Operational Purpose ("A Line About This Part") | Codebase Implementation |
| :--- | :--- | :--- | :--- |
| **Priority Action Framework** | PDF §10 (p. 12), §17 (p. 19); Prompt §8 (p. 2) | Standardized methodology converting verified continuity gaps into prioritized action entries for district administration. | Handled in `PriorityService.java` and UI view `PriorityActionsView.jsx`. |
| **Urgency (Scale 1–5)** | PDF §10.1 (p. 12); Prompt §8 (p. 2) | Integer assessment (1 low to 5 high) of the severity and time-sensitivity of a verified continuity gap entered by a human decision-owner. | Field `urgency` in `PriorityActionItem.java`. |
| **Reach (Scale 1–5)** | PDF §10.1 (p. 12); Prompt §8 (p. 2) | Integer assessment (1 low to 5 high) of the beneficiary headcount or service touchpoint breadth impacted by the gap. | Field `reach` in `PriorityActionItem.java`. |
| **Priority Score = Urgency × Reach** | PDF §10.1 (p. 12); Prompt §8 (p. 2) | The deterministic priority index ranging from 1 to 25 determining executive action hierarchy without arbitrary weights. | Computed column `priority_score` in database and backend model. |
| **Priority Bands** | PDF §10.1 (p. 12); Prompt §8 (p. 2) | Tiered priority classifications: **VERY HIGH (20–25)**, **HIGH (12–19)**, **MEDIUM (6–11)**, and **LOW (1–5)**. | Method `calculatePriorityBand()` in `PriorityService.java`. |
| **Feasibility (Independent Flag)** | PDF §10.1 (p. 12); Prompt §8 (p. 2) | Scale 1–5 practicality indicator displayed strictly as an independent flag that **never multiplies or dilutes the Priority Score**. | Field `feasibility` in `PriorityActionItem.java`, validated in tests. |
| **Verified Gap Prerequisite** | Prompt §8 (p. 2); PDF §10 (p. 12) | Rule rejecting priority item creation on unverified gaps to prevent uncorroborated issues from entering the action register. | Validation check in `PriorityService.createPriorityAction()`. |
| **Concept-Note Action Brief** | PDF §10 (p. 12); Prompt §8 (p. 2) | Short decision document stating problem description, beneficiary impact, resource requirement, timeline, and required approval. | Model `ActionBrief.java` and export templates. |

---

## 10. Executive Decision-Support Panel Deliverables

*Source: AEHT DPR §9 (p. 10), §10 (p. 12), §17 Annexure A (p. 19)*

| Term / Part | Document Citation | Explanation & Operational Purpose ("A Line About This Part") | Codebase Implementation |
| :--- | :--- | :--- | :--- |
| **District Overview** | PDF §9 (p. 10), §17 Annexure C (p. 19); Prompt §10 (p. 3) | High-level executive dashboard summarizing pilot sample touchpoints, aggregate ACS, zero-PII audit assurance, and high-priority action counts. | View [DistrictOverview.jsx](file:///c:/Users/abhin/Desktop/Arijit%20Backend/Imact_System/frontend/src/admin/DistrictOverview.jsx). |
| **Convergence Heat-map** | PDF §9 (p. 10), §17 Annexure C (p. 19); Prompt §10 (p. 3) | Matrix grid mapping cross-departmental touchpoints (School ↔ Health ↔ Anganwadi) to illustrate where inter-service hand-offs are strong or broken. | View [ConvergenceHeatmap.jsx](file:///c:/Users/abhin/Desktop/Arijit%20Backend/Imact_System/frontend/src/admin/ConvergenceHeatmap.jsx). |
| **Impact Passport (Annexure A)** | PDF §9 (p. 10), §17 Annexure A & C (p. 19); Prompt §10 (p. 3) | Single-page diagnostic profile for each assessed delivery point recording verified strengths, verified gaps, ACS, priority actions, and ownership. | Views [ImpactPassportList.jsx](file:///c:/Users/abhin/Desktop/Arijit%20Backend/Imact_System/frontend/src/admin/ImpactPassportList.jsx) & `ImpactPassportCard.jsx`. |
| **Run Analysis Action** | Prompt §10 (p. 3) | On-demand computation trigger simulating fresh evaluation of field data against the latest versioned rule catalogue. | Action button and handler in `AdminShell.jsx`. |
| **Field Data Quality Block** | Prompt §10 (p. 3) | Health widget displaying captured fields, missing data points, and records pending factual verification with the notice *"Not captured is not a low score"*. | Rendered in dashboard overview widgets. |
| **Day-0 to Day-7 Delivery Protocol** | PDF §9.1 (p. 11), §14 (p. 16) | Standard 7-day field progression: Day 1 Kick-off, Day 2 Mapping, Days 3–5 Field Visits, Day 6 Exit Briefings & Corrections, Day 7 District Handover. | Seeded in pilot timeline tracking components. |
| **Day 7 Handover Package** | PDF §9.1 (p. 11), §14 (p. 16), §15 (p. 17) | The final administrative deliverable comprising completed Impact Passports, Convergence Dashboard, Priority Action Register, and Exit Briefings. | Handover export routines and summary views. |

---

## 11. Governance, Reviewers & Exit Protocols

*Source: AEHT DPR §8.3 (p. 10), §11 (p. 13), §14.1 (p. 16), §17 Annexure D (p. 20)*

| Term / Part | Document Citation | Explanation & Operational Purpose ("A Line About This Part") | Codebase Implementation |
| :--- | :--- | :--- | :--- |
| **Delivery Point Exit Briefing** | PDF §9 (p. 10), §14.1 (p. 16); Prompt §11 (p. 3) | A 15-minute transparent on-site debriefing with the head of the school, PHC, or Anganwadi sharing factual observations before leaving. | Entity [ExitBriefing.java](file:///c:/Users/abhin/Desktop/Arijit%20Backend/Imact_System/backend/src/main/java/org/aeht/abhisaran/model/ExitBriefing.java), view `ExitBriefingsView.jsx`. |
| **Non-Adverse Refusal Invariant** | PDF §14.1 (p. 16); Prompt §11 (p. 3) | Crucial rule that an unsigned briefing or official refusal to sign is **never adverse evidence** and cannot reduce scores or count as a dispute. | Enforced in `ExitBriefingService.java` (`nonAdverseDeclaration = true`). |
| **Factual Correction Window** | PDF §14.1 (p. 16); Prompt §11 (p. 3) | Dedicated administrative window allowing delivery point heads or Nodal Officers to submit evidence-backed corrections to factual errors. | Entity [FactualCorrection.java](file:///c:/Users/abhin/Desktop/Arijit%20Backend/Imact_System/backend/src/main/java/org/aeht/abhisaran/model/FactualCorrection.java), view `FactualCorrectionsView.jsx`. |
| **Correction Immutability** | Prompt §11 (p. 3); Roadmap Phase 7 | Invariant ensuring factual corrections retain original captured values permanently in audit history alongside the validated change. | Fields `originalValue` and `correctedValue` in `FactualCorrection.java`. |
| **Independent Quality Reviewer** | PDF §8.3 (p. 10), §11 (p. 13), §17 (p. 19) | An external desk-based academic or public policy expert validating methodology, analytical outputs, and recording limitations. | Entity [ReviewerDeclaration.java](file:///c:/Users/abhin/Desktop/Arijit%20Backend/Imact_System/backend/src/main/java/org/aeht/abhisaran/model/ReviewerDeclaration.java), view `ReviewerPackView.jsx`. |
| **Conflict-of-Interest (COI) 3-Year Rule** | PDF §8.3 (p. 10); Prompt §11 (p. 3) | Mandatory eligibility check requiring the reviewer to have held no employment, board role, consultancy, or donation with AEHT for the past 3 years. | Verified via validation check in `ReviewerService.submitDeclaration()`. |
| **Methodology Limitation Notes** | PDF §8.3 (p. 10), §15.1 (p. 17) | Compulsory requirement that independent reviewer validation explicitly document methodological caveats rather than issue a blanket endorsement. | Column `methodology_limitation_notes` in `ReviewerDeclaration.java`. |

---

## 12. Privacy Incident Management & Retention Controls

*Source: AEHT DPR §8.1, §8.2 (p. 10), §13 (p. 15), §17 Annexure D (p. 20)*

| Term / Part | Document Citation | Explanation & Operational Purpose ("A Line About This Part") | Codebase Implementation |
| :--- | :--- | :--- | :--- |
| **`PrivacyIncident`** | PDF §8.1 (p. 10), §13 (p. 15); Prompt §5, §11 (pp. 2, 3) | A non-identifying containment record generated instantly when any suspected PII is detected, pausing affected processing immediately. | Entity [PrivacyIncident.java](file:///c:/Users/abhin/Desktop/Arijit%20Backend/Imact_System/backend/src/main/java/org/aeht/abhisaran/model/PrivacyIncident.java), table `privacy_incidents`. |
| **2-Hour Notification Clock** | PDF §8.1 (p. 10), §17 Annexure D (p. 20); Prompt §11 (p. 3) | Strict statutory requirement that the District Nodal Officer be notified within exactly 120 minutes of discovering any accidental PII exposure. | Method `isOverdue()` and timer countdown in `PrivacyIncident.java`. |
| **5-State Incident FSM** | PDF §8.1 (p. 10); Roadmap Phase 8 | The escalation finite state machine: `DETECTED` → `CONTAINED` → `NODAL_NOTIFIED` → `DISTRICT_DIRECTED` → `CLOSED`. | Enforced via transition guards in `PrivacyIncidentService.java`. |
| **30-Day Retention Countdown** | PDF §8.2 (p. 10), §17 Annexure D (p. 20); Prompt §11 (p. 3) | Automated schedule enforcing that all pilot working records be securely purged exactly 30 calendar days after the Day 7 district handover. | Entity [RetentionSchedule.java](file:///c:/Users/abhin/Desktop/Arijit%20Backend/Imact_System/backend/src/main/java/org/aeht/abhisaran/model/RetentionSchedule.java), `RetentionService.java`. |
| **Deletion Certificate** | PDF §8.2 (p. 10), §17 Annexure D (p. 20); Prompt §11 (p. 3) | Formal cryptographic receipt generated post-purge containing timestamp, record count, and SHA-256 verification hash for the Nodal Officer. | Entity [DeletionCertificate.java](file:///c:/Users/abhin/Desktop/Arijit%20Backend/Imact_System/backend/src/main/java/org/aeht/abhisaran/model/DeletionCertificate.java). |
| **SHA-256 Verification Hash** | PDF §8.2 (p. 10); Roadmap Phase 8 | 64-character cryptographic hash guaranteeing the irreversibility and authenticity of data deletion on the retention certificate. | Computed via `DigestUtils.sha256Hex()` in `RetentionService.java`. |
| **Append-Only Audit Log** | PDF §8.2 (p. 10); Prompt §11 (p. 3); Roadmap Phase 8 | Tamper-evident ledger recording all state changes, role actions, deletions, and overrides with user ID, timestamp, and justification. | Entity [AuditLog.java](file:///c:/Users/abhin/Desktop/Arijit%20Backend/Imact_System/backend/src/main/java/org/aeht/abhisaran/model/AuditLog.java), table `audit_logs`. |

---

## 13. Role-Based Access Control (RBAC) & District Actors

*Source: AEHT DPR §11 ("Governance, Roles & Accountability", p. 13)*

| Role Code | Official Designation | Core Responsibilities & Decision Rights | Enforced Boundary |
| :--- | :--- | :--- | :--- |
| **`DISTRICT_MAGISTRATE`** | District Magistrate / Deputy Commissioner (DM/DC) | Executive oversight, pilot approval, nomination of Nodal Officer, and authorizing administrative use of findings. | Unrestricted read/view access across all district deliverables. |
| **`DISTRICT_NODAL_OFFICER`** | District Nodal Officer (DNO) | Day-to-day administrative coordination, sample confirmation, field access facilitation, and validating factual corrections. | Authorizes factual corrections and receives privacy breach notifications. |
| **`ARYABHATA_FIELD_TEAM`** | Aryabhata Field Assessment Team | Collaborative process mapping, evidence gathering, anonymized data entry, and drafting initial briefs. | **Strictly NO sanctioning or disciplinary authority**; write access limited to field draft records. |
| **`INDEPENDENT_REVIEWER`** | Independent Quality & Evidence Reviewer | Desk-based methodology audit, analytical challenge, checking COI, and recording limitation notes. | **Strictly NO implementation authority**; read access to anonymized exports. |
| **`INSTITUTION_HEAD`** | Delivery Point Head (Principal / MOIC / AWW) | Reviewing on-site observations during the exit briefing, signing acknowledgement, and submitting factual corrections. | Access restricted exclusively to their specific delivery point records. |

---

## 14. Statutory Boundaries & Limitations Disclaimers

| Term / Part | Document Citation | Explanation & Operational Purpose ("A Line About This Part") | Codebase Implementation |
| :--- | :--- | :--- | :--- |
| **Statutory Planning Disclaimer** | PDF §10 (p. 12); Prompt §8 (p. 2) | Mandatory legal banner stating action briefs are planning inputs only and do not authorize expenditure, sanctions, procurement, or funds. | Constant `STATUTORY_PLANNING_NOTICE` in Java/JS and rendered in UI footers. |
| **Small Purposive Sample Limitation** | PDF §15.1 (p. 17) | Explicit disclaimer that the 10-point pilot is not a district-wide census and cannot be extrapolated for statistical generalizations. | Rendered in dashboard footer limitation notes ([AdminShell.jsx](file:///c:/Users/abhin/Desktop/Arijit%20Backend/Imact_System/frontend/src/admin/AdminShell.jsx)). |
| **Non-Causal Indicator Notice** | PDF §15.1 (p. 17), §17 Annexure C (p. 19) | Mandatory legal reminder that ACS is an operational continuity diagnostic, never a measure of causal programme impact. | Displayed on Explain Score modals and PDF export headers. |
| **Separate Funding Boundary** | PDF §10 (p. 12), §12 (p. 14), §17 Annexure D (p. 20) | Invariant confirming that pilot completion creates no right or expectation of future DMF, PMKKKY, CSR, or departmental funding for AEHT. | Documented in MoU templates and project state decisions. |

---
*Generated: 2026-10-07 | Grounded against AEHT District Programme Continuity Scan DPR (September 2026)*
