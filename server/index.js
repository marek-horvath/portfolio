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
const analyticsDbPath =
  process.env.ANALYTICS_DB_PATH || path.join(__dirname, "data", "analytics-db.json");
const analyticsEventLimit = Number(process.env.ANALYTICS_EVENT_LIMIT || 5000);
const analyticsAdminPassword = process.env.ANALYTICS_ADMIN_PASSWORD || "marecek";
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

function ensureAnalyticsDb() {
  const directory = path.dirname(analyticsDbPath);
  fs.mkdirSync(directory, { recursive: true });

  if (!fs.existsSync(analyticsDbPath)) {
    fs.writeFileSync(
      analyticsDbPath,
      `${JSON.stringify({ events: [], updatedAt: new Date().toISOString() }, null, 2)}\n`,
      "utf8"
    );
  }
}

function readAnalyticsDb() {
  try {
    ensureAnalyticsDb();
    const db = JSON.parse(fs.readFileSync(analyticsDbPath, "utf8"));
    return {
      events: Array.isArray(db.events) ? db.events : [],
      updatedAt: db.updatedAt || ""
    };
  } catch (error) {
    return { events: [], updatedAt: "" };
  }
}

function writeAnalyticsDb(db) {
  ensureAnalyticsDb();
  const trimmedEvents = db.events.slice(-analyticsEventLimit);
  const payload = {
    events: trimmedEvents,
    updatedAt: new Date().toISOString()
  };
  const temporaryPath = `${analyticsDbPath}.tmp`;

  fs.writeFileSync(temporaryPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.renameSync(temporaryPath, analyticsDbPath);
}

function sanitizeString(value, maxLength = 160) {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, maxLength);
}

function sanitizeMetadata(metadata) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return {};
  }

  return Object.entries(metadata).reduce((cleanMetadata, [key, value]) => {
    const cleanKey = sanitizeString(key, 48);
    if (!cleanKey) {
      return cleanMetadata;
    }

    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      cleanMetadata[cleanKey] = sanitizeString(String(value), 180);
    }

    return cleanMetadata;
  }, {});
}

function sanitizeViewport(viewport) {
  if (!viewport || typeof viewport !== "object") {
    return null;
  }

  const width = Number(viewport.width);
  const height = Number(viewport.height);

  if (!Number.isFinite(width) || !Number.isFinite(height)) {
    return null;
  }

  return {
    width: Math.max(0, Math.min(Math.round(width), 10000)),
    height: Math.max(0, Math.min(Math.round(height), 10000))
  };
}

function createAnalyticsEvent(payload, request) {
  const now = new Date();
  const eventName = sanitizeString(payload.eventName || payload.name || "unknown_click", 80);
  const label = sanitizeString(payload.label, 140);
  const targetUrl = sanitizeString(payload.targetUrl, 500);

  return {
    id: `${now.getTime()}-${Math.random().toString(36).slice(2, 10)}`,
    type: eventName === "source_visit" ? "visit" : "click",
    eventName: eventName || "unknown_click",
    label,
    category: sanitizeString(payload.category || "portfolio", 80),
    targetUrl,
    path: sanitizeString(payload.path, 220),
    language: sanitizeString(payload.language, 8),
    sessionId: sanitizeString(payload.sessionId, 90),
    viewport: sanitizeViewport(payload.viewport),
    metadata: sanitizeMetadata(payload.metadata),
    userAgent: sanitizeString(request.headers["user-agent"] || "", 300),
    createdAt: now.toISOString()
  };
}

function saveAnalyticsEvent(event) {
  const db = readAnalyticsDb();
  db.events.push(event);
  writeAnalyticsDb(db);
}

function countRecentEvents(events, sinceMs) {
  return events.filter((event) => {
    const createdAt = Date.parse(event.createdAt);
    return Number.isFinite(createdAt) && createdAt >= sinceMs;
  }).length;
}

function summarizeTop(events, keySelector, limit = 8) {
  const counts = new Map();

  events.forEach((event) => {
    const key = keySelector(event);
    if (!key) {
      return;
    }

    const current = counts.get(key.value) || {
      ...key,
      count: 0
    };
    current.count += 1;
    counts.set(key.value, current);
  });

  return Array.from(counts.values())
    .sort((left, right) => right.count - left.count)
    .slice(0, limit);
}

function summarizeMatching(events, predicate, keySelector, limit = 20) {
  return summarizeTop(events.filter(predicate), keySelector, limit);
}

function createOrderedCounts(items, events, predicate) {
  return items.map((item) => ({
    ...item,
    count: events.filter((event) => predicate(event, item)).length
  }));
}

function getButtonCounts(events) {
  const buttons = [
    {
      value: "cv",
      label: "CV",
      predicate: (event) => event.eventName.includes("cv_download")
    },
    {
      value: "linkedin",
      label: "LinkedIn",
      predicate: (event) => event.eventName.includes("linkedin")
    },
    {
      value: "email",
      label: "Email / Copy",
      predicate: (event) => event.eventName === "copy_email" || event.eventName === "footer_email"
    },
    {
      value: "scholar",
      label: "Google Scholar",
      predicate: (event) => event.eventName.includes("scholar")
    },
    {
      value: "language",
      label: "Language switch",
      predicate: (event) => event.eventName === "language_switch"
    }
  ];

  return buttons.map((button) => ({
    value: button.value,
    label: button.label,
    count: events.filter(button.predicate).length
  }));
}

function getTabCounts(events) {
  const tabs = [
    { value: "publications", label: "Publications" },
    { value: "work", label: "Work" },
    { value: "projects", label: "Web Projects" },
    { value: "education", label: "Education" },
    { value: "hobbies", label: "Hobbies" },
    { value: "teaching", label: "Teaching" },
    { value: "other", label: "Other Activities" }
  ];

  return createOrderedCounts(
    tabs,
    events,
    (event, tab) => event.eventName === "tab_select" && event.metadata.tab === tab.value
  );
}

function getProjectCounts(events) {
  const knownProjects = ["Revik", "SEUG", "Krajčírstvo July", "Dema: Signal Breach", "Slovakdle"];
  const knownCounts = createOrderedCounts(
    knownProjects.map((project) => ({ value: project, label: project })),
    events,
    (event, project) => event.eventName === "project_open" && event.label === project.value
  );
  const knownProjectSet = new Set(knownProjects);
  const extraCounts = summarizeMatching(
    events,
    (event) => event.eventName === "project_open" && !knownProjectSet.has(event.label),
    (event) => ({
      value: event.label || event.targetUrl,
      label: event.label || event.targetUrl
    })
  );

  return [...knownCounts, ...extraCounts];
}

function getSourceCounts(events) {
  return summarizeMatching(
    events,
    (event) => event.eventName === "source_visit" && event.metadata.source,
    (event) => ({
      value: event.metadata.source,
      label: `/${event.metadata.source}`
    }),
    50
  );
}

function createDailyClicks(events) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Bratislava",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
  const counts = new Map();
  const days = [];

  for (let index = 13; index >= 0; index -= 1) {
    const date = new Date(Date.now() - index * 24 * 60 * 60 * 1000);
    const key = formatter.format(date);
    counts.set(key, 0);
    days.push(key);
  }

  events.forEach((event) => {
    const createdAt = Date.parse(event.createdAt);
    if (!Number.isFinite(createdAt)) {
      return;
    }

    const key = formatter.format(new Date(createdAt));
    if (counts.has(key)) {
      counts.set(key, counts.get(key) + 1);
    }
  });

  return days.map((date) => ({
    date,
    count: counts.get(date) || 0
  }));
}

function getAnalyticsSummary() {
  const events = readAnalyticsDb().events;
  const clickEvents = events.filter((event) => event.type !== "visit");
  const now = Date.now();
  const sessions = new Set(events.map((event) => event.sessionId).filter(Boolean));

  return {
    totalClicks: clickEvents.length,
    sourceVisits: events.length - clickEvents.length,
    clicksLast24Hours: countRecentEvents(clickEvents, now - 24 * 60 * 60 * 1000),
    clicksLast7Days: countRecentEvents(clickEvents, now - 7 * 24 * 60 * 60 * 1000),
    uniqueSessions: sessions.size,
    clickBreakdown: {
      buttons: getButtonCounts(clickEvents),
      tabs: getTabCounts(clickEvents),
      projects: getProjectCounts(clickEvents),
      sources: getSourceCounts(events)
    },
    topEvents: summarizeTop(clickEvents, (event) => ({
      value: event.eventName,
      eventName: event.eventName,
      label: event.label || event.eventName
    })),
    topTargets: summarizeTop(clickEvents, (event) => {
      const value = event.targetUrl || event.path || event.label;
      return value
        ? {
            value,
            targetUrl: event.targetUrl,
            label: event.label || value
          }
        : null;
    }),
    dailyClicks: createDailyClicks(clickEvents),
    recentEvents: events.slice(-30).reverse()
  };
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

function readJsonBody(request, maxBytes = 32 * 1024) {
  return new Promise((resolve, reject) => {
    let receivedBytes = 0;
    let body = "";

    request.on("data", (chunk) => {
      receivedBytes += chunk.length;
      if (receivedBytes > maxBytes) {
        reject(new Error("Request body is too large."));
        request.destroy();
        return;
      }

      body += chunk.toString("utf8");
    });

    request.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error("Request body must be valid JSON."));
      }
    });

    request.on("error", reject);
  });
}

function isAnalyticsAdminAuthorized(request) {
  return request.headers["x-admin-password"] === analyticsAdminPassword;
}

function setCorsHeaders(request, response) {
  const origin = request.headers.origin;
  if (allowedOrigins.includes("*")) {
    response.setHeader("Access-Control-Allow-Origin", "*");
  } else if (origin && allowedOrigins.includes(origin)) {
    response.setHeader("Access-Control-Allow-Origin", origin);
    response.setHeader("Vary", "Origin");
  }

  response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Admin-Password");
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

  const url = new URL(request.url, `http://${request.headers.host || `${host}:${port}`}`);

  if (request.method === "POST" && url.pathname === "/api/analytics/events") {
    try {
      const payload = await readJsonBody(request);
      const event = createAnalyticsEvent(payload, request);
      saveAnalyticsEvent(event);
      sendJson(request, response, 201, { ok: true, id: event.id });
    } catch (error) {
      sendJson(request, response, 400, { ok: false, error: error.message });
    }
    return;
  }

  if (request.method !== "GET") {
    sendJson(request, response, 405, { ok: false, error: "Method not allowed." });
    return;
  }

  if (url.pathname === "/" || url.pathname === "/api/health") {
    sendJson(request, response, 200, {
      ok: true,
      service: "portfolio-api",
      analytics: true,
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

  if (url.pathname === "/api/analytics/summary") {
    if (!isAnalyticsAdminAuthorized(request)) {
      sendJson(request, response, 401, { ok: false, error: "Invalid admin password." });
      return;
    }

    sendJson(request, response, 200, getAnalyticsSummary());
    return;
  }

  sendJson(request, response, 404, { ok: false, error: "Not found." });
});

server.listen(port, host, () => {
  ensureAnalyticsDb();
  console.log(`Portfolio API listening on http://${host}:${port}`);
  refreshMetrics().catch((error) => {
    console.warn(`Initial Scholar refresh failed: ${error.message}`);
  });
});

setInterval(() => {
  refreshMetrics().catch((error) => {
    console.warn(`Scheduled Scholar refresh failed: ${error.message}`);
  });
}, refreshIntervalMs).unref();
