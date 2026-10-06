package org.aeht.abhisaran.scoring;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScoringComponent {
    private String id;
    private String name;
    private Double score; // 0.0 to 5.0, or null if N/A
    private boolean applicable;
}
