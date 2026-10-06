package org.aeht.abhisaran.privacy;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aeht.abhisaran.model.AuditLog;
import org.aeht.abhisaran.repository.AuditLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public List<AuditLog> getAllAuditLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }

    public List<AuditLog> getLogsForEntity(String entityName, String entityId) {
        if (entityId != null && !entityId.isBlank()) {
            return auditLogRepository.findByEntityIdOrderByTimestampDesc(entityId);
        }
        return auditLogRepository.findByEntityNameOrderByTimestampDesc(entityName);
    }

    /**
     * Immutable append-only audit record creation.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public AuditLog recordAuditLog(
            UUID userId,
            String userRole,
            String action,
            String entityName,
            String entityId,
            String previousState,
            String newState,
            String reason,
            String ruleVersion
    ) {
        AuditLog auditLog = AuditLog.builder()
                .userId(userId)
                .userRole(userRole != null ? userRole : "SYSTEM")
                .action(action)
                .entityName(entityName)
                .entityId(entityId)
                .previousState(previousState)
                .newState(newState)
                .reason(reason != null ? reason : "Operational state transition")
                .ruleVersion(ruleVersion)
                .timestamp(Instant.now())
                .build();

        AuditLog saved = auditLogRepository.save(auditLog);
        log.info("[AUDIT] Action: {}, Entity: {} ({}), Role: {}, Reason: {}", action, entityName, entityId, userRole, reason);
        return saved;
    }
}
