package org.aeht.abhisaran.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "retention_schedules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RetentionSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "pilot_district_id")
    private UUID pilotDistrictId;

    @Column(name = "handover_date", nullable = false)
    private Instant handoverDate;

    @Column(name = "retention_period_days", nullable = false)
    @Builder.Default
    private Integer retentionPeriodDays = 30;

    @Column(name = "scheduled_purge_date", nullable = false)
    private Instant scheduledPurgeDate;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String status = "ACTIVE_COUNTDOWN"; // 'ACTIVE_COUNTDOWN', 'READY_FOR_PURGE', 'PURGED', 'EXTENDED_BY_DISTRICT'

    @Column(name = "district_written_directive_ref", columnDefinition = "TEXT")
    private String districtWrittenDirectiveRef;

    @Column(name = "created_at")
    @Builder.Default
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    @Builder.Default
    private Instant updatedAt = Instant.now();

    public long getDaysRemaining() {
        if ("PURGED".equals(status)) {
            return 0;
        }
        if (scheduledPurgeDate == null) {
            return 30;
        }
        long days = Duration.between(Instant.now(), scheduledPurgeDate).toDays();
        return Math.max(0, days);
    }
}
