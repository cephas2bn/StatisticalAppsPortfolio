export type CourseArea =
  | "Regression"
  | "Mathematical Statistics"
  | "Sampling"
  | "Categorical Data"
  | "Machine Learning"
  | "Deep Learning"
  | "Time Series"
  | "Simulation"
  | "Public Health"
  | "Ethics";

export type PortfolioApp = {
  id: number;
  slug: string;
  title: string;
  area: CourseArea;
  difficulty: "Core" | "Advanced" | "Capstone";
  dataSource: string;
  updateFrequency: string;
  methods: string[];
  acumen: string[];
  workspace: string;
  metricLabel: string;
  metricValue: string;
  accent: string;
};

export const apps: PortfolioApp[] = [
  {
    id: 1,
    slug: "regression-diagnostics-lab",
    title: "Regression Diagnostics Lab",
    area: "Regression",
    difficulty: "Core",
    dataSource: "Synthetic and uploaded tabular data",
    updateFrequency: "On demand",
    methods: ["OLS", "Ridge/Lasso", "Logistic regression", "Residual diagnostics"],
    acumen: ["Checks linearity, variance, leverage, influence, and interval interpretation.", "Explains when prediction intervals are wider than confidence intervals."],
    workspace: "Tune model family and inspect residuals, leverage, fitted values, and uncertainty.",
    metricLabel: "Adjusted R2",
    metricValue: "0.84",
    accent: "#2f80ed"
  },
  {
    id: 2,
    slug: "housing-price-modeling-dashboard",
    title: "Housing Price Modeling Dashboard",
    area: "Regression",
    difficulty: "Advanced",
    dataSource: "Cached public housing/rental snapshots",
    updateFrequency: "Twice daily when source is enabled",
    methods: ["Hedonic regression", "Tree models", "Feature importance", "Prediction intervals"],
    acumen: ["Separates statistical significance from predictive utility.", "Surfaces heteroskedasticity and location-driven confounding."],
    workspace: "Compare price drivers, residual maps, model lift, and uncertainty bands.",
    metricLabel: "MAPE",
    metricValue: "11.8%",
    accent: "#00a676"
  },
  {
    id: 3,
    slug: "election-polling-sampling-simulator",
    title: "Election Polling and Sampling Simulator",
    area: "Sampling",
    difficulty: "Advanced",
    dataSource: "Synthetic electorate with configurable strata",
    updateFrequency: "Browser simulation",
    methods: ["SRS", "Stratified sampling", "Cluster sampling", "Weighting"],
    acumen: ["Shows how design effects change uncertainty.", "Demonstrates bias from nonresponse and undercoverage."],
    workspace: "Change sampling design, response bias, strata sizes, and compare estimates.",
    metricLabel: "Design effect",
    metricValue: "1.42",
    accent: "#f2994a"
  },
  {
    id: 4,
    slug: "categorical-data-analysis-explorer",
    title: "Categorical Data Analysis Explorer",
    area: "Categorical Data",
    difficulty: "Core",
    dataSource: "Cached survey and health contingency tables",
    updateFrequency: "Static plus uploads",
    methods: ["Chi-square", "Fisher exact", "Odds ratios", "Logistic regression"],
    acumen: ["Links effect size to practical interpretation.", "Highlights sparse-cell warnings and exact-test alternatives."],
    workspace: "Build tables, inspect mosaic plots, odds ratios, and logistic coefficients.",
    metricLabel: "Odds ratio",
    metricValue: "2.31",
    accent: "#9b51e0"
  },
  {
    id: 5,
    slug: "bayesian-disease-testing-simulator",
    title: "Bayesian Disease Testing Simulator",
    area: "Mathematical Statistics",
    difficulty: "Core",
    dataSource: "Browser-side probability model",
    updateFrequency: "Browser simulation",
    methods: ["Bayes theorem", "Sensitivity", "Specificity", "Posterior probability"],
    acumen: ["Makes base-rate effects visible.", "Contrasts positive predictive value with test sensitivity."],
    workspace: "Move prevalence, sensitivity, and specificity sliders to see posterior risk.",
    metricLabel: "PPV",
    metricValue: "37.7%",
    accent: "#eb5757"
  },
  {
    id: 6,
    slug: "time-series-forecasting-hub",
    title: "Time Series Forecasting Hub",
    area: "Time Series",
    difficulty: "Advanced",
    dataSource: "FRED, NOAA, World Bank, or cached snapshots",
    updateFrequency: "Twice daily where APIs are configured",
    methods: ["ARIMA baselines", "Exponential smoothing", "Backtesting", "Forecast intervals"],
    acumen: ["Separates trend, seasonality, residual error, and validation leakage.", "Compares rolling-origin backtests."],
    workspace: "Choose a series and compare forecast horizons, residuals, and coverage.",
    metricLabel: "sMAPE",
    metricValue: "7.4%",
    accent: "#2d9cdb"
  },
  {
    id: 7,
    slug: "public-health-risk-dashboard",
    title: "Public Health Risk Dashboard",
    area: "Public Health",
    difficulty: "Advanced",
    dataSource: "CDC Data/Socrata snapshots",
    updateFrequency: "Daily or twice daily",
    methods: ["Logistic regression", "Poisson rates", "Risk ratios", "Subgroup analysis"],
    acumen: ["Uses denominators and uncertainty instead of raw counts alone.", "Flags ecological and reporting-delay limitations."],
    workspace: "Explore trends, risk ratios, subgroup intervals, and rate-normalized comparisons.",
    metricLabel: "Risk ratio",
    metricValue: "1.28",
    accent: "#219653"
  },
  {
    id: 8,
    slug: "machine-learning-model-arena",
    title: "Machine Learning Model Arena",
    area: "Machine Learning",
    difficulty: "Capstone",
    dataSource: "Curated public classification datasets",
    updateFrequency: "Static plus retraining",
    methods: ["Random forest", "Gradient boosting", "ROC/PR curves", "Calibration"],
    acumen: ["Balances accuracy, calibration, threshold choice, and fairness.", "Shows why validation design matters more than leaderboard scores."],
    workspace: "Compare models, thresholds, confusion matrices, ROC curves, and calibration.",
    metricLabel: "AUC",
    metricValue: "0.91",
    accent: "#56ccf2"
  },
  {
    id: 9,
    slug: "deep-learning-image-classifier-demo",
    title: "Deep Learning Image Classifier Demo",
    area: "Deep Learning",
    difficulty: "Capstone",
    dataSource: "Curated image sample set",
    updateFrequency: "Model versioned manually",
    methods: ["Transfer learning", "Top-k confidence", "Saliency", "Model limitations"],
    acumen: ["Distinguishes confidence from correctness.", "Shows data drift, augmentation, and interpretability caveats."],
    workspace: "Upload/select an image and review prediction confidence and explanation heatmaps.",
    metricLabel: "Top-3 acc.",
    metricValue: "96%",
    accent: "#bb6bd9"
  },
  {
    id: 10,
    slug: "monte-carlo-simulation-studio",
    title: "Monte Carlo Simulation Studio",
    area: "Simulation",
    difficulty: "Core",
    dataSource: "Browser-side random simulation",
    updateFrequency: "Browser simulation",
    methods: ["LLN", "CLT", "Permutation tests", "Simulation inference"],
    acumen: ["Connects repeated sampling to estimator behavior.", "Shows how simulation supports inference when formulas are hard."],
    workspace: "Run repeated simulations and watch sampling distributions stabilize.",
    metricLabel: "Replications",
    metricValue: "10k",
    accent: "#f2c94c"
  },
  {
    id: 11,
    slug: "survey-weighting-bias-dashboard",
    title: "Survey Weighting and Bias Dashboard",
    area: "Sampling",
    difficulty: "Advanced",
    dataSource: "Synthetic population and sample data",
    updateFrequency: "Browser simulation",
    methods: ["Post-stratification", "Raking concept", "Effective sample size", "Bias-variance tradeoff"],
    acumen: ["Quantifies how weights reduce bias while increasing variance.", "Reports effective sample size and design effect."],
    workspace: "Adjust population imbalance, response propensity, and weighting strategy.",
    metricLabel: "Effective n",
    metricValue: "642",
    accent: "#f2994a"
  },
  {
    id: 12,
    slug: "ab-testing-decision-lab",
    title: "A/B Testing Decision Lab",
    area: "Mathematical Statistics",
    difficulty: "Advanced",
    dataSource: "Browser-side experiment simulator",
    updateFrequency: "Browser simulation",
    methods: ["Power analysis", "Sample size", "Sequential caution", "Bayesian posterior"],
    acumen: ["Links statistical power to business decision thresholds.", "Shows peeking risk and practical significance."],
    workspace: "Plan sample size, simulate outcomes, and compare frequentist and Bayesian decisions.",
    metricLabel: "Power",
    metricValue: "82%",
    accent: "#eb5757"
  },
  {
    id: 13,
    slug: "sports-analytics-prediction-app",
    title: "Sports Analytics Prediction App",
    area: "Machine Learning",
    difficulty: "Advanced",
    dataSource: "Cached sports results or public sports APIs",
    updateFrequency: "Daily in season",
    methods: ["Elo ratings", "Logistic win probability", "Backtesting", "Calibration"],
    acumen: ["Evaluates predictions with calibration and log loss.", "Separates explanatory features from outcome leakage."],
    workspace: "Inspect team ratings, win probability, historical calibration, and upset risk.",
    metricLabel: "Log loss",
    metricValue: "0.58",
    accent: "#27ae60"
  },
  {
    id: 14,
    slug: "climate-trend-analyzer",
    title: "Climate Trend Analyzer",
    area: "Time Series",
    difficulty: "Advanced",
    dataSource: "NOAA/NCEI cached climate snapshots",
    updateFrequency: "Daily",
    methods: ["Trend regression", "Seasonality", "Anomalies", "Confidence bands"],
    acumen: ["Shows trend uncertainty and station-level limitations.", "Separates weather variability from long-run climate signal."],
    workspace: "Pick a station or region and inspect trend, anomalies, and seasonal structure.",
    metricLabel: "Trend",
    metricValue: "+0.18 C/dec.",
    accent: "#2d9cdb"
  },
  {
    id: 15,
    slug: "financial-risk-portfolio-simulator",
    title: "Financial Risk and Portfolio Simulator",
    area: "Simulation",
    difficulty: "Advanced",
    dataSource: "Alpha Vantage or cached market snapshots",
    updateFrequency: "Twice daily on trading days",
    methods: ["Returns", "Volatility", "Correlation", "VaR", "Monte Carlo"],
    acumen: ["Frames VaR as a model-based quantile, not a guarantee.", "Shows diversification through covariance and drawdowns."],
    workspace: "Set weights and simulate portfolio paths, VaR, drawdown, and efficient frontier.",
    metricLabel: "95% VaR",
    metricValue: "-2.6%",
    accent: "#00a676"
  },
  {
    id: 16,
    slug: "crime-incident-mapping-dashboard",
    title: "Crime or Incident Mapping Dashboard",
    area: "Categorical Data",
    difficulty: "Advanced",
    dataSource: "Public city open-data snapshots",
    updateFrequency: "Daily where available",
    methods: ["Spatial rates", "Temporal trends", "Categorical outcomes", "Rate normalization"],
    acumen: ["Normalizes by exposure/population and avoids raw-count overclaiming.", "Discusses reporting bias and geography effects."],
    workspace: "Explore incident categories by time, neighborhood, normalized rates, and uncertainty.",
    metricLabel: "Rate ratio",
    metricValue: "1.16",
    accent: "#9b51e0"
  },
  {
    id: 17,
    slug: "customer-churn-prediction-app",
    title: "Customer Churn Prediction App",
    area: "Machine Learning",
    difficulty: "Capstone",
    dataSource: "Public or synthetic churn dataset",
    updateFrequency: "Model versioned manually",
    methods: ["Feature engineering", "Classification", "Calibration", "SHAP-style explanation"],
    acumen: ["Connects thresholds to retention cost-benefit.", "Explains feature effects without treating correlation as causation."],
    workspace: "Tune threshold, review feature effects, probability calibration, and business impact.",
    metricLabel: "Lift at 20%",
    metricValue: "2.7x",
    accent: "#56ccf2"
  },
  {
    id: 18,
    slug: "statistical-test-recommender",
    title: "Statistical Test Recommender",
    area: "Mathematical Statistics",
    difficulty: "Core",
    dataSource: "Rules encoded from course methods",
    updateFrequency: "Versioned manually",
    methods: ["Decision trees", "Assumption checks", "Design matching", "Effect sizes"],
    acumen: ["Makes test choice depend on design, measurement scale, and assumptions.", "Returns assumptions and interpretation notes."],
    workspace: "Select outcome, groups, pairing, normality, and sample size to get a recommended test.",
    metricLabel: "Rules",
    metricValue: "32",
    accent: "#eb5757"
  },
  {
    id: 19,
    slug: "bootstrap-confidence-interval-visualizer",
    title: "Bootstrap Confidence Interval Visualizer",
    area: "Simulation",
    difficulty: "Core",
    dataSource: "Browser-side resampling",
    updateFrequency: "Browser simulation",
    methods: ["Bootstrap", "Percentile intervals", "Bias", "Normal-theory comparison"],
    acumen: ["Shows the sampling distribution as an object, not just a formula.", "Compares resampling intervals with theoretical intervals."],
    workspace: "Resample a dataset and compare bootstrap distributions and confidence intervals.",
    metricLabel: "CI width",
    metricValue: "1.14",
    accent: "#f2c94c"
  },
  {
    id: 20,
    slug: "data-ethics-fairness-dashboard",
    title: "Data Ethics and Fairness Dashboard",
    area: "Ethics",
    difficulty: "Capstone",
    dataSource: "COMPAS/adult-style cached fairness datasets",
    updateFrequency: "Static plus model retraining",
    methods: ["Disparate impact", "Subgroup metrics", "Calibration", "Threshold mitigation"],
    acumen: ["Shows fairness criteria can conflict.", "Reports false positive and false negative rates by group."],
    workspace: "Compare subgroup metrics, thresholds, calibration, and mitigation tradeoffs.",
    metricLabel: "DI ratio",
    metricValue: "0.78",
    accent: "#828282"
  }
];

export const areas = ["All", ...Array.from(new Set(apps.map((app) => app.area)))] as const;

export function getApp(slug: string) {
  return apps.find((app) => app.slug === slug);
}
