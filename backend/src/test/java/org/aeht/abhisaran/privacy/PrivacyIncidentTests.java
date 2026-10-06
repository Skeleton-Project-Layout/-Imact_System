package org.aeht.abhisaran.privacy;

import org.aeht.abhisaran.model.PrivacyIncident;
import org.aeht.abhisaran.repository.PrivacyIncidentRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PrivacyIncidentTests {

    @Mock
    private PrivacyIncidentRepository privacyIncidentRepository;

    @InjectMocks
    private PrivacyIncidentService privacyIncidentService;

    @Test
    @DisplayName("SEC-01: Recording incident initiates 2-hour clock in DETECTED state")
    void testRecordIncident_Success() {
        when(privacyIncidentRepository.save(any(PrivacyIncident.class))).thenAnswer(i -> i.getArgument(0));

        PrivacyIncident incident = privacyIncidentService.recordIncident(
                "EDU-01",
                "OCR_SCANNER",
                "Field register photo contained unredacted parent contact column header",
                "Attachment deleted immediately; local cache cleared"
        );

        assertNotNull(incident);
        assertEquals("DETECTED", incident.getStatus());
        assertEquals("EDU-01", incident.getDeliveryPointCode());
        assertNotNull(incident.getDetectedAt());
        assertNull(incident.getNodalNotifiedAt());
        assertFalse(incident.isOverdue());
        assertTrue(incident.getMinutesRemainingUntilOverdue() > 115);
    }

    @Test
    @DisplayName("SEC-01: Suspected PII pattern in incident description is blocked")
    void testRecordIncident_BlocksPiiInDescription() {
        // Aadhaar number in description
        assertThrows(IllegalArgumentException.class, () ->
                privacyIncidentService.recordIncident(
                        "EDU-01",
                        "SERVER_VALIDATION",
                        "Student Aadhaar card 2345 6789 0123 was scanned",
                        "Quarantined"
                )
        );

        // Indian phone number in description
        assertThrows(IllegalArgumentException.class, () ->
                privacyIncidentService.recordIncident(
                        "EDU-01",
                        "SERVER_VALIDATION",
                        "Teacher phone 9876543210 visible on board",
                        "Quarantined"
                )
        );
    }

    @Test
    @DisplayName("SEC-01: 5-stage lifecycle DETECTED -> CONTAINED -> NODAL_NOTIFIED -> DISTRICT_DIRECTED -> CLOSED")
    void testFullIncidentLifecycle() {
        UUID id = UUID.randomUUID();
        PrivacyIncident incident = PrivacyIncident.builder()
                .id(id)
                .deliveryPointCode("EDU-01")
                .status("DETECTED")
                .detectedAt(Instant.now().minus(Duration.ofMinutes(10)))
                .build();

        when(privacyIncidentRepository.findById(id)).thenReturn(Optional.of(incident));
        when(privacyIncidentRepository.save(any(PrivacyIncident.class))).thenAnswer(i -> i.getArgument(0));

        // 1. Contain
        PrivacyIncident contained = privacyIncidentService.containIncident(id, "Securely shredded printout");
        assertEquals("CONTAINED", contained.getStatus());
        assertNotNull(contained.getContainedAt());

        // 2. Notify District Nodal Officer
        PrivacyIncident notified = privacyIncidentService.notifyNodalOfficer(id, "Notified via official encrypted SMS");
        assertEquals("NODAL_NOTIFIED", notified.getStatus());
        assertNotNull(notified.getNodalNotifiedAt());
        assertFalse(notified.isOverdue());

        // 3. District Direction
        PrivacyIncident directed = privacyIncidentService.recordDistrictDirection(id, "Purge camera memory card and issue warning");
        assertEquals("DISTRICT_DIRECTED", directed.getStatus());
        assertNotNull(directed.getDistrictDirectedAt());

        // 4. Closed
        PrivacyIncident closed = privacyIncidentService.closeIncident(id, "Memory card sanitized and verified by IT officer");
        assertEquals("CLOSED", closed.getStatus());
        assertNotNull(closed.getClosedAt());
    }

    @Test
    @DisplayName("SEC-01: Overdue detection triggers when notification exceeds 120 minutes")
    void testOverdueClockDetection() {
        PrivacyIncident incident = PrivacyIncident.builder()
                .id(UUID.randomUUID())
                .status("DETECTED")
                .detectedAt(Instant.now().minus(Duration.ofMinutes(135))) // 135 minutes ago
                .nodalNotifiedAt(null)
                .build();

        assertTrue(incident.isOverdue(), "Must flag as overdue after 120 minutes without nodal notification");
        assertEquals(0, incident.getMinutesRemainingUntilOverdue());
    }

    @Test
    @DisplayName("SEC-01: Illegal state transitions are rejected")
    void testIllegalStateTransitions_Rejected() {
        UUID id = UUID.randomUUID();
        PrivacyIncident incident = PrivacyIncident.builder()
                .id(id)
                .status("DETECTED")
                .build();

        when(privacyIncidentRepository.findById(id)).thenReturn(Optional.of(incident));

        // Cannot close directly from DETECTED
        assertThrows(IllegalStateException.class, () ->
                privacyIncidentService.closeIncident(id, "Premature closure")
        );

        // Cannot record district direction without nodal notification
        assertThrows(IllegalStateException.class, () ->
                privacyIncidentService.recordDistrictDirection(id, "premature direction")
        );
    }
}
