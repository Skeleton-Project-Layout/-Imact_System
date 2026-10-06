package org.aeht.abhisaran.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "priority_action_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PriorityActionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "flag_evaluation_id", nullable = false)
    private UUID flagEvaluationId;

    @Column(name = "delivery_point_code", nullable = false, length = 20)
    private String deliveryPointCode;

    @Column(nullable = false)
    private Integer urgency; // 1 to 5

    @Column(nullable = false)
    private Integer reach; // 1 to 5

    @Column(name = "priority_score", nullable = false)
    private Integer priorityScore; // urgency * reach (1 to 25)

    @Column(name = "priority_band", nullable = false, length = 20)
    private String priorityBand; // 'VERY_HIGH', 'HIGH', 'MEDIUM', 'LOW'

    @Column(nullable = false)
    private Integer feasibility; // 1 to 5 (independent flag, does not alter score)

    @Column(name = "feasibility_label", nullable = false, length = 50)
    private String feasibilityLabel;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String rationale;

    @Column(name = "decision_owner_id")
    private UUID decisionOwnerId;

    @Column(name = "decision_owner_role", nullable = false, length = 50)
    private String decisionOwnerRole;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String status = "PROPOSED";

    @Column(name = "assigned_at")
    @Builder.Default
    private Instant assignedAt = Instant.now();

    @Column(name = "updated_at")
    @Builder.Default
    private Instant updatedAt = Instant.now();
}
