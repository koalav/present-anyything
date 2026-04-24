import path from "path";
import { spawnSync } from "child_process";
import fs from "fs";
import { getDeckBase, getSiteBase, outputRoot } from "./site-config.js";

const deckName = process.argv[2];

if (!deckName) {
  console.error("Deck name is required.");
  process.exit(1);
}

const rootDir = process.cwd();
const entry = path.resolve(rootDir, "decks", deckName, "slides.md");
const outDir = path.resolve(rootDir, outputRoot, deckName);
const base = getDeckBase(deckName);
const downloadsDir = path.resolve(rootDir, outputRoot, "downloads");
const pdfPath = path.resolve(downloadsDir, `${deckName}.pdf`);
const pdfUrl = `${getSiteBase()}downloads/${deckName}.pdf`;

function runSlidev(args) {
  const result = spawnSync(
    process.platform === "win32" ? "npx.cmd" : "npx",
    args,
    {
      cwd: rootDir,
      stdio: "inherit"
    }
  );

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function injectDownloadLink(targetFile) {
  if (!fs.existsSync(targetFile)) {
    return;
  }

  const marker = "present-anything-download-link";
  const html = fs.readFileSync(targetFile, "utf8");

  if (html.includes(marker)) {
    return;
  }

  const styleBlock = `
  <style id="present-anything-download-style">
    .present-anything-download-link {
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 2147483647;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      border-radius: 999px;
      border: 1px solid rgba(148, 163, 184, 0.35);
      background: rgba(15, 23, 42, 0.88);
      color: #f8fafc;
      font: 600 14px/1.2 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      text-decoration: none;
      letter-spacing: -0.01em;
      box-shadow: 0 14px 30px rgba(15, 23, 42, 0.24);
      backdrop-filter: blur(8px);
    }

    .present-anything-download-link:hover,
    .present-anything-download-link:focus-visible {
      background: rgba(30, 41, 59, 0.96);
      border-color: rgba(148, 163, 184, 0.6);
      outline: none;
    }

    @media (max-width: 640px) {
      .present-anything-download-link {
        top: auto;
        right: 12px;
        bottom: 12px;
        padding: 9px 12px;
        font-size: 13px;
      }
    }
  </style>`;

  const linkBlock = `
  <a
    id="${marker}"
    class="present-anything-download-link"
    href="${pdfUrl}"
    download
    target="_blank"
    rel="noopener"
    aria-label="이 발표 자료 PDF 다운로드"
  >PDF 다운로드</a>`;

  const withStyle = html.replace("</head>", `${styleBlock}\n</head>`);
  const withLink = withStyle.replace("</body>", `${linkBlock}\n</body>`);
  fs.writeFileSync(targetFile, withLink);
}

runSlidev(["slidev", "build", entry, "--out", outDir, "--base", base]);

fs.mkdirSync(downloadsDir, { recursive: true });
runSlidev([
  "slidev",
  "export",
  entry,
  "--output",
  pdfPath,
  "--format",
  "pdf",
  "--wait-until",
  "networkidle",
  "--wait",
  "1500",
  "--timeout",
  "180000"
]);

injectDownloadLink(path.join(outDir, "index.html"));
injectDownloadLink(path.join(outDir, "404.html"));
