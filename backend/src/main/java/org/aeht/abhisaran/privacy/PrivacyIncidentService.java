package org.aeht.abhisaran.privacy;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aeht.abhisaran.model.PrivacyIncident;
import org.aeht.abhisaran.repository.PrivacyIncidentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class PrivacyIncidentService {

    private final PrivacyIncidentRepository privacyIncidentRepository;

    // Zero-PII Regex safeguard: Incident records must NEVER themselves record raw PII (phones, 12-digit Aadhaar)
    private static final Pattern PHONE_PATTERN = Pattern.compile("\\b[6-9]\\d{9}\\b");
    private static final Pattern AADHAAR_PATTERN = Pattern.compile("\\b\\d{4}\\s?\\d{4}\\s?\\d{4}\\b");

    public List<PrivacyIncident> getAllIncidents() {
        return privacyIncidentRepository.findAllByOrderByDetectedAtDesc();
    }

    public Optional<PrivacyIncident> getIncident(UUID id) {
        return privacyIncidentRepository.findById(id);
    }

    @Transactional
    public PrivacyIncident recordIncident(
            String deliveryPointCode,
            String detectionSource,
            String nonIdentifyingDescription,
            String containmentAction
    ) {
        if (nonIdentifyingDescription == null || nonIdentifyingDescription.isBlank()) {
            throw new IllegalArgumentException("Non-identifying description is required");
        }

        // Safeguard: Ensure no actual PII leaked into the incident description
        if (PHONE_PATTERN.matcher(nonIdentifyingDescription).find() || AADHAAR_PATTERN.matcher(nonIdentifyingDescription).find()) {
            throw new IllegalArgumentException("Privacy incident descriptions must be purely non-identifying and cannot contain telephone numbers or Aadhaar digits");
        }

        Instant now = Instant.now();
        PrivacyIncident incident = PrivacyIncident.builder()
                .deliveryPointCode(deliveryPointCode)
                .detectionSource(detectionSource != null ? detectionSource : "SERVER_VALIDATION")
                .nonIdentifyingDescription(nonIdentifyingDescription.trim())
                .containmentAction(containmentAction != null ? containmentAction.trim() : "Attachment quarantined; processing paused immediately.")
                .status("DETECTED")
                .detectedAt(now)
                .build();

        log.warn("PRIVACY INCIDENT DETECTED at delivery point {}. 2-hour notification clock started.", deliveryPointCode);
        return privacyIncidentRepository.save(incident);
    }

    @Transactional
    public PrivacyIncident containIncident(UUID incidentId, String updatedContainmentAction) {
        PrivacyIncident incident = privacyIncidentRepository.findById(incidentId)
                .orElseThrow(() -> new IllegalArgumentException("Privacy incident not found: " + incidentId));

        if (!"DETECTED".equals(incident.getStatus())) {
            throw new IllegalStateException("Only DETECTED incidents can transition to CONTAINED. Current state: " + incident.getStatus());
        }

        incident.setStatus("CONTAINED");
        incident.setContainedAt(Instant.now());
        if (updatedContainmentAction != null && !updatedContainmentAction.isBlank()) {
            incident.setContainmentAction(updatedContainmentAction.trim());
        }

        log.info("Privacy incident {} contained successfully.", incidentId);
        return privacyIncidentRepository.save(incident);
    }

    @Transactional
    public PrivacyIncident notifyNodalOfficer(UUID incidentId, String notificationNotes) {
        PrivacyIncident incident = privacyIncidentRepository.findById(incidentId)
                .orElseThrow(() -> new IllegalArgumentException("Privacy incident not found: " + incidentId));

        if (!"DETECTED".equals(incident.getStatus()) && !"CONTAINED".equals(incident.getStatus())) {
            throw new IllegalStateException("Incident must be DETECTED or CONTAINED to notify District Nodal Officer. Current: " + incident.getStatus());
        }

        incident.setStatus("NODAL_NOTIFIED");
        incident.setNodalNotifiedAt(Instant.now());

        log.info("District Nodal Officer notified for incident {}. Escalation clock stopped. Overdue: {}", incidentId, incident.isOverdue());
        return privacyIncidentRepository.save(incident);
    }

    @Transactional
    public PrivacyIncident recordDistrictDirection(UUID incidentId, String directionNotes) {
        PrivacyIncident incident = privacyIncidentRepository.findById(incidentId)
                .orElseThrow(() -> new IllegalArgumentException("Privacy incident not found: " + incidentId));

        if (!"NODAL_NOTIFIED".equals(incident.getStatus())) {
            throw new IllegalStateException("Incident must be in NODAL_NOTIFIED status before recording district direction. Current: " + incident.getStatus());
        }

        if (directionNotes == null || directionNotes.isBlank()) {
            throw new IllegalArgumentException("District direction notes cannot be empty");
        }

        incident.setStatus("DISTRICT_DIRECTED");
        incident.setDistrictDirectedAt(Instant.now());
        incident.setDistrictDirectionNotes(directionNotes.trim());

        log.info("District direction recorded for privacy incident {}.", incidentId);
        return privacyIncidentRepository.save(incident);
    }

    @Transactional
    public PrivacyIncident closeIncident(UUID incidentId, String closingJustification) {
        PrivacyIncident incident = privacyIncidentRepository.findById(incidentId)
                .orElseThrow(() -> new IllegalArgumentException("Privacy incident not found: " + incidentId));

        if (!"DISTRICT_DIRECTED".equals(incident.getStatus())) {
            throw new IllegalStateException("Incident must be DISTRICT_DIRECTED before final closure. Current: " + incident.getStatus());
        }

        if (closingJustification == null || closingJustification.isBlank()) {
            throw new IllegalArgumentException("Formal closing justification is required");
        }

        incident.setStatus("CLOSED");
        incident.setClosedAt(Instant.now());
        incident.setClosingJustification(closingJustification.trim());

        log.info("Privacy incident {} formally CLOSED under District direction.", incidentId);
        return privacyIncidentRepository.save(incident);
    }
}
