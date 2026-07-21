<template>
  <section class="blog-admin-panel" aria-label="Blog editor">
    <div class="blog-admin-head">
      <div>
        <p class="eyebrow">Blog CMS</p>
        <h2>Articles</h2>
        <p>Draft articles, timeline sections, notes, and photos stored through the portfolio API.</p>
      </div>
      <button type="button" class="primary-action" @click="createArticle">New article</button>
    </div>

    <p v-if="message" class="status-message">{{ message }}</p>
    <p v-if="error" class="error-message" role="alert">{{ error }}</p>

    <div class="blog-editor-layout">
      <aside class="article-list" aria-label="Articles">
        <button
          v-for="article in articles"
          :key="article.id"
          type="button"
          :class="{ active: article.id === activeArticleId }"
          @click="selectArticle(article)"
        >
          <span>{{ article.status }}</span>
          <strong>{{ article.title }}</strong>
          <small>/{{ article.id }}</small>
        </button>
        <p v-if="!articles.length && !loading" class="empty-state">No articles yet.</p>
      </aside>

      <form class="article-editor" @submit.prevent="saveArticle">
        <div class="editor-topline">
          <strong>{{ draft.id ? `/${draft.id}` : "New article" }}</strong>
          <span v-if="loading">Loading</span>
          <span v-else-if="saving">Saving</span>
        </div>

        <div class="form-grid">
          <label>
            Slug
            <input v-model.trim="draft.id" type="text" placeholder="phd-timeline" required />
          </label>
          <label>
            Status
            <select v-model="draft.status">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
          <label>
            Layout
            <select v-model="draft.layout">
              <option value="timeline">Timeline</option>
              <option value="gallery">Gallery</option>
            </select>
          </label>
          <label>
            Eyebrow
            <input v-model.trim="draft.eyebrow" type="text" placeholder="First article draft" />
          </label>
          <label>
            Title
            <input v-model.trim="draft.title" type="text" placeholder="PhD Timeline" required />
          </label>
        </div>

        <label>
          Intro
          <textarea v-model.trim="draft.intro" rows="4" placeholder="Short article intro"></textarea>
        </label>

        <div class="section-toolbar">
          <h3>{{ draft.layout === "gallery" ? "Gallery items" : "Timeline sections" }}</h3>
          <button type="button" @click="addSection">Add section</button>
        </div>

        <article
          v-for="(section, sectionIndex) in draft.sections"
          :key="section.localKey"
          class="section-editor"
        >
          <div class="section-title-row">
            <strong>{{ section.title || `Section ${sectionIndex + 1}` }}</strong>
            <button type="button" @click="removeSection(sectionIndex)">Remove</button>
          </div>

          <div class="form-grid">
            <label>
              Section slug
              <input v-model.trim="section.id" type="text" placeholder="sami-2024" />
            </label>
            <label>
              Date
              <input v-model.trim="section.date" type="text" placeholder="2024" />
            </label>
            <label>
              Title
              <input v-model.trim="section.title" type="text" placeholder="Conference title" />
            </label>
            <label>
              Type
              <input v-model.trim="section.type" type="text" placeholder="Conference / Mobility" />
            </label>
            <label>
              Accent
              <input v-model.trim="section.accent" type="text" placeholder="#2b6cb0" />
            </label>
          </div>

          <label>
            Description
            <textarea
              v-model.trim="section.description"
              rows="3"
              placeholder="Short story for this stop"
            ></textarea>
          </label>

          <label>
            Detail popup text
            <textarea
              v-model="section.details"
              rows="5"
              placeholder="Longer text shown in the popup. Separate paragraphs with a blank line."
            ></textarea>
          </label>

          <label>
            Notes
            <textarea
              v-model="section.notesText"
              rows="4"
              placeholder="One bullet per line"
            ></textarea>
          </label>

          <label>
            Photo caption
            <input v-model.trim="section.caption" type="text" placeholder="Venue and talk photos" />
          </label>

          <div class="photos-toolbar">
            <h4>Files</h4>
            <button type="button" @click="addFile(section)">Add file</button>
          </div>

          <div v-if="section.files.length" class="file-editor-list">
            <div v-for="(file, fileIndex) in section.files" :key="file.localKey" class="file-editor-row">
              <label>
                Label
                <input v-model.trim="file.label" type="text" placeholder="Presentation" />
              </label>
              <label>
                URL
                <input v-model.trim="file.url" type="url" placeholder="https://..." />
              </label>
              <label>
                Type
                <input v-model.trim="file.type" type="text" placeholder="presentation" />
              </label>
              <div class="file-row-actions">
                <label class="file-control">
                  Upload
                  <input
                    type="file"
                    accept=".pdf,.ppt,.pptx,.doc,.docx,.zip,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                    @change="uploadAttachment(sectionIndex, fileIndex, $event)"
                  />
                </label>
                <button type="button" @click="removeFile(section, fileIndex)">Remove</button>
              </div>
            </div>
          </div>

          <div class="photos-toolbar">
            <h4>Photos</h4>
            <button type="button" @click="addPhoto(section)">Add photo</button>
          </div>

          <div class="photo-editor-grid">
            <div v-for="(photo, photoIndex) in section.photos" :key="photo.localKey" class="photo-editor">
              <div
                class="photo-preview"
                :style="photo.url ? { backgroundImage: `url(${photo.url})` } : null"
              >
                <span>{{ photo.label || `Photo ${photoIndex + 1}` }}</span>
              </div>

              <label>
                Label
                <input v-model.trim="photo.label" type="text" placeholder="Venue" />
              </label>
              <label>
                URL
                <input v-model.trim="photo.url" type="url" placeholder="https://..." />
              </label>

              <div class="photo-controls">
                <label class="file-control">
                  Upload
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    @change="uploadPhoto(sectionIndex, photoIndex, $event)"
                  />
                </label>
                <button type="button" @click="removePhoto(section, photoIndex)">Remove</button>
              </div>

              <p v-if="uploadingKey === photo.localKey" class="mini-status">Uploading...</p>
            </div>
          </div>
          <p v-if="uploadingKey && uploadingKey.startsWith('file-')" class="mini-status">
            Uploading file...
          </p>
        </article>

        <div class="editor-actions">
          <button type="submit" class="primary-action" :disabled="saving">
            {{ saving ? "Saving" : "Save article" }}
          </button>
          <button type="button" class="danger-action" :disabled="!activeArticleId" @click="deleteArticle">
            Delete
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<script>
function createLocalKey() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createPhoto(index = 0) {
  const rotations = ["-7deg", "4deg", "-2deg"];
  const lifts = ["10px", "-8px", "18px"];

  return {
    localKey: createLocalKey(),
    label: `Photo ${index + 1}`,
    url: "",
    rotation: rotations[index % rotations.length],
    lift: lifts[index % lifts.length]
  };
}

function createFile(index = 0) {
  return {
    localKey: createLocalKey(),
    label: index === 0 ? "Presentation" : `File ${index + 1}`,
    url: "",
    type: "presentation",
    download: ""
  };
}

function createSection() {
  return {
    localKey: createLocalKey(),
    id: "",
    date: "",
    title: "",
    type: "",
    description: "",
    details: "",
    notesText: "",
    caption: "",
    accent: "#2b6cb0",
    files: [createFile(0)],
    photos: [createPhoto(0), createPhoto(1), createPhoto(2)]
  };
}

function createEmptyArticle() {
  return {
    id: "",
    status: "draft",
    layout: "timeline",
    eyebrow: "Draft",
    title: "",
    intro: "",
    sections: [createSection()]
  };
}

function cloneArticleForEditor(article) {
  return {
    id: article.id || "",
    status: article.status || "draft",
    layout: article.layout === "gallery" ? "gallery" : "timeline",
    eyebrow: article.eyebrow || "",
    title: article.title || "",
    intro: article.intro || "",
    sections: (Array.isArray(article.sections) ? article.sections : []).map((section) => ({
      localKey: createLocalKey(),
      id: section.id || "",
      date: section.date || "",
      title: section.title || "",
      type: section.type || "",
      description: section.description || "",
      details: section.details || "",
      notesText: Array.isArray(section.notes) ? section.notes.join("\n") : "",
      caption: section.caption || "",
      accent: section.accent || "#2b6cb0",
      files: (Array.isArray(section.files) ? section.files : []).map((file, fileIndex) => ({
        localKey: createLocalKey(),
        label: file.label || `File ${fileIndex + 1}`,
        url: file.url || "",
        type: file.type || "download",
        download: file.download || ""
      })),
      photos: (Array.isArray(section.photos) ? section.photos : []).map((photo, photoIndex) => ({
        localKey: createLocalKey(),
        label: photo.label || `Photo ${photoIndex + 1}`,
        url: photo.url || "",
        rotation: photo.rotation || createPhoto(photoIndex).rotation,
        lift: photo.lift || createPhoto(photoIndex).lift
      }))
    }))
  };
}

function buildArticlePayload(draft) {
  return {
    id: draft.id,
    status: draft.status,
    layout: draft.layout,
    eyebrow: draft.eyebrow,
    title: draft.title,
    intro: draft.intro,
    sections: draft.sections.map((section) => ({
      id: section.id,
      date: section.date,
      title: section.title,
      type: section.type,
      description: section.description,
      details: section.details,
      notes: section.notesText
        .split(/\r?\n/)
        .map((note) => note.trim())
        .filter(Boolean),
      caption: section.caption,
      accent: section.accent,
      files: section.files.map((file) => ({
        label: file.label,
        url: file.url,
        type: file.type,
        download: file.download
      })),
      photos: section.photos.map((photo) => ({
        label: photo.label,
        url: photo.url,
        rotation: photo.rotation,
        lift: photo.lift
      }))
    }))
  };
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read selected image."));
    reader.readAsDataURL(file);
  });
}

export default {
  name: "BlogAdminPanel",
  props: {
    password: {
      type: String,
      required: true
    },
    apiBaseUrl: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      articles: [],
      activeArticleId: "",
      draft: createEmptyArticle(),
      loading: false,
      saving: false,
      uploadingKey: "",
      error: "",
      message: ""
    };
  },
  mounted() {
    this.loadArticles();
  },
  methods: {
    async loadArticles() {
      this.loading = true;
      this.error = "";

      try {
        const response = await fetch(`${this.apiBaseUrl}/api/blog/articles`, {
          headers: {
            "X-Admin-Password": this.password
          },
          cache: "no-store"
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || "Could not load blog articles.");
        }

        this.articles = Array.isArray(payload.articles) ? payload.articles : [];
        if (this.articles.length) {
          this.selectArticle(this.articles[0]);
        } else {
          this.createArticle();
        }
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    selectArticle(article) {
      this.activeArticleId = article.id;
      this.draft = cloneArticleForEditor(article);
      this.message = "";
      this.error = "";
    },
    createArticle() {
      this.activeArticleId = "";
      this.draft = createEmptyArticle();
      this.message = "";
      this.error = "";
    },
    addSection() {
      this.draft.sections.push(createSection());
    },
    removeSection(index) {
      this.draft.sections.splice(index, 1);
    },
    addPhoto(section) {
      section.photos.push(createPhoto(section.photos.length));
    },
    removePhoto(section, index) {
      section.photos.splice(index, 1);
    },
    addFile(section) {
      section.files.push(createFile(section.files.length));
    },
    removeFile(section, index) {
      section.files.splice(index, 1);
    },
    async saveArticle() {
      if (!this.draft.title || !this.draft.id) {
        this.error = "Article needs a title and slug.";
        return;
      }

      this.saving = true;
      this.error = "";
      this.message = "";

      try {
        const endpoint = this.activeArticleId
          ? `${this.apiBaseUrl}/api/blog/articles/${encodeURIComponent(this.activeArticleId)}`
          : `${this.apiBaseUrl}/api/blog/articles`;
        const response = await fetch(endpoint, {
          method: this.activeArticleId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Admin-Password": this.password
          },
          body: JSON.stringify(buildArticlePayload(this.draft))
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || "Could not save article.");
        }

        this.articles = Array.isArray(payload.articles) ? payload.articles : [];
        this.activeArticleId = payload.article.id;
        this.draft = cloneArticleForEditor(payload.article);
        this.message = "Saved.";
      } catch (error) {
        this.error = error.message;
      } finally {
        this.saving = false;
      }
    },
    async deleteArticle() {
      if (!this.activeArticleId || !window.confirm(`Delete /${this.activeArticleId}?`)) {
        return;
      }

      this.saving = true;
      this.error = "";
      this.message = "";

      try {
        const response = await fetch(
          `${this.apiBaseUrl}/api/blog/articles/${encodeURIComponent(this.activeArticleId)}`,
          {
            method: "DELETE",
            headers: {
              "X-Admin-Password": this.password
            }
          }
        );
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || "Could not delete article.");
        }

        this.articles = Array.isArray(payload.articles) ? payload.articles : [];
        if (this.articles.length) {
          this.selectArticle(this.articles[0]);
        } else {
          this.createArticle();
        }
        this.message = "Deleted.";
      } catch (error) {
        this.error = error.message;
      } finally {
        this.saving = false;
      }
    },
    async uploadPhoto(sectionIndex, photoIndex, event) {
      const file = event.target.files && event.target.files[0];
      if (!file) {
        return;
      }

      const photo = this.draft.sections[sectionIndex].photos[photoIndex];
      this.uploadingKey = photo.localKey;
      this.error = "";
      this.message = "";

      try {
        const dataUrl = await readFileAsDataUrl(file);
        const response = await fetch(`${this.apiBaseUrl}/api/blog/uploads`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Admin-Password": this.password
          },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
            dataUrl
          })
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || "Could not upload image.");
        }

        photo.url = payload.url;
        if (!photo.label || /^Photo \d+$/.test(photo.label)) {
          photo.label = file.name.replace(/\.[^.]+$/, "");
        }
        this.message = "Image uploaded. Save the article to keep it.";
      } catch (error) {
        this.error = error.message;
      } finally {
        this.uploadingKey = "";
        event.target.value = "";
      }
    },
    async uploadAttachment(sectionIndex, fileIndex, event) {
      const file = event.target.files && event.target.files[0];
      if (!file) {
        return;
      }

      const attachment = this.draft.sections[sectionIndex].files[fileIndex];
      this.uploadingKey = `file-${attachment.localKey}`;
      this.error = "";
      this.message = "";

      try {
        const dataUrl = await readFileAsDataUrl(file);
        const response = await fetch(`${this.apiBaseUrl}/api/blog/files`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Admin-Password": this.password
          },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
            dataUrl
          })
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || "Could not upload file.");
        }

        attachment.url = payload.url;
        attachment.download = payload.filename;
        if (!attachment.label || /^File \d+$/.test(attachment.label)) {
          attachment.label = file.name.replace(/\.[^.]+$/, "");
        }
        this.message = "File uploaded. Save the article to keep it.";
      } catch (error) {
        this.error = error.message;
      } finally {
        this.uploadingKey = "";
        event.target.value = "";
      }
    }
  }
};
</script>

<style scoped>
.blog-admin-panel {
  display: grid;
  gap: 16px;
}

.blog-admin-head,
.editor-topline,
.section-title-row,
.section-toolbar,
.photos-toolbar,
.editor-actions,
.photo-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.blog-admin-head {
  border: 1px solid rgba(13, 27, 42, 0.08);
  border-radius: 18px;
  padding: 18px;
  background: linear-gradient(135deg, #f7fbff, #eef6ff);
}

.eyebrow {
  margin: 0 0 5px;
  color: #2b6cb0;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}

h2,
h3,
h4,
p {
  margin: 0;
}

h2 {
  color: #10233d;
  font-size: 24px;
}

h3,
h4 {
  color: #12355f;
}

.blog-admin-head p:not(.eyebrow) {
  margin-top: 8px;
  color: #4b6c8d;
  line-height: 1.5;
}

.blog-editor-layout {
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}

.article-list {
  position: sticky;
  top: 16px;
  display: grid;
  gap: 8px;
}

.article-list button,
.article-editor,
.section-editor {
  border: 1px solid rgba(13, 27, 42, 0.08);
  border-radius: 16px;
  background: #f7fbff;
}

.article-list button {
  display: grid;
  gap: 4px;
  padding: 12px;
  color: #163a66;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.article-list button.active,
.article-list button:hover,
.article-list button:focus-visible {
  background: #e5f1ff;
  outline: none;
}

.article-list span,
.editor-topline span,
.status-message,
.mini-status {
  color: #2b6cb0;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}

.article-list small {
  min-width: 0;
  overflow: hidden;
  color: #5a748d;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.article-editor {
  display: grid;
  gap: 16px;
  padding: 16px;
}

.editor-topline {
  color: #12355f;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

label {
  display: grid;
  gap: 6px;
  color: #31577d;
  font-size: 12px;
  font-weight: 900;
}

input,
select,
textarea {
  width: 100%;
  border: 1px solid rgba(22, 58, 102, 0.16);
  border-radius: 12px;
  padding: 10px 11px;
  background: #ffffff;
  color: #10233d;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
}

textarea {
  resize: vertical;
}

input:focus-visible,
select:focus-visible,
textarea:focus-visible,
button:focus-visible {
  outline: 3px solid rgba(43, 108, 176, 0.34);
  outline-offset: 2px;
}

button {
  border: 0;
  border-radius: 999px;
  padding: 10px 13px;
  background: #e5f1ff;
  color: #163a66;
  font: inherit;
  font-size: 12px;
  font-weight: 900;
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.primary-action {
  background: #163a66;
  color: #ffffff;
}

.danger-action {
  background: #fff1f1;
  color: #a02323;
}

.error-message {
  color: #a02323;
  font-size: 13px;
  font-weight: 800;
}

.status-message {
  color: #196147;
}

.empty-state {
  color: #5a748d;
  font-size: 13px;
  font-weight: 700;
}

.section-editor {
  display: grid;
  gap: 14px;
  padding: 14px;
  background: #ffffff;
}

.section-title-row {
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(13, 27, 42, 0.08);
}

.photo-editor-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.file-editor-list {
  display: grid;
  gap: 10px;
}

.file-editor-row {
  display: grid;
  grid-template-columns: minmax(120px, 0.8fr) minmax(180px, 1.4fr) minmax(110px, 0.6fr) auto;
  gap: 10px;
  align-items: end;
  border: 1px solid rgba(13, 27, 42, 0.08);
  border-radius: 14px;
  padding: 10px;
  background: #ffffff;
}

.file-row-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.photo-editor {
  display: grid;
  gap: 10px;
  min-width: 0;
  border: 1px solid rgba(13, 27, 42, 0.08);
  border-radius: 14px;
  padding: 10px;
  background: #f7fbff;
}

.photo-preview {
  min-height: 130px;
  display: flex;
  align-items: flex-end;
  border-radius: 10px;
  overflow: hidden;
  padding: 10px;
  background:
    linear-gradient(135deg, #dcecff, #fff3df),
    repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.35) 0 1px, transparent 1px 12px);
  background-position: center;
  background-size: cover;
}

.photo-preview span {
  border-radius: 999px;
  padding: 6px 8px;
  background: rgba(255, 255, 255, 0.82);
  color: #12355f;
  font-size: 11px;
  font-weight: 900;
}

.file-control {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 10px 13px;
  background: #e5f1ff;
  color: #163a66;
  cursor: pointer;
}

.file-control input {
  display: none;
}

@media (max-width: 920px) {
  .blog-editor-layout {
    grid-template-columns: 1fr;
  }

  .article-list {
    position: static;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .photo-editor-grid {
    grid-template-columns: 1fr;
  }

  .file-editor-row {
    grid-template-columns: 1fr;
  }

  .file-row-actions {
    align-items: stretch;
    flex-direction: column;
  }
}

@media (max-width: 620px) {
  .blog-admin-head,
  .editor-topline,
  .section-title-row,
  .section-toolbar,
  .photos-toolbar,
  .editor-actions,
  .photo-controls {
    align-items: stretch;
    flex-direction: column;
  }

  .form-grid,
  .article-list {
    grid-template-columns: 1fr;
  }
}
</style>
