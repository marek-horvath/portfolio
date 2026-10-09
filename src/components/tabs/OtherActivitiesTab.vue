<template>
  <div class="other-activities-tab">
    <h2>{{ copy.title }}</h2>
    <div class="scrollable-content">
      <div
        v-for="section in copy.sections"
        :key="section.title"
        class="work-block"
      >
        <h3>{{ section.title }}</h3>

        <ul v-if="section.items" class="hack-list">
          <li v-for="item in section.items" :key="item.text">
            {{ item.text }}
            <a
              v-if="item.link"
              :href="item.link"
              target="_blank"
              rel="noopener"
            >
              {{ item.linkLabel }}
            </a>
          </li>
        </ul>

        <p v-else>
          {{ section.text }}
          <a
            v-if="section.link"
            :href="section.link"
            target="_blank"
            rel="noopener"
          >
            {{ section.linkLabel }}
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
const otherActivitiesCopy = {
  en: {
    title: "Other Activities",
    sections: [
      {
        title: "Reviewer",
        items: [
          { text: "Acta Polytechnica Hungarica" },
          { text: "PeerJ Computer Science" },
          { text: "SAMI 2026" },
          { text: "Proceedings EEI" },
          { text: "INES 2026" }
        ]
      },
      {
        title: "Summer School of Statistics | AUG 2025",
        text: "Participated in the Summer School of Statistics in Brno, focused on statistical methods and practical data analysis. ",
        link: "https://www.sciserv.cz/letni-skola-statistiky/",
        linkLabel: "sciserv.cz/letni-skola-statistiky"
      },
      {
        title: "Zenodo Research Artifacts",
        items: [
          {
            text: "Google Code Jam and Kick Start solutions dataset for source code authorship analysis (2008-2023): ",
            link: "https://zenodo.org/records/18901762",
            linkLabel: "Zenodo record 18901762"
          },
          {
            text: "Synthetic dataset of C source code mutations for source code similarity and robustness experiments: ",
            link: "https://zenodo.org/records/20312253",
            linkLabel: "Zenodo record 20312253"
          },
          {
            text: "Literature extraction script and curated bibliographic dataset for programmer attribution research: ",
            link: "https://zenodo.org/records/18641274",
            linkLabel: "Zenodo record 18641274"
          }
        ]
      },
      {
        title: "CURATE - Ulysseus Project",
        text: "International collaboration and a semester-long project for GymBeam. Served as Product Owner and Scrum Master, led communication with the partner company, coordinated tasks, and delivered the final presentation at the University of Münster, Germany."
      },
      {
        title: "SCYR - Organizing Committee",
        text: "Member of the organizing committee for the SCYR doctoral conference. Helped process submissions, communicate with authors, and verify revisions after peer review."
      },
      {
        title: "Buddy Program",
        text: "Volunteer mentoring at the Technical University of Košice, helping junior students adapt to university life and navigate academic processes."
      },
      {
        title: "Research Project Team Member",
        items: [
          { text: "VEGA 1/0630/22 — Lowering Programmers' Cognitive Load Using Context-Dependent Dialogs" },
          { text: "KEGA 061TUKE-4/2025 — Building Bridges between University and High School ICT Education" },
          { text: "Slovak-Hungarian TéT 2024-1.2.5-TÉT-2024-00072 / APVV SK-HU-24-0037 — Realistic Project Simulation and Intelligent Product Owner Assistant for Improving Software Engineering Education" }
        ]
      }
    ]
  },
  sk: {
    title: "Ďalšie aktivity",
    sections: [
      {
        title: "Recenzent",
        items: [
          { text: "Acta Polytechnica Hungarica" },
          { text: "PeerJ Computer Science" },
          { text: "SAMI 2026" },
          { text: "Proceedings EEI" },
          { text: "INES 2026" }
        ]
      },
      {
        title: "Letná škola štatistiky | AUG 2025",
        text: "Zúčastnil som sa Letnej školy štatistiky v Brne so zameraním na štatistické metódy a praktickú analýzu dát. ",
        link: "https://www.sciserv.cz/letni-skola-statistiky/",
        linkLabel: "sciserv.cz/letni-skola-statistiky"
      },
      {
        title: "Výskumné artefakty na Zenodo",
        items: [
          {
            text: "Dataset riešení Google Code Jam a Kick Start na analýzu autorstva zdrojového kódu (2008-2023): ",
            link: "https://zenodo.org/records/18901762",
            linkLabel: "Zenodo record 18901762"
          },
          {
            text: "Syntetický dataset mutácií zdrojového kódu v jazyku C pre experimenty s podobnosťou a robustnosťou kódu: ",
            link: "https://zenodo.org/records/20312253",
            linkLabel: "Zenodo record 20312253"
          },
          {
            text: "Skript na extrakciu literatúry a kurátorovaný bibliografický dataset pre výskum atribúcie programátorov: ",
            link: "https://zenodo.org/records/18641274",
            linkLabel: "Zenodo record 18641274"
          }
        ]
      },
      {
        title: "CURATE - projekt Ulysseus",
        text: "Medzinárodná spolupráca a semestrálny projekt pre GymBeam. Pôsobil som ako Product Owner a Scrum Master, viedol komunikáciu s partnerskou firmou, koordinoval úlohy a prezentoval finálne výsledky na University of Münster v Nemecku."
      },
      {
        title: "SCYR - organizačný výbor",
        text: "Člen organizačného výboru doktorandskej konferencie SCYR. Pomáhal som so spracovaním príspevkov, komunikáciou s autormi a kontrolou úprav po recenznom konaní."
      },
      {
        title: "Buddy program",
        text: "Dobrovoľnícke mentorovanie na Technickej univerzite v Košiciach, pomoc mladším študentom pri adaptácii na univerzitný život a orientácii v akademických procesoch."
      },
      {
        title: "Riešiteľ výskumných projektov",
        items: [
          { text: "VEGA 1/0630/22 — Znižovanie kognitívneho zaťaženia programátorov pomocou kontextovo závislých dialógov" },
          { text: "KEGA 061TUKE-4/2025 — Budovanie mostov medzi univerzitným a stredoškolským vzdelávaním v oblasti IKT" },
          { text: "Slovensko-maďarský TéT 2024-1.2.5-TÉT-2024-00072 / APVV SK-HU-24-0037 — Realistická simulácia projektu a inteligentný asistent produktového vlastníka na zlepšenie vzdelávania v softvérovom inžinierstve" }
        ]
      }
    ]
  }
};

export default {
  name: "OtherActivitiesTab",
  props: {
    language: {
      type: String,
      default: "en"
    }
  },
  computed: {
    copy() {
      return otherActivitiesCopy[this.language] || otherActivitiesCopy.en;
    }
  }
};
</script>
