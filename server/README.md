# Portfolio Scholar API

Small Node service for returning cached Google Scholar citation metrics.

## Local run

```powershell
npm run serve:api
```

Default local URL:

```text
http://127.0.0.1:3002/api/scholar-metrics
```

## Environment

```dotenv
HOST=127.0.0.1
PORT=3002
SCHOLAR_URL=https://scholar.google.com/citations?user=9q0s2u4AAAAJ&hl=en&oi=ao
REFRESH_INTERVAL_MS=21600000
REQUEST_TIMEOUT_MS=20000
ALLOWED_ORIGINS=*
```

For VPS deployment, keep the service bound to `127.0.0.1` and expose it through
Caddy as a separate HTTPS endpoint.
