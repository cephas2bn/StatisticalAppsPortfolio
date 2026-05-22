import { PortfolioApp } from "./apps";

export function makeSeries(seed: number, length = 16) {
  return Array.from({ length }, (_, index) => {
    const trend = 38 + seed * 1.7 + index * (0.9 + (seed % 4) * 0.12);
    const wave = Math.sin((index + seed) / 2) * (5 + (seed % 3));
    const pulse = index % 5 === 0 ? seed % 6 : 0;
    return Math.max(6, Math.round((trend + wave + pulse) * 10) / 10);
  });
}

export function makeComparison(app: PortfolioApp) {
  const base = makeSeries(app.id, 10);
  return base.map((value, index) => ({
    label: `M${index + 1}`,
    observed: value,
    modeled: Math.round((value * (0.9 + (index % 3) * 0.04) + app.id * 0.35) * 10) / 10
  }));
}
