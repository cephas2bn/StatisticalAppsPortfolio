"""Generate cached snapshot data for the Statistical Apps Portfolio.

The first release uses deterministic sample datasets so the app is useful
without API keys. API-backed fetchers can replace individual generators while
keeping the exported JSON contract stable.
"""

from __future__ import annotations

import json
import math
from datetime import datetime, timezone
from pathlib import Path
from random import Random

ROOT = Path(__file__).resolve().parents[1]
SNAPSHOT_DIR = ROOT / "data" / "snapshots"
PUBLIC_DATA_DIR = ROOT / "apps" / "web" / "public" / "data"


def round2(value: float) -> float:
    return round(value, 2)


def make_time_series(seed: int, length: int = 30) -> list[dict[str, float | str]]:
    rng = Random(seed)
    rows = []
    for index in range(length):
        trend = 42 + index * (0.45 + seed * 0.015)
        season = math.sin((index + seed) / 3) * (4 + seed % 5)
        noise = rng.uniform(-2.2, 2.2)
        observed = trend + season + noise
        modeled = trend + season * 0.74
        rows.append(
            {
                "period": f"2026-{(index % 12) + 1:02d}",
                "observed": round2(observed),
                "modeled": round2(modeled),
                "residual": round2(observed - modeled),
            }
        )
    return rows


def make_classification(seed: int) -> dict[str, float | int]:
    rng = Random(seed)
    tp = rng.randint(120, 220)
    fp = rng.randint(18, 70)
    tn = rng.randint(150, 260)
    fn = rng.randint(20, 84)
    total = tp + fp + tn + fn
    return {
        "tp": tp,
        "fp": fp,
        "tn": tn,
        "fn": fn,
        "accuracy": round2((tp + tn) / total),
        "precision": round2(tp / (tp + fp)),
        "recall": round2(tp / (tp + fn)),
    }


def build_payload() -> dict[str, object]:
    app_slugs = [
        "regression-diagnostics-lab",
        "housing-price-modeling-dashboard",
        "election-polling-sampling-simulator",
        "categorical-data-analysis-explorer",
        "bayesian-disease-testing-simulator",
        "time-series-forecasting-hub",
        "public-health-risk-dashboard",
        "machine-learning-model-arena",
        "deep-learning-image-classifier-demo",
        "monte-carlo-simulation-studio",
        "survey-weighting-bias-dashboard",
        "ab-testing-decision-lab",
        "sports-analytics-prediction-app",
        "climate-trend-analyzer",
        "financial-risk-portfolio-simulator",
        "crime-incident-mapping-dashboard",
        "customer-churn-prediction-app",
        "statistical-test-recommender",
        "bootstrap-confidence-interval-visualizer",
        "data-ethics-fairness-dashboard",
    ]

    generated_at = datetime.now(timezone.utc).isoformat()
    return {
        "generatedAt": generated_at,
        "sourceMode": "deterministic-sample",
        "apps": {
            slug: {
                "series": make_time_series(index + 1),
                "classification": make_classification(index + 7),
                "notes": [
                    "Snapshot uses deterministic sample data for v1.",
                    "Replace this generator with an API-backed fetcher while preserving this JSON shape.",
                ],
            }
            for index, slug in enumerate(app_slugs)
        },
    }


def write_json(path: Path, payload: dict[str, object]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2), encoding="utf-8")


def main() -> None:
    payload = build_payload()
    write_json(SNAPSHOT_DIR / "portfolio-snapshots.json", payload)
    write_json(PUBLIC_DATA_DIR / "portfolio-snapshots.json", payload)
    print(f"Wrote snapshots for {len(payload['apps'])} apps")


if __name__ == "__main__":
    main()
