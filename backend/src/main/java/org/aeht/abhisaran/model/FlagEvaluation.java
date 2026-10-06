package org.aeht.abhisaran.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "flag_evaluations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlagEvaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "evidence_id", nullable = false)
    private UUID evidenceId;

    @Column(name = "delivery_point_code", nullable = false, length = 20)
    private String deliveryPointCode;

    @Column(name = "sector_id", nullable = false, length = 50)
    private String sectorId;

    @Column(nullable = false)
    private Integer layer;

    @Column(name = "rule_id", nullable = false, length = 50)
    private String ruleId;

    @Column(name = "rule_version", nullable = false)
    @Builder.Default
    private Integer ruleVersion = 1;

    @Column(name = "flag_code", nullable = false, length = 100)
    private String flagCode;

    @Column(nullable = false, length = 20)
    private String severity; // 'HIGH', 'MEDIUM', 'LOW', 'INFO'

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "recommended_action_id")
    private ActionDefinition recommendedAction;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String status = "ACTIVE"; // 'ACTIVE', 'IN_PROGRESS', 'RESOLVED'

    @Column(name = "evaluated_at")
    @Builder.Default
    private Instant evaluatedAt = Instant.now();
}
