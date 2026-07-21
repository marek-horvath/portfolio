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

    <nav class="blog-menu" aria-label="Blog navigation">
      <a class="blog-mark" href="#top" aria-label="Blog top">MH</a>
      <div class="menu-links">
        <a
          v-for="articleItem in articles"
          :key="articleItem.id"
          :href="blogHash(articleItem.id)"
          :class="{ active: articleItem.id === selectedArticleId }"
          :aria-current="articleItem.id === selectedArticleId ? 'page' : null"
          @click.prevent="selectBlog(articleItem.id)"
        >
          {{ articleItem.navLabel || articleItem.title }}
        </a>
      </div>
    </nav>

    <section id="top" class="blog-hero">
      <div class="hero-polaroids left-stack">
        <a
          v-for="card in leftHeroCards"
          :key="card.id"
          :href="card.href"
          class="landing-polaroid"
          :style="{ '--accent': card.accent, '--rotation': card.rotation, '--lift': card.lift }"
          @click.prevent="selectBlog(card.id)"
        >
          <span class="landing-snapshot">
            <span>{{ card.label }}</span>
          </span>
          <strong>{{ card.title }}</strong>
          <small>{{ card.description }}</small>
        </a>
      </div>

      <div class="hero-copy">
        <p class="eyebrow">Private draft space</p>
        <h1>Marek Blog</h1>
        <p>
          Longer notes from PhD life, conferences, travel, and side trips. Pick a polaroid to open
          one blog stream; the articles stay hidden until you choose one.
        </p>
      </div>

      <div class="hero-polaroids right-stack">
        <a
          v-for="card in rightHeroCards"
          :key="card.id"
          :href="card.href"
          class="landing-polaroid"
          :style="{ '--accent': card.accent, '--rotation': card.rotation, '--lift': card.lift }"
          @click.prevent="selectBlog(card.id)"
        >
          <span class="landing-snapshot">
            <span>{{ card.label }}</span>
          </span>
          <strong>{{ card.title }}</strong>
          <small>{{ card.description }}</small>
        </a>
      </div>
    </section>

    <template v-if="selectedArticle">
      <section :id="selectedArticle.id" ref="articleStart" class="article-head">
        <p class="eyebrow">{{ selectedArticle.eyebrow }}</p>
        <h2>{{ selectedArticle.title }}</h2>
        <p>{{ selectedArticle.intro }}</p>
      </section>

      <aside
        v-if="selectedArticle.layout !== 'gallery'"
        class="article-index"
        aria-label="Article quick links"
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
            :aria-label="`Open gallery photo ${item.title}`"
            @click="openGallery(item, 0)"
          >
            <span class="gallery-preview">
              <span
                v-if="firstPhoto(item).url"
                class="gallery-image"
                :style="{ backgroundImage: `url(${firstPhoto(item).url})` }"
              ></span>
              <span class="gallery-placeholder">{{ firstPhoto(item).label || item.title }}</span>
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
              :class="['timeline-item', { reverse: index % 2 === 1 }]"
            >
              <div
                class="timeline-copy detail-trigger"
                role="button"
                tabindex="0"
                :aria-label="`Open detail for ${item.title}`"
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

              <figure class="photo-cluster" :style="{ '--accent': item.accent }">
                <button
                  v-for="photo in item.photos"
                  :key="photo.label"
                  type="button"
                  class="polaroid"
                  :style="{ '--rotation': photo.rotation, '--lift': photo.lift }"
                  :aria-label="`Open photos for ${item.title}`"
                  @click.stop="openGallery(item, item.photos.indexOf(photo))"
                >
                  <div class="snapshot">
                    <div
                      v-if="photo.url"
                      class="snapshot-image"
                      :style="{ backgroundImage: `url(${photo.url})` }"
                    ></div>
                    <span>{{ photo.label }}</span>
                  </div>
                </button>
                <figcaption>{{ item.caption }}</figcaption>
              </figure>
            </article>
          </section>
        </template>
      </div>
    </template>

    <div v-if="activeModal" class="modal-backdrop" @click.self="closeModal">
      <section class="modal-panel" role="dialog" aria-modal="true" :aria-label="modalTitle">
        <button type="button" class="modal-close" aria-label="Close" @click="closeModal">
          Close
        </button>

        <template v-if="modalMode === 'detail'">
          <p class="eyebrow">{{ activeSection.date }}</p>
          <h2>{{ activeSection.title }}</h2>
          <p class="modal-lead">{{ activeSection.description }}</p>
          <div class="detail-body">
            <p v-for="paragraph in activeSectionDetails" :key="paragraph">{{ paragraph }}</p>
          </div>

          <div v-if="activeSection.notes.length" class="modal-notes">
            <strong>Notes</strong>
            <ul>
              <li v-for="note in activeSection.notes" :key="note">{{ note }}</li>
            </ul>
          </div>

          <div v-if="activeSection.files.length" class="download-list">
            <strong>Files</strong>
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
            <button type="button" class="slide-control" aria-label="Previous photo" @click="showPreviousPhoto">
              Prev
            </button>
            <figure class="slide-frame">
              <div class="slide-image" :style="activePhoto.url ? { backgroundImage: `url(${activePhoto.url})` } : null">
                <span v-if="!activePhoto.url">{{ activePhoto.label }}</span>
              </div>
              <figcaption>
                <strong>{{ activeSection.title }}</strong>
                <span>{{ activePhoto.label }} - {{ activePhotoIndex + 1 }} / {{ activeSection.photos.length }}</span>
              </figcaption>
            </figure>
            <button type="button" class="slide-control" aria-label="Next photo" @click="showNextPhoto">
              Next
            </button>
          </div>
        </template>
      </section>
    </div>
  </main>
</template>

<script>
import { getAnalyticsApiBaseUrl } from "../utils/analytics";

const timelineDrafts = [
  {
    id: "iceta-2023",
    date: "2023",
    title: "ICETA 2023",
    type: "Conference",
    description:
      "Early PhD conference stop and a useful first anchor for the whole timeline.",
    details:
      "This can become the opening chapter of the PhD story. For now it works as a placeholder for the first ICETA notes, the paper context, what the topic looked like at the beginning, and what felt new at the event.\n\nGood place to add the exact city, paper title, presentation memory, people met, and one short reflection on how the research direction started.",
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
    title: "Mobility Olomouc",
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
    title: "Minimovka defense",
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
    id: "ulysseus-curate-germany",
    date: "2025",
    title: "Ulysseus Curate Germany",
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
    title: "Greece mobility",
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
    id: "sami-2026",
    date: "2026",
    title: "SAMI 2026",
    type: "Conference",
    description:
      "Future/late PhD conference stop for the next iteration of the research story.",
    details:
      "This is currently a planning placeholder. Later it can include the accepted topic, travel notes, paper link, and how it fits into the final dissertation arc.",
    notes: ["Add accepted paper if available.", "Add travel plan.", "Attach presentation later."]
  },
  {
    id: "slovinsko-mobility",
    date: "2026",
    title: "Slovinsko mobility",
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
      "Programming education conference placeholder for the 2026 research output.",
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
      "Late timeline conference placeholder, useful as a closing or near-closing chapter.",
    details:
      "This can work as the final conference block for now. Add the accepted contribution, trip notes, and a short reflection on where the PhD work stands at that point.",
    notes: ["Add contribution title.", "Add final photos.", "Attach slides or paper link."]
  }
];

const accents = ["#2b6cb0", "#196147", "#9a5a08", "#8d2f56", "#5d4aa1", "#0f766e"];

function createTimelineSection(item, index) {
  const photoLabels = item.type === "Mobility" ? ["Place", "Work", "Travel"] : ["Venue", "Slides", "Notes"];

  return {
    ...item,
    caption: `${item.title} photo placeholders.`,
    accent: accents[index % accents.length],
    files: [
      {
        label: "Presentation placeholder",
        url: "",
        type: "presentation"
      }
    ],
    photos: photoLabels.map((label, photoIndex) => ({
      label,
      rotation: ["-7deg", "4deg", "-2deg"][photoIndex],
      lift: ["10px", "-8px", "18px"][photoIndex],
      url: ""
    }))
  };
}

const fallbackArticle = {
  id: "phd-timeline",
  status: "draft",
  layout: "timeline",
  navLabel: "PhD",
  eyebrow: "First article draft",
  title: "PhD Timeline",
  intro:
    "A scrollable PhD timeline from first conference checkpoints through mobilities, doctoral events, and later-stage research milestones. The order is drafted from memory and ready for exact dates, photos, presentations, and longer notes.",
  sections: timelineDrafts.map(createTimelineSection)
};

const travelArticle = {
  id: "travel-blog",
  status: "draft",
  layout: "timeline",
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
      caption: "Festival, city, and night placeholders.",
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
        "Roadtrip draft for routes, mountain roads, stops, food, photos, and practical notes from Romania.",
      details:
        "This section should work like a travel diary. Add the route, number of days, cities or nature stops, what surprised you, and what you would do differently next time.\n\nPhoto-wise this can be one of the strongest parts of the blog: roads, viewpoints, streets, car moments, and small details from the trip.",
      notes: ["Add route and dates.", "Add road and city photos.", "Write practical notes for future trips."],
      caption: "Road, mountains, and city placeholders.",
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

const photoGalleryDrafts = [
  ["conference-lights", "Conference", "Conference Lights", "#2b6cb0"],
  ["roadtrip-window", "Travel", "Roadtrip Window", "#0f766e"],
  ["city-after-dark", "City", "City After Dark", "#8d2f56"],
  ["stage-memory", "Festival", "Stage Memory", "#c2410c"],
  ["research-desk", "Work", "Research Desk", "#5d4aa1"],
  ["train-notes", "Travel", "Train Notes", "#196147"],
  ["mountain-stop", "Roadtrip", "Mountain Stop", "#9a5a08"],
  ["old-town-walk", "City", "Old Town Walk", "#2f6f73"],
  ["greek-light", "Mobility", "Greek Light", "#d97706"],
  ["germany-streets", "Mobility", "Germany Streets", "#334155"],
  ["quiet-morning", "Everyday", "Quiet Morning", "#7c3aed"],
  ["after-talk", "Conference", "After Talk", "#be123c"]
];

function createPhotoGallerySection([id, date, title, accent], index) {
  return {
    id,
    date,
    title,
    type: "Photo",
    description: `${title} placeholder for the personal photo gallery.`,
    details:
      `Short draft note for ${title}. Replace this with the real story behind the photo, where it was taken, and why it belongs in the gallery.\n\nThis item is intentionally lightweight: one image can open directly into the slideshow, and more photos can be attached later from the admin.`,
    notes: [],
    caption: title,
    accent,
    files: [],
    photos: [
      {
        label: title,
        rotation: ["-3deg", "2deg", "-1deg", "4deg"][index % 4],
        lift: ["0px", "-4px", "6px", "-2px"][index % 4],
        url: ""
      }
    ]
  };
}

const photosArticle = {
  id: "photos-gallery",
  status: "draft",
  layout: "gallery",
  navLabel: "Photos",
  eyebrow: "Personal gallery",
  title: "Photos",
  intro:
    "A visual gallery for favourite photos from conferences, travels, cities, and small everyday moments. Placeholder cards are ready for real uploads.",
  sections: photoGalleryDrafts.map(createPhotoGallerySection)
};

const cardPresets = {
  "phd-timeline": {
    label: "PhD",
    title: "PhD",
    description: "Conferences, mobilities, dissertation milestones.",
    accent: "#2b6cb0",
    side: "left",
    rotation: "-7deg",
    lift: "6px"
  },
  "travel-blog": {
    label: "Travel",
    title: "Travel",
    description: "Festivals, roadtrips, cities, and small notes.",
    accent: "#c2410c",
    side: "right",
    rotation: "6deg",
    lift: "-10px"
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

const ambientLines = [
  { className: "line-one" },
  { className: "line-two" },
  { className: "line-three" },
  { className: "line-four" },
  { className: "line-five" }
];

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
  return {
    id: section.id || `section-${index + 1}`,
    date: section.date || "",
    title: section.title || `Section ${index + 1}`,
    type: section.type || "",
    description: section.description || "",
    details: section.details || "",
    notes: Array.isArray(section.notes) ? section.notes : [],
    caption: section.caption || "",
    accent: section.accent || "#2b6cb0",
    files: (Array.isArray(section.files) ? section.files : [])
      .map((file, fileIndex) => normalizeFile(file, fileIndex))
      .filter((file) => file.label || file.url),
    photos: (Array.isArray(section.photos) ? section.photos : [])
      .slice(0, 6)
      .map((photo, photoIndex) => normalizePhoto(photo, photoIndex))
  };
}

function normalizeArticle(article) {
  const sections = Array.isArray(article.sections) ? article.sections : [];

  return {
    id: article.id || "phd-timeline",
    layout: article.layout === "gallery" ? "gallery" : "timeline",
    navLabel: article.navLabel || cardPresets[article.id] && cardPresets[article.id].title,
    eyebrow: article.eyebrow || "Article draft",
    title: article.title || "Untitled article",
    intro: article.intro || "",
    sections: sections.map((section, index) => normalizeSection(section, index))
  };
}

function sortArticles(articles) {
  const order = ["phd-timeline", "travel-blog", "photos-gallery"];

  return [...articles].sort((left, right) => {
    const leftIndex = order.indexOf(left.id);
    const rightIndex = order.indexOf(right.id);

    if (leftIndex >= 0 || rightIndex >= 0) {
      return (leftIndex >= 0 ? leftIndex : 99) - (rightIndex >= 0 ? rightIndex : 99);
    }

    return left.title.localeCompare(right.title);
  });
}

export default {
  name: "BlogPage",
  data() {
    return {
      articles: [fallbackArticle, travelArticle, photosArticle],
      ambientLines,
      selectedArticleId: "",
      activeModal: "",
      modalMode: "detail",
      activeSection: null,
      activePhotoIndex: 0
    };
  },
  computed: {
    blogCards() {
      return this.articles
        .filter((article) => article.id !== "photos-gallery")
        .map((article) => {
          const preset = cardPresets[article.id] || {};

          return {
            id: article.id,
            label: preset.label || article.navLabel || article.title,
            title: preset.title || article.navLabel || article.title,
            description: preset.description || article.intro,
            href: this.blogHash(article.id),
            accent: preset.accent || "#2b6cb0",
            side: preset.side || "left",
            rotation: preset.rotation || "-4deg",
            lift: preset.lift || "0px"
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
      return this.articles.find((article) => article.id === this.selectedArticleId) || null;
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
    window.addEventListener("keydown", this.handleKeydown);
    window.addEventListener("hashchange", this.handleHashChange);
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.handleKeydown);
    window.removeEventListener("hashchange", this.handleHashChange);
  },
  methods: {
    async loadBlogContent() {
      try {
        const response = await fetch(`${getAnalyticsApiBaseUrl()}/api/blog/articles`, {
          cache: "no-store"
        });
        const payload = await response.json();

        if (!response.ok || !Array.isArray(payload.articles) || !payload.articles.length) {
          return;
        }

        this.articles = sortArticles(payload.articles.map((article) => normalizeArticle(article)));
        this.applyHashRoute(false);
      } catch {
        // The hidden blog keeps its built-in draft when the VPS API is offline.
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
      if (!this.articles.some((article) => article.id === articleId)) {
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
      const article = this.articles.find((item) => item.id === articleId);
      if (!article) {
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
  border-radius: 999px;
  padding: 10px 13px;
  color: #163a66;
  font-size: 13px;
  font-weight: 800;
  text-decoration: none;
  white-space: nowrap;
}

.menu-links a:hover,
.menu-links a:focus-visible,
.menu-links a.active,
.draft-link:hover,
.draft-link:focus-visible {
  background: #e5f1ff;
  outline: none;
}

.menu-links a.active {
  color: #ffffff;
  background: #12355f;
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

.landing-polaroid:hover,
.landing-polaroid:focus-visible {
  z-index: 4;
  box-shadow: 0 34px 68px rgba(15, 23, 42, 0.24);
  outline: none;
  transform: rotate(var(--rotation)) translateY(calc(var(--lift) - 8px));
}

.landing-snapshot {
  min-height: 132px;
  display: grid;
  place-items: end start;
  overflow: hidden;
  border-radius: 4px;
  padding: 12px;
  background:
    radial-gradient(circle at 78% 18%, rgba(255, 255, 255, 0.78) 0 8px, transparent 9px),
    linear-gradient(135deg, color-mix(in srgb, var(--accent), #ffffff 18%), #eaf4ff 70%),
    repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0 1px, transparent 1px 13px);
}

.landing-snapshot > span {
  border-radius: 999px;
  padding: 8px 11px;
  background: rgba(255, 255, 255, 0.84);
  color: #12355f;
  font-size: 12px;
  font-weight: 900;
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

.gallery-placeholder {
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

  .photo-cluster {
    min-height: 340px;
    grid-template-rows: repeat(5, 62px);
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

  .polaroid {
    padding: 7px 7px 25px;
  }

  .snapshot {
    min-height: 118px;
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
</style>
