package org.aeht.abhisaran.model;

import jakarta.persistence.*;
import lombok.*;
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

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String status = "DETECTED"; // DETECTED, CONTAINED, NODAL_NOTIFIED, CLOSED

    @Column(name = "detection_source", nullable = false, length = 100)
    private String detectionSource; // 'OCR_SCANNER', 'FIELD_VALIDATION', 'SERVER_VALIDATION'

    @Column(name = "detected_at")
    @Builder.Default
    private Instant detectedAt = Instant.now();

    @Column(name = "nodal_notified_at")
    private Instant nodalNotifiedAt;

    @Column(name = "contained_at")
    private Instant containedAt;

    @Column(name = "closed_at")
    private Instant closedAt;

    @Column(name = "non_identifying_description", columnDefinition = "TEXT", nullable = false)
    private String nonIdentifyingDescription;

    @Column(name = "containment_action", columnDefinition = "TEXT", nullable = false)
    private String containmentAction;
}
