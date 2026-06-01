#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const PptxGenJS = require('pptxgenjs');

async function main() {
  const rootDir = path.resolve(__dirname, '..');
  const nativePptxPath = path.join(rootDir, 'docs/android-security-harness/native-pptx.js');
  const deckDir = path.join(rootDir, 'docs/android-security-harness');
  const outputPath = path.resolve(
    process.argv[2] || path.join(rootDir, 'docs/android-security-harness/ai-android-security-harness-editable.pptx'),
  );

  const loadImageData = async (relativePath) => {
    const imagePath = path.resolve(deckDir, relativePath);
    const ext = path.extname(imagePath).toLowerCase();
    const mime = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
    return `data:${mime};base64,${fs.readFileSync(imagePath).toString('base64')}`;
  };

  const sandbox = {
    window: { __loadImageData: loadImageData },
    console,
    URL,
    fetch,
    FileReader: global.FileReader,
  };

  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(nativePptxPath, 'utf8'), sandbox, { filename: nativePptxPath });

  const createDeck = sandbox.window.createEditablePptxDeck;
  if (typeof createDeck !== 'function') {
    throw new Error('createEditablePptxDeck was not registered by native-pptx.js');
  }

  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'EXPORT_16_9', width: 13.333333, height: 7.5 });
  pptx.layout = 'EXPORT_16_9';
  pptx.author = 'present-anything';

  await createDeck({ pptx, fileName: path.basename(outputPath) });
  await pptx.writeFile({ fileName: outputPath });
  console.log(outputPath);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
