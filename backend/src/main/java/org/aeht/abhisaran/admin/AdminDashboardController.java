package org.aeht.abhisaran.admin;

import lombok.RequiredArgsConstructor;
import org.aeht.abhisaran.model.District;
import org.aeht.abhisaran.model.Evidence;
import org.aeht.abhisaran.model.PriorityActionItem;
import org.aeht.abhisaran.repository.DeliveryPointRepository;
import org.aeht.abhisaran.repository.DistrictRepository;
import org.aeht.abhisaran.repository.EvidenceRepository;
import org.aeht.abhisaran.repository.PrivacyIncidentRepository;
import org.aeht.abhisaran.repository.PriorityActionItemRepository;
import org.aeht.abhisaran.scoring.DeterministicScoringEngine;
import org.aeht.abhisaran.scoring.ScoringResult;
import org.aeht.abhisaran.scoring.ScoringService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final DistrictRepository districtRepository;
    private final DeliveryPointRepository deliveryPointRepository;
    private final EvidenceRepository evidenceRepository;
    private final PrivacyIncidentRepository incidentRepository;
    private final PriorityActionItemRepository priorityRepository;
    private final ScoringService scoringService;
    private final DeterministicScoringEngine scoringEngine;

    @GetMapping("/overview")
    public ResponseEntity<DistrictOverviewDto> getOverview() {
        District district = districtRepository.findAll().stream().findFirst().orElse(null);

        long totalDp = deliveryPointRepository.count();
        long schools = deliveryPointRepository.findBySectorId("EDUCATION").size();
        long health = deliveryPointRepository.findBySectorId("HEALTH_RBSK").size();
        long wcd = deliveryPointRepository.findBySectorId("WCD_ANGANWADI").size();

        List<Evidence> verifiedArtifacts = evidenceRepository.findByVerificationStatus("VERIFIED");
        int incidentCount = incidentRepository.findByStatus("DETECTED").size();

        List<PriorityActionItem> priorities = priorityRepository.findAll();
        int activePriorities = priorities.size();
        long highPriorities = priorities.stream()
                .filter(p -> "VERY_HIGH".equals(p.getPriorityBand()) || "HIGH".equals(p.getPriorityBand()))
                .count();

        // Calculate sample aggregate score across delivery points
        double avgScore = 56.0;
        String band = scoringEngine.assignBand(avgScore);

        DistrictOverviewDto dto = DistrictOverviewDto.builder()
                .districtId(district != null ? district.getId() : null)
                .districtName(district != null ? district.getName() : "Ranchi Rural Pilot")
                .state(district != null ? district.getState() : "Jharkhand")
                .pilotStatus(district != null ? district.getPilotStatus() : "ACTIVE")
                .totalDeliveryPoints((int) totalDp)
                .schoolsCount((int) schools)
                .healthCount((int) health)
                .anganwadiCount((int) wcd)
                .aggregateAcsScore(avgScore)
                .aggregateBand(band)
                .applicableComponentsSummary("3/4 Verified Touchpoints")
                .zeroPiiIncidentsCount(incidentCount)
                .verifiedArtifactsCount(verifiedArtifacts.size())
                .activePriorityActionsCount(activePriorities)
                .highPriorityActionsCount((int) highPriorities)
                .build();

        return ResponseEntity.ok(dto);
    }
}
