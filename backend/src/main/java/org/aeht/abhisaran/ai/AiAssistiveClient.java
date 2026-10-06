package org.aeht.abhisaran.ai;

import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiAssistiveClient {

    @Value("${ai.service.url:http://localhost:8000}")
    private String aiServiceUrl;

    @Data
    @Builder
    public static class DraftBriefResponseDto {
        private String modelId;
        private String status; // Strictly 'DRAFT'
        private Boolean humanReviewRequired;
        private String draftTitle;
        private String problemStatement;
        private String indicativeNextStep;
        private List<String> inputEvidenceRefs;
        private String statutoryPlanningNotice;
        private String generatedAt;
    }

    @Data
    @Builder
    public static class PiiScreenResponseDto {
        private Boolean hasPii;
        private String riskLevel;
        private List<String> detectedPatterns;
        private String sanitizedPreview;
    }

    /**
     * Assistive Action Brief Generator.
     * Absolute AEHT §3.4 constraint: AI provides assistive suggestions ONLY.
     * All outputs are strictly marked DRAFT and have ZERO write capability to scores or flags.
     */
    public DraftBriefResponseDto requestDraftBrief(
            String issueTitle,
            List<String> verifiedEvidenceIds,
            String sector,
            String pathway
    ) {
        if (verifiedEvidenceIds == null || verifiedEvidenceIds.isEmpty()) {
            throw new IllegalArgumentException("Cannot request AI draft brief without verified evidence references");
        }

        log.info("Requesting assistive draft brief for issue '{}' across evidence: {}", issueTitle, verifiedEvidenceIds);

        // Fallback / standard deterministic assistive output
        return DraftBriefResponseDto.builder()
                .modelId("abhisaran-assist-v1.0")
                .status("DRAFT")
                .humanReviewRequired(true)
                .draftTitle("Continuity Action Brief: " + issueTitle)
                .problemStatement(
                        String.format("Cross-departmental evidence across %s (%s) indicates an operational handoff gap evidenced in verified records: %s.",
                                pathway, sector, verifiedEvidenceIds)
                )
                .indicativeNextStep("Departmental Nodal Officer to verify institutional protocol and review with delivery point head.")
                .inputEvidenceRefs(verifiedEvidenceIds)
                .statutoryPlanningNotice(
                        "Action briefs are planning inputs only. They do not authorise expenditure, " +
                        "constitute sanctions, authorise procurement, guarantee funding, or establish funding eligibility. " +
                        "District officials retain final prioritisation authority."
                )
                .generatedAt(Instant.now().toString())
                .build();
    }

    public PiiScreenResponseDto screenTextForPii(String text) {
        if (text == null || text.isBlank()) {
            return PiiScreenResponseDto.builder()
                    .hasPii(false)
                    .riskLevel("NONE")
                    .detectedPatterns(List.of())
                    .sanitizedPreview("")
                    .build();
        }

        boolean hasAadhaar = text.matches(".*\\b[2-9][0-9]{3}\\s?[0-9]{4}\\s?[0-9]{4}\\b.*");
        boolean hasPhone = text.matches(".*\\b[6-9]\\d{9}\\b.*");
        boolean hasPii = hasAadhaar || hasPhone;

        List<String> patterns = new java.util.ArrayList<>();
        if (hasAadhaar) patterns.add("SUSPECTED_AADHAAR_NUMBER");
        if (hasPhone) patterns.add("SUSPECTED_PHONE_NUMBER");

        String sanitized = text;
        if (hasAadhaar) sanitized = sanitized.replaceAll("\\b[2-9][0-9]{3}\\s?[0-9]{4}\\s?[0-9]{4}\\b", "[REDACTED_AADHAAR]");
        if (hasPhone) sanitized = sanitized.replaceAll("\\b[6-9]\\d{9}\\b", "[REDACTED_PHONE]");

        return PiiScreenResponseDto.builder()
                .hasPii(hasPii)
                .riskLevel(hasPii ? "SUSPECTED" : "NONE")
                .detectedPatterns(patterns)
                .sanitizedPreview(sanitized)
                .build();
    }
}
