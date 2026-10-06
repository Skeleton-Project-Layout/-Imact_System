package org.aeht.abhisaran.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "privacy_incidents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrivacyIncident {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "delivery_point_id")
    private UUID deliveryPointId;

    @Column(name = "delivery_point_code", length = 20)
    private String deliveryPointCode;

    /**
     * 5-State Finite State Machine (AEHT §8.1 / §13):
     * DETECTED -> CONTAINED -> NODAL_NOTIFIED -> DISTRICT_DIRECTED -> CLOSED
     */
    @Column(nullable = false, length = 50)
    @Builder.Default
    private String status = "DETECTED";

    @Column(name = "detection_source", nullable = false, length = 100)
    private String detectionSource; // 'OCR_SCANNER', 'FIELD_VALIDATION', 'SERVER_VALIDATION'

    @Column(name = "detected_at")
    @Builder.Default
    private Instant detectedAt = Instant.now();

    @Column(name = "contained_at")
    private Instant containedAt;

    @Column(name = "nodal_notified_at")
    private Instant nodalNotifiedAt;

    @Column(name = "district_directed_at")
    private Instant districtDirectedAt;

    @Column(name = "closed_at")
    private Instant closedAt;

    @Column(name = "non_identifying_description", columnDefinition = "TEXT", nullable = false)
    private String nonIdentifyingDescription;

    @Column(name = "containment_action", columnDefinition = "TEXT", nullable = false)
    private String containmentAction;

    @Column(name = "district_direction_notes", columnDefinition = "TEXT")
    private String districtDirectionNotes;

    @Column(name = "closing_justification", columnDefinition = "TEXT")
    private String closingJustification;

    /**
     * AEHT §8.1 / §13: 2-hour notification clock (120 minutes) to notify District Nodal Officer.
     */
    public boolean isOverdue() {
        if (nodalNotifiedAt != null) {
            return false;
        }
        if (detectedAt == null) {
            return false;
        }
        return Duration.between(detectedAt, Instant.now()).toMinutes() > 120;
    }

    public long getMinutesRemainingUntilOverdue() {
        if (nodalNotifiedAt != null) {
            return 0;
        }
        if (detectedAt == null) {
            return 120;
        }
        long elapsed = Duration.between(detectedAt, Instant.now()).toMinutes();
        return Math.max(0, 120 - elapsed);
    }
}
