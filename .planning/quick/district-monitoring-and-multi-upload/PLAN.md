# Quick Task Plan: District Monitoring Selection & Multi-File Upload in /source

## Problem Statement
1. **District Monitoring Option**: Currently the admin dashboard shows a fixed "Ranchi Rural (Jharkhand)" without an option for administrators or decision-makers to select which district they want to monitor.
2. **Multi-File Upload in `/source`**: Field surveyors capturing evidence artifacts in the mobile-first `/source` application can only select a single file at a time (`e.target.files[0]`). They need to be able to upload multiple photos, register extracts, and PDF documents at once for a question.

## Execution Steps

### 1. District Selection Architecture
- **Districts Catalogue**: Create a dedicated districts registry containing Jharkhand administrative districts (Ranchi Rural Pilot, Khunti, Gumla, Simdega, West Singhbhum, Dumka, Palamu, Hazaribagh, Dhanbad, Bokaro, etc.) with metadata (division, classification, sample status, nodal coordinator).
- **Backend Enhancement**:
  - Add `/api/v1/admin/districts` endpoint returning available districts with pilot/monitoring metadata.
  - Update `/api/v1/admin/overview` to accept optional `districtId` or `districtName` filter parameter.
- **Frontend Admin Panel (`AdminShell.jsx`, `DistrictOverview.jsx`, `ConvergenceHeatmap.jsx`, `ImpactPassportList.jsx`)**:
  - Replace static "Pilot District" text in header with an interactive District Selector (with dropdown, visual indicators for active pilot vs aspirational districts, and quick search/selection).
  - Persist selected district in `localStorage` (`abhisaran_monitored_district`).
  - Pass `selectedDistrict` context down to all admin views.
  - In `DistrictOverview.jsx`, display an active district monitoring banner with stats, DNO details, and sample delivery point breakdown.
  - In `ImpactPassportList.jsx` and `ConvergenceHeatmap.jsx`, show delivery points for the selected district or indicate district context.
- **Frontend Field Tool (`SourceShell.jsx`)**:
  - Add district selection capability in `/source` so field staff can also choose their operational district and filter/view assigned delivery points for that district.

### 2. Multi-File Evidence Upload in `/source`
- **Upload Modal Enhancement (`ZeroPiiUploadModal.jsx`)**:
  - Update `<input type="file">` to support `multiple` and accept `image/*,application/pdf`.
  - Maintain a state array of selected files (`selectedFiles: [{ file, fileName, fileSize, fileType, documentKind }]`).
  - Support drag-and-drop and multiple file selection.
  - Show preview list with file icons, filenames, sizes, document category tags, and individual remove (X) buttons.
  - Validate each file (<10MB per file) and total payload (<50MB).
  - Enforce the statutory Zero-PII attestation checkbox for all selected files.
  - Emit an evidence payload containing the list of all attached files.
- **Question Card Enhancement (`QuestionCard.jsx`)**:
  - Update `evidenceAttachment` renderer to support multiple files (display file count, list chips, and allow removing individual items or adding more).
  - Retain backwards compatibility for legacy single-attachment records.
- **Source Shell Integration (`SourceShell.jsx`)**:
  - Update `handleAttachEvidence` to store and merge multi-file attachments per question.
  - Transmit multi-file evidence metadata during local queue storage and server synchronization.

### 3. Verification & Build
- Verify frontend compilation (`npm run build`).
- Verify Spring Boot backend compilation (`./mvnw test-compile`).
- Verify Docker compose frontend container update.
