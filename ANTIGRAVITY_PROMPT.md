# PROMPT FOR ANTIGRAVITY — ABHISARAN: District Programme Continuity Scan

> Attach these files to the workspace before running: `AEHT_District_Programme_Impact.pdf` (SOURCE OF TRUTH), `abhisaran-core/engine.js`, `abhisaran-core/engine.test.js`, `abhisaran-core/SPEC.md`, `abhisaran-source.zip` (old prototype, reference only).

---

## 0. ROLE AND WORKING RULES

You are a senior full-stack engineer building **ABHISARAN – District Programme Continuity Scan**, a government decision-support product for the Aryabhata Educational & Health Trust (AEHT).

1. The **AEHT PDF is the only source of truth.** Read all 20 pages before writing code. If AEHT is silent on a detail, do NOT invent a rule silently. Label it `IMPLEMENTATION DECISION — NOT SPECIFIED BY AEHT`, choose the smallest option, and add it to `docs/DECISIONS.md`.
2. `abhisaran-core/engine.js` is the **canonical reference implementation** of scoring. Port it to Java **exactly** (same outputs). Keep a golden-fixture test file (JSON) shared by both so JS and Java results are provably identical.
3. Work **phase by phase** (Section 12). After each phase: compile, run tests, run migrations, boot Docker, and print a report of exactly what exists and what does not. **Stop at each phase gate and wait for my "continue".** Do not build ahead.
4. Never fabricate data in the product. Demo data must be clearly labelled `DEMO — ILLUSTRATIVE` and live only in a seed profile that is off by default.
5. Do not add features outside Phase 1 scope (Section 2).

## 1. PRODUCT IN ONE PARAGRAPH

Two distinct fronts sharing one backend:
- **FRONT A — ABHISARAN SOURCE** (`/source/*`): mobile-first field collection of permitted, structured evidence. Minimal typing.
- **FRONT B — ADMIN DECISION-SUPPORT PANEL** (`/admin/*`): consumes verified, anonymised evidence and produces pathway analysis, verified gaps, deterministic flags, ACS, convergence heat-map, Impact Passports, Priority Action Framework, corrective-action suggestions, review/correction status.

Pipeline (the only allowed direction):
**FIELD EVIDENCE → VERIFICATION → DETERMINISTIC RULE ENGINE → ACS / FLAGS / PRIORITY → EXPLAINABLE ACTIONS → HUMAN / DISTRICT DECISION.**
Never: AI → score → recommendation.

## 2. SCOPE (AEHT §4) — PHASE 1 ONLY

Education (schools), Health/RBSK (screening/referral touchpoints), Women & Child Development (Anganwadi). Up to 10 delivery points, indicative 4/3/3, District may rebalance; sample must include ≥1 difficult-to-reach and/or low-performing setting; record the transparent selection criteria (geographic diversity, institution type, service intensity, convergence points, feasibility). **Do not** add water/sanitation, rural development, tribal/social justice, agriculture, or skills as features.
District name is **configuration**, never hard-coded (pilot district to be confirmed by me; the old prototype said East Khasi Hills, AEHT is Jharkhand-based).

## 3. ABSOLUTE PRINCIPLES (violating any is a failed build)

1. **ZERO-PII.** Never collect, receive, store, process, log or send to the AI service: names, Aadhaar, phone, address, facial images, or any direct identifier of children, beneficiaries or individual staff. Continuity tracking only via a non-identifying **continuity token**; the token→identity mapping belongs to the District and **no table, API, or field for it may exist** in this system. **No `Beneficiary` table.** Delivery points use a non-identifying code (e.g. `EDU-01`), not school names in analytic views.
2. **NON-PUNITIVE.** No school ranking, league table, officer/staff appraisal, vigilance/inspection language, or beneficiary scoring. No API sorts or ranks institutions by ACS. Heat-map is aggregate/pathway-level. UI copy uses system/pathway language, never personal-fault language.
3. **EVIDENCE FIRST.** Every reported gap has ≥1 observable/documentary/anonymised evidence source or is labelled **NOT VERIFIED**. Missing evidence is never silently converted into a failure ("Not captured is not a low score").
4. **NO BLACK-BOX AI SCORING.** AI never produces ACS, component scores, urgency, reach, feasibility, priority, severity, verification status, or new flags/actions.
5. **COMPLETE TRACEABILITY.** Every score, flag, recommendation and dashboard number links to: assessment → pathway → evidence → evidence source → verifier → rule ID + version → timestamp. Every one has an **Explain** screen.

## 4. FIVE LAYERS & FIVE CONVERGENCE QUESTIONS (AEHT §5–6)

Layers: (1) Beneficiary Experience — touchpoints, pathway completeness, anonymised steps, referral status; (2) Institutional Readiness — staffing, equipment, protocols, duty records, protocol display, functional checks; (3) Departmental Alignment — referral formats, nodal contacts, acknowledgement, feedback loop; (4) Outcome-Readiness — completed referrals, closure, follow-up (**never call it causal impact**); (5) Sustainability — ownership, routine review, feasible corrective action.

Convergence questions: Q1 required step documented? Q2 receiving institution acknowledges/completes? Q3 hand-off within programme-defined time? Q4 outcome/next step recorded anonymised & auditable? Q5 can district identify the system-level bottleneck?

**Every Source question must carry metadata:** `layer`, `convergenceQuestion`, `evidenceRequirement`, `resultingRuleId`, and a one-line "Why am I collecting this?" shown to the field worker. Store the question catalogue in the DB (versioned), seeded from a JSON file.

## 5. EVIDENCE MODEL

`Evidence`: evidenceId, assessmentId, deliveryPointId, pathwayId, layer, category, description, sourceType (`PERMITTED_OBSERVATION | INSTITUTIONAL_RECORD | PROCESS_DOCUMENT | ANONYMISED_REFERRAL_RECORD | STRUCTURED_DISCUSSION`), observedAt, verificationStatus (`VERIFIED | NOT_VERIFIED | PENDING_REVIEW | REJECTED | CORRECTED`), verifierId, attachmentRef, notes, ruleEvaluationRef.
Only `VERIFIED` and `CORRECTED` count as supporting evidence (this is implemented in `gapStatus` in engine.js — port it).
Verification state transitions are a state machine enforced in the backend; every transition is audited with reason.

**Upload/camera validation layer (AEHT Annexure B):** allowed kinds only `PROCESS_DOCUMENT | WALL_DISPLAY | INFRASTRUCTURE | REGISTER_EXTRACT`. Prohibited: faces, children, beneficiaries, names, Aadhaar, phone, address. On suspected PII: block normal submission, mark `PRIVACY_RISK`, exclude from all analytics, auto-create a `PrivacyIncident`, start the breach workflow. Implement `piiCheck` from engine.js server-side (text/OCR) and a client-side pre-check; the Source UI must show a mandatory "No faces / names / Aadhaar / phone / address visible" confirmation before upload. State clearly in docs that this is a safeguard, not a replacement for human governance.

## 6. ACS — IMPLEMENT EXACTLY (AEHT §7)

Four equally weighted components, 25 each: **Documented referral/hand-off · Follow-up completion · Timeliness · Outcome/closure documentation.**
Scale (only this scale): 0 no evidence/pathway absent · 1 ad hoc/anecdotal · 2 partial process, weak documentation · 3 usually present, some gaps · 4 strong & repeatable, minor gaps · 5 complete, timely, documented.
`ACS = Σ(raw/5 × 25) over applicable components, rebased to 100` i.e. `Σ contribution × 100 / (25 × applicableCount)`. N/A components are excluded from the denominator and the **applicable-component count (e.g. 3/4) must be displayed everywhere ACS appears.** Bands: **70–100 GREEN Strong continuity · 40–69 AMBER Developing continuity · 0–39 RED Needs attention.** Bands are never used to rank.
If any applicable component lacks verified evidence → ACS status `NOT_CALCULABLE` with reason (not zero).
Persist per component: raw score, weight, weighted contribution, applicability, rule ID + version, explanation, evidence IDs. Persist unrounded ACS and the rounded integer (round half-up).
**Scoring rule table (`RULE-SCORE-001`) is an IMPLEMENTATION DECISION** (completeness <50%→2, 50–89%→3, 90–99%→4, 100% & timely→5; absent→0; anecdotal→1) reproducing AEHT's example "register exists, ~30% incomplete = 3/5". Store it as a **versioned, configurable rule row**, editable only by authorised roles and every edit is audited and creates a new version. Old assessments keep the version they were computed with.
**Explain Score** (mandatory, Admin): shows each component `n/5`, linked evidence, applicable components `x/y`, the explicit weighted calculation string, and final ACS. Never show a score without its evidence trail.

## 7. RULE ENGINE, FLAGS, ACTIONS

Dedicated `rules` module; no business rules in controllers.
`RuleDefinition`: ruleId, version, name, layer, convergenceQuestion, evidenceRequirements, condition (declarative data), flagCode, severity, explanationTemplate, recommendedActionId, escalationMapping, effectiveFrom, status.
Seed rules from engine.js: `RULE-REFERRAL-001 → DOCUMENTED_REFERRAL_GAP`, `RULE-FOLLOWUP-002 → FOLLOWUP_GAP`, `RULE-TIME-003 → TIMELINESS_GAP`, `RULE-CLOSURE-004 → CLOSURE_DOCUMENTATION_GAP`. A flag status is `VERIFIED` only if supported by verified evidence, otherwise `NOT_VERIFIED`.
`ActionDefinition` catalogue (predefined): actionId, text, responsibleSystem, escalationCondition, indicativeTimeline, requiredNextApproval. Suggestions come only from **verified gap → flag → catalogue → responsible system → escalation**. Runtime code and AI can never create a flag type or action.
**Why-did-the-system-say-this screen** for every flag: WHY, EVIDENCE (IDs, clickable), RULE (ID + version), RECOMMENDED ACTION, RESPONSIBLE SYSTEM, ESCALATION.

## 8. PRIORITY ACTION FRAMEWORK (AEHT §10)

For each **VERIFIED** gap, a human decision-owner enters Urgency 1–5, Reach 1–5, Feasibility 1–5 (integers; backend validates; each entry audited with reason). `PriorityScore = Urgency × Reach`. Bands: **20–25 VERY HIGH · 12–19 HIGH · 6–11 MEDIUM · 1–5 LOW.** **Feasibility is displayed as a separate decision flag and NEVER multiplied into the score**, and low feasibility never downgrades band. Priority cannot be created on an unverified gap (backend rejects).
Register columns: issue, evidence, pathway, sector, urgency, reach, feasibility, score, band, responsible department/system, immediate action, escalation/resource need, indicative timeline, required next approval, status, decision owner, audit history. Default state of urgency/reach/feasibility is **"Not set"** (as in the old admin panel) — never auto-filled.
Show on every brief and register this exact banner: **"Action briefs are planning inputs only. They do not authorise expenditure, constitute sanctions, authorise procurement, guarantee funding, or establish funding eligibility (DMF/PMKKKY/CSR or otherwise). District officials retain final prioritisation authority."**

## 9. FRONT A — SOURCE (React, mobile-first, offline-tolerant)

Flow: Login → assigned delivery point → sector → pathway → five layers → evidence checklist → observations → referral/hand-off details → attachments → verification state → review & submit.
- Minimise typing: yes/no/N/A, controlled vocabularies, dates, status selectors, evidence references. The 0–5 scale is **not** entered by field workers for ACS; they record **structured observations** (pathway present/absent/anecdotal, sampled entries, complete entries, timely?). The engine derives the score.
- Each question displays layer, convergence question, "Why am I collecting this?".
- Scheduling guard (AEHT §14): block/warn field-work scheduling on school-exam days, designated immunisation/session days, and Anganwadi visits without a female team member. Port `fieldDayAllowed`.
- Reuse the good UX of the old prototype (autosave, section progress, search, large touch targets), but **replace** its free-text village-baseline content. Do not carry over free-text "biggest issues" as scored data; they may exist only as labelled context notes.
- No server-side data in localStorage that contains evidence content beyond a draft queue; encrypt the draft queue or keep it minimal, purge on submit.

## 10. FRONT B — ADMIN (React, professional government UI, not a chatbot look)

Nav: Dashboard · Delivery Points · Pathways · Evidence · Impact Passports · ACS · Convergence Heat-map · Verified Gaps · Priority Action Framework · Actions · Reviewer · Corrections · Privacy Incidents · Audit Log · Reports · Settings / Rule Catalogue.
The Dashboard must immediately answer: where is continuity breaking, why, what evidence proves it, how strong is continuity, what action next, who owns it, does it need escalation. Required widgets: district overview; aggregate heat-map (pathway × layer/component); ACS bands with applicable-component counts; pathway breaks; cross-sector patterns; verified-gap counts; priority framework; responsible departments; action status; evidence coverage; reviewer-validation status.
Reproduce these behaviours from the old admin panel (seen in the recording): a **"Run analysis"** action; a **field-data-quality** block (records, fields captured vs. needed, evidence completeness, fields needing verification); **ACS readiness** table showing `Not captured` / `Not yet calculable (0/4)` with the note "Not captured is not a low score"; **What needs attention** list with badges `VERIFIED GAP`, `POTENTIAL GAP`, `NOT ASSESSED`; a **trace drawer** (Dashboard → finding → delivery point → question → raw response, with source/date, analytical interpretation, potential owner, next step, "View raw response"); **convergence analysis** between School ↔ Anganwadi ↔ Health with the explicit line "No referral failure is claimed where none is evidenced".
Public/aggregate views never show institution/officer/staff names against scores. Internal Impact Passports are permission-gated.
**Impact Passport** (one per delivery point, Annexure A): delivery point code, sector/system, pathway assessed, verified strengths, verified gaps, ACS + applicable count, priority flags (urgency/reach/feasibility), responsible system, immediate action, escalation/resource need. Visually separate **VERIFIED / NOT VERIFIED / RECOMMENDED / REQUIRES DISTRICT DECISION**. Never imply causal impact.
Every report footer includes AEHT §15.1 limitations: small purposive pilot, not a district-wide statistical evaluation; ACS is a continuity indicator not a causal impact measure; evidence reflects the approved field window; no individual outcome claims from anonymised token data; recommendations subject to departmental verification, technical feasibility and competent-authority decision.

## 11. GOVERNANCE, WORKFLOWS, PRIVACY

**RBAC (backend-enforced, object-level):** `DISTRICT_MAGISTRATE` (oversight, pilot approval, nominates nodal officer, authorises use of findings) · `DISTRICT_NODAL_OFFICER` (coordination, sample confirmation, validates factual corrections) · `ARYABHATA_FIELD_TEAM` (collect, map, draft; **no sanctioning or disciplinary authority**) · `INDEPENDENT_REVIEWER` (review, challenge, record limitations/disagreements; **cannot implement or change administrative decisions**) · `INSTITUTION_HEAD` (review factual observations, flag errors, exit briefing). Every endpoint declares required roles; tests prove denial.
**Exit briefing (AEHT §14.1):** per delivery point, ~15-minute plain-language briefing; observations framed as system findings; institution head may flag factual errors; record acknowledgement **"Factual Observations Shared"**; if unsigned record **"Shared but not signed"** + reason; refusal is **never** adverse evidence and never counts as a dispute; log material corrections; dashboard finalises only after the correction window closes.
**Independent reviewer (§8.3):** expertise info, COI declaration, confidentiality declaration, no reporting line to field team, not an AEHT employee/board member/donor/paid consultant now or in prior 3 years, District right to accept/propose alternative/veto. Review note must record limitations and disagreements, not just endorsement.
**Corrections:** immutable, auditable, linked to evidence and verifier; original value retained.
**PII incident workflow (§8.1/§13):** stop processing → secure delete/return → keep only a non-identifying incident record → notify District Nodal Officer **within 2 hours** of discovery (show countdown + overdue flag) → follow District direction. States: `DETECTED → CONTAINED → NODAL_NOTIFIED → DISTRICT_DIRECTED → CLOSED`.
**Retention (§8.2):** default delete tokenised/anonymised working files within **30 days after Day-7 handover** unless District directs otherwise in writing. Retention countdown, deletion-candidate list, approved deletion, execution, deletion audit log, **deletion certificate** generation (to the District Nodal Officer).
**Day 0–7 model (§14):** Day 1 kick-off/access/sample/protocol · Day 2 document/process review, evidence checklist, pathway map · Days 3–5 field assessment · Day 6 exit briefings, correction window, reviewer pack · Day 7 dashboard finalisation, passports, priority framework, handover. Show a pilot timeline view.
**Audit:** append-only `AuditLog` (who, what, when, object, previous state, new state, reason, evidence refs, rule version). Never overwrite assessment decisions; use new versions.

## 12. TECH STACK AND PHASES

Backend: Java 21, Spring Boot, Spring Web, Spring Data JPA, Spring Security, PostgreSQL, Flyway, Bean Validation. Frontend: React (Vite) with separate shells `/source/*` and `/admin/*`, shared auth/API client/design system/permissions. AI service: Python FastAPI. Docker Compose for all. Secrets only via env vars. No PII in logs. Password hashing (Argon2/BCrypt), JWT or session, secure file access, upload restrictions.
Backend modules: auth, users, roles, district, deliverypoint, sector, pathway, assessment, evidence, verification, scoring, rules, flags, actions, passport, dashboard, reviewer, correction, privacy, audit, reporting.
Entities (minimum): User, Role, District, DeliveryPoint, Sector, Pathway, Assessment, AssessmentLayer, Evidence, EvidenceSource, Verification, ContinuityToken, ACSComponent, ACSResult, RuleDefinition, RuleEvaluation, Flag, ActionDefinition, PriorityAction, ImpactPassport, Reviewer, ReviewerDeclaration, Correction, ExitBriefing, PrivacyIncident, AuditLog, RetentionRecord, DeletionCertificate. `ContinuityToken` stores only the opaque token and minimum approved fields.
REST under `/api/v1` (auth/login, delivery-points, assessments, evidence + `PATCH /evidence/{id}/verification`, `/assessments/{id}/acs`, `/assessments/{id}/explanation`, dashboard + heatmap, flags, actions, priority-actions, impact-passports/{deliveryPointId}, reviewer/reviews, corrections, privacy-incidents). All RBAC-enforced.
**AI service (assistive only, Phase 9):** may do OCR assistance, text extraction, evidence summarisation, grouping similar observations, finding supporting evidence, drafting plain-language explanations and action briefs **from already verified structured inputs**. Every output stores: model/service id, timestamp, input evidence refs, output, quality metadata, status `DRAFT | REVIEWED | ACCEPTED | REJECTED`. AI text never becomes an official finding without human acceptance. The AI service receives only PII-checked, already-verified text; it has **no write path** to scores, flags, priority, or verification. Add a test that fails if any scoring/priority/verification field is writable by the AI client.

**Phases (stop at each gate):**
1. Monorepo, Docker Compose, Postgres, Spring Boot, React shells, FastAPI skeleton, env config. *Gate: all containers healthy, Flyway baseline runs.*
2. Auth, RBAC, district, delivery points, sectors, pathways, sample-selection record. *Gate: role-denial tests pass.*
3. Source workflow: question catalogue, five layers, evidence capture + PII validation, verification state machine. *Gate: PII blocked, privacy incident created.*
4. Rule engine, ACS, Explain Score; port engine.js with golden fixtures. *Gate: Java output == engine.js output on all fixtures.*
5. Flag engine, action catalogue, Priority Action Framework. *Gate: flag→rule→action traceable end-to-end.*
6. Admin dashboard, heat-map, Impact Passport, reports. *Gate: every number clickable to evidence.*
7. Reviewer, corrections, exit briefing.
8. Privacy incidents, retention, deletion certificate, audit hardening.
9. AI assistive service.
10. Full test suite, security review, e2e, Docker deploy.

## 13. TESTS THAT MUST EXIST AND PASS

ACS deterministic · N/A rebasing · four equal weights · band edges (39/40/69/70) · priority = U×R · feasibility never changes score · priority refused on unverified gap · unsupported evidence cannot yield VERIFIED gap · PII cannot enter analytical records · each role denied unauthorised data · AI cannot modify official scores · every score has evidence refs · every flag has rule ID+version · every rule maps to an action · no ranking endpoint or sorted-by-ACS institution list exists · corrections auditable · reviewer actions auditable · deletion workflow auditable · exit-briefing unsigned ≠ adverse · 2-hour incident clock · 30-day deletion date · field-day constraints · JS/Java golden-fixture parity.

## 14. BEFORE ANY CODE — PRODUCE `docs/` (then wait for my approval)

1) Architecture 2) Domain model 3) ER diagram (Mermaid) 4) State machines (evidence verification, assessment, priority action, privacy incident, correction, deletion) 5) Rule-engine spec 6) ACS spec 7) OpenAPI spec 8) Frontend page map for both shells 9) AI-service boundaries 10) Security model 11) Retention model 12) Test strategy 13) `DECISIONS.md` listing every IMPLEMENTATION DECISION.

## 15. FINAL PRINCIPLE

If you are ever unsure whether something is allowed, choose the more conservative option: **no PII, no ranking, no AI score, no unverified claim, nothing without an evidence trail.** Ask me instead of guessing.
