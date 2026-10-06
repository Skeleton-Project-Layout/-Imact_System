package org.aeht.abhisaran.governance;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aeht.abhisaran.model.Evidence;
import org.aeht.abhisaran.model.FactualCorrection;
import org.aeht.abhisaran.model.User;
import org.aeht.abhisaran.repository.EvidenceRepository;
import org.aeht.abhisaran.repository.FactualCorrectionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class FactualCorrectionService {

    private final FactualCorrectionRepository correctionRepository;
    private final EvidenceRepository evidenceRepository;

    public List<FactualCorrection> getAllCorrections() {
        return correctionRepository.findAllByOrderBySubmittedAtDesc();
    }

    public List<FactualCorrection> getCorrectionsForDeliveryPoint(String dpCode) {
        return correctionRepository.findByDeliveryPointCodeOrderBySubmittedAtDesc(dpCode);
    }

    @Transactional
    public FactualCorrection submitCorrection(
            String deliveryPointCode,
            UUID evidenceId,
            String metricTarget,
            String originalValue,
            String correctedValue,
            String justification,
            String submittedBy
    ) {
        if (deliveryPointCode == null || deliveryPointCode.isBlank()) {
            throw new IllegalArgumentException("Delivery point code is required");
        }
        if (metricTarget == null || metricTarget.isBlank()) {
            throw new IllegalArgumentException("Metric target is required");
        }
        if (originalValue == null || originalValue.isBlank()) {
            throw new IllegalArgumentException("Original value must be preserved and cannot be empty");
        }
        if (correctedValue == null || correctedValue.isBlank()) {
            throw new IllegalArgumentException("Corrected value is required");
        }
        if (justification == null || justification.isBlank()) {
            throw new IllegalArgumentException("Justification is required for factual correction");
        }

        FactualCorrection correction = FactualCorrection.builder()
                .deliveryPointCode(deliveryPointCode)
                .evidenceId(evidenceId)
                .metricTarget(metricTarget)
                .originalValue(originalValue) // Preserved permanently
                .correctedValue(correctedValue)
                .justification(justification)
                .status("SUBMITTED")
                .submittedBy(submittedBy != null ? submittedBy : "institution_head")
                .submittedAt(Instant.now())
                .build();

        log.info("Submitted factual correction for {} on metric target {}", deliveryPointCode, metricTarget);
        return correctionRepository.save(correction);
    }

    @Transactional
    public FactualCorrection validateCorrection(
            UUID correctionId,
            boolean approve,
            String decisionNotes,
            User validator
    ) {
        if (validator == null || validator.getRole() == null) {
            throw new SecurityException("Authentication required to validate factual corrections");
        }

        String role = validator.getRole().getId();
        // RBAC §11: DISTRICT_NODAL_OFFICER validates factual corrections (or DISTRICT_MAGISTRATE oversight)
        if (!"DISTRICT_NODAL_OFFICER".equals(role) && !"DISTRICT_MAGISTRATE".equals(role)) {
            throw new SecurityException("Only District Nodal Officer or District Magistrate is authorized to validate factual corrections");
        }

        FactualCorrection correction = correctionRepository.findById(correctionId)
                .orElseThrow(() -> new IllegalArgumentException("Correction not found with ID: " + correctionId));

        Instant now = Instant.now();
        correction.setStatus(approve ? "VALIDATED" : "REJECTED");
        correction.setValidatedBy(validator.getUsername());
        correction.setValidatedAt(now);
        correction.setDecisionNotes(decisionNotes);

        // AEHT §5: "Only VERIFIED and CORRECTED count as supporting evidence"
        if (approve && correction.getEvidenceId() != null) {
            evidenceRepository.findById(correction.getEvidenceId()).ifPresent(evidence -> {
                evidence.setVerificationStatus("CORRECTED");
                evidence.setUpdatedAt(now);
                evidenceRepository.save(evidence);
                log.info("Linked evidence {} status transitioned to CORRECTED following DNO validation", evidence.getId());
            });
        }

        log.info("Factual correction {} validated by {} (approved={})", correctionId, validator.getUsername(), approve);
        return correctionRepository.save(correction);
    }
}
