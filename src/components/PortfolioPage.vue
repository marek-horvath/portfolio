<template>
  <div class="portfolio-wrapper">
    <!-- Background particles -->
    <div id="particles-js" aria-hidden="true"></div>

    <!-- Main content -->
    <div class="portfolio-content">
      <div class="language-dock">
        <div class="language-switcher" role="group" :aria-label="copy.languageLabel">
          <button
            v-for="option in languageOptions"
            :key="option.code"
            type="button"
            :class="['language-option', { active: language === option.code }]"
            :aria-pressed="language === option.code"
            :aria-label="`${copy.languageLabel}: ${option.label}`"
            @click="setLanguage(option.code)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>

      <!-- HERO / HEADER SECTION -->
      <section class="hero">
        <div class="hero-text">
          <h1 class="profile-name">{{ copy.name }}</h1>
          <p class="profile-occupation">{{ copy.occupation }}</p>
          <p class="profile-location">{{ copy.currentLocation }}</p>
          <p class="profile-intro">{{ copy.intro }}</p>

          <div class="highlight-row">
            <span v-for="(item, index) in copy.highlights" :key="index" class="pill">
              {{ item }}
            </span>
          </div>

          <div class="mobile-hero-cta" :aria-label="copy.primaryActionsLabel">
            <a
              class="mobile-cta primary"
              :href="cvUrl"
              download="Marek-Horvath-CV.pdf"
              :aria-label="copy.downloadCv"
              @click="trackAction('hero_cv_download', 'CV', cvUrl)"
            >
              CV
            </a>
            <a
              class="mobile-cta secondary"
              :href="linkedinUrl"
              target="_blank"
              rel="noopener"
              :aria-label="copy.openLinkedIn"
              @click="trackAction('hero_linkedin', 'LinkedIn', linkedinUrl)"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <div class="hero-card">
          <div class="avatar-wrap">
            <img class="avatar" :src="profileImage" :alt="copy.profileAlt" />
          </div>
          <div class="hero-actions hero-card-actions">
            <a
              class="social-icon"
              :href="linkedinUrl"
              target="_blank"
              rel="noopener"
              :aria-label="copy.openLinkedIn"
              @click="trackAction('hero_icon_linkedin', 'LinkedIn', linkedinUrl)"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/145/145807.png"
                alt=""
                aria-hidden="true"
              />
            </a>
            <a
              class="cv-download"
              :href="cvUrl"
              download="Marek-Horvath-CV.pdf"
              :aria-label="copy.downloadCv"
              @click="trackAction('hero_card_cv_download', 'CV', cvUrl)"
            >
              <span>CV</span>
            </a>
            <div class="email-chip">
              <span class="email-text">{{ email }}</span>
              <button
                class="copy-btn"
                type="button"
                :aria-label="copy.copyEmail"
                @click="copyEmail"
              >
                {{ copyButtonLabel }}
              </button>
            </div>
          </div>

        </div>
      </section>

      <!-- TABS NAVIGATION -->
      <nav class="tab-nav" :aria-label="copy.tabsLabel">
        <!-- DESKTOP TABS (centered) -->
        <div class="desktop-tabs" role="tablist" :aria-label="copy.tabsLabel">
          <button
            v-for="tab in tabItems"
            :key="tab.id"
            type="button"
            :class="['tab-item', { active: activeTab === tab.id }]"
            role="tab"
            :aria-selected="activeTab === tab.id"
            :aria-controls="`panel-${tab.id}`"
            @click="selectTab(tab.id)"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- HAMBURGER (mobile only, right side) -->
        <div class="mobile-menu">
          <button
            class="hamburger"
            type="button"
            :aria-label="copy.menuLabel"
            :aria-expanded="navOpen"
            aria-controls="mobile-tab-menu"
            @click="toggleNavigation"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div id="mobile-tab-menu" class="mobile-dropdown" v-if="navOpen" role="tablist">
            <button
              v-for="tab in tabItems"
              :key="tab.id"
              type="button"
              :class="['tab-item', { active: activeTab === tab.id }]"
              role="tab"
              :aria-selected="activeTab === tab.id"
              :aria-controls="`panel-${tab.id}`"
              @click="selectTab(tab.id)"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
      </nav>

      <!-- TABS CONTENT -->
      <transition name="tab-fade" mode="out-in">
        <div
          :id="`panel-${activeTab}`"
          :key="activeTab"
          class="tab-content"
          role="tabpanel"
          tabindex="-1"
        >












        <!-- PUBLICATIONS TAB -->
        <PublicationsTab v-if="activeTab === 'publications'" :language="language" />

        <!-- WORK TAB -->
        <WorkTab v-else-if="activeTab === 'work'" :language="language" />

        <!-- WEB PROJECTS TAB -->
        <ProjectsTab v-else-if="activeTab === 'projects'" :language="language" />

        <!-- EDUCATION TAB -->
        <EducationTab v-else-if="activeTab === 'education'" :language="language" />

        <!-- HOBBIES TAB -->
        <HobbiesTab v-else-if="activeTab === 'hobbies'" :language="language" />

        <!-- TEACHING TAB -->
        <TeachingTab v-else-if="activeTab === 'teaching'" :language="language" />

        <!-- OTHER ACTIVITIES TAB -->
        <OtherActivitiesTab v-else-if="activeTab === 'other'" :language="language" />
        </div>
      </transition>

      <footer class="site-footer">
        <p class="last-updated">
          {{ copy.lastUpdatedLabel }} <span>{{ copy.lastUpdated }}</span>
        </p>
        <nav class="footer-links" :aria-label="copy.footerLinksLabel">
          <a
            :href="`mailto:${email}`"
            :aria-label="copy.emailLinkLabel"
            @click="trackAction('footer_email', 'Email', `mailto:${email}`)"
          >
            {{ copy.emailLabel }}
          </a>
          <a
            :href="scholarUrl"
            target="_blank"
            rel="noopener"
            :aria-label="copy.openScholar"
            @click="trackAction('footer_scholar', 'Google Scholar', scholarUrl)"
          >
            Google Scholar
          </a>
          <a
            :href="linkedinUrl"
            target="_blank"
            rel="noopener"
            :aria-label="copy.openLinkedIn"
            @click="trackAction('footer_linkedin', 'LinkedIn', linkedinUrl)"
          >
            LinkedIn
          </a>
          <a
            :href="cvUrl"
            download="Marek-Horvath-CV.pdf"
            :aria-label="copy.downloadCv"
            @click="trackAction('footer_cv_download', 'CV', cvUrl)"
          >
            CV
          </a>
        </nav>
      </footer>
    </div>
  </div>
</template>

<script>
import profileImage from "../assets/photo.jpg";
import PublicationsTab from "./tabs/PublicationsTab.vue";
import WorkTab from "./tabs/WorkTab.vue";
import ProjectsTab from "./tabs/ProjectsTab.vue";
import EducationTab from "./tabs/EducationTab.vue";
import HobbiesTab from "./tabs/HobbiesTab.vue";
import OtherActivitiesTab from "./tabs/OtherActivitiesTab.vue";
import TeachingTab from "./tabs/TeachingTab.vue";
import { trackClick } from "../utils/analytics";

const SUPPORTED_LANGUAGES = ["sk", "en"];
const LANGUAGE_STORAGE_KEY = "portfolio-language-v3";

const pageCopy = {
  en: {
    languageLabel: "Language",
    name: "Marek Horváth",
    currentLocation: "Košice, Slovakia",
    occupation: "PhD Student (Informatics) & Software Engineer",
    intro: "Identifying programmers through style analysis of source code and behavioral biometrics, while also exploring code similarity detection. In my free time, I engage in web development projects and actively participate in hackathons to refine my skills and collaborate with like-minded individuals.",
    profileAlt: "Portrait photo of Marek Horváth",
    downloadCv: "Download CV",
    openLinkedIn: "Open LinkedIn profile",
    openScholar: "Open Google Scholar profile",
    primaryActionsLabel: "Primary actions",
    copyEmail: "Copy email address",
    copy: "Copy",
    copyShort: "Copy",
    copied: "Copied",
    copyFailed: "Copy failed",
    tabsLabel: "Portfolio sections",
    menuLabel: "Open section menu",
    lastUpdatedLabel: "Last updated:",
    lastUpdated: "June 29, 2026",
    footerLinksLabel: "Footer links",
    emailLabel: "Email",
    emailLinkLabel: "Send email",
    highlights: [
      "Static Analysis",
      "Code Similarity",
      "Programmer Identification",
      "UI/UX",
      "Vue"
    ],
    tabs: {
      publications: "Publications",
      work: "Work",
      projects: "Web Projects",
      education: "Education",
      hobbies: "Hobbies",
      teaching: "Teaching",
      other: "Other Activities"
    }
  },
  sk: {
    languageLabel: "Jazyk",
    name: "Marek Horváth",
    currentLocation: "Košice, Slovensko",
    occupation: "Doktorand informatiky a softvérový inžinier",
    intro: "Venujem sa identifikácii programátorov cez analýzu štýlu zdrojového kódu a behaviorálne biometrie a zároveň skúmam detekciu podobnosti kódu. Vo voľnom čase pracujem na webových projektoch a pravidelne sa zapájam do hackathonov.",
    profileAlt: "Portrét Mareka Horvátha",
    downloadCv: "Stiahnuť životopis",
    openLinkedIn: "Otvoriť LinkedIn profil",
    openScholar: "Otvoriť Google Scholar profil",
    primaryActionsLabel: "Hlavné akcie",
    copyEmail: "Skopírovať emailovú adresu",
    copy: "Copy",
    copyShort: "Copy",
    copied: "Copied",
    copyFailed: "Error",
    tabsLabel: "Sekcie portfólia",
    menuLabel: "Otvoriť menu sekcií",
    lastUpdatedLabel: "Posledná aktualizácia:",
    lastUpdated: "29. júna 2026",
    footerLinksLabel: "Odkazy v pätičke",
    emailLabel: "Email",
    emailLinkLabel: "Poslať email",
    highlights: [
      "Statická analýza",
      "Podobnosť kódu",
      "Identifikácia programátorov",
      "UI/UX",
      "Vue"
    ],
    tabs: {
      publications: "Publikácie",
      work: "Prax",
      projects: "Weby",
      education: "Vzdelanie",
      hobbies: "Záujmy",
      teaching: "Výučba",
      other: "Aktivity"
    }
  }
};

const tabOrder = ["publications", "work", "projects", "education", "hobbies", "teaching", "other"];

function getInitialLanguage() {
  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (SUPPORTED_LANGUAGES.includes(storedLanguage)) {
    return storedLanguage;
  }

  return "en";
}

export default {
  name: "MinimalPortfolio",
  components: {
    PublicationsTab,
    WorkTab,
    ProjectsTab,
    EducationTab,
    HobbiesTab,
    OtherActivitiesTab,
    TeachingTab
  },
  data() {
    return {
      language: getInitialLanguage(),
      languageOptions: [
        { code: "sk", label: "SK" },
        { code: "en", label: "EN" }
      ],
      email: "marek.horvath@tuke.sk",
      linkedinUrl: "https://www.linkedin.com/in/horvathmar/",
      scholarUrl: "https://scholar.google.com/citations?user=9q0s2u4AAAAJ&hl=en&oi=ao",
      copyState: "",
      copyTimeout: null,
      isMobileViewport: window.innerWidth <= 768,
      profileImage,
      activeTab: "publications",
      navOpen: false
    };
  },
  computed: {
    copy() {
      return pageCopy[this.language] || pageCopy.en;
    },
    copyButtonLabel() {
      if (this.copyState === "copied") {
        return this.copy.copied;
      }
      if (this.copyState === "failed") {
        return this.copy.copyFailed;
      }
      if (this.isMobileViewport) {
        return this.copy.copyShort;
      }
      return this.copy.copy;
    },
    cvUrl() {
      return `${process.env.BASE_URL || "/"}CV-short-en.pdf`;
    },
    tabItems() {
      return tabOrder.map((id) => ({
        id,
        label: this.copy.tabs[id]
      }));
    }
  },
  watch: {
    language(language) {
      document.documentElement.lang = language;
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
  },
  mounted() {
    document.documentElement.lang = this.language;
    window.addEventListener("resize", this.updateViewport);

    /* global particlesJS */
    particlesJS.load("particles-js", "./particles-config.json", () => {
      console.log("Particles.js loaded!");
    });
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateViewport);
    clearTimeout(this.copyTimeout);
  },
  methods: {
    updateViewport() {
      this.isMobileViewport = window.innerWidth <= 768;
    },
    setLanguage(language) {
      if (!SUPPORTED_LANGUAGES.includes(language) || this.language === language) {
        return;
      }

      this.language = language;
      this.trackAction("language_switch", language.toUpperCase(), "", {
        language
      });
    },
    toggleNavigation() {
      this.navOpen = !this.navOpen;
      this.trackAction(this.navOpen ? "mobile_menu_open" : "mobile_menu_close", "Mobile menu");
    },
    copyEmail() {
      this.trackAction("copy_email", "Email", `mailto:${this.email}`);

      const text = this.email;
      const done = () => {
        this.copyState = "copied";
        clearTimeout(this.copyTimeout);
        this.copyTimeout = setTimeout(() => {
          this.copyState = "";
        }, 1600);
      };
      const fail = () => {
        this.copyState = "failed";
        clearTimeout(this.copyTimeout);
        this.copyTimeout = setTimeout(() => {
          this.copyState = "";
        }, 1600);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(fail);
        return;
      }

      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(textarea);
        ok ? done() : fail();
      } catch (err) {
        fail();
      }
    },
    selectTab(tabId) {
      if (this.activeTab !== tabId) {
        this.trackAction("tab_select", this.copy.tabs[tabId] || tabId, "", {
          tab: tabId
        });
      }

      this.activeTab = tabId;
      this.navOpen = false;
    },
    trackAction(eventName, label, targetUrl = "", metadata = {}) {
      trackClick(eventName, {
        label,
        targetUrl,
        language: this.language,
        metadata
      });
    }
  }
};
</script>


<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap");

/* Reset and base styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
:global(html),
:global(body) {
  width: 100%;
  overflow-x: hidden;
  font-family: "Plus Jakarta Sans", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background-color: #eef6ff;
  color: #0d1b2a;
}

/* Make text unselectable */
.unselectable {
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

:global(a:focus-visible),
:global(button:focus-visible),
:global([role="tab"]:focus-visible) {
  outline: 3px solid #2b6cb0;
  outline-offset: 3px;
}

/* Wrapper that centers content horizontally and allows vertical scroll if needed */
.portfolio-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding: 40px 82px 60px 20px;
  background:
    radial-gradient(900px 500px at 10% 10%, rgba(198, 222, 255, 0.45), transparent 60%),
    radial-gradient(700px 420px at 90% 20%, rgba(177, 216, 255, 0.4), transparent 60%),
    linear-gradient(140deg, #eef6ff 0%, #e7f0ff 45%, #f4f9ff 100%);
}
.portfolio-wrapper::before,
.portfolio-wrapper::after {
  content: none;
}

/* Background particles */
#particles-js {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
}

/* Main content area */
.portfolio-content {
  width: min(1100px, calc(100vw - 128px));
  background-color: rgba(255, 255, 255, 0.9);
  padding: 32px 36px 30px;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
  overflow: visible;
  border-radius: 22px;
  border: 1px solid rgba(13, 27, 42, 0.08);
  position: relative;
  z-index: 2;
  backdrop-filter: blur(6px);
  animation: fadeIn 0.8s ease-out;
}

.language-dock {
  position: absolute;
  top: 34px;
  right: -58px;
  z-index: 5;
}

.language-switcher {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px;
  border-radius: 0 18px 18px 0;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(13, 27, 42, 0.1);
  border-left: 0;
  box-shadow: 16px 18px 34px rgba(15, 23, 42, 0.12);
  backdrop-filter: blur(6px);
}

.language-option {
  width: 50px;
  min-height: 36px;
  border: 0;
  border-radius: 13px;
  padding: 7px 8px;
  background: transparent;
  color: #31577d;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  transition: background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}

.language-option.active {
  background: #163a66;
  color: #f8fbff;
  box-shadow: 0 8px 16px rgba(22, 58, 102, 0.18);
}

.language-option:focus-visible {
  outline: 2px solid #2b6cb0;
  outline-offset: 2px;
}

/* Hero */
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
  gap: 26px;
  align-items: center;
  margin-bottom: 26px;
}
.hero-text {
  display: flex;
  flex-direction: column;
  gap: 10px;
  animation: fadeUp 0.8s ease-out 0.1s both;
}
.eyebrow {
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 12px;
  font-weight: 600;
  color: #2c5ea8;
}
.profile-name {
  font-family: "Fraunces", "Times New Roman", serif;
  font-size: 40px;
  font-weight: 700;
  color: #10233d;
  margin-bottom: 2px;
  word-wrap: break-word;
}
.profile-location {
  font-size: 14px;
  color: #4b6c8d;
  font-weight: 500;
}
.profile-occupation {
  font-size: 20px;
  font-weight: 600;
  color: #163a66;
  letter-spacing: 0.2px;
}
.profile-intro {
  font-size: 15px;
  color: #3f5c78;
  line-height: 1.6;
}
.highlight-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}
.pill {
  padding: 6px 12px;
  border-radius: 999px;
  background-color: #dfeeff;
  color: #2c4f75;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

/* Hero card */
.hero-card {
  background: linear-gradient(160deg, #f8fbff, #e9f3ff);
  border-radius: 18px;
  padding: 18px;
  border: 1px solid rgba(44, 94, 168, 0.18);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.5);
  display: flex;
  flex-direction: column;
  gap: 14px;
  animation: fadeUp 0.8s ease-out 0.2s both;
}
.avatar-wrap {
  background: #ffffff;
  padding: 10px;
  border-radius: 16px;
  border: 1px solid rgba(13, 27, 42, 0.08);
  display: flex;
  justify-content: center;
}
.avatar {
  width: 100%;
  max-height: 240px;
  object-fit: cover;
  border-radius: 12px;
}
.hero-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.hero-role {
  font-weight: 600;
  font-size: 14px;
  color: #1f3d63;
}
.hero-focus {
  font-size: 13px;
  color: #466a8a;
  line-height: 1.5;
}
.hero-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
.mobile-hero-cta {
  display: none;
}
.hero-card-actions {
  margin-top: 12px;
}
.email-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 999px;
  background: #ffffff;
  border: 1px solid rgba(22, 58, 102, 0.2);
  font-size: 13px;
  font-weight: 600;
  color: #163a66;
}
.email-text {
  white-space: nowrap;
}
.copy-btn {
  border: 0;
  background: #163a66;
  color: #f8fbff;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 10px;
  border-radius: 999px;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.copy-btn:hover {
  transform: translateY(-1px);
}
.btn {
  padding: 10px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.btn.primary {
  background: #163a66;
  color: #f8fbff;
  box-shadow: 0 10px 20px rgba(22, 58, 102, 0.2);
}
.btn.ghost {
  border: 1px solid rgba(22, 58, 102, 0.25);
  color: #163a66;
  background: transparent;
}
.btn:hover {
  transform: translateY(-1px);
}

/* Social icons nav */
.social-nav {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
}
.social-icon {
  display: inline-flex;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border: 1px solid rgba(13, 27, 42, 0.1);
  opacity: 0.85;
  transition: opacity 0.3s, transform 0.3s;
}
.social-icon:hover {
  opacity: 1;
  transform: translateY(-2px);
}
.social-icon img {
  width: 70%;
  height: 70%;
  object-fit: contain;
}

.cv-download {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 34px;
  padding: 7px 11px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid rgba(13, 27, 42, 0.1);
  color: #163a66;
  font-size: 13px;
  font-weight: 800;
  line-height: 1;
  text-decoration: none;
  transition: opacity 0.3s, transform 0.3s, box-shadow 0.2s ease;
}

.cv-download:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 18px rgba(15, 23, 42, 0.08);
}

/* Tab navigation */
.tab-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 18px;
}
.desktop-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 6px;
  border-radius: 999px;
  border: 1px solid rgba(13, 27, 42, 0.12);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
}
.mobile-menu {
  display: none;
  position: absolute;
  right: 0;
}
.hamburger {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(13, 27, 42, 0.12);
  border-radius: 12px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 4px;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
}
.hamburger span {
  display: block;
  height: 2px;
  background-color: #163a66;
  border-radius: 2px;
}
.mobile-dropdown {
  position: absolute;
  top: 32px;
  right: 0;
  background-color: #f7fbff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  border-radius: 5px;
  padding: 10px;
}
.mobile-dropdown .tab-item {
  padding: 8px 16px;
  margin-bottom: 5px;
  border-radius: 4px;
  background-color: #e5f1ff;
  text-align: center;
}
.mobile-dropdown .tab-item:hover {
  background-color: #d7e9ff;
}

/* Common tab item styles */
.tab-item {
  appearance: none;
  border: 0;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 999px;
  background: transparent;
  color: #2b4f7a;
  font: inherit;
  font-weight: 600;
  font-size: 13px;
  transition: background-color 0.3s, color 0.3s, transform 0.2s ease;
  position: relative;
  isolation: isolate;
}
.tab-item.active {
  background: linear-gradient(130deg, #163a66, #2b6cb0);
  color: #f7fbff;
  box-shadow: 0 10px 18px rgba(22, 58, 102, 0.25);
}
.desktop-tabs .tab-item:hover {
  background-color: #dbeaff;
  transform: translateY(-1px);
}

/* Tab content */
.tab-content {
  text-align: left;
  font-size: 15px;
  color: #3f5873;
  line-height: 1.6;
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.tab-content :deep(h2) {
  text-align: center;
  font-size: 20px;
  margin-bottom: 18px;
  color: #163a66;
  font-family: "Fraunces", "Times New Roman", serif;
}

/* Scrollable content within tabs */
.tab-content :deep(.scrollable-content) {
  max-height: 360px;
  overflow-y: auto;
  padding-right: 10px;
  margin-bottom: 10px;
}

/* Content blocks */
.tab-content :deep(.pub-block),
.tab-content :deep(.work-block),
.tab-content :deep(.edu-block) {
  margin-bottom: 20px;
  background-color: #f7fbff;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid rgba(13, 27, 42, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.tab-content :deep(.pub-block:hover),
.tab-content :deep(.work-block:hover),
.tab-content :deep(.edu-block:hover) {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
}

.mobile-dropdown {
  animation: fadeScale 0.25s ease-out;
  transform-origin: top right;
}

.tab-item {
  position: relative;
  overflow: hidden;
}
.tab-item::after {
  content: "";
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 6px;
  height: 2px;
  background: rgba(255, 255, 255, 0.8);
  opacity: 0;
  transform: scaleX(0);
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.tab-item.active::after {
  opacity: 1;
  transform: scaleX(1);
}

.tab-fade-enter-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.tab-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.tab-fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.tab-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.tab-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
.tab-content :deep(.pub-block h3),
.tab-content :deep(.work-block h3),
.tab-content :deep(.edu-block h3) {
  font-size: 16px;
  margin-bottom: 5px;
  color: #12355f;
  line-height: 1.3;
}
.tab-content :deep(.pub-block p),
.tab-content :deep(.work-block p),
.tab-content :deep(.edu-block p) {
  font-size: 14px;
  color: #3d5874;
  line-height: 1.4;
}
.tab-content :deep(.pub-block p a),
.tab-content :deep(.work-block p a),
.tab-content :deep(.edu-block p a) {
  color: #1b6dd1;
  text-decoration: none;
}
.tab-content :deep(.pub-block p a:hover),
.tab-content :deep(.work-block p a:hover),
.tab-content :deep(.edu-block p a:hover) {
  text-decoration: underline;
}

/* Hackathon achievements list */
.tab-content :deep(.hack-list) {
  list-style: disc inside;
  margin: 10px 0 20px 0;
  padding-left: 10px;
  color: #3d5874;
  line-height: 1.4;
}
.tab-content :deep(.hack-list li) {
  margin-bottom: 8px;
}

.site-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 22px;
  padding-top: 16px;
  border-top: 1px solid rgba(13, 27, 42, 0.08);
  color: #4b6c8d;
  font-size: 12px;
}

.last-updated {
  margin: 0;
  font-weight: 600;
}

.last-updated span {
  color: #163a66;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.footer-links a {
  border-radius: 999px;
  padding: 6px 10px;
  background: #edf5ff;
  color: #163a66;
  font-weight: 700;
  text-decoration: none;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.footer-links a:hover {
  background: #dbeaff;
  transform: translateY(-1px);
}

.footer-links a:focus-visible,
.project-card:focus-visible,
.citation-chip:focus-visible,
.cv-download:focus-visible,
.social-icon:focus-visible,
.copy-btn:focus-visible,
.mobile-cta:focus-visible {
  box-shadow: 0 0 0 4px rgba(43, 108, 176, 0.18);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeScale {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}


/* Media query for mid-range screens */
@media (max-width: 900px) {
  .portfolio-content {
    width: 90%;
  }
  .language-dock {
    right: -52px;
  }
  .hero {
    grid-template-columns: 1fr;
  }
  .hero-card {
    order: -1;
  }
}

/* Media query for mobile screens */
@media (max-width: 768px) {
  #particles-js {
    display: none;
  }
  .mobile-menu {
    display: none;
  }
  .portfolio-wrapper {
    align-items: flex-start;
    padding: 14px 10px 28px;
    background:
      radial-gradient(420px 240px at 0% 0%, rgba(183, 214, 255, 0.42), transparent 70%),
      linear-gradient(180deg, #eaf4ff 0%, #f7fbff 100%);
  }
  .portfolio-content {
    width: 100%;
    max-width: 480px;
    padding: 14px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(13, 27, 42, 0.08);
    box-shadow: 0 16px 34px rgba(15, 23, 42, 0.12);
    backdrop-filter: blur(6px);
  }
  .language-dock {
    position: static;
    display: flex;
    justify-content: flex-end;
    margin-bottom: 12px;
  }
  .language-switcher {
    flex-direction: row;
    padding: 4px;
    border-left: 1px solid rgba(13, 27, 42, 0.1);
    border-radius: 999px;
    background: #eef6ff;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.45);
  }
  .language-option {
    width: 42px;
    min-height: 32px;
    border-radius: 999px;
  }
  .hero {
    display: flex;
    flex-direction: column;
    gap: 14px;
    text-align: center;
    margin-bottom: 16px;
  }
  .profile-intro {
    display: none;
  }
  .highlight-row {
    display: none;
  }
  .pill {
    flex: 0 1 auto;
    max-width: 100%;
    padding: 6px 10px;
    font-size: 11px;
    line-height: 1.25;
    white-space: normal;
  }
  .hero-text {
    order: 0;
    gap: 7px;
    width: 100%;
  }
  .mobile-hero-cta {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 9px;
    width: min(100%, 280px);
    margin: 4px auto 0;
  }
  .mobile-cta {
    display: inline-flex;
    min-height: 40px;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    padding: 9px 14px;
    font-size: 13px;
    font-weight: 800;
    line-height: 1;
    text-decoration: none;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
  }
  .mobile-cta.primary {
    background: #163a66;
    color: #f8fbff;
    box-shadow: 0 10px 20px rgba(22, 58, 102, 0.2);
  }
  .mobile-cta.secondary {
    border: 1px solid rgba(22, 58, 102, 0.24);
    background: #ffffff;
    color: #163a66;
  }
  .mobile-cta:hover {
    transform: translateY(-1px);
  }
  .hero-card {
    order: 1;
    width: 100%;
    padding: 10px;
    border: 1px solid rgba(44, 94, 168, 0.16);
    border-radius: 20px;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.5);
    background: linear-gradient(160deg, #f8fbff, #eaf4ff);
    gap: 12px;
  }
  .avatar-wrap {
    background: #ffffff;
    border: 1px solid rgba(13, 27, 42, 0.08);
    border-radius: 16px;
    padding: 8px;
  }
  .avatar {
    aspect-ratio: 4 / 3;
    max-height: none;
    border-radius: 12px;
    object-position: center;
  }
  .profile-name {
    font-size: 28px;
    line-height: 1.08;
  }
  .profile-occupation {
    max-width: 320px;
    margin: 0 auto;
    font-size: 14px;
    line-height: 1.35;
  }
  .profile-location {
    display: none;
  }
  .tab-nav {
    width: 100%;
    margin: 2px 0 14px;
    overflow: visible;
  }
  .desktop-tabs {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
    padding: 8px;
    overflow: visible;
    border: 1px solid rgba(13, 27, 42, 0.08);
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.72);
    box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);
  }
  .tab-item {
    display: flex;
    min-width: 0;
    min-height: 38px;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 8px 7px;
    border: 1px solid rgba(13, 27, 42, 0.08);
    background: rgba(255, 255, 255, 0.86);
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06);
    font-size: 12px;
    line-height: 1.15;
    white-space: normal;
  }
  .tab-item.active {
    box-shadow: 0 10px 18px rgba(22, 58, 102, 0.22);
  }
  .tab-content {
    font-size: 14px;
    padding-bottom: 2px;
  }
  .tab-content :deep(h2) {
    margin-bottom: 14px;
    font-size: 22px;
  }
  .scrollable-content {
    max-height: 220px;
  }
  .tab-content :deep(.scrollable-content) {
    max-height: none;
    overflow: visible;
    padding-right: 0;
  }
  .tab-content :deep(.pub-block),
  .tab-content :deep(.work-block),
  .tab-content :deep(.edu-block) {
    margin-bottom: 12px;
    padding: 13px 14px;
    border-radius: 14px;
    background: rgba(247, 251, 255, 0.94);
  }
  .tab-content :deep(.pub-block:hover),
  .tab-content :deep(.work-block:hover),
  .tab-content :deep(.edu-block:hover) {
    transform: none;
  }
  .hero-actions {
    width: 100%;
    display: grid;
    grid-template-columns: 38px 44px minmax(0, 1fr);
    justify-content: center;
    gap: 8px;
    margin-top: 0;
  }
  .hero-card-actions {
    display: none;
  }
  .social-icon,
  .cv-download,
  .email-chip {
    min-height: 38px;
  }
  .social-icon {
    width: 38px;
    height: 38px;
  }
  .cv-download {
    min-width: 44px;
    padding: 8px 10px;
  }
  .email-chip {
    min-width: 0;
    max-width: none;
    justify-content: space-between;
    gap: 6px;
    padding: 7px 7px 7px 11px;
  }
  .email-text {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .copy-btn {
    flex: 0 0 auto;
    min-width: 55px;
    padding: 6px 8px;
  }
  .btn {
    flex: 1;
    text-align: center;
  }
  .site-footer {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    margin-top: 18px;
    text-align: center;
  }
  .footer-links {
    justify-content: center;
  }
  .footer-links a {
    padding: 7px 11px;
  }
}

@media (max-width: 380px) {
  .portfolio-content {
    padding: 12px;
  }
  .hero-actions {
    grid-template-columns: 34px 42px minmax(0, 1fr);
    gap: 7px;
  }
  .social-icon {
    width: 34px;
    height: 34px;
  }
  .social-icon,
  .cv-download,
  .email-chip {
    min-height: 34px;
  }
  .cv-download {
    min-width: 42px;
    padding-right: 8px;
    padding-left: 8px;
  }
  .email-chip {
    max-width: 100%;
    padding: 6px 6px 6px 9px;
    font-size: 12px;
  }
  .copy-btn {
    min-width: 52px;
    padding: 5px 7px;
    font-size: 11px;
  }
  .tab-nav {
    width: 100%;
    margin-right: 0;
    margin-left: 0;
  }
  .desktop-tabs {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding-right: 8px;
    padding-left: 8px;
  }
}
</style>
