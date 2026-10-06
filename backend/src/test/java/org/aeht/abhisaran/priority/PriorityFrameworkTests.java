package org.aeht.abhisaran.priority;

import org.aeht.abhisaran.model.Evidence;
import org.aeht.abhisaran.model.FlagEvaluation;
import org.aeht.abhisaran.model.PriorityActionItem;
import org.aeht.abhisaran.model.Role;
import org.aeht.abhisaran.model.User;
import org.aeht.abhisaran.repository.EvidenceRepository;
import org.aeht.abhisaran.repository.FlagEvaluationRepository;
import org.aeht.abhisaran.repository.PriorityActionItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PriorityFrameworkTests {

    @Mock
    private PriorityActionItemRepository priorityRepository;

    @Mock
    private FlagEvaluationRepository flagRepository;

    @Mock
    private EvidenceRepository evidenceRepository;

    @InjectMocks
    private PriorityFrameworkService priorityService;

    private User decisionOwner;
    private FlagEvaluation verifiedFlag;
    private Evidence verifiedEvidence;
    private Evidence unverifiedEvidence;

    @BeforeEach
    void setUp() {
        decisionOwner = User.builder()
                .id(UUID.randomUUID())
                .username("dm_singh")
                .role(Role.builder().id("DISTRICT_MAGISTRATE").description("District Administrative Lead").build())
                .build();

        UUID evidenceId = UUID.randomUUID();
        verifiedEvidence = Evidence.builder()
                .id(evidenceId)
                .deliveryPointCode("EDU-01")
                .verificationStatus("VERIFIED")
                .build();

        unverifiedEvidence = Evidence.builder()
                .id(UUID.randomUUID())
                .deliveryPointCode("EDU-01")
                .verificationStatus("PENDING_REVIEW")
                .build();

        verifiedFlag = FlagEvaluation.builder()
                .id(UUID.randomUUID())
                .evidenceId(evidenceId)
                .deliveryPointCode("EDU-01")
                .sectorId("EDUCATION")
                .layer(1)
                .ruleId("RULE-REFERRAL-001")
                .flagCode("FLAG_TOUCHPOINT_DISCONTINUITY")
                .severity("HIGH")
                .title("Referral Register Gap")
                .description("No screening register maintained.")
                .status("ACTIVE")
                .build();
    }

    @Test
    @DisplayName("Priority Formula: Urgency 5 x Reach 5 = 25 (VERY_HIGH band)")
    void priorityCalculationVeryHigh() {
        when(flagRepository.findById(verifiedFlag.getId())).thenReturn(Optional.of(verifiedFlag));
        when(evidenceRepository.findById(verifiedEvidence.getId())).thenReturn(Optional.of(verifiedEvidence));
        when(priorityRepository.findByFlagEvaluationId(verifiedFlag.getId())).thenReturn(Optional.empty());
        when(priorityRepository.save(any(PriorityActionItem.class))).thenAnswer(i -> i.getArgument(0));

        PriorityActionItem item = priorityService.assignPriority(
                verifiedFlag.getId(),
                5, // Urgency
                5, // Reach
                1, // Feasibility (Hard - Capital infra)
                "District-wide referral gap requiring systemic DEO order",
                decisionOwner
        );

        assertNotNull(item);
        assertEquals(25, item.getPriorityScore());
        assertEquals("VERY_HIGH", item.getPriorityBand());
        // Critical AEHT Check: Feasibility = 1 does NOT alter or dilute the score of 25
        assertEquals(1, item.getFeasibility());
        assertEquals("Policy / Capital Infrastructure Requirement", item.getFeasibilityLabel());
    }

    @Test
    @DisplayName("Priority Formula: Urgency 4 x Reach 3 = 12 (HIGH band)")
    void priorityCalculationHigh() {
        when(flagRepository.findById(verifiedFlag.getId())).thenReturn(Optional.of(verifiedFlag));
        when(evidenceRepository.findById(verifiedEvidence.getId())).thenReturn(Optional.of(verifiedEvidence));
        when(priorityRepository.findByFlagEvaluationId(verifiedFlag.getId())).thenReturn(Optional.empty());
        when(priorityRepository.save(any(PriorityActionItem.class))).thenAnswer(i -> i.getArgument(0));

        PriorityActionItem item = priorityService.assignPriority(
                verifiedFlag.getId(),
                4, // Urgency
                3, // Reach
                4, // Feasibility
                "Inter-school screening delay requiring circular",
                decisionOwner
        );

        assertEquals(12, item.getPriorityScore());
        assertEquals("HIGH", item.getPriorityBand());
    }

    @Test
    @DisplayName("AEHT Invariant: Unverified gap REJECTS priority scoring")
    void rejectUnverifiedGapFromPriorityScoring() {
        FlagEvaluation unverifiedFlag = FlagEvaluation.builder()
                .id(UUID.randomUUID())
                .evidenceId(unverifiedEvidence.getId())
                .build();

        when(flagRepository.findById(unverifiedFlag.getId())).thenReturn(Optional.of(unverifiedFlag));
        when(evidenceRepository.findById(unverifiedEvidence.getId())).thenReturn(Optional.of(unverifiedEvidence));

        IllegalStateException ex = assertThrows(IllegalStateException.class, () ->
                priorityService.assignPriority(
                        unverifiedFlag.getId(),
                        5,
                        5,
                        5,
                        "Attempting to prioritize unverified evidence",
                        decisionOwner
                )
        );

        assertTrue(ex.getMessage().contains("Unverified gap cannot receive official administrative priority rating"));
        verify(priorityRepository, never()).save(any());
    }

    @Test
    @DisplayName("Validation: Urgency outside 1-5 throws IllegalArgumentException")
    void urgencyOutOfRangeThrowsException() {
        assertThrows(IllegalArgumentException.class, () ->
                priorityService.assignPriority(
                        verifiedFlag.getId(),
                        6, // Out of range (>5)
                        3,
                        3,
                        "Invalid urgency value",
                        decisionOwner
                )
        );
    }

    @Test
    @DisplayName("Statutory Disclaimer: Constant contains mandatory AEHT §15 notice")
    void statutoryDisclaimerPresentsLegalNotice() {
        String disclaimer = PriorityFrameworkService.STATUTORY_PLANNING_DISCLAIMER;
        assertTrue(disclaimer.contains("AEHT §15"));
        assertTrue(disclaimer.contains("not constitute an expenditure sanction"));
    }
}
