package org.aeht.abhisaran.repository;

import org.aeht.abhisaran.model.Sector;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SectorRepository extends JpaRepository<Sector, String> {
}
