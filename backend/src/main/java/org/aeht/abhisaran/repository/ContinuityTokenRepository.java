package org.aeht.abhisaran.repository;

import org.aeht.abhisaran.model.ContinuityToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ContinuityTokenRepository extends JpaRepository<ContinuityToken, String> {
    Optional<ContinuityToken> findByTokenId(String tokenId);
}
