package org.aeht.abhisaran.scoring;

import lombok.RequiredArgsConstructor;
import org.aeht.abhisaran.model.DeliveryPoint;
import org.aeht.abhisaran.model.Evidence;
import org.aeht.abhisaran.repository.DeliveryPointRepository;
import org.aeht.abhisaran.repository.EvidenceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/scoring")
@RequiredArgsConstructor
public class ScoringController {

    private final ScoringService scoringService;
    private final DeliveryPointRepository deliveryPointRepository;
    private final EvidenceRepository evidenceRepository;

    @GetMapping("/delivery-point/{dpCode}")
    public ResponseEntity<ScoringResult> getScore(@PathVariable String dpCode) {
        try {
            ScoringResult result = scoringService.calculateScoreForDeliveryPoint(dpCode);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/delivery-point/{dpCode}/explain")
    public ResponseEntity<ExplainScoreDto> explainScore(@PathVariable String dpCode) {
        DeliveryPoint dp = deliveryPointRepository.findByCode(dpCode).orElse(null);
        if (dp == null) {
            return ResponseEntity.notFound().build();
        }

        ScoringResult scoreResult = scoringService.calculateScoreForDeliveryPoint(dpCode);

        // Fetch verified evidence items contributing to this calculation
        List<Evidence> evidenceTrail = evidenceRepository.findByDeliveryPointCode(dpCode).stream()
                .filter(e -> "VERIFIED".equalsIgnoreCase(e.getVerificationStatus()))
                .toList();

        ExplainScoreDto explainDto = ExplainScoreDto.builder()
                .deliveryPointCode(dp.getCode())
                .deliveryPointName(dp.getCode() + " (" + dp.getCategory() + ")")
                .sectorId(dp.getSector().getId())
                .acsScore(scoreResult.getAcsScore())
                .band(scoreResult.getBand())
                .applicableCount(scoreResult.getApplicableCount())
                .formulaString(scoreResult.getFormulaString())
                .calculationTrace(String.format(
                        "Achieved %.1f points out of %.1f total possible across %d applicable touchpoints (rebased over %d applicable components). Band threshold: %s.",
                        scoreResult.getAchievedPoints(),
                        scoreResult.getTotalPossiblePoints(),
                        scoreResult.getApplicableCount(),
                        scoreResult.getApplicableCount(),
                        scoreResult.getBand()
                ))
                .components(scoreResult.getComponents())
                .evidenceTrail(evidenceTrail)
                .build();

        return ResponseEntity.ok(explainDto);
    }
}
