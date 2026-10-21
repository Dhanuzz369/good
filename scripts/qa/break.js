// break-ui checks: run through probe.mjs against a page (optionally ?data=...).
for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
document.querySelectorAll('[data-expand]').forEach((b) => b.click());
await new Promise((r) => setTimeout(r, 450));
const vw = document.documentElement.clientWidth;
const scroller = (el) => el.closest('.cat__thumbs, .ticker, .carousel, .ads__track, .tabs, .search__results, .dev-data, .visually-hidden');
const out = { vw, scrollWidth: document.documentElement.scrollWidth, fixture: new URLSearchParams(location.search).get('data') || 'demo' };
out.pastEdge = [...document.querySelectorAll('body *')]
  .filter((e) => { const r = e.getBoundingClientRect(); return r.width && r.right > vw + 1 && !scroller(e) && getComputedStyle(e).position !== 'fixed'; })
  .slice(0, 8).map((e) => `${e.className?.baseVal ?? e.className} r=${Math.round(e.getBoundingClientRect().right)}`);
out.spill = [...document.querySelectorAll('h1,h2,h3,p,a,span,strong,small,li,th,td,button,dd,dt')]
  .filter((e) => e.children.length === 0 && e.textContent.trim() && e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflow !== 'visible' && !scroller(e))
  .slice(0, 8).map((e) => `${e.className}: ${e.textContent.trim().slice(0, 50)}`);
out.brokenImgs = [...document.images].filter((i) => i.complete && !i.naturalWidth).length;
out.fallbackTiles = document.querySelectorAll('.tile-icon[aria-label*="unavailable"]').length;
out.badPlurals = [...document.body.innerText.matchAll(/\b1 (product lines|lines|products found)\b/g)].map((m) => m[0]);
out.undefinedText = /\bundefined\b|\bNaN\b/.test(document.body.innerText);
out.longNamesPresent = /Polysorbate 80|Sulphoacetate \(SLSA\)|33 kV outdoor/.test(document.body.innerText);
out.chemRows = document.querySelectorAll('[data-chem-row]').length;
out.emptyGroups = [...document.querySelectorAll('[data-chem-group]')].filter((g) => !g.querySelector('[data-chem-row]')).map((g) => g.dataset.chemGroup);
out.filterButtons = [...document.querySelectorAll('[data-chem-filter]')].map((b) => b.textContent.trim());
const cs = document.querySelector('[data-chem-search]');
if (cs) {
  const t0 = performance.now();
  for (const q of ['s', 'sl', 'sle', 'sles']) { cs.value = q; cs.dispatchEvent(new Event('input')); }
  out.filterMsFor4Keystrokes = Math.round(performance.now() - t0);
  out.chemStatus = document.querySelector('[data-chem-status]')?.textContent;
  cs.value = ''; cs.dispatchEvent(new Event('input'));
}
return out;
