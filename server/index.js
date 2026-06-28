const fs = require("fs");
const http = require("http");
const path = require("path");
const { execFile } = require("child_process");

const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 3002);
const scholarUrl =
  process.env.SCHOLAR_URL ||
  "https://scholar.google.com/citations?user=9q0s2u4AAAAJ&hl=en&oi=ao";
const refreshIntervalMs = Number(process.env.REFRESH_INTERVAL_MS || 6 * 60 * 60 * 1000);
const requestTimeoutMs = Number(process.env.REQUEST_TIMEOUT_MS || 20000);
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "*")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const fallbackMetricsPath = path.join(__dirname, "..", "public", "scholar-metrics.json");
const userAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const state = {
  metrics: loadFallbackMetrics(),
  cachedAt: 0,
  refreshing: null,
  lastError: ""
};

if (state.metrics && state.metrics.updatedAt) {
  state.cachedAt = Date.parse(state.metrics.updatedAt) || 0;
}

function loadFallbackMetrics() {
  try {
    const metrics = JSON.parse(fs.readFileSync(fallbackMetricsPath, "utf8"));
    const citations = Number(metrics.citations);
    if (!Number.isFinite(citations)) {
      return null;
    }

    return {
      citations,
      source: metrics.source || scholarUrl,
      updatedAt: metrics.updatedAt || ""
    };
  } catch (error) {
    return null;
  }
}

function parseCitationCount(html) {
  const primaryMatch = html.match(/<td[^>]*class="gsc_rsb_std"[^>]*>\s*([\d,\s.]+)\s*<\/td>/);
  const fallbackMatch = html.match(/Cited by\s+([\d,\s.]+)/i);
  const rawValue = primaryMatch ? primaryMatch[1] : fallbackMatch && fallbackMatch[1];

  if (!rawValue) {
    throw new Error("Unable to find citation count in Google Scholar profile.");
  }

  const citations = Number(rawValue.replace(/[^\d]/g, ""));
  if (!Number.isFinite(citations)) {
    throw new Error("Google Scholar citation count is not numeric.");
  }

  return citations;
}

async function getHtmlWithFetch(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, requestTimeoutMs);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": userAgent,
        "Accept-Language": "en-US,en;q=0.9"
      },
      redirect: "follow",
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Google Scholar returned HTTP ${response.status}.`);
    }

    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

function getHtmlWithCurl(url) {
  return new Promise((resolve, reject) => {
    const args = [
      "-L",
      "--silent",
      "--show-error",
      "--fail",
      "--max-time",
      String(Math.ceil(requestTimeoutMs / 1000)),
      "-A",
      userAgent,
      "-H",
      "Accept-Language: en-US,en;q=0.9",
      url
    ];

    if (process.platform === "win32") {
      args.unshift("--ssl-no-revoke");
    }

    execFile("curl", args, { maxBuffer: 5 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr.trim() || error.message));
        return;
      }

      resolve(stdout);
    });
  });
}

async function fetchScholarHtml() {
  try {
    return await getHtmlWithFetch(scholarUrl);
  } catch (error) {
    return getHtmlWithCurl(scholarUrl);
  }
}

function isCacheFresh() {
  return Boolean(state.metrics && state.cachedAt && Date.now() - state.cachedAt < refreshIntervalMs);
}

async function refreshMetrics() {
  if (state.refreshing) {
    return state.refreshing;
  }

  state.refreshing = (async () => {
    const html = await fetchScholarHtml();
    const citations = parseCitationCount(html);
    const now = new Date();

    state.metrics = {
      citations,
      source: scholarUrl,
      updatedAt: now.toISOString()
    };
    state.cachedAt = now.getTime();
    state.lastError = "";

    return state.metrics;
  })();

  try {
    return await state.refreshing;
  } catch (error) {
    state.lastError = error.message;
    throw error;
  } finally {
    state.refreshing = null;
  }
}

async function getMetricsPayload() {
  if (!isCacheFresh()) {
    try {
      await refreshMetrics();
    } catch (error) {
      if (!state.metrics) {
        throw error;
      }
    }
  }

  return {
    ...state.metrics,
    cachedAt: state.cachedAt ? new Date(state.cachedAt).toISOString() : "",
    stale: !isCacheFresh(),
    provider: "google-scholar"
  };
}

function setCorsHeaders(request, response) {
  const origin = request.headers.origin;
  if (allowedOrigins.includes("*")) {
    response.setHeader("Access-Control-Allow-Origin", "*");
  } else if (origin && allowedOrigins.includes(origin)) {
    response.setHeader("Access-Control-Allow-Origin", origin);
    response.setHeader("Vary", "Origin");
  }

  response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function sendJson(request, response, statusCode, payload) {
  setCorsHeaders(request, response);
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(`${JSON.stringify(payload)}\n`);
}

const server = http.createServer(async (request, response) => {
  setCorsHeaders(request, response);

  if (request.method === "OPTIONS") {
    response.writeHead(204);
    response.end();
    return;
  }

  if (request.method !== "GET") {
    sendJson(request, response, 405, { ok: false, error: "Method not allowed." });
    return;
  }

  const url = new URL(request.url, `http://${request.headers.host || `${host}:${port}`}`);

  if (url.pathname === "/" || url.pathname === "/api/health") {
    sendJson(request, response, 200, {
      ok: true,
      service: "portfolio-scholar-api",
      timestamp: new Date().toISOString()
    });
    return;
  }

  if (url.pathname === "/api/scholar-metrics") {
    try {
      const metrics = await getMetricsPayload();
      sendJson(request, response, 200, metrics);
    } catch (error) {
      sendJson(request, response, 502, {
        ok: false,
        error: error.message,
        fallbackAvailable: Boolean(state.metrics)
      });
    }
    return;
  }

  sendJson(request, response, 404, { ok: false, error: "Not found." });
});

server.listen(port, host, () => {
  console.log(`Portfolio Scholar API listening on http://${host}:${port}`);
  refreshMetrics().catch((error) => {
    console.warn(`Initial Scholar refresh failed: ${error.message}`);
  });
});

setInterval(() => {
  refreshMetrics().catch((error) => {
    console.warn(`Scheduled Scholar refresh failed: ${error.message}`);
  });
}, refreshIntervalMs).unref();
