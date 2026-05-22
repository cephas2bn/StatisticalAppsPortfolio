"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Activity, BarChart3, BookOpenCheck, Database, RefreshCcw } from "lucide-react";
import { bayesPosterior, classificationMetrics, designEffect, normalConfidenceInterval, recommendTest } from "@stats-portfolio/stat-core";
import { PortfolioApp } from "@/lib/apps";
import { makeComparison, makeSeries } from "@/lib/demo-series";
import { FunctionalBayesSimulator, FunctionalMonteCarloStudio, FunctionalRegressionLab } from "./FunctionalApps";
import { MiniChart } from "./MiniChart";

type AppMode =
  | "regression"
  | "sampling"
  | "categorical"
  | "bayes"
  | "forecast"
  | "health"
  | "ml"
  | "vision"
  | "simulation"
  | "experiment"
  | "sports"
  | "finance"
  | "recommender"
  | "fairness";

function getMode(slug: string): AppMode {
  if (slug.includes("bayesian")) return "bayes";
  if (slug.includes("regression") || slug.includes("housing")) return "regression";
  if (slug.includes("polling") || slug.includes("survey")) return "sampling";
  if (slug.includes("categorical") || slug.includes("crime")) return "categorical";
  if (slug.includes("time-series") || slug.includes("climate")) return "forecast";
  if (slug.includes("public-health")) return "health";
  if (slug.includes("deep-learning")) return "vision";
  if (slug.includes("monte-carlo") || slug.includes("bootstrap")) return "simulation";
  if (slug.includes("ab-testing")) return "experiment";
  if (slug.includes("sports")) return "sports";
  if (slug.includes("financial")) return "finance";
  if (slug.includes("recommender")) return "recommender";
  if (slug.includes("fairness")) return "fairness";
  return "ml";
}

const modeCopy: Record<AppMode, { x: string; y: string; panel: string }> = {
  regression: { x: "Regularization strength", y: "Train/test split", panel: "Residual and fitted-value diagnostics" },
  sampling: { x: "Nonresponse bias", y: "Sample size", panel: "Sampling design comparison" },
  categorical: { x: "Exposure imbalance", y: "Cell count", panel: "Contingency and effect-size view" },
  bayes: { x: "Prevalence", y: "Test accuracy", panel: "Bayesian update from test evidence" },
  forecast: { x: "Seasonality", y: "Forecast horizon", panel: "Observed trend and forecast interval" },
  health: { x: "Baseline risk", y: "Population size", panel: "Rate-normalized health risk" },
  ml: { x: "Decision threshold", y: "Validation size", panel: "Classifier threshold performance" },
  vision: { x: "Confidence cutoff", y: "Augmentation level", panel: "Image prediction and saliency review" },
  simulation: { x: "Distribution skew", y: "Replications", panel: "Repeated-sampling distribution" },
  experiment: { x: "Minimum lift", y: "Sample size", panel: "Experiment power and decision risk" },
  sports: { x: "Home advantage", y: "Games backtested", panel: "Win-probability calibration" },
  finance: { x: "Equity allocation", y: "Simulation paths", panel: "Portfolio risk simulation" },
  recommender: { x: "Normality confidence", y: "Sample size", panel: "Study-design decision path" },
  fairness: { x: "Threshold", y: "Validation size", panel: "Subgroup fairness comparison" }
};

export function AppWorkspace({ app }: { app: PortfolioApp }) {
  if (app.slug === "regression-diagnostics-lab") return <FunctionalRegressionLab app={app} />;
  if (app.slug === "bayesian-disease-testing-simulator") return <FunctionalBayesSimulator app={app} />;
  if (app.slug === "monte-carlo-simulation-studio") return <FunctionalMonteCarloStudio app={app} />;

  return <GenericAppWorkspace app={app} />;
}

function GenericAppWorkspace({ app }: { app: PortfolioApp }) {
  const [intensity, setIntensity] = useState(55);
  const [sampleSize, setSampleSize] = useState(320);
  const mode = getMode(app.slug);
  const copy = modeCopy[mode];
  const series = useMemo(() => makeSeries(app.id + Math.round(intensity / 10), 18), [app.id, intensity]);
  const comparison = useMemo(() => makeComparison(app), [app]);
  const ci = normalConfidenceInterval(series);
  const deff = designEffect([1, 1.3, 0.8, 2.1, 1.5, 0.9, 1.2]);
  const posterior = bayesPosterior(intensity / 100, 0.91, 0.94);
  const metrics = classificationMetrics({
    tp: Math.round(sampleSize * 0.32),
    fp: Math.round(sampleSize * 0.08),
    tn: Math.round(sampleSize * 0.47),
    fn: Math.round(sampleSize * 0.13)
  });
  const testRecommendation = recommendTest({
    outcome: app.area === "Categorical Data" ? "categorical" : "continuous",
    groups: app.area === "Mathematical Statistics" ? 2 : 3,
    paired: app.slug.includes("testing"),
    normal: intensity > 45
  });
  const insightCards = buildInsightCards(mode, app, ci, posterior, metrics, deff, testRecommendation, intensity);

  return (
    <div className="workspace">
      <section className="workspace-main">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">{app.area}</p>
            <h1>{app.title}</h1>
          </div>
          <span className="status-pill">v1 interactive prototype</span>
        </div>
        <p className="lead">{app.workspace}</p>

        <div className="controls-row">
          <label>
            {copy.x}
            <input type="range" min="5" max="95" value={intensity} onChange={(event) => setIntensity(Number(event.target.value))} />
          </label>
          <label>
            {copy.y}
            <input type="range" min="80" max="1200" step="20" value={sampleSize} onChange={(event) => setSampleSize(Number(event.target.value))} />
          </label>
        </div>

        <h2 className="visual-title">{copy.panel}</h2>
        <div className="chart-panel">
          <ModeVisual app={app} mode={mode} intensity={intensity} series={series} comparison={comparison} />
        </div>
      </section>

      <aside className="insight-panel">
        {insightCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              className={`insight-card ${index === 0 ? "primary" : ""}`}
              key={card.label}
              style={{ "--accent": app.accent } as CSSProperties & Record<"--accent", string>}
            >
              <Icon size={18} />
              <span>{card.label}</span>
              <strong>{card.value}</strong>
            </div>
          );
        })}
      </aside>

      <section className="method-grid">
        <div>
          <h2>Methods Demonstrated</h2>
          <ul>
            {app.methods.map((method) => <li key={method}>{method}</li>)}
          </ul>
        </div>
        <div>
          <h2>Statistical Acumen</h2>
          <ul>
            {app.acumen.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div>
          <h2>Data Refresh</h2>
          <p>{app.dataSource}</p>
          <p>{app.updateFrequency}</p>
        </div>
      </section>
    </div>
  );
}

function buildInsightCards(
  mode: AppMode,
  app: PortfolioApp,
  ci: ReturnType<typeof normalConfidenceInterval>,
  posterior: number,
  metrics: ReturnType<typeof classificationMetrics>,
  deff: number,
  testRecommendation: string,
  intensity: number
) {
  const common = [{ icon: Activity, label: app.metricLabel, value: app.metricValue }];
  const cards: Record<AppMode, Array<{ icon: typeof Activity; label: string; value: string }>> = {
    regression: [
      ...common,
      { icon: BarChart3, label: "Residual band", value: `${ci.lower.toFixed(1)} to ${ci.upper.toFixed(1)}` },
      { icon: BookOpenCheck, label: "Diagnostic focus", value: "Influence and heteroskedasticity" },
      { icon: Database, label: "Validation", value: "Holdout + interval coverage" },
      { icon: RefreshCcw, label: "Model warning", value: "Check leverage before explaining coefficients" }
    ],
    sampling: [
      ...common,
      { icon: BarChart3, label: "Effective sample", value: `${Math.round(720 / deff)}` },
      { icon: BookOpenCheck, label: "Estimator", value: "Weighted mean/proportion" },
      { icon: Database, label: "Bias source", value: `${intensity}% nonresponse pressure` },
      { icon: RefreshCcw, label: "Design effect", value: deff.toFixed(2) }
    ],
    categorical: [
      ...common,
      { icon: BarChart3, label: "Association test", value: "Chi-square + exact fallback" },
      { icon: BookOpenCheck, label: "Effect size", value: "Odds/rate ratio" },
      { icon: Database, label: "Sparse-cell check", value: intensity > 65 ? "Warning" : "Acceptable" },
      { icon: RefreshCcw, label: "Interpretation", value: "Practical odds, not only p-value" }
    ],
    bayes: [
      ...common,
      { icon: BarChart3, label: "Posterior risk", value: `${(posterior * 100).toFixed(1)}%` },
      { icon: BookOpenCheck, label: "Key lesson", value: "Base rate changes PPV" },
      { icon: Database, label: "False positives", value: `${Math.round((100 - intensity) * 0.06)} per 100` },
      { icon: RefreshCcw, label: "Likelihood view", value: "Positive test updates prior odds" }
    ],
    forecast: [
      ...common,
      { icon: BarChart3, label: "Forecast band", value: `${ci.lower.toFixed(1)} to ${ci.upper.toFixed(1)}` },
      { icon: BookOpenCheck, label: "Validation", value: "Rolling-origin backtest" },
      { icon: Database, label: "Signal split", value: "Trend + seasonality + error" },
      { icon: RefreshCcw, label: "Leakage check", value: "No future data in training" }
    ],
    health: [
      ...common,
      { icon: BarChart3, label: "Rate basis", value: "Per 100k population" },
      { icon: BookOpenCheck, label: "Model family", value: "Poisson/logistic risk" },
      { icon: Database, label: "Uncertainty", value: "Subgroup intervals" },
      { icon: RefreshCcw, label: "Caution", value: "Reporting delay and denominators" }
    ],
    ml: [
      ...common,
      { icon: BarChart3, label: "Recall", value: `${(metrics.recall * 100).toFixed(0)}%` },
      { icon: BookOpenCheck, label: "Threshold", value: `${intensity}% cutoff` },
      { icon: Database, label: "Calibration", value: `${(posterior * 100).toFixed(1)}%` },
      { icon: RefreshCcw, label: "Validation", value: "ROC, PR, confusion matrix" }
    ],
    vision: [
      ...common,
      { icon: BarChart3, label: "Confidence cutoff", value: `${intensity}%` },
      { icon: BookOpenCheck, label: "Explainability", value: "Saliency-style region review" },
      { icon: Database, label: "Risk", value: "Confidence is not correctness" },
      { icon: RefreshCcw, label: "Model version", value: "Transfer learning demo" }
    ],
    simulation: [
      ...common,
      { icon: BarChart3, label: "CI estimate", value: `${ci.lower.toFixed(1)} to ${ci.upper.toFixed(1)}` },
      { icon: BookOpenCheck, label: "Sampling logic", value: testRecommendation },
      { icon: Database, label: "Replications", value: `${Math.max(1000, intensity * 160)}` },
      { icon: RefreshCcw, label: "Estimator behavior", value: "Bias, variance, coverage" }
    ],
    experiment: [
      ...common,
      { icon: BarChart3, label: "Power target", value: `${Math.min(95, 50 + intensity / 2).toFixed(0)}%` },
      { icon: BookOpenCheck, label: "Decision rule", value: "Effect size + uncertainty" },
      { icon: Database, label: "Peeking warning", value: intensity > 70 ? "High risk" : "Controlled" },
      { icon: RefreshCcw, label: "Bayesian view", value: `${(posterior * 100).toFixed(1)}% posterior` }
    ],
    sports: [
      ...common,
      { icon: BarChart3, label: "Calibration", value: "Predicted vs observed wins" },
      { icon: BookOpenCheck, label: "Rating engine", value: "Elo + logistic layer" },
      { icon: Database, label: "Backtest", value: "Historical games" },
      { icon: RefreshCcw, label: "Loss", value: "Log loss and Brier score" }
    ],
    finance: [
      ...common,
      { icon: BarChart3, label: "Volatility", value: `${(8 + intensity / 8).toFixed(1)}%` },
      { icon: BookOpenCheck, label: "Risk lens", value: "Quantiles and drawdown" },
      { icon: Database, label: "Covariance", value: "Diversification effect" },
      { icon: RefreshCcw, label: "Caution", value: "VaR is not a guarantee" }
    ],
    recommender: [
      ...common,
      { icon: BarChart3, label: "Current suggestion", value: testRecommendation },
      { icon: BookOpenCheck, label: "Inputs", value: "Outcome, groups, pairing" },
      { icon: Database, label: "Assumption check", value: intensity > 45 ? "Normal path" : "Robust path" },
      { icon: RefreshCcw, label: "Output", value: "Test + effect size notes" }
    ],
    fairness: [
      ...common,
      { icon: BarChart3, label: "Recall gap", value: `${Math.abs(78 - intensity).toFixed(0)} pts` },
      { icon: BookOpenCheck, label: "Fairness lens", value: "Rates by subgroup" },
      { icon: Database, label: "Calibration", value: "Group reliability check" },
      { icon: RefreshCcw, label: "Tradeoff", value: "Criteria can conflict" }
    ]
  };
  return cards[mode];
}

function ModeVisual({
  app,
  mode,
  intensity,
  series,
  comparison
}: {
  app: PortfolioApp;
  mode: AppMode;
  intensity: number;
  series: number[];
  comparison: ReturnType<typeof makeComparison>;
}) {
  if (mode === "bayes") {
    const diseased = Math.round(intensity);
    const healthy = 100 - diseased;
    const truePositive = Math.round(diseased * 0.91);
    const falsePositive = Math.round(healthy * 0.06);
    return (
      <div className="bayes-visual">
        <div className="person-grid" aria-label="100-person disease testing grid">
          {Array.from({ length: 100 }, (_, index) => {
            const className = index < truePositive ? "tp" : index < diseased ? "fn" : index < diseased + falsePositive ? "fp" : "tn";
            return <span className={className} key={index} />;
          })}
        </div>
        <div className="probability-stack">
          <div><strong>{truePositive}</strong><span>true positives</span></div>
          <div><strong>{falsePositive}</strong><span>false positives</span></div>
          <div><strong>{100 - truePositive - falsePositive}</strong><span>negative results</span></div>
        </div>
      </div>
    );
  }

  if (mode === "regression") {
    return (
      <div className="scatter-visual">
        {series.slice(0, 16).map((value, index) => (
          <span
            key={index}
            style={{
              left: `${6 + index * 5.8}%`,
              bottom: `${18 + ((value + (index % 3) * 4) % 58)}%`,
              background: app.accent
            }}
          />
        ))}
        <i />
      </div>
    );
  }

  if (mode === "sampling") {
    return (
      <div className="strata-visual">
        {["Urban", "Suburban", "Rural", "Youth", "Seniors"].map((label, index) => (
          <div key={label}>
            <strong>{label}</strong>
            <span><i style={{ width: `${44 + index * 9}%`, background: app.accent }} /></span>
            <span><i style={{ width: `${36 + ((index + intensity) % 38)}%` }} /></span>
          </div>
        ))}
      </div>
    );
  }

  if (mode === "categorical") {
    return (
      <div className="mosaic-visual">
        {comparison.slice(0, 8).map((point, index) => (
          <span key={point.label} style={{ flexGrow: Math.max(1, Math.round(point.observed / 12)), background: index % 2 ? "#d9e2ea" : app.accent }}>
            {point.label}
          </span>
        ))}
      </div>
    );
  }

  if (mode === "ml" || mode === "fairness") {
    return (
      <div className="matrix-visual">
        {["TP", "FP", "FN", "TN"].map((label, index) => (
          <div key={label} style={{ background: index === 0 || index === 3 ? app.accent : "#d9e2ea" }}>
            <strong>{label}</strong>
            <span>{Math.round(series[index + 2])}</span>
          </div>
        ))}
      </div>
    );
  }

  if (mode === "vision") {
    return (
      <div className="vision-visual">
        <div className="image-tile"><span style={{ borderColor: app.accent }} /></div>
        <div className="prediction-list">
          {["target class", "similar class", "background artifact"].map((label, index) => (
            <p key={label}><span style={{ width: `${82 - index * 19}%`, background: index === 0 ? app.accent : "#cbd8e2" }} />{label}</p>
          ))}
        </div>
      </div>
    );
  }

  if (mode === "recommender") {
    return (
      <div className="decision-visual">
        {["Outcome type", "Number of groups", "Paired design", "Assumptions", "Recommended test"].map((label, index) => (
          <div key={label} className={index === 4 ? "final" : ""}>{label}</div>
        ))}
      </div>
    );
  }

  return (
    <>
      <MiniChart values={series} color={app.accent} label={`${app.title} main analysis`} />
      <div className="bar-grid">
        {comparison.map((point) => (
          <div key={point.label} className="bar-cell">
            <span style={{ height: `${Math.min(point.observed, 90)}%`, background: app.accent }} />
            <span style={{ height: `${Math.min(point.modeled, 90)}%` }} />
            <small>{point.label}</small>
          </div>
        ))}
      </div>
    </>
  );
}
