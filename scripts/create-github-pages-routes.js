const fs = require("fs");
const path = require("path");

const distDir = path.join(__dirname, "..", "dist");
const basePath = "/portfolio/";
const shortcutRoutes = [
  "li",
  "linkedin",
  "ig",
  "instagram",
  "cv",
  "resume",
  "scholar",
  "gs",
  "email",
  "mail"
];

function createRedirectPage(targetPath) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta http-equiv="refresh" content="0;url=${targetPath}">
    <title>Redirecting...</title>
  </head>
  <body>
    <script>window.location.replace(${JSON.stringify(targetPath)});</script>
  </body>
</html>
`;
}

function writeRoute(route, targetPath) {
  const routeDir = path.join(distDir, route);
  fs.mkdirSync(routeDir, { recursive: true });
  fs.writeFileSync(path.join(routeDir, "index.html"), createRedirectPage(targetPath), "utf8");
}

if (!fs.existsSync(distDir)) {
  throw new Error("dist directory does not exist. Run the Vue build first.");
}

writeRoute("admin", `${basePath}?admin=1`);
shortcutRoutes.forEach((route) => {
  writeRoute(route, `${basePath}?source=${encodeURIComponent(route)}`);
});

console.log(`Generated ${shortcutRoutes.length + 1} GitHub Pages redirect routes.`);
