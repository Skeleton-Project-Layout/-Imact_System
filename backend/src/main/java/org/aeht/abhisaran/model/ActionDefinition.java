package org.aeht.abhisaran.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "action_definitions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActionDefinition {

    @Id
    @Column(name = "action_id", length = 50)
    private String actionId;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "responsible_system", nullable = false, length = 100)
    private String responsibleSystem;

    @Column(name = "escalation_condition", columnDefinition = "TEXT")
    private String escalationCondition;

    @Column(name = "indicative_timeline", length = 50)
    private String indicativeTimeline;

    @Column(name = "required_next_approval", length = 100)
    private String requiredNextApproval;
}
