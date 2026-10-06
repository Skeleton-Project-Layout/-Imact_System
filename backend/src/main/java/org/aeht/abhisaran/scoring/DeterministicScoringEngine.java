package org.aeht.abhisaran.scoring;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

/**
 * DeterministicScoringEngine
 * Java 21 port of canonical abhisaran-core/engine.js
 *
 * Implements exact mathematical rebasing across 4 equal components (25% each, scale 0.0 - 5.0)
 * and guarantees 100% parity with shared JSON golden fixtures.
 */
@Component
public class DeterministicScoringEngine {

    public static final double GREEN_THRESHOLD = 70.0;
    public static final double AMBER_THRESHOLD = 40.0;

    public String assignBand(double score) {
        if (score >= GREEN_THRESHOLD) {
            return "GREEN";
        } else if (score >= AMBER_THRESHOLD) {
            return "AMBER";
        } else {
            return "RED";
        }
    }

    private String formatScoreNumber(double num) {
        double rounded1 = Math.round(num * 10.0) / 10.0;
        if (Math.abs(num - rounded1) < 0.0001) {
            return String.format(Locale.US, "%.1f", num);
        }
        return String.format(Locale.US, "%.2f", num);
    }

    public ScoringResult calculateAcs(Double c1, Double c2, Double c3, Double c4) {
        List<Double> inputs = Arrays.asList(c1, c2, c3, c4);
        List<Double> applicable = new ArrayList<>();

        for (Double val : inputs) {
            if (val != null) {
                if (val < 0.0 || val > 5.0) {
                    throw new IllegalArgumentException("Component score must be between 0.0 and 5.0, got: " + val);
                }
                applicable.add(val);
            }
        }

        int applicableCount = applicable.size();
        if (applicableCount == 0) {
            return ScoringResult.builder()
                    .applicableCount(0)
                    .totalPossiblePoints(0.0)
                    .achievedPoints(0.0)
                    .acsScore(0.0)
                    .band("RED")
                    .formulaString("No applicable components evaluated.")
                    .components(Collections.emptyList())
                    .build();
        }

        double totalPossiblePoints = applicableCount * 5.0;
        double rawSum = applicable.stream().mapToDouble(Double::doubleValue).sum();
        double achievedPoints = BigDecimal.valueOf(rawSum).setScale(2, RoundingMode.HALF_UP).doubleValue();

        double rawScore = (achievedPoints / totalPossiblePoints) * 100.0;
        double acsScore = BigDecimal.valueOf(rawScore).setScale(2, RoundingMode.HALF_UP).doubleValue();

        String band = assignBand(acsScore);

        StringJoiner parts = new StringJoiner(" + ");
        for (Double val : applicable) {
            parts.add(String.format(Locale.US, "%.1f", val));
        }

        String scoreStr = formatScoreNumber(acsScore);
        String formulaString = String.format(
                Locale.US,
                "((%s) / (%d * 5.0)) * 100 = %s%% [%s] (%d/4 applicable components)",
                parts.toString(),
                applicableCount,
                scoreStr,
                band,
                applicableCount
        );

        List<ScoringComponent> components = List.of(
                ScoringComponent.builder().id("c1_screening_referral").name("Touchpoint Screening / Referral Protocol").score(c1).applicable(c1 != null).build(),
                ScoringComponent.builder().id("c2_institutional_readiness").name("Institutional Readiness & Duty Roles").score(c2).applicable(c2 != null).build(),
                ScoringComponent.builder().id("c3_departmental_alignment").name("Cross-Departmental Feedback & Communication").score(c3).applicable(c3 != null).build(),
                ScoringComponent.builder().id("c4_outcome_continuity").name("Outcome / Remedial Continuity Documentation").score(c4).applicable(c4 != null).build()
        );

        return ScoringResult.builder()
                .applicableCount(applicableCount)
                .totalPossiblePoints(totalPossiblePoints)
                .achievedPoints(achievedPoints)
                .acsScore(acsScore)
                .band(band)
                .formulaString(formulaString)
                .components(components)
                .build();
    }
}
