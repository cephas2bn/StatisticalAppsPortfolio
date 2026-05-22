"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { AppCard } from "./AppCard";
import { apps, areas } from "@/lib/apps";

export function HomeDashboard() {
  const [area, setArea] = useState<(typeof areas)[number]>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return apps.filter((app) => {
      const matchesArea = area === "All" || app.area === area;
      const haystack = `${app.title} ${app.area} ${app.methods.join(" ")}`.toLowerCase();
      return matchesArea && haystack.includes(query.toLowerCase());
    });
  }, [area, query]);

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">Statistics portfolio apps</p>
          <h1>Statistics Portfolio Apps</h1>
          <p className="hero-copy">
            These apps demonstrate statistical and machine learning ideas including regression diagnostics,
            Bayesian reasoning, simulation, sampling design, categorical analysis, forecasting, model evaluation,
            data ethics, and uncertainty-aware interpretation.
          </p>
        </div>
      </section>

      <section className="toolbar" aria-label="Portfolio filters">
        <div className="search-box">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search methods, apps, or course areas"
            aria-label="Search portfolio apps"
          />
        </div>
        <div className="filter-group">
          <SlidersHorizontal size={18} aria-hidden="true" />
          {areas.map((item) => (
            <button key={item} className={item === area ? "active" : ""} onClick={() => setArea(item)}>
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="app-grid" aria-label="Statistical applications">
        {filtered.map((app) => (
          <AppCard app={app} key={app.slug} />
        ))}
      </section>
    </>
  );
}
