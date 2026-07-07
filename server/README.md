# Portfolio API

Small Node service for returning cached Google Scholar citation metrics and local
portfolio click analytics.

## Local run

```powershell
npm run serve:api
```

Default local URL:

```text
http://127.0.0.1:3002/api/scholar-metrics
```

Analytics endpoints:

```text
POST http://127.0.0.1:3002/api/analytics/events
GET  http://127.0.0.1:3002/api/analytics/summary
```

The summary endpoint requires the `X-Admin-Password` header.

Portfolio shortcuts such as `/portfolio/li`, `/portfolio/ig`,
`/portfolio/cv`, or any custom `/portfolio/{source}` are tracked as
`source_visit` events and then normalized back to `/portfolio/` in the browser.

## Environment

```dotenv
HOST=127.0.0.1
PORT=3002
SCHOLAR_URL=https://scholar.google.com/citations?user=9q0s2u4AAAAJ&hl=en&oi=ao
REFRESH_INTERVAL_MS=21600000
REQUEST_TIMEOUT_MS=20000
ALLOWED_ORIGINS=*
ANALYTICS_ADMIN_PASSWORD=marecek
ANALYTICS_DB_PATH=server/data/analytics-db.json
ANALYTICS_EVENT_LIMIT=5000
```

For VPS deployment, keep the service bound to `127.0.0.1` and expose it through
Caddy as a separate HTTPS endpoint.
