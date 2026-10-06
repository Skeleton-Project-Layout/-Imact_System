# ABHISARAN – District Programme Continuity Scan

## What This Is

A government decision-support platform built for the Aryabhata Educational & Health Trust (AEHT) to diagnose, assess, and strengthen cross-departmental service continuity for vulnerable beneficiaries across Education (schools), Health/RBSK (screening & referral), and Women & Child Development (Anganwadi) at the district level. It features a mobile-first field evidence collection tool (`/source/*`) and an administrative decision-support dashboard (`/admin/*`) powered by a deterministic, evidence-based scoring and priority engine.

## Core Value

Deterministic, verifiable, and zero-PII continuity tracking that connects field evidence directly to district administrative action without black-box scoring or punitive ranking.

## Business Context

- **Customer**: Aryabhata Educational & Health Trust (AEHT) & District Administration
- **Revenue model**: Pro bono / In-kind contribution pilot (no financial ask or automatic procurement lock-in)
- **Success metric**: Up to 10 pilot delivery points assessed across 5 layers with verifiable, auditable Impact Passports and zero PII incidents
- **Strategy notes**: AEHT District Programme Continuity Scan DPR (Source of Truth)

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Clean monorepo layout: `frontend/` (React Vite with `/source` and `/admin`), `backend/` (Java 21 Spring Boot), and `ai-service/` (Python FastAPI)
- [ ] Database integration with Supabase PostgreSQL via Flyway versioned migrations and Supabase Storage for sanitized attachment uploads
- [ ] Strict Zero-PII safeguard architecture (client/server pre-checks, immediate containment, PrivacyIncident records, 2-hour countdown)
- [ ] Field evidence collection model across 5 layers and 5 convergence questions with metadata, offline tolerance, and scheduling guards
- [ ] Deterministic Aryabhata Continuity Score (ACS) engine (4 equal 25% components, 0–5 scale, rebased over applicable count)
- [ ] Canonical scoring reference engine in JS with shared JSON golden fixtures, ported to Java Spring Boot with provable parity
- [ ] Flag engine and Action Definition catalogue mapping verified gaps to responsible systems and escalation paths
- [ ] Priority Action Framework (Urgency 1–5 × Reach 1–5, Feasibility 1–5 as separate decision flag)
- [ ] Admin decision-support panel featuring aggregate heat-map, delivery point Impact Passports, and drill-down trace drawer
- [ ] Role-Based Access Control (RBAC) covering District Magistrate, Nodal Officer, Field Team, Independent Reviewer, and Institution Head
- [ ] Day 0–7 pilot lifecycle support including factual exit briefings, corrections window, reviewer declarations, and 30-day retention countdown

### Out of Scope

- Direct beneficiary or child PII storage (Aadhaar, names, phone, address, facial photos) — Zero-PII architectural mandate; continuity tracked solely via non-identifying district tokens
- School/institution league tables or punitive staff ranking — Explicitly prohibited by AEHT (§3.2); non-punitive design focused on system pathways
- Black-box AI scoring or automated recommendation generation — Prohibited by AEHT (§3.4); AI service is strictly assistive for OCR, text extraction, and drafting
- Sectors beyond Education, Health/RBSK, and WCD (e.g., water/sanitation, rural development, agriculture) — Out of scope for Phase 1 pilot

## Context

- The project implements the AEHT District Programme Continuity Scan as specified in the administrative approval submission (DPR).
- Pilot targets up to 10 delivery points (indicative 4 schools, 3 health centers, 3 Anganwadi centers) in a configurable pilot district.
- Frontend delivers two distinct interfaces: Front A (Abhisaran Source for field workers) and Front B (Admin Decision-Support Panel for district officials).
- Reference field form prototype previously developed in vanilla JS (`abhisaran-source.zip`) informs the field interaction model, modernized into React.

## Constraints

- **Security & Privacy**: Zero-PII design. Any suspected PII immediately pauses workflow, creates a PrivacyIncident, and triggers a 2-hour notification clock.
- **Scoring Determinism**: AI is never allowed to modify official scores, flags, or priority ratings. Scores must be 100% reproducible and traceable.
- **Tech Stack**: Frontend in React (Vite), Backend in Java 21 Spring Boot, AI microservice in Python FastAPI, PostgreSQL via Supabase with Flyway migrations.
- **Workflow Phase Gates**: Phased rollout across 10 defined gates, verified with automated tests before advancing.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Monorepo structure (`frontend/`, `backend/`, `ai-service/`) | Clean separation of concerns while sharing root configuration and Docker orchestration | ⏳ Pending |
| Supabase for PostgreSQL + Storage | Managed relational database with Flyway migrations in Spring Boot and signed URL storage for sanitized attachments | ⏳ Pending |
| Canonical engine reconstruction with golden fixtures | Ensures mathematical parity between JavaScript reference implementation and Java backend | ⏳ Pending |
| Non-punitive system language | Prevents adversarial resistance from frontline staff; aligns with AEHT governance principles | ⏳ Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check → still the right priority?
3. Audit Out of Scope → reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-10-06 after initialization*
