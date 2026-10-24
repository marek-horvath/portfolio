<template>
  <div class="projects-tab">
    <h2>{{ copy.title }}</h2>
    <p class="projects-intro">{{ copy.intro }}</p>
    <nav class="project-filters" :aria-label="copy.filterLabel">
      <button v-for="filter in filters" :key="filter.id" type="button" :aria-pressed="selectedCategory === filter.id" @click="selectCategory(filter.id)">
        {{ filter.label }} <span>{{ filter.count }}</span>
      </button>
    </nav>
    <p class="project-count" role="status">{{ visibleCount }} / {{ projects.length }} {{ copy.count }}</p>
    <section v-for="group in visibleGroups" :key="group.id" class="project-group" :aria-labelledby="`project-group-${group.id}`">
      <div class="project-group-heading"><h3 :id="`project-group-${group.id}`">{{ group.label }}</h3><span>{{ group.projects.length }}</span></div>
      <div class="projects-grid">
        <article v-for="project in group.projects" :key="project.id" class="project-card" :class="{ 'project-featured': project.featured }" :data-project="project.id">
          <button type="button" class="project-preview" :aria-label="`${copy.detail}: ${name(project)}`" @click="openProject(project, $event)">
            <img v-if="project.images.length" :src="imageUrl(project.images[0], true)" :alt="`${name(project)} — ${copy.preview}`" loading="lazy" width="760" height="475" />
            <span v-else class="project-neutral" :class="`project-neutral-${project.category}`"><component :is="projectIcon(project)" :size="42" :stroke-width="1.4" aria-hidden="true" /><span>{{ detail(project).type }}</span></span>
            <span class="preview-open"><Maximize2 :size="16" aria-hidden="true" /></span>
            <span v-if="project.archived" class="project-archive">{{ copy.archive }}</span>
          </button>
          <div class="project-card-content">
            <div class="project-card-top"><span>{{ detail(project).type }}</span><span v-if="project.featured" class="project-selected">{{ copy.selected }}</span></div>
            <h4><button type="button" @click="openProject(project, $event)">{{ name(project) }}</button></h4>
            <p>{{ project.description[locale] }}</p>
            <ul class="project-tags" :aria-label="copy.technologies"><li v-for="technology in project.technologies" :key="technology">{{ technology }}</li></ul>
            <div class="project-actions">
              <button type="button" @click="openProject(project, $event)">{{ copy.detail }} <ArrowUpRight :size="15" aria-hidden="true" /></button>
              <a v-if="project.url" :href="project.url" target="_blank" rel="noopener noreferrer" @click="trackProject(project)">{{ project.access === 'protected' ? copy.website : copy.open }} <ExternalLink :size="14" aria-hidden="true" /></a>
              <a v-if="project.repository" :href="project.repository" target="_blank" rel="noopener noreferrer" :aria-label="`GitHub: ${name(project)}`" @click="trackProject(project, true)"><Github :size="16" aria-hidden="true" /><span>GitHub</span></a>
            </div>
          </div>
        </article>
      </div>
    </section>
    <section class="private-projects"><LockKeyhole :size="19" aria-hidden="true" /><div><h3>{{ copy.privateTitle }}</h3><p>{{ copy.privateText }}</p></div></section>
    <Teleport to="body">
      <dialog ref="projectDialog" class="project-dialog" :class="{ 'project-dialog-zoom': zoomed }" aria-labelledby="project-dialog-title" @click="onBackdrop" @cancel.prevent="closeProject" @close="restoreFocus" @keydown="onDialogKeydown">
        <template v-if="activeProject">
          <header class="project-dialog-header"><div><span>{{ activeDetail.type }}</span><h2 id="project-dialog-title">{{ name(activeProject) }}</h2></div><button type="button" class="project-icon-button" :aria-label="copy.close" :title="copy.close" autofocus @click="closeProject"><X :size="22" aria-hidden="true" /></button></header>
          <div v-if="activeProject.images.length" class="project-gallery">
            <div class="project-gallery-stage" :class="{ 'project-gallery-portrait': isPortrait }">
              <img :src="imageUrl(activeProject.images[imageIndex])" :alt="`${name(activeProject)} — ${copy.preview} ${imageIndex + 1}`" />
              <button type="button" class="project-icon-button gallery-zoom" :aria-label="zoomed ? copy.reduce : copy.enlarge" :title="zoomed ? copy.reduce : copy.enlarge" @click="zoomed = !zoomed"><component :is="zoomed ? 'Minimize2' : 'Maximize2'" :size="19" aria-hidden="true" /></button>
            </div>
            <div v-if="activeProject.images.length > 1" class="project-gallery-controls">
              <button type="button" class="project-icon-button" :aria-label="copy.previous" :title="copy.previous" @click="changeImage(-1)"><ChevronLeft :size="20" aria-hidden="true" /></button>
              <button v-for="(file, index) in activeProject.images" :key="file" type="button" class="project-thumbnail" :aria-label="`${copy.photo} ${index + 1}`" :aria-pressed="imageIndex === index" @click="imageIndex = index"><img :src="imageUrl(file, true)" alt="" loading="lazy" /></button>
              <button type="button" class="project-icon-button" :aria-label="copy.next" :title="copy.next" @click="changeImage(1)"><ChevronRight :size="20" aria-hidden="true" /></button>
            </div>
            <p v-if="activeProject.archived" class="project-gallery-caption">{{ copy.archiveDetail }}</p>
          </div>
          <div class="project-dialog-body">
            <p class="project-dialog-intro">{{ activeProject.description[locale] }}</p>
            <div class="project-detail-sections"><section v-for="key in detailSections" :key="key"><h3>{{ copy[key] }}</h3><p>{{ activeDetail[key] }}</p></section></div>
            <p v-if="activeDetail.note" class="project-note">{{ activeDetail.note }}</p>
            <ul class="project-tags" :aria-label="copy.technologies"><li v-for="technology in activeProject.technologies" :key="technology">{{ technology }}</li></ul>
            <div class="project-actions">
              <a v-if="activeProject.url" :href="activeProject.url" target="_blank" rel="noopener noreferrer" @click="trackProject(activeProject)">{{ activeProject.access === 'protected' ? copy.website : copy.open }} <ExternalLink :size="16" aria-hidden="true" /></a>
              <a v-if="activeProject.repository" :href="activeProject.repository" target="_blank" rel="noopener noreferrer" @click="trackProject(activeProject, true)"><Github :size="16" aria-hidden="true" /> GitHub</a>
            </div>
          </div>
        </template>
      </dialog>
    </Teleport>
  </div>
</template>

<script>
import { Activity, ArrowUpRight, BookOpen, CalendarDays, ChevronLeft, ChevronRight, Code2, ExternalLink, Gamepad2, Github, Globe, Layers, LockKeyhole, Maximize2, Minimize2, Monitor, X } from "@lucide/vue";
import projects from "../../data/projects.json";
import { getProjectDetails } from "../../data/projectDetails";
import { trackClick } from "../../utils/analytics";

const images = require.context("../../assets/projects", false, /\.webp$/);
const copy = {
  en: {
    title: "Personal Projects", intro: "Applications, developer tools, games and websites — from university systems to personal experiments.",
    all: "All", filterLabel: "Project categories", categories: ["Tools & Infrastructure", "Systems & Applications", "Games & Interactive", "Websites & Presentation"],
    count: "projects", detail: "Details", selected: "Selected", preview: "application preview", archive: "Archive", archiveDetail: "Archival screenshot from the project; not a new test capture.",
    technologies: "Technologies", open: "Open project", website: "Website · sign-in", close: "Close project details", previous: "Previous image", next: "Next image", photo: "Image", enlarge: "Enlarge image", reduce: "Reduce image",
    problem: "The problem", solution: "The solution", result: "What it delivers", decisions: "Technical decisions",
    privateTitle: "Private projects", privateText: "Additional web and application projects whose details remain private."
  },
  sk: {
    title: "Osobné projekty", intro: "Aplikácie, vývojárske nástroje, hry a weby — od univerzitných systémov po vlastné experimenty.",
    all: "Všetky", filterLabel: "Kategórie projektov", categories: ["Nástroje a infraštruktúra", "Komplexné systémy a aplikácie", "Hry a interaktívne projekty", "Prezentačné"],
    count: "projektov", detail: "Detail", selected: "Výber", preview: "náhľad aplikácie", archive: "Archív", archiveDetail: "Archívny záber z projektu; nejde o nový test aplikácie.",
    technologies: "Technológie", open: "Otvoriť projekt", website: "Web · prihlásenie", close: "Zavrieť detail projektu", previous: "Predchádzajúci obrázok", next: "Nasledujúci obrázok", photo: "Obrázok", enlarge: "Zväčšiť obrázok", reduce: "Zmenšiť obrázok",
    problem: "Problém", solution: "Riešenie", result: "Čo prináša", decisions: "Technické rozhodnutia",
    privateTitle: "Neverejné realizácie", privateText: "Ďalšie webové a aplikačné realizácie, ktorých detaily nezverejňujem."
  }
};
const categoryIds = ["tools", "systems", "games", "websites"];

export default {
  name: "ProjectsTab",
  components: { ArrowUpRight, ChevronLeft, ChevronRight, ExternalLink, Github, LockKeyhole, Maximize2, Minimize2, X },
  props: { language: { type: String, default: "en" } },
  data() { return { projects, selectedCategory: "all", activeProject: null, imageIndex: 0, zoomed: false, returnFocus: null, previousOverflow: "" }; },
  computed: {
    locale() { return this.language === "sk" ? "sk" : "en"; },
    copy() { return copy[this.locale]; },
    groups() { return categoryIds.map((id, i) => ({ id, label: this.copy.categories[i], projects: projects.filter(p => p.category === id).sort((a, b) => Number(b.featured) - Number(a.featured)) })); },
    filters() { return [{ id: "all", label: this.copy.all, count: projects.length }, ...this.groups.map(g => ({ id: g.id, label: g.label, count: g.projects.length }))]; },
    visibleGroups() { return this.groups.filter(g => this.selectedCategory === "all" || g.id === this.selectedCategory); },
    visibleCount() { return this.visibleGroups.reduce((sum, group) => sum + group.projects.length, 0); },
    activeDetail() { return this.activeProject ? this.detail(this.activeProject) : {}; },
    detailSections() { return ["problem", "solution", "result", "decisions"].filter(key => this.activeDetail[key]); },
    isPortrait() { return this.activeProject?.images[this.imageIndex]?.includes("mobile"); }
  },
  beforeUnmount() {
    if (this.$refs.projectDialog?.open) {
      this.$refs.projectDialog.close();
      document.body.style.overflow = this.previousOverflow;
    }
  },
  methods: {
    name(project) { return project.name[this.locale]; },
    detail(project) { return getProjectDetails(project.id, this.locale); },
    imageUrl(file, thumbnail = false) { return images(`./${thumbnail ? file.replace(".webp", "-thumb.webp") : file}`); },
    projectIcon(project) { return ({ "workspace-manager": Monitor, monitoring: Activity, "fei-rozvrh": CalendarDays, "python-course": BookOpen, "hraj-sk": Gamepad2, workweek: Layers, neurologia: CalendarDays, "football-predictions": Activity, algoritmization: Code2 })[project.id] || Globe; },
    selectCategory(id) { this.selectedCategory = id; trackClick("project_filter", { label: id, language: this.locale }); },
    async openProject(project, event) {
      this.returnFocus = event.currentTarget;
      this.activeProject = project;
      this.imageIndex = 0;
      this.zoomed = false;
      this.previousOverflow = document.body.style.overflow;
      await this.$nextTick();
      this.$refs.projectDialog.showModal();
      document.body.style.overflow = "hidden";
      trackClick("project_detail", { label: project.name.en, language: this.locale });
    },
    closeProject() { this.$refs.projectDialog.close(); },
    restoreFocus() { document.body.style.overflow = this.previousOverflow; this.returnFocus?.focus({ preventScroll: true }); },
    onBackdrop(event) {
      if (event.target !== this.$refs.projectDialog) return;
      const rect = event.target.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) this.closeProject();
    },
    changeImage(delta) { this.imageIndex = (this.imageIndex + delta + this.activeProject.images.length) % this.activeProject.images.length; },
    onDialogKeydown(event) {
      if (event.key === "Tab") {
        const controls = [...this.$refs.projectDialog.querySelectorAll('button:not([disabled]), a[href]')].filter(el => el.getClientRects().length);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
      if (!this.activeProject.images.length) return;
      if (event.key === "ArrowRight") { event.preventDefault(); this.changeImage(1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); this.changeImage(-1); }
    },
    trackProject(project, repository = false) { trackClick(repository ? "project_github" : "project_open", { label: project.name.en, targetUrl: repository ? project.repository : project.url, language: this.locale, metadata: { type: project.category } }); }
  }
};
</script>

<style scoped>
.projects-intro { margin: 0 0 20px; color: #48627c; font-size: 14px; line-height: 1.6; }
.project-filters { display: flex; flex-wrap: wrap; gap: 8px; }
.project-filters button { display: inline-flex; align-items: center; gap: 7px; padding: 8px 11px; border: 1px solid #cbd8e7; border-radius: 6px; background: #fff; color: #284c70; font: inherit; font-size: 12px; cursor: pointer; text-align: left; }
.project-filters button[aria-pressed="true"] { background: #163a66; border-color: #163a66; color: #fff; }
.project-filters span { opacity: .75; font-size: 11px; }
.project-count { margin: 12px 0 24px; font-size: 12px; color: #526a83; }
.project-group { margin-bottom: 32px; }
.project-group-heading { display: flex; align-items: baseline; gap: 12px; margin: 0 0 14px; padding-bottom: 9px; border-bottom: 1px solid #d6e1ec; }
.project-group-heading h3 { margin: 0; color: #193f65; font-size: 17px; line-height: 1.4; }
.project-group-heading > span { color: #526a83; font-size: 12px; }
.projects-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.project-card { min-width: 0; overflow: hidden; border: 1px solid #d4e0ed; border-radius: 8px; background: #fff; display: flex; flex-direction: column; }
.project-featured { border-color: #9bb8d6; }
.project-preview { display: block; position: relative; width: 100%; aspect-ratio: 16/10; padding: 0; border: 0; border-bottom: 1px solid #e0e8f0; border-radius: 0; overflow: hidden; background: #edf2f7; cursor: pointer; }
.project-preview > img { display: block; width: 100%; height: 100%; object-fit: contain; }
.project-neutral { display: flex; width: 100%; height: 100%; flex-direction: column; gap: 14px; align-items: center; justify-content: center; color: #375d86; background: #eaf1f8; font-size: 13px; }
.project-neutral-games { background: #e9f1ed; color: #35694d; }
.project-neutral-systems { background: #edf0f9; color: #4b5684; }
.project-neutral-websites { background: #f3eff5; color: #73547e; }
.preview-open { position: absolute; right: 9px; bottom: 9px; display: grid; place-items: center; padding: 7px; background: #fff; color: #163a66; border-radius: 4px; box-shadow: 0 1px 7px #163a661a; }
.project-archive { position: absolute; left: 9px; top: 9px; padding: 4px 7px; background: #fffffff0; color: #425971; font-size: 10px; border-radius: 4px; }
.project-card-content { display: flex; flex-direction: column; flex: 1; gap: 11px; padding: 17px; }
.project-card-top { display: flex; justify-content: space-between; gap: 8px; align-items: center; color: #506981; font-size: 11px; }
.project-selected { color: #2c638e; font-weight: 700; }
.project-card h4 { margin: 0; font-size: 18px; line-height: 1.35; }
.project-card h4 button { padding: 0; border: 0; background: none; color: #163a66; font: inherit; font-weight: 700; text-align: left; cursor: pointer; }
.project-card-content > p { margin: 0; color: #405c76; font-size: 13px; line-height: 1.6; }
.project-tags { display: flex; flex-wrap: wrap; gap: 6px; padding: 0; margin: auto 0 0; list-style: none; }
.project-tags li { max-width: 100%; padding: 4px 7px; border-radius: 4px; background: #eef3f8; color: #3d5c7a; font-size: 10px; line-height: 1.4; overflow-wrap: anywhere; }
.project-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-top: 3px; }
.project-actions button, .project-actions a { display: inline-flex; gap: 5px; align-items: center; padding: 4px 0; border: 0; background: none; font: inherit; font-size: 12px; font-weight: 700; color: #205c90; text-decoration: none; cursor: pointer; }
.project-actions button:hover, .project-actions a:hover, .project-card h4 button:hover { color: #0b3458; text-decoration: underline; }
.private-projects { display: flex; gap: 13px; align-items: flex-start; padding: 22px 0 8px; border-top: 1px solid #d6e1ec; color: #5b6d80; }
.private-projects h3 { margin: 0 0 5px; font-size: 14px; color: #38536f; }
.private-projects p { margin: 0; font-size: 13px; line-height: 1.6; }
.private-projects > svg { flex-shrink: 0; }
.project-dialog { box-sizing: border-box; width: min(880px, calc(100% - 40px)); max-height: calc(100dvh - 40px); padding: 0; border: 1px solid #bdcddd; border-radius: 8px; background: #fff; color: #294963; overflow: auto; overscroll-behavior: contain; box-shadow: 0 24px 90px #0c22354d; }
.project-dialog::backdrop { background: #122b43a8; backdrop-filter: blur(4px); }
.project-dialog-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; padding: 20px 24px; }
.project-dialog-header span { color: #567089; font-size: 12px; }
.project-dialog-header h2 { margin: 5px 0 0; color: #173f66; font-size: 23px; line-height: 1.3; overflow-wrap: anywhere; }
.project-icon-button { display: inline-grid; place-items: center; flex-shrink: 0; width: 38px; height: 38px; padding: 0; border: 1px solid #cbd7e3; background: #fff; border-radius: 6px; color: #254c71; cursor: pointer; }
.project-gallery { background: #edf1f5; padding: 12px; }
.project-gallery-stage { position: relative; display: grid; place-items: center; min-height: 180px; }
.project-gallery-stage > img { display: block; width: 100%; height: auto; max-height: 52dvh; object-fit: contain; }
.project-gallery-portrait > img { max-height: 65dvh; width: auto; max-width: 100%; }
.gallery-zoom { position: absolute; right: 6px; bottom: 6px; }
.project-gallery-controls { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 8px; margin-top: 12px; }
.project-thumbnail { display: block; width: 68px; height: 44px; padding: 2px; border: 2px solid transparent; border-radius: 4px; background: #fff; cursor: pointer; }
.project-thumbnail[aria-pressed="true"] { border-color: #28669d; }
.project-thumbnail img { display: block; width: 100%; height: 100%; object-fit: contain; }
.project-gallery-caption { margin: 9px 0 0; font-size: 11px; color: #526981; text-align: center; }
.project-dialog-body { padding: 24px; }
.project-dialog-intro { margin: 0 0 22px; font-size: 15px; line-height: 1.7; color: #2c4c69; }
.project-detail-sections { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px 26px; }
.project-detail-sections h3 { margin: 0 0 6px; font-size: 14px; color: #1c466d; }
.project-detail-sections p, .project-note { margin: 0; font-size: 13px; line-height: 1.7; }
.project-note { border-left: 3px solid #b8cfe3; padding: 8px 13px; margin: 22px 0; color: #506880; }
.project-dialog-body > .project-tags { margin-top: 22px; }
.project-dialog-body > .project-actions { margin-top: 18px; }
.project-dialog-zoom { width: min(1500px, calc(100% - 24px)); }
.project-dialog-zoom .project-gallery-stage > img { max-height: none; }
.projects-tab button:focus-visible, .projects-tab a:focus-visible, .project-dialog button:focus-visible, .project-dialog a:focus-visible { outline: 3px solid #267dc5; outline-offset: 3px; }
@media (max-width: 900px) { .projects-grid { grid-template-columns: minmax(0, 1fr); } }
@media (max-width: 600px) {
  .projects-intro { font-size: 13px; }
  .project-filters { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
  .project-filters button { justify-content: space-between; font-size: 11px; padding: 8px; line-height: 1.5; }
  .project-filters button:first-child { grid-column: 1/-1; }
  .project-filters span { flex-shrink: 0; }
  .project-group-heading h3 { font-size: 16px; }
  .project-card-content { padding: 15px; }
  .project-card h4 { font-size: 17px; }
  .project-dialog { width: calc(100% - 16px); max-height: calc(100dvh - 16px); }
  .project-dialog-header { padding: 16px; }
  .project-dialog-header h2 { font-size: 19px; }
  .project-dialog-body { padding: 18px; }
  .project-detail-sections { grid-template-columns: minmax(0, 1fr); gap: 18px; }
  .project-dialog-intro { font-size: 14px; }
  .project-gallery { padding: 8px; }
  .project-gallery-stage { min-height: 100px; }
}
</style>
