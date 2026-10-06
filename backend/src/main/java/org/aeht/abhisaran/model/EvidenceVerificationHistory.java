package org.aeht.abhisaran.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "evidence_verification_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvidenceVerificationHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "evidence_id", nullable = false)
    private UUID evidenceId;

    @Column(name = "verifier_id")
    private UUID verifierId;

    @Column(name = "verifier_role", nullable = false, length = 50)
    private String verifierRole;

    @Column(name = "previous_status", nullable = false, length = 50)
    private String previousStatus;

    @Column(name = "new_status", nullable = false, length = 50)
    private String newStatus;

    @Column(name = "justification_reason", columnDefinition = "TEXT", nullable = false)
    private String justificationReason;

    @Column(name = "timestamp", updatable = false)
    @Builder.Default
    private Instant timestamp = Instant.now();
}
