/**
 * ABHISARAN – District Programme Continuity Scan
 * Deterministic Scoring & ACS Engine (Canonical JavaScript Implementation)
 *
 * AEHT Invariants:
 * - 4 equal components (25% each, scale 0.0 - 5.0)
 * - Pure deterministic re-basing over applicable components when N/A occurs
 * - Zero AI interference with official scores or bands
 * - Bands: GREEN (70-100), AMBER (40-69.99), RED (0-39.99)
 */

const BAND_THRESHOLDS = {
  GREEN_MIN: 70.0,
  AMBER_MIN: 40.0
};

/**
 * Assigns deterministic color band based on calculated percentage score.
 * @param {number} score - Rebased score in range 0.0 - 100.0
 * @returns {'GREEN' | 'AMBER' | 'RED'}
 */
function assignBand(score) {
  if (score >= BAND_THRESHOLDS.GREEN_MIN) {
    return 'GREEN';
  } else if (score >= BAND_THRESHOLDS.AMBER_MIN) {
    return 'AMBER';
  } else {
    return 'RED';
  }
}

/**
 * Formats a score number for display (e.g. 100.0 or 73.33)
 * @param {number} num
 * @returns {string}
 */
function formatNumber(num) {
  const rounded1 = Math.round(num * 10) / 10;
  if (Math.abs(num - rounded1) < 0.0001) {
    return num.toFixed(1);
  }
  return num.toFixed(2);
}

/**
 * Calculates the deterministic District Aggregate Continuity Score (ACS).
 *
 * @param {Object} inputs - Component scores (0.0 - 5.0, or null if N/A)
 * @param {number|null} inputs.c1_screening_referral
 * @param {number|null} inputs.c2_institutional_readiness
 * @param {number|null} inputs.c3_departmental_alignment
 * @param {number|null} inputs.c4_outcome_continuity
 * @returns {Object} result
 */
function calculateAcs(inputs) {
  const componentOrder = [
    inputs.c1_screening_referral,
    inputs.c2_institutional_readiness,
    inputs.c3_departmental_alignment,
    inputs.c4_outcome_continuity
  ];

  const applicable = [];
  for (const val of componentOrder) {
    if (val !== null && val !== undefined) {
      if (typeof val !== 'number' || val < 0.0 || val > 5.0) {
        throw new Error(`Component score must be between 0.0 and 5.0, got: ${val}`);
      }
      applicable.push(val);
    }
  }

  const applicableCount = applicable.length;
  if (applicableCount === 0) {
    return {
      applicableCount: 0,
      totalPossiblePoints: 0.0,
      achievedPoints: 0.0,
      acsScore: 0.0,
      band: 'RED',
      formulaString: 'No applicable components evaluated.'
    };
  }

  const totalPossiblePoints = applicableCount * 5.0;
  const rawSum = applicable.reduce((acc, curr) => acc + curr, 0);
  const achievedPoints = Math.round(rawSum * 100) / 100;

  const rawScore = (achievedPoints / totalPossiblePoints) * 100;
  const acsScore = Math.round(rawScore * 100) / 100;

  const band = assignBand(acsScore);

  // Construct mathematical formula string:
  // e.g. "((5.0 + 5.0 + 5.0 + 5.0) / (4 * 5.0)) * 100 = 100.0% [GREEN] (4/4 applicable components)"
  const parts = applicable.map((v) => v.toFixed(1)).join(' + ');
  const scoreFormatted = formatNumber(acsScore);
  const formulaString = `((${parts}) / (${applicableCount} * 5.0)) * 100 = ${scoreFormatted}% [${band}] (${applicableCount}/4 applicable components)`;

  return {
    applicableCount,
    totalPossiblePoints,
    achievedPoints,
    acsScore,
    band,
    formulaString
  };
}

module.exports = {
  assignBand,
  calculateAcs,
  formatNumber,
  BAND_THRESHOLDS
};
