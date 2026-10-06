package org.aeht.abhisaran.privacy;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.aeht.abhisaran.model.DeletionCertificate;
import org.aeht.abhisaran.model.RetentionSchedule;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/privacy/retention")
@RequiredArgsConstructor
public class RetentionController {

    private final RetentionService retentionService;

    @Data
    public static class ExecutePurgeRequestDto {
        @NotBlank
        private String purgedBy;
        @NotBlank
        private String districtNodalOfficerName;
        private String directiveRef;
        private String customScope;
    }

    @GetMapping("/schedule")
    public ResponseEntity<?> getActiveSchedule() {
        return retentionService.getActiveSchedule()
                .map(schedule -> ResponseEntity.ok(Map.of(
                        "schedule", schedule,
                        "daysRemaining", schedule.getDaysRemaining(),
                        "status", schedule.getStatus()
                )))
                .orElse(ResponseEntity.ok(Map.of("message", "No active retention schedule")));
    }

    @GetMapping("/candidates")
    public ResponseEntity<?> getPurgingCandidates() {
        return ResponseEntity.ok(retentionService.getPurgingCandidates());
    }

    @PostMapping("/execute-purge")
    public ResponseEntity<?> executePurge(@Valid @RequestBody ExecutePurgeRequestDto dto) {
        DeletionCertificate cert = retentionService.executePurge(
                dto.getPurgedBy(),
                dto.getDistrictNodalOfficerName(),
                dto.getDirectiveRef(),
                dto.getCustomScope()
        );
        return ResponseEntity.ok(cert);
    }

    @GetMapping("/certificates")
    public ResponseEntity<List<DeletionCertificate>> getAllCertificates() {
        return ResponseEntity.ok(retentionService.getAllCertificates());
    }
}
