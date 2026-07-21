<template>
  <AdminPage v-if="isAdminRoute" />
  <BlogPage v-else-if="isBlogRoute" />
  <PortfolioPage v-else />
</template>

<script>
import AdminPage from "./components/AdminPage.vue";
import BlogPage from "./components/BlogPage.vue";
import PortfolioPage from "./components/PortfolioPage.vue";
import { trackClick } from "./utils/analytics";

const sourceAliases = {
  li: "LinkedIn",
  linkedin: "LinkedIn",
  ig: "Instagram",
  instagram: "Instagram",
  cv: "CV",
  resume: "CV",
  scholar: "Google Scholar",
  gs: "Google Scholar",
  email: "Email",
  mail: "Email"
};

function normalizeBaseUrl() {
  return process.env.BASE_URL || "/";
}

export default {
  name: "App",
  components: {
    AdminPage,
    BlogPage,
    PortfolioPage
  },
  computed: {
    isAdminRoute() {
      const pathname = window.location.pathname.replace(/\/+$/, "");
      const isAdminFallback = new URLSearchParams(window.location.search).get("admin") === "1";
      return isAdminFallback || pathname.endsWith("/portfolio/admin") || pathname.endsWith("/admin");
    },
    isBlogRoute() {
      const pathname = window.location.pathname.replace(/\/+$/, "");
      const isBlogFallback = new URLSearchParams(window.location.search).get("blog") === "1";
      return isBlogFallback || pathname.endsWith("/portfolio/blog") || pathname.endsWith("/blog");
    }
  },
  mounted() {
    this.normalizeAdminRoute();
    this.normalizeBlogRoute();
    this.trackEntrySource();
  },
  methods: {
    normalizeAdminRoute() {
      const params = new URLSearchParams(window.location.search);
      if (params.get("admin") === "1") {
        window.history.replaceState({}, "", `${normalizeBaseUrl()}admin`);
      }
    },
    normalizeBlogRoute() {
      const params = new URLSearchParams(window.location.search);
      if (params.get("blog") === "1") {
        window.history.replaceState({}, "", `${normalizeBaseUrl()}blog`);
      }
    },
    trackEntrySource() {
      if (this.isAdminRoute || this.isBlogRoute) {
        return;
      }

      const baseUrl = normalizeBaseUrl();
      const pathname = window.location.pathname;
      const querySource = new URLSearchParams(window.location.search).get("source");
      const pathSource = pathname
        .replace(new RegExp(`^${baseUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`), "")
        .replace(/^\/+|\/+$/g, "")
        .split("/")[0];
      const alias = (querySource || pathSource || "").toLowerCase();

      if (!alias) {
        return;
      }

      const sourceLabel = sourceAliases[alias] || alias;

      trackClick("source_visit", {
        label: sourceLabel,
        category: "source",
        language: document.documentElement.lang || "en",
        metadata: {
          source: alias
        }
      });

      window.history.replaceState({}, "", baseUrl);
    }
  }
};
</script>
