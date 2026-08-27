<template>
  <div class="work-tab">
    <h2>{{ copy.title }}</h2>
    <div class="scrollable-content">
      <div
        v-for="item in copy.items"
        :key="`${item.role}-${item.period}`"
        class="work-block"
      >
        <h3>{{ item.role }} | {{ item.period }}</h3>
        <p>
          <em>{{ item.organization }}</em><br />
          {{ item.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
const workCopy = {
  en: {
    title: "Professional Experience",
    items: [
      {
        role: "Assistant Professor",
        period: "AUG 2026 - Present",
        organization: "Technical University of Košice",
        description: "Teaching and mentoring students while continuing research in source code analysis, programmer identification, code similarity, and software engineering education."
      },
      {
        role: "UX Designer",
        period: "OCT 2023 - SEP 2024",
        organization: "Technical University of Košice",
        description: "Created user-centered solutions for public administration software, focusing on accessibility and intuitive design to simplify complex workflows."
      },
      {
        role: "Frontend Developer",
        period: "SEP 2021 - NOV 2023",
        organization: "Deutsche Telekom IT Solutions",
        description: "Developed user interfaces in Vue3 and Angular, contributed to automated testing with Selenium, and participated in agile Scrum practices to ensure smooth delivery and continuous improvement."
      },
      {
        role: "Student Teaching Assistant",
        period: "SEP 2021 - JUN 2023",
        organization: "Technical University of Košice",
        description: "Guided students in Algorithm Basics, C Programming, and UI/UX Design. Developed course materials, provided constructive feedback, and introduced Arduino-based projects to demonstrate real-world engineering applications."
      }
    ]
  },
  sk: {
    title: "Profesionálne skúsenosti",
    items: [
      {
        role: "Odborný asistent",
        period: "AUG 2026 - súčasnosť",
        organization: "Technická univerzita v Košiciach",
        description: "Vediem výučbu a mentorujem študentov, popri tom pokračujem vo výskume analýzy zdrojového kódu, identifikácie programátorov, podobnosti kódu a softvérového vzdelávania."
      },
      {
        role: "UX dizajnér",
        period: "OKT 2023 - SEP 2024",
        organization: "Technická univerzita v Košiciach",
        description: "Tvoril používateľsky orientované riešenia pre softvér verejnej správy so zameraním na prístupnosť a intuitívny dizajn, ktorý zjednodušuje komplexné pracovné postupy."
      },
      {
        role: "Frontend vývojár",
        period: "SEP 2021 - NOV 2023",
        organization: "Deutsche Telekom IT Solutions",
        description: "Vyvíjal používateľské rozhrania vo Vue3 a Angulari, podieľal sa na automatizovanom testovaní pomocou Selenium a pracoval v agilnom Scrum tíme na plynulom doručovaní riešení."
      },
      {
        role: "Študentský asistent výučby",
        period: "SEP 2021 - JÚN 2023",
        organization: "Technická univerzita v Košiciach",
        description: "Viedol študentov v predmetoch Základy algoritmizácie, Programovanie v jazyku C a UI/UX dizajn. Pripravoval študijné materiály, poskytoval spätnú väzbu a zavádzal projekty s Arduinom na ukážku praktických inžinierskych aplikácií."
      }
    ]
  }
};

export default {
  name: "WorkTab",
  props: {
    language: {
      type: String,
      default: "en"
    }
  },
  computed: {
    copy() {
      return workCopy[this.language] || workCopy.en;
    }
  }
};
</script>
