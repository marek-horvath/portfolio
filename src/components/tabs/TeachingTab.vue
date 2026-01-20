<template>
  <div class="teaching-tab">
    <h2>Teaching</h2>
    <div class="teaching-columns">
      <section class="teaching-section">
        <h3 class="teaching-section-title">Teaching History</h3>
        <div>
          <div class="work-block">
            <h3>Spring 2026</h3>
            <ul class="subject-list">
              <li>C Programming (EN) (lecture & lab)</li>
              <li>Database Systems (1 lab)</li>
            </ul>
          </div>

          <div class="work-block">
            <h3>Fall 2025</h3>
            <ul class="subject-list">
              <li>User Interfaces & User Experience (SK) (1 lab)</li>
              <li>User Interfaces & User Experience (EN) (lecture & lab)</li>
              <li>Fundamentals of Algorithms and Programming (EN) (lecture & lab)</li>
              <li>Advanced Software Engineering (2 labs)</li>
            </ul>
          </div>

          <div class="work-block">
            <h3>Spring 2025</h3>
            <ul class="subject-list">
              <li>Database Systems (2 labs)</li>
              <li>Current Trends in Informatics 2 (EN) (lecture & lab)</li>
              <li>C Programming (EN) (lecture & lab)</li>
            </ul>
          </div>

          <div class="work-block">
            <h3>Fall 2024</h3>
            <ul class="subject-list">
              <li>Requirements Engineering (2 labs)</li>
              <li>User Interfaces & User Experience (EN) (lecture & lab)</li>
              <li>Fundamentals of Algorithms and Programming (EN) (lecture & lab)</li>
              <li>Current Trends in Informatics 1 (EN) (lecture)</li>
            </ul>
          </div>

          <div class="work-block">
            <h3>Spring 2024</h3>
            <ul class="subject-list">
              <li>Current Trends in Informatics 1 (EN) (lecture)</li>
              <li>C Programming (EN) (lecture & lab)</li>
              <li>Information Systems Security (2 labs)</li>
            </ul>
          </div>

          <div class="work-block">
            <h3>Fall 2023</h3>
            <ul class="subject-list">
              <li>User Interfaces & User Experience (SK) (2 labs)</li>
              <li>User Interfaces & User Experience (EN) (lecture & lab)</li>
              <li>Fundamentals of Algorithms and Programming (EN) (lecture & lab)</li>
              <li>Current Trends in Informatics 1 (EN) (lecture)</li>
            </ul>
          </div>

          <div class="work-block">
            <h3>Spring 2023</h3>
            <ul class="subject-list">
              <li>C Programming (2 labs)</li>
            </ul>
          </div>

          <div class="work-block">
            <h3>Fall 2022</h3>
            <ul class="subject-list">
              <li>User Interfaces & User Experience (SK) (1 lab)</li>
              <li>Fundamentals of Algorithms and Programming (1 lab)</li>
            </ul>
          </div>

          <div class="work-block">
            <h3>Spring 2022</h3>
            <ul class="subject-list">
              <li>C Programming (2 labs)</li>
            </ul>
          </div>

          <div class="work-block">
            <h3>Fall 2021</h3>
            <ul class="subject-list">
              <li>Fundamentals of Algorithms and Programming (2 labs)</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="teaching-section">
        <h3 class="teaching-section-title">Thesis Supervision (Topics)</h3>
        <div>
          <div class="work-block">
            <h3>2026</h3>
            <ul class="hack-list">
              <li>TUKE showcase</li>
              <li>Department dashboard</li>
              <li>Anonymized style profile generation from code structure</li>
              <li>Reverse identification experiment</li>
              <li>Impact of programming language on author identifiability</li>
              <li>Automated code-style categorization by typologies</li>
              <li>Integrity validation and style deviation detection</li>
              <li>Normalization strategies for source-code authorship attribution</li>
              <li>Sandboxed environment for behavioral biometrics collection</li>
              <li>CFG vs AST vs token embeddings comparison</li>
              <li>Synthetic code dataset generator for identification systems</li>
              <li>Vector representation of source code</li>
              <li>Traditional classifiers for programmer attribution</li>
              <li>Behavioral + static features for authorship attribution</li>
              <li>Clustering visualization of similar source code</li>
              <li>Personalized programming education from behavioral and static data</li>
              <li>AST stylometric feature extraction and mapping</li>
            </ul>
          </div>

          <div class="work-block">
            <h3>2025</h3>
            <ul class="hack-list">
              <li>Comparison of PWA frameworks</li>
              <li>Keystroke dynamics tracking application</li>
              <li>Web platform for mental disorder diagnostics</li>
              <li>Web platform for employees</li>
              <li>Java API for OS and hardware information</li>
              <li>Steganography for integrity of student assignments</li>
              <li>Machine learning for programmer identification</li>
              <li>Energy consumption visualization per code component</li>
              <li>Mobile app for mental health support</li>
              <li>Digitization and automation in energy market management</li>
              <li>Automated program testing system</li>
              <li>Educational game for algorithmic fundamentals</li>
              <li>Source-code similarity via structural and stylistic features</li>
            </ul>
          </div>

          <div class="work-block">
            <h3>2024</h3>
            <ul class="hack-list">
              <li>Optimizing security protocols through simulated cyberattacks</li>
              <li>Vulnerability scanning system for web applications</li>
              <li>Protection strategies against vulnerabilities in cloud systems</li>
              <li>Information system for sports clubs</li>
              <li>Tool for quantifying and analyzing technical debt in software</li>
              <li>Monolith vs microservices in a document-sharing app</li>
              <li>Application for dyslexia diagnosis and treatment support</li>
              <li>Web platform for code documentation generation</li>
              <li>3D web multiplayer game using WebSockets</li>
              <li>Monitoring and analytics tool for web site activity</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

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
