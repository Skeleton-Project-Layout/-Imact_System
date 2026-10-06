import re
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="ABHISARAN AI Assistive Microservice",
    description="Assistive-only OCR, PII pre-screening, and drafting service. Strictly read-only towards analytical scores.",
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
    risk_level: str  # NONE, SUSPECTED, CONFIRMED
    detected_patterns: List[str]
    sanitized_preview: str

class DraftBriefRequest(BaseModel):
    issue_title: str
    verified_evidence_ids: List[str]
    sector: str
    pathway: str

class DraftBriefResponse(BaseModel):
    status: str = "DRAFT"  # Absolute invariant: AI text is always DRAFT until human accepted
    draft_title: str
    problem_statement: str
    indicative_next_step: str
    generated_at: str

# ------------------------------------------------------------------------------
# Endpoints
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
        "timestamp": datetime.utcnow().isoformat()
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

    # 3. Direct personal prefixes
    if re.search(r'\b(Master|Baby|Child|Kumari|Shri|Smt)\s+[A-Z][a-z]+', text):
        patterns.append("SUSPECTED_INDIVIDUAL_NAME")

    has_pii = len(patterns) > 0
    return PiiCheckResponse(
        has_pii=has_pii,
        risk_level="SUSPECTED" if has_pii else "NONE",
        detected_patterns=patterns,
        sanitized_preview=re.sub(r'\d{4}', 'XXXX', text) if has_pii else text
    )

@app.post("/api/v1/draft-brief", response_model=DraftBriefResponse)
def draft_action_brief(req: DraftBriefRequest):
    # Absolute invariant: AI drafts only from structured, verified inputs
    if not req.verified_evidence_ids:
        raise HTTPException(
            status_code=400,
            detail="Cannot draft an action brief without verified evidence IDs."
        )

    return DraftBriefResponse(
        status="DRAFT",
        draft_title=f"System Continuity Brief: {req.issue_title}",
        problem_statement=f"Field evidence across {req.pathway} ({req.sector}) indicates an operational gap documented in evidence items {', '.join(req.verified_evidence_ids)}.",
        indicative_next_step="Departmental Nodal Officer to verify institutional protocol and review with delivery point head.",
        generated_at=datetime.utcnow().isoformat()
    )
