<template>
  <main class="blog-page">
    <div class="ambient-motion" aria-hidden="true">
      <svg class="ambient-network" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        <path class="network-path path-one" d="M-40 180 C170 90 260 250 420 170 S720 30 900 160 1120 330 1240 240" />
        <path class="network-path path-two" d="M60 620 C220 500 380 690 560 560 S830 370 1040 520 1180 610 1260 560" />
        <path class="network-path path-three" d="M120 70 C250 210 330 140 470 270 S680 520 850 390 1040 260 1210 360" />
        <g class="network-nodes">
          <circle cx="150" cy="150" r="4" />
          <circle cx="420" cy="170" r="3" />
          <circle cx="820" cy="112" r="4" />
          <circle cx="1010" cy="205" r="3" />
          <circle cx="230" cy="560" r="3" />
          <circle cx="560" cy="560" r="4" />
          <circle cx="920" cy="460" r="3" />
          <circle cx="1110" cy="560" r="4" />
          <circle cx="330" cy="140" r="3" />
          <circle cx="680" cy="520" r="4" />
        </g>
      </svg>
      <span
        v-for="line in ambientLines"
        :key="line.className"
        :class="['ambient-line', line.className]"
      ></span>
    </div>

    <nav class="blog-menu" :aria-label="copy.navigationLabel">
      <a class="blog-mark" href="#top" :aria-label="copy.topLabel">MH</a>
      <div class="menu-links">
        <a
          v-for="articleItem in localizedArticles"
          :key="articleItem.id"
          :href="articleItem.locked ? '#top' : blogHash(articleItem.id)"
          :class="{ active: articleItem.id === selectedArticleId, locked: articleItem.locked }"
          :aria-current="articleItem.id === selectedArticleId ? 'page' : null"
          :aria-disabled="articleItem.locked ? 'true' : null"
          @click.prevent="selectBlog(articleItem.id)"
        >
          <span>{{ articleItem.navLabel || articleItem.title }}</span>
          <small v-if="articleItem.locked">{{ copy.locked }}</small>
        </a>
      </div>
      <div class="blog-language-switch" :aria-label="copy.languageLabel">
        <button
          v-for="option in languageOptions"
          :key="option"
          type="button"
          :class="{ active: language === option }"
          :aria-pressed="language === option ? 'true' : 'false'"
          @click="setLanguage(option)"
        >
          {{ option.toUpperCase() }}
        </button>
      </div>
    </nav>

    <section id="top" class="blog-hero">
      <div class="hero-polaroids left-stack">
        <a
          v-for="card in leftHeroCards"
          :key="card.id"
          :href="card.href"
          :class="['landing-polaroid', { locked: card.locked }]"
          :aria-disabled="card.locked ? 'true' : null"
          :style="{
            '--accent': card.accent,
            '--rotation': card.rotation,
            '--lift': card.lift,
            '--preview-image': card.previewImage ? `url(${card.previewImage})` : null
          }"
          @click.prevent="selectBlog(card.id)"
        >
          <span class="landing-snapshot" aria-hidden="true"></span>
          <strong>{{ card.title }}</strong>
          <small>{{ card.description }}</small>
          <span v-if="card.stats.length" class="landing-meta">
            <span v-for="stat in card.stats" :key="stat">{{ stat }}</span>
          </span>
          <span v-if="card.locked" class="landing-lock">{{ copy.locked }}</span>
        </a>
      </div>

      <div class="hero-copy">
        <p class="eyebrow">{{ copy.heroEyebrow }}</p>
        <h1>{{ copy.heroTitle }}</h1>
        <p>{{ copy.heroIntro }}</p>
      </div>

      <div class="hero-polaroids right-stack">
        <a
          v-for="card in rightHeroCards"
          :key="card.id"
          :href="card.href"
          :class="['landing-polaroid', { locked: card.locked }]"
          :aria-disabled="card.locked ? 'true' : null"
          :style="{
            '--accent': card.accent,
            '--rotation': card.rotation,
            '--lift': card.lift,
            '--preview-image': card.previewImage ? `url(${card.previewImage})` : null
          }"
          @click.prevent="selectBlog(card.id)"
        >
          <span class="landing-snapshot" aria-hidden="true"></span>
          <strong>{{ card.title }}</strong>
          <small>{{ card.description }}</small>
          <span v-if="card.stats.length" class="landing-meta">
            <span v-for="stat in card.stats" :key="stat">{{ stat }}</span>
          </span>
          <span v-if="card.locked" class="landing-lock">{{ copy.locked }}</span>
        </a>
      </div>
    </section>

    <template v-if="selectedArticle">
      <section :id="selectedArticle.id" ref="articleStart" class="article-head">
        <p class="eyebrow">{{ selectedArticle.eyebrow }}</p>
        <h2>{{ selectedArticle.title }}</h2>
        <p>{{ selectedArticle.intro }}</p>
        <div v-if="selectedArticle.links && selectedArticle.links.length" class="article-actions">
          <a
            v-for="link in selectedArticle.links"
            :key="link.url || link.label"
            :href="link.url"
            target="_blank"
            rel="noreferrer"
          >
            {{ link.label }}
          </a>
        </div>
      </section>

      <aside
        v-if="selectedArticle.layout !== 'gallery'"
        class="article-index"
        :aria-label="copy.quickLinksLabel"
      >
        <p>{{ selectedArticle.navLabel || selectedArticle.title }}</p>
        <a
          v-for="item in selectedArticle.sections"
          :key="item.id"
          :href="sectionHash(item.id)"
          @click.prevent="scrollToSection(item.id)"
        >
          <span>{{ item.date }}</span>
          <strong>{{ item.title }}</strong>
        </a>
      </aside>

      <div :class="['article-shell', { 'gallery-shell': selectedArticle.layout === 'gallery' }]">
        <section
          v-if="selectedArticle.layout === 'gallery'"
          class="photo-gallery"
          :aria-label="`${selectedArticle.title} gallery`"
        >
          <button
            v-for="(item, index) in selectedArticle.sections"
            :key="item.id"
            type="button"
            :id="item.id"
            :class="['gallery-card', galleryCardClass(index)]"
            :style="{ '--accent': item.accent }"
            :aria-label="`${copy.openGalleryPhoto} ${item.title}`"
            @click="openGallery(item, 0)"
            >
              <span class="gallery-preview">
                <span
                  v-if="firstPhoto(item).url"
                  class="gallery-image"
                  :style="{ backgroundImage: `url(${firstPhoto(item).url})` }"
                ></span>
              <span v-else class="gallery-empty-label">{{ item.title }}</span>
            </span>
            <span class="gallery-caption">
              <strong>{{ item.title }}</strong>
              <small>{{ item.date || item.type }}</small>
            </span>
          </button>
        </section>

        <template v-else>
          <section class="timeline" :aria-label="`${selectedArticle.title} timeline`">
            <article
            v-for="(item, index) in selectedArticle.sections"
            :key="item.id"
            :id="item.id"
              :class="[
                'timeline-item',
                {
                  reverse: index % 2 === 1,
                  'single-photo': item.photos.length === 1,
                  'no-photos': !item.photos.length
                }
              ]"
            >
              <div
                class="timeline-copy detail-trigger"
                role="button"
                tabindex="0"
                :aria-label="`${copy.openDetail} ${item.title}`"
                @click="openSection(item)"
                @keydown.enter.prevent="openSection(item)"
                @keydown.space.prevent="openSection(item)"
              >
                <span class="timeline-date">{{ item.date }}</span>
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
                <ul>
                  <li v-for="note in item.notes" :key="note">{{ note }}</li>
                </ul>
                <div v-if="item.files.length" class="file-preview">
                  <span v-for="file in item.files" :key="file.url || file.label">
                    {{ file.label }}
                  </span>
                </div>
              </div>

              <figure
                v-if="item.photos.length"
                :class="['photo-cluster', { single: item.photos.length === 1 }]"
                :style="{ '--accent': item.accent }"
              >
                <button
                  v-for="photo in previewPhotosForSection(item)"
                  :key="photo.url || photo.label"
                  type="button"
                  class="polaroid"
                  :style="{ '--rotation': photo.rotation, '--lift': photo.lift }"
                  :aria-label="`${copy.openPhotos} ${item.title}`"
                  @click.stop="openGallery(item, item.photos.indexOf(photo))"
                >
                  <div class="snapshot">
                    <div
                      v-if="photo.url"
                      class="snapshot-image"
                      :style="{ backgroundImage: `url(${photo.url})` }"
                    ></div>
                    <span v-if="!photo.url">{{ photo.label }}</span>
                  </div>
                </button>
                <figcaption v-if="item.caption">{{ item.caption }}</figcaption>
              </figure>
            </article>
          </section>
        </template>
      </div>
    </template>

    <div v-if="activeModal" class="modal-backdrop" @click.self="closeModal">
      <section class="modal-panel" role="dialog" aria-modal="true" :aria-label="modalTitle">
        <button type="button" class="modal-close" :aria-label="copy.close" @click="closeModal">
          {{ copy.close }}
        </button>

        <template v-if="modalMode === 'detail'">
          <p class="eyebrow">{{ activeSection.date }}</p>
          <h2>{{ activeSection.title }}</h2>
          <p class="modal-lead">{{ activeSection.description }}</p>
          <div class="detail-body">
            <p v-for="paragraph in activeSectionDetails" :key="paragraph">{{ paragraph }}</p>
          </div>

          <div v-if="activeSection.notes.length" class="modal-notes">
            <strong>{{ copy.notes }}</strong>
            <ul>
              <li v-for="note in activeSection.notes" :key="note">{{ note }}</li>
            </ul>
          </div>

          <div v-if="activeSection.files.length" class="download-list">
            <strong>{{ copy.files }}</strong>
            <a
              v-for="file in activeSection.files"
              :key="file.url || file.label"
              :href="file.url || '#'"
              :download="file.download || null"
              target="_blank"
              rel="noreferrer"
            >
              {{ file.label }}
            </a>
          </div>
        </template>

        <template v-else>
          <div class="slideshow">
            <button type="button" class="slide-control" :aria-label="copy.previousPhoto" @click="showPreviousPhoto">
              {{ copy.previous }}
            </button>
            <figure class="slide-frame">
              <div class="slide-image" :style="activePhoto.url ? { backgroundImage: `url(${activePhoto.url})` } : null">
                <span v-if="!activePhoto.url">{{ activePhoto.label }}</span>
              </div>
              <figcaption>
                <strong>{{ activeSection.title }}</strong>
                <span>{{ activePhotoIndex + 1 }} / {{ activeSection.photos.length }}</span>
              </figcaption>
              <div
                v-if="activeSection.photos.length > 1"
                class="slide-thumbnails"
                :aria-label="copy.photoThumbnails"
              >
                <button
                  v-for="(photo, index) in activeSection.photos"
                  :key="`${photo.url || photo.label}-${index}`"
                  type="button"
                  :class="{ active: index === activePhotoIndex }"
                  :aria-label="`${copy.openGalleryPhoto} ${index + 1}`"
                  @click="selectPhoto(index)"
                >
                  <span
                    v-if="photo.url"
                    :style="{ backgroundImage: `url(${photo.url})` }"
                  ></span>
                  <small v-else>{{ index + 1 }}</small>
                </button>
              </div>
            </figure>
            <button type="button" class="slide-control" :aria-label="copy.nextPhoto" @click="showNextPhoto">
              {{ copy.next }}
            </button>
          </div>
        </template>
      </section>
    </div>
  </main>
</template>

<script>
import { getAnalyticsApiBaseUrl } from "../utils/analytics";

const blogPhotoAssets = require.context("../assets/Photos/optimized", true, /\.(webp|png|jpe?g)$/);
const blogPhotoKeys = blogPhotoAssets
  .keys()
  .sort((left, right) => left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" }));
const DEVPOST_PROFILE_URL = "https://devpost.com/marek79horvath/challenges";
const HACKATHON_PHOTO_FOLDER = "gallery/hackathons";
const hackathonPhotoPrefixes = {
  "hack-kosice-2022": ["hackke22"],
  "actinspace-hackathon": ["actinspace"],
  "telekom-hackathon-2022": ["telekom22"],
  "hack-kosice-2023": ["hackke23"],
  "erste-digital-hackathon-2023": ["erste"],
  "hack-kosice-2024": ["hackke24"],
  "telekom-hackathon-2024": ["telekom24"],
  "hack-kosice-2026": ["hackke26"]
};

function createAssetPhoto(key, label, index) {
  return {
    label,
    url: blogPhotoAssets(key),
    rotation: ["-7deg", "4deg", "-2deg", "6deg", "-4deg", "2deg"][index % 6],
    lift: ["10px", "-8px", "18px", "2px", "-4px", "12px"][index % 6]
  };
}

function photosFromFolder(folder, labelPrefix, limit = 6) {
  return photosFromFolderSlice(folder, labelPrefix, 0, limit);
}

function photosFromFolderSlice(folder, labelPrefix, start = 0, limit = 6) {
  const normalizedFolder = folder.replace(/^\/+|\/+$/g, "");
  return blogPhotoKeys
    .filter((key) => key.startsWith(`./${normalizedFolder}/`))
    .slice(start, start + limit)
    .map((key, index) => createAssetPhoto(key, labelPrefix, index));
}

function photoFromFile(folder, fileName, label) {
  const normalizedFolder = folder.replace(/^\/+|\/+$/g, "");
  const key = blogPhotoKeys.find((photoKey) => photoKey === `./${normalizedFolder}/${fileName}`);
  return key ? createAssetPhoto(key, label, 0) : null;
}

function photosFromFolderPrefixes(folder, labelPrefix, prefixes, limit = 6) {
  const normalizedFolder = folder.replace(/^\/+|\/+$/g, "");
  const normalizedPrefixes = Array.isArray(prefixes) ? prefixes : [prefixes];

  return blogPhotoKeys
    .filter((key) => {
      if (!key.startsWith(`./${normalizedFolder}/`)) {
        return false;
      }

      const fileName = key.slice(key.lastIndexOf("/") + 1);
      return normalizedPrefixes.some((prefix) => fileName.startsWith(prefix));
    })
    .slice(0, limit)
    .map((key, index) => createAssetPhoto(key, labelPrefix, index));
}

function photosForHackathon(sectionId, labelPrefix) {
  return photosFromFolderPrefixes(
    HACKATHON_PHOTO_FOLDER,
    labelPrefix,
    hackathonPhotoPrefixes[sectionId] || [],
    200
  );
}

function hasPhotoUrls(photos) {
  return Array.isArray(photos) && photos.some((photo) => photo.url);
}

const BLOG_LANGUAGE_STORAGE_KEY = "marek-blog-language";
const languageOptions = ["en", "sk"];
const staleDraftTextPattern = new RegExp("place" + "holder", "i");

const blogCopy = {
  en: {
    navigationLabel: "Blog navigation",
    topLabel: "Blog top",
    languageLabel: "Blog language",
    heroEyebrow: "Notes and photos",
    heroTitle: "Marek Blog",
    heroIntro:
      "Longer notes from PhD life, conferences, hackathons, and photo trips. Pick a polaroid to open one blog stream.",
    locked: "locked",
    quickLinksLabel: "Article quick links",
    openDetail: "Open detail for",
    openPhotos: "Open photos for",
    openGalleryPhoto: "Open gallery photo",
    close: "Close",
    notes: "Notes",
    files: "Files",
    previous: "Prev",
    next: "Next",
    previousPhoto: "Previous photo",
    nextPhoto: "Next photo",
    photoThumbnails: "Photo thumbnails"
  },
  sk: {
    navigationLabel: "Navigacia blogu",
    topLabel: "Zaciatok blogu",
    languageLabel: "Jazyk blogu",
    heroEyebrow: "Poznamky a fotky",
    heroTitle: "Marek Blog",
    heroIntro:
      "Poznámky z doktorátu, konferencií, hackathonov a fotiek z ciest. Vyber si blog a otvorí sa konkrétna séria.",
    locked: "zamknute",
    quickLinksLabel: "Rychle odkazy v clanku",
    openDetail: "Otvorit detail",
    openPhotos: "Otvorit fotky",
    openGalleryPhoto: "Otvorit fotku",
    close: "Zavriet",
    notes: "Poznamky",
    files: "Subory",
    previous: "Spat",
    next: "Dalej",
    previousPhoto: "Predchadzajuca fotka",
    nextPhoto: "Dalsia fotka",
    photoThumbnails: "Nahlady fotiek"
  }
};

const articleCopy = {
  en: {
    "phd-timeline": {
      navLabel: "PhD",
      eyebrow: "PhD notes",
      title: "PhD Timeline",
      intro:
        "Conference notes, mobilities, and smaller PhD milestones ordered as the research story gradually came together."
    },
    "travel-blog": {
      navLabel: "Travel",
      eyebrow: "Travel notes",
      title: "Travel Blog",
      intro: "A lighter place for trips, festivals, road notes, and photo-heavy stories."
    },
    "hackathons-blog": {
      navLabel: "Hackathons",
      eyebrow: "Side-project events",
      title: "Hackathons",
      intro:
        "Hackathons, quick prototypes, and team events outside research. Photos are grouped by event, with Devpost kept as the public archive for challenge entries."
    },
    "photos-gallery": {
      navLabel: "Photos",
      eyebrow: "Personal gallery",
      title: "Photos",
      intro: "Favourite photos from conferences, travels, cities, and small everyday moments."
    }
  },
  sk: {
    "phd-timeline": {
      navLabel: "PhD",
      eyebrow: "Doktorandské zápisky",
      title: "PhD timeline",
      intro:
        "Konferencie, mobility a menšie míľniky počas doktorátu zoradené tak, ako sa postupne skladal výskumný príbeh."
    },
    "travel-blog": {
      navLabel: "Travel",
      eyebrow: "Cestovatelske poznamky",
      title: "Travel blog",
      intro: "Lahsi priestor na vylety, festivaly, roadtripy a foto pribehy."
    },
    "hackathons-blog": {
      navLabel: "Hackathony",
      eyebrow: "Side-project eventy",
      title: "Hackathony",
      intro:
        "Hackathony, rychle prototypy a timove eventy mimo vyskumu. Fotky su rozdelene podla eventov a Devpost ostava ako verejny archiv challenge vystupov."
    },
    "photos-gallery": {
      navLabel: "Fotky",
      eyebrow: "Osobna galeria",
      title: "Fotky",
      intro: "Vyber fotiek z konferencii, mobilit, miest a malych momentov mimo clankov."
    }
  }
};

const timelineDrafts = [
  {
    id: "iceta-2023",
    date: "2023",
    title: "ICETA 2023",
    type: "Conference",
    description:
      "Early PhD conference stop and a useful first anchor for the whole timeline.",
    details:
      "This can become the opening chapter of the PhD story: the first ICETA notes, the paper context, what the topic looked like at the beginning, and what felt new at the event.\n\nGood place to add the exact city, paper title, presentation memory, people met, and one short reflection on how the research direction started.",
    notes: ["Add paper title and date.", "Add conference photo or venue image.", "Link presentation when ready."]
  },
  {
    id: "sami-2024",
    date: "2024",
    title: "SAMI 2024",
    type: "Conference",
    description:
      "A stronger research milestone around code similarity and evaluation on student projects.",
    details:
      "This section can explain what changed after the first year: clearer experiments, larger datasets, and a more concrete research narrative. It should probably connect the technical work with the practical teaching motivation.\n\nLater you can add the exact paper, travel notes, and one paragraph about feedback from the conference.",
    notes: ["Code similarity angle.", "Student-project dataset.", "Conference and travel notes."]
  },
  {
    id: "scyr-2024",
    date: "2024",
    title: "SCYR 2024",
    type: "Doctoral event",
    description:
      "A doctoral-community checkpoint for presenting work in progress and collecting feedback.",
    details:
      "SCYR can be written more informally than the larger conferences. The interesting part is what was still uncertain, what questions came from other PhD students, and which parts of the dissertation started to feel stable.",
    notes: ["Add poster or presentation notes.", "Mention feedback.", "Add one takeaway for dissertation planning."]
  },
  {
    id: "icpec-2024",
    date: "2024",
    title: "ICPEC 2024",
    type: "Conference",
    description:
      "Programming education checkpoint focused on automated assessment and teaching infrastructure.",
    details:
      "This is a good place to connect the research to programming education. The final text can mention automated assessment, student assignments, code reuse, and how education-focused feedback influenced the implementation work.",
    notes: ["Education research angle.", "Automated assessment.", "Add city/workshop photos."]
  },
  {
    id: "olomouc-mobility-2024",
    date: "2024",
    title: "Olomouc CZ",
    type: "Mobility",
    description:
      "Short research mobility and a practical break from the normal lab rhythm.",
    details:
      "Use this section for the everyday side of the PhD: visiting another place, discussing research, seeing a different academic environment, and collecting small observations that do not fit into formal publication notes.",
    notes: ["Add host institution.", "Add travel photos.", "Mention what was discussed or prepared."]
  },
  {
    id: "iceta-2024",
    date: "2024",
    title: "ICETA 2024",
    type: "Conference",
    description:
      "Another ICETA checkpoint where the PhD work can be compared against the 2023 starting point.",
    details:
      "This section should show progression. It can compare the first ICETA experience with the next one: what was easier, what was more polished, and how the research question became more precise.",
    notes: ["Compare with ICETA 2023.", "Add paper/presentation file.", "Add conference photos."]
  },
  {
    id: "informatics-2024",
    date: "2024",
    title: "Informatics 2024",
    type: "Conference",
    description:
      "A systems-oriented stop connecting software architecture with the broader research timeline.",
    details:
      "Here the story can shift toward architecture, implementation, and tooling. It is a useful place to explain the technical side behind the education research, especially if the work involved services, evaluation pipelines, or dataset tooling.",
    notes: ["Microservices vs monolith angle.", "Architecture takeaway.", "Add room, slide, or notebook photo."]
  },
  {
    id: "sami-2025",
    date: "2025",
    title: "SAMI 2025",
    type: "Conference",
    description:
      "A wider publication moment around GPT-generated assignment variations, code reuse, and tooling.",
    details:
      "This can become one of the central timeline chapters. The research scope is wider here, so it should probably include a short multi-paper recap, collaboration notes, and a clear explanation of what became more mature by this point.",
    notes: ["GPT-generated assignments.", "Code reuse.", "Research scope expansion."]
  },
  {
    id: "minimovka-defense",
    date: "2025",
    title: "Minimovka",
    type: "Milestone",
    description:
      "Internal defense checkpoint for checking whether the dissertation direction is coherent.",
    details:
      "This section can be more reflective: what had to be defended, what was still missing, and what changed in the plan after the discussion. It is also a good place to attach slides or the short written summary.",
    notes: ["Add defense date.", "Attach slides.", "Write what changed after feedback."]
  },
  {
    id: "scyr-2025",
    date: "2025",
    title: "SCYR 2025",
    type: "Doctoral event",
    description:
      "Another doctoral checkpoint after the work became more concrete and easier to explain.",
    details:
      "Compared to SCYR 2024, this can show a more mature version of the story. Add what was already finished, what was still risky, and what questions helped before the next publication cycle.",
    notes: ["Add presentation notes.", "Mention open questions.", "Add photos from the event."]
  },
  {
    id: "brno-summer-school",
    date: "2025",
    title: "Brno CZ",
    type: "Summer school",
    description:
      "Summer school stop in Brno, useful as a lighter academic chapter before the next international mobility.",
    details:
      "This section can later describe the summer school program, people, useful sessions, and what carried back into the research routine.\n\nIt should stay more visual and personal than the publication-oriented conference entries.",
    notes: ["Add exact summer school name.", "Add dates and program notes.", "Mention useful sessions."]
  },
  {
    id: "ulysseus-curate-germany",
    date: "2025",
    title: "Münster DE",
    type: "Mobility",
    description:
      "International mobility connected to Ulysseus/Curate and research collaboration.",
    details:
      "This section can mix academic and travel notes. It should mention the context of the mobility, who hosted it, what was planned, and how the experience fed back into the PhD work.",
    notes: ["Add exact city/institution.", "Add collaboration notes.", "Add travel photos."]
  },
  {
    id: "greece-mobility",
    date: "2025",
    title: "Athens GR",
    type: "Mobility",
    description:
      "Research mobility with space for travel notes, collaboration, and photos.",
    details:
      "Use this as a visual section with several photos. The final text can describe the work done during the mobility, interesting discussions, and the contrast between daily research work and the travel experience.",
    notes: ["Add host and dates.", "Add photos.", "Mention outputs or discussions."]
  },
  {
    id: "iceta-2025",
    date: "2025",
    title: "ICETA 2025",
    type: "Conference",
    description:
      "Later-stage education technology milestone with AI-generated code and programmer identity themes.",
    details:
      "This is a good place to connect AI-generated code detection, programmer identity, education technology, and the dissertation narrative. The section can explain what felt settled by this stage and what still needed final experiments.",
    notes: ["AI-generated code detection.", "Programmer identity.", "Add paper and presentation."]
  },
  {
    id: "eger-hungary",
    date: "2025",
    title: "Eger HU",
    type: "Travel / academic stop",
    description:
      "A short Eger chapter before SAMI 2026, mixing travel notes, city photos, and the academic rhythm around the PhD.",
    details:
      "Use this section for the Eger photos and a short note about why the trip belongs in the PhD timeline.\n\nLater you can add whether it was connected to travel, preparation, a meeting, or just a useful break between conference-heavy periods.",
    notes: ["Add exact context.", "Add travel notes.", "Keep this mostly visual."]
  },
  {
    id: "sami-2026",
    date: "2026",
    title: "SAMI 2026",
    type: "Conference",
    description:
      "Future/late PhD conference stop for the next iteration of the research story.",
    details:
      "This is a planning note for now. Later it can include the accepted topic, travel notes, paper link, and how it fits into the final dissertation arc.",
    notes: ["Add accepted paper if available.", "Add travel plan.", "Attach presentation later."]
  },
  {
    id: "slovinsko-mobility",
    date: "2026",
    title: "Maribor SI",
    type: "Mobility",
    description:
      "Planned or remembered Slovenia mobility, ready for exact dates and photos.",
    details:
      "Keep this section open for host details, travel photos, and notes from the research stay. It can work as a lighter chapter between formal conferences.",
    notes: ["Add correct Slovak/English title later.", "Add host institution.", "Add photos."]
  },
  {
    id: "scyr-2026",
    date: "2026",
    title: "SCYR 2026",
    type: "Doctoral event",
    description:
      "Doctoral checkpoint close to the final dissertation phase.",
    details:
      "This section can later summarize what the PhD looks like near the end: finished parts, final risks, and what still needs writing or polishing.",
    notes: ["Add final-stage feedback.", "Add poster/slides.", "Mention dissertation progress."]
  },
  {
    id: "icpec-2026",
    date: "2026",
    title: "ICPEC 2026",
    type: "Conference",
    description:
      "Programming education conference stop for the 2026 research output.",
    details:
      "Use this section for the next education-focused paper or talk. It should connect back to ICPEC 2024 and show how the research matured over two years.",
    notes: ["Connect to ICPEC 2024.", "Add paper once available.", "Add presentation file."]
  },
  {
    id: "ines-2026",
    date: "2026",
    title: "INES 2026",
    type: "Conference",
    description:
      "Late timeline conference stop, useful as a closing or near-closing chapter.",
    details:
      "This can work as the final conference block for now. Add the accepted contribution, trip notes, and a short reflection on where the PhD work stands at that point.",
    notes: ["Add contribution title.", "Add final photos.", "Attach slides or paper link."]
  }
];

const accents = ["#2b6cb0", "#196147", "#9a5a08", "#8d2f56", "#5d4aa1", "#0f766e"];

const sectionPhotoFolders = {
  "iceta-2023": { folder: "phd/iceta-2023", label: "ICETA 2023" },
  "sami-2024": { folder: "phd/sami-2024", label: "SAMI 2024" },
  "icpec-2024": { folder: "phd/icpec-2024", label: "ICPEC 2024" },
  "iceta-2024": { folder: "phd/iceta-2024", label: "ICETA 2024" },
  "informatics-2024": { folder: "phd/informatics-2024", label: "Informatics" },
  "brno-summer-school": { folder: "travel/brno", label: "Brno CZ" },
  "ulysseus-curate-germany": { folder: "phd/ulysseus-curate-germany", label: "Münster DE" },
  "greece-mobility": { folder: "travel/greece", label: "Athens GR" },
  "iceta-2025": { folder: "phd/iceta-2025", label: "ICETA 2025" },
  "eger-hungary": { folder: "travel/eger", label: "Eger HU" },
  "sami-2026": { folder: "phd/sami-2026", label: "SAMI 2026" },
  "slovinsko-mobility": { folder: "phd/slovinsko-mobility", label: "Maribor SI" },
  "icpec-2026": { folder: "phd/icpec-2026", label: "ICPEC 2026" },
  "ines-2026": { folder: "phd/ines-2026", label: "INES 2026" }
};

function photosForSection(sectionId, fallbackLabels, limit = 200) {
  const config = sectionPhotoFolders[sectionId];
  if (!config) {
    return [];
  }

  const photos = photosFromFolder(config.folder, config.label, limit);
  return photos.length ? photos : fallbackLabels.slice(0, 0);
}

function createTimelineSection(item, index) {
  const photoLabels = item.type === "Mobility" ? ["Place", "Work", "Travel"] : ["Venue", "Slides", "Notes"];
  const photos = photosForSection(item.id, photoLabels, 200);

  return {
    ...item,
    caption: "",
    accent: accents[index % accents.length],
    files: [],
    photos
  };
}

const fallbackArticle = {
  id: "phd-timeline",
  status: "draft",
  layout: "timeline",
  navLabel: "PhD",
  eyebrow: "Research timeline",
  title: "PhD Timeline",
  intro:
    "A scrollable PhD timeline from first conference checkpoints through mobilities, doctoral events, and later-stage research milestones.",
  sections: timelineDrafts.map(createTimelineSection)
};

const travelArticle = {
  id: "travel-blog",
  status: "draft",
  layout: "timeline",
  locked: true,
  navLabel: "Travel",
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

const hackathonDrafts = [
  {
    id: "hack-kosice-2022",
    date: "2022",
    title: "Hack Kosice 2022",
    description: "First Hack Kosice chapter in the side-project timeline.",
    details:
      "This can become a short note about the team, the idea, what was built, and what stayed useful after the event.\n\nAdd the project name, teammates, result, and photos after they are sorted by event."
  },
  {
    id: "citython-kosice-2022",
    date: "2022",
    title: "RIS Citython Kosice 2022",
    description: "City-focused hackathon with civic and urban problem solving.",
    details:
      "Citython can be written as a more practical event note: what problem was chosen, how the prototype worked, and what made the constraints different from a normal software project.",
    url: "https://uvptechnicom.sk/event/ris-citython-kosice-2022/"
  },
  {
    id: "actinspace-hackathon",
    date: "2022",
    title: "ActInSpace Hackathon",
    description: "Space-themed hackathon connected to the ActInSpace format.",
    details:
      "This section can later explain the challenge, the data or space-tech angle, and what the team tried to prototype during the event.",
    url: "https://uvptechnicom.sk/event/actinspace-hackathon/"
  },
  {
    id: "telekom-hackathon-2022",
    date: "2022",
    title: "Telekom Hackathon 2022",
    description: "Industry hackathon focused on building a quick working concept.",
    details:
      "Add the challenge, stack, team role, and what was learned from working under a short deadline with an industry-oriented problem."
  },
  {
    id: "hack-kosice-2023",
    date: "2023",
    title: "Hack Kosice 2023",
    description: "Return to Hack Kosice with more experience and a sharper prototype mindset.",
    details:
      "This can compare the 2023 event with 2022: what felt easier, what changed in the team workflow, and how the final demo was prepared."
  },
  {
    id: "erste-digital-hackathon-2023",
    date: "2023",
    title: "Erste Digital Hackathon 2023",
    description: "Banking/technology hackathon with a more product-oriented framing.",
    details:
      "Use this section for the problem domain, UX or data angle, and how the idea was pitched at the end."
  },
  {
    id: "hack-kosice-2024",
    date: "2024",
    title: "Hack Kosice 2024",
    description: "Another Hack Kosice stop in the growing side-project archive.",
    details:
      "Add the project story, team setup, and what was different compared with previous Hack Kosice years."
  },
  {
    id: "telekom-hackathon-2024",
    date: "2024",
    title: "Telekom Hackathon 2024",
    description: "Later Telekom event with stronger practical engineering habits.",
    details:
      "This can focus on the build process: what was implemented quickly, what was cut, and what could become a real product after the weekend."
  },
  {
    id: "hack-kosice-2026",
    date: "2026",
    title: "Hack Kosice 2026",
    description: "Future/latest Hack Kosice entry ready for the final story and photos.",
    details:
      "Planning note for the 2026 edition. Add the final project, result, team, and the strongest photo from the event."
  }
];

function createHackathonSection(item, index) {
  const files = item.url
    ? [
        {
          label: "Event link",
          url: item.url,
          type: "link"
        }
      ]
    : [];

  return {
    id: item.id,
    date: item.date,
    title: item.title,
    type: "Hackathon",
    description: item.description,
    details: item.details,
    notes: ["Add team/project details.", "Add final result.", "Keep this short and visual."],
    caption: "",
    accent: accents[index % accents.length],
    files,
    photos: photosForHackathon(item.id, item.title)
  };
}

const hackathonsArticle = {
  id: "hackathons-blog",
  status: "draft",
  layout: "timeline",
  navLabel: "Hackathons",
  eyebrow: "Side-project events",
  title: "Hackathons",
  intro:
    "A timeline of hackathons, fast prototypes, team events, and small projects built outside the normal research workflow.",
  links: [
    {
      label: "Devpost",
      url: DEVPOST_PROFILE_URL,
      type: "link"
    }
  ],
  sections: hackathonDrafts.map(createHackathonSection)
};

const galleryPhotoGroups = [
  { id: "greece", folder: "travel/greece", date: "Travel", title: "Athens GR", accent: "#0f766e" },
  { id: "icpec-2026", folder: "phd/icpec-2026", date: "Conference", title: "ICPEC 2026", accent: "#2b6cb0" },
  { id: "slovinsko", folder: "phd/slovinsko-mobility", date: "Mobility", title: "Maribor SI", accent: "#196147" },
  { id: "hackathons", folder: "gallery/hackathons", date: "Events", title: "Hackathons", accent: "#c2410c" },
  { id: "ines-2026", folder: "phd/ines-2026", date: "Conference", title: "INES 2026", accent: "#5d4aa1" },
  { id: "posters", folder: "phd/posters", date: "Research", title: "Posters", accent: "#8d2f56" },
  { id: "sami-2024", folder: "phd/sami-2024", date: "Conference", title: "SAMI 2024", accent: "#9a5a08" },
  { id: "sami-2026", folder: "phd/sami-2026", date: "Conference", title: "SAMI 2026", accent: "#334155" },
  { id: "iceta-2025", folder: "phd/iceta-2025", date: "Conference", title: "ICETA 2025", accent: "#2b6cb0" },
  { id: "iceta-2024", folder: "phd/iceta-2024", date: "Conference", title: "ICETA 2024", accent: "#0f766e" },
  { id: "icpec-2024", folder: "phd/icpec-2024", date: "Conference", title: "ICPEC 2024", accent: "#5d4aa1" },
  { id: "eger", folder: "travel/eger", date: "Travel", title: "Eger HU", accent: "#d97706" },
  { id: "brno", folder: "travel/brno", date: "Travel", title: "Brno CZ", accent: "#7c3aed" },
  { id: "curate", folder: "phd/ulysseus-curate-germany", date: "Mobility", title: "Münster DE", accent: "#196147" },
  { id: "informatics", folder: "phd/informatics-2024", date: "Conference", title: "Informatics 2024", accent: "#8d2f56" },
  { id: "iceta-2023", folder: "phd/iceta-2023", date: "Conference", title: "ICETA 2023", accent: "#2b6cb0" }
];

function createPhotoGallerySections() {
  return galleryPhotoGroups.flatMap((group) =>
    photosFromFolder(group.folder, group.title, 200).map((photo, index) => ({
      id: `${group.id}-${index + 1}`,
      date: group.date,
      title: group.title,
      type: "Photo",
      description: `Photo from ${group.title}.`,
      details:
        `Photo from ${group.title}.\n\nAdd a short story, place, date, or memory here later.`,
      notes: [],
      caption: group.title,
      accent: group.accent,
      files: [],
      photos: [photo]
    }))
  );
}

const photosArticle = {
  id: "photos-gallery",
  status: "draft",
  layout: "gallery",
  navLabel: "Photos",
  eyebrow: "Personal gallery",
  title: "Photos",
  intro:
    "A visual gallery for favourite photos from conferences, travels, cities, and small everyday moments.",
  sections: createPhotoGallerySections()
};

const phdPreviewImage = photosFromFolder("phd/iceta-2025", "PhD", 1)[0];
const hackathonsPreviewImage =
  photoFromFile(HACKATHON_PHOTO_FOLDER, "hacks.png", "Hackathons") ||
  photosFromFolder(HACKATHON_PHOTO_FOLDER, "Hackathons", 1)[0];

const cardPresets = {
  "phd-timeline": {
    label: "PhD",
    title: "PhD",
    description: "Conferences, mobilities, dissertation milestones.",
    accent: "#2b6cb0",
    side: "left",
    rotation: "-7deg",
    lift: "6px",
    previewImage: phdPreviewImage && phdPreviewImage.url,
    stats: ["20 stops", "photos", "timeline"]
  },
  "travel-blog": {
    label: "Travel",
    title: "Travel",
    description: "Trips and notes prepared for later.",
    accent: "#c2410c",
    side: "right",
    rotation: "6deg",
    lift: "-10px",
    locked: true
  },
  "hackathons-blog": {
    label: "Hackathons",
    title: "Hackathons",
    description: "Fast prototypes, teams, demos, and event notes.",
    accent: "#9a3412",
    side: "right",
    rotation: "-5deg",
    lift: "12px",
    previewImage: hackathonsPreviewImage && hackathonsPreviewImage.url,
    stats: ["9 events", "3x winner", "Devpost"]
  },
  "photos-gallery": {
    label: "Photos",
    title: "Photos",
    description: "Personal gallery, snapshots, and visual notes.",
    accent: "#7c3aed",
    side: "left",
    rotation: "5deg",
    lift: "-4px"
  }
};

const cardCopy = {
  en: {
    "phd-timeline": {
      label: "PhD",
      title: "PhD",
      description: "Conferences, mobilities, dissertation milestones.",
      stats: ["20 stops", "photos", "timeline"]
    },
    "travel-blog": {
      label: "Travel",
      title: "Travel",
      description: "Trips and notes prepared for later."
    },
    "hackathons-blog": {
      label: "Hackathons",
      title: "Hackathons",
      description: "Fast prototypes, teams, demos, and event notes.",
      stats: ["9 events", "3x winner", "Devpost"]
    },
    "photos-gallery": {
      label: "Photos",
      title: "Photos",
      description: "Personal gallery, snapshots, and visual notes."
    }
  },
  sk: {
    "phd-timeline": {
      label: "PhD",
      title: "PhD",
      description: "Konferencie, mobility a dizertačné míľniky.",
      stats: ["20 zastávok", "fotky", "timeline"]
    },
    "travel-blog": {
      label: "Travel",
      title: "Travel",
      description: "Výlety a poznámky pripravené na neskôr."
    },
    "hackathons-blog": {
      label: "Hackathony",
      title: "Hackathony",
      description: "Rýchle prototypy, tímy, demá a eventové poznámky.",
      stats: ["9 eventov", "3x winner", "Devpost"]
    },
    "photos-gallery": {
      label: "Fotky",
      title: "Fotky",
      description: "Osobná galéria, momentky a vizuálne poznámky."
    }
  }
};

const sectionCopy = {};

const refinedSectionCopy = {
  en: {
    "iceta-2023": {
      description: "My first PhD-period ICETA paper: puzzle-driven learning and IT challenges for different experience levels.",
      details:
        "ICETA 2023 was the first conference stop of my PhD period. The paper was about puzzle-driven learning: designing IT challenges that can work for people with different levels of experience.\n\nIt is a useful starting point for the blog because the work was still close to teaching practice and student motivation, before the research moved deeper into code analysis, similarity, and programmer identification.",
      notes: ["Puzzle-driven learning.", "IT challenges for mixed experience levels.", "First ICETA entry in the PhD timeline."]
    },
    "sami-2024": {
      description: "A paper comparing three code similarity tools on more than 1,000 student projects.",
      details:
        "SAMI 2024 is where the code similarity part of my research became much more concrete. The paper compared three tools on a large set of student projects, so the discussion was less abstract and more about what these tools really do on educational code.\n\nFor the PhD timeline this is one of the important technical steps: it connects plagiarism detection, good clones, student assignments, and practical limits of automated analysis.",
      notes: ["1,000+ student projects.", "Code similarity tools.", "A stronger experimental base for the PhD."]
    },
    "scyr-2024": {
      description: "A doctoral conference note on source-code style as a behavioral biometric marker.",
      details:
        "SCYR 2024 was a smaller, more doctoral-focused place to present the early programmer-identification direction. The idea was to look at stylistic patterns in source code and treat them as behavioral biometric markers.\n\nIt was useful because the topic had to be explained simply: what can code style say about a programmer, where it breaks, and why education is a good environment for testing it.",
      notes: ["Source-code stylometry.", "Behavioral biometrics.", "Early programmer-identification framing."]
    },
    "icpec-2024": {
      description: "Programming education work around large courses, automated assessment, and ChatGPT use in assignments.",
      details:
        "ICPEC 2024 was strongly connected to programming education. My paper focused on adapting an automated assessment system for large programming courses, and the same conference also included work on using ChatGPT during programming assignments.\n\nThis belongs in the PhD story because it shows the practical setting behind the research: real courses, many submissions, assessment pressure, and tools that have to work for students and teachers.",
      notes: ["Automated assessment for large programming courses.", "Programming education context.", "ChatGPT in assignments as a related topic."]
    },
    "olomouc-mobility-2024": {
      title: "Olomouc CZ",
      description: "A CEEPUS mobility focused on the research proposal and concentrated PhD work.",
      details:
        "Olomouc was not a conference stop, but it mattered because it created time for research planning. The mobility was connected to preparing the research proposal and getting focused space outside the normal Košice routine.\n\nThese mobility entries are less about a single paper and more about the background work that makes the later papers possible.",
      notes: ["CEEPUS mobility.", "Research proposal work.", "Focused time outside the home department."]
    },
    "iceta-2024": {
      description: "ICETA paper on improving software education with a technical debt analysis tool.",
      details:
        "ICETA 2024 moved the story toward tools for software education. The paper focused on technical debt analysis and how such tooling can help students see quality problems in their code, not only whether the program passes tests.\n\nCompared with ICETA 2023, this already feels closer to the core of the PhD: source code as data, feedback for students, and automated analysis that supports teaching.",
      notes: ["Technical debt analysis.", "Software education tooling.", "Feedback beyond pass/fail testing."]
    },
    "informatics-2024": {
      description: "A software-engineering detour comparing microservices and monolithic architectures.",
      details:
        "Informatics 2024 was more engineering-oriented than most entries in this timeline. The paper compared scalability and performance in microservices and monolithic architectures.\n\nIt is a useful side branch because it reflects the implementation side of my work: not only research questions, but also systems, architecture, measurements, and trade-offs.",
      notes: ["Microservices vs monolith.", "Performance and scalability.", "Engineering side of the research work."]
    },
    "sami-2025": {
      description: "A bigger SAMI year: GPT-generated C assignments, good clones, and several education-focused collaborations.",
      details:
        "SAMI 2025 was one of the densest conference points in the timeline. My main paper explored GPT-generated variations in C programming assignments, while related collaborations covered code reuse and good clones, reactive programming education, and a MATLAB pandemic model application.\n\nThis is where the PhD story starts to touch AI in programming education more directly.",
      notes: ["GPT-generated C assignments.", "Code reuse and good clones.", "Broader collaboration year."]
    },
    "minimovka-defense": {
      title: "Minimovka",
      description: "An internal PhD milestone where the dissertation direction had to make sense as one story.",
      details:
        "Minimovka was less public than a conference, but more important internally. It forced me to explain what the dissertation is really about: programmer identification, code style, behavioral signals, education data, and how the separate papers fit together.\n\nFor the blog it is a good place for a more honest note about what was clear, what was still messy, and what changed after feedback.",
      notes: ["Internal PhD milestone.", "Dissertation direction check.", "A useful moment for reflection."]
    },
    "scyr-2025": {
      description: "A SCYR update on programmer identification from source-code stylometry and behavioral biometrics.",
      details:
        "SCYR 2025 continued the line from SCYR 2024, but with a clearer title and a clearer research shape: programmer identification based on source-code stylometric analysis and behavioral biometrics.\n\nIt fits nicely after the minimovka because the topic could be presented in a more mature way, with a stronger link between code features, behavior, and education data.",
      notes: ["Programmer identification.", "Source-code stylometry.", "Behavioral biometrics."]
    },
    "brno-summer-school": {
      title: "Brno CZ",
      description: "Summer School of Statistics in Brno, focused on statistical methods and practical data analysis.",
      details:
        "Brno was a learning stop rather than a publication stop. The Summer School of Statistics was useful because a lot of my work depends on choosing the right features, comparing models, and not overclaiming from messy educational data.\n\nIt also breaks up the conference timeline with something more practical and classroom-like.",
      notes: ["Statistics summer school.", "Practical data analysis.", "Useful for evaluation-heavy research."]
    },
    "ulysseus-curate-germany": {
      title: "Münster DE",
      description: "CURATE/Ulysseus project work presented in Germany, connected to a GymBeam collaboration.",
      details:
        "The Germany entry is tied to the CURATE/Ulysseus project. I worked on a semester-long collaboration for GymBeam and took product-owner and scrum-master responsibilities, so this was closer to product work than a classic research trip.\n\nIt still belongs in the PhD blog because it shows the project-management and communication side of academic collaborations.",
      notes: ["CURATE/Ulysseus.", "GymBeam project.", "Product owner and scrum master work."]
    },
    "greece-mobility": {
      title: "Athens GR",
      description: "Research mobility at AUEB/BALab with Diomidis Spinellis, focused on programmer attribution.",
      details:
        "Athens was one of the most relevant research mobilities for the dissertation. The stay at Athens University of Economics and Business and BALab was focused on source-code authorship attribution and stylistic analysis of programs.\n\nThe strongest research connection is the survey work on bridging behavioral biometrics and source-code stylometry.",
      notes: ["AUEB and BALab.", "Collaboration with Diomidis Spinellis.", "Survey work on programmer attribution."]
    },
    "iceta-2025": {
      description: "ICETA papers on programmer identity from source code and AI-generated code watermarks.",
      details:
        "ICETA 2025 is close to the core of the dissertation. My paper focused on detecting programmer identity from source code with machine learning methods. A related paper looked at detecting AI-generated source code in student assignments using steganographic watermarks.\n\nTogether they show how the research moved from similarity and education tooling toward identity, authorship, and the effect of AI-generated code.",
      notes: ["Programmer identity from source code.", "Machine learning methods.", "AI-generated code watermarking."]
    },
    "eger-hungary": {
      title: "Eger HU",
      description: "Working meetings around the Slovak-Hungarian TAIPO collaboration.",
      details:
        "Eger connects to the Slovak-Hungarian research collaboration with Eszterházy Károly Catholic University. The current thread is TAIPO, an AI assistant supporting product-owner workflows and vibe-coding style development.\n\nIt is a different kind of entry: not a standard conference, but a collaboration trip with meetings, planning, and an applied AI/software-engineering angle.",
      notes: ["TAIPO collaboration.", "Product-owner assistant.", "Working meetings in Hungary."]
    },
    "sami-2026": {
      description: "SAMI paper on programming style consistency, plagiarism, and code similarity metrics.",
      details:
        "SAMI 2026 continues the similarity and authorship line. The paper is about detecting programming style consistency and plagiarism through code similarity metrics.\n\nIt connects earlier code-similarity experiments with the broader question of whether a student's programming style remains stable and how deviations can be interpreted.",
      notes: ["Programming style consistency.", "Plagiarism detection.", "Code similarity metrics."]
    },
    "slovinsko-mobility": {
      title: "Maribor SI",
      description: "Research mobility in Maribor focused on finishing the dissertation direction.",
      details:
        "Maribor is a late-stage research mobility. The plan is connected to dissertation work, source-code analysis, and programmer authorship identification, with collaboration at the University of Maribor.\n\nIn the blog it should work as a focused writing-and-research chapter rather than just a travel entry.",
      notes: ["University of Maribor.", "Dissertation-focused mobility.", "Source-code authorship identification."]
    },
    "scyr-2026": {
      description: "SCYR paper decomposing the programmer attribution problem in educational source code.",
      details:
        "SCYR 2026 is the cleanest doctoral-conference formulation of the attribution problem so far: instead of treating programmer identification as one black box, the work breaks it down into smaller parts.\n\nThat makes it a good late-stage timeline entry, because it shows the dissertation becoming more precise.",
      notes: ["Programmer attribution.", "Educational source code.", "Breaking the problem into clearer pieces."]
    },
    "icpec-2026": {
      description: "ICPEC papers on LLM-based personalization and VR/game-development education.",
      details:
        "ICPEC 2026 connects the education side of the work with newer LLM-based personalization. My paper is about moving from repositories to practice: using LLMs for personalized programming education.\n\nA related collaboration looks at bridging game development and virtual reality education through Blender-based tutorials.",
      notes: ["LLM-based personalization.", "Programming education.", "VR/game-development education collaboration."]
    },
    "ines-2026": {
      description: "A broad INES year covering green computing, commits, AST similarity visualization, and student programming styles.",
      details:
        "INES 2026 is a broad set of collaborations. The topics include source-code energy consumption, commit classification for developer style profiling, AST-based similarity visualization, and identifying student programming styles from code and repository data.\n\nIt is a good late timeline block because it shows how the PhD theme spreads into related questions: energy, repositories, visualization, and student style.",
      notes: ["Green computing and code energy.", "Commit classification.", "AST similarity and student programming styles."]
    },
    "hack-kosice-2022": {
      description: "The first Hack Kosice entry in this archive.",
      details: "Hack Kosice 2022 starts the hackathon list. I do not want to attach random photos to it yet, so this entry stays text-first until the event photos are sorted.",
      notes: ["First Hack Kosice in the list.", "Photo mapping still needs manual sorting.", "Good place to add team and project later."]
    },
    "citython-kosice-2022": {
      description: "A city-focused hackathon around civic and urban problems in Kosice.",
      details: "RIS Citython Kosice 2022 belongs to the civic-tech part of the archive. The useful story here is the problem, the prototype, and how the idea could work for a city or public service.",
      notes: ["Civic-tech event.", "Urban problem solving.", "Add project and team details later."]
    },
    "actinspace-hackathon": {
      description: "A space-themed hackathon with a very different problem domain.",
      details: "ActInSpace is interesting because the challenge is not a normal web-app problem. The team has to understand the space-tech context quickly and turn it into something demoable.",
      notes: ["Space-tech challenge.", "Fast domain learning.", "Add exact project later."]
    },
    "telekom-hackathon-2022": {
      description: "An industry hackathon focused on getting a working idea ready fast.",
      details: "Telekom Hackathon 2022 fits the practical side of the archive: deadline, demo, useful feature first, polish second.",
      notes: ["Industry challenge.", "Fast demo work.", "Add project result later."]
    },
    "hack-kosice-2023": {
      description: "Another Hack Kosice year with more experience than the first one.",
      details: "Hack Kosice 2023 should later compare nicely with 2022: what changed in the team, planning, and final demo.",
      notes: ["Return to Hack Kosice.", "Better prototype workflow.", "Add team/project later."]
    },
    "erste-digital-hackathon-2023": {
      description: "A product-oriented hackathon in a banking/technology setting.",
      details: "Erste Digital Hackathon 2023 belongs to the product side of the list: user value, pitch, and a prototype that has to make sense quickly.",
      notes: ["Banking/technology context.", "Product framing.", "Add final idea later."]
    },
    "hack-kosice-2024": {
      description: "A later Hack Kosice entry where the process matters as much as the idea.",
      details: "Hack Kosice 2024 can later focus on the team workflow and demo preparation, not only the final project.",
      notes: ["Recurring Hack Kosice event.", "Team workflow.", "Add project and result later."]
    },
    "telekom-hackathon-2024": {
      description: "Another Telekom hackathon, with a stronger focus on practical delivery.",
      details: "Telekom Hackathon 2024 should be written around what was actually built and what was realistic to finish under the deadline.",
      notes: ["Practical delivery.", "Core feature first.", "Add result later."]
    },
    "hack-kosice-2026": {
      description: "The newest Hack Kosice entry in the current list.",
      details: "Hack Kosice 2026 can become the comparison point for the whole hackathon timeline once the project, team, result, and photos are added.",
      notes: ["Latest Hack Kosice entry.", "Compare with 2022.", "Add photos after sorting."]
    }
  },
  sk: {
    "iceta-2023": {
      description: "Prvá ICETA počas PhD: puzzle-driven learning a IT úlohy pre rôzne úrovne skúseností.",
      details:
        "ICETA 2023 bola moja prvá konferenčná zastávka v PhD období. Článok riešil puzzle-driven learning, teda návrh IT výziev tak, aby dávali zmysel začiatočníkom aj skúsenejším ľuďom.\n\nV blogu je to dobrý začiatok, lebo téma bola ešte veľmi blízko výučbe a motivácii študentov. Až neskôr sa výskum posunul hlbšie ku kódu, podobnosti a identifikácii programátorov.",
      notes: ["Puzzle-driven learning.", "IT výzvy pre rôzne úrovne.", "Prvá ICETA v PhD timeline."]
    },
    "sami-2024": {
      description: "Článok o porovnaní troch nástrojov na podobnosť kódu na viac ako 1 000 študentských projektoch.",
      details:
        "Na SAMI 2024 sa téma podobnosti kódu výrazne spresnila. Článok porovnával tri nástroje na veľkej množine študentských projektov, takže už nešlo iba o teóriu, ale o to, ako sa tieto nástroje správajú na reálnom edukatívnom kóde.\n\nPre PhD je to dôležitý technický krok medzi plagiátorstvom, dobrými klonmi, zadaniami a limitmi automatickej analýzy.",
      notes: ["Viac ako 1 000 študentských projektov.", "Nástroje na podobnosť kódu.", "Silnejší experimentálny základ."]
    },
    "scyr-2024": {
      description: "Doktorandská prezentácia o štýle zdrojového kódu ako behaviorálnej biometrike.",
      details:
        "SCYR 2024 bol menší doktorandský priestor na predstavenie skorého smeru identifikácie programátorov. Pointa bola pozerať sa na štylistické vzory v zdrojovom kóde ako na behaviorálne biometrické znaky.\n\nPomohlo to hlavne v tom, že tému bolo treba vysvetliť jednoducho: čo sa dá zistiť zo štýlu kódu, kde sú limity a prečo je školské prostredie dobré na testovanie.",
      notes: ["Stylometria zdrojového kódu.", "Behaviorálne biometriky.", "Skoré uchopenie témy identifikácie."]
    },
    "icpec-2024": {
      description: "Programátorské vzdelávanie, veľké kurzy, automatizované hodnotenie a používanie ChatGPT pri zadaniach.",
      details:
        "ICPEC 2024 bol silno napojený na výučbu programovania. Môj článok riešil úpravu automatizovaného hodnotiaceho systému pre veľké programátorské kurzy. Na tej istej konferencii bola aj práca o používaní ChatGPT pri implementácii programov vo výučbe.\n\nDo PhD príbehu to patrí preto, lebo ukazuje reálne prostredie výskumu: kurzy, veľa odovzdaní, tlak na hodnotenie a nástroje, ktoré musia pomôcť študentom aj učiteľom.",
      notes: ["Automatizované hodnotenie veľkých kurzov.", "Programátorské vzdelávanie.", "ChatGPT v zadaniach ako súvisiaca téma."]
    },
    "olomouc-mobility-2024": {
      title: "Olomouc CZ",
      description: "CEEPUS mobilita zameraná na výskumný zámer a sústredenú PhD prácu.",
      details:
        "Olomouc nebola konferencia, ale pre PhD mala význam. Mobilita bola spojená s prípravou výskumného zámeru a dala priestor pracovať mimo bežnej košickej rutiny.\n\nTakéto mobility nie sú o jednom konkrétnom článku. Skôr ukazujú pozadie, bez ktorého by neskoršie články nevznikli.",
      notes: ["CEEPUS mobilita.", "Príprava výskumného zámeru.", "Sústredený čas mimo domácej katedry."]
    },
    "iceta-2024": {
      description: "ICETA článok o nástroji na analýzu technického dlhu vo výučbe softvérového inžinierstva.",
      details:
        "ICETA 2024 posunula príbeh bližšie k nástrojom pre softvérové vzdelávanie. Článok bol o analýze technického dlhu a o tom, ako môžu študenti dostať spätnú väzbu aj na kvalitu kódu, nielen na to, či program prešiel testami.\n\nOproti ICETA 2023 je to už bližšie jadru PhD: zdrojový kód ako dáta, spätná väzba pre študentov a automatická analýza vo výučbe.",
      notes: ["Technický dlh.", "Nástroje pre softvérové vzdelávanie.", "Spätná väzba nad rámec testov."]
    },
    "informatics-2024": {
      description: "Softvérovo-inžinierska odbočka o porovnaní mikroslužieb a monolitu.",
      details:
        "Informatics 2024 bola viac inžinierska než väčšina položiek v tejto timeline. Článok porovnával škálovateľnosť a výkon mikroslužieb a monolitických architektúr.\n\nDo blogu to patrí ako bočná vetva: výskum nie je iba o otázkach a modeloch, ale aj o systémoch, meraniach, architektúre a kompromisoch.",
      notes: ["Mikroslužby vs monolit.", "Výkon a škálovateľnosť.", "Inžinierska časť práce."]
    },
    "sami-2025": {
      description: "Silný SAMI rok: GPT-generované C zadania, dobré klony a viacero edukačných spoluprác.",
      details:
        "SAMI 2025 bolo jedno z najhustejších konferenčných miest v tejto timeline. Môj hlavný článok riešil GPT-generované variácie C zadaní. Súvisiace spolupráce sa venovali znovupoužitiu kódu, dobrým klonom, reaktívnemu programovaniu a MATLAB aplikácii pre pandemický model.\n\nTu sa PhD príbeh začína výraznejšie dotýkať AI v programátorskom vzdelávaní.",
      notes: ["GPT-generované C zadania.", "Code reuse a dobré klony.", "Silný rok spoluprác."]
    },
    "minimovka-defense": {
      title: "Minimovka",
      description: "Interný PhD míľnik, kde musel celý smer dizertácie dávať zmysel ako jeden príbeh.",
      details:
        "Minimovka nebola verejná konferencia, ale interne bola veľmi dôležitá. Prinútila ma vysvetliť, o čom dizertácia naozaj je: identifikácia programátorov, štýl kódu, behaviorálne signály, edukačné dáta a to, ako do seba jednotlivé články zapadajú.\n\nV blogu je to dobré miesto na úprimnejšiu poznámku o tom, čo už bolo jasné, čo bolo ešte rozhádzané a čo sa zmenilo po spätnej väzbe.",
      notes: ["Interný PhD míľnik.", "Kontrola smeru dizertácie.", "Dobré miesto na reflexiu."]
    },
    "scyr-2025": {
      description: "SCYR pokračovanie o identifikácii programátorov cez stylometriu kódu a behaviorálne biometriky.",
      details:
        "SCYR 2025 nadviazal na SCYR 2024, ale už s jasnejším názvom aj tvarom výskumu: identifikácia programátora na základe stylometrickej analýzy zdrojového kódu a behaviorálnych biometrík.\n\nPo minimovke sa téma dala prezentovať zrelšie a s lepším prepojením medzi kódom, správaním a edukačnými dátami.",
      notes: ["Identifikácia programátorov.", "Stylometria kódu.", "Behaviorálne biometriky."]
    },
    "brno-summer-school": {
      title: "Brno CZ",
      description: "Letná škola štatistiky v Brne, zameraná na štatistické metódy a praktickú analýzu dát.",
      details:
        "Brno bola skôr vzdelávacia zastávka než publikačná. Letná škola štatistiky bola užitočná, lebo veľká časť mojej práce stojí na výbere príznakov, porovnávaní modelov a opatrnej interpretácii neporiadnych edukačných dát.\n\nZároveň príjemne rozbíja konferenčnú timeline niečím praktickejším.",
      notes: ["Letná škola štatistiky.", "Praktická analýza dát.", "Užitočné pre evaluáciu výskumu."]
    },
    "ulysseus-curate-germany": {
      title: "Münster DE",
      description: "CURATE/Ulysseus projekt prezentovaný v Nemecku, napojený na spoluprácu s GymBeam.",
      details:
        "Nemecká zastávka súvisí s projektom CURATE/Ulysseus. Pracoval som na semestrálnej spolupráci pre GymBeam a mal som rolu product ownera a scrum mastera, takže to bolo bližšie produktovej práci než klasickej konferencii.\n\nDo PhD blogu to patrí kvôli projektovému manažmentu, komunikácii a reálnej spolupráci mimo bežných článkov.",
      notes: ["CURATE/Ulysseus.", "Projekt pre GymBeam.", "Product owner a scrum master."]
    },
    "greece-mobility": {
      title: "Athens GR",
      description: "Výskumná mobilita na AUEB/BALab s Diomidisom Spinellisom, zameraná na atribúciu programátorov.",
      details:
        "Athens bola jedna z najrelevantnejších mobilít pre dizertáciu. Pobyt na Athens University of Economics and Business a v BALab sa sústredil na autorstvo zdrojového kódu a štylistickú analýzu programov.\n\nNajsilnejšie výskumné prepojenie je prehľadový článok o prepájaní behaviorálnych biometrík a source-code stylometry.",
      notes: ["AUEB a BALab.", "Spolupráca s Diomidisom Spinellisom.", "Survey o programmer attribution."]
    },
    "iceta-2025": {
      description: "ICETA články o identite programátora zo zdrojového kódu a watermarkoch pre AI-generovaný kód.",
      details:
        "ICETA 2025 je veľmi blízko jadru dizertácie. Môj článok riešil detekciu identity programátora zo zdrojového kódu pomocou metód strojového učenia. Súvisiaci článok sa venoval detekcii AI-generovaného kódu v študentských zadaniach pomocou steganografických watermarkov.\n\nSpolu ukazujú posun od podobnosti a edukačných nástrojov k identite, autorstvu a vplyvu AI-generovaného kódu.",
      notes: ["Identita programátora zo zdrojového kódu.", "Metódy strojového učenia.", "Watermarky pre AI-generovaný kód."]
    },
    "eger-hungary": {
      title: "Eger HU",
      description: "Pracovné stretnutia okolo slovensko-maďarskej spolupráce TAIPO.",
      details:
        "Eger súvisí so slovensko-maďarskou výskumnou spoluprácou s Eszterházy Károly Catholic University. Aktuálna linka je TAIPO, AI asistent pre workflow product ownera a vibe-coding štýl vývoja.\n\nNie je to klasická konferencia, skôr pracovná cesta so stretnutiami, plánovaním a aplikovanou AI/software-engineering témou.",
      notes: ["Spolupráca TAIPO.", "Product-owner assistant.", "Pracovné stretnutia v Maďarsku."]
    },
    "sami-2026": {
      description: "SAMI článok o konzistentnosti programátorského štýlu, plagiátorstve a metrikách podobnosti kódu.",
      details:
        "SAMI 2026 pokračuje v linke podobnosti a autorstva. Článok rieši detekciu konzistentnosti programátorského štýlu a plagiátorstva cez metriky podobnosti kódu.\n\nPrepája staršie experimenty s podobnosťou kódu so širšou otázkou, či je štýl študenta stabilný a ako čítať odchýlky.",
      notes: ["Konzistentnosť programátorského štýlu.", "Detekcia plagiátorstva.", "Metriky podobnosti kódu."]
    },
    "slovinsko-mobility": {
      title: "Maribor SI",
      description: "Výskumná mobilita v Maribore zameraná na finalizáciu smeru dizertácie.",
      details:
        "Maribor je neskoršia výskumná mobilita. Plán je napojený na dizertačnú prácu, analýzu zdrojového kódu a identifikáciu autorstva programátorov v spolupráci s University of Maribor.\n\nV blogu by to malo pôsobiť ako sústredená výskumno-písacia kapitola, nie iba cestovateľská položka.",
      notes: ["University of Maribor.", "Mobilita zameraná na dizertáciu.", "Identifikácia autorstva zdrojového kódu."]
    },
    "scyr-2026": {
      description: "SCYR článok, ktorý rozkladá problém atribúcie programátorov v edukačnom zdrojovom kóde.",
      details:
        "SCYR 2026 je zatiaľ najčistejšie doktorandské pomenovanie problému atribúcie. Namiesto jedného veľkého black boxu sa práca pozerá na menšie časti problému.\n\nPre neskorú fázu PhD je to dobré, lebo ukazuje, že téma sa spresňuje.",
      notes: ["Atribúcia programátorov.", "Edukačný zdrojový kód.", "Rozklad problému na menšie časti."]
    },
    "icpec-2026": {
      description: "ICPEC články o LLM personalizácii a VR/game-development vzdelávaní.",
      details:
        "ICPEC 2026 prepája vzdelávaciu časť výskumu s LLM personalizáciou. Môj článok je o prechode od repozitárov k praxi: ako využiť LLM na personalizované programátorské vzdelávanie.\n\nSúvisiaca spolupráca rieši prepojenie game developmentu a VR vzdelávania cez Blender tutoriály.",
      notes: ["LLM-based personalizácia.", "Programátorské vzdelávanie.", "VR/game-development spolupráca."]
    },
    "ines-2026": {
      description: "Širší INES rok: green computing, commity, AST vizualizácia podobnosti a študentské programátorské štýly.",
      details:
        "INES 2026 je široký blok spoluprác. Témy zahŕňajú energetickú spotrebu zdrojového kódu, klasifikáciu commitov pre štýlové profilovanie vývojára, AST vizualizáciu podobnosti a identifikáciu študentských programátorských štýlov z kódu a repozitárov.\n\nJe to dobrý neskorý blok v timeline, lebo ukazuje, kam sa PhD téma rozvetvuje: energia, repozitáre, vizualizácia a študentský štýl.",
      notes: ["Green computing a energia kódu.", "Klasifikácia commitov.", "AST podobnosť a študentské štýly."]
    },
    "hack-kosice-2022": {
      description: "Prvý Hack Kosice v tomto archíve.",
      details: "Hack Kosice 2022 otvára hackathonový zoznam. Nechcem k nemu priraďovať náhodné fotky, takže zatiaľ ostáva textový, kým budú fotky rozdelené podľa eventov.",
      notes: ["Prvý Hack Kosice v zozname.", "Fotky treba rozdeliť manuálne.", "Neskôr doplniť tím a projekt."]
    },
    "citython-kosice-2022": {
      description: "Mestský hackathon o civic-tech a urban problémoch v Košiciach.",
      details: "RIS Citython Košice 2022 patrí do civic-tech časti archívu. Dôležitý bude hlavne problém, prototyp a to, ako by nápad vedel fungovať pre mesto alebo verejnú službu.",
      notes: ["Civic-tech event.", "Urban problem solving.", "Neskôr doplniť projekt a tím."]
    },
    "actinspace-hackathon": {
      description: "Space-themed hackathon s úplne inou doménou problému.",
      details: "ActInSpace je zaujímavý tým, že nejde o bežný webový problém. Tím musí rýchlo pochopiť space-tech kontext a spraviť z neho niečo, čo sa dá odprezentovať.",
      notes: ["Space-tech challenge.", "Rýchle pochopenie domény.", "Doplniť presný projekt."]
    },
    "telekom-hackathon-2022": {
      description: "Industry hackathon zameraný na rýchly funkčný nápad.",
      details: "Telekom Hackathon 2022 patrí k praktickej strane archívu: deadline, demo, najprv užitočná funkcia, až potom polish.",
      notes: ["Industry challenge.", "Rýchla demo práca.", "Doplniť výsledok projektu."]
    },
    "hack-kosice-2023": {
      description: "Ďalší Hack Kosice rok, už s viac skúsenosťami než pri prvom.",
      details: "Hack Kosice 2023 sa bude dať dobre porovnať s rokom 2022: čo sa zmenilo v tíme, plánovaní a príprave finálneho dema.",
      notes: ["Návrat na Hack Kosice.", "Lepší prototypový workflow.", "Doplniť tím/projekt."]
    },
    "erste-digital-hackathon-2023": {
      description: "Produktovejšie ladený hackathon v banking/technology prostredí.",
      details: "Erste Digital Hackathon 2023 patrí k produktovej časti zoznamu: hodnota pre používateľa, pitch a prototyp, ktorý musí byť rýchlo pochopiteľný.",
      notes: ["Banking/technology kontext.", "Produktový framing.", "Doplniť finálny nápad."]
    },
    "hack-kosice-2024": {
      description: "Neskorší Hack Kosice, kde je proces rovnako dôležitý ako samotný nápad.",
      details: "Hack Kosice 2024 môže neskôr viac ukázať tímový workflow a prípravu dema, nie iba finálny projekt.",
      notes: ["Opakujúci sa Hack Kosice event.", "Tímový workflow.", "Doplniť projekt a výsledok."]
    },
    "telekom-hackathon-2024": {
      description: "Ďalší Telekom hackathon so silnejším dôrazom na praktické doručenie.",
      details: "Telekom Hackathon 2024 by mal byť napísaný okolo toho, čo sa reálne postavilo a čo bolo rozumné stihnúť pod deadlineom.",
      notes: ["Praktické doručenie.", "Najprv core feature.", "Doplniť výsledok."]
    },
    "hack-kosice-2026": {
      description: "Najnovší Hack Kosice v aktuálnom zozname.",
      details: "Hack Kosice 2026 môže byť porovnávací bod pre celú hackathon timeline, keď sa doplní projekt, tím, výsledok a správne fotky.",
      notes: ["Najnovší Hack Kosice.", "Porovnanie s rokom 2022.", "Fotky doplniť po roztriedení."]
    }
  }
};

Object.keys(refinedSectionCopy).forEach((language) => {
  sectionCopy[language] = {
    ...(sectionCopy[language] || {}),
    ...refinedSectionCopy[language]
  };
});

const ambientLines = [
  { className: "line-one" },
  { className: "line-two" },
  { className: "line-three" },
  { className: "line-four" },
  { className: "line-five" }
];

function getStoredBlogLanguage() {
  if (typeof window === "undefined") {
    return "en";
  }

  const storedLanguage = window.localStorage.getItem(BLOG_LANGUAGE_STORAGE_KEY);
  return languageOptions.includes(storedLanguage) ? storedLanguage : "en";
}

function getBlogCopy(language) {
  return blogCopy[language] || blogCopy.en;
}

function getArticleCopy(articleId, language) {
  return articleCopy[language] && articleCopy[language][articleId]
    ? articleCopy[language][articleId]
    : articleCopy.en[articleId] || {};
}

function getSectionCopy(sectionId, language) {
  return sectionCopy[language] && sectionCopy[language][sectionId]
    ? sectionCopy[language][sectionId]
    : sectionCopy.en[sectionId] || {};
}

function getCardPreset(articleId, language) {
  return {
    ...(cardPresets[articleId] || {}),
    ...(cardCopy.en[articleId] || {}),
    ...(cardCopy[language] && cardCopy[language][articleId] ? cardCopy[language][articleId] : {})
  };
}

function cleanCaption(caption) {
  return staleDraftTextPattern.test(caption || "") ? "" : caption || "";
}

function mergeStaticSection(staticSection, dynamicSection) {
  if (!dynamicSection) {
    return staticSection;
  }

  return {
    ...dynamicSection,
    ...staticSection,
    caption: cleanCaption(dynamicSection.caption) || staticSection.caption || "",
    files: dynamicSection.files && dynamicSection.files.length ? dynamicSection.files : staticSection.files,
    photos: hasPhotoUrls(dynamicSection.photos) ? dynamicSection.photos : staticSection.photos
  };
}

function localizeArticle(article, language) {
  const translatedArticle = getArticleCopy(article.id, language);

  return {
    ...article,
    ...translatedArticle,
    sections: article.sections.map((section) => ({
      ...section,
      ...getSectionCopy(section.id, language)
    }))
  };
}

function normalizePhoto(photo, index) {
  const fallbackRotations = ["-7deg", "4deg", "-2deg"];
  const fallbackLifts = ["10px", "-8px", "18px"];

  return {
    label: photo.label || `Photo ${index + 1}`,
    url: photo.url || "",
    rotation: photo.rotation || fallbackRotations[index % fallbackRotations.length],
    lift: photo.lift || fallbackLifts[index % fallbackLifts.length]
  };
}

function normalizeFile(file, index) {
  return {
    label: file.label || `File ${index + 1}`,
    url: file.url || "",
    type: file.type || "download",
    download: file.download || ""
  };
}

function normalizeSection(section, index) {
  const id = section.id || `section-${index + 1}`;
  const type = section.type || "";
  const defaultPhotoLabels = type === "Mobility" ? ["Place", "Work", "Travel"] : ["Venue", "Slides", "Notes"];
  const normalizedPhotos = (Array.isArray(section.photos) ? section.photos : [])
    .slice(0, 6)
    .map((photo, photoIndex) => normalizePhoto(photo, photoIndex));
  const staticPhotos = photosForSection(
    id,
    normalizedPhotos.length ? normalizedPhotos.map((photo) => photo.label) : defaultPhotoLabels
  );

  return {
    id,
    date: section.date || "",
    title: section.title || `Section ${index + 1}`,
    type,
    description: section.description || "",
    details: section.details || "",
    notes: Array.isArray(section.notes) ? section.notes : [],
    caption: cleanCaption(section.caption),
    accent: section.accent || "#2b6cb0",
    files: (Array.isArray(section.files) ? section.files : [])
      .map((file, fileIndex) => normalizeFile(file, fileIndex))
      .filter((file) => file.url && !staleDraftTextPattern.test(file.label)),
    photos: hasPhotoUrls(normalizedPhotos) ? normalizedPhotos : staticPhotos
  };
}

function normalizeArticle(article) {
  const sections = Array.isArray(article.sections) ? article.sections : [];
  const normalizedSections = sections.map((section, index) => normalizeSection(section, index));
  let finalSections =
    article.id === "photos-gallery" && !normalizedSections.some((section) => hasPhotoUrls(section.photos))
      ? photosArticle.sections
      : normalizedSections;
  const staticArticle = {
    "phd-timeline": fallbackArticle,
    "hackathons-blog": hackathonsArticle
  }[article.id];
  const articleLinks = Array.isArray(article.links)
    ? article.links
    : staticArticle && Array.isArray(staticArticle.links)
      ? staticArticle.links
      : [];

  if (staticArticle) {
    const sectionMap = new Map(finalSections.map((section) => [section.id, section]));
    finalSections = staticArticle.sections.map((section) => mergeStaticSection(section, sectionMap.get(section.id)));
  }

  return {
    id: article.id || "phd-timeline",
    layout: article.layout === "gallery" ? "gallery" : "timeline",
    locked: Boolean(article.locked || cardPresets[article.id] && cardPresets[article.id].locked),
    navLabel: article.navLabel || cardPresets[article.id] && cardPresets[article.id].title,
    eyebrow: article.eyebrow || "Article",
    title: article.title || "Untitled article",
    intro: article.intro || "",
    links: articleLinks
      .map((link, linkIndex) => normalizeFile(link, linkIndex))
      .filter((link) => link.url && !staleDraftTextPattern.test(link.label)),
    sections: finalSections
  };
}

function sortArticles(articles) {
  const order = ["phd-timeline", "travel-blog", "hackathons-blog", "photos-gallery"];

  return [...articles].sort((left, right) => {
    const leftIndex = order.indexOf(left.id);
    const rightIndex = order.indexOf(right.id);

    if (leftIndex >= 0 || rightIndex >= 0) {
      return (leftIndex >= 0 ? leftIndex : 99) - (rightIndex >= 0 ? rightIndex : 99);
    }

    return left.title.localeCompare(right.title);
  });
}

function mergeStaticArticles(articles) {
  const staticArticles = [fallbackArticle, travelArticle, hackathonsArticle, photosArticle].map((article) =>
    normalizeArticle(article)
  );
  const articleMap = new Map(articles.map((article) => [article.id, article]));

  staticArticles.forEach((article) => {
    if (!articleMap.has(article.id)) {
      articleMap.set(article.id, article);
    }
  });

  return sortArticles(Array.from(articleMap.values()));
}

export default {
  name: "BlogPage",
  data() {
    return {
      articles: [fallbackArticle, travelArticle, hackathonsArticle, photosArticle],
      ambientLines,
      languageOptions,
      language: getStoredBlogLanguage(),
      selectedArticleId: "",
      activeModal: "",
      modalMode: "detail",
      activeSection: null,
      activePhotoIndex: 0,
      previewPhotoTick: 0,
      previewPhotoTimer: null
    };
  },
  computed: {
    copy() {
      return getBlogCopy(this.language);
    },
    localizedArticles() {
      return this.articles.map((article) => localizeArticle(article, this.language));
    },
    blogCards() {
      return this.localizedArticles
        .filter((article) => article.id !== "photos-gallery")
        .map((article) => {
          const preset = getCardPreset(article.id, this.language);

          return {
            id: article.id,
            label: preset.label || article.navLabel || article.title,
            title: preset.title || article.navLabel || article.title,
            description: preset.description || article.intro,
            href: article.locked || preset.locked ? "#top" : this.blogHash(article.id),
            accent: preset.accent || "#2b6cb0",
            side: preset.side || "left",
            rotation: preset.rotation || "-4deg",
            lift: preset.lift || "0px",
            previewImage: preset.previewImage || "",
            stats: preset.stats || [],
            locked: Boolean(article.locked || preset.locked)
          };
        });
    },
    leftHeroCards() {
      return this.blogCards.filter((card) => card.side === "left");
    },
    rightHeroCards() {
      return this.blogCards.filter((card) => card.side !== "left");
    },
    selectedArticle() {
      return this.localizedArticles.find((article) => article.id === this.selectedArticleId) || null;
    },
    modalTitle() {
      return this.activeSection ? this.activeSection.title : "Blog detail";
    },
    activeSectionDetails() {
      if (!this.activeSection || !this.activeSection.details) {
        return [];
      }

      return this.activeSection.details
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);
    },
    activePhoto() {
      if (!this.activeSection || !this.activeSection.photos.length) {
        return { label: "Photo", url: "" };
      }

      return this.activeSection.photos[this.activePhotoIndex] || this.activeSection.photos[0];
    }
  },
  mounted() {
    this.loadBlogContent();
    this.applyHashRoute(false);
    this.startPreviewPhotoRotation();
    window.addEventListener("keydown", this.handleKeydown);
    window.addEventListener("hashchange", this.handleHashChange);
  },
  beforeUnmount() {
    this.stopPreviewPhotoRotation();
    window.removeEventListener("keydown", this.handleKeydown);
    window.removeEventListener("hashchange", this.handleHashChange);
  },
  methods: {
    startPreviewPhotoRotation() {
      this.stopPreviewPhotoRotation();
      this.previewPhotoTimer = window.setInterval(() => {
        this.previewPhotoTick += 1;
      }, 5000);
    },
    stopPreviewPhotoRotation() {
      if (this.previewPhotoTimer) {
        window.clearInterval(this.previewPhotoTimer);
        this.previewPhotoTimer = null;
      }
    },
    previewPhotosForSection(section) {
      if (!section || !section.photos || section.photos.length <= 3) {
        return section && section.photos ? section.photos : [];
      }

      const start = this.previewPhotoTick % section.photos.length;
      return [0, 1, 2].map((offset) => section.photos[(start + offset) % section.photos.length]);
    },
    setLanguage(language) {
      if (!languageOptions.includes(language)) {
        return;
      }

      const activeSectionId = this.activeSection && this.activeSection.id;
      this.language = language;
      window.localStorage.setItem(BLOG_LANGUAGE_STORAGE_KEY, language);

      if (activeSectionId && this.selectedArticle) {
        this.activeSection =
          this.selectedArticle.sections.find((section) => section.id === activeSectionId) ||
          this.activeSection;
      }
    },
    async loadBlogContent() {
      try {
        const response = await fetch(`${getAnalyticsApiBaseUrl()}/api/blog/articles`, {
          cache: "no-store"
        });
        const payload = await response.json();

        if (!response.ok || !Array.isArray(payload.articles) || !payload.articles.length) {
          return;
        }

        this.articles = mergeStaticArticles(payload.articles.map((article) => normalizeArticle(article)));
        this.applyHashRoute(false);
      } catch {
        // The hidden blog keeps its built-in content when the VPS API is offline.
      }
    },
    blogHash(articleId) {
      return `#blog=${encodeURIComponent(articleId)}`;
    },
    sectionHash(sectionId) {
      return `#section=${encodeURIComponent(this.selectedArticleId)}/${encodeURIComponent(sectionId)}`;
    },
    replaceHash(value) {
      window.history.replaceState({}, "", `#${value}`);
    },
    firstPhoto(section) {
      if (!section || !section.photos || !section.photos.length) {
        return { label: section && section.title ? section.title : "Photo", url: "" };
      }

      return section.photos[0];
    },
    galleryCardClass(index) {
      return `gallery-card-${(index % 6) + 1}`;
    },
    clampPhotoIndex(section, photoIndex) {
      if (!section || !section.photos || !section.photos.length) {
        return 0;
      }

      return Math.min(Math.max(0, Number(photoIndex) || 0), section.photos.length - 1);
    },
    selectBlog(articleId, updateHash = true, shouldScroll = true) {
      const article = this.localizedArticles.find((item) => item.id === articleId);
      if (!article || article.locked) {
        return;
      }

      this.selectedArticleId = articleId;
      this.closeModal(false);

      if (updateHash) {
        this.replaceHash(`blog=${encodeURIComponent(articleId)}`);
      }

      if (!shouldScroll) {
        return;
      }

      this.$nextTick(() => {
        if (this.$refs.articleStart) {
          this.$refs.articleStart.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    },
    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    },
    updateModalHash(kind = this.modalMode, section = this.activeSection, photoIndex = this.activePhotoIndex) {
      if (!this.selectedArticleId || !section) {
        return;
      }

      const articleId = encodeURIComponent(this.selectedArticleId);
      const sectionId = encodeURIComponent(section.id);

      if (kind === "gallery") {
        this.replaceHash(`photo=${articleId}/${sectionId}/${this.clampPhotoIndex(section, photoIndex)}`);
      } else {
        this.replaceHash(`detail=${articleId}/${sectionId}`);
      }
    },
    openSection(section, updateHash = true) {
      this.activeSection = section;
      this.activePhotoIndex = 0;
      this.modalMode = "detail";
      this.activeModal = "section";

      if (updateHash) {
        this.updateModalHash("detail", section);
      }
    },
    openGallery(section, photoIndex = 0, updateHash = true) {
      this.activeSection = section;
      this.activePhotoIndex = this.clampPhotoIndex(section, photoIndex);
      this.modalMode = "gallery";
      this.activeModal = "gallery";

      if (updateHash) {
        this.updateModalHash("gallery", section, this.activePhotoIndex);
      }
    },
    closeModal(updateHash = true) {
      this.activeModal = "";
      this.activeSection = null;
      this.activePhotoIndex = 0;

      if (updateHash && this.selectedArticleId) {
        this.replaceHash(`blog=${encodeURIComponent(this.selectedArticleId)}`);
      }
    },
    selectPhoto(photoIndex) {
      if (!this.activeSection || !this.activeSection.photos.length) {
        return;
      }

      this.activePhotoIndex = this.clampPhotoIndex(this.activeSection, photoIndex);
      this.updateModalHash("gallery", this.activeSection, this.activePhotoIndex);
    },
    showPreviousPhoto() {
      if (!this.activeSection || !this.activeSection.photos.length) {
        return;
      }

      const total = this.activeSection.photos.length;
      this.activePhotoIndex = (this.activePhotoIndex - 1 + total) % total;
      this.updateModalHash("gallery", this.activeSection, this.activePhotoIndex);
    },
    showNextPhoto() {
      if (!this.activeSection || !this.activeSection.photos.length) {
        return;
      }

      this.activePhotoIndex = (this.activePhotoIndex + 1) % this.activeSection.photos.length;
      this.updateModalHash("gallery", this.activeSection, this.activePhotoIndex);
    },
    openHashModal(kind, articleId, sectionId, photoIndex = 0) {
      const article = this.localizedArticles.find((item) => item.id === articleId);
      if (!article || article.locked) {
        return;
      }

      const section = article.sections.find((item) => item.id === sectionId);
      if (!section) {
        this.selectedArticleId = article.id;
        return;
      }

      this.selectedArticleId = article.id;
      if (kind === "photo") {
        this.openGallery(section, photoIndex, false);
      } else {
        this.openSection(section, false);
      }
    },
    applyHashRoute(shouldScroll = false) {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash) {
        return;
      }

      const [key, rawValue] = hash.includes("=") ? hash.split("=") : ["blog", hash];
      const value = rawValue || "";

      if (key === "detail" || key === "photo") {
        const [articleId, sectionId, rawPhotoIndex] = value
          .split("/")
          .map((part) => decodeURIComponent(part));
        this.openHashModal(key, articleId, sectionId, Number(rawPhotoIndex) || 0);
        return;
      }

      if (key === "section") {
        const [articleId, sectionId] = value.split("/").map((part) => decodeURIComponent(part));
        const article = this.localizedArticles.find((item) => item.id === articleId);
        if (!article || article.locked) {
          return;
        }

        this.selectBlog(articleId, false, false);
        this.$nextTick(() => this.scrollToSection(sectionId));
        return;
      }

      if (key === "blog") {
        this.selectBlog(decodeURIComponent(value), false, shouldScroll);
      }
    },
    handleHashChange() {
      this.applyHashRoute(false);
    },
    handleKeydown(event) {
      if (!this.activeModal) {
        return;
      }

      if (event.key === "Escape") {
        this.closeModal();
      } else if (this.modalMode === "gallery" && event.key === "ArrowLeft") {
        this.showPreviousPhoto();
      } else if (this.modalMode === "gallery" && event.key === "ArrowRight") {
        this.showNextPhoto();
      }
    }
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap");

.blog-page,
.blog-page * {
  box-sizing: border-box;
}

:global(html) {
  scroll-behavior: smooth;
}

:global(body) {
  background: #f4f8fd;
}

.blog-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  padding: 24px clamp(16px, 4vw, 52px) 72px;
  background:
    radial-gradient(760px 360px at 12% -4%, rgba(168, 209, 255, 0.42), transparent 64%),
    radial-gradient(720px 340px at 88% 4%, rgba(255, 232, 201, 0.42), transparent 62%),
    linear-gradient(145deg, #f4f8fd 0%, #ffffff 48%, #eef6ff 100%);
  color: #0d1b2a;
  font-family: "Plus Jakarta Sans", "Segoe UI", sans-serif;
}

.ambient-motion {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.ambient-network {
  position: absolute;
  inset: -8vh -8vw;
  width: 116vw;
  height: 116vh;
  opacity: 0.72;
  animation: networkFloat 18s ease-in-out infinite alternate;
}

.network-path {
  fill: none;
  stroke: rgba(22, 58, 102, 0.2);
  stroke-dasharray: 18 24;
  stroke-linecap: round;
  stroke-width: 1.6;
  animation: networkDash 16s linear infinite;
}

.path-two {
  stroke: rgba(25, 97, 71, 0.16);
  animation-direction: reverse;
  animation-duration: 20s;
}

.path-three {
  stroke: rgba(141, 47, 86, 0.14);
  animation-duration: 24s;
}

.network-nodes circle {
  fill: #ffffff;
  stroke: rgba(22, 58, 102, 0.34);
  stroke-width: 1.5;
  animation: nodePulse 4.8s ease-in-out infinite alternate;
}

.network-nodes circle:nth-child(2n) {
  animation-delay: 1.2s;
}

.network-nodes circle:nth-child(3n) {
  animation-delay: 2.1s;
}

.ambient-line {
  position: absolute;
  width: min(38vw, 420px);
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(22, 58, 102, 0.16),
    rgba(43, 108, 176, 0.24),
    transparent
  );
  opacity: 0.62;
  transform: rotate(var(--angle));
  animation: driftLine var(--duration) ease-in-out infinite alternate;
}

.ambient-line::before,
.ambient-line::after {
  content: "";
  position: absolute;
  top: -2px;
  width: 5px;
  height: 5px;
  border: 1px solid rgba(22, 58, 102, 0.22);
  background: rgba(255, 255, 255, 0.72);
  transform: rotate(45deg);
}

.ambient-line::before {
  left: 18%;
}

.ambient-line::after {
  right: 12%;
}

.line-one {
  --angle: -18deg;
  --duration: 15s;
  top: 18%;
  left: -8%;
}

.line-two {
  --angle: 24deg;
  --duration: 18s;
  top: 12%;
  right: -10%;
}

.line-three {
  --angle: -11deg;
  --duration: 20s;
  top: 52%;
  left: 6%;
}

.line-four {
  --angle: 16deg;
  --duration: 17s;
  right: 2%;
  bottom: 24%;
}

.line-five {
  --angle: -26deg;
  --duration: 22s;
  left: 24%;
  bottom: 8%;
}

.blog-page::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(18, 53, 95, 0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(18, 53, 95, 0.045) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.52), transparent 72%);
}

.blog-menu,
.blog-hero,
.article-head,
.article-shell,
.photo-gallery,
.timeline {
  position: relative;
  z-index: 1;
}

.blog-menu {
  position: sticky;
  top: 16px;
  z-index: 10;
  width: fit-content;
  max-width: min(100%, 900px);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin: 0 auto;
  padding: 8px;
  border: 1px solid rgba(22, 58, 102, 0.12);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.78);
  box-shadow: 0 16px 42px rgba(15, 23, 42, 0.1);
  backdrop-filter: blur(12px);
}

.blog-mark {
  width: 42px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  border-radius: 999px;
  background: #12355f;
  color: #ffffff;
  font-weight: 900;
  text-decoration: none;
}

.menu-links {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.menu-links a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 999px;
  padding: 10px 13px;
  color: #163a66;
  font-size: 13px;
  font-weight: 800;
  text-decoration: none;
  white-space: nowrap;
}

.menu-links a small {
  color: inherit;
  font-size: 9px;
  font-weight: 900;
  opacity: 0.72;
  text-transform: uppercase;
}

.menu-links a:hover,
.menu-links a:focus-visible,
.menu-links a.active {
  background: #e5f1ff;
  outline: none;
}

.menu-links a.active {
  color: #ffffff;
  background: #12355f;
}

.menu-links a.locked {
  cursor: not-allowed;
  opacity: 0.52;
}

.menu-links a.locked:hover,
.menu-links a.locked:focus-visible {
  background: transparent;
}

.blog-language-switch {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding-left: 6px;
}

.blog-language-switch button {
  min-width: 34px;
  height: 34px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: #31577d;
  cursor: pointer;
  font: inherit;
  font-size: 11px;
  font-weight: 900;
}

.blog-language-switch button:hover,
.blog-language-switch button:focus-visible {
  background: #e5f1ff;
  outline: none;
}

.blog-language-switch button.active {
  background: #12355f;
  color: #ffffff;
  box-shadow: 0 8px 20px rgba(18, 53, 95, 0.18);
}

.blog-hero,
.article-head {
  width: min(980px, 100%);
  margin-inline: auto;
}

.blog-hero {
  width: min(1160px, 100%);
  min-height: 54vh;
  display: grid;
  grid-template-columns: minmax(220px, 0.8fr) minmax(380px, 1.1fr) minmax(220px, 0.8fr);
  gap: clamp(18px, 4vw, 44px);
  align-items: center;
  padding: clamp(64px, 10vw, 120px) 0 clamp(44px, 7vw, 78px);
  text-align: center;
}

.hero-copy {
  display: grid;
  justify-items: center;
}

.hero-polaroids {
  min-height: 360px;
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 22px;
  position: relative;
}

.landing-polaroid {
  position: relative;
  width: min(210px, 100%);
  display: grid;
  gap: 9px;
  border-radius: 6px;
  padding: 10px 10px 18px;
  background: #fffdf8;
  box-shadow: 0 26px 54px rgba(15, 23, 42, 0.16);
  color: #12355f;
  text-align: left;
  text-decoration: none;
  transform: rotate(var(--rotation)) translateY(var(--lift));
  transition: box-shadow 0.2s ease, transform 0.2s ease, opacity 0.2s ease;
}

.landing-polaroid:not(.locked):hover,
.landing-polaroid:not(.locked):focus-visible {
  z-index: 4;
  box-shadow: 0 34px 68px rgba(15, 23, 42, 0.24);
  outline: none;
  transform: rotate(var(--rotation)) translateY(calc(var(--lift) - 8px));
}

.landing-polaroid.locked {
  cursor: not-allowed;
  opacity: 0.62;
}

.landing-polaroid.locked .landing-snapshot {
  filter: grayscale(0.35);
}

.landing-snapshot {
  min-height: 132px;
  display: grid;
  place-items: end start;
  overflow: hidden;
  border-radius: 4px;
  padding: 12px;
  background:
    linear-gradient(180deg, transparent 36%, rgba(13, 27, 42, 0.24)),
    var(--preview-image, linear-gradient(135deg, transparent, transparent)),
    radial-gradient(circle at 78% 18%, rgba(255, 255, 255, 0.78) 0 8px, transparent 9px),
    linear-gradient(135deg, color-mix(in srgb, var(--accent), #ffffff 18%), #eaf4ff 70%),
    repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0 1px, transparent 1px 13px);
  background-position: center;
  background-size: cover;
}

.landing-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.landing-meta span,
.landing-lock {
  width: fit-content;
  border-radius: 999px;
  padding: 5px 8px;
  background: #e5f1ff;
  color: #31577d;
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
}

.landing-lock {
  background: #f1f5f9;
  color: #64748b;
}

.landing-polaroid strong {
  font-size: 18px;
  line-height: 1.12;
}

.landing-polaroid small {
  color: #5a748d;
  font-size: 12px;
  font-weight: 800;
  line-height: 1.45;
}


.eyebrow {
  margin: 0 0 10px;
  color: #2b6cb0;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0;
  text-transform: uppercase;
}

.blog-hero h1,
.article-head h2 {
  margin: 0;
  color: #10233d;
  font-family: "Fraunces", "Times New Roman", serif;
  line-height: 1.02;
}

.blog-hero h1 {
  font-size: clamp(72px, 15vw, 176px);
}

.blog-hero p,
.article-head p,
.timeline-copy p {
  margin: 0;
  color: #3f5c78;
  line-height: 1.72;
}

.blog-hero > p {
  max-width: 670px;
  margin-top: 20px;
  font-size: clamp(16px, 2vw, 19px);
}

.article-head {
  display: grid;
  justify-items: center;
  gap: 12px;
  padding: 18px 0 42px;
  text-align: center;
}

.article-head h2 {
  font-size: clamp(42px, 8vw, 86px);
}

.article-head p {
  max-width: 720px;
}

.article-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.article-actions a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  border: 1px solid rgba(18, 53, 95, 0.14);
  border-radius: 999px;
  padding: 9px 16px;
  background: rgba(255, 255, 255, 0.72);
  color: #12355f;
  font-size: 13px;
  font-weight: 900;
  text-decoration: none;
  box-shadow: 0 12px 28px rgba(18, 53, 95, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.article-actions a:hover,
.article-actions a:focus-visible {
  background: #ffffff;
  box-shadow: 0 18px 34px rgba(18, 53, 95, 0.14);
  outline: none;
  transform: translateY(-2px);
}

.article-shell {
  width: min(980px, 100%);
  margin-inline: auto;
}

.timeline {
  width: 100%;
  position: relative;
  display: grid;
  gap: clamp(70px, 12vw, 130px);
  padding: 16px 0 72px;
}

.article-index {
  position: fixed;
  top: 50%;
  right: clamp(10px, 1.8vw, 28px);
  z-index: 12;
  width: min(215px, 18vw);
  max-height: min(68vh, 620px);
  overflow: auto;
  display: grid;
  justify-items: end;
  gap: 4px;
  margin: 0;
  padding: 0;
  opacity: 0.58;
  text-align: right;
  transform: translateY(-50%);
  transition: opacity 0.2s ease;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.article-index::-webkit-scrollbar {
  display: none;
}

.article-index:hover,
.article-index:focus-within {
  opacity: 0.96;
}

.article-index p {
  margin: 0 0 6px;
  color: #6b7f92;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
}

.article-index a {
  display: grid;
  gap: 2px;
  justify-items: end;
  padding: 3px 0;
  color: #163a66;
  text-decoration: none;
  transition: color 0.2s ease, transform 0.2s ease;
}

.article-index a:hover,
.article-index a:focus-visible {
  color: #0f2b4d;
  outline: none;
  transform: translateX(-3px);
}

.article-index span {
  color: #6f88a0;
  font-size: 10px;
  font-weight: 900;
}

.article-index strong {
  font-size: 12px;
  line-height: 1.28;
}

.photo-gallery {
  width: min(1180px, 100%);
  columns: 4 220px;
  column-gap: 16px;
  margin-inline: auto;
  padding: 18px 0 78px;
}

.gallery-card {
  break-inside: avoid;
  width: 100%;
  display: grid;
  gap: 0;
  overflow: hidden;
  margin: 0 0 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0;
  background: rgba(8, 17, 29, 0.92);
  color: #fff7e8;
  cursor: pointer;
  text-align: left;
  box-shadow: 0 20px 48px rgba(12, 28, 49, 0.18);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.gallery-card:hover,
.gallery-card:focus-visible {
  outline: none;
  transform: translateY(-3px);
  box-shadow: 0 26px 58px rgba(12, 28, 49, 0.28);
}

.gallery-preview {
  position: relative;
  min-height: 220px;
  display: grid;
  place-items: end start;
  overflow: hidden;
  padding: 14px;
  background:
    radial-gradient(circle at 72% 12%, rgba(255, 255, 255, 0.34) 0 11px, transparent 12px),
    linear-gradient(140deg, color-mix(in srgb, var(--accent), #111827 18%), #0d1b2a 72%),
    repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.055) 0 1px, transparent 1px 5px);
}

.gallery-card-2 .gallery-preview,
.gallery-card-5 .gallery-preview {
  min-height: 310px;
}

.gallery-card-3 .gallery-preview {
  min-height: 180px;
}

.gallery-card-4 .gallery-preview,
.gallery-card-6 .gallery-preview {
  min-height: 260px;
}

.gallery-image {
  position: absolute;
  inset: 0;
  background-position: center;
  background-size: cover;
}

.gallery-image::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 42%, rgba(0, 0, 0, 0.52));
}

.gallery-empty-label {
  position: relative;
  z-index: 1;
  border-radius: 999px;
  padding: 8px 11px;
  background: rgba(255, 255, 255, 0.12);
  color: #fff7e8;
  font-size: 12px;
  font-weight: 900;
  backdrop-filter: blur(8px);
}

.gallery-caption {
  display: grid;
  gap: 3px;
  padding: 13px 14px 15px;
  background: linear-gradient(180deg, rgba(9, 17, 29, 0.9), rgba(4, 9, 16, 0.96));
}

.gallery-caption strong {
  color: #fff7e8;
  font-size: 14px;
  line-height: 1.25;
}

.gallery-caption small {
  color: rgba(255, 247, 232, 0.72);
  font-size: 11px;
  font-weight: 900;
}

.timeline::before {
  content: "";
  position: absolute;
  top: 18px;
  bottom: 26px;
  left: 50%;
  width: 1px;
  transform: translateX(-50%);
  background: linear-gradient(180deg, transparent, rgba(22, 58, 102, 0.26), transparent);
}

.timeline-item {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(320px, 1.05fr);
  gap: clamp(32px, 7vw, 86px);
  align-items: center;
}

.timeline-item::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 10px;
  height: 10px;
  border: 6px solid #f9fbff;
  border-radius: 999px;
  background: #12355f;
  box-shadow: 0 0 0 1px rgba(18, 53, 95, 0.16), 0 14px 28px rgba(18, 53, 95, 0.16);
  transform: translate(-50%, -50%);
}

.timeline-item.reverse {
  grid-template-columns: minmax(320px, 1.05fr) minmax(0, 0.95fr);
}

.timeline-item.reverse .timeline-copy {
  order: 2;
}

.timeline-item.no-photos {
  width: min(680px, 100%);
  grid-template-columns: 1fr;
  justify-self: center;
}

.timeline-item.no-photos .timeline-copy {
  order: 0;
  text-align: center;
}

.timeline-item.no-photos .timeline-copy ul {
  justify-items: center;
}

.timeline-item.single-photo {
  grid-template-columns: minmax(0, 0.85fr) minmax(360px, 1.15fr);
}

.timeline-item.single-photo.reverse {
  grid-template-columns: minmax(360px, 1.15fr) minmax(0, 0.85fr);
}

.timeline-copy {
  position: relative;
  z-index: 1;
}

.detail-trigger {
  border-radius: 24px;
  padding: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.detail-trigger:hover,
.detail-trigger:focus-visible {
  background: rgba(255, 255, 255, 0.64);
  box-shadow: 0 18px 38px rgba(15, 23, 42, 0.08);
  outline: none;
  transform: translateY(-2px);
}

.timeline-date {
  display: inline-flex;
  width: fit-content;
  margin-bottom: 12px;
  border-bottom: 2px solid rgba(18, 53, 95, 0.18);
  padding-bottom: 4px;
  color: #2b6cb0;
  font-size: 13px;
  font-weight: 900;
}

.timeline-copy h3 {
  margin: 0 0 12px;
  color: #12355f;
  font-family: "Fraunces", "Times New Roman", serif;
  font-size: clamp(34px, 5vw, 58px);
  line-height: 1.04;
}

.timeline-copy ul {
  display: grid;
  gap: 8px;
  margin: 18px 0 0;
  padding: 0;
  color: #31577d;
  font-size: 14px;
  line-height: 1.55;
  list-style: none;
}

.timeline-copy li {
  position: relative;
  padding-left: 18px;
}

.timeline-copy li::before {
  content: "";
  position: absolute;
  top: 0.72em;
  left: 0;
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: currentColor;
  opacity: 0.38;
}

.file-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.file-preview span {
  border-radius: 999px;
  padding: 7px 10px;
  background: #e5f1ff;
  color: #163a66;
  font-size: 12px;
  font-weight: 900;
}

.photo-cluster {
  position: relative;
  min-height: 390px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(5, 72px);
  margin: 0;
}

.photo-cluster.single {
  min-height: 460px;
  display: block;
}

.polaroid {
  border: 0;
  position: relative;
  z-index: 1;
  padding: 10px 10px 34px;
  border-radius: 5px;
  background: #fffdf8;
  cursor: pointer;
  box-shadow:
    0 22px 46px rgba(15, 23, 42, 0.14),
    inset 0 0 0 1px rgba(13, 27, 42, 0.05);
  transform: rotate(var(--rotation)) translateY(var(--lift));
  transform-origin: center;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.polaroid:hover,
.polaroid:focus-visible {
  z-index: 5;
  box-shadow:
    0 30px 58px rgba(15, 23, 42, 0.2),
    inset 0 0 0 1px rgba(13, 27, 42, 0.05);
  outline: none;
  transform: rotate(var(--rotation)) translateY(calc(var(--lift) - 6px));
}

.polaroid:nth-child(1) {
  grid-column: 1 / 4;
  grid-row: 1 / 4;
}

.polaroid:nth-child(2) {
  z-index: 3;
  grid-column: 3 / 7;
  grid-row: 2 / 6;
}

.polaroid:nth-child(3) {
  z-index: 2;
  grid-column: 1 / 4;
  grid-row: 4 / 6;
}

.photo-cluster.single .polaroid {
  width: 100%;
  height: 100%;
  min-height: 460px;
  padding: 12px 12px 42px;
  transform: rotate(var(--rotation)) translateY(0);
}

.snapshot {
  position: relative;
  height: 100%;
  min-height: 150px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  padding: 12px;
  background:
    radial-gradient(circle at 78% 18%, rgba(255, 255, 255, 0.88) 0 7px, transparent 8px),
    linear-gradient(135deg, color-mix(in srgb, var(--accent), #ffffff 22%), #eaf4ff 66%),
    repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0 1px, transparent 1px 14px);
}

.photo-cluster.single .snapshot {
  min-height: 406px;
}

.snapshot-image {
  position: absolute;
  inset: 0;
  background-position: center;
  background-size: cover;
}

.snapshot-image::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 42%, rgba(13, 27, 42, 0.18));
}

.snapshot span {
  position: relative;
  z-index: 1;
  border-radius: 999px;
  padding: 7px 10px;
  background: rgba(255, 255, 255, 0.82);
  color: #12355f;
  font-size: 11px;
  font-weight: 900;
}

.photo-cluster figcaption {
  position: absolute;
  right: 8px;
  bottom: 0;
  max-width: 260px;
  color: #5a748d;
  font-size: 12px;
  font-weight: 800;
  text-align: right;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  padding: 22px;
  background: rgba(10, 24, 43, 0.34);
  backdrop-filter: blur(10px);
}

.modal-panel {
  position: relative;
  width: min(860px, 100%);
  max-height: min(780px, calc(100vh - 44px));
  overflow: auto;
  border: 1px solid rgba(13, 27, 42, 0.12);
  border-radius: 28px;
  padding: clamp(24px, 4vw, 40px);
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.96), rgba(239, 247, 255, 0.96)),
    radial-gradient(360px 180px at 100% 0%, rgba(255, 232, 201, 0.55), transparent 68%);
  box-shadow: 0 32px 90px rgba(10, 24, 43, 0.28);
}

.modal-close {
  position: sticky;
  top: 0;
  float: right;
  border: 0;
  border-radius: 999px;
  padding: 9px 12px;
  background: #163a66;
  color: #ffffff;
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 900;
}

.modal-panel h2 {
  max-width: 720px;
  margin: 0;
  color: #10233d;
  font-family: "Fraunces", "Times New Roman", serif;
  font-size: clamp(38px, 7vw, 72px);
  line-height: 1.02;
}

.modal-lead,
.detail-body p {
  color: #31577d;
  line-height: 1.72;
}

.modal-lead {
  max-width: 760px;
  margin: 16px 0 0;
  font-size: 17px;
  font-weight: 700;
}

.detail-body {
  display: grid;
  gap: 12px;
  margin-top: 22px;
}

.modal-notes,
.download-list {
  display: grid;
  gap: 10px;
  margin-top: 24px;
  border-top: 1px solid rgba(13, 27, 42, 0.08);
  padding-top: 18px;
}

.modal-notes strong,
.download-list strong {
  color: #12355f;
}

.modal-notes ul {
  display: grid;
  gap: 8px;
  margin: 0;
  padding-left: 18px;
  color: #31577d;
}

.download-list a {
  width: fit-content;
  border-radius: 999px;
  padding: 9px 12px;
  background: #e5f1ff;
  color: #163a66;
  font-size: 13px;
  font-weight: 900;
  text-decoration: none;
}

.download-list a[href="#"] {
  pointer-events: none;
  opacity: 0.58;
}

.slideshow {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 18px;
  align-items: center;
}

.slide-control {
  border: 0;
  border-radius: 999px;
  padding: 12px 14px;
  background: #163a66;
  color: #ffffff;
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 900;
}

.slide-frame {
  min-width: 0;
  margin: 0;
}

.slide-image {
  min-height: min(58vh, 520px);
  display: grid;
  place-items: center;
  border: 12px solid #fffdf8;
  border-bottom-width: 42px;
  border-radius: 8px;
  background:
    linear-gradient(135deg, #dcecff, #fff3df),
    repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.35) 0 1px, transparent 1px 14px);
  background-position: center;
  background-size: cover;
  box-shadow: 0 22px 54px rgba(15, 23, 42, 0.18);
}

.slide-image span {
  border-radius: 999px;
  padding: 9px 12px;
  background: rgba(255, 255, 255, 0.84);
  color: #12355f;
  font-weight: 900;
}

.slide-frame figcaption {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 14px;
  color: #31577d;
  font-size: 13px;
}

.slide-thumbnails {
  display: flex;
  gap: 8px;
  margin-top: 14px;
  overflow-x: auto;
  padding: 2px 2px 8px;
  scrollbar-width: thin;
}

.slide-thumbnails button {
  flex: 0 0 58px;
  height: 44px;
  overflow: hidden;
  border: 2px solid rgba(18, 53, 95, 0.08);
  border-radius: 8px;
  padding: 2px;
  background: rgba(255, 255, 255, 0.78);
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.slide-thumbnails button:hover,
.slide-thumbnails button:focus-visible {
  border-color: rgba(18, 53, 95, 0.32);
  box-shadow: 0 10px 22px rgba(18, 53, 95, 0.14);
  outline: none;
  transform: translateY(-1px);
}

.slide-thumbnails button.active {
  border-color: #163a66;
  box-shadow: 0 0 0 3px rgba(22, 58, 102, 0.13);
}

.slide-thumbnails span {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background-position: center;
  background-size: cover;
}

.slide-thumbnails small {
  display: grid;
  height: 100%;
  place-items: center;
  color: #163a66;
  font-size: 12px;
  font-weight: 900;
}

@keyframes networkDash {
  to {
    stroke-dashoffset: -220;
  }
}

@keyframes networkFloat {
  from {
    transform: translate3d(-12px, -8px, 0) scale(1);
  }

  to {
    transform: translate3d(16px, 10px, 0) scale(1.02);
  }
}

@keyframes nodePulse {
  from {
    opacity: 0.34;
    transform: scale(0.92);
  }

  to {
    opacity: 0.9;
    transform: scale(1.18);
  }
}

@keyframes driftLine {
  from {
    translate: -12px -8px;
  }

  to {
    translate: 16px 12px;
  }
}

@media (max-width: 860px) {
  .blog-page {
    padding-inline: 14px;
  }

  .blog-menu {
    width: calc(100% - 8px);
    justify-content: center;
    border-radius: 24px;
  }

  .menu-links {
    justify-content: center;
  }

  .blog-language-switch {
    padding-left: 0;
  }

  .menu-links a {
    padding: 9px 10px;
    font-size: 12px;
  }

  .blog-hero {
    grid-template-columns: 1fr;
    gap: 26px;
  }

  .hero-copy {
    order: 0;
  }

  .hero-polaroids {
    min-height: 0;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  .left-stack {
    order: 1;
  }

  .right-stack {
    order: 2;
  }

  .landing-polaroid {
    width: 100%;
  }

  .article-shell {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .article-index {
    position: static;
    order: -1;
    max-height: none;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    margin-top: 0;
    border-left: 0;
    border-bottom: 0;
    padding: 0 0 14px;
    opacity: 0.74;
    transform: none;
  }

  .article-index p {
    grid-column: 1 / -1;
  }

  .timeline {
    width: min(620px, 100%);
    gap: 74px;
    margin-inline: auto;
  }

  .photo-gallery {
    columns: 2 190px;
  }

  .timeline::before,
  .timeline-item::before {
    display: none;
  }

  .timeline-item,
  .timeline-item.reverse {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .timeline-item.reverse .timeline-copy {
    order: 0;
  }

  .timeline-item.no-photos {
    width: min(620px, 100%);
  }

  .photo-cluster {
    min-height: 340px;
    grid-template-rows: repeat(5, 62px);
  }

  .photo-cluster.single,
  .photo-cluster.single .polaroid {
    min-height: 360px;
  }

  .photo-cluster.single .snapshot {
    min-height: 306px;
  }

  .ambient-line {
    width: 320px;
    opacity: 0.38;
  }

  .ambient-network {
    opacity: 0.5;
  }

  .slideshow {
    grid-template-columns: 1fr;
  }

  .slide-control {
    width: 100%;
  }
}

@media (max-width: 560px) {
  .blog-page {
    padding-top: 12px;
  }

  .blog-menu {
    align-items: flex-start;
    padding: 7px;
  }

  .blog-mark {
    width: 38px;
    height: 38px;
  }

  .blog-hero {
    min-height: 46vh;
    padding-top: 48px;
  }

  .hero-polaroids {
    grid-template-columns: 1fr;
  }

  .article-index {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .blog-hero h1 {
    font-size: clamp(62px, 24vw, 104px);
  }

  .photo-gallery {
    columns: 1;
  }

  .gallery-preview,
  .gallery-card-2 .gallery-preview,
  .gallery-card-5 .gallery-preview,
  .gallery-card-4 .gallery-preview,
  .gallery-card-6 .gallery-preview {
    min-height: 240px;
  }

  .article-head {
    padding-bottom: 34px;
  }

  .photo-cluster {
    min-height: 310px;
    grid-template-rows: repeat(5, 56px);
  }

  .photo-cluster.single,
  .photo-cluster.single .polaroid {
    min-height: 300px;
  }

  .polaroid {
    padding: 7px 7px 25px;
  }

  .snapshot {
    min-height: 118px;
  }

  .photo-cluster.single .snapshot {
    min-height: 260px;
  }

  .photo-cluster figcaption {
    position: static;
    grid-column: 1 / -1;
    margin-top: 10px;
    text-align: center;
  }

  .modal-backdrop {
    padding: 10px;
  }

  .modal-panel {
    border-radius: 20px;
    padding: 20px;
  }

  .slide-image {
    min-height: 320px;
  }

  .slide-frame figcaption {
    flex-direction: column;
  }
}

@media (max-width: 860px) {
  .blog-page {
    width: 100%;
    overflow-x: hidden;
    padding: 12px 12px 48px;
  }

  .blog-menu {
    position: sticky;
    top: 8px;
    width: min(100%, 640px);
    max-width: none;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 6px;
    padding: 6px;
    border-radius: 20px;
  }

  .blog-mark {
    width: 34px;
    height: 34px;
    font-size: 12px;
  }

  .menu-links {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 4px;
  }

  .menu-links a {
    min-width: 0;
    min-height: 34px;
    justify-content: center;
    overflow: hidden;
    padding: 8px 5px;
    font-size: 11px;
    text-align: center;
    text-overflow: ellipsis;
  }

  .menu-links a span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .menu-links a small {
    display: none;
  }

  .blog-language-switch {
    gap: 2px;
    padding-left: 0;
  }

  .blog-language-switch button {
    min-width: 30px;
    height: 30px;
    font-size: 10px;
  }

  .blog-hero {
    width: min(640px, 100%);
    max-width: 100%;
    min-width: 0;
    min-height: 0;
    gap: 18px;
    padding: 38px 0 34px;
  }

  .hero-copy {
    width: 100%;
    min-width: 0;
  }

  .blog-hero h1 {
    max-width: 100%;
    font-size: clamp(46px, 15vw, 76px);
    line-height: 0.94;
    overflow-wrap: anywhere;
  }

  .blog-hero p {
    width: 100%;
    max-width: min(34rem, 100%);
    font-size: 14px;
    line-height: 1.6;
    overflow-wrap: break-word;
  }

  .hero-polaroids {
    width: 100%;
    min-width: 0;
    max-width: 100%;
    justify-self: stretch;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .left-stack,
  .right-stack {
    min-width: 0;
    max-width: 100%;
    justify-self: stretch;
  }

  .landing-polaroid,
  .landing-polaroid:not(.locked):hover,
  .landing-polaroid:not(.locked):focus-visible {
    width: 100%;
    transform: none;
  }

  .landing-polaroid {
    min-width: 0;
    gap: 8px;
    border-radius: 8px;
    padding: 8px 8px 12px;
    box-shadow: 0 16px 32px rgba(15, 23, 42, 0.12);
  }

  .landing-snapshot {
    min-height: clamp(92px, 25vw, 138px);
  }

  .landing-polaroid strong {
    min-width: 0;
    font-size: 16px;
    overflow-wrap: anywhere;
  }

  .landing-polaroid small {
    min-width: 0;
    font-size: 11px;
    line-height: 1.35;
    overflow-wrap: break-word;
  }

  .landing-meta {
    gap: 4px;
  }

  .landing-meta span,
  .landing-lock {
    padding: 4px 6px;
    font-size: 9px;
  }

  .article-head {
    width: min(640px, 100%);
    padding: 20px 0 22px;
    text-align: left;
  }

  .article-head h2 {
    font-size: clamp(34px, 10vw, 58px);
  }

  .article-head p {
    max-width: none;
    font-size: 14px;
  }

  .article-index {
    position: relative;
    width: min(640px, 100%);
    max-height: none;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    justify-items: stretch;
    gap: 6px;
    margin: 0 auto 24px;
    padding: 0;
    opacity: 1;
    text-align: left;
    transform: none;
  }

  .article-index p {
    margin-bottom: 2px;
    text-align: center;
  }

  .article-index a {
    justify-items: start;
    border: 1px solid rgba(18, 53, 95, 0.08);
    border-radius: 14px;
    padding: 8px 9px;
    background: rgba(255, 255, 255, 0.68);
  }

  .article-index a:hover,
  .article-index a:focus-visible {
    transform: none;
  }

  .article-index strong {
    font-size: 11px;
  }

  .timeline {
    width: min(640px, 100%);
    gap: 46px;
    padding: 4px 0 48px;
  }

  .timeline-item,
  .timeline-item.reverse,
  .timeline-item.single-photo,
  .timeline-item.single-photo.reverse {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .timeline-copy h3 {
    font-size: clamp(28px, 9vw, 42px);
  }

  .timeline-copy p {
    font-size: 14px;
    line-height: 1.62;
  }

  .detail-trigger {
    border-radius: 18px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.5);
  }

  .timeline-copy ul {
    gap: 6px;
    margin-top: 12px;
    font-size: 13px;
  }

  .timeline-item.no-photos,
  .timeline-item.no-photos .timeline-copy {
    width: 100%;
    text-align: left;
  }

  .timeline-item.no-photos .timeline-copy ul {
    justify-items: stretch;
  }

  .photo-cluster {
    min-height: 0;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: none;
    gap: 12px;
  }

  .polaroid,
  .polaroid:nth-child(1),
  .polaroid:nth-child(2),
  .polaroid:nth-child(3) {
    grid-column: auto;
    grid-row: auto;
    min-width: 0;
    transform: none;
  }

  .polaroid {
    padding: 8px 8px 26px;
  }

  .polaroid:hover,
  .polaroid:focus-visible {
    transform: translateY(-2px);
  }

  .snapshot {
    min-height: 0;
    aspect-ratio: 4 / 3;
    padding: 8px;
  }

  .photo-cluster.single {
    min-height: 0;
    display: block;
  }

  .photo-cluster.single .polaroid {
    min-height: 0;
    padding: 9px 9px 30px;
  }

  .photo-cluster.single .snapshot {
    min-height: 0;
    aspect-ratio: 4 / 3;
  }

  .photo-cluster figcaption {
    position: static;
    grid-column: 1 / -1;
    max-width: none;
    margin-top: 0;
    text-align: left;
  }

  .photo-gallery {
    width: min(640px, 100%);
    columns: 2 180px;
    column-gap: 10px;
    padding: 8px 0 44px;
  }

  .gallery-card {
    margin-bottom: 10px;
    border-radius: 10px;
  }

  .gallery-preview,
  .gallery-card-2 .gallery-preview,
  .gallery-card-5 .gallery-preview,
  .gallery-card-3 .gallery-preview,
  .gallery-card-4 .gallery-preview,
  .gallery-card-6 .gallery-preview {
    min-height: 190px;
  }

  .modal-backdrop {
    align-items: start;
    padding: 10px;
  }

  .modal-panel {
    width: 100%;
    max-height: calc(100dvh - 20px);
    border-radius: 20px;
    padding: 18px;
  }

  .modal-panel h2 {
    font-size: clamp(32px, 11vw, 48px);
  }

  .modal-lead {
    font-size: 15px;
  }

  .slideshow {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .slide-image {
    min-height: min(54vh, 430px);
    border-width: 8px;
    border-bottom-width: 34px;
  }
}

@media (max-width: 560px) {
  .blog-page {
    padding: 10px 10px 42px;
  }

  .blog-menu {
    position: sticky;
    top: 6px;
    grid-template-columns: 1fr;
    gap: 6px;
    width: 100%;
    border-radius: 18px;
  }

  .blog-mark {
    display: none;
  }

  .menu-links {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .menu-links a {
    min-height: 32px;
    padding: 7px 3px;
    font-size: 10px;
  }

  .blog-language-switch {
    justify-self: center;
  }

  .blog-language-switch button {
    min-width: 38px;
    height: 28px;
  }

  .blog-hero {
    padding: 26px 0 28px;
  }

  .blog-hero h1 {
    font-size: clamp(34px, 11vw, 44px);
  }

  .blog-hero p {
    width: min(285px, 100%);
    justify-self: center;
    max-width: min(285px, 100%);
    font-size: 13px;
  }

  .article-head h2 {
    width: min(320px, 100%);
    max-width: 100%;
    justify-self: center;
    font-size: clamp(30px, 9vw, 36px);
    overflow-wrap: anywhere;
  }

  .article-head p {
    max-width: min(330px, 100%);
    margin-inline: auto;
  }

  .hero-polaroids {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .landing-snapshot {
    min-height: 118px;
  }

  .landing-polaroid {
    padding: 7px 7px 11px;
  }

  .landing-polaroid strong {
    font-size: 15px;
  }

  .landing-polaroid small {
    font-size: 10px;
  }

  .landing-meta {
    display: none;
  }

  .article-index {
    max-height: 226px;
    overflow-y: auto;
    grid-template-columns: 1fr;
    border: 1px solid rgba(18, 53, 95, 0.08);
    border-radius: 16px;
    padding: 8px;
    background: rgba(255, 255, 255, 0.52);
  }

  .article-index p {
    position: sticky;
    top: 0;
    z-index: 1;
    padding: 2px 0 6px;
    background: rgba(249, 252, 255, 0.92);
  }

  .timeline {
    gap: 38px;
  }

  .detail-trigger {
    padding: 10px;
  }

  .timeline-copy h3 {
    font-size: clamp(27px, 10vw, 38px);
  }

  .photo-cluster {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .polaroid {
    padding-bottom: 24px;
  }

  .snapshot,
  .photo-cluster.single .snapshot {
    aspect-ratio: 4 / 3;
  }

  .photo-gallery {
    columns: 1;
  }

  .gallery-preview,
  .gallery-card-2 .gallery-preview,
  .gallery-card-5 .gallery-preview,
  .gallery-card-3 .gallery-preview,
  .gallery-card-4 .gallery-preview,
  .gallery-card-6 .gallery-preview {
    min-height: 220px;
  }

  .modal-backdrop {
    padding: 8px;
  }

  .modal-panel {
    border-radius: 18px;
    padding: 16px;
  }

  .modal-close {
    padding: 8px 10px;
  }

  .slide-control {
    min-height: 40px;
  }

  .slide-image {
    min-height: min(50vh, 360px);
  }
}

@media (max-width: 560px) {
  .blog-menu,
  .blog-hero,
  .article-head,
  .article-index,
  .article-shell,
  .timeline,
  .photo-gallery {
    width: calc(100vw - 48px) !important;
    max-width: calc(100vw - 48px) !important;
    margin-right: auto;
    margin-left: auto;
  }

  .blog-hero,
  .hero-copy,
  .hero-polaroids,
  .left-stack,
  .right-stack {
    min-width: 0 !important;
    overflow: hidden;
  }

  .hero-polaroids,
  .left-stack,
  .right-stack {
    width: 100% !important;
    max-width: 100% !important;
  }

  .hero-copy p {
    width: min(250px, 100%) !important;
    max-width: min(250px, 100%) !important;
    justify-self: center;
    text-align: center;
  }

  .blog-hero h1 {
    width: min(300px, 100%) !important;
    max-width: min(300px, 100%) !important;
    justify-self: center;
    font-size: clamp(32px, 10vw, 40px) !important;
  }
}
</style>
