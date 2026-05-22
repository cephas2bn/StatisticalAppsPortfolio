import assert from "node:assert/strict";
import test from "node:test";

const core = await import("../src/index.mjs");

test("normalConfidenceInterval returns centered interval", () => {
  const ci = core.normalConfidenceInterval([1, 2, 3, 4, 5]);
  assert.equal(ci.estimate, 3);
  assert.ok(ci.lower < 3);
  assert.ok(ci.upper > 3);
});

test("designEffect is one for equal weights", () => {
  assert.equal(core.designEffect([1, 1, 1, 1]), 1);
});

test("classificationMetrics computes recall", () => {
  const metrics = core.classificationMetrics({ tp: 8, fp: 2, tn: 7, fn: 3 });
  assert.equal(metrics.recall, 8 / 11);
});

test("recommendTest handles paired nonnormal continuous data", () => {
  assert.equal(
    core.recommendTest({ outcome: "continuous", groups: 2, paired: true, normal: false }),
    "Wilcoxon signed-rank test"
  );
});

test("linearRegression estimates a simple line", () => {
  const model = core.linearRegression([
    { x: 1, y: 3 },
    { x: 2, y: 5 },
    { x: 3, y: 7 },
    { x: 4, y: 9 }
  ]);
  assert.equal(model.slope, 2);
  assert.equal(model.intercept, 1);
  assert.equal(model.rSquared, 1);
});

test("bayesTestSummary computes predictive values", () => {
  const summary = core.bayesTestSummary({
    prevalence: 0.01,
    sensitivity: 0.95,
    specificity: 0.95,
    population: 10000
  });
  assert.ok(summary.positivePredictiveValue > 0.15);
  assert.ok(summary.positivePredictiveValue < 0.17);
  assert.equal(Math.round(summary.truePositive), 95);
});

test("bootstrapMeanInterval is deterministic with a seed", () => {
  const first = core.bootstrapMeanInterval([1, 2, 3, 4, 5], 200, 77);
  const second = core.bootstrapMeanInterval([1, 2, 3, 4, 5], 200, 77);
  assert.equal(first.lower, second.lower);
  assert.equal(first.upper, second.upper);
  assert.equal(first.estimate, 3);
});

test("monteCarloMeans returns requested replication count", () => {
  const means = core.monteCarloMeans({ replications: 50, sampleSize: 12, distribution: "normal", seed: 4 });
  assert.equal(means.length, 50);
});
