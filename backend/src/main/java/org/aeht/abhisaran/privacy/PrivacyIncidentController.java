package org.aeht.abhisaran.privacy;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.aeht.abhisaran.model.PrivacyIncident;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/privacy/incidents")
@RequiredArgsConstructor
public class PrivacyIncidentController {

    private final PrivacyIncidentService privacyIncidentService;

    @Data
    public static class CreateIncidentDto {
        private String deliveryPointCode;
        private String detectionSource;
        @NotBlank
        private String nonIdentifyingDescription;
        private String containmentAction;
    }

    @Data
    public static class ContainmentActionDto {
        private String containmentAction;
    }

    @Data
    public static class NodalNotificationDto {
        private String notes;
    }

    @Data
    public static class DistrictDirectionDto {
        @NotBlank
        private String directionNotes;
    }

    @Data
    public static class IncidentClosureDto {
        @NotBlank
        private String closingJustification;
    }

    @GetMapping
    public ResponseEntity<List<PrivacyIncident>> getAllIncidents() {
        return ResponseEntity.ok(privacyIncidentService.getAllIncidents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getIncident(@PathVariable UUID id) {
        return privacyIncidentService.getIncident(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createIncident(@Valid @RequestBody CreateIncidentDto dto) {
        try {
            PrivacyIncident incident = privacyIncidentService.recordIncident(
                    dto.getDeliveryPointCode(),
                    dto.getDetectionSource(),
                    dto.getNonIdentifyingDescription(),
                    dto.getContainmentAction()
            );
            return ResponseEntity.ok(incident);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PatchMapping("/{id}/contain")
    public ResponseEntity<?> containIncident(
            @PathVariable UUID id,
            @RequestBody(required = false) ContainmentActionDto dto
    ) {
        try {
            String action = dto != null ? dto.getContainmentAction() : null;
            PrivacyIncident incident = privacyIncidentService.containIncident(id, action);
            return ResponseEntity.ok(incident);
        } catch (IllegalStateException | IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PatchMapping("/{id}/notify-nodal")
    public ResponseEntity<?> notifyNodalOfficer(
            @PathVariable UUID id,
            @RequestBody(required = false) NodalNotificationDto dto
    ) {
        try {
            String notes = dto != null ? dto.getNotes() : null;
            PrivacyIncident incident = privacyIncidentService.notifyNodalOfficer(id, notes);
            return ResponseEntity.ok(incident);
        } catch (IllegalStateException | IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PatchMapping("/{id}/district-direction")
    public ResponseEntity<?> recordDistrictDirection(
            @PathVariable UUID id,
            @Valid @RequestBody DistrictDirectionDto dto
    ) {
        try {
            PrivacyIncident incident = privacyIncidentService.recordDistrictDirection(id, dto.getDirectionNotes());
            return ResponseEntity.ok(incident);
        } catch (IllegalStateException | IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PatchMapping("/{id}/close")
    public ResponseEntity<?> closeIncident(
            @PathVariable UUID id,
            @Valid @RequestBody IncidentClosureDto dto
    ) {
        try {
            PrivacyIncident incident = privacyIncidentService.closeIncident(id, dto.getClosingJustification());
            return ResponseEntity.ok(incident);
        } catch (IllegalStateException | IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }
}
