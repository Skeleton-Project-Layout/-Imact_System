const fs = require('fs');
const path = require('path');
const { calculateAcs, assignBand } = require('../engine');

function runGoldenFixtureTests() {
  const fixturesPath = path.join(__dirname, '../fixtures/scoring_golden_fixtures.json');
  const rawData = fs.readFileSync(fixturesPath, 'utf8');
  const fixtureData = JSON.parse(rawData);

  console.log(`[ABHISARAN-CORE] Running golden fixture tests for engine: ${fixtureData.engine} (v${fixtureData.version})`);
  let passed = 0;
  let failed = 0;

  for (const vector of fixtureData.vectors) {
    try {
      const result = calculateAcs(vector.inputs);
      const expected = vector.expected;

      if (result.applicableCount !== expected.applicableCount) {
        throw new Error(`applicableCount mismatch: got ${result.applicableCount}, expected ${expected.applicableCount}`);
      }
      if (Math.abs(result.totalPossiblePoints - expected.totalPossiblePoints) > 0.001) {
        throw new Error(`totalPossiblePoints mismatch: got ${result.totalPossiblePoints}, expected ${expected.totalPossiblePoints}`);
      }
      if (Math.abs(result.achievedPoints - expected.achievedPoints) > 0.001) {
        throw new Error(`achievedPoints mismatch: got ${result.achievedPoints}, expected ${expected.achievedPoints}`);
      }
      if (Math.abs(result.acsScore - expected.acsScore) > 0.01) {
        throw new Error(`acsScore mismatch: got ${result.acsScore}, expected ${expected.acsScore}`);
      }
      if (result.band !== expected.band) {
        throw new Error(`band mismatch: got ${result.band}, expected ${expected.band}`);
      }
      if (result.formulaString !== expected.formulaString) {
        throw new Error(`formulaString mismatch:\n  got:      "${result.formulaString}"\n  expected: "${expected.formulaString}"`);
      }

      console.log(`  ✓ [PASS] ${vector.id}: ${vector.description}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ [FAIL] ${vector.id}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n[ABHISARAN-CORE] Test Summary: ${passed} passed, ${failed} failed out of ${fixtureData.vectors.length} vectors.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runGoldenFixtureTests();
