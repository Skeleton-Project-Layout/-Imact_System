package org.aeht.abhisaran.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    @Id
    @Column(length = 50)
    private String id; // 'DISTRICT_MAGISTRATE', 'DISTRICT_NODAL_OFFICER', etc.

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;
}
