package org.aeht.abhisaran.repository;

import org.aeht.abhisaran.model.QuestionItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface QuestionRepository extends JpaRepository<QuestionItem, UUID> {
    List<QuestionItem> findBySectorIdOrderByQuestionNumberAsc(String sectorId);
    List<QuestionItem> findBySectorIdAndLayerOrderByQuestionNumberAsc(String sectorId, Integer layer);
    List<QuestionItem> findAllByOrderBySectorIdAscQuestionNumberAsc();
}
