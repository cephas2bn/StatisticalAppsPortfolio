export function mean(values) {
  if (values.length === 0) return 0;
  return values.reduce((total, value) => total + value, 0) / values.length;
}

export function variance(values, sample = true) {
  if (values.length < 2) return 0;
  const center = mean(values);
  const denominator = sample ? values.length - 1 : values.length;
  return values.reduce((total, value) => total + (value - center) ** 2, 0) / denominator;
}

export function standardDeviation(values, sample = true) {
  return Math.sqrt(variance(values, sample));
}

export function normalConfidenceInterval(values, z = 1.96) {
  const center = mean(values);
  const se = standardDeviation(values) / Math.sqrt(Math.max(values.length, 1));
  return {
    estimate: center,
    lower: center - z * se,
    upper: center + z * se,
    standardError: se
  };
}

export function effectiveSampleSize(weights) {
  const sum = weights.reduce((total, weight) => total + weight, 0);
  const sumSquares = weights.reduce((total, weight) => total + weight ** 2, 0);
  return sumSquares === 0 ? 0 : (sum ** 2) / sumSquares;
}

export function designEffect(weights) {
  const n = weights.length;
  if (n === 0) return 0;
  const ess = effectiveSampleSize(weights);
  return ess === 0 ? 0 : n / ess;
}

export function classificationMetrics({ tp, fp, tn, fn }) {
  const safe = (numerator, denominator) => (denominator === 0 ? 0 : numerator / denominator);
  return {
    accuracy: safe(tp + tn, tp + fp + tn + fn),
    precision: safe(tp, tp + fp),
    recall: safe(tp, tp + fn),
    specificity: safe(tn, tn + fp),
    falsePositiveRate: safe(fp, fp + tn),
    falseNegativeRate: safe(fn, fn + tp)
  };
}

export function bayesPosterior(prevalence, sensitivity, specificity) {
  const truePositive = sensitivity * prevalence;
  const falsePositive = (1 - specificity) * (1 - prevalence);
  return truePositive / Math.max(truePositive + falsePositive, Number.EPSILON);
}

export function bayesTestSummary(input) {
  const diseased = input.population * input.prevalence;
  const healthy = input.population - diseased;
  const truePositive = diseased * input.sensitivity;
  const falseNegative = diseased - truePositive;
  const trueNegative = healthy * input.specificity;
  const falsePositive = healthy - trueNegative;
  const positiveTests = truePositive + falsePositive;
  const negativeTests = trueNegative + falseNegative;
  return {
    diseased,
    healthy,
    truePositive,
    falsePositive,
    trueNegative,
    falseNegative,
    positiveTests,
    negativeTests,
    positivePredictiveValue: positiveTests === 0 ? 0 : truePositive / positiveTests,
    negativePredictiveValue: negativeTests === 0 ? 0 : trueNegative / negativeTests,
    likelihoodRatioPositive: input.specificity === 1 ? Infinity : input.sensitivity / (1 - input.specificity),
    likelihoodRatioNegative: input.specificity === 0 ? Infinity : (1 - input.sensitivity) / input.specificity
  };
}

export function linearRegression(points) {
  const xValues = points.map((point) => point.x);
  const yValues = points.map((point) => point.y);
  const xBar = mean(xValues);
  const yBar = mean(yValues);
  const sxx = points.reduce((total, point) => total + (point.x - xBar) ** 2, 0);
  const sxy = points.reduce((total, point) => total + (point.x - xBar) * (point.y - yBar), 0);
  const slope = sxx === 0 ? 0 : sxy / sxx;
  const intercept = yBar - slope * xBar;
  const fitted = points.map((point) => intercept + slope * point.x);
  const residuals = points.map((point, index) => point.y - fitted[index]);
  const sse = residuals.reduce((total, residual) => total + residual ** 2, 0);
  const sst = points.reduce((total, point) => total + (point.y - yBar) ** 2, 0);
  const rSquared = sst === 0 ? 1 : 1 - sse / sst;
  const adjustedRSquared = points.length <= 2 ? rSquared : 1 - (1 - rSquared) * ((points.length - 1) / (points.length - 2));
  const mse = points.length <= 2 ? 0 : sse / (points.length - 2);
  const residualStandardError = Math.sqrt(mse);
  const leverage = points.map((point) => (points.length === 0 || sxx === 0 ? 0 : 1 / points.length + ((point.x - xBar) ** 2) / sxx));
  const cooksDistance = residuals.map((residual, index) => {
    const h = leverage[index];
    const denominator = 2 * Math.max(mse, Number.EPSILON);
    return ((residual ** 2) / denominator) * (h / Math.max((1 - h) ** 2, Number.EPSILON));
  });
  return {
    slope,
    intercept,
    fitted,
    residuals,
    rSquared,
    adjustedRSquared,
    residualStandardError,
    leverage,
    cooksDistance,
    maxCookDistance: Math.max(...cooksDistance)
  };
}

export function makeSeededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
}

export function sampleNormal(random, meanValue = 0, sd = 1) {
  const u1 = Math.max(random(), Number.EPSILON);
  const u2 = random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return meanValue + z * sd;
}

export function monteCarloMeans(input) {
  const random = makeSeededRandom(input.seed ?? 12345);
  const means = [];
  for (let rep = 0; rep < input.replications; rep += 1) {
    const sample = [];
    for (let index = 0; index < input.sampleSize; index += 1) {
      if (input.distribution === "normal") sample.push(sampleNormal(random, 0, 1));
      if (input.distribution === "uniform") sample.push(random() * 2 - 1);
      if (input.distribution === "skewed") sample.push(-Math.log(Math.max(random(), Number.EPSILON)));
    }
    means.push(mean(sample));
  }
  return means;
}

export function percentile(values, probability) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = (sorted.length - 1) * probability;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
}

export function bootstrapMeanInterval(values, replications = 1000, seed = 12345) {
  const random = makeSeededRandom(seed);
  const estimates = [];
  for (let rep = 0; rep < replications; rep += 1) {
    const sample = [];
    for (let index = 0; index < values.length; index += 1) {
      sample.push(values[Math.floor(random() * values.length)]);
    }
    estimates.push(mean(sample));
  }
  return {
    estimate: mean(values),
    lower: percentile(estimates, 0.025),
    upper: percentile(estimates, 0.975),
    estimates
  };
}

export function recommendTest(input) {
  if (input.outcome === "categorical") return input.groups > 2 ? "Chi-square test" : "Fisher's exact test or two-proportion z-test";
  if (input.outcome === "count") return "Poisson or negative binomial regression";
  if (input.groups <= 1) return "One-sample t-test or bootstrap confidence interval";
  if (input.paired) return input.normal ? "Paired t-test" : "Wilcoxon signed-rank test";
  if (input.groups === 2) return input.normal ? "Two-sample t-test" : "Mann-Whitney U test";
  return input.normal ? "ANOVA" : "Kruskal-Wallis test";
}
