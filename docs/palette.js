(() => {
  const KEY = 'present-anything-palette';
  const DEFAULT = 'slate-gray';

  const palettes = ['warm-gray', 'slate-gray', 'graphite'];

  const applyPalette = (value) => {
    const palette = palettes.includes(value) ? value : DEFAULT;
    document.documentElement.setAttribute('data-palette', palette);
    try {
      localStorage.setItem(KEY, palette);
    } catch {}
    return palette;
  };

  const getPalette = () => {
    try {
      return localStorage.getItem(KEY) || DEFAULT;
    } catch {
      return DEFAULT;
    }
  };

  const palette = applyPalette(getPalette());

  window.__presentAnythingPalette = {
    key: KEY,
    palettes,
    apply: applyPalette,
    current: () => document.documentElement.getAttribute('data-palette') || palette,
  };
})();
