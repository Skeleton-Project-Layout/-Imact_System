package org.aeht.abhisaran.evidence;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.aeht.abhisaran.model.Evidence;
import org.aeht.abhisaran.model.EvidenceVerificationHistory;
import org.aeht.abhisaran.model.User;
import org.aeht.abhisaran.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class EvidenceController {

    private final EvidenceService evidenceService;
    private final UserRepository userRepository;

    @Data
    public static class EvidenceSubmitDto {
        @NotBlank
        private String deliveryPointCode;
        @NotBlank
        private String sectorId;
        @NotNull
        private Integer layer;
        @NotNull
        private Integer questionNumber;
        @NotBlank
        private String convergenceQuestion;
        @NotBlank
        private String resultingRuleId;
        private String sourceType = "FIELD_OBSERVATION";
        @NotBlank
        private String selectedOption;
        private Integer sampleTotal;
        private Integer sampleCompliant;
        private String attachmentRef;
        private String documentKind;
        private String description;
    }

    @Data
    public static class VerificationRequestDto {
        @NotBlank
        private String targetStatus;
        @NotBlank
        private String justification;
    }

    @PostMapping("/source/evidence")
    public ResponseEntity<?> submitEvidence(
            @Valid @RequestBody EvidenceSubmitDto dto,
            Authentication authentication
    ) {
        User user = null;
        if (authentication != null && authentication.getName() != null) {
            user = userRepository.findByUsername(authentication.getName()).orElse(null);
        }

        Evidence evidence = Evidence.builder()
                .deliveryPointCode(dto.getDeliveryPointCode())
                .sectorId(dto.getSectorId())
                .layer(dto.getLayer())
                .questionNumber(dto.getQuestionNumber())
                .convergenceQuestion(dto.getConvergenceQuestion())
                .resultingRuleId(dto.getResultingRuleId())
                .sourceType(dto.getSourceType() != null ? dto.getSourceType() : "FIELD_OBSERVATION")
                .selectedOption(dto.getSelectedOption())
                .sampleTotal(dto.getSampleTotal())
                .sampleCompliant(dto.getSampleCompliant())
                .attachmentRef(dto.getAttachmentRef())
                .documentKind(dto.getDocumentKind())
                .description(dto.getDescription())
                .build();

        try {
            Evidence saved = evidenceService.submitEvidence(evidence, user);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (SecurityException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                    java.util.Map.of("error", "ZERO_PII_VIOLATION", "message", ex.getMessage())
            );
        }
    }

    @PatchMapping("/evidence/{id}/verification")
    public ResponseEntity<?> updateVerification(
            @PathVariable UUID id,
            @Valid @RequestBody VerificationRequestDto dto,
            Authentication authentication
    ) {
        User user = null;
        if (authentication != null && authentication.getName() != null) {
            user = userRepository.findByUsername(authentication.getName()).orElse(null);
        }

        try {
            Evidence updated = evidenceService.transitionVerification(
                    id,
                    dto.getTargetStatus(),
                    dto.getJustification(),
                    user
            );
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", ex.getMessage()));
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(java.util.Map.of("error", ex.getMessage()));
        }
    }

    @GetMapping("/evidence/delivery-point/{dpCode}")
    public ResponseEntity<List<Evidence>> getByDeliveryPoint(@PathVariable String dpCode) {
        return ResponseEntity.ok(evidenceService.getEvidenceByDeliveryPoint(dpCode));
    }

    @GetMapping("/evidence/{id}/history")
    public ResponseEntity<List<EvidenceVerificationHistory>> getHistory(@PathVariable UUID id) {
        return ResponseEntity.ok(evidenceService.getVerificationHistory(id));
    }
}
