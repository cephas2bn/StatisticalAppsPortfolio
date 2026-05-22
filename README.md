# Statistical Apps Portfolio

A modern portfolio suite of statistics apps demonstrating statistical and machine learning ideas across regression, mathematical statistics, sampling design, categorical data analysis, machine learning, deep learning, simulation, forecasting, and fairness.

## Structure

- `apps/web` - Next.js portfolio and interactive app routes.
- `packages/stat-core` - Shared statistical utilities and tests.
- `pipelines` - Python refresh scripts for public-data snapshots.
- `data/snapshots` - Generated cached datasets.
- `.github/workflows` - Scheduled refresh and verification workflow.

## Getting Started

```bash
npm install
npm run pipeline:refresh
npm run dev
```

Then open `http://localhost:3000`.

On Windows PowerShell, if `npm.ps1` opens in Notepad instead of executing, use the command shim directly:

```powershell
npm.cmd install
npm.cmd run pipeline:refresh
npm.cmd run dev
```

## Data Refresh

The app is designed for twice-daily refreshes. Vercel Cron calls `/api/refresh`, and GitHub Actions can run the Python snapshot pipeline on a schedule. API-key backed sources can be enabled with:

- `FRED_API_KEY`
- `ALPHA_VANTAGE_API_KEY`
- `NOAA_TOKEN`
- `CRON_SECRET`

If an external source is unavailable, the UI keeps using the latest cached snapshot.
