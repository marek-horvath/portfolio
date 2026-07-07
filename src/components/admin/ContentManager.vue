<template>
  <section class="content-manager">
    <div class="content-toolbar">
      <div>
        <h2>Obsah</h2>
        <p>Projekty, footer datum a zaklad pre clanky ulozene vo VPS DB.</p>
      </div>
      <div class="content-actions">
        <button type="button" @click="loadContent" :disabled="loading || saving">
          {{ loading ? "Nacitavam" : "Nacitat" }}
        </button>
        <button type="button" class="primary" @click="saveContent" :disabled="loading || saving || !content">
          {{ saving ? "Ukladam" : "Ulozit" }}
        </button>
      </div>
    </div>

    <p v-if="message" class="content-message">{{ message }}</p>
    <p v-if="error" class="content-error" role="alert">{{ error }}</p>

    <div v-if="content" class="content-layout">
      <section class="content-section">
        <div class="section-heading">
          <h3>Projekty</h3>
          <button type="button" @click="addProject">+ Projekt</button>
        </div>

        <article v-for="(project, index) in content.projects" :key="project.localKey" class="editor-card">
          <div class="editor-top">
            <label class="check-row">
              <input v-model="project.visible" type="checkbox" />
              Viditelny
            </label>
            <label>
              Poradie
              <input v-model.number="project.order" type="number" min="0" step="10" />
            </label>
            <button type="button" class="danger" @click="removeProject(index)">Zmazat</button>
          </div>

          <div class="form-grid">
            <label>
              ID
              <input v-model.trim="project.id" type="text" placeholder="napr. novy-projekt" />
            </label>
            <label>
              URL
              <input v-model.trim="project.url" type="url" placeholder="https://..." />
            </label>
            <label>
              Image key
              <input v-model.trim="project.imageKey" list="image-key-options" type="text" />
            </label>
            <label>
              Image URL
              <input v-model.trim="project.imageUrl" type="url" placeholder="volitelne" />
            </label>
          </div>

          <div class="language-grid">
            <fieldset>
              <legend>EN</legend>
              <label>
                Nazov
                <input v-model.trim="project.en.name" type="text" />
              </label>
              <label>
                Typ
                <input v-model.trim="project.en.type" type="text" />
              </label>
              <label>
                Alt text
                <input v-model.trim="project.en.previewAlt" type="text" />
              </label>
              <label>
                Popis
                <textarea v-model.trim="project.en.description" rows="3"></textarea>
              </label>
              <label>
                Tagy
                <input v-model.trim="project.en.tagsInput" type="text" placeholder="tag, tag, tag" />
              </label>
            </fieldset>

            <fieldset>
              <legend>SK</legend>
              <label>
                Nazov
                <input v-model.trim="project.sk.name" type="text" />
              </label>
              <label>
                Typ
                <input v-model.trim="project.sk.type" type="text" />
              </label>
              <label>
                Alt text
                <input v-model.trim="project.sk.previewAlt" type="text" />
              </label>
              <label>
                Popis
                <textarea v-model.trim="project.sk.description" rows="3"></textarea>
              </label>
              <label>
                Tagy
                <input v-model.trim="project.sk.tagsInput" type="text" placeholder="tag, tag, tag" />
              </label>
            </fieldset>
          </div>
        </article>
      </section>

      <aside class="side-sections">
        <section class="content-section compact">
          <h3>Texty</h3>
          <label>
            Last updated EN
            <input v-model.trim="content.textBlocks.lastUpdated.en" type="text" />
          </label>
          <label>
            Last updated SK
            <input v-model.trim="content.textBlocks.lastUpdated.sk" type="text" />
          </label>
        </section>

        <section class="content-section compact">
          <div class="section-heading">
            <h3>Clanky</h3>
            <button type="button" @click="addArticle">+ Clanok</button>
          </div>

          <article v-for="(article, index) in content.articles" :key="article.localKey" class="mini-editor">
            <div class="editor-top">
              <label class="check-row">
                <input v-model="article.visible" type="checkbox" />
                Viditelny
              </label>
              <button type="button" class="danger" @click="removeArticle(index)">Zmazat</button>
            </div>
            <label>
              URL
              <input v-model.trim="article.url" type="url" />
            </label>
            <label>
              EN title
              <input v-model.trim="article.en.title" type="text" />
            </label>
            <label>
              SK title
              <input v-model.trim="article.sk.title" type="text" />
            </label>
            <label>
              EN summary
              <textarea v-model.trim="article.en.summary" rows="2"></textarea>
            </label>
            <label>
              SK summary
              <textarea v-model.trim="article.sk.summary" rows="2"></textarea>
            </label>
          </article>

          <p v-if="!content.articles.length" class="empty-note">Zatial ziadne clanky.</p>
        </section>
      </aside>
    </div>

    <datalist id="image-key-options">
      <option v-for="key in imageKeys" :key="key" :value="key" />
    </datalist>
  </section>
</template>

<script>
const imageKeys = ["revik", "cnk", "seug", "athena", "football", "krajcirstvo", "slovakdle", "dema"];

function createLocalKey() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function tagsToInput(tags) {
  return Array.isArray(tags) ? tags.join(", ") : "";
}

function inputToTags(value) {
  return String(value || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function normalizeLocalizedProject(value = {}) {
  return {
    name: value.name || "",
    type: value.type || "",
    previewAlt: value.previewAlt || "",
    description: value.description || "",
    tagsInput: tagsToInput(value.tags)
  };
}

function normalizeProject(project = {}) {
  return {
    localKey: createLocalKey(),
    id: project.id || "",
    order: Number(project.order || 999),
    visible: project.visible !== false,
    url: project.url || "",
    imageKey: project.imageKey || "",
    imageUrl: project.imageUrl || "",
    en: normalizeLocalizedProject(project.en),
    sk: normalizeLocalizedProject(project.sk)
  };
}

function serializeLocalizedProject(value = {}) {
  return {
    name: value.name || "",
    type: value.type || "",
    previewAlt: value.previewAlt || "",
    description: value.description || "",
    tags: inputToTags(value.tagsInput)
  };
}

function serializeProject(project) {
  return {
    id: project.id,
    order: Number(project.order || 999),
    visible: project.visible !== false,
    url: project.url,
    imageKey: project.imageKey,
    imageUrl: project.imageUrl,
    en: serializeLocalizedProject(project.en),
    sk: serializeLocalizedProject(project.sk)
  };
}

function normalizeLocalizedArticle(value = {}) {
  return {
    title: value.title || "",
    summary: value.summary || "",
    tagsInput: tagsToInput(value.tags)
  };
}

function normalizeArticle(article = {}) {
  return {
    localKey: createLocalKey(),
    id: article.id || "",
    order: Number(article.order || 999),
    visible: article.visible !== false,
    date: article.date || "",
    url: article.url || "",
    en: normalizeLocalizedArticle(article.en),
    sk: normalizeLocalizedArticle(article.sk)
  };
}

function serializeLocalizedArticle(value = {}) {
  return {
    title: value.title || "",
    summary: value.summary || "",
    tags: inputToTags(value.tagsInput)
  };
}

function serializeArticle(article) {
  return {
    id: article.id,
    order: Number(article.order || 999),
    visible: article.visible !== false,
    date: article.date,
    url: article.url,
    en: serializeLocalizedArticle(article.en),
    sk: serializeLocalizedArticle(article.sk)
  };
}

function normalizeContent(content = {}) {
  return {
    textBlocks: {
      lastUpdated: {
        en: content.textBlocks?.lastUpdated?.en || "",
        sk: content.textBlocks?.lastUpdated?.sk || ""
      }
    },
    projects: Array.isArray(content.projects) ? content.projects.map(normalizeProject) : [],
    articles: Array.isArray(content.articles) ? content.articles.map(normalizeArticle) : []
  };
}

function serializeContent(content) {
  return {
    textBlocks: {
      lastUpdated: {
        en: content.textBlocks.lastUpdated.en,
        sk: content.textBlocks.lastUpdated.sk
      }
    },
    projects: content.projects.map(serializeProject),
    articles: content.articles.map(serializeArticle)
  };
}

export default {
  name: "ContentManager",
  props: {
    apiBaseUrl: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      content: null,
      loading: false,
      saving: false,
      error: "",
      message: "",
      imageKeys
    };
  },
  mounted() {
    this.loadContent();
  },
  methods: {
    async loadContent() {
      if (!this.password) {
        return;
      }

      this.loading = true;
      this.error = "";
      this.message = "";

      try {
        const response = await fetch(`${this.apiBaseUrl}/api/admin/content`, {
          headers: {
            "X-Admin-Password": this.password
          },
          cache: "no-store"
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || "Nepodarilo sa nacitat obsah.");
        }

        this.content = normalizeContent(payload.content);
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async saveContent() {
      if (!this.content) {
        return;
      }

      this.saving = true;
      this.error = "";
      this.message = "";

      try {
        const response = await fetch(`${this.apiBaseUrl}/api/admin/content`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-Admin-Password": this.password
          },
          body: JSON.stringify({
            content: serializeContent(this.content)
          })
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || "Nepodarilo sa ulozit obsah.");
        }

        this.content = normalizeContent(payload.content);
        this.message = "Ulozene.";
      } catch (error) {
        this.error = error.message;
      } finally {
        this.saving = false;
      }
    },
    addProject() {
      this.content.projects.unshift(
        normalizeProject({
          id: `project-${Date.now().toString(36)}`,
          order: 5,
          visible: true,
          imageKey: "revik",
          en: {
            name: "New project",
            type: "Website",
            previewAlt: "Preview of the project",
            description: "",
            tags: []
          },
          sk: {
            name: "Novy projekt",
            type: "Web",
            previewAlt: "Nahlad projektu",
            description: "",
            tags: []
          }
        })
      );
    },
    removeProject(index) {
      this.content.projects.splice(index, 1);
    },
    addArticle() {
      this.content.articles.unshift(
        normalizeArticle({
          id: `article-${Date.now().toString(36)}`,
          order: 5,
          visible: true,
          en: { title: "New article", summary: "", tags: [] },
          sk: { title: "Novy clanok", summary: "", tags: [] }
        })
      );
    },
    removeArticle(index) {
      this.content.articles.splice(index, 1);
    }
  }
};
</script>

<style scoped>
.content-manager {
  margin-bottom: 14px;
  padding: 16px;
  border: 1px solid rgba(13, 27, 42, 0.08);
  border-radius: 14px;
  background: #f7fbff;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
}

.content-toolbar,
.section-heading,
.editor-top,
.content-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.content-toolbar {
  justify-content: space-between;
  margin-bottom: 14px;
}

h2,
h3,
p {
  margin: 0;
}

h2 {
  margin-bottom: 4px;
  color: #12355f;
  font-size: 17px;
}

h3 {
  color: #12355f;
  font-size: 15px;
}

.content-toolbar p,
.empty-note {
  color: #4b6c8d;
  font-size: 12px;
  font-weight: 700;
}

button {
  min-height: 36px;
  border: 0;
  border-radius: 999px;
  padding: 8px 12px;
  background: #e5f1ff;
  color: #163a66;
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 900;
}

button.primary {
  background: #163a66;
  color: #f8fbff;
}

button.danger {
  background: #fff0f0;
  color: #9c2b2b;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.62;
}

button:focus-visible,
input:focus-visible,
textarea:focus-visible {
  outline: 3px solid #2b6cb0;
  outline-offset: 2px;
}

.content-message,
.content-error {
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 800;
}

.content-message {
  color: #195f38;
}

.content-error {
  color: #a02323;
}

.content-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.8fr) minmax(300px, 0.9fr);
  gap: 14px;
}

.content-section {
  display: grid;
  gap: 12px;
  min-width: 0;
}

.side-sections {
  display: grid;
  align-content: start;
  gap: 14px;
}

.compact {
  padding: 12px;
  border: 1px solid rgba(13, 27, 42, 0.08);
  border-radius: 12px;
  background: #ffffff;
}

.section-heading {
  justify-content: space-between;
}

.editor-card,
.mini-editor {
  display: grid;
  gap: 12px;
  padding: 12px;
  border: 1px solid rgba(13, 27, 42, 0.08);
  border-radius: 12px;
  background: #ffffff;
}

.editor-top {
  justify-content: space-between;
  flex-wrap: wrap;
}

.form-grid,
.language-grid {
  display: grid;
  gap: 10px;
}

.form-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.language-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

fieldset {
  display: grid;
  gap: 9px;
  margin: 0;
  padding: 10px;
  border: 1px solid rgba(13, 27, 42, 0.08);
  border-radius: 10px;
}

legend {
  padding: 0 5px;
  color: #163a66;
  font-size: 12px;
  font-weight: 900;
}

label {
  display: grid;
  gap: 5px;
  color: #31577d;
  font-size: 12px;
  font-weight: 900;
}

.check-row {
  display: inline-flex;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 7px;
}

input,
textarea {
  width: 100%;
  min-width: 0;
  border: 1px solid rgba(22, 58, 102, 0.18);
  border-radius: 10px;
  padding: 9px 10px;
  background: #ffffff;
  color: #10233d;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
}

textarea {
  resize: vertical;
}

@media (max-width: 980px) {
  .content-layout,
  .language-grid,
  .form-grid {
    grid-template-columns: 1fr;
  }

  .content-toolbar {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
