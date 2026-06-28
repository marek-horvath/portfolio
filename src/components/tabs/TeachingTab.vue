<template>
  <div class="teaching-tab">
    <h2>{{ copy.title }}</h2>
    <div class="teaching-columns">
      <section class="teaching-section">
        <h3 class="teaching-section-title">{{ copy.historyTitle }}</h3>
        <div>
          <div
            v-for="term in copy.history"
            :key="term.period"
            class="work-block"
          >
            <h3>{{ term.period }}</h3>
            <ul class="subject-list">
              <li v-for="subject in term.subjects" :key="subject">
                {{ subject }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section class="teaching-section">
        <h3 class="teaching-section-title">{{ copy.supervisionTitle }}</h3>
        <div>
          <div
            v-for="year in copy.supervision"
            :key="year.year"
            class="work-block"
          >
            <h3>{{ year.year }}</h3>
            <ul class="hack-list">
              <li v-for="topic in year.topics" :key="topic">
                {{ topic }}
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
const teachingCopy = {
  en: {
    title: "Teaching",
    historyTitle: "Teaching History",
    supervisionTitle: "Thesis Supervision (Topics)",
    history: [
      {
        period: "Spring 2026",
        subjects: [
          "C Programming (EN) (lecture & lab)",
          "Database Systems (1 lab)"
        ]
      },
      {
        period: "Fall 2025",
        subjects: [
          "User Interfaces & User Experience (SK) (1 lab)",
          "User Interfaces & User Experience (EN) (lecture & lab)",
          "Fundamentals of Algorithms and Programming (EN) (lecture & lab)",
          "Advanced Software Engineering (2 labs)"
        ]
      },
      {
        period: "Spring 2025",
        subjects: [
          "Database Systems (2 labs)",
          "Current Trends in Informatics 2 (EN) (lecture & lab)",
          "C Programming (EN) (lecture & lab)"
        ]
      },
      {
        period: "Fall 2024",
        subjects: [
          "Requirements Engineering (2 labs)",
          "User Interfaces & User Experience (EN) (lecture & lab)",
          "Fundamentals of Algorithms and Programming (EN) (lecture & lab)",
          "Current Trends in Informatics 1 (EN) (lecture)"
        ]
      },
      {
        period: "Spring 2024",
        subjects: [
          "Current Trends in Informatics 1 (EN) (lecture)",
          "C Programming (EN) (lecture & lab)",
          "Information Systems Security (2 labs)"
        ]
      },
      {
        period: "Fall 2023",
        subjects: [
          "User Interfaces & User Experience (SK) (2 labs)",
          "User Interfaces & User Experience (EN) (lecture & lab)",
          "Fundamentals of Algorithms and Programming (EN) (lecture & lab)",
          "Current Trends in Informatics 1 (EN) (lecture)"
        ]
      },
      {
        period: "Spring 2023",
        subjects: ["C Programming (2 labs)"]
      },
      {
        period: "Fall 2022",
        subjects: [
          "User Interfaces & User Experience (SK) (1 lab)",
          "Fundamentals of Algorithms and Programming (1 lab)"
        ]
      },
      {
        period: "Spring 2022",
        subjects: ["C Programming (2 labs)"]
      },
      {
        period: "Fall 2021",
        subjects: ["Fundamentals of Algorithms and Programming (2 labs)"]
      }
    ],
    supervision: [
      {
        year: "2026",
        topics: [
          "TUKE showcase",
          "Department dashboard",
          "Anonymized style profile generation from code structure",
          "Reverse identification experiment",
          "Impact of programming language on author identifiability",
          "Automated code-style categorization by typologies",
          "Integrity validation and style deviation detection",
          "Normalization strategies for source-code authorship attribution",
          "Sandboxed environment for behavioral biometrics collection",
          "CFG vs AST vs token embeddings comparison",
          "Synthetic code dataset generator for identification systems",
          "Vector representation of source code",
          "Traditional classifiers for programmer attribution",
          "Behavioral + static features for authorship attribution",
          "Clustering visualization of similar source code",
          "Personalized programming education from behavioral and static data",
          "AST stylometric feature extraction and mapping"
        ]
      },
      {
        year: "2025",
        topics: [
          "Comparison of PWA frameworks",
          "Keystroke dynamics tracking application",
          "Web platform for mental disorder diagnostics",
          "Web platform for employees",
          "Java API for OS and hardware information",
          "Steganography for integrity of student assignments",
          "Machine learning for programmer identification",
          "Energy consumption visualization per code component",
          "Mobile app for mental health support",
          "Digitization and automation in energy market management",
          "Automated program testing system",
          "Educational game for algorithmic fundamentals",
          "Source-code similarity via structural and stylistic features"
        ]
      },
      {
        year: "2024",
        topics: [
          "Optimizing security protocols through simulated cyberattacks",
          "Vulnerability scanning system for web applications",
          "Protection strategies against vulnerabilities in cloud systems",
          "Information system for sports clubs",
          "Tool for quantifying and analyzing technical debt in software",
          "Monolith vs microservices in a document-sharing app",
          "Application for dyslexia diagnosis and treatment support",
          "Web platform for code documentation generation",
          "3D web multiplayer game using WebSockets",
          "Monitoring and analytics tool for web site activity"
        ]
      }
    ]
  },
  sk: {
    title: "Výučba",
    historyTitle: "História výučby",
    supervisionTitle: "Vedenie záverečných prác (témy)",
    history: [
      {
        period: "Jar 2026",
        subjects: [
          "Programovanie v jazyku C (EN) (prednáška a cvičenie)",
          "Databázové systémy (1 cvičenie)"
        ]
      },
      {
        period: "Jeseň 2025",
        subjects: [
          "Používateľské rozhrania a používateľská skúsenosť (SK) (1 cvičenie)",
          "Používateľské rozhrania a používateľská skúsenosť (EN) (prednáška a cvičenie)",
          "Základy algoritmizácie a programovania (EN) (prednáška a cvičenie)",
          "Pokročilé softvérové inžinierstvo (2 cvičenia)"
        ]
      },
      {
        period: "Jar 2025",
        subjects: [
          "Databázové systémy (2 cvičenia)",
          "Aktuálne trendy v informatike 2 (EN) (prednáška a cvičenie)",
          "Programovanie v jazyku C (EN) (prednáška a cvičenie)"
        ]
      },
      {
        period: "Jeseň 2024",
        subjects: [
          "Inžinierstvo požiadaviek (2 cvičenia)",
          "Používateľské rozhrania a používateľská skúsenosť (EN) (prednáška a cvičenie)",
          "Základy algoritmizácie a programovania (EN) (prednáška a cvičenie)",
          "Aktuálne trendy v informatike 1 (EN) (prednáška)"
        ]
      },
      {
        period: "Jar 2024",
        subjects: [
          "Aktuálne trendy v informatike 1 (EN) (prednáška)",
          "Programovanie v jazyku C (EN) (prednáška a cvičenie)",
          "Bezpečnosť informačných systémov (2 cvičenia)"
        ]
      },
      {
        period: "Jeseň 2023",
        subjects: [
          "Používateľské rozhrania a používateľská skúsenosť (SK) (2 cvičenia)",
          "Používateľské rozhrania a používateľská skúsenosť (EN) (prednáška a cvičenie)",
          "Základy algoritmizácie a programovania (EN) (prednáška a cvičenie)",
          "Aktuálne trendy v informatike 1 (EN) (prednáška)"
        ]
      },
      {
        period: "Jar 2023",
        subjects: ["Programovanie v jazyku C (2 cvičenia)"]
      },
      {
        period: "Jeseň 2022",
        subjects: [
          "Používateľské rozhrania a používateľská skúsenosť (SK) (1 cvičenie)",
          "Základy algoritmizácie a programovania (1 cvičenie)"
        ]
      },
      {
        period: "Jar 2022",
        subjects: ["Programovanie v jazyku C (2 cvičenia)"]
      },
      {
        period: "Jeseň 2021",
        subjects: ["Základy algoritmizácie a programovania (2 cvičenia)"]
      }
    ],
    supervision: [
      {
        year: "2026",
        topics: [
          "TUKE showcase",
          "Dashboard katedry",
          "Generovanie anonymizovaného štýlového profilu zo štruktúry kódu",
          "Experiment spätnej identifikácie",
          "Vplyv programovacieho jazyka na identifikovateľnosť autora",
          "Automatizovaná kategorizácia štýlu kódu podľa typológií",
          "Validácia integrity a detekcia odchýlok štýlu",
          "Normalizačné stratégie pri určovaní autorstva zdrojového kódu",
          "Sandboxované prostredie na zber behaviorálnych biometrík",
          "Porovnanie CFG, AST a tokenových embeddingov",
          "Generátor syntetického datasetu kódu pre identifikačné systémy",
          "Vektorová reprezentácia zdrojového kódu",
          "Tradičné klasifikátory na atribúciu programátora",
          "Behaviorálne a statické príznaky na určovanie autorstva",
          "Vizualizácia zhlukovania podobného zdrojového kódu",
          "Personalizované vzdelávanie v programovaní z behaviorálnych a statických dát",
          "Extrakcia a mapovanie stylometrických príznakov AST"
        ]
      },
      {
        year: "2025",
        topics: [
          "Porovnanie PWA frameworkov",
          "Aplikácia na sledovanie dynamiky stlačení klávesov",
          "Webová platforma na diagnostiku duševných porúch",
          "Webová platforma pre zamestnancov",
          "Java API pre informácie o OS a hardvéri",
          "Steganografia na zabezpečenie integrity študentských zadaní",
          "Strojové učenie na identifikáciu programátorov",
          "Vizualizácia spotreby energie podľa komponentov kódu",
          "Mobilná aplikácia na podporu duševného zdravia",
          "Digitalizácia a automatizácia v riadení energetického trhu",
          "Systém na automatizované testovanie programov",
          "Edukačná hra pre základy algoritmizácie",
          "Podobnosť zdrojového kódu cez štrukturálne a štylistické príznaky"
        ]
      },
      {
        year: "2024",
        topics: [
          "Optimalizácia bezpečnostných protokolov cez simulované kybernetické útoky",
          "Systém na skenovanie zraniteľností webových aplikácií",
          "Stratégie ochrany proti zraniteľnostiam v cloudových systémoch",
          "Informačný systém pre športové kluby",
          "Nástroj na kvantifikáciu a analýzu technického dlhu v softvéri",
          "Monolit vs. mikroslužby v aplikácii na zdieľanie dokumentov",
          "Aplikácia na diagnostiku dyslexie a podporu liečby",
          "Webová platforma na generovanie dokumentácie kódu",
          "3D webová multiplayer hra pomocou WebSockets",
          "Monitorovací a analytický nástroj aktivity webu"
        ]
      }
    ]
  }
};

export default {
  name: "TeachingTab",
  props: {
    language: {
      type: String,
      default: "en"
    }
  },
  computed: {
    copy() {
      return teachingCopy[this.language] || teachingCopy.en;
    }
  }
};
</script>

<style scoped>
.teaching-columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.teaching-section-title {
  font-size: 16px;
  font-weight: 700;
  color: #163a66;
  margin-bottom: 10px;
  text-align: center;
}

@media (max-width: 900px) {
  .teaching-columns {
    grid-template-columns: 1fr;
  }
}

.teaching-tab .work-block {
  background-color: transparent !important;
  border: 0 !important;
  padding: 4px 0 !important;
  box-shadow: none !important;
}

.teaching-tab .work-block:hover {
  transform: none !important;
  box-shadow: none !important;
}

.subject-list {
  list-style: disc;
  margin: 6px 0 0 18px;
  padding: 0;
  color: inherit;
}

.subject-list li {
  margin-bottom: 4px;
}
</style>
