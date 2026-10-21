// Page controls: header (menu, category dropdown, collapse on scroll),
// ticker, category rows' "view all", step tabs, carousel and entrances.
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initHeader() {
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('[data-menu-toggle]');
  const nav = document.getElementById('site-nav');
  const dropBtn = document.querySelector('[data-dropdown]');
  const mega = dropBtn && document.getElementById(dropBtn.getAttribute('aria-controls'));
  if (!header) return;

  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.visually-hidden').textContent = open ? 'Close menu' : 'Menu';
  };
  // The dropdown stays in the DOM so it can animate out as well as in;
  // `data-open` drives an interruptible CSS transition.
  const setMega = (open) => {
    if (!mega) return;
    mega.dataset.open = String(open);
    dropBtn.setAttribute('aria-expanded', String(open));
  };
  const megaOpen = () => mega?.dataset.open === 'true';

  toggle?.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  dropBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    setMega(!megaOpen());
  });
  nav?.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      setMenu(false);
      setMega(false);
    }
  });
  document.addEventListener('click', (e) => {
    if (megaOpen() && !mega.contains(e.target)) setMega(false);
    if (nav.classList.contains('is-open') && !header.contains(e.target)) setMenu(false);
  });
  addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (megaOpen()) {
      setMega(false);
      dropBtn.focus();
    }
    if (nav.classList.contains('is-open')) {
      setMenu(false);
      toggle.focus();
    }
  });
  // Leaving the phone layout with the menu open must not strand it open.
  matchMedia('(min-width: 1081px)').addEventListener('change', (e) => e.matches && setMenu(false));

  // The header lifts off the page once the ticker scrolls away. An observer
  // on the ticker replaces a scroll listener: no work on every scroll frame.
  const bar = document.querySelector('[data-ticker-bar]');
  if (bar && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => header.classList.toggle('is-stuck', !e.isIntersecting), {
      rootMargin: `-${header.offsetHeight}px 0px 0px 0px`,
    }).observe(bar);
  }
}

export function initTicker() {
  const track = document.querySelector('[data-ticker]');
  const bar = document.querySelector('[data-ticker-bar]');
  if (!track || reduced()) return;
  // Duplicate the list once so the loop is seamless; the copy is hidden from
  // assistive technology and from the tab order.
  [...track.children].forEach((li) => {
    const copy = li.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    copy.querySelectorAll('a').forEach((a) => a.setAttribute('tabindex', '-1'));
    track.append(copy);
  });
  // A decorative loop only runs while it can be seen.
  let visible = true;
  const sync = () => bar.classList.toggle('is-paused', !visible || document.hidden);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    }).observe(bar);
  }
  document.addEventListener('visibilitychange', sync);
}

export function initExpanders() {
  document.querySelectorAll('[data-expand]').forEach((btn) => {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    const label = btn.firstChild;
    const closedText = label.textContent;
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      panel.classList.toggle('is-open', open);
      label.textContent = open ? 'Show less ' : closedText;
    });
  });
  // Opening a row from the menu or a link: expand it when the hash names it.
}

export function initTabs() {
  const list = document.querySelector('[data-tabs]');
  if (!list) return;
  const tabs = [...list.querySelectorAll('[role=tab]')];
  const select = (tab, fromKeyboard = false) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (on) {
        panel.removeAttribute('data-inactive');
        panel.classList.remove('is-entering');
        // Keyboard-driven switches are instant; a click gets a short crossfade.
        if (!fromKeyboard) {
          void panel.offsetWidth;
          panel.classList.add('is-entering');
        }
      } else panel.setAttribute('data-inactive', '');
    });
    if (fromKeyboard) tab.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', (e) => {
      const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      select(tabs[(next + tabs.length) % tabs.length], true);
    });
  });
}

export function initCarousel() {
  const track = document.querySelector('[data-carousel]');
  if (!track) return;
  const prev = document.querySelector('[data-carousel-prev]');
  const next = document.querySelector('[data-carousel-next]');
  const step = () => track.querySelector('.slide').getBoundingClientRect().width + 20;
  const update = () => {
    prev.disabled = track.scrollLeft < 8;
    next.disabled = track.scrollLeft + track.clientWidth > track.scrollWidth - 8;
  };
  prev.addEventListener('click', () => track.scrollBy({ left: -step() }));
  next.addEventListener('click', () => track.scrollBy({ left: step() }));
  let queued = false;
  track.addEventListener(
    'scroll',
    () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        update();
      });
    },
    { passive: true },
  );
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') next.click();
    if (e.key === 'ArrowLeft') prev.click();
  });
  addEventListener('resize', update);
  update();
}

export function initReveal() {
  const els = [...document.querySelectorAll('[data-reveal]')];
  if (!('IntersectionObserver' in window) || !els.length) return;
  document.documentElement.classList.add('reveal-armed');
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }),
    { rootMargin: '0px 0px -6% 0px', threshold: 0.04 },
  );
  // Siblings in a group (the brand cards) cascade 60ms apart, capped at 240ms.
  els.forEach((el) => {
    const group = el.closest('[data-reveal-group]');
    if (group) el.style.setProperty('--stagger', `${Math.min([...group.querySelectorAll('[data-reveal]')].indexOf(el), 4) * 60}ms`);
  });
  els.forEach((el) => {
    // Anything already on screen shows immediately rather than animating in.
    if (el.getBoundingClientRect().top < innerHeight) el.classList.add('is-in');
    io.observe(el);
  });
}

// A product photograph that fails to load is replaced by the sector's drawn
// tile instead of a broken-image icon.
export function initImageFallback() {
  document.addEventListener(
    'error',
    (e) => {
      const img = e.target;
      if (!(img instanceof HTMLImageElement) || img.dataset.failed) return;
      img.dataset.failed = '1';
      const box = img.closest('.thumb__media, .result__media, .pcard__media, .brand-card__media');
      if (box) {
        const tile = document.createElement('span');
        tile.className = 'tile-icon';
        tile.setAttribute('role', 'img');
        tile.setAttribute('aria-label', `${img.alt || 'Product'}, photograph unavailable`);
        box.replaceChildren(tile);
      } else {
        img.style.visibility = 'hidden';
      }
    },
    true,
  );
}

// Promotional banners: native scroll-snap does the movement (the browser's own
// physics, interruptible by a swipe). Autoplay advances every 7s only while the
// banners are visible, not hovered or focused, and motion is not reduced; a
// Pause control satisfies WCAG 2.2.2.
export function initAds() {
  const root = document.querySelector('[data-ads]');
  if (!root) return;
  const track = root.querySelector('[data-ads-track]');
  const slides = [...root.querySelectorAll('[data-ad]')];
  const dots = [...root.querySelectorAll('[data-ads-dot]')];
  const pauseBtn = root.querySelector('[data-ads-pause]');
  let index = 0;
  let timer = null;
  let userPaused = reduced();
  let hovered = false;
  let inView = false;

  const go = (i) => {
    index = (i + slides.length) % slides.length;
    track.scrollTo({ left: slides[index].offsetLeft - track.offsetLeft, behavior: reduced() ? 'auto' : 'smooth' });
  };
  const paint = () => dots.forEach((d, i) => {
    d.classList.toggle('is-active', i === index);
    if (i === index) d.setAttribute('aria-current', 'true');
    else d.removeAttribute('aria-current');
  });
  const schedule = () => {
    clearInterval(timer);
    timer = null;
    const running = !userPaused && !hovered && inView && !document.hidden;
    root.classList.toggle('is-playing', running);
    if (running) timer = setInterval(() => go(index + 1), 7000);
  };

  root.querySelector('[data-ads-prev]').addEventListener('click', () => { go(index - 1); schedule(); });
  root.querySelector('[data-ads-next]').addEventListener('click', () => { go(index + 1); schedule(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { go(i); schedule(); }));
  pauseBtn.addEventListener('click', () => {
    userPaused = !userPaused;
    pauseBtn.setAttribute('aria-pressed', String(userPaused));
    pauseBtn.textContent = userPaused ? 'Play' : 'Pause';
    schedule();
  });
  if (userPaused) {
    pauseBtn.setAttribute('aria-pressed', 'true');
    pauseBtn.textContent = 'Play';
  }
  root.addEventListener('pointerenter', () => { hovered = true; schedule(); });
  root.addEventListener('pointerleave', () => { hovered = false; schedule(); });
  root.addEventListener('focusin', () => { hovered = true; schedule(); });
  root.addEventListener('focusout', (e) => { if (!root.contains(e.relatedTarget)) { hovered = false; schedule(); } });
  document.addEventListener('visibilitychange', schedule);
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
  });

  // The visible slide (from swipes, arrows or autoplay) drives the dots.
  if ('IntersectionObserver' in window) {
    const seen = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { index = slides.indexOf(e.target); paint(); }
      }),
      { root: track, threshold: 0.6 },
    );
    slides.forEach((s) => seen.observe(s));
    new IntersectionObserver(([e]) => { inView = e.isIntersecting; schedule(); }, { threshold: 0.4 }).observe(root);
  }
  paint();
}

// Range pages: keep the current division's tab in view in the switcher strip
// (it scrolls sideways on phones). Adjusts only the strip, never the page.
export function initSwitcher() {
  const strip = document.querySelector('.switcher ul');
  const current = strip?.querySelector('[aria-current="page"]');
  if (!current) return;
  const li = current.parentElement;
  strip.scrollLeft = li.offsetLeft - (strip.clientWidth - li.offsetWidth) / 2;
}
