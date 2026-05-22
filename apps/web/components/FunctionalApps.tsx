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
