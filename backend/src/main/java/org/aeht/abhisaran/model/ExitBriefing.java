package org.aeht.abhisaran.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "exit_briefings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExitBriefing {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "delivery_point_code", nullable = false, length = 20)
    private String deliveryPointCode;

    @Column(name = "briefing_date", nullable = false)
    @Builder.Default
    private Instant briefingDate = Instant.now();

    @Column(name = "conducted_by", nullable = false, length = 100)
    private String conductedBy;

    @Column(name = "institution_head_designation", nullable = false, length = 100)
    private String institutionHeadDesignation;

    @Column(nullable = false, length = 50)
    private String status; // 'ACKNOWLEDGED', 'SHARED_UNSIGNED', 'REFUSED_NON_ADVERSE'

    @Column(name = "acknowledgement_text", columnDefinition = "TEXT")
    private String acknowledgementText;

    @Column(name = "refusal_reason", columnDefinition = "TEXT")
    private String refusalReason;

    /**
     * Absolute AEHT §14.1 principle: An unsigned briefing or refusal is NEVER adverse evidence
     * and never affects ACS scoring, component ratings, or counts as a dispute.
     */
    @Column(name = "non_adverse_declaration", nullable = false)
    @Builder.Default
    private Boolean nonAdverseDeclaration = true;

    @Column(name = "factual_discrepancies_notes", columnDefinition = "TEXT")
    private String factualDiscrepanciesNotes;

    @Column(name = "material_corrections_logged", nullable = false)
    @Builder.Default
    private Boolean materialCorrectionsLogged = false;

    @Column(name = "correction_window_closes_at")
    private Instant correctionWindowClosesAt;

    @Column(nullable = false)
    @Builder.Default
    private Boolean finalized = false;

    @Column(name = "created_at")
    @Builder.Default
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    @Builder.Default
    private Instant updatedAt = Instant.now();
}
