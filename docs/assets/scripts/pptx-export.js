(function () {
  const EXPORT_QUERY = 'pptx-export';
  if (new URLSearchParams(window.location.search).has(EXPORT_QUERY)) return;

  const EXPORT_WIDTH = 1920;
  const EXPORT_HEIGHT = 1080;
  const SLIDE_WIDTH_IN = 13.333333;
  const SLIDE_HEIGHT_IN = 7.5;
  const HTML2CANVAS_SRC = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
  const PPTXGEN_SRC = 'https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js';

  const loadPromises = new Map();
  let exporting = false;
  let statusTimer = 0;

  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
      return;
    }
    callback();
  }

  function ensureDeckLinks() {
    let links = document.querySelector('.deck-links');
    if (links) return links;

    links = document.createElement('nav');
    links.className = 'deck-links';
    links.setAttribute('aria-label', 'Deck actions');
    document.body.insertBefore(links, document.querySelector('.progress') || document.body.firstChild);
    return links;
  }

  function ensureStatus() {
    let status = document.querySelector('.pptx-export-status');
    if (status) return status;

    status = document.createElement('div');
    status.className = 'pptx-export-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    document.body.appendChild(status);
    return status;
  }

  function setStatus(message, options = {}) {
    const status = ensureStatus();
    window.clearTimeout(statusTimer);

    if (!message) {
      status.classList.remove('visible');
      return;
    }

    status.textContent = message;
    status.classList.add('visible');

    if (options.timeout) {
      statusTimer = window.setTimeout(() => status.classList.remove('visible'), options.timeout);
    }
  }

  function loadScript(src, isReady) {
    if (isReady()) return Promise.resolve();
    if (loadPromises.has(src)) return loadPromises.get(src);

    const promise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => (isReady() ? resolve() : reject(new Error(`Loaded ${src}, but the library is unavailable.`)));
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(script);
    });

    loadPromises.set(src, promise);
    return promise;
  }

  async function loadPptxDependency() {
    await loadScript(PPTXGEN_SRC, () => Boolean(window.pptxgen || window.pptxgenjs || window.PptxGenJS));
  }

  async function loadDependencies() {
    await loadScript(HTML2CANVAS_SRC, () => typeof window.html2canvas === 'function');
    await loadPptxDependency();
  }

  function getPptxConstructor() {
    const constructor = window.pptxgen || window.pptxgenjs || window.PptxGenJS;
    if (!constructor) throw new Error('PPTX library is unavailable.');
    return constructor;
  }

  function deckTitle() {
    return document.body.dataset.deckLabel || document.title || 'presentation';
  }

  function fileName() {
    const safeTitle = deckTitle()
      .replace(/[\\/:*?"<>|]+/g, '-')
      .replace(/\s+/g, ' ')
      .trim();
    return `${safeTitle || 'presentation'}-16x9.pptx`;
  }

  function delay(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function waitForFrame(frameWindow) {
    return new Promise((resolve) => frameWindow.requestAnimationFrame(() => frameWindow.requestAnimationFrame(resolve)));
  }

  function createExportFrame() {
    return new Promise((resolve, reject) => {
      const frame = document.createElement('iframe');
      const url = new URL(window.location.href);
      url.hash = '';
      url.searchParams.set(EXPORT_QUERY, '1');

      frame.className = 'pptx-export-frame';
      frame.setAttribute('aria-hidden', 'true');
      frame.width = String(EXPORT_WIDTH);
      frame.height = String(EXPORT_HEIGHT);
      frame.src = url.href;

      const timer = window.setTimeout(() => {
        frame.remove();
        reject(new Error('Timed out while loading the export frame.'));
      }, 20000);

      frame.onload = () => {
        window.clearTimeout(timer);
        resolve(frame);
      };

      document.body.appendChild(frame);
    });
  }

  async function waitForFonts(doc) {
    if (doc.fonts?.ready) {
      await Promise.race([doc.fonts.ready, delay(5000)]);
    }
  }

  async function waitForImages(doc) {
    const pending = Array.from(doc.images).filter((image) => !image.complete);
    if (!pending.length) return;

    await Promise.race([
      Promise.all(pending.map((image) => new Promise((resolve) => {
        image.addEventListener('load', resolve, { once: true });
        image.addEventListener('error', resolve, { once: true });
      }))),
      delay(8000),
    ]);
  }

  async function waitForMermaid(doc) {
    const diagrams = Array.from(doc.querySelectorAll('.mermaid'));
    if (!diagrams.length) return;

    const started = Date.now();
    while (Date.now() - started < 10000) {
      const rendered = diagrams.every((diagram) => (
        diagram.querySelector('svg') || diagram.dataset.processed === 'true' || diagram.innerHTML.includes('<svg')
      ));
      if (rendered) return;
      await delay(120);
    }
  }

  function prepareFrameForCapture(doc) {
    const style = doc.createElement('style');
    style.textContent = `
      html,
      body {
        width: ${EXPORT_WIDTH}px !important;
        height: ${EXPORT_HEIGHT}px !important;
        overflow: hidden !important;
      }

      .slides {
        display: block !important;
        height: auto !important;
        transform: none !important;
        transition: none !important;
      }

      .slide {
        width: ${EXPORT_WIDTH}px !important;
        min-width: ${EXPORT_WIDTH}px !important;
        height: ${EXPORT_HEIGHT}px !important;
        min-height: ${EXPORT_HEIGHT}px !important;
      }

      .part-label,
      .page-num,
      .progress,
      .nav,
      .deck-links,
      .pptx-export-status {
        display: none !important;
      }
    `;
    doc.head.appendChild(style);
  }

  async function captureSlide(slide, index, total, frameWindow) {
    slide.scrollTop = 0;
    setStatus(`PPTX 생성 중: ${index + 1} / ${total}`);
    await waitForFrame(frameWindow);

    const canvas = await window.html2canvas(slide, {
      backgroundColor: null,
      logging: false,
      scale: 1,
      useCORS: true,
      allowTaint: false,
      width: EXPORT_WIDTH,
      height: EXPORT_HEIGHT,
      windowWidth: EXPORT_WIDTH,
      windowHeight: EXPORT_HEIGHT,
      scrollX: 0,
      scrollY: 0,
    });

    return canvas.toDataURL('image/png');
  }

  async function exportDeck(button) {
    if (exporting) return;
    exporting = true;
    button.disabled = true;
    button.textContent = '...';

    let frame;
    try {
      const slides = Array.from(document.querySelectorAll('.slide'));
      if (!slides.length) throw new Error('No slides found.');

      setStatus('PPTX 라이브러리 로딩 중');
      if (typeof window.createEditablePptxDeck === 'function') {
        await loadPptxDependency();
        const PptxGen = getPptxConstructor();
        const pptx = new PptxGen();
        pptx.defineLayout({ name: 'EXPORT_16_9', width: SLIDE_WIDTH_IN, height: SLIDE_HEIGHT_IN });
        pptx.layout = 'EXPORT_16_9';
        pptx.author = 'present-anyything';
        pptx.subject = deckTitle();
        pptx.title = deckTitle();

        setStatus('편집 가능한 PPTX 구성 중');
        const result = await window.createEditablePptxDeck({
          pptx,
          width: SLIDE_WIDTH_IN,
          height: SLIDE_HEIGHT_IN,
          deckTitle: deckTitle(),
          fileName: fileName(),
          setStatus,
        });

        setStatus('PPTX 파일 저장 중');
        await pptx.writeFile({ fileName: result?.fileName || fileName() });
        setStatus('PPTX export 완료', { timeout: 2600 });
        return;
      }

      await loadDependencies();

      setStatus('16:9 캡처 프레임 준비 중');
      frame = await createExportFrame();
      const doc = frame.contentDocument;
      const frameWindow = frame.contentWindow;
      if (!doc || !frameWindow) throw new Error('Unable to access the export frame.');

      prepareFrameForCapture(doc);
      await waitForFonts(doc);
      await waitForImages(doc);
      await waitForMermaid(doc);
      await waitForFrame(frameWindow);

      const exportSlides = Array.from(doc.querySelectorAll('.slide'));
      if (!exportSlides.length) throw new Error('No slides found in the export frame.');

      const PptxGen = getPptxConstructor();
      const pptx = new PptxGen();
      pptx.defineLayout({ name: 'EXPORT_16_9', width: SLIDE_WIDTH_IN, height: SLIDE_HEIGHT_IN });
      pptx.layout = 'EXPORT_16_9';
      pptx.author = 'present-anyything';
      pptx.subject = deckTitle();
      pptx.title = deckTitle();

      for (let index = 0; index < exportSlides.length; index += 1) {
        const data = await captureSlide(exportSlides[index], index, exportSlides.length, frameWindow);
        const pptSlide = pptx.addSlide();
        pptSlide.background = { color: '0D0D0D' };
        pptSlide.addImage({ data, x: 0, y: 0, w: SLIDE_WIDTH_IN, h: SLIDE_HEIGHT_IN });
      }

      setStatus('PPTX 파일 저장 중');
      await pptx.writeFile({ fileName: fileName() });
      setStatus('PPTX export 완료', { timeout: 2600 });
    } catch (error) {
      console.error(error);
      setStatus(`PPTX export 실패: ${error.message || error}`, { timeout: 7000 });
    } finally {
      frame?.remove();
      button.disabled = false;
      button.textContent = 'PPTX';
      exporting = false;
    }
  }

  function init() {
    const links = ensureDeckLinks();
    if (links.querySelector('[data-action="export-pptx"]')) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.action = 'export-pptx';
    button.textContent = 'PPTX';
    button.title = 'Export this deck as a 16:9 PPTX';
    button.setAttribute('aria-label', 'Export this deck as a 16:9 PPTX');
    button.addEventListener('click', () => exportDeck(button));
    links.appendChild(button);
  }

  ready(init);
}());
