import path from "path";
import { spawnSync } from "child_process";

const deckName = process.argv[2];

if (!deckName) {
  console.error("Deck name is required.");
  process.exit(1);
}

const repoName = "present-anything";
const rootDir = process.cwd();
const entry = path.resolve(rootDir, "decks", deckName, "slides.md");
const outDir = path.resolve(rootDir, "docs", deckName);
const base = `/${repoName}/${deckName}/`;

const result = spawnSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["slidev", "build", entry, "--out", outDir, "--base", base],
  {
    cwd: rootDir,
    stdio: "inherit"
  }
);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
