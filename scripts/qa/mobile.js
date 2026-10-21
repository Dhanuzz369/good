// Mobile-native and keyboard checks (run at a phone width with mobile emulation).
const out = {};
const css = (el, p) => getComputedStyle(el)[p];
out.viewportMeta = document.querySelector('meta[name=viewport]').content;
out.tapHighlight = css(document.documentElement, 'webkitTapHighlightColor');
// iOS zooms into inputs under 16px.
out.smallInputs = [...document.querySelectorAll('input:not([type=checkbox]):not([type=radio]), select, textarea')]
  .filter((i) => parseFloat(css(i, 'fontSize')) < 16).map((i) => i.name || i.className);
// Touch targets under 44px (inline links inside running text are exempt).
const inline = (e) => e.tagName === 'A' && css(e, 'display') === 'inline';
out.smallTargets = [...document.querySelectorAll('a[href], button, summary, input[type=checkbox], select')]
  .filter((e) => { const r = e.getBoundingClientRect(); return r.width && r.height && e.checkVisibility() && !inline(e) && (r.height < 44 || r.width < 24) && !e.closest('.ticker, .dev-data, .visually-hidden'); })
  .map((e) => `${(e.className?.baseVal ?? e.className) || e.tagName} ${Math.round(e.getBoundingClientRect().width)}x${Math.round(e.getBoundingClientRect().height)}`)
  .reduce((acc, k) => ((acc[k] = (acc[k] || 0) + 1), acc), {});
out.touchAction = css(document.querySelector('.btn'), 'touchAction');
// Keyboard: nothing focusable inside a closed or hidden panel.
const tabbables = [...document.querySelectorAll('a[href], button, input, select, textarea, summary, [tabindex]')].filter((e) => e.tabIndex >= 0 && !e.disabled);
out.focusableButHidden = tabbables
  .filter((e) => { const r = e.getBoundingClientRect(); const hidden = css(e, 'visibility') === 'hidden' || !e.checkVisibility({ opacityProperty: false, visibilityProperty: true }); return r.width > 0 && hidden; })
  .map((e) => e.className || e.tagName).slice(0, 10);
// Focus ring present on a sample of controls.
const sample = ['.btn', '.chip', '.tab', '.add', '.cat__more', '.search__input', '.hdr__link', '.ads__dot', '.brand-card__go'];
out.focusRing = {};
for (const sel of sample) {
  const el = document.querySelector(sel);
  if (!el) continue;
  el.focus({ focusVisible: true });
  const s = getComputedStyle(el);
  out.focusRing[sel] = s.outlineStyle !== 'none' || s.boxShadow !== 'none' || s.borderColor !== '';
}
// Layout shift across the load, including late images.
out.cls = await new Promise((resolve) => {
  let v = 0;
  new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (!e.hadRecentInput) v += e.value; })).observe({ type: 'layout-shift', buffered: true });
  setTimeout(() => resolve(Number(v.toFixed(4))), 400);
});
out.imgsWithoutSize = [...document.images].filter((i) => !i.getAttribute('width') || !i.getAttribute('height')).length;
return out;
