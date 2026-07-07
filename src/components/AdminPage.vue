<template>
  <main class="admin-page">
    <section
      :class="['admin-shell', { 'login-shell': !authorized }]"
      :aria-labelledby="authorized ? 'admin-title' : null"
      :aria-label="authorized ? null : 'Admin login'"
    >
      <header v-if="authorized" class="admin-header">
        <a class="back-link" :href="portfolioUrl">Portfolio</a>
        <div>
          <p class="eyebrow">Private analytics</p>
          <h1 id="admin-title">Portfolio admin</h1>
          <p class="admin-subtitle">
            Prehľad klikov na taby, CV, LinkedIn, Scholar, email a web projekty.
          </p>
        </div>
      </header>

      <form v-if="!authorized" class="login-only" @submit.prevent="loadSummary">
        <input
          id="admin-password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          autofocus
          :placeholder="error ? 'Nesprávne heslo' : 'Heslo'"
          :aria-label="error ? 'Nesprávne heslo' : 'Heslo'"
          :aria-invalid="Boolean(error)"
        />
      </form>

      <template v-else>
        <div class="admin-toolbar">
          <p>
            API:
            <span>{{ apiBaseUrl }}</span>
          </p>
          <button type="button" @click="loadSummary" :disabled="loading">
            {{ loading ? "Obnovujem" : "Obnoviť" }}
          </button>
        </div>

        <p v-if="error" class="error-message" role="alert">{{ error }}</p>

        <section v-if="summary" class="stats-grid" aria-label="Analytics summary">
          <article class="stat-card">
            <span>Všetky kliky</span>
            <strong>{{ summary.totalClicks }}</strong>
          </article>
          <article class="stat-card">
            <span>Skratky</span>
            <strong>{{ summary.sourceVisits }}</strong>
          </article>
          <article class="stat-card">
            <span>Posledných 24h</span>
            <strong>{{ summary.clicksLast24Hours }}</strong>
          </article>
          <article class="stat-card">
            <span>Posledných 7 dní</span>
            <strong>{{ summary.clicksLast7Days }}</strong>
          </article>
          <article class="stat-card">
            <span>Relácie</span>
            <strong>{{ summary.uniqueSessions }}</strong>
          </article>
        </section>

        <section v-if="summary" class="admin-panel chart-panel">
          <div class="panel-heading">
            <div>
              <h2>Kliky podľa dátumu</h2>
              <p>Denný počet klikov za posledných 14 dní.</p>
            </div>
            <strong>{{ maxDailyClicks }} max/deň</strong>
          </div>

          <div class="line-chart">
            <svg viewBox="0 0 680 280" role="img" :aria-label="chartLabel">
              <line
                class="axis-line"
                :x1="chart.left"
                :x2="chart.right"
                :y1="chart.bottom"
                :y2="chart.bottom"
              />
              <line
                class="axis-line"
                :x1="chart.left"
                :x2="chart.left"
                :y1="chart.top"
                :y2="chart.bottom"
              />

              <g v-for="tick in yTicks" :key="tick.value">
                <line
                  class="grid-line"
                  :x1="chart.left"
                  :x2="chart.right"
                  :y1="tick.y"
                  :y2="tick.y"
                />
                <text class="axis-label y-label" :x="chart.left - 10" :y="tick.y + 4">
                  {{ tick.value }}
                </text>
              </g>

              <polyline v-if="chartPoints" class="chart-line" :points="chartPoints" />
              <g v-for="point in chartDots" :key="point.date">
                <circle class="chart-dot" :cx="point.x" :cy="point.y" r="4" />
                <title>{{ point.date }}: {{ point.count }} klikov</title>
              </g>

              <g v-for="point in xLabels" :key="point.date">
                <text
                  class="axis-label x-label"
                  :x="point.x"
                  :y="chart.bottom + 28"
                  text-anchor="middle"
                >
                  {{ shortDate(point.date) }}
                </text>
              </g>

              <text class="axis-title" :x="chart.left" :y="chart.top - 8">
                kliknutia
              </text>
              <text class="axis-title" :x="chart.right" :y="chart.bottom + 48" text-anchor="end">
                dátum
              </text>
            </svg>
          </div>
        </section>

        <section v-if="summary" class="panel-grid">
          <article class="admin-panel">
            <h2>Tlačidlá a linky</h2>
            <ul class="metric-list">
              <li v-for="item in buttonCounts" :key="item.value">
                <span>{{ item.label }}</span>
                <strong>{{ item.count }}</strong>
              </li>
            </ul>
          </article>

          <article class="admin-panel">
            <h2>Taby</h2>
            <ul class="metric-list">
              <li v-for="item in tabCounts" :key="item.value">
                <span>{{ item.label }}</span>
                <strong>{{ item.count }}</strong>
              </li>
            </ul>
          </article>

          <article class="admin-panel">
            <h2>Web projekty</h2>
            <ul class="metric-list">
              <li v-for="item in projectCounts" :key="item.value">
                <span>{{ item.label }}</span>
                <strong>{{ item.count }}</strong>
              </li>
            </ul>
          </article>

          <article class="admin-panel">
            <h2>Skratky</h2>
            <ul class="metric-list">
              <li v-for="item in sourceCounts" :key="item.value">
                <span>{{ item.label }}</span>
                <strong>{{ item.count }}</strong>
              </li>
            </ul>
          </article>
        </section>

        <section v-if="summary" class="admin-panel">
          <h2>Posledné kliky</h2>
          <div v-if="summary.recentEvents.length" class="events-table-wrap">
            <table class="events-table">
              <thead>
                <tr>
                  <th>Čas</th>
                  <th>Akcia</th>
                  <th>Label</th>
                  <th>Jazyk</th>
                  <th>Cieľ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="event in summary.recentEvents" :key="event.id">
                  <td>{{ formatDate(event.createdAt) }}</td>
                  <td>{{ event.eventName }}</td>
                  <td>{{ event.label || "-" }}</td>
                  <td>{{ event.language || "-" }}</td>
                  <td>{{ event.targetUrl || event.path || "-" }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-else class="empty-state">Zatiaľ nie sú uložené žiadne kliky.</p>
        </section>
      </template>
    </section>
  </main>
</template>

<script>
import { getAnalyticsApiBaseUrl } from "../utils/analytics";

const ADMIN_PASSWORD_STORAGE_KEY = "portfolio-admin-password";

export default {
  name: "AdminPage",
  data() {
    return {
      password: "",
      authorized: false,
      loading: false,
      error: "",
      summary: null,
      apiBaseUrl: getAnalyticsApiBaseUrl(),
      chart: {
        width: 680,
        height: 280,
        top: 30,
        right: 650,
        bottom: 218,
        left: 48
      }
    };
  },
  computed: {
    portfolioUrl() {
      return process.env.BASE_URL || "/";
    },
    breakdown() {
      return this.summary && this.summary.clickBreakdown
        ? this.summary.clickBreakdown
        : { buttons: [], tabs: [], projects: [] };
    },
    buttonCounts() {
      return this.breakdown.buttons || [];
    },
    tabCounts() {
      return this.breakdown.tabs || [];
    },
    projectCounts() {
      return this.breakdown.projects || [];
    },
    sourceCounts() {
      return this.breakdown.sources || [];
    },
    dailyClicks() {
      return this.summary ? this.summary.dailyClicks || [] : [];
    },
    maxDailyClicks() {
      if (!this.dailyClicks.length) {
        return 1;
      }

      return Math.max(...this.dailyClicks.map((day) => day.count), 1);
    },
    chartDots() {
      if (!this.dailyClicks.length) {
        return [];
      }

      const plotWidth = this.chart.right - this.chart.left;
      const plotHeight = this.chart.bottom - this.chart.top;
      const divisor = Math.max(this.dailyClicks.length - 1, 1);

      return this.dailyClicks.map((day, index) => {
        const x = this.chart.left + (index / divisor) * plotWidth;
        const y = this.chart.bottom - (day.count / this.maxDailyClicks) * plotHeight;

        return {
          ...day,
          x: Number(x.toFixed(2)),
          y: Number(y.toFixed(2))
        };
      });
    },
    chartPoints() {
      return this.chartDots.map((point) => `${point.x},${point.y}`).join(" ");
    },
    yTicks() {
      const values = Array.from(new Set([0, Math.ceil(this.maxDailyClicks / 2), this.maxDailyClicks]));
      const plotHeight = this.chart.bottom - this.chart.top;

      return values
        .sort((left, right) => left - right)
        .map((value) => ({
          value,
          y: this.chart.bottom - (value / this.maxDailyClicks) * plotHeight
        }));
    },
    xLabels() {
      if (this.chartDots.length <= 7) {
        return this.chartDots;
      }

      return this.chartDots.filter((point, index) => index % 2 === 0 || index === this.chartDots.length - 1);
    },
    chartLabel() {
      return "Graf denných klikov, os X je dátum a os Y je počet kliknutí.";
    }
  },
  mounted() {
    const storedPassword = window.sessionStorage.getItem(ADMIN_PASSWORD_STORAGE_KEY);
    if (storedPassword) {
      this.password = storedPassword;
      this.loadSummary();
    }
  },
  methods: {
    async loadSummary() {
      if (!this.password) {
        this.error = "Zadaj heslo.";
        return;
      }

      this.loading = true;
      this.error = "";

      try {
        const response = await fetch(`${this.apiBaseUrl}/api/analytics/summary`, {
          headers: {
            "X-Admin-Password": this.password
          },
          cache: "no-store"
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || "Nepodarilo sa načítať analytics.");
        }

        this.summary = payload;
        this.authorized = true;
        window.sessionStorage.setItem(ADMIN_PASSWORD_STORAGE_KEY, this.password);
      } catch (error) {
        this.error = error.message;
        this.authorized = false;
        this.summary = null;
      } finally {
        this.loading = false;
      }
    },
    shortDate(value) {
      const date = new Date(`${value}T00:00:00`);
      if (Number.isNaN(date.getTime())) {
        return value;
      }

      return date.toLocaleDateString("sk-SK", {
        day: "2-digit",
        month: "2-digit"
      });
    },
    formatDate(value) {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) {
        return "-";
      }

      return date.toLocaleString("sk-SK", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
    }
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap");

.admin-page {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  padding: 28px 16px;
  background:
    radial-gradient(800px 420px at 12% 8%, rgba(185, 216, 255, 0.48), transparent 62%),
    radial-gradient(700px 380px at 86% 0%, rgba(208, 231, 255, 0.5), transparent 60%),
    linear-gradient(135deg, #eef6ff 0%, #f8fbff 100%);
  color: #0d1b2a;
  font-family: "Plus Jakarta Sans", "Segoe UI", sans-serif;
}

.admin-shell {
  width: min(1120px, 100%);
  margin: 0 auto;
  padding: 28px;
  border: 1px solid rgba(13, 27, 42, 0.08);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
}

.admin-shell.login-shell {
  width: min(320px, 100%);
  padding: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
}

.admin-header {
  display: flex;
  align-items: flex-start;
  gap: 18px;
  margin-bottom: 20px;
}

.back-link,
.admin-toolbar button,
.password-row button {
  display: inline-flex;
  min-height: 40px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 999px;
  padding: 10px 14px;
  background: #163a66;
  color: #f8fbff;
  font: inherit;
  font-size: 13px;
  font-weight: 800;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.back-link:hover,
.admin-toolbar button:hover,
.password-row button:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(22, 58, 102, 0.16);
}

.back-link:focus-visible,
.admin-toolbar button:focus-visible,
.password-row button:focus-visible,
.password-row input:focus-visible {
  outline: 3px solid #2b6cb0;
  outline-offset: 3px;
}

.eyebrow {
  margin: 0 0 5px;
  color: #2b6cb0;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

h1,
h2,
p {
  margin: 0;
}

h1 {
  color: #10233d;
  font-family: "Fraunces", "Times New Roman", serif;
  font-size: clamp(30px, 6vw, 48px);
  line-height: 1.08;
}

h2 {
  margin-bottom: 14px;
  color: #12355f;
  font-size: 17px;
}

.admin-subtitle {
  margin-top: 8px;
  color: #3f5c78;
  line-height: 1.5;
}

.login-panel,
.admin-panel,
.stat-card {
  border: 1px solid rgba(13, 27, 42, 0.08);
  border-radius: 14px;
  background: #f7fbff;
}

.login-only {
  width: min(320px, 100%);
  margin: 18vh auto;
}

.login-only input {
  width: 100%;
  min-height: 46px;
  border: 1px solid rgba(22, 58, 102, 0.18);
  border-radius: 12px;
  padding: 11px 13px;
  background: #ffffff;
  color: #10233d;
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
}

.login-only input[aria-invalid="true"] {
  border-color: rgba(160, 35, 35, 0.45);
  color: #a02323;
}

.login-only input:focus-visible {
  outline: 3px solid #2b6cb0;
  outline-offset: 3px;
}

.error-message {
  margin-top: 10px;
  color: #a02323;
  font-size: 13px;
  font-weight: 700;
}

.admin-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  border: 1px solid rgba(13, 27, 42, 0.08);
  border-radius: 14px;
  padding: 10px 12px;
  background: #f7fbff;
  color: #4b6c8d;
  font-size: 13px;
}

.admin-toolbar span {
  color: #163a66;
  font-weight: 800;
}

.stats-grid,
.panel-grid {
  display: grid;
  gap: 14px;
}

.stats-grid {
  grid-template-columns: repeat(5, minmax(0, 1fr));
  margin-bottom: 14px;
}

.panel-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-bottom: 14px;
}

.stat-card,
.admin-panel {
  padding: 16px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
}

.stat-card span {
  display: block;
  margin-bottom: 8px;
  color: #4b6c8d;
  font-size: 12px;
  font-weight: 800;
}

.stat-card strong {
  color: #10233d;
  font-size: 30px;
}

.panel-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 8px;
}

.panel-heading h2 {
  margin-bottom: 4px;
}

.panel-heading p {
  color: #4b6c8d;
  font-size: 13px;
  font-weight: 700;
}

.panel-heading strong {
  flex: 0 0 auto;
  border-radius: 999px;
  padding: 6px 10px;
  background: #e5f1ff;
  color: #163a66;
  font-size: 12px;
}

.chart-panel {
  margin-bottom: 14px;
}

.line-chart {
  overflow-x: auto;
}

.line-chart svg {
  display: block;
  width: 100%;
  min-width: 620px;
  height: auto;
}

.axis-line {
  stroke: rgba(22, 58, 102, 0.35);
  stroke-width: 1.5;
}

.grid-line {
  stroke: rgba(22, 58, 102, 0.1);
  stroke-width: 1;
}

.chart-line {
  fill: none;
  stroke: #163a66;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 4;
}

.chart-dot {
  fill: #2b6cb0;
  stroke: #ffffff;
  stroke-width: 2;
}

.axis-label,
.axis-title {
  fill: #4b6c8d;
  font-size: 12px;
  font-weight: 800;
}

.y-label {
  text-anchor: end;
}

.metric-list {
  display: grid;
  gap: 9px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.metric-list li {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(13, 27, 42, 0.07);
}

.metric-list li:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.metric-list span {
  min-width: 0;
  overflow: hidden;
  color: #31577d;
  font-size: 13px;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.metric-list strong {
  min-width: 34px;
  border-radius: 999px;
  padding: 5px 8px;
  background: #163a66;
  color: #f8fbff;
  font-size: 12px;
  font-weight: 900;
  text-align: center;
}

.events-table-wrap {
  overflow-x: auto;
}

.events-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.events-table th,
.events-table td {
  max-width: 260px;
  padding: 9px 8px;
  border-bottom: 1px solid rgba(13, 27, 42, 0.08);
  color: #31577d;
  text-align: left;
  vertical-align: top;
  word-break: break-word;
}

.events-table th {
  color: #12355f;
  font-weight: 900;
}

.empty-state {
  color: #4b6c8d;
  font-size: 13px;
  font-weight: 700;
}

@media (max-width: 920px) {
  .panel-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 820px) {
  .admin-page {
    padding: 14px 10px 26px;
  }

  .admin-shell {
    padding: 16px;
    border-radius: 20px;
  }

  .admin-header,
  .admin-toolbar,
  .password-row,
  .panel-heading {
    flex-direction: column;
    align-items: stretch;
  }

  .login-layout {
    grid-template-columns: 1fr;
  }

  .login-hero {
    min-height: 220px;
    padding: 20px;
  }

  .login-panel {
    padding: 18px;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 460px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
