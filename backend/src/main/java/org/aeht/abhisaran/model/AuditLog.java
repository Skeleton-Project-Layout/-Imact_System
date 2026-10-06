package org.aeht.abhisaran.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "user_role", nullable = false, length = 50)
    private String userRole;

    @Column(nullable = false, length = 100)
    private String action; // e.g. 'EVIDENCE_VERIFIED', 'SCORE_REBASED', 'PRIORITY_ASSIGNED', 'CORRECTION_VALIDATED', 'INCIDENT_CLOSED', 'PURGE_EXECUTED'

    @Column(name = "entity_name", nullable = false, length = 100)
    private String entityName;

    @Column(name = "entity_id", nullable = false, length = 100)
    private String entityId;

    @Column(name = "previous_state", columnDefinition = "TEXT")
    private String previousState;

    @Column(name = "new_state", columnDefinition = "TEXT")
    private String newState;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String reason;

    @Column(name = "rule_version", length = 50)
    private String ruleVersion;

    @Column(nullable = false)
    @Builder.Default
    private Instant timestamp = Instant.now();
}
