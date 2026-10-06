package org.aeht.abhisaran.repository;

import org.aeht.abhisaran.model.PrivacyIncident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PrivacyIncidentRepository extends JpaRepository<PrivacyIncident, UUID> {
    List<PrivacyIncident> findByStatus(String status);
}
