"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  bayesTestSummary,
  bootstrapMeanInterval,
  linearRegression,
  mean,
  monteCarloMeans,
  normalConfidenceInterval,
  percentile,
  standardDeviation,
  type Point
} from "@stats-portfolio/stat-core";
import { PortfolioApp } from "@/lib/apps";

const baseRegressionData: Point[] = [
  { x: 1, y: 3.3 },
  { x: 2, y: 4.8 },
  { x: 3, y: 6.9 },
  { x: 4, y: 8.1 },
  { x: 5, y: 9.7 },
  { x: 6, y: 11.5 },
  { x: 7, y: 12.1 },
  { x: 8, y: 15.2 },
  { x: 9, y: 15.8 },
  { x: 10, y: 18.5 },
  { x: 11, y: 19.2 },
  { x: 12, y: 21.6 }
];

const bootstrapSample = [18, 21, 22, 24, 25, 27, 31, 35, 42, 55, 68, 73];
const timeSeriesBase = [114, 118, 121, 119, 126, 131, 137, 141, 138, 146, 152, 158, 161, 166, 171, 175, 181, 188];

export function FunctionalRegressionLab({ app }: { app: PortfolioApp }) {
  const [noise, setNoise] = useState(18);
  const [outlier, setOutlier] = useState(0);

  const points = useMemo(() => {
    return baseRegressionData.map((point, index) => ({
      x: point.x,
      y: point.y + Math.sin(index * 1.7) * (noise / 14) + (index === 10 ? outlier / 7 : 0)
    }));
  }, [noise, outlier]);

  const model = useMemo(() => linearRegression(points), [points]);
  const residualCi = normalConfidenceInterval(model.residuals);
  const xMin = Math.min(...points.map((point) => point.x));
  const xMax = Math.max(...points.map((point) => point.x));
  const yMin = Math.min(...points.map((point) => point.y), model.intercept + model.slope * xMin);
  const yMax = Math.max(...points.map((point) => point.y), model.intercept + model.slope * xMax);
  const scaleX = (x: number) => 45 + ((x - xMin) / (xMax - xMin)) * 760;
  const scaleY = (y: number) => 330 - ((y - yMin) / Math.max(yMax - yMin, 1)) * 260;

  return (
    <FunctionalShell
      app={app}
      badge="functional regression model"
      intro="Fit an ordinary least squares model to the generated dataset and inspect real residuals, leverage, Cook's distance, R2, and interval behavior."
      controls={
        <>
          <label>Noise level <input type="range" min="0" max="60" value={noise} onChange={(event) => setNoise(Number(event.target.value))} /></label>
          <label>Influential point <input type="range" min="-40" max="70" value={outlier} onChange={(event) => setOutlier(Number(event.target.value))} /></label>
        </>
      }
      metrics={[
        ["Slope", model.slope.toFixed(3)],
        ["Intercept", model.intercept.toFixed(3)],
        ["R2", model.rSquared.toFixed(3)],
        ["Adj. R2", model.adjustedRSquared.toFixed(3)],
        ["Residual SE", model.residualStandardError.toFixed(3)],
        ["Max Cook's D", model.maxCookDistance.toFixed(3)]
      ]}
      notes={[
        "The blue line is the fitted OLS regression line.",
        "Vertical residual segments show each observation's error.",
        "Cook's distance rises when the outlier slider creates an influential observation."
      ]}
    >
      <svg className="functional-plot" viewBox="0 0 860 360" role="img" aria-label="OLS regression diagnostic plot">
        <line x1={scaleX(xMin)} x2={scaleX(xMax)} y1={scaleY(model.intercept + model.slope * xMin)} y2={scaleY(model.intercept + model.slope * xMax)} className="fit-line" />
        {points.map((point, index) => {
          const fitted = model.fitted[index];
          return <line key={`residual-${index}`} x1={scaleX(point.x)} x2={scaleX(point.x)} y1={scaleY(point.y)} y2={scaleY(fitted)} className="residual-line" />;
        })}
        {points.map((point, index) => (
          <circle key={index} cx={scaleX(point.x)} cy={scaleY(point.y)} r={5 + model.leverage[index] * 18} className="data-point" />
        ))}
      </svg>
      <div className="functional-table">
        <span>Residual 95% band</span>
        <strong>{residualCi.lower.toFixed(2)} to {residualCi.upper.toFixed(2)}</strong>
      </div>
    </FunctionalShell>
  );
}

export function FunctionalBayesSimulator({ app }: { app: PortfolioApp }) {
  const [prevalence, setPrevalence] = useState(2);
  const [sensitivity, setSensitivity] = useState(94);
  const [specificity, setSpecificity] = useState(96);
  const [population, setPopulation] = useState(10000);

  const summary = bayesTestSummary({
    prevalence: prevalence / 100,
    sensitivity: sensitivity / 100,
    specificity: specificity / 100,
    population
  });
  const dots = makeTestDots(summary.truePositive, summary.falsePositive, summary.falseNegative, summary.trueNegative);

  return (
    <FunctionalShell
      app={app}
      badge="functional Bayesian calculator"
      intro="Move the disease prevalence and test-quality sliders to compute real positive predictive value, negative predictive value, false positives, and likelihood ratios."
      controls={
        <>
          <label>Prevalence: {prevalence}% <input type="range" min="0.1" max="30" step="0.1" value={prevalence} onChange={(event) => setPrevalence(Number(event.target.value))} /></label>
          <label>Sensitivity: {sensitivity}% <input type="range" min="50" max="99.9" step="0.1" value={sensitivity} onChange={(event) => setSensitivity(Number(event.target.value))} /></label>
          <label>Specificity: {specificity}% <input type="range" min="50" max="99.9" step="0.1" value={specificity} onChange={(event) => setSpecificity(Number(event.target.value))} /></label>
          <label>Population: {population.toLocaleString()} <input type="range" min="1000" max="100000" step="1000" value={population} onChange={(event) => setPopulation(Number(event.target.value))} /></label>
        </>
      }
      metrics={[
        ["PPV", `${(summary.positivePredictiveValue * 100).toFixed(1)}%`],
        ["NPV", `${(summary.negativePredictiveValue * 100).toFixed(1)}%`],
        ["True positives", Math.round(summary.truePositive).toLocaleString()],
        ["False positives", Math.round(summary.falsePositive).toLocaleString()],
        ["LR+", finite(summary.likelihoodRatioPositive)],
        ["LR-", finite(summary.likelihoodRatioNegative)]
      ]}
      notes={[
        "A rare disease can produce many false positives even with a good test.",
        "PPV answers: among people who test positive, what proportion truly have the disease?",
        "Likelihood ratios show how strongly a test result updates prior odds."
      ]}
    >
      <div className="functional-dot-grid" aria-label="Disease testing outcome grid">
        {dots.map((item, index) => <span className={item} key={index} />)}
      </div>
      <div className="legend-row">
        <span><i className="tp" /> True positive</span>
        <span><i className="fp" /> False positive</span>
        <span><i className="fn" /> False negative</span>
        <span><i className="tn" /> True negative</span>
      </div>
    </FunctionalShell>
  );
}

export function FunctionalMonteCarloStudio({ app }: { app: PortfolioApp }) {
  const [distribution, setDistribution] = useState<"normal" | "uniform" | "skewed">("skewed");
  const [sampleSize, setSampleSize] = useState(30);
  const [replications, setReplications] = useState(800);

  const means = useMemo(() => monteCarloMeans({ distribution, sampleSize, replications, seed: 2026 }), [distribution, sampleSize, replications]);
  const ci = normalConfidenceInterval(means);
  const bootstrap = useMemo(() => bootstrapMeanInterval(bootstrapSample, replications, 91), [replications]);
  const histogram = makeHistogram(means, 18);
  const bootHistogram = makeHistogram(bootstrap.estimates, 18);

  return (
    <FunctionalShell
      app={app}
      badge="functional simulation engine"
      intro="Run deterministic Monte Carlo replications to see the central limit theorem, sampling variability, and bootstrap confidence intervals in action."
      controls={
        <>
          <label>Distribution
            <select value={distribution} onChange={(event) => setDistribution(event.target.value as "normal" | "uniform" | "skewed")}>
              <option value="normal">Normal</option>
              <option value="uniform">Uniform</option>
              <option value="skewed">Skewed exponential</option>
            </select>
          </label>
          <label>Sample size: {sampleSize} <input type="range" min="5" max="150" value={sampleSize} onChange={(event) => setSampleSize(Number(event.target.value))} /></label>
          <label>Replications: {replications} <input type="range" min="100" max="2000" step="100" value={replications} onChange={(event) => setReplications(Number(event.target.value))} /></label>
        </>
      }
      metrics={[
        ["Mean of means", mean(means).toFixed(3)],
        ["SD of means", standardDeviation(means).toFixed(3)],
        ["Normal CI", `${ci.lower.toFixed(3)} to ${ci.upper.toFixed(3)}`],
        ["Bootstrap mean", bootstrap.estimate.toFixed(2)],
        ["Bootstrap CI", `${bootstrap.lower.toFixed(2)} to ${bootstrap.upper.toFixed(2)}`],
        ["95th percentile", percentile(means, 0.95).toFixed(3)]
      ]}
      notes={[
        "Increasing sample size narrows the sampling distribution of the mean.",
        "The skewed source distribution still produces a more normal sampling distribution as n grows.",
        "The bootstrap interval resamples the observed sample without assuming a parametric model."
      ]}
    >
      <div className="dual-histograms">
        <Histogram bars={histogram} title="Monte Carlo sampling means" />
        <Histogram bars={bootHistogram} title="Bootstrap mean estimates" />
      </div>
    </FunctionalShell>
  );
}

export function FunctionalSamplingSimulator({ app }: { app: PortfolioApp }) {
  const [nonresponse, setNonresponse] = useState(22);
  const [sampleSize, setSampleSize] = useState(900);
  const strata = [
    { label: "Urban", population: 0.42, support: 0.54, response: 0.78 },
    { label: "Suburban", population: 0.28, support: 0.49, response: 0.7 },
    { label: "Rural", population: 0.18, support: 0.41, response: 0.62 },
    { label: "Youth", population: 0.12, support: 0.61, response: 0.52 }
  ];
  const responsePenalty = nonresponse / 100;
  const observedWeights = strata.map((stratum) => stratum.population * Math.max(0.05, stratum.response - responsePenalty * 0.35));
  const observedTotal = observedWeights.reduce((total, value) => total + value, 0);
  const unweighted = strata.reduce((total, stratum, index) => total + (observedWeights[index] / observedTotal) * stratum.support, 0);
  const weighted = strata.reduce((total, stratum) => total + stratum.population * stratum.support, 0);
  const weights = strata.map((stratum, index) => stratum.population / (observedWeights[index] / observedTotal));
  const ess = (sampleSize * (weights.reduce((a, b) => a + b, 0) ** 2)) / (weights.length * weights.reduce((a, b) => a + b ** 2, 0));
  const moe = 1.96 * Math.sqrt((weighted * (1 - weighted)) / ess);

  return (
    <FunctionalShell
      app={app}
      badge="functional sampling simulator"
      intro="Compare an unweighted sample estimate with a post-stratified estimate when response rates differ by group."
      controls={<><label>Nonresponse pressure: {nonresponse}% <input type="range" min="0" max="60" value={nonresponse} onChange={(e) => setNonresponse(Number(e.target.value))} /></label><label>Nominal sample size: {sampleSize} <input type="range" min="200" max="3000" step="100" value={sampleSize} onChange={(e) => setSampleSize(Number(e.target.value))} /></label></>}
      metrics={[["Weighted estimate", `${(weighted * 100).toFixed(1)}%`], ["Unweighted estimate", `${(unweighted * 100).toFixed(1)}%`], ["Bias corrected", `${((weighted - unweighted) * 100).toFixed(1)} pts`], ["Effective n", `${Math.round(ess)}`], ["Margin of error", `+/- ${(moe * 100).toFixed(1)} pts`], ["Design effect", `${(sampleSize / ess).toFixed(2)}`]]}
      notes={["Unequal response rates can bias unweighted estimates.", "Post-stratification restores population proportions.", "Weighting reduces bias but lowers effective sample size."]}
    >
      <GroupedBars rows={strata.map((s, i) => ({ label: s.label, first: s.population, second: observedWeights[i] / observedTotal }))} firstLabel="Population share" secondLabel="Respondent share" color={app.accent} />
    </FunctionalShell>
  );
}

export function FunctionalCategoricalExplorer({ app }: { app: PortfolioApp }) {
  const [exposure, setExposure] = useState(55);
  const [effect, setEffect] = useState(28);
  const exposed = 240;
  const unexposed = 260;
  const p0 = 0.18;
  const p1 = Math.min(0.82, p0 + effect / 100);
  const a = Math.round(exposed * exposure / 100 * p1);
  const b = Math.round(exposed * exposure / 100 - a);
  const c = Math.round(unexposed * p0);
  const d = unexposed - c;
  const oddsRatio = (a * d) / Math.max(b * c, 1);
  const riskRatio = (a / Math.max(a + b, 1)) / (c / Math.max(c + d, 1));
  const total = a + b + c + d;
  const expectedA = ((a + b) * (a + c)) / total;
  const chiSquare = [a, b, c, d].reduce((sum, observed, index) => {
    const expected = [expectedA, a + b - expectedA, a + c - expectedA, d + c - (a + c - expectedA)][index];
    return sum + ((observed - expected) ** 2) / Math.max(expected, 1);
  }, 0);

  return (
    <FunctionalShell
      app={app}
      badge="functional categorical analysis"
      intro="Build a 2x2 table and compute odds ratio, risk ratio, expected counts, and a chi-square association statistic."
      controls={<><label>Exposure prevalence: {exposure}% <input type="range" min="20" max="90" value={exposure} onChange={(e) => setExposure(Number(e.target.value))} /></label><label>Effect increase: {effect} pts <input type="range" min="0" max="55" value={effect} onChange={(e) => setEffect(Number(e.target.value))} /></label></>}
      metrics={[["Odds ratio", oddsRatio.toFixed(2)], ["Risk ratio", riskRatio.toFixed(2)], ["Chi-square", chiSquare.toFixed(2)], ["Exposed cases", `${a}`], ["Unexposed cases", `${c}`], ["Min expected", Math.min(expectedA, a + b - expectedA, a + c - expectedA).toFixed(1)]]}
      notes={["Odds ratios compare odds, not probabilities.", "Expected counts warn when asymptotic chi-square logic is weak.", "Risk ratios are often easier to interpret in cohort-style examples."]}
    >
      <div className="contingency-grid"><strong></strong><strong>Case</strong><strong>No case</strong><strong>Exposed</strong><span>{a}</span><span>{b}</span><strong>Unexposed</strong><span>{c}</span><span>{d}</span></div>
    </FunctionalShell>
  );
}

export function FunctionalTimeSeriesHub({ app }: { app: PortfolioApp }) {
  const [horizon, setHorizon] = useState(6);
  const [seasonality, setSeasonality] = useState(8);
  const series = timeSeriesBase.map((value, index) => value + Math.sin(index / 2) * seasonality);
  const model = linearRegression(series.map((y, index) => ({ x: index + 1, y })));
  const forecast = Array.from({ length: horizon }, (_, i) => model.intercept + model.slope * (series.length + i + 1));
  const residualSd = standardDeviation(model.residuals);
  const smape = mean(series.map((y, i) => Math.abs(y - model.fitted[i]) / ((Math.abs(y) + Math.abs(model.fitted[i])) / 2))) * 100;

  return (
    <FunctionalShell
      app={app}
      badge="functional forecasting model"
      intro="Fit a trend baseline, inspect residual error, and extend a forecast horizon with uncertainty bands."
      controls={<><label>Forecast horizon: {horizon} <input type="range" min="2" max="12" value={horizon} onChange={(e) => setHorizon(Number(e.target.value))} /></label><label>Seasonality strength: {seasonality} <input type="range" min="0" max="20" value={seasonality} onChange={(e) => setSeasonality(Number(e.target.value))} /></label></>}
      metrics={[["Trend/month", model.slope.toFixed(2)], ["sMAPE", `${smape.toFixed(1)}%`], ["Residual SD", residualSd.toFixed(2)], ["Next forecast", forecast[0].toFixed(1)], ["Upper band", (forecast[horizon - 1] + 1.96 * residualSd).toFixed(1)], ["Lower band", (forecast[horizon - 1] - 1.96 * residualSd).toFixed(1)]]}
      notes={["The fitted baseline is intentionally simple and auditable.", "Forecast intervals widen with residual uncertainty.", "Seasonality controls reveal when a trend-only model is insufficient."]}
    >
      <LineBars values={[...series, ...forecast]} splitAt={series.length} color={app.accent} />
    </FunctionalShell>
  );
}

export function FunctionalMLArena({ app }: { app: PortfolioApp }) {
  const [threshold, setThreshold] = useState(50);
  const [signal, setSignal] = useState(70);
  const positives = 220;
  const negatives = 280;
  const tpr = Math.max(0.18, Math.min(0.96, (signal + (100 - threshold) * 0.35) / 100));
  const fpr = Math.max(0.03, Math.min(0.72, ((100 - signal) + (100 - threshold) * 0.45) / 100));
  const counts = { tp: Math.round(positives * tpr), fn: Math.round(positives * (1 - tpr)), fp: Math.round(negatives * fpr), tn: Math.round(negatives * (1 - fpr)) };
  const precision = counts.tp / Math.max(counts.tp + counts.fp, 1);
  const recall = counts.tp / Math.max(counts.tp + counts.fn, 1);
  const specificity = counts.tn / Math.max(counts.tn + counts.fp, 1);
  const f1 = 2 * precision * recall / Math.max(precision + recall, Number.EPSILON);

  return (
    <FunctionalShell
      app={app}
      badge="functional classifier evaluator"
      intro="Move the threshold and signal strength to recompute a confusion matrix, precision, recall, specificity, and F1."
      controls={<><label>Decision threshold: {threshold}% <input type="range" min="5" max="95" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} /></label><label>Model signal: {signal}% <input type="range" min="35" max="95" value={signal} onChange={(e) => setSignal(Number(e.target.value))} /></label></>}
      metrics={[["Precision", `${(precision * 100).toFixed(1)}%`], ["Recall", `${(recall * 100).toFixed(1)}%`], ["Specificity", `${(specificity * 100).toFixed(1)}%`], ["F1", f1.toFixed(3)], ["False positives", `${counts.fp}`], ["False negatives", `${counts.fn}`]]}
      notes={["Threshold choice changes errors even when model scores are unchanged.", "Precision and recall move in opposite directions in many applications.", "Confusion matrices make model tradeoffs concrete."]}
    >
      <ConfusionMatrix counts={counts} color={app.accent} />
    </FunctionalShell>
  );
}

export function FunctionalABTestingLab({ app }: { app: PortfolioApp }) {
  const [baseline, setBaseline] = useState(12);
  const [lift, setLift] = useState(3);
  const [sample, setSample] = useState(1200);
  const p1 = baseline / 100;
  const p2 = (baseline + lift) / 100;
  const se = Math.sqrt((p1 * (1 - p1)) / sample + (p2 * (1 - p2)) / sample);
  const z = (p2 - p1) / se;
  const ciLow = (p2 - p1) - 1.96 * se;
  const ciHigh = (p2 - p1) + 1.96 * se;
  const approxPower = 1 / (1 + Math.exp(-(Math.abs(z) - 1.96) * 1.4));

  return (
    <FunctionalShell
      app={app}
      badge="functional experiment calculator"
      intro="Plan and evaluate a two-proportion A/B test with standard error, z statistic, confidence interval, and approximate power."
      controls={<><label>Baseline conversion: {baseline}% <input type="range" min="2" max="40" value={baseline} onChange={(e) => setBaseline(Number(e.target.value))} /></label><label>Lift: {lift} pts <input type="range" min="0.5" max="12" step="0.5" value={lift} onChange={(e) => setLift(Number(e.target.value))} /></label><label>Sample per group: {sample} <input type="range" min="100" max="10000" step="100" value={sample} onChange={(e) => setSample(Number(e.target.value))} /></label></>}
      metrics={[["Control rate", `${baseline.toFixed(1)}%`], ["Treatment rate", `${(baseline + lift).toFixed(1)}%`], ["Z statistic", z.toFixed(2)], ["Effect CI", `${(ciLow * 100).toFixed(1)} to ${(ciHigh * 100).toFixed(1)} pts`], ["Approx. power", `${(approxPower * 100).toFixed(0)}%`], ["Decision", ciLow > 0 ? "Ship" : "Keep testing"]]}
      notes={["Power improves with larger samples and larger effects.", "Confidence intervals show practical uncertainty around lift.", "A statistically detectable lift still needs business value."]}
    >
      <GroupedBars rows={[{ label: "Control", first: p1, second: 0 }, { label: "Treatment", first: p2, second: 0 }]} firstLabel="Conversion rate" secondLabel="" color={app.accent} />
    </FunctionalShell>
  );
}

export function FunctionalFinancialRisk({ app }: { app: PortfolioApp }) {
  const [equity, setEquity] = useState(65);
  const [paths, setPaths] = useState(1000);
  const returns = useMemo(() => monteCarloMeans({ replications: paths, sampleSize: 21, distribution: "normal", seed: equity * 13 }).map((r) => r * (equity / 100) * 0.8 + 0.002), [equity, paths]);
  const var95 = percentile(returns, 0.05);
  const cvar = mean(returns.filter((value) => value <= var95));
  const vol = standardDeviation(returns) * Math.sqrt(252 / 21);
  const expected = mean(returns) * 12;

  return (
    <FunctionalShell
      app={app}
      badge="functional risk simulator"
      intro="Simulate portfolio returns and compute expected return, volatility, Value at Risk, and expected shortfall."
      controls={<><label>Equity allocation: {equity}% <input type="range" min="0" max="100" value={equity} onChange={(e) => setEquity(Number(e.target.value))} /></label><label>Simulation paths: {paths} <input type="range" min="200" max="3000" step="100" value={paths} onChange={(e) => setPaths(Number(e.target.value))} /></label></>}
      metrics={[["Expected annual", `${(expected * 100).toFixed(1)}%`], ["Annual volatility", `${(vol * 100).toFixed(1)}%`], ["95% VaR", `${(var95 * 100).toFixed(2)}%`], ["Expected shortfall", `${(cvar * 100).toFixed(2)}%`], ["Paths", `${paths}`], ["Equity weight", `${equity}%`]]}
      notes={["VaR estimates a loss quantile, not a worst-case guarantee.", "Expected shortfall averages outcomes beyond VaR.", "Allocation changes both expected return and volatility."]}
    >
      <Histogram bars={makeHistogram(returns, 18)} title="Simulated portfolio return distribution" />
    </FunctionalShell>
  );
}

export function FunctionalTestRecommender({ app }: { app: PortfolioApp }) {
  const [outcome, setOutcome] = useState<"continuous" | "categorical" | "count">("continuous");
  const [groups, setGroups] = useState(2);
  const [paired, setPaired] = useState(false);
  const [normal, setNormal] = useState(true);
  const recommendation = outcome === "continuous"
    ? (groups <= 1 ? "One-sample t-test or bootstrap CI" : paired ? (normal ? "Paired t-test" : "Wilcoxon signed-rank test") : groups === 2 ? (normal ? "Two-sample t-test" : "Mann-Whitney U test") : (normal ? "ANOVA" : "Kruskal-Wallis test"))
    : outcome === "categorical" ? (groups > 2 ? "Chi-square test" : "Fisher exact or two-proportion z-test") : "Poisson or negative binomial regression";

  return (
    <FunctionalShell
      app={app}
      badge="functional test recommender"
      intro="Choose the outcome type, number of groups, pairing, and distributional assumption to get an appropriate statistical test."
      controls={<><label>Outcome<select value={outcome} onChange={(e) => setOutcome(e.target.value as "continuous" | "categorical" | "count")}><option value="continuous">Continuous</option><option value="categorical">Categorical</option><option value="count">Count</option></select></label><label>Groups: {groups}<input type="range" min="1" max="5" value={groups} onChange={(e) => setGroups(Number(e.target.value))} /></label><label><input type="checkbox" checked={paired} onChange={(e) => setPaired(e.target.checked)} /> Paired/repeated design</label><label><input type="checkbox" checked={normal} onChange={(e) => setNormal(e.target.checked)} /> Normality plausible</label></>}
      metrics={[["Recommended test", recommendation], ["Outcome", outcome], ["Groups", `${groups}`], ["Paired", paired ? "Yes" : "No"], ["Normality", normal ? "Plausible" : "Use robust path"], ["Effect size", outcome === "continuous" ? "Mean difference" : "Ratio/difference"]]}
      notes={["Test choice depends on design, not just sample size.", "Assumption checks can move the recommendation to a robust alternative.", "The app pairs each test with an effect-size interpretation."]}
    >
      <div className="decision-visual"><div>Outcome</div><div>Groups</div><div>Pairing</div><div>Assumptions</div><div className="final">{recommendation}</div></div>
    </FunctionalShell>
  );
}

function FunctionalShell({
  app,
  badge,
  intro,
  controls,
  metrics,
  notes,
  children
}: {
  app: PortfolioApp;
  badge: string;
  intro: string;
  controls: ReactNode;
  metrics: Array<[string, string]>;
  notes: string[];
  children: ReactNode;
}) {
  return (
    <div className="workspace functional-workspace">
      <section className="workspace-main">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">{app.area}</p>
            <h1>{app.title}</h1>
          </div>
          <span className="status-pill">{badge}</span>
        </div>
        <p className="lead">{intro}</p>
        <div className="controls-row functional-controls">{controls}</div>
        <div className="functional-stage">{children}</div>
      </section>
      <aside className="insight-panel">
        {metrics.map(([label, value], index) => (
          <div className={`insight-card ${index === 0 ? "primary" : ""}`} key={label} style={{ "--accent": app.accent } as CSSProperties & Record<"--accent", string>}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </aside>
      <section className="method-grid">
        <div>
          <h2>What This App Computes</h2>
          <ul>{notes.map((note) => <li key={note}>{note}</li>)}</ul>
        </div>
        <div>
          <h2>Methods Demonstrated</h2>
          <ul>{app.methods.map((method) => <li key={method}>{method}</li>)}</ul>
        </div>
        <div>
          <h2>Statistical Acumen</h2>
          <ul>{app.acumen.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </section>
    </div>
  );
}

function Histogram({ bars, title }: { bars: Array<{ label: string; count: number }>; title: string }) {
  const max = Math.max(...bars.map((bar) => bar.count), 1);
  return (
    <div className="histogram-panel">
      <h3>{title}</h3>
      <div className="histogram-bars">
        {bars.map((bar) => (
          <span key={bar.label} style={{ height: `${Math.max(4, (bar.count / max) * 100)}%` }} title={`${bar.label}: ${bar.count}`} />
        ))}
      </div>
    </div>
  );
}

function GroupedBars({ rows, firstLabel, secondLabel, color }: { rows: Array<{ label: string; first: number; second: number }>; firstLabel: string; secondLabel: string; color: string }) {
  return (
    <div className="grouped-bars">
      <div className="legend-row"><span><i style={{ background: color }} /> {firstLabel}</span>{secondLabel ? <span><i className="tn" /> {secondLabel}</span> : null}</div>
      {rows.map((row) => (
        <div key={row.label}>
          <strong>{row.label}</strong>
          <span><i style={{ width: `${Math.min(row.first * 100, 100)}%`, background: color }} /></span>
          {secondLabel ? <span><i style={{ width: `${Math.min(row.second * 100, 100)}%` }} /></span> : null}
        </div>
      ))}
    </div>
  );
}

function LineBars({ values, splitAt, color }: { values: number[]; splitAt: number; color: string }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  return (
    <div className="line-bars">
      {values.map((value, index) => (
        <span key={index} className={index >= splitAt ? "forecast" : ""} style={{ height: `${18 + ((value - min) / Math.max(max - min, 1)) * 78}%`, background: index >= splitAt ? "#c7d4dd" : color }} title={`${value.toFixed(1)}`} />
      ))}
    </div>
  );
}

function ConfusionMatrix({ counts, color }: { counts: { tp: number; fp: number; fn: number; tn: number }; color: string }) {
  return (
    <div className="confusion-functional">
      <div style={{ background: color }}><span>True positive</span><strong>{counts.tp}</strong></div>
      <div><span>False positive</span><strong>{counts.fp}</strong></div>
      <div><span>False negative</span><strong>{counts.fn}</strong></div>
      <div style={{ background: color }}><span>True negative</span><strong>{counts.tn}</strong></div>
    </div>
  );
}

function makeHistogram(values: number[], binCount: number) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const width = Math.max((max - min) / binCount, Number.EPSILON);
  const counts = Array.from({ length: binCount }, (_, index) => ({
    label: `${(min + index * width).toFixed(2)}`,
    count: 0
  }));
  values.forEach((value) => {
    const index = Math.min(binCount - 1, Math.floor((value - min) / width));
    counts[index].count += 1;
  });
  return counts;
}

function makeTestDots(tp: number, fp: number, fn: number, tn: number) {
  const total = tp + fp + fn + tn;
  const scale = 100 / Math.max(total, 1);
  const counts = {
    tp: Math.round(tp * scale),
    fp: Math.round(fp * scale),
    fn: Math.round(fn * scale)
  };
  const used = counts.tp + counts.fp + counts.fn;
  const tnCount = Math.max(0, 100 - used);
  return [
    ...Array.from({ length: counts.tp }, () => "tp"),
    ...Array.from({ length: counts.fp }, () => "fp"),
    ...Array.from({ length: counts.fn }, () => "fn"),
    ...Array.from({ length: tnCount }, () => "tn")
  ];
}

function finite(value: number) {
  return Number.isFinite(value) ? value.toFixed(2) : "Infinity";
}
