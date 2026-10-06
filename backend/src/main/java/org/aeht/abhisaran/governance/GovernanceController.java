package org.aeht.abhisaran.governance;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.aeht.abhisaran.model.FactualCorrection;
import org.aeht.abhisaran.model.ReviewerDeclaration;
import org.aeht.abhisaran.model.User;
import org.aeht.abhisaran.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/governance")
@RequiredArgsConstructor
public class GovernanceController {

    private final FactualCorrectionService correctionService;
    private final ReviewerService reviewerService;
    private final UserRepository userRepository;

    // --- Factual Corrections DTOs & Endpoints ---

    @Data
    public static class SubmitCorrectionDto {
        @NotBlank
        private String deliveryPointCode;
        private UUID evidenceId;
        @NotBlank
        private String metricTarget;
        @NotBlank
        private String originalValue;
        @NotBlank
        private String correctedValue;
        @NotBlank
        private String justification;
    }

    @Data
    public static class ValidateCorrectionDto {
        @NotNull
        private Boolean approved;
        private String decisionNotes;
    }

    @GetMapping("/corrections")
    public ResponseEntity<List<FactualCorrection>> getCorrections(@RequestParam(required = false) String deliveryPointCode) {
        if (deliveryPointCode != null && !deliveryPointCode.isBlank()) {
            return ResponseEntity.ok(correctionService.getCorrectionsForDeliveryPoint(deliveryPointCode));
        }
        return ResponseEntity.ok(correctionService.getAllCorrections());
    }

    @PostMapping("/corrections")
    public ResponseEntity<?> submitCorrection(
            @Valid @RequestBody SubmitCorrectionDto dto,
            Authentication authentication
    ) {
        String username = (authentication != null && authentication.getName() != null)
                ? authentication.getName()
                : "institution_head";

        try {
            FactualCorrection correction = correctionService.submitCorrection(
                    dto.getDeliveryPointCode(),
                    dto.getEvidenceId(),
                    dto.getMetricTarget(),
                    dto.getOriginalValue(),
                    dto.getCorrectedValue(),
                    dto.getJustification(),
                    username
            );
            return ResponseEntity.ok(correction);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PatchMapping("/corrections/{id}/validate")
    public ResponseEntity<?> validateCorrection(
            @PathVariable UUID id,
            @Valid @RequestBody ValidateCorrectionDto dto,
            Authentication authentication
    ) {
        User validator = null;
        if (authentication != null && authentication.getName() != null) {
            validator = userRepository.findByUsername(authentication.getName()).orElse(null);
        }

        try {
            FactualCorrection validated = correctionService.validateCorrection(
                    id,
                    dto.getApproved(),
                    dto.getDecisionNotes(),
                    validator
            );
            return ResponseEntity.ok(validated);
        } catch (SecurityException ex) {
            return ResponseEntity.status(403).body(Map.of("error", ex.getMessage()));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    // --- Independent Reviewer Pack DTOs & Endpoints ---

    @Data
    public static class ReviewerDeclarationDto {
        @NotBlank
        private String reviewerName;
        @NotBlank
        private String designation;
        @NotBlank
        private String organization;
        @NotBlank
        private String areaOfExpertise;
        @NotNull
        private Boolean noReportingLineToFieldTeam;
        @NotNull
        private Boolean notAehtEmployeeOrBoard3Years;
        @NotNull
        private Boolean confidentialityAgreed;
        @NotBlank
        private String methodologyLimitationNotes;
        private String disagreementsLogged;
        private String recommendations;
        private String endorsementStatus;
    }

    @Data
    public static class DistrictDecisionDto {
        @NotBlank
        private String decision; // 'ACCEPTED', 'ALTERNATIVE_PROPOSED', 'VETOED'
        private String notes;
    }

    @GetMapping("/reviewer-pack")
    public ResponseEntity<?> getReviewerPack() {
        return ResponseEntity.ok(reviewerService.getAllDeclarations());
    }

    @PostMapping("/reviewer-pack/declaration")
    public ResponseEntity<?> submitDeclaration(@Valid @RequestBody ReviewerDeclarationDto dto) {
        try {
            ReviewerDeclaration decl = reviewerService.submitDeclaration(
                    dto.getReviewerName(),
                    dto.getDesignation(),
                    dto.getOrganization(),
                    dto.getAreaOfExpertise(),
                    dto.getNoReportingLineToFieldTeam(),
                    dto.getNotAehtEmployeeOrBoard3Years(),
                    dto.getConfidentialityAgreed(),
                    dto.getMethodologyLimitationNotes(),
                    dto.getDisagreementsLogged(),
                    dto.getRecommendations(),
                    dto.getEndorsementStatus()
            );
            return ResponseEntity.ok(decl);
        } catch (IllegalStateException | IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PatchMapping("/reviewer-pack/{id}/district-decision")
    public ResponseEntity<?> recordDistrictDecision(
            @PathVariable UUID id,
            @Valid @RequestBody DistrictDecisionDto dto,
            Authentication authentication
    ) {
        String decisionBy = (authentication != null && authentication.getName() != null)
                ? authentication.getName()
                : "district_magistrate";

        try {
            ReviewerDeclaration decl = reviewerService.recordDistrictDecision(
                    id,
                    dto.getDecision(),
                    dto.getNotes(),
                    decisionBy
            );
            return ResponseEntity.ok(decl);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }
}
