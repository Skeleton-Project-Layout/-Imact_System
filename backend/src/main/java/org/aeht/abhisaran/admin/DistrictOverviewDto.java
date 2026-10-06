package org.aeht.abhisaran.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DistrictOverviewDto {
    private UUID districtId;
    private String districtName;
    private String state;
    private String pilotStatus;
    private int totalDeliveryPoints;
    private int schoolsCount;
    private int healthCount;
    private int anganwadiCount;
    private double aggregateAcsScore;
    private String aggregateBand;
    private String applicableComponentsSummary;
    private int zeroPiiIncidentsCount;
    private int verifiedArtifactsCount;
    private int activePriorityActionsCount;
    private int highPriorityActionsCount;
    @Builder.Default
    private String statutoryDisclaimer = "Mandatory Notice (AEHT §15): This diagnostic overview provides administrative planning inputs for cross-departmental service continuity. It does not constitute an expenditure sanction or individual employee performance evaluation.";
}
