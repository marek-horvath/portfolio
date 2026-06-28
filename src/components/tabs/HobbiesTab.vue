<template>
  <div class="hobbies-tab">
    <h2>{{ copy.title }}</h2>
    <div class="scrollable-content">
      <p>{{ copy.intro }}</p>

      <ul class="hack-list">
        <li v-for="achievement in copy.achievements" :key="achievement.event">
          <strong>{{ achievement.event }}:</strong> {{ achievement.result }}
        </li>
      </ul>

      <p>
        {{ copy.moreEvents }}
        <a
          href="https://devpost.com/marek79horvath?ref_content=user-portfolio&ref_feature=portfolio&ref_medium=global-nav"
          target="_blank"
        >
          DevPost
        </a>.
      </p>

      <p>{{ copy.activeLife }}</p>
    </div>
  </div>
</template>

<script>
const hobbiesCopy = {
  en: {
    title: "Hobbies & Interests",
    intro: "I often participate in hackathons to explore new ideas and collaborate with fellow developers. Below are some of my achievements from Hack Kosice:",
    achievements: [
      {
        event: "Hack Kosice 2024",
        result: "Winner [MLH] Best Domain Name from GoDaddy Registry"
      },
      {
        event: "Hack Kosice 2023",
        result: "Winner [MLH] Most Creative Use of GitHub"
      },
      {
        event: "Hack Kosice 2022",
        result: "Winner Visma Timeline Challenge"
      }
    ],
    moreEvents: "I've also participated in hackathons organized by Telekom, Erste Digital, Kosice Act in Space, and CITYTHON 2022. My project portfolio from these events is available on",
    activeLife: "Beyond programming, I enjoy staying active with football, squash, and regular workouts. I also take part in running events and have successfully completed the 100th Košice Peace Half Marathon."
  },
  sk: {
    title: "Záujmy",
    intro: "Často sa zapájam do hackathonov, kde skúšam nové nápady a spolupracujem s ďalšími vývojármi. Niekoľko výsledkov z Hack Kosice:",
    achievements: [
      {
        event: "Hack Kosice 2024",
        result: "víťaz [MLH] Best Domain Name from GoDaddy Registry"
      },
      {
        event: "Hack Kosice 2023",
        result: "víťaz [MLH] Most Creative Use of GitHub"
      },
      {
        event: "Hack Kosice 2022",
        result: "víťaz Visma Timeline Challenge"
      }
    ],
    moreEvents: "Zúčastnil som sa aj hackathonov organizovaných spoločnosťami Telekom, Erste Digital, Kosice Act in Space a CITYTHON 2022. Projekty z týchto podujatí sú dostupné na",
    activeLife: "Mimo programovania rád zostávam aktívny cez futbal, squash a pravidelné tréningy. Zúčastňujem sa aj bežeckých podujatí a úspešne som absolvoval 100. Košický polmaratón mieru."
  }
};

export default {
  name: "HobbiesTab",
  props: {
    language: {
      type: String,
      default: "en"
    }
  },
  computed: {
    copy() {
      return hobbiesCopy[this.language] || hobbiesCopy.en;
    }
  }
};
</script>
