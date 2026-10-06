package org.aeht.abhisaran.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "deletion_certificates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeletionCertificate {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "certificate_number", nullable = false, unique = true, length = 100)
    private String certificateNumber;

    @Column(name = "district_nodal_officer_name", nullable = false, length = 100)
    private String districtNodalOfficerName;

    @Column(name = "purged_by", nullable = false, length = 100)
    private String purgedBy;

    @Column(name = "purged_at", nullable = false)
    @Builder.Default
    private Instant purgedAt = Instant.now();

    @Column(name = "scope_description", columnDefinition = "TEXT", nullable = false)
    private String scopeDescription;

    @Column(name = "record_count", nullable = false)
    private Integer recordCount;

    @Column(name = "verification_hash", nullable = false, length = 255)
    private String verificationHash;

    @Column(name = "statutory_compliance_note", columnDefinition = "TEXT", nullable = false)
    private String statutoryComplianceNote;
}
