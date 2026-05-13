const slideTrack = document.getElementById('slides');
const slides = Array.from(document.querySelectorAll('.slide'));
const pageNumEl = document.getElementById('pageNum');
const progressEl = document.getElementById('progress');
const partLabelEl = document.getElementById('partLabel');
const prevBtn = document.querySelector('[data-action="prev"]');
const nextBtn = document.querySelector('[data-action="next"]');

let current = 0;
let touchStartX = 0;
let touchStartY = 0;

function clampSlide(index) {
  return Math.max(0, Math.min(index, slides.length - 1));
}

function partLabelFor(index) {
  for (let i = index; i >= 0; i -= 1) {
    if (slides[i]?.dataset.part) return slides[i].dataset.part;
  }
  return document.body.dataset.deckLabel || 'Presentation';
}

function updateUi() {
  if (!slides.length) return;
  pageNumEl.textContent = `${current + 1} / ${slides.length}`;
  progressEl.style.width = slides.length > 1 ? `${(current / (slides.length - 1)) * 100}%` : '100%';
  partLabelEl.textContent = partLabelFor(current);
  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === slides.length - 1;
}

function goTo(index) {
  if (!slides.length) return;
  current = clampSlide(index);
  slideTrack.style.transform = `translateX(-${current * 100}vw)`;
  history.replaceState(null, '', `#${current + 1}`);
  updateUi();
}

function next() {
  goTo(current + 1);
}

function prev() {
  goTo(current - 1);
}

function toggleFullscreen() {
  const root = document.documentElement;
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
  if (!fullscreenElement) {
    const request = root.requestFullscreen || root.webkitRequestFullscreen;
    request?.call(root)?.catch(() => {});
    return;
  }

  const exit = document.exitFullscreen || document.webkitExitFullscreen;
  exit?.call(document)?.catch(() => {});
}

document.addEventListener('keydown', (event) => {
  const tag = document.activeElement?.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return;

  switch (event.key) {
    case 'ArrowRight':
    case 'PageDown':
    case ' ':
      event.preventDefault();
      next();
      break;
    case 'ArrowLeft':
    case 'PageUp':
    case 'Backspace':
      event.preventDefault();
      prev();
      break;
    case 'Home':
      event.preventDefault();
      goTo(0);
      break;
    case 'End':
      event.preventDefault();
      goTo(slides.length - 1);
      break;
    case 'f':
    case 'F':
      toggleFullscreen();
      break;
    default:
      break;
  }
});

document.addEventListener('touchstart', (event) => {
  if (event.touches.length > 1) return;
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', (event) => {
  if (event.changedTouches.length > 1) return;
  const dx = touchStartX - event.changedTouches[0].clientX;
  const dy = touchStartY - event.changedTouches[0].clientY;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) next();
    else prev();
  }
}, { passive: true });

prevBtn.addEventListener('click', prev);
nextBtn.addEventListener('click', next);

const initialSlide = Number.parseInt(location.hash.slice(1), 10) - 1;
if (Number.isFinite(initialSlide) && initialSlide >= 0) {
  goTo(initialSlide);
} else {
  updateUi();
}

window.goTo = goTo;
window.next = next;
window.prev = prev;
