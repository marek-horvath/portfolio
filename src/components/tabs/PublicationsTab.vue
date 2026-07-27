<template>
  <div class="publications-tab">
    <div class="publications-header">
      <a
        class="citation-chip"
        :href="localizedScholarUrl"
        target="_blank"
        rel="noopener"
        :title="scholarMetricsTitle"
        :aria-label="scholarMetricsTitle"
        @click="trackScholarClick"
      >
        <span class="citation-count">{{ scholarCitationsLabel }}</span>
        <span>{{ copy.citationsLabel }}</span>
      </a>
    </div>

    <div class="pub-sections">
      <section
        v-for="section in localizedPublicationSections"
        :key="section.title"
        class="pub-section"
      >
        <h3 class="pub-section-title">{{ section.title }}</h3>
        <div class="scrollable-content">
          <article
            v-for="publication in section.items"
            :key="`${section.title}-${publication.title}`"
            class="pub-block pub-card"
          >
            <h3>{{ publication.title }}</h3>
            <p>
              <strong>{{ publication.authors.length === 1 ? copy.authorLabel : copy.authorsLabel }}:</strong>
              {{ publication.authors.join(", ") }}
              <template v-if="publication.venue">
                <br />
                <strong>{{ section.venueLabel }}:</strong> {{ publication.venue }}
              </template>
              <template v-if="publication.doi">
                <br />
                <strong>DOI:</strong>
                <a :href="publication.doi" target="_blank" rel="noopener">
                  {{ publication.doi }}
                </a>
              </template>
              <template v-if="publication.url && publication.url !== publication.doi">
                <br />
                <strong>URL:</strong>
                <a :href="publication.url" target="_blank" rel="noopener">
                  {{ publication.urlLabel || publication.url }}
                </a>
              </template>
              <template v-if="publication.isbn">
                <br />
                <strong>ISBN:</strong> {{ publication.isbn }}
              </template>
              <template v-if="publication.issn">
                <br />
                <strong>ISSN:</strong> {{ publication.issn }}
              </template>
              <template v-if="publication.status">
                <br />
                <strong>{{ copy.statusLabel }}:</strong> {{ localizedStatus(publication.status) }}
              </template>
            </p>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { trackClick } from "../../utils/analytics";

const publicationSections = [
  {
    title: "Scopus-Indexed Conferences",
    venueLabel: "Conference",
    items: [
      {
        title: "Green Computing through Evaluation of Source Code Energy Consumption Using Static and Dynamic Methods",
        authors: ["Marek Horváth", "Matej Džamba", "Emília Pietriková"],
        venue: "INES 2026 (30th Jubilee International Conference on Intelligent Engineering Systems)"
      },
      {
        title: "Commit Classification for Developer Style Profiling Using Transformer Models and Quantitative Change Metrics",
        authors: ["Daniel Oľšavský", "Marek Horváth", "Emília Pietriková"],
        venue: "INES 2026 (30th Jubilee International Conference on Intelligent Engineering Systems)"
      },
      {
        title: "AST-Based Source Code Similarity Visualization Using Clustering and Anomaly Detection",
        authors: ["Peter Svoboda", "Marek Horváth", "Emília Pietriková"],
        venue: "INES 2026 (30th Jubilee International Conference on Intelligent Engineering Systems)"
      },
      {
        title: "Identifying Student Programming Styles Using Static Code and Behavioral Repository Data",
        authors: ["Kristína Mašlanková", "Marek Horváth", "Emília Pietriková"],
        venue: "INES 2026 (30th Jubilee International Conference on Intelligent Engineering Systems)"
      },
      {
        title: "An Experimental Comparison of Three Code Similarity Tools on Over 1,000 Student Projects",
        authors: ["Marek Horváth", "Emília Pietriková"],
        venue: "SAMI 2024 (IEEE 22nd World Symposium on Applied Machine Intelligence and Informatics)",
        doi: "http://dx.doi.org/10.1109/sami60510.2024.10432863",
        isbn: "979-8-3503-1720-6"
      },
      {
        title: "Exploring GPT-Generated Variations in C Programming Assignments",
        authors: ["Marek Horváth", "Lenka Bubeňková", "Emília Pietriková"],
        venue: "SAMI 2025 (IEEE 23rd World Symposium on Applied Machine Intelligence and Informatics)",
        doi: "https://doi.org/10.1109/sami63904.2025.10883288",
        isbn: "979-8-3503-7936-5"
      },
      {
        title: "Code Reuse and Good Clones in Programming Education",
        authors: ["Lenka Bubeňková", "Emília Pietriková", "Marek Horváth"],
        venue: "SAMI 2025 (IEEE 23rd World Symposium on Applied Machine Intelligence and Informatics)",
        doi: "https://doi.org/10.1109/sami63904.2025.10883291",
        isbn: "979-8-3503-7936-5"
      },
      {
        title: "Simplifying Education of Reactive Programming Concepts Using Comparative Application",
        authors: ["Tomáš Kormaník", "Marek Horváth", "Lenka Bubeňková"],
        venue: "SAMI 2025 (IEEE 23rd World Symposium on Applied Machine Intelligence and Informatics)",
        doi: "https://doi.org/10.1109/SAMI63904.2025.10883129",
        isbn: "979-8-3503-7936-5"
      },
      {
        title: "Development of a MATLAB Application for Simulating the SEIQRD Pandemic Spread Model",
        authors: ["Nikola Geciová", "Lukáš Tomaščík", "Marek Horváth"],
        venue: "SAMI 2025 (IEEE 23rd World Symposium on Applied Machine Intelligence and Informatics)",
        doi: "https://doi.org/10.1109/sami63904.2025.10883239",
        isbn: "979-8-3503-7936-5"
      },
      {
        title: "Detection of Programming Style Consistency and Plagiarism through Code Similarity Metrics",
        authors: ["Marek Horváth", "Matúš Motyka", "Emília Pietriková"],
        venue: "SAMI 2026 (IEEE World Symposium on Applied Machine Intelligence and Informatics)",
        doi: "https://doi.org/10.1109/SAMI68106.2026.11420357"
      },
      {
        title: "Bridging Game Development and Virtual Reality Education through Blender-Based Tutorials",
        authors: ["Lenka Bubeňková", "Ľubomír Urbančík", "Emília Pietriková", "Marek Horváth"],
        venue: "ICPEC 2026 (7th International Computer Programming Education Conference)"
      },
      {
        title: "From Repositories to Practice: LLM-Based Personalization in Programming Education",
        authors: ["Marek Horváth", "Michaela Ďurkovičová", "Lenka Bubeňková", "Emília Pietriková"],
        venue: "ICPEC 2026 (7th International Computer Programming Education Conference)"
      },
      {
        title: "Adaptation of Automated Assessment System for Large Programming Courses",
        authors: ["Marek Horváth", "Tomáš Kormaník", "Jaroslav Porubän"],
        venue: "ICPEC 2024 (5th International Computer Programming Education Conference)",
        doi: "https://doi.org/10.4230/OASIcs.ICPEC.2024.4",
        isbn: "978-3-95977-347-8"
      },
      {
        title: "Using ChatGPT During Implementation of Programs in Education",
        authors: ["Norbert Baláž", "Jaroslav Porubän", "Marek Horváth", "Tomáš Kormaník"],
        venue: "ICPEC 2024 (5th International Computer Programming Education Conference)",
        doi: "https://doi.org/10.4230/OASIcs.ICPEC.2024.18",
        isbn: "978-3-95977-347-8"
      },
      {
        title: "Comparison of Scalability and Performance in Microservices and Monolithic Architectures",
        authors: ["Marek Horváth", "Vladyslav Sakhnenko", "Filip Gurbáľ"],
        venue: "Informatics 2024 (IEEE 17th International Scientific Conference on Informatics)",
        doi: "https://doi.org/10.1109/Informatics62280.2024.10900892"
      },
      {
        title: "Environment for Simulation, Generation and Aggregation of Large Heterogeneous Video Conference Data Streams with Optimized Data Collection, Network Analysis and Visualization",
        authors: ["F. Jakab", "R. Vápeník", "D. Cymbalák", "M. Korének", "M. Čabin", "M. Horváth", "P. Jagač", "J. Kováčová", "P. Hrčka"],
        venue: "ICETA 2021 (International Conference on Emerging eLearning Technologies and Applications)",
        doi: "http://dx.doi.org/10.1109/ICETA54173.2021.9726608"
      },
      {
        title: "Puzzle-Driven Learning: Developing and Assessing IT Challenges for Varied Experience Levels",
        authors: ["Marek Horváth", "Emília Pietriková"],
        venue: "ICETA 2023 (International Conference on Emerging eLearning Technologies and Applications)",
        doi: "http://dx.doi.org/10.1109/iceta61311.2023.10344036",
        isbn: "979-8-3503-7069-0"
      },
      {
        title: "Improving Software Education with Technical Debt Analysis Tool",
        authors: ["Marek Horváth", "Emília Pietriková", "Jakub Šašak"],
        venue: "ICETA 2024 (International Conference on Emerging eLearning Technologies and Applications)",
        doi: "https://doi.org/10.1109/iceta63795.2024.10850816",
        isbn: "979-8-3315-2770-9"
      },
      {
        title: "Detecting Programmer Identity from Source Code with Machine Learning Methods",
        authors: ["Marek Horváth", "Martin Čupalka", "Emília Pietriková"],
        venue: "ICETA 2025 (International Conference on Emerging eLearning Technologies and Applications)",
        doi: "https://doi.org/10.1109/ICETA67772.2025.11280212"
      },
      {
        title: "Detecting AI-Generated Source Code in Student Assignments Using Steganographic Watermarks",
        authors: ["Lenka Bubeňková", "Marek Horváth", "Emília Pietriková", "Matej Čorba"],
        venue: "ICETA 2025 (International Conference on Emerging eLearning Technologies and Applications)",
        doi: "https://doi.org/10.1109/ICETA67772.2025.11280274"
      }
    ]
  },
  {
    title: "Journals",
    venueLabel: "Journal",
    items: [
      {
        title: "Personalized Learning Analytics Through Static Code Analysis in Computer Science Education",
        authors: ["Marek Horváth", "Emília Pietriková", "Filip Gurbáľ"],
        venue: "Acta Informatica Pragensia",
        doi: "http://dx.doi.org/10.18267/j.aip.283"
      },
      {
        title: "Benchmarking AI Models for Grading Computer Science Assignments Across Multiple Domains",
        authors: ["Marek Horváth", "Lukáš Tomaščík", "Nikola Geciová", "Norbert Ádám", "Emília Pietriková"],
        venue: "Acta Polytechnica Hungarica"
      },
      {
        title: "Bridging Behavioral Biometrics and Source Code Stylometry: A Survey of Programmer Attribution Research",
        authors: ["Marek Horváth", "Diomidis Spinellis", "Emília Pietriková"],
        doi: "https://doi.org/10.48550/arXiv.2603.11150",
        status: "In review"
      },
      {
        title: "Profiling Programmer Proficiency Using Static Analysis",
        authors: ["Emília Pietriková", "Marek Horváth", "Anton Baláž"],
        venue: "PeerJ Computer Science"
      },
      {
        title: "Code Clones: A Novel Approach to Detecting Plagiarism in Binary Decomposition of C Programs",
        authors: ["Marek Horváth", "Filip Gurbáľ"],
        venue: "Acta Electrotechnica et Informatica",
        doi: "http://dx.doi.org/10.2478/aei-2024-0006",
        issn: "1335-8243"
      },
      {
        title: "Limitations and Failures of Large Language Model Based Code Grading System",
        authors: ["Lukáš Tomaščík", "Nikola Tomaščíková", "Marek Horváth", "Norbert Ádám"],
        venue: "Acta Electrotechnica et Informatica"
      },
      {
        title: "Large Language Models for Automated Assessment and Feedback in Computer Science and Engineering Education",
        authors: ["Nikola Tomaščíková", "Marek Horváth", "Lukáš Tomaščík", "Lenka Bubeňková"],
        venue: "Acta Electrotechnica et Informatica",
        status: "In review"
      }
    ]
  },
  {
    title: "Non-Scopus Conferences",
    venueLabel: "Conference",
    items: [
      {
        title: "Introducing TAIPO, an AI-Based Product Owner Assistant for Vibe Coding",
        authors: ["Gábor Kusper", "Judit Szabó", "Márk Szabó", "Ádám Kovács", "Tibor Tajti", "Csaba Szabó", "Ján Perháč", "Marek Horváth", "Branislav Sobota"],
        venue: "ICAI 2026",
        url: "https://icai.uni-eszterhazy.hu/2026/abstracts/ICAI_2026_abstract_44.pdf"
      },
      {
        title: "Stylistic Patterns in Source Code as Behavioral Biometric Markers for Programmer Identification",
        authors: ["Marek Horváth"],
        venue: "SCYR 2024 (Scientific Conference of Young Researchers)",
        url: "https://scyr.fei.tuke.sk/index.php/proceedings/",
        isbn: "978-80-553-3474-5"
      },
      {
        title: "Programmer Identification Based on Source Code Stylometric Analysis and Behavioral Biometrics",
        authors: ["Marek Horváth"],
        venue: "SCYR 2025 (Scientific Conference of Young Researchers)",
        url: "https://scyr.fei.tuke.sk/index.php/proceedings/"
      },
      {
        title: "Decomposing the Programmer Attribution Problem in Educational Source Code",
        authors: ["Marek Horváth"],
        venue: "SCYR 2026 (Scientific Conference of Young Researchers)",
        url: "https://scyr.fei.tuke.sk/index.php/proceedings/"
      },
      {
        title: "Towards Reliable Programmer Attribution in Educational Source Code",
        authors: ["Marek Horváth"],
        venue: "30th International Student Scientific Conference Poster 2026",
        url: "https://poster2026.sciencesconf.org/data/pages/Proceedings_Poster2026.pdf"
      }
    ]
  },
  {
    title: "Non-Scopus Journals",
    venueLabel: "Journal",
    items: [
      {
        title: "Mental Health Support Application Designed for Local Data Processing and User Autonomy",
        authors: ["Simona Michaliková", "Marek Horváth"],
        venue: "Electrical Engineering and Informatics",
        url: "https://eei.fei.tuke.sk/wp-content/uploads/2025/07/EEI_16.pdf"
      },
      {
        title: "Capturing Typing Patterns in Web Applications for Author Identification Research",
        authors: ["Eduard Michalek", "Marek Horváth"],
        venue: "Electrical Engineering and Informatics",
        url: "https://eei.fei.tuke.sk/wp-content/uploads/2025/07/EEI_16.pdf"
      },
      {
        title: "Digital System for Psychodiagnostics",
        authors: ["Lukáš Proner", "Marek Horváth"],
        venue: "Electrical Engineering and Informatics",
        url: "https://eei.fei.tuke.sk/wp-content/uploads/2025/07/EEI_16.pdf"
      }
    ]
  }
];

const publicationsCopy = {
  en: {
    citationsLabel: "Google Scholar Citations",
    authorLabel: "Author",
    authorsLabel: "Authors",
    statusLabel: "Status",
    metricsTitle: "Google Scholar citations",
    updatedLabel: "updated",
    locale: "en-US",
    dateLocale: "en-GB",
    scholarLanguage: "en",
    sectionTitles: {
      "Scopus-Indexed Conferences": "Scopus-Indexed Conferences",
      Journals: "Journals",
      "Non-Scopus Conferences": "Non-Scopus Conferences",
      "Non-Scopus Journals": "Non-Scopus Journals"
    },
    venueLabels: {
      Conference: "Conference",
      Journal: "Journal"
    },
    statuses: {
      "In review": "In review"
    }
  },
  sk: {
    citationsLabel: "Citácie Google Scholar",
    authorLabel: "Autor",
    authorsLabel: "Autori",
    statusLabel: "Stav",
    metricsTitle: "Citácie Google Scholar",
    updatedLabel: "aktualizované",
    locale: "sk-SK",
    dateLocale: "sk-SK",
    scholarLanguage: "sk",
    sectionTitles: {
      "Scopus-Indexed Conferences": "Konferencie indexované v Scopuse",
      Journals: "Časopisy",
      "Non-Scopus Conferences": "Konferencie mimo Scopusu",
      "Non-Scopus Journals": "Časopisy mimo Scopusu"
    },
    venueLabels: {
      Conference: "Konferencia",
      Journal: "Časopis"
    },
    statuses: {
      "In review": "V recenznom konaní"
    }
  }
};

const productionScholarApiUrl =
  "https://portfolio-scholar-api.167.233.132.16.sslip.io/api/scholar-metrics";
const minimumScholarCitations = 60;

export default {
  name: "PublicationsTab",
  props: {
    language: {
      type: String,
      default: "en"
    }
  },
  data() {
    return {
      publicationSections,
      scholarUrl: "https://scholar.google.com/citations?user=9q0s2u4AAAAJ&hl=sk&oi=ao",
      scholarApiUrl:
        process.env.VUE_APP_SCHOLAR_API_URL ||
        (process.env.NODE_ENV === "development"
          ? "http://127.0.0.1:3002/api/scholar-metrics"
          : productionScholarApiUrl),
      scholarMetrics: {
        citations: minimumScholarCitations,
        updatedAt: ""
      }
    };
  },
  computed: {
    copy() {
      return publicationsCopy[this.language] || publicationsCopy.en;
    },
    localizedPublicationSections() {
      return this.publicationSections.map((section) => ({
        ...section,
        title: this.copy.sectionTitles[section.title] || section.title,
        venueLabel: this.copy.venueLabels[section.venueLabel] || section.venueLabel
      }));
    },
    localizedScholarUrl() {
      return this.scholarUrl.replace("hl=sk", `hl=${this.copy.scholarLanguage}`);
    },
    scholarCitationsLabel() {
      const citations = Number.isFinite(this.scholarMetrics.citations)
        ? this.scholarMetrics.citations
        : minimumScholarCitations;
      return citations.toLocaleString(this.copy.locale);
    },
    scholarMetricsTitle() {
      if (!this.scholarMetrics.updatedAt) {
        return this.copy.metricsTitle;
      }

      const updatedAt = new Date(this.scholarMetrics.updatedAt);
      if (Number.isNaN(updatedAt.getTime())) {
        return this.copy.metricsTitle;
      }

      return `${this.copy.metricsTitle}, ${this.copy.updatedLabel} ${updatedAt.toLocaleDateString(this.copy.dateLocale)}`;
    }
  },
  mounted() {
    this.loadScholarMetrics();
  },
  methods: {
    async loadScholarMetrics() {
      const metricSources = [
        this.scholarApiUrl,
        `${process.env.BASE_URL || "/"}scholar-metrics.json`
      ].filter(Boolean);

      for (const metricsUrl of metricSources) {
        try {
          const response = await fetch(metricsUrl, { cache: "no-store" });
          if (!response.ok) {
            throw new Error(`Unable to load Scholar metrics from ${metricsUrl}.`);
          }

          const metrics = await response.json();
          const citations = Number(metrics.citations);
          if (!Number.isFinite(citations)) {
            throw new Error("Scholar citation count is not numeric.");
          }

          this.scholarMetrics = {
            citations: Math.max(citations, minimumScholarCitations),
            updatedAt: metrics.updatedAt || ""
          };

          return;
        } catch {
          // Try the next source. The static JSON keeps the page usable if the API is offline.
        }
      }
    },
    localizedStatus(status) {
      return this.copy.statuses[status] || status;
    },
    trackScholarClick() {
      trackClick("scholar_open", {
        label: "Google Scholar",
        targetUrl: this.localizedScholarUrl,
        language: this.language
      });
    }
  }
};
</script>

<style scoped>
.publications-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 14px;
}

.citation-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 999px;
  background: #edf7f1;
  border: 1px solid rgba(25, 111, 61, 0.18);
  color: #195f38;
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.citation-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 18px rgba(25, 95, 56, 0.12);
}

.citation-chip:focus-visible {
  outline: 3px solid #2b6cb0;
  outline-offset: 3px;
  box-shadow: 0 0 0 4px rgba(43, 108, 176, 0.18);
}

.citation-count {
  color: #12355f;
  font-weight: 800;
}

.pub-sections {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.pub-section-title {
  font-size: 16px;
  font-weight: 700;
  color: #163a66;
  margin-bottom: 10px;
  text-align: center;
}

.pub-card {
  display: block;
  color: inherit;
  text-decoration: none;
}

.pub-card a {
  word-break: break-word;
}

@media (max-width: 900px) {
  .pub-sections {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 540px) {
  .publications-header {
    align-items: center;
  }
}
</style>
