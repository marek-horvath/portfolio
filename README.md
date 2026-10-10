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

## Local development with Docker

Prerequisite: Docker Desktop for Windows with Docker Compose enabled.

The easiest way to start the complete application is to double-click `start.bat`.
It checks Docker, creates a local `.env` with a generated admin password when
needed, builds and starts the frontend and API, waits until both are healthy,
and opens the portfolio in the default browser.

Default Docker URLs:

- Portfolio: `http://127.0.0.1:8081/portfolio/`
- Admin: `http://127.0.0.1:8081/portfolio/admin`
- Blog: `http://127.0.0.1:8081/portfolio/blog`
- API health: `http://127.0.0.1:3002/api/health`

Stop the application by double-clicking `stop.bat`. This runs
`docker compose down` and keeps analytics, blog content, and uploaded files in
the `portfolio_data` Docker volume.

Source directories are mounted into the containers. The Vue development server
uses hot reload and the Node API restarts in watch mode. Normal source changes
therefore do not require a rebuild. After changing dependencies or Docker
configuration, run `start.bat` again or use:

```bash
docker compose up -d --build
```

Useful commands:

```bash
docker compose logs -f
docker compose ps
docker compose down
```

Copy `.env.example` to `.env` when configuring ports or the local admin password
manually. The local `.env` is ignored by git. The original non-Docker `npm`
workflow described above remains available.

## Blog route

The blog is available through `/portfolio/blog`, with GitHub Pages fallback files generated during build so direct navigation works on the deployed static site.

Current blog sections:

- PhD
- Travel
- Hackathons
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
