package org.aeht.abhisaran.governance;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aeht.abhisaran.model.ExitBriefing;
import org.aeht.abhisaran.repository.ExitBriefingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExitBriefingService {

    private final ExitBriefingRepository exitBriefingRepository;

    public List<ExitBriefing> getAllExitBriefings() {
        return exitBriefingRepository.findAllByOrderByBriefingDateDesc();
    }

    public Optional<ExitBriefing> getBriefingForDeliveryPoint(String deliveryPointCode) {
        return exitBriefingRepository.findFirstByDeliveryPointCodeOrderByBriefingDateDesc(deliveryPointCode);
    }

    @Transactional
    public ExitBriefing recordExitBriefing(
            String deliveryPointCode,
            String conductedBy,
            String institutionHeadDesignation,
            String status,
            String acknowledgementText,
            String refusalReason,
            String factualDiscrepanciesNotes,
            Boolean materialCorrectionsLogged
    ) {
        if (status == null || (!status.equals("ACKNOWLEDGED") && !status.equals("SHARED_UNSIGNED") && !status.equals("REFUSED_NON_ADVERSE"))) {
            throw new IllegalArgumentException("Invalid exit briefing status. Allowed: ACKNOWLEDGED, SHARED_UNSIGNED, REFUSED_NON_ADVERSE");
        }

        // AEHT §14.1: If unsigned or refused, record reason.
        if (("SHARED_UNSIGNED".equals(status) || "REFUSED_NON_ADVERSE".equals(status)) && (refusalReason == null || refusalReason.isBlank())) {
            throw new IllegalArgumentException("Refusal or unsigned reason must be explicitly recorded per AEHT §14.1");
        }

        String effectiveAck = acknowledgementText;
        if ("ACKNOWLEDGED".equals(status) && (effectiveAck == null || effectiveAck.isBlank())) {
            effectiveAck = "Factual Observations Shared";
        }

        Instant now = Instant.now();
        Instant windowClose = now.plus(Duration.ofHours(48));

        ExitBriefing briefing = ExitBriefing.builder()
                .deliveryPointCode(deliveryPointCode)
                .briefingDate(now)
                .conductedBy(conductedBy)
                .institutionHeadDesignation(institutionHeadDesignation)
                .status(status)
                .acknowledgementText(effectiveAck)
                .refusalReason(refusalReason)
                .nonAdverseDeclaration(true) // Guaranteed invariant: refusal is NEVER adverse evidence
                .factualDiscrepanciesNotes(factualDiscrepanciesNotes)
                .materialCorrectionsLogged(materialCorrectionsLogged != null ? materialCorrectionsLogged : false)
                .correctionWindowClosesAt(windowClose)
                .finalized(false)
                .createdAt(now)
                .updatedAt(now)
                .build();

        log.info("Recorded exit briefing for {} with status {} (Non-adverse invariant enforced)", deliveryPointCode, status);
        return exitBriefingRepository.save(briefing);
    }

    @Transactional
    public ExitBriefing finalizeExitBriefing(UUID briefingId) {
        ExitBriefing briefing = exitBriefingRepository.findById(briefingId)
                .orElseThrow(() -> new IllegalArgumentException("Exit briefing not found with ID: " + briefingId));

        briefing.setFinalized(true);
        briefing.setUpdatedAt(Instant.now());
        log.info("Finalized exit briefing for delivery point {}", briefing.getDeliveryPointCode());
        return exitBriefingRepository.save(briefing);
    }

    /**
     * Checks if a briefing is unsigned or refused, asserting the non-adverse invariant:
     * Unsigned or refused status cannot alter ACS scores or count as a dispute.
     */
    public boolean verifyNonAdverseSemantics(ExitBriefing briefing) {
        if ("SHARED_UNSIGNED".equals(briefing.getStatus()) || "REFUSED_NON_ADVERSE".equals(briefing.getStatus())) {
            // Must have nonAdverseDeclaration == true
            return Boolean.TRUE.equals(briefing.getNonAdverseDeclaration());
        }
        return true;
    }
}
