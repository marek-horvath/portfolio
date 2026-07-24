<template>
  <div class="projects-tab">
    <h2>{{ copy.title }}</h2>
    <p class="projects-intro">{{ copy.intro }}</p>

    <div class="scrollable-content">
      <div class="projects-grid">
        <a
          v-for="project in copy.projects"
          :key="project.url"
          class="project-card"
          :href="project.url"
          target="_blank"
          rel="noopener"
          :aria-label="`${copy.openProjectLabel} ${project.name}`"
          @click="trackProject(project)"
        >
          <div class="project-preview">
            <img
              :src="projectImages[project.imageKey]"
              :alt="project.previewAlt"
              loading="lazy"
            />
          </div>

          <div class="project-card-top">
            <span class="project-type">{{ project.type }}</span>
            <span class="project-open">{{ copy.openLabel }}</span>
          </div>

          <h3>{{ project.name }}</h3>
          <p>{{ project.description }}</p>

          <ul class="project-tags" :aria-label="copy.tagsLabel">
            <li v-for="tag in project.tags" :key="tag">{{ tag }}</li>
          </ul>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import athenaImage from "../../assets/athena.png";
import cnkImage from "../../assets/cnk.png";
import demaImage from "../../assets/dema.png";
import footballImage from "../../assets/football.png";
import krajcirstvoImage from "../../assets/krajcirstvo.png";
import neurologiaImage from "../../assets/neurologia.png";
import revikImage from "../../assets/revik.png";
import seugImage from "../../assets/seug.png";
import slovakdleImage from "../../assets/slovakdle.png";
import { trackClick } from "../../utils/analytics";

const projectImages = {
  athena: athenaImage,
  cnk: cnkImage,
  dema: demaImage,
  football: footballImage,
  krajcirstvo: krajcirstvoImage,
  neurologia: neurologiaImage,
  revik: revikImage,
  seug: seugImage,
  slovakdle: slovakdleImage
};

const projectsCopy = {
  en: {
    title: "Web Projects",
    intro: "Selected websites, dashboards, games, and small web products I build outside research and teaching. Most of them include a small custom admin or analytics layer for clicks, redirects, and real usage signals.",
    openLabel: "Open",
    openProjectLabel: "Open project",
    tagsLabel: "Project tags",
    projects: [
      {
        name: "Athena Dashboard",
        type: "Testing dashboard",
        url: "https://athena-kappa-one.vercel.app",
        imageKey: "athena",
        previewAlt: "Preview of the Athena testing dashboard",
        description: "Complex system for testing student programming assignments: it downloads submissions from GitLab, runs them safely in isolated Docker containers, and stores structured results for review.",
        tags: ["Autograding", "GitLab", "Docker"]
      },
      {
        name: "Doctor Booking System",
        type: "Medical reservation system",
        url: "https://neurologia-vert.vercel.app/",
        imageKey: "neurologia",
        previewAlt: "Preview of the medical reservation system",
        description: "Booking system for a medical practice with patient reservations, an admin interface for managing appointments, and automatic email reminders sent to patients.",
        tags: ["Healthcare", "Bookings", "Email reminders"]
      },
      {
        name: "WC Predictions",
        type: "Prediction app",
        url: "http://167.233.132.16",
        imageKey: "football",
        previewAlt: "Preview of the WC Predictions football app",
        description: "Hobby app for predicting football results with friends. It automatically scraped final scores from Flashscore, evaluated picks, and kept leaderboards up to date.",
        tags: ["Football", "Scraping", "Leaderboards"]
      },
      {
        name: "SEUG",
        type: "Academic website",
        url: "https://seug.kpi.fei.tuke.sk/",
        imageKey: "seug",
        previewAlt: "Preview of the SEUG website",
        description: "Website for a research group at KPI FEI TUKE with people, activities, and automatic extraction of new publications for all group members.",
        tags: ["Research group", "Publications", "Automation"]
      },
      {
        name: "Cloud Native Kosice",
        type: "Community website",
        url: "https://marek-horvath.github.io/cnk",
        imageKey: "cnk",
        previewAlt: "Preview of the Cloud Native Kosice meetup website",
        description: "Community website for Cloud Native Kosice meetups with event information, program details, history, location, email signup, and lightweight custom analytics.",
        tags: ["Community", "Meetups", "Analytics"]
      },
      {
        name: "Revik",
        type: "Business website",
        url: "https://www.revik.sk/",
        imageKey: "revik",
        previewAlt: "Preview of the Revik website",
        description: "Presentation website for a local cleaning service, focused on a clear offer, fast contact, and a small admin/analytics layer for tracking real visitor actions.",
        tags: ["Services", "Local business", "Analytics"]
      },
      {
        name: "Krajčírstvo July",
        type: "Service website",
        url: "https://krajcirstvo.vercel.app/",
        imageKey: "krajcirstvo",
        previewAlt: "Preview of the Krajčírstvo July website",
        description: "Public website for a tailoring service with a practical service overview, contact-oriented flow, and custom analytics for understanding visitor clicks.",
        tags: ["Tailoring", "Small business", "Analytics"]
      },
      {
        name: "Slovakdle",
        type: "Browser game",
        url: "https://slovakdle.vercel.app/",
        imageKey: "slovakdle",
        previewAlt: "Preview of the Slovakdle browser game",
        description: "My first Wordle-inspired browser game adapted for Slovakia, built around Slovak-themed guessing and simple repeat play.",
        tags: ["Game", "Slovakia", "Wordle inspired"]
      },
      {
        name: "Dema: Signal Breach",
        type: "Interactive project",
        url: "https://dema-jade.vercel.app/",
        imageKey: "dema",
        previewAlt: "Preview of the Dema Signal Breach web project",
        description: "Twenty One Pilots-inspired branching story game in the style of a Telltale narrative, with minigames and roughly 100 custom illustrations.",
        tags: ["Branching story", "Minigames", "Illustrations"]
      }
    ]
  },
  sk: {
    title: "Weby",
    intro: "Výber webov, dashboardov, hier a menších webových produktov, ktoré robím mimo výskumu a výučby. Väčšina z nich má aj malé vlastné admin alebo analytics rozhranie na kliknutia, presmerovania a reálne používanie.",
    openLabel: "Otvoriť",
    openProjectLabel: "Otvoriť projekt",
    tagsLabel: "Tagy projektu",
    projects: [
      {
        name: "Athena Dashboard",
        type: "Testovací dashboard",
        url: "https://athena-kappa-one.vercel.app",
        imageKey: "athena",
        previewAlt: "Náhľad testovacieho dashboardu Athena",
        description: "Komplexný systém na testovanie študentských programátorských zadaní: automaticky sťahuje riešenia z GitLabu, spúšťa ich bezpečne v oddelených Docker kontajneroch a zapisuje štruktúrované výsledky.",
        tags: ["Autograding", "GitLab", "Docker"]
      },
      {
        name: "Rezervačný systém pre ambulanciu",
        type: "Doktorský rezervačný systém",
        url: "https://neurologia-vert.vercel.app/",
        imageKey: "neurologia",
        previewAlt: "Náhľad rezervačného systému pre ambulanciu",
        description: "Rezervačný systém pre ambulanciu s objednávaním pacientov, admin rozhraním na správu termínov a automatickým posielaním emailových pripomienok pacientom.",
        tags: ["Ambulancia", "Rezervácie", "Email reminders"]
      },
      {
        name: "WC Predictions",
        type: "Tipovacia aplikácia",
        url: "http://167.233.132.16",
        imageKey: "football",
        previewAlt: "Náhľad futbalovej aplikácie WC Predictions",
        description: "Hobby projekt na tipovanie futbalových výsledkov s kamarátmi. Automaticky scrapoval finálne výsledky z Flashscore, vyhodnocoval tipy a udržiaval leaderboard.",
        tags: ["Futbal", "Scraping", "Leaderboard"]
      },
      {
        name: "SEUG",
        type: "Akademický web",
        url: "https://seug.kpi.fei.tuke.sk/",
        imageKey: "seug",
        previewAlt: "Náhľad webu SEUG",
        description: "Web výskumnej skupiny na KPI FEI TUKE s ľuďmi, aktivitami a automatickou extrakciou nových článkov pre všetkých členov skupiny.",
        tags: ["Výskumná skupina", "Publikácie", "Automatizácia"]
      },
      {
        name: "Cloud Native Kosice",
        type: "Komunitný web",
        url: "https://marek-horvath.github.io/cnk",
        imageKey: "cnk",
        previewAlt: "Náhľad webu Cloud Native Kosice",
        description: "Komunitný web pre Cloud Native Kosice meetupy s informáciami o eventoch, programom, históriou, miestom konania, emailovým prihlasovaním a vlastnou lightweight analytics vrstvou.",
        tags: ["Komunita", "Meetupy", "Analytics"]
      },
      {
        name: "Revik",
        type: "Firemný web",
        url: "https://www.revik.sk/",
        imageKey: "revik",
        previewAlt: "Náhľad webu Revik",
        description: "Prezentačný web pre lokálnu čistiacu službu so zameraním na jasnú ponuku, rýchly kontakt a malé admin/analytics rozhranie na sledovanie reálnych kliknutí.",
        tags: ["Služby", "Lokálny biznis", "Analytics"]
      },
      {
        name: "Krajčírstvo July",
        type: "Web služieb",
        url: "https://krajcirstvo.vercel.app/",
        imageKey: "krajcirstvo",
        previewAlt: "Náhľad webu Krajčírstvo July",
        description: "Verejný web pre krajčírstvo s praktickým prehľadom služieb, kontaktne orientovaným flow a vlastnou analytics vrstvou na pochopenie kliknutí návštevníkov.",
        tags: ["Krajčírstvo", "Malý biznis", "Analytics"]
      },
      {
        name: "Slovakdle",
        type: "Browser hra",
        url: "https://slovakdle.vercel.app/",
        imageKey: "slovakdle",
        previewAlt: "Náhľad hry Slovakdle",
        description: "Moja prvá Wordle-inšpirovaná browser hra upravená na Slovensko, postavená okolo slovenských tém a jednoduchého opakovaného hrania.",
        tags: ["Hra", "Slovensko", "Wordle inspired"]
      },
      {
        name: "Dema: Signal Breach",
        type: "Interaktívny projekt",
        url: "https://dema-jade.vercel.app/",
        imageKey: "dema",
        previewAlt: "Náhľad projektu Dema Signal Breach",
        description: "Twenty One Pilots inšpirovaná branching story hra v štýle Telltale príbehu, s minihrami a približne 100 vlastnými ilustráciami.",
        tags: ["Branching story", "Minihry", "Ilustrácie"]
      }
    ]
  }
};

export default {
  name: "ProjectsTab",
  props: {
    language: {
      type: String,
      default: "en"
    }
  },
  computed: {
    projectImages() {
      return projectImages;
    },
    copy() {
      return projectsCopy[this.language] || projectsCopy.en;
    }
  },
  methods: {
    trackProject(project) {
      trackClick("project_open", {
        label: project.name,
        targetUrl: project.url,
        language: this.language,
        metadata: {
          type: project.type
        }
      });
    }
  }
};
</script>

<style scoped>
.projects-intro {
  max-width: 760px;
  margin: -4px auto 18px;
  color: #3f5c78;
  font-size: 14px;
  line-height: 1.55;
  text-align: center;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.project-card {
  display: flex;
  min-height: 190px;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  border: 1px solid rgba(13, 27, 42, 0.08);
  border-radius: 12px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(247, 251, 255, 0.98)),
    #f7fbff;
  color: inherit;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.project-card:hover {
  transform: translateY(-2px);
  border-color: rgba(43, 108, 176, 0.26);
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
}

.project-card:focus-visible {
  border-color: rgba(43, 108, 176, 0.58);
  box-shadow: 0 0 0 4px rgba(43, 108, 176, 0.18), 0 12px 24px rgba(15, 23, 42, 0.08);
  outline: none;
}

.project-preview {
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  border: 1px solid rgba(13, 27, 42, 0.08);
  background: #eaf4ff;
  aspect-ratio: 16 / 9;
}

.project-preview img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.24s ease;
}

.project-card:hover .project-preview img {
  transform: scale(1.025);
}

.project-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.project-type {
  color: #4b6c8d;
  font-size: 12px;
  font-weight: 700;
}

.project-open {
  flex: 0 0 auto;
  border-radius: 999px;
  padding: 5px 9px;
  background: #163a66;
  color: #f8fbff;
  font-size: 12px;
  font-weight: 700;
}

.project-card h3 {
  margin: 0;
  color: #12355f;
  font-size: 17px;
  line-height: 1.3;
}

.project-card p {
  margin: 0;
  color: #3d5874;
  font-size: 14px;
  line-height: 1.45;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin: auto 0 0;
  padding: 0;
  list-style: none;
}

.project-tags li {
  border-radius: 999px;
  padding: 5px 8px;
  background: #e5f1ff;
  color: #31577d;
  font-size: 11px;
  font-weight: 700;
}

@media (max-width: 900px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }

  .project-card {
    min-height: 0;
  }
}

@media (max-width: 768px) {
  .projects-intro {
    margin: -2px auto 14px;
    font-size: 13px;
    text-align: left;
  }

  .projects-grid {
    gap: 12px;
  }

  .project-card {
    padding: 14px;
    border-radius: 14px;
  }

  .project-preview {
    border-radius: 12px;
  }

  .project-card h3 {
    font-size: 16px;
  }

  .project-card p {
    font-size: 13px;
  }

  .project-tags {
    gap: 6px;
  }
}
</style>
