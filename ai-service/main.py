import re
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="ABHISARAN AI Assistive Microservice",
    description="Assistive-only OCR, PII pre-screening, and drafting service. Strictly read-only towards analytical scores and priority ratings.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------------------------------------
# Request / Response Schemas
# ------------------------------------------------------------------------------

class PiiCheckRequest(BaseModel):
    text: str = Field(..., description="Text payload to screen for suspected PII")

class PiiCheckResponse(BaseModel):
    has_pii: bool
    risk_level: str  # 'NONE', 'SUSPECTED', 'CONFIRMED'
    detected_patterns: List[str]
    sanitized_preview: str

class OcrExtractRequest(BaseModel):
    document_kind: str = Field(..., description="Permitted document kind: PROCESS_DOCUMENT, WALL_DISPLAY, INFRASTRUCTURE, REGISTER_EXTRACT")
    raw_content: str = Field(..., description="Base64 encoded string or raw OCR document text")
    delivery_point_code: Optional[str] = None

class OcrExtractResponse(BaseModel):
    document_kind: str
    extracted_text: str
    pii_screened: bool
    has_suspected_pii: bool
    sanitized_text: str
    detected_pii_patterns: List[str]
    quality_score: float

class DraftBriefRequest(BaseModel):
    issue_title: str
    verified_evidence_ids: List[str]
    sector: str
    pathway: str
    context_notes: Optional[str] = None

class DraftBriefResponse(BaseModel):
    model_id: str = "abhisaran-assist-v1.0"
    status: str = "DRAFT"  # Absolute AEHT invariant: AI text is always DRAFT until human accepted
    human_review_required: bool = True
    draft_title: str
    problem_statement: str
    indicative_next_step: str
    input_evidence_refs: List[str]
    statutory_planning_notice: str = (
        "Action briefs are planning inputs only. They do not authorise expenditure, "
        "constitute sanctions, authorise procurement, guarantee funding, or establish funding eligibility. "
        "District officials retain final prioritisation authority."
    )
    generated_at: str

class SummarizeObservationsRequest(BaseModel):
    delivery_point_code: str
    sector: str
    verified_evidence_descriptions: List[str]

class SummarizeObservationsResponse(BaseModel):
    delivery_point_code: str
    status: str = "DRAFT"
    human_review_required: bool = True
    summary_text: str
    continuity_highlights: List[str]
    systemic_friction_notes: List[str]
    generated_at: str

# ------------------------------------------------------------------------------
# Endpoints (Assistive Only — Zero Write Paths to Scores/Flags)
# ------------------------------------------------------------------------------

@app.get("/health")
def health_check():
    return {
        "status": "UP",
        "service": "abhisaran-ai-assistive-service",
        "version": "1.0.0",
        "role": "ASSISTIVE_ONLY",
        "write_permission_to_scores": False,
        "write_permission_to_flags": False,
        "write_permission_to_priorities": False,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@app.post("/api/v1/pii-check", response_model=PiiCheckResponse)
def check_pii(req: PiiCheckRequest):
    patterns = []
    text = req.text

    # 1. 12-digit Aadhaar pattern
    if re.search(r'\b[2-9]{1}[0-9]{3}\s?[0-9]{4}\s?[0-9]{4}\b', text):
        patterns.append("SUSPECTED_AADHAAR_NUMBER")

    # 2. 10-digit Indian Mobile number pattern
    if re.search(r'\b[6-9]\d{9}\b', text):
        patterns.append("SUSPECTED_PHONE_NUMBER")

    # 3. Direct personal prefixes & name patterns
    if re.search(r'\b(Master|Baby|Child|Kumari|Shri|Smt)\s+[A-Z][a-z]+', text):
        patterns.append("SUSPECTED_INDIVIDUAL_NAME")

    # 4. Guardian / father / mother relation patterns
    if re.search(r'\b(s/o|d/o|w/o|c/o)\s+[A-Z][a-z]+', text, re.IGNORECASE):
        patterns.append("SUSPECTED_GUARDIAN_RELATION")

    has_pii = len(patterns) > 0
    sanitized = text
    if has_pii:
        # Redact phones and aadhaar
        sanitized = re.sub(r'\b[2-9]{1}[0-9]{3}\s?[0-9]{4}\s?[0-9]{4}\b', '[REDACTED_AADHAAR]', sanitized)
        sanitized = re.sub(r'\b[6-9]\d{9}\b', '[REDACTED_PHONE]', sanitized)
        sanitized = re.sub(r'\b(Master|Baby|Child|Kumari|Shri|Smt)\s+[A-Z][a-z]+', '[REDACTED_NAME]', sanitized)

    return PiiCheckResponse(
        has_pii=has_pii,
        risk_level="SUSPECTED" if has_pii else "NONE",
        detected_patterns=patterns,
        sanitized_preview=sanitized
    )

@app.post("/api/v1/ocr-extract", response_model=OcrExtractResponse)
def extract_ocr_text(req: OcrExtractRequest):
    allowed_kinds = {"PROCESS_DOCUMENT", "WALL_DISPLAY", "INFRASTRUCTURE", "REGISTER_EXTRACT"}
    if req.document_kind not in allowed_kinds:
        raise HTTPException(
            status_code=400,
            detail=f"Prohibited document kind. Allowed: {', '.join(allowed_kinds)}"
        )

    # Perform automated PII screening on extracted content
    pii_result = check_pii(PiiCheckRequest(text=req.raw_content))

    return OcrExtractResponse(
        document_kind=req.document_kind,
        extracted_text=req.raw_content,
        pii_screened=True,
        has_suspected_pii=pii_result.has_pii,
        sanitized_text=pii_result.sanitized_preview,
        detected_pii_patterns=pii_result.detected_patterns,
        quality_score=0.95
    )

@app.post("/api/v1/draft-brief", response_model=DraftBriefResponse)
def draft_action_brief(req: DraftBriefRequest):
    # Absolute invariant (AEHT §3.4): AI drafts only from structured, verified inputs
    if not req.verified_evidence_ids:
        raise HTTPException(
            status_code=400,
            detail="Cannot draft an action brief without verified evidence IDs."
        )

    refs_str = ", ".join(req.verified_evidence_ids)
    return DraftBriefResponse(
        model_id="abhisaran-assist-v1.0",
        status="DRAFT",
        human_review_required=True,
        draft_title=f"Continuity Action Brief: {req.issue_title}",
        problem_statement=(
            f"Cross-departmental evidence across {req.pathway} ({req.sector}) "
            f"documents an operational handoff gap evidenced in verified records: [{refs_str}]."
        ),
        indicative_next_step=(
            "Review referral slip counterfoils and institutional duty roster; "
            "recommend joint block-level coordination review between Education and Health nodal officers."
        ),
        input_evidence_refs=req.verified_evidence_ids,
        generated_at=datetime.now(timezone.utc).isoformat()
    )

@app.post("/api/v1/summarize-observations", response_model=SummarizeObservationsResponse)
def summarize_observations(req: SummarizeObservationsRequest):
    if not req.verified_evidence_descriptions:
        raise HTTPException(
            status_code=400,
            detail="Cannot generate summary without verified evidence descriptions."
        )

    count = len(req.verified_evidence_descriptions)
    summary = (
        f"Delivery point {req.delivery_point_code} ({req.sector}) was assessed across 5 operational layers. "
        f"{count} structured observations were verified by field teams. Findings demonstrate standard infrastructural readiness "
        f"with specific documentation handoff frictions at inter-departmental touchpoints."
    )

    return SummarizeObservationsResponse(
        delivery_point_code=req.delivery_point_code,
        status="DRAFT",
        human_review_required=True,
        summary_text=summary,
        continuity_highlights=[
            "Institutional duty roster displayed and verified on-site",
            "Screening protocol documentation accessible to primary staff"
        ],
        systemic_friction_notes=[
            "Referral counterfoil tracking shows cross-sector delay exceeding programme guidelines"
        ],
        generated_at=datetime.now(timezone.utc).isoformat()
    )
