# Marek Horvath Portfolio

Personal portfolio built with Vue. The main site is a static GitHub Pages app, with a small Node API used for analytics, Google Scholar metrics, and hidden blog content management.

## Local development

Install dependencies:

```bash
npm install
```

Run the portfolio frontend:

```bash
npm run serve
```

Run the local API in a second terminal:

```bash
npm run serve:api
```

Default local URLs:

- Portfolio: `http://127.0.0.1:8081/portfolio/`
- Admin: `http://127.0.0.1:8081/portfolio/admin`
- Hidden blog: `http://127.0.0.1:8081/portfolio/blog`

## Hidden blog route

The blog is intentionally not linked from the main portfolio UI. It is still routable directly through `/portfolio/blog`, with GitHub Pages fallback files generated during build so manual navigation works on the deployed static site.

Current blog sections:

- PhD
- Travel
- Photos

## Checks and build

Run lint:

```bash
npm run lint
```

Build the static site:

```bash
npm run build
```

Deploy GitHub Pages from `dist`:

```bash
npm run deploy
```

## API data

The local API stores runtime data under `server/data/`. That directory is intentionally ignored by git.

Relevant environment variables:

- `ANALYTICS_DB_PATH`
- `ANALYTICS_ADMIN_PASSWORD`
- `BLOG_DB_PATH`
- `BLOG_UPLOAD_DIR`
- `BLOG_FILE_UPLOAD_DIR`
- `ALLOWED_ORIGINS`
