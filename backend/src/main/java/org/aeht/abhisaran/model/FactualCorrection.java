package org.aeht.abhisaran.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "factual_corrections")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FactualCorrection {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "delivery_point_code", nullable = false, length = 20)
    private String deliveryPointCode;

    @Column(name = "evidence_id")
    private UUID evidenceId;

    @Column(name = "metric_target", nullable = false, length = 100)
    private String metricTarget;

    /**
     * Absolute AEHT §14.1 principle: Original value is permanently retained and never overwritten.
     */
    @Column(name = "original_value", columnDefinition = "TEXT", nullable = false)
    private String originalValue;

    @Column(name = "corrected_value", columnDefinition = "TEXT", nullable = false)
    private String correctedValue;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String justification;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String status = "SUBMITTED"; // 'SUBMITTED', 'VALIDATED', 'REJECTED'

    @Column(name = "submitted_by", nullable = false, length = 100)
    private String submittedBy;

    @Column(name = "submitted_at")
    @Builder.Default
    private Instant submittedAt = Instant.now();

    @Column(name = "validated_by", length = 100)
    private String validatedBy;

    @Column(name = "validated_at")
    private Instant validatedAt;

    @Column(name = "decision_notes", columnDefinition = "TEXT")
    private String decisionNotes;
}
