import fs from "fs";
import path from "path";

const rootDir = process.cwd();
const decksDir = path.join(rootDir, "decks");
const targets = [path.join(rootDir, "docs"), path.join(rootDir, "dist")];

if (fs.existsSync(decksDir)) {
  for (const deckName of fs.readdirSync(decksDir)) {
    targets.push(path.join(decksDir, deckName, "dist"));
  }
}

for (const target of targets) {
  fs.rmSync(target, { recursive: true, force: true });
}
