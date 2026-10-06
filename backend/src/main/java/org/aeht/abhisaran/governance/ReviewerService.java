package org.aeht.abhisaran.governance;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aeht.abhisaran.model.ReviewerDeclaration;
import org.aeht.abhisaran.repository.ReviewerDeclarationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewerService {

    private final ReviewerDeclarationRepository declarationRepository;

    public Optional<ReviewerDeclaration> getActiveDeclaration() {
        return declarationRepository.findFirstByOrderBySubmittedAtDesc();
    }

    public List<ReviewerDeclaration> getAllDeclarations() {
        return declarationRepository.findAllByOrderBySubmittedAtDesc();
    }

    @Transactional
    public ReviewerDeclaration submitDeclaration(
            String reviewerName,
            String designation,
            String organization,
            String areaOfExpertise,
            Boolean noReportingLineToFieldTeam,
            Boolean notAehtEmployeeOrBoard3Years,
            Boolean confidentialityAgreed,
            String methodologyLimitationNotes,
            String disagreementsLogged,
            String recommendations,
            String endorsementStatus
    ) {
        // AEHT §8.3 Conflict of Interest (COI) Invariants
        if (!Boolean.TRUE.equals(noReportingLineToFieldTeam)) {
            throw new IllegalStateException("COI Violation: Independent reviewer must have no reporting line to the field team.");
        }
        if (!Boolean.TRUE.equals(notAehtEmployeeOrBoard3Years)) {
            throw new IllegalStateException("COI Violation: Independent reviewer must not be an AEHT employee, board member, donor, or paid consultant now or in prior 3 years.");
        }
        if (!Boolean.TRUE.equals(confidentialityAgreed)) {
            throw new IllegalStateException("Confidentiality agreement is mandatory for Independent Reviewer accession.");
        }

        // AEHT §8.3: "Review note must record limitations and disagreements, not just endorsement."
        if (methodologyLimitationNotes == null || methodologyLimitationNotes.trim().length() < 10) {
            throw new IllegalArgumentException("Methodology limitation notes must be recorded per AEHT §8.3 (blanket endorsements without stated limitations are prohibited).");
        }

        String status = (endorsementStatus != null && !endorsementStatus.isBlank())
                ? endorsementStatus
                : "ENDORSED_WITH_LIMITATIONS";

        ReviewerDeclaration declaration = ReviewerDeclaration.builder()
                .reviewerName(reviewerName)
                .designation(designation)
                .organization(organization)
                .areaOfExpertise(areaOfExpertise)
                .noReportingLineToFieldTeam(true)
                .notAehtEmployeeOrBoard3Years(true)
                .confidentialityAgreed(true)
                .districtApprovalStatus("PENDING")
                .methodologyLimitationNotes(methodologyLimitationNotes.trim())
                .disagreementsLogged(disagreementsLogged)
                .recommendations(recommendations)
                .endorsementStatus(status)
                .submittedAt(Instant.now())
                .build();

        log.info("Registered Independent Reviewer declaration for {} with limitation notes recorded", reviewerName);
        return declarationRepository.save(declaration);
    }

    @Transactional
    public ReviewerDeclaration recordDistrictDecision(
            UUID declarationId,
            String decision, // 'ACCEPTED', 'ALTERNATIVE_PROPOSED', 'VETOED'
            String notes,
            String decisionBy
    ) {
        ReviewerDeclaration declaration = declarationRepository.findById(declarationId)
                .orElseThrow(() -> new IllegalArgumentException("Declaration not found with ID: " + declarationId));

        if (!"ACCEPTED".equals(decision) && !"ALTERNATIVE_PROPOSED".equals(decision) && !"VETOED".equals(decision)) {
            throw new IllegalArgumentException("Invalid district decision. Allowed: ACCEPTED, ALTERNATIVE_PROPOSED, VETOED");
        }

        declaration.setDistrictApprovalStatus(decision);
        declaration.setDistrictDecisionNotes(notes);
        declaration.setDistrictDecisionBy(decisionBy != null ? decisionBy : "district_magistrate");

        log.info("District decision {} recorded for reviewer declaration {}", decision, declarationId);
        return declarationRepository.save(declaration);
    }
}
