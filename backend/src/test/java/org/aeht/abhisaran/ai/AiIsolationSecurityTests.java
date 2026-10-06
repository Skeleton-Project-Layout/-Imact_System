package org.aeht.abhisaran.ai;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;

public class AiIsolationSecurityTests {

    private final AiAssistiveClient aiClient = new AiAssistiveClient();

    @Test
    @DisplayName("AIMS-02: AI DTO contains zero write/mutator fields for official scores, flags, or priorities")
    void testAiDraftBriefResponse_ZeroWriteFieldsToAnalyticalScores() {
        Set<String> prohibitedFields = Set.of(
                "acsScore", "acsscore", "score", "componentScore",
                "urgency", "reach", "feasibility", "priorityScore", "priorityBand",
                "verificationStatus", "flagCode", "severity"
        );

        Field[] fields = AiAssistiveClient.DraftBriefResponseDto.class.getDeclaredFields();
        Set<String> actualFieldNames = Arrays.stream(fields)
                .map(Field::getName)
                .map(String::toLowerCase)
                .collect(Collectors.toSet());

        for (String prohibited : prohibitedFields) {
            assertFalse(
                    actualFieldNames.contains(prohibited.toLowerCase()),
                    "CRITICAL VIOLATION (AEHT §3.4): AI Response DTO cannot contain field: " + prohibited
            );
        }
    }

    @Test
    @DisplayName("AIMS-02: AI Draft Brief is strictly marked DRAFT with mandatory human review")
    void testAiDraftBriefResponse_MandatoryDraftStatus() {
        AiAssistiveClient.DraftBriefResponseDto draft = aiClient.requestDraftBrief(
                "RBSK Follow-up Lag",
                List.of("EV-EDU-01", "EV-HLT-01"),
                "Education",
                "School-Health Handoff"
        );

        assertNotNull(draft);
        assertEquals("DRAFT", draft.getStatus(), "AI output status MUST be strictly 'DRAFT'");
        assertTrue(draft.getHumanReviewRequired(), "AI output must require explicit human review");
        assertNotNull(draft.getStatutoryPlanningNotice());
        assertTrue(draft.getStatutoryPlanningNotice().contains("planning inputs only"));
        assertEquals(List.of("EV-EDU-01", "EV-HLT-01"), draft.getInputEvidenceRefs());
    }

    @Test
    @DisplayName("AIMS-01: AI Draft Brief strictly rejects unverified evidence inputs")
    void testAiDraftBrief_RequiresVerifiedEvidence() {
        assertThrows(IllegalArgumentException.class, () ->
                aiClient.requestDraftBrief("Gap Issue", List.of(), "Health", "Referral")
        );

        assertThrows(IllegalArgumentException.class, () ->
                aiClient.requestDraftBrief("Gap Issue", null, "Health", "Referral")
        );
    }

    @Test
    @DisplayName("AIMS-01: PII screening correctly detects and redacts suspected numbers")
    void testAiPiiScreening_RedactsSuspectedPii() {
        String inputWithAadhaar = "Student token UID 3456 7890 1234 recorded";
        AiAssistiveClient.PiiScreenResponseDto res = aiClient.screenTextForPii(inputWithAadhaar);

        assertTrue(res.getHasPii());
        assertEquals("SUSPECTED", res.getRiskLevel());
        assertTrue(res.getSanitizedPreview().contains("[REDACTED_AADHAAR]"));
        assertFalse(res.getSanitizedPreview().contains("3456 7890 1234"));
    }

    @Test
    @DisplayName("AIMS-02: Client exposes no methods modifying repositories or analytical states")
    void testAiClient_StrictlyReadOnlyBoundary() {
        Method[] methods = AiAssistiveClient.class.getDeclaredMethods();
        for (Method m : methods) {
            String name = m.getName().toLowerCase();
            assertFalse(name.contains("save"), "AI client cannot contain save methods");
            assertFalse(name.contains("update"), "AI client cannot contain update methods");
            assertFalse(name.contains("delete"), "AI client cannot contain delete methods");
            assertFalse(name.contains("setscore"), "AI client cannot contain setScore methods");
            assertFalse(name.contains("verify"), "AI client cannot contain verify methods");
        }
    }
}
