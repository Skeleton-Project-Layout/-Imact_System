package org.aeht.abhisaran.privacy;

import org.aeht.abhisaran.model.AuditLog;
import org.aeht.abhisaran.repository.AuditLogRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuditLogTests {

    @Mock
    private AuditLogRepository auditLogRepository;

    @InjectMocks
    private AuditLogService auditLogService;

    @Test
    @DisplayName("SEC-04: Append-only audit logging captures who, what, when, states, and reason")
    void testRecordAuditLog_CapturesAllFields() {
        when(auditLogRepository.save(any(AuditLog.class))).thenAnswer(i -> i.getArgument(0));

        UUID userId = UUID.randomUUID();
        AuditLog log = auditLogService.recordAuditLog(
                userId,
                "DISTRICT_NODAL_OFFICER",
                "EVIDENCE_VERIFIED",
                "EVIDENCE",
                "EV-001",
                "PENDING_REVIEW",
                "VERIFIED",
                "Physical inspection of duty roster completed without child names",
                "v1.0"
        );

        assertNotNull(log);
        assertEquals(userId, log.getUserId());
        assertEquals("DISTRICT_NODAL_OFFICER", log.getUserRole());
        assertEquals("EVIDENCE_VERIFIED", log.getAction());
        assertEquals("EVIDENCE", log.getEntityName());
        assertEquals("EV-001", log.getEntityId());
        assertEquals("PENDING_REVIEW", log.getPreviousState());
        assertEquals("VERIFIED", log.getNewState());
        assertEquals("Physical inspection of duty roster completed without child names", log.getReason());
        assertEquals("v1.0", log.getRuleVersion());
        assertNotNull(log.getTimestamp());
    }
}
