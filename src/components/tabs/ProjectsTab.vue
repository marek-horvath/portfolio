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
        >
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
const projectsCopy = {
  en: {
    title: "Web Projects",
    intro: "Selected websites and small web products I build outside of research and teaching, mostly for real people, small teams, and public-facing ideas.",
    openLabel: "Open",
    tagsLabel: "Project tags",
    projects: [
      {
        name: "Revik",
        type: "Business website",
        url: "https://www.revik.sk/",
        description: "Presentation website for a local cleaning service, focused on a clear service offer, trust, and fast contact from visitors.",
        tags: ["Services", "Local business", "Contact flow"]
      },
      {
        name: "SEUG",
        type: "Academic website",
        url: "https://seug.kpi.fei.tuke.sk/",
        description: "Website for a university group at KPI FEI TUKE, built to present activities, people, and academic context in one place.",
        tags: ["University", "Group website", "TUKE"]
      },
      {
        name: "Krajčírstvo July",
        type: "Service website",
        url: "https://krajcirstvo.vercel.app/",
        description: "Public website for a tailoring service with a practical service overview and a reservation-oriented workflow.",
        tags: ["Tailoring", "Reservations", "Small business"]
      },
      {
        name: "Dema: Signal Breach",
        type: "Interactive project",
        url: "https://dema-jade.vercel.app/",
        description: "Interactive web project with a game-like presentation and a more experimental visual direction.",
        tags: ["Interactive", "Game feel", "Vercel"]
      },
      {
        name: "Slovakdle",
        type: "Browser game",
        url: "https://slovakdle.vercel.app/",
        description: "A Slovak guessing game inspired by daily puzzle formats, centered around Slovak personalities and simple repeat play.",
        tags: ["Game", "Slovak content", "Daily puzzle"]
      }
    ]
  },
  sk: {
    title: "Weby",
    intro: "Výber webov a menších webových produktov, ktoré robím mimo výskumu a výučby pre ľudí, malé tímy a verejné nápady.",
    openLabel: "Otvoriť",
    tagsLabel: "Tagy projektu",
    projects: [
      {
        name: "Revik",
        type: "Firemný web",
        url: "https://www.revik.sk/",
        description: "Prezentačný web pre lokálnu čistiacu službu so zameraním na jasnú ponuku služieb, dôveryhodnosť a rýchly kontakt.",
        tags: ["Služby", "Lokálny biznis", "Kontakt"]
      },
      {
        name: "SEUG",
        type: "Akademický web",
        url: "https://seug.kpi.fei.tuke.sk/",
        description: "Web univerzitnej skupiny na KPI FEI TUKE, ktorý sústreďuje aktivity, ľudí a akademický kontext na jednom mieste.",
        tags: ["Univerzita", "Skupina", "TUKE"]
      },
      {
        name: "Krajčírstvo July",
        type: "Web služieb",
        url: "https://krajcirstvo.vercel.app/",
        description: "Verejný web pre krajčírstvo s praktickým prehľadom služieb a workflow orientovaným na rezervácie.",
        tags: ["Krajčírstvo", "Rezervácie", "Malý biznis"]
      },
      {
        name: "Dema: Signal Breach",
        type: "Interaktívny projekt",
        url: "https://dema-jade.vercel.app/",
        description: "Interaktívny webový projekt s hernou prezentáciou a experimentálnejším vizuálnym smerovaním.",
        tags: ["Interaktivita", "Herný feeling", "Vercel"]
      },
      {
        name: "Slovakdle",
        type: "Browser hra",
        url: "https://slovakdle.vercel.app/",
        description: "Slovenská hádacia hra inšpirovaná dennými puzzle formátmi, zameraná na slovenské osobnosti a jednoduché opakované hranie.",
        tags: ["Hra", "Slovenský obsah", "Denné puzzle"]
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
    copy() {
      return projectsCopy[this.language] || projectsCopy.en;
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
