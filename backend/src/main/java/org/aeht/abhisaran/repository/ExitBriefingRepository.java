package org.aeht.abhisaran.repository;

import org.aeht.abhisaran.model.ExitBriefing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ExitBriefingRepository extends JpaRepository<ExitBriefing, UUID> {
    List<ExitBriefing> findByDeliveryPointCodeOrderByBriefingDateDesc(String deliveryPointCode);
    Optional<ExitBriefing> findFirstByDeliveryPointCodeOrderByBriefingDateDesc(String deliveryPointCode);
    List<ExitBriefing> findAllByOrderByBriefingDateDesc();
}
