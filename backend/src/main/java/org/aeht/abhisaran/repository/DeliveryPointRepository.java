package org.aeht.abhisaran.repository;

import org.aeht.abhisaran.model.DeliveryPoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DeliveryPointRepository extends JpaRepository<DeliveryPoint, UUID> {
    Optional<DeliveryPoint> findByCode(String code);
    List<DeliveryPoint> findByDistrictId(UUID districtId);
    List<DeliveryPoint> findBySectorId(String sectorId);
    List<DeliveryPoint> findByActiveTrue();
}
