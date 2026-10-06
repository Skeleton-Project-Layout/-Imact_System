package org.aeht.abhisaran.governance;

import org.aeht.abhisaran.model.ExitBriefing;
import org.aeht.abhisaran.repository.ExitBriefingRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ExitBriefingTests {

    @Mock
    private ExitBriefingRepository exitBriefingRepository;

    @InjectMocks
    private ExitBriefingService exitBriefingService;

    @Test
    @DisplayName("GOVN-01: Acknowledged exit briefing records 'Factual Observations Shared'")
    void testRecordExitBriefing_Acknowledged_Success() {
        when(exitBriefingRepository.save(any(ExitBriefing.class))).thenAnswer(i -> i.getArgument(0));

        ExitBriefing briefing = exitBriefingService.recordExitBriefing(
                "EDU-01",
                "field_lead",
                "Headmaster",
                "ACKNOWLEDGED",
                null,
                null,
                "Clarified RBSK counterfoil storage location",
                true
        );

        assertNotNull(briefing);
        assertEquals("EDU-01", briefing.getDeliveryPointCode());
        assertEquals("ACKNOWLEDGED", briefing.getStatus());
        assertEquals("Factual Observations Shared", briefing.getAcknowledgementText());
        assertTrue(briefing.getNonAdverseDeclaration(), "Must maintain non-adverse declaration");
        assertTrue(briefing.getMaterialCorrectionsLogged());
        assertFalse(briefing.getFinalized());
        assertNotNull(briefing.getCorrectionWindowClosesAt());
        assertTrue(exitBriefingService.verifyNonAdverseSemantics(briefing));
    }

    @Test
    @DisplayName("GOVN-01: Shared but unsigned briefing records non-adverse reason without scoring penalty")
    void testRecordExitBriefing_SharedUnsigned_WithReason_Success() {
        when(exitBriefingRepository.save(any(ExitBriefing.class))).thenAnswer(i -> i.getArgument(0));

        ExitBriefing briefing = exitBriefingService.recordExitBriefing(
                "HLT-01",
                "field_lead",
                "Medical Officer In-Charge",
                "SHARED_UNSIGNED",
                null,
                "Medical Officer on urgent referral duty; briefing pack received by Senior Nursing Officer.",
                "Requested adolescent register re-check",
                false
        );

        assertNotNull(briefing);
        assertEquals("SHARED_UNSIGNED", briefing.getStatus());
        assertNotNull(briefing.getRefusalReason());
        // Absolute invariant from AEHT §14.1: unsigned briefing != adverse evidence
        assertTrue(briefing.getNonAdverseDeclaration());
        assertTrue(exitBriefingService.verifyNonAdverseSemantics(briefing));
    }

    @Test
    @DisplayName("GOVN-01: Unsigned briefing without reason throws exception per AEHT §14.1")
    void testRecordExitBriefing_SharedUnsigned_MissingReason_ThrowsException() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                exitBriefingService.recordExitBriefing(
                        "HLT-01",
                        "field_lead",
                        "Medical Officer",
                        "SHARED_UNSIGNED",
                        null,
                        "",
                        null,
                        false
                )
        );

        assertTrue(ex.getMessage().contains("reason must be explicitly recorded"));
    }

    @Test
    @DisplayName("GOVN-01: Refused briefing records explicit non-adverse status without dispute")
    void testRecordExitBriefing_RefusedNonAdverse_Success() {
        when(exitBriefingRepository.save(any(ExitBriefing.class))).thenAnswer(i -> i.getArgument(0));

        ExitBriefing briefing = exitBriefingService.recordExitBriefing(
                "WCD-02",
                "field_lead",
                "Anganwadi Worker",
                "REFUSED_NON_ADVERSE",
                null,
                "Worker attending mandatory district POSHAN training; non-adverse per AEHT §14.1",
                null,
                false
        );

        assertNotNull(briefing);
        assertEquals("REFUSED_NON_ADVERSE", briefing.getStatus());
        assertTrue(briefing.getNonAdverseDeclaration());
        assertTrue(exitBriefingService.verifyNonAdverseSemantics(briefing));
    }

    @Test
    @DisplayName("GOVN-01: Invalid briefing status is rejected")
    void testRecordExitBriefing_InvalidStatus_ThrowsException() {
        assertThrows(IllegalArgumentException.class, () ->
                exitBriefingService.recordExitBriefing(
                        "EDU-01",
                        "field_lead",
                        "Headmaster",
                        "DISPUTED", // Not an allowed status
                        null,
                        null,
                        null,
                        false
                )
        );
    }

    @Test
    @DisplayName("GOVN-01: Finalizing briefing sets finalized flag")
    void testFinalizeExitBriefing_Success() {
        UUID id = UUID.randomUUID();
        ExitBriefing existing = ExitBriefing.builder()
                .id(id)
                .deliveryPointCode("EDU-01")
                .finalized(false)
                .build();

        when(exitBriefingRepository.findById(id)).thenReturn(Optional.of(existing));
        when(exitBriefingRepository.save(any(ExitBriefing.class))).thenAnswer(i -> i.getArgument(0));

        ExitBriefing finalized = exitBriefingService.finalizeExitBriefing(id);
        assertTrue(finalized.getFinalized());
        assertNotNull(finalized.getUpdatedAt());
    }
}
