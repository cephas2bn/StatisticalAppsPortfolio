"use client";

import { useMemo, useState } from "react";
import { Database, GraduationCap, Mail, MapPin, Phone, Search, SlidersHorizontal } from "lucide-react";
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

      <section className="profile-footer" aria-label="Portfolio owner details">
        <div className="profile-portrait" aria-hidden="true">
          <span>CAF</span>
        </div>
        <div className="profile-copy">
          <p className="eyebrow">Portfolio by</p>
          <h2>Cephas Acquah Forson</h2>
          <p>
            Data Science, GIS, and database professional with experience building spatial data systems,
            statistical workflows, reporting pipelines, and decision-support tools across mining,
            operations, and analytics environments.
          </p>
          <div className="profile-contact">
            <span><MapPin size={17} /> St. Johns, Newfoundland and Labrador, Canada</span>
            <a href="mailto:cephasfn@gmail.com"><Mail size={17} /> cephasfn@gmail.com</a>
            <a href="tel:+17098531790"><Phone size={17} /> +1 709 853 1790</a>
            <a href="tel:+233241650607"><Phone size={17} /> +233 241 650 607</a>
          </div>
        </div>
        <div className="profile-detail-grid">
          <div>
            <GraduationCap size={20} />
            <h3>Education</h3>
            <p>Master of Data Science, Memorial University of Newfoundland</p>
            <p>M.Sc. GIS, University of Aberdeen</p>
            <p>B.Sc. Geomatic Engineering, University of Mines and Technology</p>
          </div>
          <div>
            <Database size={20} />
            <h3>Technical Focus</h3>
            <p>Statistical modeling, machine learning, GIS, SQL, PL/SQL, Python, Power BI, spatial databases, and data pipelines.</p>
          </div>
        </div>
      </section>
    </>
  );
}
