package org.aeht.abhisaran.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "reviewer_declarations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewerDeclaration {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "reviewer_name", nullable = false, length = 100)
    private String reviewerName;

    @Column(nullable = false, length = 100)
    private String designation;

    @Column(nullable = false, length = 100)
    private String organization;

    @Column(name = "area_of_expertise", nullable = false, length = 150)
    private String areaOfExpertise;

    /**
     * AEHT §8.3 COI Check: No reporting line to field team.
     */
    @Column(name = "no_reporting_line_to_field_team", nullable = false)
    private Boolean noReportingLineToFieldTeam;

    /**
     * AEHT §8.3 COI Check: Not an AEHT employee, board member, donor, or paid consultant now or in prior 3 years.
     */
    @Column(name = "not_aeht_employee_or_board_3_years", nullable = false)
    private Boolean notAehtEmployeeOrBoard3Years;

    /**
     * AEHT §8.3 Confidentiality Agreement.
     */
    @Column(name = "confidentiality_agreed", nullable = false)
    private Boolean confidentialityAgreed;

    @Column(name = "district_approval_status", nullable = false, length = 50)
    @Builder.Default
    private String districtApprovalStatus = "ACCEPTED"; // 'PENDING', 'ACCEPTED', 'ALTERNATIVE_PROPOSED', 'VETOED'

    @Column(name = "district_decision_by", length = 100)
    private String districtDecisionBy;

    @Column(name = "district_decision_notes", columnDefinition = "TEXT")
    private String districtDecisionNotes;

    /**
     * AEHT §8.3: Review note must record limitations and disagreements, not just endorsement.
     */
    @Column(name = "methodology_limitation_notes", columnDefinition = "TEXT", nullable = false)
    private String methodologyLimitationNotes;

    @Column(name = "disagreements_logged", columnDefinition = "TEXT")
    private String disagreementsLogged;

    @Column(columnDefinition = "TEXT")
    private String recommendations;

    @Column(name = "endorsement_status", nullable = false, length = 50)
    @Builder.Default
    private String endorsementStatus = "ENDORSED_WITH_LIMITATIONS";

    @Column(name = "submitted_at")
    @Builder.Default
    private Instant submittedAt = Instant.now();
}
