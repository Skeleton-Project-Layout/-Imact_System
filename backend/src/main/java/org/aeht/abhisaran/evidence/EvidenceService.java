package org.aeht.abhisaran.evidence;

import lombok.RequiredArgsConstructor;
import org.aeht.abhisaran.model.Evidence;
import org.aeht.abhisaran.model.EvidenceVerificationHistory;
import org.aeht.abhisaran.model.PrivacyIncident;
import org.aeht.abhisaran.model.User;
import org.aeht.abhisaran.repository.EvidenceRepository;
import org.aeht.abhisaran.repository.EvidenceVerificationHistoryRepository;
import org.aeht.abhisaran.repository.PrivacyIncidentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class EvidenceService {

    private final EvidenceRepository evidenceRepository;
    private final EvidenceVerificationHistoryRepository historyRepository;
    private final PrivacyIncidentRepository privacyIncidentRepository;

    // Zero-PII Regex Patterns (Aadhaar 12-digit, Indian 10-digit mobile, Email)
    private static final Pattern AADHAAR_PATTERN = Pattern.compile("\\b\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}\\b|\\b\\d{12}\\b");
    private static final Pattern PHONE_PATTERN = Pattern.compile("\\b[6-9]\\d{9}\\b");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");

    // Allowed transition map for verification state machine
    private static final Map<String, Set<String>> VALID_TRANSITIONS = Map.of(
            "PENDING_REVIEW", Set.of("VERIFIED", "NOT_VERIFIED", "REJECTED"),
            "VERIFIED", Set.of("CORRECTED", "NOT_VERIFIED"),
            "NOT_VERIFIED", Set.of("VERIFIED", "REJECTED"),
            "REJECTED", Set.of("CORRECTED"),
            "CORRECTED", Set.of("VERIFIED", "NOT_VERIFIED")
    );

    @Transactional
    public Evidence submitEvidence(Evidence evidence, User submitter) {
        // 1. Mandatory Server-Side Zero-PII Screening
        String textToScan = String.join(" ",
                evidence.getDescription() != null ? evidence.getDescription() : "",
                evidence.getDocumentKind() != null ? evidence.getDocumentKind() : "",
                evidence.getAttachmentRef() != null ? evidence.getAttachmentRef() : "",
                evidence.getSelectedOption() != null ? evidence.getSelectedOption() : ""
        );

        if (detectPii(textToScan)) {
            // Quarantine & Trigger 2-Hour Privacy Incident Clock (AEHT Invariant)
            PrivacyIncident incident = PrivacyIncident.builder()
                    .status("DETECTED")
                    .detectionSource("SERVER_VALIDATION")
                    .detectedAt(Instant.now())
                    .nonIdentifyingDescription("Potential PII (12-digit UID, 10-digit Phone, or Email) detected in submitted text.")
                    .containmentAction("Submission quarantined immediately; rejected from persistence. 2-hr incident clock initiated.")
                    .build();
            privacyIncidentRepository.save(incident);

            throw new SecurityException("ZERO-PII VIOLATION: Potential personal identifier intercepted. Submission quarantined.");
        }

        if (submitter != null) {
            evidence.setSubmittedBy(submitter.getId());
        }
        evidence.setVerificationStatus("PENDING_REVIEW");
        evidence.setCreatedAt(Instant.now());
        evidence.setUpdatedAt(Instant.now());

        return evidenceRepository.save(evidence);
    }

    @Transactional
    public Evidence transitionVerification(UUID evidenceId, String targetStatus, String justification, User verifier) {
        Evidence evidence = evidenceRepository.findById(evidenceId)
                .orElseThrow(() -> new IllegalArgumentException("Evidence not found with id: " + evidenceId));

        String currentStatus = evidence.getVerificationStatus();

        if (justification == null || justification.trim().length() < 5) {
            throw new IllegalArgumentException("Audit justification reason of at least 5 characters is mandatory.");
        }

        Set<String> allowedNext = VALID_TRANSITIONS.getOrDefault(currentStatus, Collections.emptySet());
        if (!allowedNext.contains(targetStatus)) {
            throw new IllegalStateException(
                    String.format("Illegal verification state transition: cannot move from %s to %s", currentStatus, targetStatus)
            );
        }

        // Apply transition
        evidence.setVerificationStatus(targetStatus);
        evidence.setUpdatedAt(Instant.now());
        Evidence saved = evidenceRepository.save(evidence);

        // Append to immutable verification audit history
        EvidenceVerificationHistory history = EvidenceVerificationHistory.builder()
                .evidenceId(evidence.getId())
                .verifierId(verifier != null ? verifier.getId() : null)
                .verifierRole(verifier != null && verifier.getRole() != null ? verifier.getRole().getId() : "ANONYMOUS_VERIFIER")
                .previousStatus(currentStatus)
                .newStatus(targetStatus)
                .justificationReason(justification)
                .timestamp(Instant.now())
                .build();
        historyRepository.save(history);

        return saved;
    }

    public boolean detectPii(String content) {
        if (content == null || content.isBlank()) return false;
        return AADHAAR_PATTERN.matcher(content).find()
                || PHONE_PATTERN.matcher(content).find()
                || EMAIL_PATTERN.matcher(content).find();
    }

    public List<Evidence> getEvidenceByDeliveryPoint(String dpCode) {
        return evidenceRepository.findByDeliveryPointCode(dpCode);
    }

    public List<EvidenceVerificationHistory> getVerificationHistory(UUID evidenceId) {
        return historyRepository.findByEvidenceIdOrderByTimestampDesc(evidenceId);
    }

    public Optional<Evidence> getEvidenceById(UUID id) {
        return evidenceRepository.findById(id);
    }
}
