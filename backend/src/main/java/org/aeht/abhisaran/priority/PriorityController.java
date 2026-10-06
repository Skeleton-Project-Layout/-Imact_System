package org.aeht.abhisaran.priority;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.aeht.abhisaran.model.PriorityActionItem;
import org.aeht.abhisaran.model.User;
import org.aeht.abhisaran.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/priority")
@RequiredArgsConstructor
public class PriorityController {

    private final PriorityFrameworkService priorityService;
    private final UserRepository userRepository;

    @Data
    public static class PriorityAssignRequestDto {
        @NotNull
        private UUID flagEvaluationId;
        @NotNull
        @Min(1)
        @Max(5)
        private Integer urgency;
        @NotNull
        @Min(1)
        @Max(5)
        private Integer reach;
        @NotNull
        @Min(1)
        @Max(5)
        private Integer feasibility;
        @NotBlank
        private String rationale;
    }

    @PostMapping("/assign")
    public ResponseEntity<?> assignPriority(
            @Valid @RequestBody PriorityAssignRequestDto dto,
            Authentication authentication
    ) {
        User user = null;
        if (authentication != null && authentication.getName() != null) {
            user = userRepository.findByUsername(authentication.getName()).orElse(null);
        }

        try {
            PriorityActionItem item = priorityService.assignPriority(
                    dto.getFlagEvaluationId(),
                    dto.getUrgency(),
                    dto.getReach(),
                    dto.getFeasibility(),
                    dto.getRationale(),
                    user
            );
            return ResponseEntity.ok(Map.of(
                    "item", item,
                    "planningDisclaimer", PriorityFrameworkService.STATUTORY_PLANNING_DISCLAIMER
            ));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(409).body(Map.of("error", ex.getMessage()));
        }
    }

    @GetMapping("/register")
    public ResponseEntity<?> getPriorityRegister() {
        List<PriorityActionItem> items = priorityService.getAllDistrictPriorities();
        return ResponseEntity.ok(Map.of(
                "items", items,
                "count", items.size(),
                "planningDisclaimer", PriorityFrameworkService.STATUTORY_PLANNING_DISCLAIMER
        ));
    }

    @GetMapping("/delivery-point/{dpCode}")
    public ResponseEntity<?> getPrioritiesForDeliveryPoint(@PathVariable String dpCode) {
        List<PriorityActionItem> items = priorityService.getPrioritiesForDeliveryPoint(dpCode);
        return ResponseEntity.ok(Map.of(
                "deliveryPointCode", dpCode,
                "items", items,
                "count", items.size(),
                "planningDisclaimer", PriorityFrameworkService.STATUTORY_PLANNING_DISCLAIMER
        ));
    }
}
