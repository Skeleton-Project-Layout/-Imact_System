package org.aeht.abhisaran.scoring;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.aeht.abhisaran.model.Evidence;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExplainScoreDto {
    private String deliveryPointCode;
    private String deliveryPointName;
    private String sectorId;
    private double acsScore;
    private String band;
    private int applicableCount;
    private String formulaString;
    private String calculationTrace;
    private List<ScoringComponent> components;
    private List<Evidence> evidenceTrail;
    @Builder.Default
    private String planningDisclaimer = "Mandatory Notice (AEHT §15): This diagnostic calculation provides administrative planning inputs for cross-departmental service continuity. It does not constitute an expenditure sanction or individual employee performance evaluation.";
}
