package org.aeht.abhisaran.repository;

import org.aeht.abhisaran.model.PriorityActionItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PriorityActionItemRepository extends JpaRepository<PriorityActionItem, UUID> {
    List<PriorityActionItem> findByDeliveryPointCodeOrderByPriorityScoreDesc(String deliveryPointCode);
    List<PriorityActionItem> findAllByOrderByPriorityScoreDesc();
    Optional<PriorityActionItem> findByFlagEvaluationId(UUID flagEvaluationId);
}
