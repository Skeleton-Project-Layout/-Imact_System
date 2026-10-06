package org.aeht.abhisaran.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "pathways")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pathway {

    @Id
    @Column(length = 50)
    private String id; // 'ANGANWADI_TO_SCHOOL', 'SCHOOL_TO_HEALTH', etc.

    @Column(nullable = false, length = 150)
    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "from_sector", nullable = false)
    private Sector fromSector;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "to_sector", nullable = false)
    private Sector toSector;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();
}
