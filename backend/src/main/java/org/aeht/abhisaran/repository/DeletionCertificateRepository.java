package org.aeht.abhisaran.repository;

import org.aeht.abhisaran.model.DeletionCertificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DeletionCertificateRepository extends JpaRepository<DeletionCertificate, UUID> {
    Optional<DeletionCertificate> findByCertificateNumber(String certificateNumber);
    List<DeletionCertificate> findAllByOrderByPurgedAtDesc();
}
