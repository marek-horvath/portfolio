<template>
  <div class="portfolio-wrapper unselectable">
    <!-- Background particles -->
    <div id="particles-js"></div>

    <!-- Main content -->
    <div class="portfolio-content">
      <!-- HERO / HEADER SECTION -->
      <div class="profile-section">
        <h1 class="profile-name">{{ name }}</h1>
        <p class="profile-location">{{ currentLocation }}</p>
        <p class="profile-occupation">{{ occupation }}</p>
        <p class="profile-intro">{{ intro }}</p>
      </div>

      <!-- SOCIAL ICONS -->
      <nav class="social-nav">
        <a class="social-icon" href="https://www.linkedin.com/in/horvathmar/" target="_blank">
          <img
            src="https://cdn-icons-png.flaticon.com/512/145/145807.png"
            alt="LinkedIn"
          />
        </a>
        <a class="social-icon" href="discordapp.com/users/341979185637621760" target="_blank">
          <img
            src="https://www.freeiconspng.com/uploads/discord-black-icon-1.png"
            alt="Discord"
          />
        </a>
        <a class="social-icon" href="mailto:marek.horvath@tuke.sk">
          <img
            src="https://cdn-icons-png.flaticon.com/512/561/561127.png"
            alt="Mail"
          />
        </a>
      </nav>

      <hr />

      <!-- TABS NAVIGATION -->
      <nav class="tab-nav">
        <!-- DESKTOP TABS (centered) -->
        <div class="desktop-tabs">
          <div
            v-for="(tab, index) in tabs"
            :key="index"
            :class="['tab-item', { active: activeTab === tab }]"
            @click="selectTab(tab)"
          >
            {{ tab }}
          </div>
        </div>

        <!-- HAMBURGER (mobile only, right side) -->
        <div class="mobile-menu">
          <button class="hamburger" @click="navOpen = !navOpen">
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div class="mobile-dropdown" v-if="navOpen">
            <div
              v-for="(tab, index) in tabs"
              :key="index"
              :class="['tab-item', { active: activeTab === tab }]"
              @click="selectTab(tab)"
            >
              {{ tab }}
            </div>
          </div>
        </div>
      </nav>

      <!-- TABS CONTENT -->
      <div class="tab-content">












        <!-- PUBLICATIONS TAB -->
<div v-if="activeTab === 'Publications'" class="publications-tab">
  <h2>Selected Publications</h2>
  <div class="scrollable-content">
    
    <!-- SAMI 2024 -->
    <div class="pub-block">
      <h3>An Experimental Comparison of Three Code Similarity Tools on Over 1,000 Student Projects</h3>
      <p>
        <strong>Authors:</strong> Marek Horváth, Emília Pietriková<br/>
        <strong>Conference:</strong> SAMI 2024<br/>
        <strong>DOI:</strong> 
        <a href="http://dx.doi.org/10.1109/sami60510.2024.10432863" target="_blank">
          10.1109/sami60510.2024.10432863
        </a><br/>
        <strong>ISBN:</strong> 979-8-3503-1720-6
      </p>
    </div>

    <!-- SAMI 2025 -->
    <div class="pub-block">
      <h3>Exploring GPT-Generated Variations in C Programming Assignments</h3>
      <p>
        <strong>Authors:</strong> Marek Horváth, Lenka Bubeňková, Emília Pietriková<br/>
        <strong>Conference:</strong> SAMI 2025<br/>
        <strong>DOI:</strong> 
        <a href="https://doi.org/10.1109/sami63904.2025.10883288" target="_blank">
          10.1109/sami63904.2025.10883288
        </a><br/>
        <strong>ISBN:</strong> 979-8-3503-7936-5
      </p>
    </div>

    <div class="pub-block">
      <h3>Code Reuse and Good Clones in Programming Education</h3>
      <p>
        <strong>Authors:</strong> Lenka Bubeňková, Emília Pietriková, Marek Horváth<br/>
        <strong>Conference:</strong> SAMI 2025<br/>
        <strong>DOI:</strong> 
        <a href="https://doi.org/10.1109/sami63904.2025.10883291" target="_blank">
          10.1109/sami63904.2025.10883291
        </a><br/>
        <strong>ISBN:</strong> 979-8-3503-7936-5
      </p>
    </div>

    <div class="pub-block">
      <h3>Simplifying Education of Reactive Programming Concepts Using Comparative Application</h3>
      <p>
        <strong>Authors:</strong> Tomáš Kormaník, Marek Horváth, Lenka Bubeňková<br/>
        <strong>Conference:</strong> SAMI 2025<br/>
        <strong>DOI:</strong> 
        <a href="https://doi.org/10.1109/SAMI63904.2025.10883129" target="_blank">
          10.1109/SAMI63904.2025.10883129
        </a><br/>
        <strong>ISBN:</strong> 979-8-3503-7936-5
      </p>
    </div>

    <div class="pub-block">
      <h3>Development of a MATLAB Application for Simulating the SEIQRD Pandemic Spread Model</h3>
      <p>
        <strong>Authors:</strong> Nikola Geciová, Lukáš Tomaščík, Marek Horváth<br/>
        <strong>Conference:</strong> SAMI 2025<br/>
        <strong>DOI:</strong> 
        <a href="https://doi.org/10.1109/sami63904.2025.10883239" target="_blank">
          10.1109/sami63904.2025.10883239
        </a><br/>
        <strong>ISBN:</strong> 979-8-3503-7936-5
      </p>
    </div>

    <!-- ICPEC 2024 -->
    <div class="pub-block">
      <h3>Adaptation of Automated Assessment System for Large Programming Courses</h3>
      <p>
        <strong>Authors:</strong> Marek Horváth, Tomáš Kormaník, Jaroslav Porubän<br/>
        <strong>Conference:</strong> ICPEC 2024<br/>
        <strong>DOI:</strong> 
        <a href="https://doi.org/10.4230/OASIcs.ICPEC.2024.4" target="_blank">
          10.4230/OASIcs.ICPEC.2024.4
        </a><br/>
        <strong>ISBN:</strong> 978-3-95977-347-8
      </p>
    </div>

    <div class="pub-block">
      <h3>Using ChatGPT During Implementation of Programs in Education</h3>
      <p>
        <strong>Authors:</strong> Norbert Baláž, Jaroslav Porubän, Marek Horváth, Tomáš Kormaník<br/>
        <strong>Conference:</strong> ICPEC 2024<br/>
        <strong>DOI:</strong> 
        <a href="https://doi.org/10.4230/OASIcs.ICPEC.2024.18" target="_blank">
          10.4230/OASIcs.ICPEC.2024.18
        </a><br/>
        <strong>ISBN:</strong> 978-3-95977-347-8
      </p>
    </div>

    <!-- Informatics 2024 -->
    <div class="pub-block">
      <h3>Comparison of Scalability and Performance in Microservices and Monolithic Architectures</h3>
      <p>
        <strong>Authors:</strong> Marek Horváth, Vladyslav Sakhnenko, Filip Gurbáľ<br/>
        <strong>Conference:</strong> Informatics 2024<br/>
        <strong>DOI:</strong> 
        <a href="https://doi.org/10.1109/Informatics62280.2024.10900892" target="_blank">
          10.1109/Informatics62280.2024.10900892
        </a>
      </p>
    </div>

    <!-- ICETA 2023 -->
    <div class="pub-block">
      <h3>Puzzle-Driven Learning: Developing and Assessing IT Challenges</h3>
      <p>
        <strong>Authors:</strong> Marek Horváth, Emília Pietriková<br/>
        <strong>Conference:</strong> ICETA 2023<br/>
        <strong>DOI:</strong> 
        <a href="http://dx.doi.org/10.1109/iceta61311.2023.10344036" target="_blank">
          10.1109/iceta61311.2023.10344036
        </a><br/>
        <strong>ISBN:</strong> 979-8-3503-7069-0
      </p>
    </div>

    <!-- ICETA 2024 -->
    <div class="pub-block">
      <h3>Improving Software Education with Technical Debt Analysis Tool</h3>
      <p>
        <strong>Authors:</strong> Marek Horváth, Emília Pietriková, Jakub Šašak<br/>
        <strong>Conference:</strong> ICETA 2024<br/>
        <strong>DOI:</strong> 
        <a href="https://doi.org/10.1109/iceta63795.2024.10850816" target="_blank">
          10.1109/iceta63795.2024.10850816
        </a><br/>
        <strong>ISBN:</strong> 979-8-3315-2770-9
      </p>
    </div>

    <!-- Acta Electrotechnica -->
    <div class="pub-block">
      <h3>Code Clones: A Novel Approach to Detecting Plagiarism in Binary Decomposition of C Programs</h3>
      <p>
        <strong>Authors:</strong> Marek Horváth, Filip Gurbáľ<br/>
        <strong>Journal:</strong> Acta Electrotechnica et Informatica<br/>
        <strong>DOI:</strong> 
        <a href="http://dx.doi.org/10.2478/aei-2024-0006" target="_blank">
          10.2478/aei-2024-0006
        </a><br/>
        <strong>ISSN:</strong> 1335-8243
      </p>
    </div>

    <!-- SCYR 2024, 2025 -->
    <div class="pub-block">
      <h3>Stylistic Patterns in Source Code as Behavioral Biometric Markers for Programmer Identification</h3>
      <p>
        <strong>Author:</strong> Marek Horváth<br/>
        <strong>Conference:</strong> SCYR 2024<br/>
        <strong>Link:</strong> 
        <a href="https://scyr.fei.tuke.sk/index.php/proceedings/" target="_blank">
          scyr.fei.tuke.sk
        </a><br/>
        <strong>ISBN:</strong> 978-80-553-3474-5
      </p>
    </div>

    <div class="pub-block">
      <h3>Programmer Identification Based on Source Code Stylometric Analysis and Behavioral Biometrics</h3>
      <p>
        <strong>Author:</strong> Marek Horváth<br/>
        <strong>Conference:</strong> SCYR 2025<br/>
        <strong>Link:</strong> 
        <a href="https://scyr.fei.tuke.sk/index.php/proceedings/" target="_blank">
          scyr.fei.tuke.sk
        </a>
      </p>
    </div>

  </div>
</div>















        

        <!-- WORK TAB -->
        <div v-else-if="activeTab === 'Work'" class="work-tab">
          <h2>Professional Experience</h2>
          <div class="scrollable-content">
            <div class="work-block">
              <h3>UX Designer | OCT 2023 – SEP 2024</h3>
              <p>
                <em>Technical University of Košice</em><br/>
                Created user-centered solutions for public administration software,
                focusing on accessibility and intuitive design to simplify complex workflows.
              </p>
            </div>

            <div class="work-block">
              <h3>Frontend Developer | SEP 2021 – NOV 2023</h3>
              <p>
                <em>Deutsche Telekom IT Solutions</em><br/>
                Developed user interfaces in Vue3 and Angular, contributed to automated
                testing with Selenium, and participated in agile Scrum practices to
                ensure smooth delivery and continuous improvement.
              </p>
            </div>

            <div class="work-block">
              <h3>Student Teaching Assistant | SEP 2021 – JUN 2023</h3>
              <p>
                <em>Technical University of Košice</em><br/>
                Guided students in Algorithm Basics, C Programming, and UI/UX Design.
                Developed course materials, provided constructive feedback, and
                introduced Arduino-based projects to demonstrate real-world
                engineering applications.
              </p>
            </div>
          </div>
        </div>

        <!-- EDUCATION TAB -->
        <div v-else-if="activeTab === 'Education'" class="education-tab">
          <h2>Education & Qualifications</h2>
          <div class="scrollable-content">
            <div class="edu-block">
              <h3>PhD Candidate in Informatics | SEP 2023 – Present</h3>
              <p>
                <strong>Technical University of Košice</strong><br/>
                Dissertation focuses on advanced static code analysis, code similarity detection,
                and automation for programming education.
              </p>
            </div>

            <div class="edu-block">
              <h3>MBA in Startups and Entrepreneurship | JUN 2023 – MAR 2024</h3>
              <p>
                <strong>EDU Effective Business School</strong><br/>
                Emphasis on innovation, lean methodologies, and strategic planning for modern tech ventures.
              </p>
            </div>

            <div class="edu-block">
              <h3>Supplementary Pedagogical Studies | SEP 2022 – JUN 2024</h3>
              <p>
                <strong>Technical University of Košice</strong><br/>
                Qualified to teach computer science at primary and secondary school levels,
                focusing on interactive methods and digital literacy.
              </p>
            </div>

            <div class="edu-block">
              <h3>Ing. (Master’s Degree) in Informatics | SEP 2021 – JUN 2023</h3>
              <p>
                <strong>Technical University of Košice</strong><br/>
                Specialized in software engineering, code quality, and large-scale system design.
              </p>
            </div>

            <div class="edu-block">
              <h3>Bc. (Bachelor’s) in Informatics | SEP 2018 – JUN 2021</h3>
              <p>
                <strong>Technical University of Košice</strong><br/>
                Undergraduate focus on algorithms, data structures, and fundamentals of computer networking.
              </p>
            </div>
          </div>
        </div>

        <!-- HOBBIES TAB -->
        <div v-else-if="activeTab === 'Hobbies'">
          <h2>Hobbies & Interests</h2>
          <div class="scrollable-content">
            <p>
              I often participate in hackathons to explore new ideas and collaborate with fellow developers.
              Below are some of my achievements from Hack Kosice:
            </p>

            <ul class="hack-list">
              <li>
                <strong>Hack Kosice 2024:</strong> Winner [MLH] Best Domain Name from GoDaddy Registry
              </li>
              <li>
                <strong>Hack Kosice 2023:</strong> Winner [MLH] Most Creative Use of GitHub
              </li>
              <li>
                <strong>Hack Kosice 2022:</strong> Winner Visma Timeline Challenge
              </li>
            </ul>

            <p>
              I’ve also participated in hackathons organized by Telekom, Erste Digital, Kosice Act in Space, 
              and CITYTHON 2022. My project portfolio from these events is available on 
              <a 
                href="https://devpost.com/marek79horvath?ref_content=user-portfolio&ref_feature=portfolio&ref_medium=global-nav" 
                target="_blank"
              >
                DevPost
              </a>.
            </p>

            <p>
              Beyond programming, I enjoy staying active with football, squash, and regular workouts. 
              I also take part in running events and have successfully completed the 100th Košice Peace Half Marathon.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MinimalPortfolio",
  data() {
    return {
      name: "Marek Horváth",
      currentLocation: "Košice, Slovakia",
      occupation: "PhD Student (Informatics) & Software Engineer",
      intro: "Identifying programmers through style analysis of source code and behavioral biometrics, while also exploring code similarity detection. In my free time, I engage in web development projects and actively participate in hackathons to refine my skills and collaborate with like-minded individuals.",
      tabs: ["Publications", "Work", "Education", "Hobbies"],
      activeTab: "Publications",
      navOpen: false // pre hamburger menu
    };
  },
  mounted() {
    /* global particlesJS */
    particlesJS.load("particles-js", "./particles-config.json", () => {
      console.log("Particles.js loaded!");
    });
  },
  methods: {
    selectTab(tab) {
      this.activeTab = tab;
      this.navOpen = false; // zatvor hamburger menu po kliknutí
    }
  }
};
</script>


<style scoped>
/* Reset and base styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
html, body {
  width: 100%;
  overflow-x: hidden;
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
}

/* Make text unselectable */
.unselectable {
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

/* Wrapper that centers content horizontally and allows vertical scroll if needed */
.portfolio-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding: 20px;
}

/* Background particles */
#particles-js {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

/* Main content area */
.portfolio-content {
  width: 45%;
  max-width: 900px;
  background-color: #ffffff;
  padding: 20px 30px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border-radius: 8px;
}

/* Profile section */
.profile-section {
  text-align: center;
  margin-bottom: 20px;
}
.profile-name {
  font-size: 34px; 
  font-weight: bold;
  margin-bottom: 10px;
  word-wrap: break-word;
}
.profile-location {
  font-size: 16px;
  color: #666;
  margin-bottom: 5px;
}
.profile-occupation {
  font-size: 22px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}
.profile-intro {
  font-size: 14px;
  color: #777;
  margin-bottom: 10px;
  line-height: 1.5;
}

/* Social icons nav */
.social-nav {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 15px;
}
.social-icon {
  display: inline-flex;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  filter: grayscale(100%);
  opacity: 0.8;
  transition: opacity 0.3s;
}
.social-icon:hover {
  opacity: 1;
}
.social-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Horizontal rule */
hr {
  margin: 20px 0;
}

/* Tab navigation */
.tab-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 20px;
}
.desktop-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}
.mobile-menu {
  display: none;
  position: absolute;
  right: 0;
}
.hamburger {
  width: 32px;
  height: 24px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.hamburger span {
  display: block;
  height: 3px;
  background-color: #333;
  border-radius: 2px;
}
.mobile-dropdown {
  position: absolute;
  top: 32px;
  right: 0;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  border-radius: 5px;
  padding: 10px;
}
.mobile-dropdown .tab-item {
  padding: 8px 16px;
  margin-bottom: 5px;
  border-radius: 4px;
  background-color: #f9f9f9;
  text-align: center;
}
.mobile-dropdown .tab-item:hover {
  background-color: #f0f0f0;
}

/* Common tab item styles */
.tab-item {
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 4px;
  color: #333;
  transition: background-color 0.3s;
}
.tab-item.active {
  background-color: #ddd;
}
.desktop-tabs .tab-item:hover {
  background-color: #f0f0f0;
}

/* Tab content */
.tab-content {
  text-align: left;
  font-size: 16px;
  color: #555;
  line-height: 1.5;
}
.tab-content h2 {
  text-align: center;
  font-size: 22px;
  margin-bottom: 20px;
  color: #333;
}

/* Scrollable content within tabs */
.scrollable-content {
  max-height: 350px;
  overflow-y: auto;
  padding-right: 10px;
  margin-bottom: 10px;
}

/* Content blocks */
.pub-block,
.work-block,
.edu-block {
  margin-bottom: 20px;
  background-color: #fafafa;
  padding: 12px 15px;
  border-radius: 6px;
}
.pub-block h3,
.work-block h3,
.edu-block h3 {
  font-size: 18px;
  margin-bottom: 5px;
  color: #444;
  line-height: 1.3;
}
.pub-block p,
.work-block p,
.edu-block p {
  font-size: 15px;
  color: #666;
  line-height: 1.4;
}
.pub-block p a,
.work-block p a,
.edu-block p a {
  color: #007BFF;
  text-decoration: none;
}
.pub-block p a:hover,
.work-block p a:hover,
.edu-block p a:hover {
  text-decoration: underline;
}

/* Hackathon achievements list */
.hack-list {
  list-style: disc inside;
  margin: 10px 0 20px 0;
  padding-left: 10px;
  color: #666;
  line-height: 1.4;
}
.hack-list li {
  margin-bottom: 8px;
}

/* Media query for mid-range screens */
@media (max-width: 900px) {
  .portfolio-content {
    width: 80%;
  }
}

/* Media query for mobile screens */
@media (max-width: 768px) {
  .desktop-tabs {
    display: none;
  }
  .mobile-menu {
    display: block;
  }
  .portfolio-content {
    width: 90%;
    max-width: 100%;
    padding: 15px 20px;
    box-shadow: none;
    border-radius: 0;
  }
  .profile-name {
    font-size: 26px;
  }
  .profile-occupation {
    font-size: 18px;
  }
  .tab-content {
    font-size: 15px;
  }
  .scrollable-content {
    max-height: 250px;
  }
}
</style>