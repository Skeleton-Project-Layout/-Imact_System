package org.aeht.abhisaran.governance;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.aeht.abhisaran.model.ExitBriefing;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/governance/exit-briefings")
@RequiredArgsConstructor
public class ExitBriefingController {

    private final ExitBriefingService exitBriefingService;

    @Data
    public static class RecordExitBriefingDto {
        @NotBlank
        private String deliveryPointCode;
        @NotBlank
        private String institutionHeadDesignation;
        @NotBlank
        private String status; // 'ACKNOWLEDGED', 'SHARED_UNSIGNED', 'REFUSED_NON_ADVERSE'
        private String acknowledgementText;
        private String refusalReason;
        private String factualDiscrepanciesNotes;
        private Boolean materialCorrectionsLogged;
    }

    @GetMapping
    public ResponseEntity<List<ExitBriefing>> getAllBriefings() {
        return ResponseEntity.ok(exitBriefingService.getAllExitBriefings());
    }

    @GetMapping("/{dpCode}")
    public ResponseEntity<?> getBriefingForDeliveryPoint(@PathVariable String dpCode) {
        return exitBriefingService.getBriefingForDeliveryPoint(dpCode)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> recordBriefing(
            @Valid @RequestBody RecordExitBriefingDto dto,
            Authentication authentication
    ) {
        String conductedBy = (authentication != null && authentication.getName() != null)
                ? authentication.getName()
                : "field_team";

        try {
            ExitBriefing briefing = exitBriefingService.recordExitBriefing(
                    dto.getDeliveryPointCode(),
                    conductedBy,
                    dto.getInstitutionHeadDesignation(),
                    dto.getStatus(),
                    dto.getAcknowledgementText(),
                    dto.getRefusalReason(),
                    dto.getFactualDiscrepanciesNotes(),
                    dto.getMaterialCorrectionsLogged()
            );
            return ResponseEntity.ok(briefing);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PatchMapping("/{id}/finalize")
    public ResponseEntity<?> finalizeBriefing(@PathVariable UUID id) {
        try {
            ExitBriefing finalized = exitBriefingService.finalizeExitBriefing(id);
            return ResponseEntity.ok(finalized);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }
}
