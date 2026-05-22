# Pipelines

`refresh_snapshots.py` creates deterministic v1 JSON snapshots for all 20 apps. This keeps the deployed portfolio useful before API keys are configured.

Future API-backed fetchers should preserve the exported shape:

```json
{
  "generatedAt": "ISO timestamp",
  "sourceMode": "deterministic-sample or source name",
  "apps": {
    "app-slug": {
      "series": [],
      "classification": {},
      "notes": []
    }
  }
}
```
