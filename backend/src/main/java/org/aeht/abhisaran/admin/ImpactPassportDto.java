package org.aeht.abhisaran.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImpactPassportDto {
    private String deliveryPointCode;
    private String name;
    private String sectorId;
    private String category; // 'HIGH_PERFORMING', 'LOW_PERFORMING', 'DIFFICULT_ACCESS'
    private String selectionRationale;
    private double acsScore;
    private String band;
    private int applicableComponentsCount;
    private List<String> verifiedStrengths;
    private List<String> verifiedGaps;
    private int activeFlagsCount;
    private String lastAssessed;
}
