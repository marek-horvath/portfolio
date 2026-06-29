<template>
  <AdminPage v-if="isAdminRoute" />
  <PortfolioPage v-else />
</template>

<script>
import AdminPage from "./components/AdminPage.vue";
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
    PortfolioPage
  },
  computed: {
    isAdminRoute() {
      const pathname = window.location.pathname.replace(/\/+$/, "");
      const isAdminFallback = new URLSearchParams(window.location.search).get("admin") === "1";
      return isAdminFallback || pathname.endsWith("/portfolio/admin") || pathname.endsWith("/admin");
    }
  },
  mounted() {
    this.normalizeAdminRoute();
    this.trackEntrySource();
  },
  methods: {
    normalizeAdminRoute() {
      const params = new URLSearchParams(window.location.search);
      if (params.get("admin") === "1") {
        window.history.replaceState({}, "", `${normalizeBaseUrl()}admin`);
      }
    },
    trackEntrySource() {
      if (this.isAdminRoute) {
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
