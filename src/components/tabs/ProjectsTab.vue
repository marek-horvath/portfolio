<template>
  <div class="projects-tab">
    <h2>{{ copy.title }}</h2>
    <p class="projects-intro">{{ copy.intro }}</p>

    <div class="scrollable-content">
      <div class="projects-grid">
        <a
          v-for="project in localizedProjects"
          :key="project.id || project.url"
          class="project-card"
          :href="project.url"
          target="_blank"
          rel="noopener"
          :aria-label="`${copy.openProjectLabel} ${project.name}`"
          @click="trackProject(project)"
        >
          <div class="project-preview">
            <img
              :src="getProjectImage(project)"
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
import revikImage from "../../assets/revik.png";
import seugImage from "../../assets/seug.png";
import slovakdleImage from "../../assets/slovakdle.png";
import { trackClick } from "../../utils/analytics";
import {
  fetchPortfolioContent,
  getDefaultContent,
  getLocalizedProject,
  sortContentItems
} from "../../utils/content";

const projectImages = {
  athena: athenaImage,
  cnk: cnkImage,
  dema: demaImage,
  football: footballImage,
  krajcirstvo: krajcirstvoImage,
  revik: revikImage,
  seug: seugImage,
  slovakdle: slovakdleImage
};

const projectsCopy = {
  en: {
    title: "Web Projects",
    intro: "Selected websites and small web products I build outside of research and teaching, mostly for real people, small teams, and public-facing ideas.",
    openLabel: "Open",
    openProjectLabel: "Open project",
    tagsLabel: "Project tags"
  },
  sk: {
    title: "Weby",
    intro: "Výber webov a menších webových produktov, ktoré robím mimo výskumu a výučby pre ľudí, malé tímy a verejné nápady.",
    openLabel: "Otvoriť",
    openProjectLabel: "Otvoriť projekt",
    tagsLabel: "Tagy projektu"
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
  data() {
    return {
      content: getDefaultContent()
    };
  },
  computed: {
    projectImages() {
      return projectImages;
    },
    copy() {
      return projectsCopy[this.language] || projectsCopy.en;
    },
    localizedProjects() {
      return sortContentItems(this.content.projects || [])
        .filter((project) => project.visible !== false)
        .map((project) => getLocalizedProject(project, this.language));
    }
  },
  mounted() {
    this.loadContent();
  },
  methods: {
    async loadContent() {
      try {
        this.content = await fetchPortfolioContent();
      } catch {
        this.content = getDefaultContent();
      }
    },
    getProjectImage(project) {
      return project.imageUrl || projectImages[project.imageKey] || projectImages.revik;
    },
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

