<template>
  <div class="education-tab">
    <h2>{{ copy.title }}</h2>
    <div class="scrollable-content">
      <div
        v-for="item in copy.items"
        :key="`${item.title}-${item.period}`"
        class="edu-block"
      >
        <h3>{{ item.title }} | {{ item.period }}</h3>
        <p>
          <strong>{{ item.organization }}</strong><br />
          <template
            v-for="(line, index) in item.lines"
            :key="`${item.title}-${index}`"
          >
            <strong v-if="line.label">{{ line.label }}:</strong>
            <template v-if="line.label"> {{ line.text }}</template>
            <template v-else>{{ line.text }}</template>
            <template v-if="line.link">
              <a :href="line.link" target="_blank" rel="noopener">{{ line.linkLabel }}</a>
            </template>
            <br v-if="index < item.lines.length - 1" />
          </template>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
const educationCopy = {
  en: {
    title: "Education & Qualifications",
    items: [
      {
        title: "PhD in Informatics",
        period: "SEP 2023 - AUG 2026",
        organization: "Technical University of Košice",
        lines: [
          {
            label: "Thesis topic",
            text: "identifying programmers through source code style analysis and behavioral biometrics."
          },
          {
            label: "Defended",
            text: "August 2026."
          }
        ]
      },
      {
        title: "Research Mobility",
        period: "APR 2026",
        organization: "University of Maribor, Maribor, Slovenia",
        lines: [
          {
            text: "Research stay focused on completing the dissertation. The collaboration addressed methodological and applied aspects of source code analysis and programmer authorship identification."
          },
          {
            label: "Collaboration",
            text: "Marjan Heričko."
          }
        ]
      },
      {
        title: "Research Mobility",
        period: "OCT 2025",
        organization: "Athens University of Economics and Business, Athens, Greece",
        lines: [
          {
            text: "National Scholarship Program research mobility focused on source code authorship attribution and stylistic analysis of programs. The stay resulted in joint work on a survey article and involvement in the Business Analytics Lab (BALab). ",
            link: "https://www.balab.aueb.gr/",
            linkLabel: "balab.aueb.gr"
          },
          {
            label: "Collaboration",
            text: "Diomidis Spinellis."
          }
        ]
      },
      {
        title: "Research Mobility",
        period: "SEP 2024",
        organization: "Palacký University Olomouc, Olomouc, Czech Republic",
        lines: [
          {
            text: "CEEPUS mobility focused on preparing the research proposal and providing space for concentrated research work."
          },
          {
            label: "Collaboration",
            text: "Tomáš Dragon."
          }
        ]
      },
      {
        title: "MBA in Startups and Entrepreneurship",
        period: "JUN 2023 - MAR 2024",
        organization: "EDU Effective Business School",
        lines: [
          {
            text: "Emphasis on innovation, lean methodologies, and strategic planning for modern tech ventures."
          }
        ]
      },
      {
        title: "Supplementary Pedagogical Studies",
        period: "SEP 2022 - JUN 2024",
        organization: "Technical University of Košice",
        lines: [
          {
            text: "Qualified to teach computer science at primary and secondary school levels."
          },
          {
            label: "Thesis topic",
            text: "critical thinking among secondary school students."
          }
        ]
      },
      {
        title: "Ing. (Master's Degree) in Informatics",
        period: "SEP 2021 - JUN 2023",
        organization: "Technical University of Košice",
        lines: [
          {
            label: "Thesis topic",
            text: "plagiarism detection in source code."
          }
        ]
      },
      {
        title: "Bc. (Bachelor's) in Informatics",
        period: "SEP 2018 - JUN 2021",
        organization: "Technical University of Košice",
        lines: [
          {
            label: "Thesis topic",
            text: "network traffic simulator for video conferencing devices."
          }
        ]
      }
    ]
  },
  sk: {
    title: "Vzdelanie a kvalifikácia",
    items: [
      {
        title: "PhD v odbore informatika",
        period: "SEP 2023 - AUG 2026",
        organization: "Technická univerzita v Košiciach",
        lines: [
          {
            label: "Téma dizertačnej práce",
            text: "identifikácia programátorov prostredníctvom analýzy štýlu zdrojového kódu a behaviorálnych biometrík."
          },
          {
            label: "Obhajoba",
            text: "august 2026."
          }
        ]
      },
      {
        title: "Výskumná mobilita",
        period: "APR 2026",
        organization: "Univerzita v Maribore, Maribor, Slovinsko",
        lines: [
          {
            text: "Výskumný pobyt zameraný na dokončenie dizertačnej práce. Spolupráca sa venovala metodickým aj aplikačným aspektom analýzy zdrojového kódu a identifikácie autorstva programátorov."
          },
          {
            label: "Spolupráca",
            text: "Marjan Heričko."
          }
        ]
      },
      {
        title: "Výskumná mobilita",
        period: "OKT 2025",
        organization: "Athens University of Economics and Business, Atény, Grécko",
        lines: [
          {
            text: "Výskumná mobilita v rámci Národného štipendijného programu zameraná na určovanie autorstva zdrojového kódu a štylistickú analýzu programov. Pobyt vyústil do spoločnej práce na prehľadovom článku a zapojenia do Business Analytics Lab (BALab). ",
            link: "https://www.balab.aueb.gr/",
            linkLabel: "balab.aueb.gr"
          },
          {
            label: "Spolupráca",
            text: "Diomidis Spinellis."
          }
        ]
      },
      {
        title: "Výskumná mobilita",
        period: "SEP 2024",
        organization: "Univerzita Palackého v Olomouci, Olomouc, Česká republika",
        lines: [
          {
            text: "Mobilita CEEPUS zameraná na prípravu výskumného zámeru a sústredenú výskumnú prácu."
          },
          {
            label: "Spolupráca",
            text: "Tomáš Dragon."
          }
        ]
      },
      {
        title: "MBA v oblasti startupov a podnikania",
        period: "JÚN 2023 - MAR 2024",
        organization: "EDU Effective Business School",
        lines: [
          {
            text: "Zameranie na inovácie, lean metodiky a strategické plánovanie moderných technologických projektov."
          }
        ]
      },
      {
        title: "Doplňujúce pedagogické štúdium",
        period: "SEP 2022 - JÚN 2024",
        organization: "Technická univerzita v Košiciach",
        lines: [
          {
            text: "Kvalifikácia na výučbu informatiky na základných a stredných školách."
          },
          {
            label: "Téma záverečnej práce",
            text: "kritické myslenie žiakov stredných škôl."
          }
        ]
      },
      {
        title: "Ing. v odbore informatika",
        period: "SEP 2021 - JÚN 2023",
        organization: "Technická univerzita v Košiciach",
        lines: [
          {
            label: "Téma diplomovej práce",
            text: "detekcia plagiátorstva v zdrojovom kóde."
          }
        ]
      },
      {
        title: "Bc. v odbore informatika",
        period: "SEP 2018 - JÚN 2021",
        organization: "Technická univerzita v Košiciach",
        lines: [
          {
            label: "Téma bakalárskej práce",
            text: "simulátor sieťovej prevádzky pre videokonferenčné zariadenia."
          }
        ]
      }
    ]
  }
};

export default {
  name: "EducationTab",
  props: {
    language: {
      type: String,
      default: "en"
    }
  },
  computed: {
    copy() {
      return educationCopy[this.language] || educationCopy.en;
    }
  }
};
</script>
