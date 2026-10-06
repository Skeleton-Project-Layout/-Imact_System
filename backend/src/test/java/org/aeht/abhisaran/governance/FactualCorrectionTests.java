package org.aeht.abhisaran.governance;

import org.aeht.abhisaran.model.Evidence;
import org.aeht.abhisaran.model.FactualCorrection;
import org.aeht.abhisaran.model.Role;
import org.aeht.abhisaran.model.User;
import org.aeht.abhisaran.repository.EvidenceRepository;
import org.aeht.abhisaran.repository.FactualCorrectionRepository;
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
public class FactualCorrectionTests {

    @Mock
    private FactualCorrectionRepository correctionRepository;

    @Mock
    private EvidenceRepository evidenceRepository;

    @InjectMocks
    private FactualCorrectionService correctionService;

    private User nodalOfficer;
    private User fieldWorker;
    private Evidence sampleEvidence;

    @BeforeEach
    void setUp() {
        nodalOfficer = User.builder()
                .id(UUID.randomUUID())
                .username("nodal_officer")
                .role(Role.builder().id("DISTRICT_NODAL_OFFICER").description("District Coordinator").build())
                .build();

        fieldWorker = User.builder()
                .id(UUID.randomUUID())
                .username("field_lead")
                .role(Role.builder().id("ARYABHATA_FIELD_TEAM").description("Field Collector").build())
                .build();

        sampleEvidence = Evidence.builder()
                .id(UUID.randomUUID())
                .deliveryPointCode("EDU-01")
                .verificationStatus("NOT_VERIFIED")
                .build();
    }

    @Test
    @DisplayName("GOVN-02: Factual correction submission preserves original value immutably")
    void testSubmitCorrection_PreservesOriginalValue() {
        when(correctionRepository.save(any(FactualCorrection.class))).thenAnswer(i -> i.getArgument(0));

        FactualCorrection correction = correctionService.submitCorrection(
                "EDU-01",
                sampleEvidence.getId(),
                "DOCUMENTED_REFERRAL",
                "Original: Physical register not produced in principal room",
                "Corrected: Register produced from secure almirah (18 entries)",
                "Physical RBSK slips located in secure almirah during exit briefing",
                "institution_head"
        );

        assertNotNull(correction);
        assertEquals("Original: Physical register not produced in principal room", correction.getOriginalValue());
        assertEquals("Corrected: Register produced from secure almirah (18 entries)", correction.getCorrectedValue());
        assertEquals("SUBMITTED", correction.getStatus());
        assertEquals("institution_head", correction.getSubmittedBy());
    }

    @Test
    @DisplayName("GOVN-02: Factual correction without justification is rejected")
    void testSubmitCorrection_MissingJustification_ThrowsException() {
        assertThrows(IllegalArgumentException.class, () ->
                correctionService.submitCorrection(
                        "EDU-01",
                        null,
                        "TIMELINESS",
                        "Original val",
                        "Corrected val",
                        "",
                        "headmaster"
                )
        );
    }

    @Test
    @DisplayName("GOVN-02: DNO validation approves correction and transitions linked evidence to CORRECTED")
    void testValidateCorrection_Approved_TransitionsEvidenceToCorrected() {
        UUID correctionId = UUID.randomUUID();
        FactualCorrection correction = FactualCorrection.builder()
                .id(correctionId)
                .deliveryPointCode("EDU-01")
                .evidenceId(sampleEvidence.getId())
                .originalValue("Old value")
                .correctedValue("New verified value")
                .status("SUBMITTED")
                .build();

        when(correctionRepository.findById(correctionId)).thenReturn(Optional.of(correction));
        when(correctionRepository.save(any(FactualCorrection.class))).thenAnswer(i -> i.getArgument(0));
        when(evidenceRepository.findById(sampleEvidence.getId())).thenReturn(Optional.of(sampleEvidence));
        when(evidenceRepository.save(any(Evidence.class))).thenAnswer(i -> i.getArgument(0));

        FactualCorrection result = correctionService.validateCorrection(
                correctionId,
                true,
                "Approved after reviewing physical counterfoils without PII",
                nodalOfficer
        );

        assertEquals("VALIDATED", result.getStatus());
        assertEquals("nodal_officer", result.getValidatedBy());
        assertNotNull(result.getValidatedAt());

        // AEHT §5: Verified or Corrected counts as supporting evidence
        assertEquals("CORRECTED", sampleEvidence.getVerificationStatus());
        verify(evidenceRepository).save(sampleEvidence);
    }

    @Test
    @DisplayName("GOVN-02: Unauthorized role is denied validation authority (RBAC §11)")
    void testValidateCorrection_UnauthorizedRole_ThrowsSecurityException() {
        UUID correctionId = UUID.randomUUID();

        SecurityException ex = assertThrows(SecurityException.class, () ->
                correctionService.validateCorrection(
                        correctionId,
                        true,
                        "Unauthorized attempt",
                        fieldWorker
                )
        );

        assertTrue(ex.getMessage().contains("Only District Nodal Officer or District Magistrate is authorized"));
    }
}
