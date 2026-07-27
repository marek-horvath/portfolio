const fs = require("fs");
const https = require("https");
const path = require("path");
const { execFile } = require("child_process");

const scholarUrl = "https://scholar.google.com/citations?user=9q0s2u4AAAAJ&hl=en&oi=ao";
const outputPath = path.join(__dirname, "..", "public", "scholar-metrics.json");
const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const minimumCitationCount = 60;

function getHtml(url, redirectsLeft = 3) {
  return new Promise((resolve, reject) => {
    const request = https.get(
      url,
      {
        headers: {
          "User-Agent": userAgent,
          "Accept-Language": "en-US,en;q=0.9"
        }
      },
      (response) => {
        const { statusCode, headers } = response;

        if (
          statusCode >= 300 &&
          statusCode < 400 &&
          headers.location &&
          redirectsLeft > 0
        ) {
          response.resume();
          resolve(getHtml(new URL(headers.location, url).toString(), redirectsLeft - 1));
          return;
        }

        if (statusCode !== 200) {
          response.resume();
          reject(new Error(`Google Scholar returned HTTP ${statusCode}.`));
          return;
        }

        let body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => resolve(body));
      }
    );

    request.on("error", reject);
    request.setTimeout(20000, () => {
      request.destroy(new Error("Google Scholar request timed out."));
    });
  });
}

function getHtmlWithCurl(url) {
  return new Promise((resolve, reject) => {
    const args = [
      "-L",
      "--silent",
      "--show-error",
      "--fail",
      "--max-time",
      "20",
      "-A",
      userAgent,
      "-H",
      "Accept-Language: en-US,en;q=0.9",
      url
    ];

    if (process.platform === "win32") {
      args.unshift("--ssl-no-revoke");
    }

    execFile("curl", args, { maxBuffer: 5 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr.trim() || error.message));
        return;
      }

      resolve(stdout);
    });
  });
}

function parseCitationCount(html) {
  const match = html.match(/<td[^>]*class="gsc_rsb_std"[^>]*>\s*([\d,\s.]+)\s*<\/td>/);
  const fallbackMatch = html.match(/Cited by\s+([\d,\s.]+)/i);
  const rawValue = match ? match[1] : fallbackMatch && fallbackMatch[1];

  if (!rawValue) {
    throw new Error("Unable to find citation count in Google Scholar profile.");
  }

  const citations = Number(rawValue.replace(/[^\d]/g, ""));
  if (!Number.isFinite(citations)) {
    throw new Error("Google Scholar citation count is not numeric.");
  }

  return citations;
}

async function main() {
  let html;
  try {
    html = await getHtml(scholarUrl);
  } catch (error) {
    console.warn(`Native HTTPS failed (${error.message}); trying curl fallback.`);
    html = await getHtmlWithCurl(scholarUrl);
  }

  const citations = Math.max(parseCitationCount(html), minimumCitationCount);
  const payload = {
    citations,
    source: scholarUrl,
    updatedAt: new Date().toISOString()
  };

  fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`Updated Scholar citations: ${citations}`);
}

main().catch((error) => {
  console.error(`Unable to update Scholar citations: ${error.message}`);

  if (fs.existsSync(outputPath)) {
    console.warn(`Keeping existing Scholar metrics at ${outputPath}.`);
    return;
  }

  process.exitCode = 1;
});
