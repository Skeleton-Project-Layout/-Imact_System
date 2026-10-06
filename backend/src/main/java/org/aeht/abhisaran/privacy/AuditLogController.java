package org.aeht.abhisaran.privacy;

import lombok.RequiredArgsConstructor;
import org.aeht.abhisaran.model.AuditLog;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<List<AuditLog>> getAuditLogs(
            @RequestParam(required = false) String entityName,
            @RequestParam(required = false) String entityId
    ) {
        if (entityName != null && !entityName.isBlank()) {
            return ResponseEntity.ok(auditLogService.getLogsForEntity(entityName, entityId));
        }
        return ResponseEntity.ok(auditLogService.getAllAuditLogs());
    }
}
