package org.aeht.abhisaran.repository;

import org.aeht.abhisaran.model.ReviewerDeclaration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReviewerDeclarationRepository extends JpaRepository<ReviewerDeclaration, UUID> {
    Optional<ReviewerDeclaration> findFirstByOrderBySubmittedAtDesc();
    List<ReviewerDeclaration> findAllByOrderBySubmittedAtDesc();
}
