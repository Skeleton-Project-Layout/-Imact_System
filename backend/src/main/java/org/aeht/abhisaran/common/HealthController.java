package org.aeht.abhisaran.common;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getHealth() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "product", "ABHISARAN – District Programme Continuity Scan",
                "version", "1.0.0",
                "timestamp", Instant.now().toString(),
                "zeroPiiEnforced", true,
                "deterministicScoring", true,
                "organization", "Aryabhata Educational & Health Trust (AEHT)"
        ));
    }
}
