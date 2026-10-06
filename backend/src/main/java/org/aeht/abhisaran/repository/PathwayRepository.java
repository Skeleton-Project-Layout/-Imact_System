package org.aeht.abhisaran.repository;

import org.aeht.abhisaran.model.Pathway;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PathwayRepository extends JpaRepository<Pathway, String> {
    List<Pathway> findByFromSectorId(String fromSectorId);
}
