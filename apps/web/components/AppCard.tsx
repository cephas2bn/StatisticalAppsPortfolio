import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowUpRight, Database, RefreshCcw } from "lucide-react";
import { PortfolioApp } from "@/lib/apps";
import { makeSeries } from "@/lib/demo-series";
import { MiniChart } from "./MiniChart";

export function AppCard({ app }: { app: PortfolioApp }) {
  return (
    <Link className="app-card" href={`/apps/${app.slug}`} style={{ "--accent": app.accent } as CSSProperties & Record<"--accent", string>}>
      <div className="card-topline">
        <span>{app.area}</span>
        <span>{app.difficulty}</span>
      </div>
      <div className="card-title-row">
        <h2>{app.title}</h2>
        <ArrowUpRight size={20} aria-hidden="true" />
      </div>
      <MiniChart values={makeSeries(app.id, 14)} color={app.accent} label={`${app.title} preview`} />
      <p>{app.workspace}</p>
      <div className="metric-row">
        <strong>{app.metricValue}</strong>
        <span>{app.metricLabel}</span>
      </div>
      <div className="meta-row">
        <span><Database size={14} /> {app.dataSource}</span>
        <span><RefreshCcw size={14} /> {app.updateFrequency}</span>
      </div>
    </Link>
  );
}
