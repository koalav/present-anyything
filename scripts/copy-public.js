import fs from "fs";
import path from "path";
import { outputRoot } from "./site-config.js";

export function copyPublicAssets() {
  const rootDir = process.cwd();
  const publicDir = path.join(rootDir, "public");
  const outputDir = path.join(rootDir, outputRoot);

  if (!fs.existsSync(publicDir)) {
    return;
  }

  fs.mkdirSync(outputDir, { recursive: true });
  fs.cpSync(publicDir, outputDir, { recursive: true });
}
