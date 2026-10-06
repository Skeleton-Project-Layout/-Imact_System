package org.aeht.abhisaran.privacy;

import org.aeht.abhisaran.model.DeletionCertificate;
import org.aeht.abhisaran.model.RetentionSchedule;
import org.aeht.abhisaran.repository.DeletionCertificateRepository;
import org.aeht.abhisaran.repository.RetentionScheduleRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RetentionServiceTests {

    @Mock
    private RetentionScheduleRepository retentionScheduleRepository;

    @Mock
    private DeletionCertificateRepository deletionCertificateRepository;

    @Mock
    private AuditLogService auditLogService;

    @InjectMocks
    private RetentionService retentionService;

    @Test
    @DisplayName("SEC-02: Retention schedule calculates exactly 30-day purge date from handover")
    void testCreateRetentionSchedule_Calculates30Days() {
        when(retentionScheduleRepository.save(any(RetentionSchedule.class))).thenAnswer(i -> i.getArgument(0));

        UUID districtId = UUID.randomUUID();
        Instant handover = Instant.now();
        RetentionSchedule schedule = retentionService.createRetentionSchedule(districtId, handover, 30);

        assertNotNull(schedule);
        assertEquals("ACTIVE_COUNTDOWN", schedule.getStatus());
        assertEquals(30, schedule.getRetentionPeriodDays());
        assertEquals(30, Duration.between(handover, schedule.getScheduledPurgeDate()).toDays());
        assertTrue(schedule.getDaysRemaining() <= 30);
    }

    @Test
    @DisplayName("SEC-03: Executing purge generates formal SHA-256 Deletion Certificate for DNO")
    void testExecutePurge_GeneratesHashedCertificate() {
        RetentionSchedule existing = RetentionSchedule.builder()
                .id(UUID.randomUUID())
                .status("ACTIVE_COUNTDOWN")
                .scheduledPurgeDate(Instant.now().plus(Duration.ofDays(10)))
                .build();

        when(retentionScheduleRepository.findFirstByOrderByCreatedAtDesc()).thenReturn(Optional.of(existing));
        when(retentionScheduleRepository.save(any(RetentionSchedule.class))).thenAnswer(i -> i.getArgument(0));
        when(deletionCertificateRepository.count()).thenReturn(1L);
        when(deletionCertificateRepository.save(any(DeletionCertificate.class))).thenAnswer(i -> i.getArgument(0));

        DeletionCertificate cert = retentionService.executePurge(
                "field_lead",
                "District Nodal Officer",
                "DM Directive 2026/04/SCAN",
                null
        );

        assertNotNull(cert);
        assertTrue(cert.getCertificateNumber().startsWith("AEHT-DEL-"));
        assertEquals("District Nodal Officer", cert.getDistrictNodalOfficerName());
        assertNotNull(cert.getVerificationHash());
        assertEquals(64, cert.getVerificationHash().length(), "SHA-256 hex string must be 64 characters");
        assertEquals("PURGED", existing.getStatus());

        // Must record immutable audit log
        verify(auditLogService).recordAuditLog(
                isNull(),
                eq("DISTRICT_NODAL_OFFICER"),
                eq("DATA_PURGE_EXECUTED"),
                eq("RETENTION_SCHEDULE"),
                anyString(),
                eq("ACTIVE_COUNTDOWN"),
                eq("PURGED"),
                contains("Statutory 30-day post-handover retention purge executed"),
                eq("v1.0")
        );
    }

    @Test
    @DisplayName("SEC-02: Purging candidates identifies tokenized working data")
    void testGetPurgingCandidates() {
        List<Map<String, Object>> candidates = retentionService.getPurgingCandidates();
        assertNotNull(candidates);
        assertFalse(candidates.isEmpty());
        assertTrue((Boolean) candidates.get(0).get("eligibleForPurge"));
    }
}
