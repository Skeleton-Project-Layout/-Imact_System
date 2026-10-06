package org.aeht.abhisaran.scoring;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScoringResult {
    private int applicableCount;
    private double totalPossiblePoints;
    private double achievedPoints;
    private double acsScore;
    private String band; // 'GREEN', 'AMBER', 'RED'
    private String formulaString;
    private List<ScoringComponent> components;
}
