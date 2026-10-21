// Motion behaviour checks: run through probe.mjs at desktop and mobile, with
// prefers-reduced-motion set to no-preference and to reduce.
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const css = (el, p) => getComputedStyle(el)[p];
const mobile = matchMedia('(max-width: 1080px)').matches;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const out = { mobile, reduce };
localStorage.clear();
document.documentElement.style.scrollBehavior = 'auto'; // measure end states, not smooth-scroll midpoints

// 1. Hero entrance: five parts, staggered, only without reduced motion.
const heroAnims = document.getAnimations().filter((a) => a.effect?.target?.closest?.('.hero'));
out.heroAnimations = heroAnims.map((a) => `${a.animationName}@${a.effect.getTiming().delay}`);

// 2. Header: no scroll listener drives it; is-stuck flips after the ticker leaves.
scrollTo(0, 600); await wait(250);
out.headerStuckAfterScroll = document.querySelector('[data-header]').classList.contains('is-stuck');
scrollTo(0, 0); await wait(250);
out.headerStuckAtTop = document.querySelector('[data-header]').classList.contains('is-stuck');

// 3. Menus: rapid toggling ends in a consistent, usable state.
if (mobile) {
  const t = document.querySelector('[data-menu-toggle]');
  const nav = document.getElementById('site-nav');
  for (let i = 0; i < 7; i++) t.click();
  await wait(320);
  out.menuAfter7Clicks = { open: nav.classList.contains('is-open'), visibility: css(nav, 'visibility'), opacity: css(nav, 'opacity'), expanded: t.getAttribute('aria-expanded') };
  t.focus();
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
  await wait(260);
  out.menuAfterEscape = { open: nav.classList.contains('is-open'), visibility: css(nav, 'visibility'), focusOnToggle: document.activeElement === t };
} else {
  const b = document.querySelector('[data-dropdown]');
  const mega = document.getElementById('cat-menu');
  b.click(); await wait(60);
  out.megaMidOpen = Number(css(mega, 'opacity')).toFixed(2);
  await wait(260);
  out.megaOpen = { opacity: css(mega, 'opacity'), visibility: css(mega, 'visibility'), origin: css(mega, 'transformOrigin') };
  for (let i = 0; i < 6; i++) b.click();
  await wait(300);
  out.megaAfterRapid = { state: mega.dataset.open, visibility: css(mega, 'visibility'), expanded: b.getAttribute('aria-expanded') };
  document.body.click(); await wait(250);
  out.megaClosedByOutsideClick = { state: mega.dataset.open, visibility: css(mega, 'visibility'), linksFocusable: [...mega.querySelectorAll('a')].some((a) => a.checkVisibility?.()) };
}

// 4. Search results: open, Escape closes, content not animated per keystroke.
const input = document.querySelector('[data-search-input]');
const panel = document.querySelector('[data-search-results]');
input.focus(); input.value = 'sodium'; input.dispatchEvent(new Event('input')); await wait(350);
out.searchOpen = { state: panel.dataset.open, visibility: css(panel, 'visibility'), results: panel.querySelectorAll('.result').length };
input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); await wait(250);
out.searchAfterEscape = { state: panel.dataset.open, visibility: css(panel, 'visibility') };

// 5. Add to enquiry: count, toggle state, and (phones) the bottom bar.
document.querySelector('[data-add="turmeric"]').click(); await wait(400);
out.enquiryCount = document.querySelector('[data-enquiry-n]').textContent;
const mbar = document.querySelector('[data-mbar]');
out.mbar = { state: mbar.dataset.open, transform: css(mbar, 'transform'), visibility: css(mbar, 'visibility'), tabIndex: mbar.tabIndex };
document.getElementById('quote').scrollIntoView(); await wait(400);
out.mbarHiddenAtQuote = { state: mbar.dataset.open, visibility: css(mbar, 'visibility') };
scrollTo(0, 0); await wait(200);

// 6. Tabs: keyboard switch has no animation, click gets the crossfade.
const tabs = [...document.querySelectorAll('[role=tab]')];
tabs[0].focus();
tabs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
await wait(20);
out.tabKeyboard = { focused: document.activeElement === tabs[1], animated: document.getElementById('step-1').classList.contains('is-entering') };
tabs[2].click(); await wait(20);
out.tabClick = { animated: document.getElementById('step-2').classList.contains('is-entering') };

// 7. Banners: autoplay only in view and without reduced motion; pause control.
const ads = document.querySelector('[data-ads]');
ads.scrollIntoView(); await wait(500);
out.adsPlayingInView = ads.classList.contains('is-playing');
const pause = ads.querySelector('[data-ads-pause]');
out.adsPauseLabel = pause.textContent;
pause.click(); await wait(50);
out.adsAfterPauseClick = { playing: ads.classList.contains('is-playing'), pressed: pause.getAttribute('aria-pressed') };
ads.querySelector('[data-ads-next]').click(); await wait(900);
out.adsDotAfterNext = [...ads.querySelectorAll('[data-ads-dot]')].findIndex((d) => d.classList.contains('is-active'));

// 8. Reveals never leave content hidden after a scroll pass.
for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { scrollTo(0, y); await wait(30); }
await wait(700);
out.revealsStillHidden = [...document.querySelectorAll('[data-reveal]')].filter((e) => Number(css(e, 'opacity')) < 0.99).length;

// 9. Expander: opens and its content becomes visible.
const ex = document.querySelector('[data-expand]');
ex.click(); await wait(400);
const pan = document.getElementById(ex.getAttribute('aria-controls'));
out.expander = { expanded: ex.getAttribute('aria-expanded'), innerOpacity: css(pan.firstElementChild, 'opacity'), height: Math.round(pan.getBoundingClientRect().height) };

// 10. Ticker: paused when scrolled away (no work for an unseen loop).
out.tickerPausedOffscreen = document.querySelector('[data-ticker-bar]').classList.contains('is-paused');
return out;
