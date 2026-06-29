const ANALYTICS_SESSION_KEY = "portfolio-analytics-session-v1";
const productionAnalyticsApiBaseUrl =
  "https://portfolio-scholar-api.167.233.132.16.sslip.io";

function createSessionId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

function getSessionId() {
  try {
    const storedSessionId = window.localStorage.getItem(ANALYTICS_SESSION_KEY);
    if (storedSessionId) {
      return storedSessionId;
    }

    const sessionId = createSessionId();
    window.localStorage.setItem(ANALYTICS_SESSION_KEY, sessionId);
    return sessionId;
  } catch {
    return createSessionId();
  }
}

export function getAnalyticsApiBaseUrl() {
  return (
    process.env.VUE_APP_ANALYTICS_API_URL ||
    (process.env.NODE_ENV === "development"
      ? "http://127.0.0.1:3002"
      : productionAnalyticsApiBaseUrl)
  );
}

export function trackClick(eventName, payload = {}) {
  if (!eventName || typeof window === "undefined") {
    return;
  }

  const body = {
    type: "click",
    eventName,
    label: payload.label || "",
    category: payload.category || "portfolio",
    targetUrl: payload.targetUrl || "",
    language: payload.language || "",
    path: `${window.location.pathname}${window.location.search}`,
    sessionId: getSessionId(),
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    metadata: payload.metadata || {}
  };
  const url = `${getAnalyticsApiBaseUrl()}/api/analytics/events`;
  const json = JSON.stringify(body);

  if (navigator.sendBeacon) {
    const blob = new Blob([json], { type: "text/plain;charset=UTF-8" });
    if (navigator.sendBeacon(url, blob)) {
      return;
    }
  }

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=UTF-8"
    },
    body: json,
    keepalive: true
  }).catch(() => {
    // Analytics should never interrupt the portfolio UI.
  });
}
