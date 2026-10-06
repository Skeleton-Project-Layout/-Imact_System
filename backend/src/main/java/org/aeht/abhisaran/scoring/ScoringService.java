package org.aeht.abhisaran.scoring;

import lombok.RequiredArgsConstructor;
import org.aeht.abhisaran.model.DeliveryPoint;
import org.aeht.abhisaran.model.Evidence;
import org.aeht.abhisaran.repository.DeliveryPointRepository;
import org.aeht.abhisaran.repository.EvidenceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScoringService {

    private final DeterministicScoringEngine scoringEngine;
    private final EvidenceRepository evidenceRepository;
    private final DeliveryPointRepository deliveryPointRepository;

    public ScoringResult calculateScoreForDeliveryPoint(String deliveryPointCode) {
        DeliveryPoint dp = deliveryPointRepository.findByCode(deliveryPointCode)
                .orElseThrow(() -> new IllegalArgumentException("Delivery point not found: " + deliveryPointCode));

        List<Evidence> allEvidence = evidenceRepository.findByDeliveryPointCode(deliveryPointCode);

        // Strict Invariant: Only VERIFIED evidence is eligible to provide score points
        List<Evidence> verifiedEvidence = allEvidence.stream()
                .filter(e -> "VERIFIED".equalsIgnoreCase(e.getVerificationStatus()))
                .toList();

        Map<Integer, List<Evidence>> evidenceByLayer = verifiedEvidence.stream()
                .collect(Collectors.groupingBy(Evidence::getLayer));

        Double c1 = evaluateLayerScore(evidenceByLayer.get(1));
        Double c2 = evaluateLayerScore(evidenceByLayer.get(2));
        Double c3 = evaluateLayerScore(evidenceByLayer.get(3));
        Double c4 = evaluateLayerScore(evidenceByLayer.get(4));

        return scoringEngine.calculateAcs(c1, c2, c3, c4);
    }

    private Double evaluateLayerScore(List<Evidence> layerEvidenceList) {
        if (layerEvidenceList == null || layerEvidenceList.isEmpty()) {
            // No verified evidence available -> 0.0 points
            return 0.0;
        }

        // Take the latest verified evidence item for the layer
        Evidence ev = layerEvidenceList.get(layerEvidenceList.size() - 1);

        // Check if objective sample counts are present
        if (ev.getSampleTotal() != null && ev.getSampleTotal() > 0 && ev.getSampleCompliant() != null) {
            double ratio = (double) ev.getSampleCompliant() / (double) ev.getSampleTotal();
            double score = Math.min(5.0, Math.max(0.0, ratio * 5.0));
            return Math.round(score * 10.0) / 10.0;
        }

        // Otherwise derive from structured qualitative option
        String opt = ev.getSelectedOption() != null ? ev.getSelectedOption().toUpperCase() : "";

        if (opt.contains("COMPLETE") || opt.contains("FORMAL") || opt.contains("ROUTINE")
                || opt.contains("CLOSURE") || opt.contains("FUNCTIONAL_AND") || opt.contains("COUNTER_SIGNED")
                || opt.contains("TRANSITION_PORTFOLIO")) {
            return 5.0;
        } else if (opt.contains("PARTIAL") || opt.contains("OCCASIONAL") || opt.contains("INFORMAL")
                || opt.contains("PENDING")) {
            return 2.5;
        } else {
            return 0.0;
        }
    }
}
