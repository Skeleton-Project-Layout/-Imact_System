<!-- GSD:project-start source:PROJECT.md -->

## Project

**ABHISARAN – District Programme Continuity Scan**

A government decision-support platform built for the Aryabhata Educational & Health Trust (AEHT) to diagnose, assess, and strengthen cross-departmental service continuity for vulnerable beneficiaries across Education (schools), Health/RBSK (screening & referral), and Women & Child Development (Anganwadi) at the district level. It features a mobile-first field evidence collection tool (`/source/*`) and an administrative decision-support dashboard (`/admin/*`) powered by a deterministic, evidence-based scoring and priority engine.

**Core Value:** Deterministic, verifiable, and zero-PII continuity tracking that connects field evidence directly to district administrative action without black-box scoring or punitive ranking.

### Constraints

- **Security & Privacy**: Zero-PII design. Any suspected PII immediately pauses workflow, creates a PrivacyIncident, and triggers a 2-hour notification clock.
- **Scoring Determinism**: AI is never allowed to modify official scores, flags, or priority ratings. Scores must be 100% reproducible and traceable.
- **Tech Stack**: Frontend in React (Vite), Backend in Java 21 Spring Boot, AI microservice in Python FastAPI, PostgreSQL via Supabase with Flyway migrations.
- **Workflow Phase Gates**: Phased rollout across 10 defined gates, verified with automated tests before advancing.

<!-- GSD:project-end -->

<!-- GSD:stack-start source:STACK.md -->

## Technology Stack

Technology stack not yet documented. Will populate after codebase mapping or first phase.
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

No project skills found. Add skills to any of: `.agents/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-fast` for a trivial task inline, with no subagents and no PLAN.md
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
