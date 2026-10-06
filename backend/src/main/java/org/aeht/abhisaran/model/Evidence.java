package org.aeht.abhisaran.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "evidence")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Evidence {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "delivery_point_code", nullable = false, length = 20)
    private String deliveryPointCode;

    @Column(name = "sector_id", nullable = false, length = 50)
    private String sectorId;

    @Column(nullable = false)
    private Integer layer;

    @Column(name = "question_number", nullable = false)
    private Integer questionNumber;

    @Column(name = "convergence_question", nullable = false, length = 10)
    private String convergenceQuestion;

    @Column(name = "resulting_rule_id", nullable = false, length = 50)
    private String resultingRuleId;

    @Column(name = "source_type", nullable = false, length = 50)
    private String sourceType; // 'FIELD_OBSERVATION', 'REGISTER_EXTRACT', 'WALL_DISPLAY', etc.

    @Column(name = "selected_option", nullable = false, length = 100)
    private String selectedOption;

    @Column(name = "sample_total")
    private Integer sampleTotal;

    @Column(name = "sample_compliant")
    private Integer sampleCompliant;

    @Column(name = "attachment_ref")
    private String attachmentRef;

    @Column(name = "document_kind", length = 100)
    private String documentKind;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "verification_status", nullable = false, length = 50)
    @Builder.Default
    private String verificationStatus = "PENDING_REVIEW"; // PENDING_REVIEW, VERIFIED, NOT_VERIFIED, REJECTED, CORRECTED

    @Column(name = "submitted_by")
    private UUID submittedBy;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    @Builder.Default
    private Instant updatedAt = Instant.now();
}
