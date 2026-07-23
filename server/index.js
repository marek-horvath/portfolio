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
const blogDbPath = process.env.BLOG_DB_PATH || path.join(__dirname, "data", "blog-db.json");
const blogUploadDir = process.env.BLOG_UPLOAD_DIR || path.join(__dirname, "data", "blog-uploads");
const blogFileUploadDir =
  process.env.BLOG_FILE_UPLOAD_DIR || path.join(__dirname, "data", "blog-files");
const blogUploadMaxBytes = Number(process.env.BLOG_UPLOAD_MAX_BYTES || 8 * 1024 * 1024);
const blogFileUploadMaxBytes = Number(process.env.BLOG_FILE_UPLOAD_MAX_BYTES || 24 * 1024 * 1024);
const allowedBlogImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const allowedBlogFileTypes = new Set([
  "application/pdf",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/zip"
]);
const userAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const defaultBlogDrafts = [];

const timelineDrafts = [
  ["iceta-2023", "2023", "ICETA 2023", "Conference"],
  ["sami-2024", "2024", "SAMI 2024", "Conference"],
  ["scyr-2024", "2024", "SCYR 2024", "Doctoral event"],
  ["icpec-2024", "2024", "ICPEC 2024", "Conference"],
  ["olomouc-mobility-2024", "2024", "Olomouc CZ", "Mobility"],
  ["iceta-2024", "2024", "ICETA 2024", "Conference"],
  ["informatics-2024", "2024", "Informatics 2024", "Conference"],
  ["sami-2025", "2025", "SAMI 2025", "Conference"],
  ["minimovka-defense", "2025", "Minimovka", "Milestone"],
  ["scyr-2025", "2025", "SCYR 2025", "Doctoral event"],
  ["brno-summer-school", "2025", "Brno CZ", "Summer school"],
  ["ulysseus-curate-germany", "2025", "Münster DE", "Mobility"],
  ["greece-mobility", "2025", "Athens GR", "Mobility"],
  ["iceta-2025", "2025", "ICETA 2025", "Conference"],
  ["eger-hungary", "2025", "Eger HU", "Travel / academic stop"],
  ["sami-2026", "2026", "SAMI 2026", "Conference"],
  ["slovinsko-mobility", "2026", "Maribor SI", "Mobility"],
  ["scyr-2026", "2026", "SCYR 2026", "Doctoral event"],
  ["icpec-2026", "2026", "ICPEC 2026", "Conference"],
  ["ines-2026", "2026", "INES 2026", "Conference"]
];

const blogAccents = ["#2b6cb0", "#196147", "#9a5a08", "#8d2f56", "#5d4aa1", "#0f766e"];

function createDefaultTimelineSection([id, date, title, type], index) {
  return {
    id,
    date,
    title,
    type,
    description: `${type} checkpoint in the PhD timeline.`,
    details:
      `${title} is part of the longer PhD timeline. This entry keeps the date, event type, and room for a fuller story about research context, travel, people, and what changed in the PhD work around this point.\n\nThe public blog frontend enriches these entries with local photos and more specific copy.`,
    notes: ["PhD timeline checkpoint.", "Research and travel context.", "Longer story available in the blog view."],
    caption: "",
    accent: blogAccents[index % blogAccents.length],
    files: [],
    photos: []
  };
}

const defaultBlogArticle = {
  id: "phd-timeline",
  status: "draft",
  layout: "timeline",
  eyebrow: "Research timeline",
  title: "PhD Timeline",
  intro:
    "A scrollable PhD timeline from first conference checkpoints through mobilities, doctoral events, and later-stage research milestones.",
  sections: timelineDrafts.map(createDefaultTimelineSection)
};

const defaultTravelArticle = {
  id: "travel-blog",
  status: "draft",
  layout: "timeline",
  eyebrow: "Travel notes",
  title: "Travel Blog",
  intro:
    "A lighter place for trips, festivals, road notes, and photo-heavy stories that do not belong in the academic timeline.",
  sections: [
    {
      id: "colours-of-ostrava",
      date: "Travel",
      title: "Colours of Ostrava",
      type: "Festival",
      description:
        "Festival notes from Ostrava: music, city atmosphere, night lights, and small moments worth keeping.",
      details:
        "This can become a more visual story with short paragraphs rather than a long formal article. Add the year, favourite concerts, people, places around Ostrava, and a few photos that capture the atmosphere.\n\nGood structure later: arrival, best stage moments, city walk, night photos, and one short reflection after coming back.",
      notes: ["Add exact year.", "Add favourite concerts.", "Upload festival and city photos."],
      caption: "Festival, city, and night notes.",
      accent: "#c2410c",
      files: [],
      photos: [
        { label: "Stage", rotation: "-7deg", lift: "10px", url: "" },
        { label: "Ostrava", rotation: "4deg", lift: "-8px", url: "" },
        { label: "Night", rotation: "-2deg", lift: "18px", url: "" }
      ]
    },
    {
      id: "romania-roadtrip",
      date: "Travel",
      title: "Romania Roadtrip",
      type: "Roadtrip",
      description:
        "Roadtrip notes for routes, mountain roads, stops, food, photos, and practical memories from Romania.",
      details:
        "This section should work like a travel diary. Add the route, number of days, cities or nature stops, what surprised you, and what you would do differently next time.\n\nPhoto-wise this can be one of the strongest parts of the blog: roads, viewpoints, streets, car moments, and small details from the trip.",
      notes: ["Add route and dates.", "Add road and city photos.", "Write practical notes for future trips."],
      caption: "Road, mountains, and city notes.",
      accent: "#0f766e",
      files: [],
      photos: [
        { label: "Road", rotation: "5deg", lift: "8px", url: "" },
        { label: "View", rotation: "-6deg", lift: "-10px", url: "" },
        { label: "City", rotation: "3deg", lift: "18px", url: "" }
      ]
    }
  ]
};

const photoGalleryDrafts = [
  ["conference-lights", "Conference", "Conference Lights", "#2b6cb0"],
  ["roadtrip-window", "Travel", "Roadtrip Window", "#0f766e"],
  ["city-after-dark", "City", "City After Dark", "#8d2f56"],
  ["stage-memory", "Festival", "Stage Memory", "#c2410c"],
  ["research-desk", "Work", "Research Desk", "#5d4aa1"],
  ["train-notes", "Travel", "Train Notes", "#196147"],
  ["mountain-stop", "Roadtrip", "Mountain Stop", "#9a5a08"],
  ["old-town-walk", "City", "Old Town Walk", "#2f6f73"],
  ["greek-light", "Mobility", "Greek Light", "#d97706"],
  ["germany-streets", "Mobility", "Germany Streets", "#334155"],
  ["quiet-morning", "Everyday", "Quiet Morning", "#7c3aed"],
  ["after-talk", "Conference", "After Talk", "#be123c"]
];

function createDefaultGallerySection([id, date, title, accent], index) {
  return {
    id,
    date,
    title,
    type: "Photo",
    description: `${title} photo from the personal gallery.`,
    details:
      `Short note for ${title}. This item is intentionally lightweight: one image can open directly into the slideshow, and more photos can be attached later from the admin.`,
    notes: [],
    caption: title,
    accent,
    files: [],
    photos: [
      {
        label: title,
        rotation: ["-3deg", "2deg", "-1deg", "4deg"][index % 4],
        lift: ["0px", "-4px", "6px", "-2px"][index % 4],
        url: ""
      }
    ]
  };
}

const defaultPhotosArticle = {
  id: "photos-gallery",
  status: "draft",
  layout: "gallery",
  eyebrow: "Personal gallery",
  title: "Photos",
  intro:
    "A visual gallery for favourite photos from conferences, travels, cities, and small everyday moments.",
  sections: photoGalleryDrafts.map(createDefaultGallerySection)
};

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

const defaultBlogArticles = [defaultBlogArticle, defaultTravelArticle, defaultPhotosArticle];

function createDefaultBlogDbArticle(article) {
  const now = new Date().toISOString();

  return {
    ...article,
    createdAt: now,
    updatedAt: now
  };
}

function withDefaultBlogArticles(db) {
  const articles = Array.isArray(db.articles) ? [...db.articles] : [];

  defaultBlogArticles.forEach((defaultArticle) => {
    if (!articles.some((article) => article && article.id === defaultArticle.id)) {
      articles.push(createDefaultBlogDbArticle(defaultArticle));
    }
  });

  return {
    ...db,
    articles
  };
}

function ensureBlogDb() {
  const directory = path.dirname(blogDbPath);
  fs.mkdirSync(directory, { recursive: true });
  fs.mkdirSync(blogUploadDir, { recursive: true });
  fs.mkdirSync(blogFileUploadDir, { recursive: true });

  if (!fs.existsSync(blogDbPath)) {
    writeBlogDb({
      articles: defaultBlogArticles.map(createDefaultBlogDbArticle),
      draftBlogs: defaultBlogDrafts
    });
    return;
  }

  try {
    const db = JSON.parse(fs.readFileSync(blogDbPath, "utf8"));
    const nextDb = withDefaultBlogArticles(db);
    if (nextDb.articles.length !== (Array.isArray(db.articles) ? db.articles.length : 0)) {
      writeBlogDb(nextDb);
    }
  } catch {
    writeBlogDb({
      articles: defaultBlogArticles.map(createDefaultBlogDbArticle),
      draftBlogs: defaultBlogDrafts
    });
  }
}

function readBlogDb() {
  try {
    ensureBlogDb();
    const db = JSON.parse(fs.readFileSync(blogDbPath, "utf8"));
    return {
      articles: Array.isArray(db.articles) ? db.articles : [],
      draftBlogs: Array.isArray(db.draftBlogs) ? db.draftBlogs : defaultBlogDrafts,
      updatedAt: db.updatedAt || ""
    };
  } catch (error) {
    return {
      articles: defaultBlogArticles.map((article) => ({
        ...article,
        createdAt: "",
        updatedAt: ""
      })),
      draftBlogs: defaultBlogDrafts,
      updatedAt: ""
    };
  }
}

function writeBlogDb(db) {
  const directory = path.dirname(blogDbPath);
  fs.mkdirSync(directory, { recursive: true });
  fs.mkdirSync(blogUploadDir, { recursive: true });
  fs.mkdirSync(blogFileUploadDir, { recursive: true });

  const payload = {
    articles: Array.isArray(db.articles) ? db.articles : [],
    draftBlogs: Array.isArray(db.draftBlogs) ? db.draftBlogs : defaultBlogDrafts,
    updatedAt: new Date().toISOString()
  };
  const temporaryPath = `${blogDbPath}.tmp`;

  fs.writeFileSync(temporaryPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.renameSync(temporaryPath, blogDbPath);
}

function sanitizeString(value, maxLength = 160) {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, maxLength);
}

function sanitizeLongText(value, maxLength = 6000) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .trim()
    .slice(0, maxLength);
}

function slugify(value, fallback = "item") {
  const slug = sanitizeString(value, 140)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);

  return slug || fallback;
}

function sanitizeCssOffset(value, fallback) {
  const cleanValue = sanitizeString(value, 16);
  return /^-?\d+(\.\d+)?(deg|px)$/.test(cleanValue) ? cleanValue : fallback;
}

function sanitizeHexColor(value, fallback = "#2b6cb0") {
  const cleanValue = sanitizeString(value, 16);
  return /^#[0-9a-fA-F]{6}$/.test(cleanValue) ? cleanValue : fallback;
}

function sanitizeBlogPhoto(photo, index = 0) {
  const fallbackRotations = ["-6deg", "4deg", "-2deg"];
  const fallbackLifts = ["8px", "-6px", "14px"];

  return {
    label: sanitizeString(photo && photo.label ? photo.label : `Photo ${index + 1}`, 80),
    url: sanitizeString(photo && photo.url, 1000),
    rotation: sanitizeCssOffset(
      photo && photo.rotation,
      fallbackRotations[index % fallbackRotations.length]
    ),
    lift: sanitizeCssOffset(photo && photo.lift, fallbackLifts[index % fallbackLifts.length])
  };
}

function sanitizeBlogFile(file, index = 0) {
  return {
    label: sanitizeString(file && file.label ? file.label : `File ${index + 1}`, 120),
    url: sanitizeString(file && file.url, 1000),
    type: sanitizeString(file && file.type ? file.type : "download", 60),
    download: sanitizeString(file && file.download, 160)
  };
}

function sanitizeBlogSection(section, index = 0) {
  const title = sanitizeString(section && section.title, 140) || `Section ${index + 1}`;
  const rawNotes = Array.isArray(section && section.notes)
    ? section.notes
    : sanitizeString(section && section.notesText, 4000)
        .split(/\r?\n/)
        .map((note) => note.trim());
  const photos = Array.isArray(section && section.photos) ? section.photos : [];
  const files = Array.isArray(section && section.files) ? section.files : [];

  return {
    id: slugify(section && section.id ? section.id : title, `section-${index + 1}`),
    date: sanitizeString(section && section.date, 40),
    title,
    type: sanitizeString(section && section.type, 80),
    description: sanitizeString(section && section.description, 1600),
    details: sanitizeLongText(section && section.details, 6000),
    notes: rawNotes.map((note) => sanitizeString(note, 220)).filter(Boolean).slice(0, 8),
    caption: sanitizeString(section && section.caption, 220),
    accent: sanitizeHexColor(section && section.accent),
    files: files
      .slice(0, 8)
      .map((file, fileIndex) => sanitizeBlogFile(file, fileIndex))
      .filter((file) => file.label || file.url),
    photos: photos.slice(0, 6).map((photo, photoIndex) => sanitizeBlogPhoto(photo, photoIndex))
  };
}

function sanitizeBlogArticle(payload, existingArticle = null) {
  const title = sanitizeString(payload && payload.title, 180) || "Untitled article";
  const now = new Date().toISOString();
  const sections = Array.isArray(payload && payload.sections) ? payload.sections : [];
  const status = sanitizeString(payload && payload.status, 24);
  const layout = sanitizeString(payload && payload.layout, 40);

  return {
    id: slugify(payload && payload.id ? payload.id : title, "article"),
    status: status === "published" ? "published" : "draft",
    layout: layout === "gallery" ? "gallery" : "timeline",
    eyebrow: sanitizeString(payload && payload.eyebrow, 120),
    title,
    intro: sanitizeString(payload && payload.intro, 2200),
    sections: sections.map((section, index) => sanitizeBlogSection(section, index)).slice(0, 20),
    createdAt: existingArticle && existingArticle.createdAt ? existingArticle.createdAt : now,
    updatedAt: now
  };
}

function getBlogPayload() {
  const db = readBlogDb();

  return {
    ok: true,
    articles: db.articles,
    draftBlogs: db.draftBlogs,
    updatedAt: db.updatedAt
  };
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
  const knownProjects = [
    "Athena Dashboard",
    "WC Predictions",
    "SEUG",
    "Cloud Native Kosice",
    "Revik",
    "Krajčírstvo July",
    "Slovakdle",
    "Dema: Signal Breach"
  ];
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

function getRequestBaseUrl(request) {
  const forwardedProto = sanitizeString(request.headers["x-forwarded-proto"], 20);
  const forwardedHost = sanitizeString(request.headers["x-forwarded-host"], 180);
  const protocol = forwardedProto || (request.socket.encrypted ? "https" : "http");
  const requestHost = forwardedHost || sanitizeString(request.headers.host, 180) || `${host}:${port}`;

  return `${protocol}://${requestHost}`;
}

function extensionForContentType(contentType, filename = "") {
  const extension = path.extname(filename).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp", ".gif", ".pdf", ".ppt", ".pptx", ".doc", ".docx", ".zip"].includes(extension)) {
    return extension === ".jpeg" ? ".jpg" : extension;
  }

  return {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "application/pdf": ".pdf",
    "application/vnd.ms-powerpoint": ".ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
    "application/msword": ".doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
    "application/zip": ".zip"
  }[contentType];
}

function contentTypeForFile(filename) {
  const extension = path.extname(filename).toLowerCase();
  return (
    {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".gif": "image/gif",
      ".pdf": "application/pdf",
      ".ppt": "application/vnd.ms-powerpoint",
      ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ".doc": "application/msword",
      ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".zip": "application/zip"
    }[extension] || "application/octet-stream"
  );
}

function extractUploadData(payload) {
  let contentType = sanitizeString(payload.contentType || payload.type, 80);
  let base64 = sanitizeString(payload.data || payload.base64 || payload.dataUrl, blogUploadMaxBytes * 2);
  const dataUrlMatch = base64.match(/^data:([^;,]+);base64,(.+)$/);

  if (dataUrlMatch) {
    contentType = sanitizeString(dataUrlMatch[1], 80);
    base64 = dataUrlMatch[2];
  }

  return { contentType, base64 };
}

async function saveBlogUpload(request) {
  const payload = await readJsonBody(request, blogUploadMaxBytes * 2);
  const originalName = sanitizeString(payload.filename || payload.name || "blog-photo", 180);
  const { contentType, base64 } = extractUploadData(payload);

  if (!allowedBlogImageTypes.has(contentType)) {
    throw new Error("Only JPEG, PNG, WebP, and GIF images are supported.");
  }

  const buffer = Buffer.from(base64, "base64");
  if (!buffer.length || buffer.length > blogUploadMaxBytes) {
    throw new Error("Image is empty or too large.");
  }

  fs.mkdirSync(blogUploadDir, { recursive: true });
  const extension = extensionForContentType(contentType, originalName);
  const safeBaseName = slugify(path.basename(originalName, path.extname(originalName)), "blog-photo");
  const storedName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeBaseName}${extension}`;
  const filePath = path.join(blogUploadDir, storedName);

  fs.writeFileSync(filePath, buffer);

  const publicPath = `/api/blog/uploads/${storedName}`;
  return {
    ok: true,
    filename: storedName,
    path: publicPath,
    url: `${getRequestBaseUrl(request)}${publicPath}`
  };
}

async function saveBlogFileUpload(request) {
  const payload = await readJsonBody(request, blogFileUploadMaxBytes * 2);
  const originalName = sanitizeString(payload.filename || payload.name || "blog-file", 180);
  const { contentType, base64 } = extractUploadData(payload);

  if (!allowedBlogFileTypes.has(contentType)) {
    throw new Error("Only PDF, PowerPoint, Word, and ZIP files are supported.");
  }

  const buffer = Buffer.from(base64, "base64");
  if (!buffer.length || buffer.length > blogFileUploadMaxBytes) {
    throw new Error("File is empty or too large.");
  }

  fs.mkdirSync(blogFileUploadDir, { recursive: true });
  const extension = extensionForContentType(contentType, originalName);
  const safeBaseName = slugify(path.basename(originalName, path.extname(originalName)), "blog-file");
  const storedName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeBaseName}${extension}`;
  const filePath = path.join(blogFileUploadDir, storedName);

  fs.writeFileSync(filePath, buffer);

  const publicPath = `/api/blog/files/${storedName}`;
  return {
    ok: true,
    filename: storedName,
    path: publicPath,
    url: `${getRequestBaseUrl(request)}${publicPath}`
  };
}

function serveBlogUpload(request, response, uploadPathname) {
  const filename = decodeURIComponent(uploadPathname.replace("/api/blog/uploads/", ""));
  const safeFilename = path.basename(filename);

  if (!safeFilename || safeFilename !== filename) {
    sendJson(request, response, 400, { ok: false, error: "Invalid upload path." });
    return;
  }

  const filePath = path.join(blogUploadDir, safeFilename);
  const resolvedFilePath = path.resolve(filePath);
  const resolvedUploadDir = path.resolve(blogUploadDir);

  if (!resolvedFilePath.startsWith(resolvedUploadDir)) {
    sendJson(request, response, 400, { ok: false, error: "Invalid upload path." });
    return;
  }

  if (!fs.existsSync(resolvedFilePath)) {
    sendJson(request, response, 404, { ok: false, error: "Upload not found." });
    return;
  }

  setCorsHeaders(request, response);
  response.writeHead(200, {
    "Content-Type": contentTypeForFile(resolvedFilePath),
    "Cache-Control": "public, max-age=31536000, immutable"
  });
  fs.createReadStream(resolvedFilePath).pipe(response);
}

function serveBlogFile(request, response, filePathname) {
  const filename = decodeURIComponent(filePathname.replace("/api/blog/files/", ""));
  const safeFilename = path.basename(filename);

  if (!safeFilename || safeFilename !== filename) {
    sendJson(request, response, 400, { ok: false, error: "Invalid file path." });
    return;
  }

  const filePath = path.join(blogFileUploadDir, safeFilename);
  const resolvedFilePath = path.resolve(filePath);
  const resolvedUploadDir = path.resolve(blogFileUploadDir);

  if (!resolvedFilePath.startsWith(resolvedUploadDir)) {
    sendJson(request, response, 400, { ok: false, error: "Invalid file path." });
    return;
  }

  if (!fs.existsSync(resolvedFilePath)) {
    sendJson(request, response, 404, { ok: false, error: "File not found." });
    return;
  }

  setCorsHeaders(request, response);
  response.writeHead(200, {
    "Content-Type": contentTypeForFile(resolvedFilePath),
    "Content-Disposition": `attachment; filename="${safeFilename.replace(/"/g, "")}"`,
    "Cache-Control": "public, max-age=31536000, immutable"
  });
  fs.createReadStream(resolvedFilePath).pipe(response);
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

  response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
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

  if (request.method === "POST" && url.pathname === "/api/blog/uploads") {
    if (!isAnalyticsAdminAuthorized(request)) {
      sendJson(request, response, 401, { ok: false, error: "Invalid admin password." });
      return;
    }

    try {
      const upload = await saveBlogUpload(request);
      sendJson(request, response, 201, upload);
    } catch (error) {
      sendJson(request, response, 400, { ok: false, error: error.message });
    }
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/blog/files") {
    if (!isAnalyticsAdminAuthorized(request)) {
      sendJson(request, response, 401, { ok: false, error: "Invalid admin password." });
      return;
    }

    try {
      const upload = await saveBlogFileUpload(request);
      sendJson(request, response, 201, upload);
    } catch (error) {
      sendJson(request, response, 400, { ok: false, error: error.message });
    }
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/blog/articles") {
    if (!isAnalyticsAdminAuthorized(request)) {
      sendJson(request, response, 401, { ok: false, error: "Invalid admin password." });
      return;
    }

    try {
      const payload = await readJsonBody(request, 256 * 1024);
      const db = readBlogDb();
      const article = sanitizeBlogArticle(payload);
      const existingIndex = db.articles.findIndex((item) => item.id === article.id);

      if (existingIndex >= 0) {
        article.createdAt = db.articles[existingIndex].createdAt || article.createdAt;
        db.articles.splice(existingIndex, 1, article);
      } else {
        db.articles.unshift(article);
      }

      writeBlogDb(db);
      sendJson(request, response, 201, { ok: true, article, ...getBlogPayload() });
    } catch (error) {
      sendJson(request, response, 400, { ok: false, error: error.message });
    }
    return;
  }

  if (request.method === "PUT" && url.pathname.startsWith("/api/blog/articles/")) {
    if (!isAnalyticsAdminAuthorized(request)) {
      sendJson(request, response, 401, { ok: false, error: "Invalid admin password." });
      return;
    }

    try {
      const articleId = slugify(decodeURIComponent(url.pathname.replace("/api/blog/articles/", "")));
      const payload = await readJsonBody(request, 256 * 1024);
      const db = readBlogDb();
      const existingIndex = db.articles.findIndex((item) => item.id === articleId);
      const existingArticle = existingIndex >= 0 ? db.articles[existingIndex] : null;
      const article = sanitizeBlogArticle(payload, existingArticle);
      const duplicateIndex = db.articles.findIndex(
        (item, index) => item.id === article.id && index !== existingIndex
      );

      if (duplicateIndex >= 0) {
        throw new Error("Article slug already exists.");
      }

      if (existingIndex >= 0) {
        db.articles.splice(existingIndex, 1, article);
      } else {
        db.articles.unshift(article);
      }

      writeBlogDb(db);
      sendJson(request, response, 200, { ok: true, article, ...getBlogPayload() });
    } catch (error) {
      sendJson(request, response, 400, { ok: false, error: error.message });
    }
    return;
  }

  if (request.method === "DELETE" && url.pathname.startsWith("/api/blog/articles/")) {
    if (!isAnalyticsAdminAuthorized(request)) {
      sendJson(request, response, 401, { ok: false, error: "Invalid admin password." });
      return;
    }

    const articleId = slugify(decodeURIComponent(url.pathname.replace("/api/blog/articles/", "")));
    const db = readBlogDb();
    db.articles = db.articles.filter((article) => article.id !== articleId);
    writeBlogDb(db);
    sendJson(request, response, 200, { ok: true, ...getBlogPayload() });
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
      blog: true,
      timestamp: new Date().toISOString()
    });
    return;
  }

  if (url.pathname === "/api/blog/articles") {
    sendJson(request, response, 200, getBlogPayload());
    return;
  }

  if (url.pathname.startsWith("/api/blog/uploads/")) {
    serveBlogUpload(request, response, url.pathname);
    return;
  }

  if (url.pathname.startsWith("/api/blog/files/")) {
    serveBlogFile(request, response, url.pathname);
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
  ensureBlogDb();
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
