import unittest
from fastapi.testclient import TestClient
from main import app

class TestAiService(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)

    def test_health_check_isolation_flags(self):
        resp = self.client.get("/health")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["status"], "UP")
        self.assertEqual(data["role"], "ASSISTIVE_ONLY")
        self.assertFalse(data["write_permission_to_scores"], "AI must have zero write permission to scores")
        self.assertFalse(data["write_permission_to_flags"], "AI must have zero write permission to flags")
        self.assertFalse(data["write_permission_to_priorities"], "AI must have zero write permission to priorities")

    def test_pii_check_detects_aadhaar(self):
        resp = self.client.post("/api/v1/pii-check", json={"text": "Child UID is 4567 8901 2345 on slip"})
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertTrue(data["has_pii"])
        self.assertIn("SUSPECTED_AADHAAR_NUMBER", data["detected_patterns"])
        self.assertIn("[REDACTED_AADHAAR]", data["sanitized_preview"])

    def test_pii_check_detects_phone(self):
        resp = self.client.post("/api/v1/pii-check", json={"text": "Contact parent at 9876543210"})
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertTrue(data["has_pii"])
        self.assertIn("SUSPECTED_PHONE_NUMBER", data["detected_patterns"])
        self.assertIn("[REDACTED_PHONE]", data["sanitized_preview"])

    def test_pii_check_clean_text(self):
        resp = self.client.post("/api/v1/pii-check", json={"text": "Duty roster displayed on wall for August 2026"})
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertFalse(data["has_pii"])
        self.assertEqual(data["risk_level"], "NONE")

    def test_ocr_extract_permitted_kinds(self):
        resp = self.client.post("/api/v1/ocr-extract", json={
            "document_kind": "PROCESS_DOCUMENT",
            "raw_content": "Section 4.2 Standard Referral Protocol Guidelines"
        })
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["document_kind"], "PROCESS_DOCUMENT")
        self.assertTrue(data["pii_screened"])

    def test_ocr_extract_prohibited_kind(self):
        resp = self.client.post("/api/v1/ocr-extract", json={
            "document_kind": "STUDENT_ID_CARD",
            "raw_content": "Prohibited content"
        })
        self.assertEqual(resp.status_code, 400)

    def test_draft_brief_requires_verified_evidence(self):
        resp = self.client.post("/api/v1/draft-brief", json={
            "issue_title": "Referral Lag",
            "verified_evidence_ids": [],
            "sector": "Health",
            "pathway": "RBSK"
        })
        self.assertEqual(resp.status_code, 400)
        self.assertIn("verified evidence IDs", resp.json()["detail"])

    def test_draft_brief_mandatory_draft_status(self):
        resp = self.client.post("/api/v1/draft-brief", json={
            "issue_title": "RBSK Counterfoil Lag",
            "verified_evidence_ids": ["EV-001", "EV-002"],
            "sector": "Education",
            "pathway": "School Health"
        })
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        # Invariants from AEHT §3.4
        self.assertEqual(data["status"], "DRAFT")
        self.assertTrue(data["human_review_required"])
        self.assertIn("planning inputs only", data["statutory_planning_notice"])
        self.assertEqual(data["input_evidence_refs"], ["EV-001", "EV-002"])

    def test_zero_write_paths_schema_isolation(self):
        # Verify response dictionary does not contain analytical score or priority mutators
        resp = self.client.post("/api/v1/draft-brief", json={
            "issue_title": "Test Brief",
            "verified_evidence_ids": ["EV-001"],
            "sector": "Education",
            "pathway": "School Health"
        })
        data = resp.json()
        self.assertNotIn("acs_score", data)
        self.assertNotIn("priority_score", data)
        self.assertNotIn("urgency", data)
        self.assertNotIn("reach", data)
        self.assertNotIn("feasibility", data)
        self.assertNotIn("verification_status", data)

    def test_analyze_assessment_with_pdf_citation(self):
        resp = self.client.post("/api/v1/analyze-assessment", json={
            "delivery_point_code": "EKH-EDU-01",
            "district_id": "east-khasi-hills",
            "district_name": "East Khasi Hills",
            "sector": "EDUCATION",
            "answers": [
                {"question_id": "S01", "question_number": 1, "answer": "Mawphlang Upper Primary School (23040100101)", "layer": 1},
                {"question_id": "S04", "question_number": 4, "answer": "<75%", "layer": 2},
                {"question_id": "S11", "question_number": 11, "answer": "CRITICAL FACILITY ABSENT", "layer": 4}
            ],
            "quiz_pdf": {
                "file_name": "Baseline_Survey_EKH-EDU-01_Q1.pdf",
                "file_size": "78 KB",
                "data_url": "data:application/pdf;base64,JVBERi0xLjQK..."
            }
        })
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["status"], "DRAFT")
        self.assertTrue(data["human_review_required"])
        self.assertEqual(data["delivery_point_code"], "EKH-EDU-01")
        # Verify PDF is cited in judgement
        self.assertTrue(data["quiz_pdf_citation"]["included_in_judgement"])
        self.assertEqual(data["quiz_pdf_citation"]["file_name"], "Baseline_Survey_EKH-EDU-01_Q1.pdf")
        self.assertIn("Baseline_Survey_EKH-EDU-01_Q1.pdf", data["quiz_pdf_citation"]["citation_notice"])
        # Verify red flags are diagnosed
        red_flag_ids = [rf["question_id"] for rf in data["detected_red_flags"]]
        self.assertIn("S04", red_flag_ids)
        self.assertIn("S11", red_flag_ids)
        # Verify 5 layer scores exist
        self.assertIn("L1", data["layer_scores"])
        self.assertIn("L5", data["layer_scores"])
        self.assertIn("draft_title", data["action_brief"])

if __name__ == "__main__":
    unittest.main()
