import defaultContent from "../content/default-content.json";
import { getAnalyticsApiBaseUrl } from "./analytics";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeContent(content) {
  const fallback = clone(defaultContent);
  const source = content && typeof content === "object" ? content : {};
  const textBlocks =
    source.textBlocks && typeof source.textBlocks === "object" && !Array.isArray(source.textBlocks)
      ? source.textBlocks
      : {};

  return {
    ...fallback,
    ...source,
    projects: Array.isArray(source.projects) ? source.projects : fallback.projects,
    articles: Array.isArray(source.articles) ? source.articles : fallback.articles,
    textBlocks: {
      ...fallback.textBlocks,
      ...textBlocks
    }
  };
}

export function getDefaultContent() {
  return clone(defaultContent);
}

export async function fetchPortfolioContent() {
  const response = await fetch(`${getAnalyticsApiBaseUrl()}/api/content`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Unable to load portfolio content.");
  }

  const payload = await response.json();
  return normalizeContent(payload.content || payload);
}

export function getLocalizedProject(project, language) {
  const localized = project[language] || project.en || project.sk || {};
  const fallback = project.en || project.sk || {};

  return {
    ...project,
    name: localized.name || fallback.name || project.id || "",
    type: localized.type || fallback.type || "",
    previewAlt: localized.previewAlt || fallback.previewAlt || localized.name || fallback.name || "",
    description: localized.description || fallback.description || "",
    tags: Array.isArray(localized.tags) ? localized.tags : Array.isArray(fallback.tags) ? fallback.tags : []
  };
}

export function sortContentItems(items) {
  return [...items].sort((left, right) => {
    const leftOrder = Number(left.order);
    const rightOrder = Number(right.order);
    const normalizedLeft = Number.isFinite(leftOrder) ? leftOrder : 9999;
    const normalizedRight = Number.isFinite(rightOrder) ? rightOrder : 9999;

    if (normalizedLeft !== normalizedRight) {
      return normalizedLeft - normalizedRight;
    }

    return String(left.id || left.url || "").localeCompare(String(right.id || right.url || ""));
  });
}
