package org.aeht.abhisaran.evidence;

import org.aeht.abhisaran.model.Evidence;
import org.aeht.abhisaran.model.EvidenceVerificationHistory;
import org.aeht.abhisaran.model.PrivacyIncident;
import org.aeht.abhisaran.model.Role;
import org.aeht.abhisaran.model.User;
import org.aeht.abhisaran.repository.EvidenceRepository;
import org.aeht.abhisaran.repository.EvidenceVerificationHistoryRepository;
import org.aeht.abhisaran.repository.PrivacyIncidentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EvidenceVerificationTests {

    @Mock
    private EvidenceRepository evidenceRepository;

    @Mock
    private EvidenceVerificationHistoryRepository historyRepository;

    @Mock
    private PrivacyIncidentRepository privacyIncidentRepository;

    @InjectMocks
    private EvidenceService evidenceService;

    private User reviewerUser;
    private Evidence sampleEvidence;

    @BeforeEach
    void setUp() {
        reviewerUser = User.builder()
                .id(UUID.randomUUID())
                .username("reviewer_test")
                .role(Role.builder().id("INDEPENDENT_REVIEWER").description("Methodology Assurance").build())
                .build();

        sampleEvidence = Evidence.builder()
                .id(UUID.randomUUID())
                .deliveryPointCode("EDU-01")
                .sectorId("EDUCATION")
                .layer(1)
                .questionNumber(1)
                .convergenceQuestion("Q1")
                .resultingRuleId("RULE-REFERRAL-001")
                .sourceType("REGISTER_EXTRACT")
                .selectedOption("COMPLETE_REGISTER")
                .verificationStatus("PENDING_REVIEW")
                .description("Official register index copy without names")
                .build();
    }

    @Test
    @DisplayName("Zero-PII Screening: Intercepts 12-digit Aadhaar number and creates PrivacyIncident")
    void interceptAadhaarPiiAndCreateIncident() {
        Evidence piiEvidence = Evidence.builder()
                .deliveryPointCode("EDU-01")
                .sectorId("EDUCATION")
                .layer(1)
                .questionNumber(1)
                .convergenceQuestion("Q1")
                .resultingRuleId("RULE-REFERRAL-001")
                .sourceType("REGISTER_EXTRACT")
                .selectedOption("COMPLETE_REGISTER")
                .description("Extracted record for student with Aadhaar 987654321098")
                .build();

        assertThrows(SecurityException.class, () -> evidenceService.submitEvidence(piiEvidence, reviewerUser));

        ArgumentCaptor<PrivacyIncident> captor = ArgumentCaptor.forClass(PrivacyIncident.class);
        verify(privacyIncidentRepository, times(1)).save(captor.capture());
        assertEquals("DETECTED", captor.getValue().getStatus());
        assertEquals("SERVER_VALIDATION", captor.getValue().getDetectionSource());
        verify(evidenceRepository, never()).save(piiEvidence);
    }

    @Test
    @DisplayName("Zero-PII Screening: Intercepts 10-digit phone number and quarantines")
    void interceptPhonePiiAndQuarantine() {
        Evidence piiEvidence = Evidence.builder()
                .deliveryPointCode("HLT-01")
                .sectorId("HEALTH_RBSK")
                .layer(2)
                .questionNumber(2)
                .convergenceQuestion("Q2")
                .resultingRuleId("RULE-READINESS-002")
                .sourceType("PROCESS_DOCUMENT")
                .selectedOption("FUNCTIONAL")
                .description("Contact Nodal Medical Officer at 9876543210 directly")
                .build();

        assertThrows(SecurityException.class, () -> evidenceService.submitEvidence(piiEvidence, reviewerUser));
        verify(privacyIncidentRepository, times(1)).save(any(PrivacyIncident.class));
        verify(evidenceRepository, never()).save(piiEvidence);
    }

    @Test
    @DisplayName("Valid evidence submission without PII sets PENDING_REVIEW status")
    void cleanEvidenceSubmitsWithPendingReview() {
        when(evidenceRepository.save(any(Evidence.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Evidence saved = evidenceService.submitEvidence(sampleEvidence, reviewerUser);

        assertNotNull(saved);
        assertEquals("PENDING_REVIEW", saved.getVerificationStatus());
        verify(privacyIncidentRepository, never()).save(any(PrivacyIncident.class));
        verify(evidenceRepository, times(1)).save(sampleEvidence);
    }

    @Test
    @DisplayName("State Machine: PENDING_REVIEW -> VERIFIED transition succeeds and audits history")
    void validPendingToVerifiedTransition() {
        when(evidenceRepository.findById(sampleEvidence.getId())).thenReturn(Optional.of(sampleEvidence));
        when(evidenceRepository.save(any(Evidence.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Evidence result = evidenceService.transitionVerification(
                sampleEvidence.getId(),
                "VERIFIED",
                "Cross-referenced against facility physical ledger during block inspection.",
                reviewerUser
        );

        assertEquals("VERIFIED", result.getVerificationStatus());

        ArgumentCaptor<EvidenceVerificationHistory> historyCaptor = ArgumentCaptor.forClass(EvidenceVerificationHistory.class);
        verify(historyRepository, times(1)).save(historyCaptor.capture());
        EvidenceVerificationHistory recorded = historyCaptor.getValue();
        assertEquals("PENDING_REVIEW", recorded.getPreviousStatus());
        assertEquals("VERIFIED", recorded.getNewStatus());
        assertEquals("INDEPENDENT_REVIEWER", recorded.getVerifierRole());
        assertTrue(recorded.getJustificationReason().contains("facility physical ledger"));
    }

    @Test
    @DisplayName("State Machine: Invalid transition (REJECTED -> VERIFIED) throws IllegalStateException")
    void invalidStateTransitionThrowsException() {
        sampleEvidence.setVerificationStatus("REJECTED");
        when(evidenceRepository.findById(sampleEvidence.getId())).thenReturn(Optional.of(sampleEvidence));

        IllegalStateException ex = assertThrows(IllegalStateException.class, () ->
                evidenceService.transitionVerification(
                        sampleEvidence.getId(),
                        "VERIFIED",
                        "Trying to verify a rejected evidence directly",
                        reviewerUser
                )
        );

        assertTrue(ex.getMessage().contains("cannot move from REJECTED to VERIFIED"));
        verify(historyRepository, never()).save(any());
    }

    @Test
    @DisplayName("State Machine: Missing or short justification reason throws IllegalArgumentException")
    void transitionWithoutJustificationFails() {
        when(evidenceRepository.findById(sampleEvidence.getId())).thenReturn(Optional.of(sampleEvidence));

        assertThrows(IllegalArgumentException.class, () ->
                evidenceService.transitionVerification(
                        sampleEvidence.getId(),
                        "VERIFIED",
                        "ok", // Too short (< 5 chars)
                        reviewerUser
                )
        );
    }
}
