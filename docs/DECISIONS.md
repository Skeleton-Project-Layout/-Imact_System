# ABHISARAN Architecture & Implementation Decisions

As mandated by AEHT Working Rule §0.1: *If AEHT is silent on a detail, do NOT invent a rule silently. Label it `IMPLEMENTATION DECISION — NOT SPECIFIED BY AEHT`, choose the smallest option, and add it to `docs/DECISIONS.md`.*

---

## Decision Log

| ID | Topic | Decision | Rationale | Status |
|---|---|---|---|---|
| **DEC-001** | Monorepo Layout | Split into `backend/` (Java 21 Spring Boot), `frontend/` (React Vite), and `ai-service/` (Python FastAPI). | `IMPLEMENTATION DECISION — NOT SPECIFIED BY AEHT`: Clean separation of concerns with unified root build scripts and Docker Compose orchestration. | Approved |
| **DEC-002** | Database & Storage Provider | Supabase PostgreSQL via Flyway versioned migrations; Supabase Storage for sanitized uploads. | `IMPLEMENTATION DECISION — NOT SPECIFIED BY AEHT`: Supabase provides managed PostgreSQL 16 with connection pooling and secure S3-compatible attachment storage. All access remains strictly routed through the Spring Boot backend. | Approved |
| **DEC-003** | Scoring Rule Versioning (`RULE-SCORE-001`) | Completeness thresholds: `<50%` → 2/5, `50–89%` → 3/5, `90–99%` → 4/5, `100% & timely` → 5/5; absent → 0/5; anecdotal → 1/5. | `IMPLEMENTATION DECISION — NOT SPECIFIED BY AEHT`: Reproduces AEHT's explicit example "register exists, ~30% incomplete = 3/5" as a versioned, auditable rule row in the database. | Approved |
| **DEC-004** | Port Allocations | Backend: `8080`, Frontend: `5173`, AI Service: `8000`, Local Postgres: `5432`. | `IMPLEMENTATION DECISION — NOT SPECIFIED BY AEHT`: Standard default ports across development environments with environment variable overrides. | Approved |
| **DEC-005** | Delivery Point Code Scheme | Non-identifying alphanumeric codes: `EDU-01` to `EDU-04` (Schools), `HLT-01` to `HLT-03` (Health), `WCD-01` to `WCD-03` (Anganwadi). | `IMPLEMENTATION DECISION — NOT SPECIFIED BY AEHT`: Enforces Zero-PII and non-punitive principles by masking specific school and facility names in analytical views. | Approved |
| **DEC-006** | AI Service Isolation | Microservice receives only pre-checked, already-verified structured text with zero write paths to scores, flags, priorities, or verification statuses. | Strict adherence to AEHT §3.4 and §12. Guaranteed by backend schema and client tests. | Approved |
| **DEC-007** | Local Offline Fallback | Include lightweight PostgreSQL Alpine container in `docker-compose.yml` for offline development when remote Supabase network is unavailable. | `IMPLEMENTATION DECISION — NOT SPECIFIED BY AEHT`: Ensures local test suites and Docker builds can execute in isolated container environments. | Approved |

---
*Maintained throughout project lifecycle. Any new implementation decision must be recorded here.*
