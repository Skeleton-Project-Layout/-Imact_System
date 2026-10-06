package org.aeht.abhisaran.repository;

import org.aeht.abhisaran.model.FactualCorrection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FactualCorrectionRepository extends JpaRepository<FactualCorrection, UUID> {
    List<FactualCorrection> findByDeliveryPointCodeOrderBySubmittedAtDesc(String deliveryPointCode);
    List<FactualCorrection> findAllByOrderBySubmittedAtDesc();
    List<FactualCorrection> findByStatusOrderBySubmittedAtDesc(String status);
}
