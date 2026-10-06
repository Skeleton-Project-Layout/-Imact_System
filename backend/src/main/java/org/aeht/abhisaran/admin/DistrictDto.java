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
public class DistrictDto {
    private UUID id;
    private String code;
    private String name;
    private String state;
    private String division;
    private String pilotStatus;
    private String nodalOfficer;
    private int sampleSize;
    private double aggregateAcsScore;
    private String aggregateBand;
}
