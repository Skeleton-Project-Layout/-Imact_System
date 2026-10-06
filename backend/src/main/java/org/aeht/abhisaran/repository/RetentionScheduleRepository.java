package org.aeht.abhisaran.repository;

import org.aeht.abhisaran.model.RetentionSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RetentionScheduleRepository extends JpaRepository<RetentionSchedule, UUID> {
    Optional<RetentionSchedule> findFirstByOrderByCreatedAtDesc();
    List<RetentionSchedule> findByStatus(String status);
}
