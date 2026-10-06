# ABHISARAN – Reference Architecture Ingestion Report (`ref.zip`)

**Document Version:** 1.0.0  
**Date:** October 7, 2026  
**Artifact Source:** `ref.zip` (`ahfjhabsd/`)  
**Status:** Ingested & Synthesized into ABHISARAN Core  
**Live Standalone Preview:** [http://localhost:3000/ref/abhisaran-field-form.html](http://localhost:3000/ref/abhisaran-field-form.html)

---

## 1. Executive Summary

The `ref.zip` package contains the reference field-form prototype developed for the Aryabhata Educational & Health Trust (AEHT). It provides an offline-first, dependency-free, single-file HTML/JS field assessment engine originally prototyped for village-level baseline assessments (East Khasi Hills Pilot).

This ingestion audit analyzes the reference code, extracts its question catalogue and technical utilities, and maps them to the production **ABHISARAN District Programme Continuity Scan** (`Imact_System`).

---

## 2. Ingested Inventory & Artifacts

| Reference File | File Size | Core Technology | Architectural Purpose |
| :--- | :--- | :--- | :--- |
| `src/questions.js` | 13.0 KB | Pure JS ES6 | 67-question baseline survey taxonomy across 7 operational sections. |
| `src/pdfwriter.js` | 15.6 KB | Pure JS PDF 1.4 Engine | Dependency-free A4 PDF generator using built-in Helvetica metrics and WinAnsi encoding. |
| `src/app.js` | 28.2 KB | Pure Vanilla JS | Offline state management (`abhisaran_field_form_v1`), autosave (500ms debounce), multi-village JSON backup/restore. |
| `src/styles.css` | 14.8 KB | Vanilla CSS3 | Mobile-responsive field layout with section progress indicators, dark/light styling, and touch-friendly controls. |
| `src/template.html` | 5.2 KB | HTML5 | Accessible single-page application scaffold. |
| `build.js` | 568 B | Node.js script | Inlines CSS and JS into a single self-contained HTML file (76.7 KB). |
| `abhisaran-field-form-preview.html` | 76.7 KB | Standalone HTML | Fully runnable zero-dependency field assessment form. |

---

## 3. Reference Question Taxonomy (Q1 – Q67)

The reference architecture defines **67 field questions** organized across **7 sections**:

### Section A: Village & Community Profile (Q1 – Q7)
*Focus: Baseline geographical and socio-economic context.*
- **Q1**: Village name & locality.
- **Q2**: Approximate population and household count.
- **Q3**: Top 3 challenges affecting the village.
- **Q4**: Most utilized government schemes (Education, Health, Nutrition, Welfare).
- **Q5**: Important services that remain difficult to access (with recorded rationales).
- **Q6**: Seasonal disruptions (weather, transit, agricultural migration).
- **Q7**: Vulnerable groups requiring highest support priority (children, pregnant mothers, elderly).

### Section B: School – Head Teacher / Principal (Q8 – Q22)
*Focus: Education delivery point infrastructure, attendance, and screening linkages.*
- **Q8**: School name & UDISE+ Code.
- **Q9**: Classes covered (e.g., I–VIII, I–XII).
- **Q10**: Enrolment metrics (Total, Boys, Girls).
- **Q11**: Sanctioned vs. working teacher headcount.
- **Q12**: Average monthly attendance percentage.
- **Q13**: Students frequently absent or at risk of dropping out.
- **Q14**: Foundational learning concerns (Reading, Numeracy, Language, Subject-specific).
- **Q15**: Count of students requiring remedial support.
- **Q16**: Children with Special Needs (CWSN) officially recorded.
- **Q17**: Drinking water availability and functionality.
- **Q18**: Gender-segregated sanitation (Boys, Girls, CWSN toilets).
- **Q19**: Power, internet, and digital education infrastructure.
- **Q20**: Physical infrastructure adequacy (Library, Laboratory, Playground, Classrooms).
- **Q21**: Top 3 institutional gaps identified by the school head.
- **Q22**: Highest-priority administrative support needed.

### Section C: Anganwadi – AWW (Q23 – Q33)
*Focus: Early childhood education, supplementary nutrition, and growth tracking.*
- **Q23**: Anganwadi Centre (AWC) name and official centre code.
- **Q24**: Registered child headcount (Total, Boys, Girls).
- **Q25**: Daily attendance and regular participation.
- **Q26**: Registered pregnant women and lactating mothers.
- **Q27**: Supplementary Nutrition Programme (SNP) regularity and supply issues.
- **Q28**: Growth monitoring (weight/height) frequency and register adherence.
- **Q29**: Identified nutritionally vulnerable / SAM / MAM children.
- **Q30**: Early Childhood Care & Education (ECCE) activities conducted.
- **Q31**: Learning materials, toys, and activity kit availability.
- **Q32**: Health check-up and immunisation coordination with ANM/ASHA.
- **Q33**: Top 3 Anganwadi operational challenges.

### Section D: PHC / Health Facility – Medical Officer / Staff (Q34 – Q45)
*Focus: Primary clinical touchpoint, staffing adequacy, and referral dynamics.*
- **Q34**: Health facility designation and catchment population.
- **Q35**: Medical personnel matrix (Doctors, Nurses, ANM, Staff — Sanctioned vs. Present).
- **Q36**: Outpatient Department (OPD) monthly caseload.
- **Q37**: Essential medicine inventory and availability.
- **Q38**: Basic diagnostic test availability on site.
- **Q39**: Maternal health services (ANC, PNC, High-Risk Referral).
- **Q40**: Child health and Routine Immunisation (RI) coverage.
- **Q41**: Non-Communicable Disease (NCD) screening readiness.
- **Q42**: Top 3–5 prevalent community health conditions.
- **Q43**: Common causes triggering outward referral to higher secondary/tertiary facilities.
- **Q44**: Documented barriers to health facility access (distance, transit, emergency out-of-pocket costs).
- **Q45**: Top 3 systemic health-infrastructure bottlenecks.

### Section E: Community & Household Interaction (Q46 – Q55)
*Focus: Direct beneficiary experience and service friction.*
- **Q46**: Primary point of care sought during illness (PHC vs. Private vs. Traditional).
- **Q47**: Geographic and transport transit difficulty reaching facilities.
- **Q48**: School attendance consistency from parental perspective.
- **Q49**: Household reasons driving attendance disruption (seasonal work, transport, domestic duties).
- **Q50**: Community utilization of Anganwadi services.
- **Q51**: Awareness of flagship state and central welfare schemes.
- **Q52**: Services received but judged inaccessible or unsatisfactory.
- **Q53**: Primary vulnerability facing children in the locality.
- **Q54**: Primary economic/social stressor facing households.
- **Q55**: Single highest priority improvement suggested by the community.

### Section F: Physical Verification – Field Team (Q56 – Q61)
*Focus: Independent factual corroboration and evidence auditing.*
- **Q56**: Physical on-site verification of School facility.
- **Q57**: Physical on-site verification of Anganwadi centre.
- **Q58**: Physical on-site verification of PHC/health post.
- **Q59**: Specific inventory of facilities reported available but verified as non-functional.
- **Q60**: Log of photographic and documentary artifacts collected (with file IDs).
- **Q61**: Unstructured qualitative observations and field auditor notes.

### Section G: Abhisaran Baseline – Quick Summary (Q62 – Q67)
*Focus: District continuity synthesis and cross-sector convergence.*
- **Q62**: Education sector key summary findings (1–2 lines).
- **Q63**: Early childhood care key summary findings (1–2 lines).
- **Q64**: Health and nutrition key summary findings (1–2 lines).
- **Q65**: Community interaction synthesis (1–2 lines).
- **Q66**: Cross-departmental hand-off friction (School ↔ Anganwadi ↔ Health ↔ Community).
- **Q67**: Top 5 measurable indicators prioritized for longitudinal follow-up.

---

## 4. Architectural Comparison: `ref.zip` vs. `Imact_System`

| Architectural Dimension | Reference Prototype (`ref.zip`) | ABHISARAN Platform (`Imact_System`) |
| :--- | :--- | :--- |
| **Operational Tier** | Single-village / facility field survey tool. | District-wide decision-support governance platform. |
| **Question Structure** | 67 descriptive baseline survey questions across 7 vertical sections. | 5-layer cross-sectoral continuity matrix mapped to deterministic rules. |
| **Scoring Engine** | Descriptive summary indicators without composite scoring. | Deterministic Aryabhata Continuity Score (ACS: 0–100) across 4 equal components. |
| **Data Flow** | Offline LocalStorage with JSON backup/restore. | Multi-tier: LocalStorage draft queue → API sync → Supabase PostgreSQL. |
| **PDF Generation** | Dependency-free client-side PDF writer (`pdfwriter.js`). | Backend PDF service + Trace drawer export. |
| **Verification Gate** | Binary physical verification checkbox (Q56–Q58). | 5-state administrative verification FSM (`PENDING_REVIEW` → `VERIFIED`) with immutable audit trail. |
| **Privacy Design** | Manual anonymization prompt in UI. | Automated Zero-PII regex quarantine, immediate containment, and 2-hour notification clock. |

---

## 5. Key Innovations Ingested into `Imact_System`

1. **Standalone Offline Tool Deployment**:
   - The compiled preview form from `ref.zip` has been copied to [`frontend/public/ref/abhisaran-field-form.html`](file:///c:/Users/abhin/Desktop/Arijit%20Backend/Imact_System/frontend/public/ref/abhisaran-field-form.html).
   - It is served live at `http://localhost:3000/ref/abhisaran-field-form.html` for offline field teams requiring the complete 67-question descriptive baseline survey.
2. **Dependency-Free Client-Side PDF Architecture**:
   - `pdfwriter.js` contains a pure-JS font-advance width table and WinAnsi encoding pipeline. This can be utilized for zero-latency client-side rendering of Impact Passports and Exit Briefings when running completely offline in remote field blocks.
3. **Cross-Referenced Taxonomy**:
   - The 67 descriptive questions have been catalogued and mapped to the 5 convergence layers in [`docs/PROJECT_SPEC_AND_TERMINOLOGY_MAPPING.md`](file:///c:/Users/abhin/Desktop/Arijit%20Backend/Imact_System/docs/PROJECT_SPEC_AND_TERMINOLOGY_MAPPING.md).
