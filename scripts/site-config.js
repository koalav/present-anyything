import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const rootDir = process.cwd();
const packageJsonPath = path.join(rootDir, "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

export const outputRoot = "docs";

function parseRepoName(raw) {
  if (!raw) {
    return "";
  }

  const trimmed = raw.trim();
  const withoutGit = trimmed.replace(/\.git$/i, "");
  const parts = withoutGit.split(/[/:]/);
  return parts[parts.length - 1] || "";
}

function detectRepoName() {
  if (process.env.GITHUB_PAGES_REPO) {
    return parseRepoName(process.env.GITHUB_PAGES_REPO);
  }

  if (process.env.GITHUB_REPOSITORY) {
    return parseRepoName(process.env.GITHUB_REPOSITORY);
  }

  try {
    const remoteUrl = execSync("git config --get remote.origin.url", {
      cwd: rootDir,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    });
    const parsed = parseRepoName(remoteUrl);
    if (parsed) {
      return parsed;
    }
  } catch {
    // Fall through to package metadata.
  }

  return packageJson.name || path.basename(rootDir);
}

export const repoName = detectRepoName();

export function getDeckBase(deckName) {
  if (/\.github\.io$/i.test(repoName)) {
    return `/${deckName}/`;
  }

  return `/${repoName}/${deckName}/`;
}
