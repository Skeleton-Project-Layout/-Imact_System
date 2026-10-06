package org.aeht.abhisaran.repository;

import org.aeht.abhisaran.model.Evidence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EvidenceRepository extends JpaRepository<Evidence, UUID> {
    List<Evidence> findByDeliveryPointCode(String deliveryPointCode);
    List<Evidence> findBySectorIdAndLayer(String sectorId, Integer layer);
    List<Evidence> findByVerificationStatus(String verificationStatus);
    List<Evidence> findByDeliveryPointCodeAndLayer(String deliveryPointCode, Integer layer);
}
