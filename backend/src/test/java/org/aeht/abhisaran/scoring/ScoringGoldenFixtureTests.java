package org.aeht.abhisaran.scoring;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

public class ScoringGoldenFixtureTests {

    private DeterministicScoringEngine scoringEngine;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        scoringEngine = new DeterministicScoringEngine();
        objectMapper = new ObjectMapper();
    }

    private File findFixturesFile() {
        File f1 = new File("../abhisaran-core/fixtures/scoring_golden_fixtures.json");
        if (f1.exists()) return f1;
        File f2 = new File("abhisaran-core/fixtures/scoring_golden_fixtures.json");
        if (f2.exists()) return f2;
        File f3 = Path.of("").toAbsolutePath().resolve("abhisaran-core/fixtures/scoring_golden_fixtures.json").toFile();
        if (f3.exists()) return f3;
        File f4 = Path.of("").toAbsolutePath().getParent().resolve("abhisaran-core/fixtures/scoring_golden_fixtures.json").toFile();
        if (f4.exists()) return f4;
        throw new IllegalStateException("Could not locate scoring_golden_fixtures.json from " + Path.of("").toAbsolutePath());
    }

    @Test
    @DisplayName("Mathematical Parity: Java DeterministicScoringEngine matches all JSON golden fixtures")
    void testGoldenFixturesParity() throws IOException {
        File fixturesFile = findFixturesFile();
        JsonNode root = objectMapper.readTree(fixturesFile);

        JsonNode vectors = root.get("vectors");
        assertNotNull(vectors);
        assertTrue(vectors.size() >= 8, "Expected at least 8 test vectors");

        int testedCount = 0;
        for (JsonNode vector : vectors) {
            String vectorId = vector.get("id").asText();
            JsonNode inputs = vector.get("inputs");
            JsonNode expected = vector.get("expected");

            Double c1 = inputs.hasNonNull("c1_screening_referral") ? inputs.get("c1_screening_referral").asDouble() : null;
            Double c2 = inputs.hasNonNull("c2_institutional_readiness") ? inputs.get("c2_institutional_readiness").asDouble() : null;
            Double c3 = inputs.hasNonNull("c3_departmental_alignment") ? inputs.get("c3_departmental_alignment").asDouble() : null;
            Double c4 = inputs.hasNonNull("c4_outcome_continuity") ? inputs.get("c4_outcome_continuity").asDouble() : null;

            ScoringResult result = scoringEngine.calculateAcs(c1, c2, c3, c4);

            assertEquals(expected.get("applicableCount").asInt(), result.getApplicableCount(),
                    "applicableCount mismatch in " + vectorId);
            assertEquals(expected.get("totalPossiblePoints").asDouble(), result.getTotalPossiblePoints(), 0.001,
                    "totalPossiblePoints mismatch in " + vectorId);
            assertEquals(expected.get("achievedPoints").asDouble(), result.getAchievedPoints(), 0.001,
                    "achievedPoints mismatch in " + vectorId);
            assertEquals(expected.get("acsScore").asDouble(), result.getAcsScore(), 0.01,
                    "acsScore mismatch in " + vectorId);
            assertEquals(expected.get("band").asText(), result.getBand(),
                    "band mismatch in " + vectorId);
            assertEquals(expected.get("formulaString").asText(), result.getFormulaString(),
                    "formulaString mismatch in " + vectorId);

            testedCount++;
        }

        System.out.println("[PARITY VERIFIED] Successfully validated " + testedCount + " golden fixture vectors with 100% parity.");
    }
}
