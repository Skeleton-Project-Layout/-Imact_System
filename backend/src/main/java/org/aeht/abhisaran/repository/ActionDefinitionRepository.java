package org.aeht.abhisaran.repository;

import org.aeht.abhisaran.model.ActionDefinition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActionDefinitionRepository extends JpaRepository<ActionDefinition, String> {
}
