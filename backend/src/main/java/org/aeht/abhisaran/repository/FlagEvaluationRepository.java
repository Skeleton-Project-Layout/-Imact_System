package org.aeht.abhisaran.repository;

import org.aeht.abhisaran.model.FlagEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FlagEvaluationRepository extends JpaRepository<FlagEvaluation, UUID> {
    List<FlagEvaluation> findByDeliveryPointCode(String deliveryPointCode);
    List<FlagEvaluation> findByDeliveryPointCodeAndStatus(String deliveryPointCode, String status);
    List<FlagEvaluation> findBySeverity(String severity);
}
