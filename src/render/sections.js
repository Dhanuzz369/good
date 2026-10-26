// Section templates. Pure functions from data to HTML strings, run at build
// time by the Vite plugin in vite.config.js so every product is in the
// delivered HTML (indexable, and usable before or without script).
import { esc, html, addButton, plural } from './util.js';
import { icon } from './icons.js';
import { brandMark, accentStyle } from './brand.js';
import { site, nav, legal } from '../data/site.js';
import { sectors, products, chemicals, chemicalGroups, quickSearches, defaultUnit, productHref, registrations, registrationsFor } from '../data/products.js';
import { process, reasons, markets, units, packagingOptions } from '../data/content.js';
import { images } from '../data/images.js';

export const pic = (key, alt, { cls = '', eager = false, pos = '', sizes = '100vw' } = {}) => {
  const i = images[key];
  if (!i) throw new Error(`Unknown image key: ${key}`);
  const smallW = Math.min(800, i.w);
  return `<img class="${cls}" src="${i.src}" srcset="${i.small} ${smallW}w, ${i.src} ${i.w}w" sizes="${sizes}" alt="${esc(
    alt,
  )}" width="${i.w}" height="${i.h}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"${
    pos ? ` style="object-position:${pos}"` : ''
  }>`;
};

export const bySector = (id) => (id === 'chemicals' ? chemicals : products.filter((p) => p.sector === id));
export const groupName = (id) => chemicalGroups.find((g) => g.id === id)?.short || '';
export const isChem = (p) => chemicals.includes(p);
// Chemical groups that currently hold products (an empty group gets no filter).
const groupsInUse = () => chemicalGroups.filter((g) => chemicals.some((c) => c.group === g.id));
// tel: link for the contact number (digits and + only).
export const telHref = `tel:${site.phone.replace(/[^\d+]/g, '')}`;
// Section titles are set in one tone; only the hero headline uses the accent.
export const twoTone = (a, b) => `${esc(a)} ${esc(b)}`;

// The picture for a product: its photograph, or the sector's drawn tile when
// no honest photograph exists (never a stand-in photo of something else).
export const productMedia = (p, sizes) => {
  if (p.image) return pic(p.image, p.name, { sizes });
  const sector = sectors.find((s) => s.id === (isChem(p) ? 'chemicals' : p.sector));
  return `<span class="tile-icon tile-icon--${sector.id}" role="img" aria-label="${esc(p.name)}, no photograph yet">${icon(
    p.icon || sector.icon,
  )}</span>`;
};


export const pricingLink = (c, cls = 'btn btn--soft btn--sm') =>
  `<a class="${cls}" href="#chem-enquiry" data-chem="${c.id}">Request pricing<span class="visually-hidden"> for ${esc(c.name)}</span></a>`;

export const productAction = (p) =>
  isChem(p) ? pricingLink(p, 'thumb__action') : addButton(p.id, p.name, 'Add to enquiry', defaultUnit[p.sector]);

/* Header + ticker -------------------------------------------------------- */
const tickerItems = () =>
  [...products.filter((p) => p.featured), ...chemicals.filter((c) => c.featured)]
    .map((p) => {
      const s = (isChem(p) ? sectors.find((x) => x.id === 'chemicals') : sectors.find((x) => x.id === p.sector)).brandShort;
      const href = productHref(p);
      return `<li><a href="${href}"><strong>${esc(p.name)}</strong><span>${esc(s)}</span></a></li>`;
    })
    .join('');

export const header = () => html`
<a class="skip" href="#main">Skip to content</a>
<header class="hdr" data-header>
  <div class="hdr__bar">
    <a class="brand" href="#top" aria-label="${site.name}, back to top">
      <span class="brand__name">GoodBiz<span> Global</span></span>
      <span class="brand__tag">${esc(site.tagline)}</span>
    </a>
    <nav class="hdr__nav" id="site-nav" aria-label="Main">
      <ul>
        <li class="has-menu">
          <button class="hdr__link" type="button" aria-expanded="false" aria-controls="cat-menu" data-dropdown>Our brands ${icon('chevron')}</button>
          <div class="mega" id="cat-menu" data-open="false">
            <ul>
              ${sectors.map(
                (s) => `<li><a href="${s.page}">${brandMark(s, { size: 'sm' })}<small>${esc(s.name)} · ${plural(
                  bySector(s.id).length,
                  'line',
                )}</small></a></li>`,
              )}
            </ul>
          </div>
        </li>
        ${nav.map((n) => `<li><a class="hdr__link" href="${n.href}">${n.label}</a></li>`)}
        <li class="hdr__menu-quote"><a class="hdr__link" href="#quote">Request a quote</a></li>
      </ul>
    </nav>
    <a class="enquiry-count" href="#quote" data-enquiry-count hidden><span class="enquiry-count__label">Enquiry list</span> <span class="enquiry-count__n" data-enquiry-n>0</span></a>
    <a class="btn btn--white hdr__cta" href="#quote">Request a quote</a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-menu-toggle>${icon('menu')}<span class="visually-hidden">Menu</span></button>
  </div>
</header>
<div class="ticker" aria-label="Products open for enquiry" data-ticker-bar>
    <p class="ticker__label"><span class="ticker__dot" aria-hidden="true"></span>Open for enquiry</p>
    <div class="ticker__window">
      <ul class="ticker__track" data-ticker>${tickerItems()}</ul>
    </div>
    <p class="ticker__from">${icon('pin')} Ships from India</p>
</div>
<a class="mbar" href="#quote" data-mbar aria-hidden="true" tabindex="-1">
  <span><strong data-mbar-n>0</strong> in your enquiry list</span>
  <span class="mbar__go">Review and send ${icon('arrow')}</span>
</a>`;

/* Hero: search-led ------------------------------------------------------- */
export const hero = () => html`
<section class="hero" id="top" aria-labelledby="hero-title">
  <div class="hero__media">
    ${pic('port', 'Container ship alongside cranes at a port', { eager: true, pos: '40% 50%', sizes: '(max-width: 760px) 100vw, 60vw' })}
  </div>
  <div class="hero__inner">
    <h1 class="hero__title" id="hero-title"><span class="hero__kicker">Merchant exporter from India</span> <span class="tone">Indian Sourcing.</span> Global Opportunities.</h1>
    <p class="hero__lead">One sourcing desk for electrical equipment, rice and spices, soaps and cleaning products, and industrial chemicals, quoted for importers worldwide.</p>
    <form class="search" role="search" action="#categories" data-search autocomplete="off">
      <label class="visually-hidden" for="product-search">Search products</label>
      <span class="search__icon">${icon('search')}</span>
      <input id="product-search" class="search__input" type="search" name="q" placeholder="Search ${
        products.length + chemicals.length
      } products: SLES, turmeric, transformers…" role="combobox" aria-expanded="false" aria-controls="search-results" aria-autocomplete="list" data-search-input>
      <button class="btn btn--brand search__btn" type="submit">Search</button>
      <div class="search__results" id="search-results" role="region" aria-label="Search results" data-open="false" data-search-results></div>
      <p class="visually-hidden" aria-live="polite" data-search-status></p>
    </form>
    <ul class="chips" aria-label="Popular searches">
      ${quickSearches.map((q) => `<li><button type="button" class="chip" data-quick="${esc(q)}">${esc(q)}</button></li>`)}
    </ul>
  </div>
  <div class="hero__cards">
    <a class="action-card action-card--primary" href="#quote">
      <span class="action-card__icon">${icon('doc')}</span>
      <span class="action-card__text"><strong>Request a quotation</strong><small>Any mix of products, one enquiry</small></span>
      <span class="action-card__go">${icon('chevronRight')}</span>
    </a>
    <a class="action-card" href="#chemicals">
      <span class="action-card__icon">${icon('flask')}</span>
      <span class="action-card__text"><strong>Chemical pricing</strong><small>${chemicals.length} solvents, chemicals and surfactants</small></span>
      <span class="action-card__go">${icon('chevronRight')}</span>
    </a>
    <a class="action-card" href="#process">
      <span class="action-card__icon">${icon('ship')}</span>
      <span class="action-card__text"><strong>How we work</strong><small>From specification to shipment</small></span>
      <span class="action-card__go">${icon('chevronRight')}</span>
    </a>
  </div>
</section>`;

/* Categories: one row per sector ----------------------------------------- */
/* Categories we serve: one tab per division, its ranges as cards --------- */
// A division's product ranges, in data order: [{ name, slug, list }].
export const rangesOf = (s) => {
  const ranges = new Map();
  for (const p of bySector(s.id)) {
    const name = isChem(p) ? chemicalGroups.find((g) => g.id === p.group)?.name : p.group || s.short;
    if (!ranges.has(name)) ranges.set(name, []);
    ranges.get(name).push(p);
  }
  return [...ranges].map(([name, list]) => ({ name, slug: `range-${slugify(name)}`, list }));
};
export const slugify = (t) => t.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
// The id each division's panel answers to (#agri, #fmcg ... from older links).
export const catId = (s) => (s.id === 'chemicals' ? 'cat-chemicals' : s.id);

// Registration logos a division names on its own website.
export const regLogos = (s, cls = 'reg-logos') => {
  const list = registrationsFor(s.id);
  if (!list.length) return '';
  return `<ul class="${cls}" aria-label="Registered with">${list
    .map((r) => `<li title="${esc(r.full)}"><img src="${r.logo}" alt="${esc(r.name)}" width="${r.w}" height="${r.h}" loading="lazy" decoding="async"></li>`)
    .join('')}</ul>`;
};

export const siteLink = (s, cls = 'site-link') =>
  `<a class="${cls}" href="${s.site}" target="_blank" rel="noopener">${esc(s.brand)} website ${icon('external')}<span class="visually-hidden"> (opens in a new tab)</span></a>`;

// Each range card's cover: its first picture not already used by an earlier range.
const rangeCard = (s, r, used = new Set()) => {
  const cover = r.list.find((p) => p.image && !used.has(p.image)) || r.list.find((p) => p.image) || r.list[0];
  used.add(cover.image);
  return html`
  <article class="rcard" aria-labelledby="${catId(s)}-${r.slug}">
    <a class="rcard__media" href="${s.page}#${r.slug}" tabindex="-1" aria-hidden="true">${productMedia(cover, '(max-width: 640px) 80vw, (max-width: 1020px) 45vw, 300px')}</a>
    <div class="rcard__body">
      <h3 class="rcard__name" id="${catId(s)}-${r.slug}"><a href="${s.page}#${r.slug}">${esc(r.name)}</a> <span>${r.list.length}</span></h3>
      <ul class="rcard__list">${r.list.map(
        (p) => `<li><a href="${productHref(p)}">${esc(p.name)}</a>${
          isChem(p) ? pricingLink(p, 'rcard__price') : addButton(p.id, p.name, 'Add', defaultUnit[p.sector], { named: true })
        }</li>`,
      )}</ul>
    </div>
  </article>`;
};

const categoryPanel = (s, i) => {
  const ranges = rangesOf(s);
  const id = catId(s);
  return html`
  <div class="catx__panel" role="tabpanel" id="${id}" aria-labelledby="${id}-tab" style="${accentStyle(s)}"${i === 0 ? '' : ' data-inactive'}>
    <div class="catx__head">
      <div class="catx__intro">
        ${brandMark(s, { size: 'md' })}
        <p class="catx__pitch">${esc(s.pitch)}</p>
      </div>
      <div class="catx__side">
        <ul class="catx__facts">
          <li>${icon('list')} ${plural(bySector(s.id).length, 'product')} in ${plural(ranges.length, 'range')}</li>
          ${s.facts.map((f) => `<li>${icon('shield')} ${esc(f)}</li>`)}
        </ul>
        ${regLogos(s, 'reg-logos reg-logos--sm')}
      </div>
    </div>
    <div class="catx__ranges" style="--cols:${ranges.length % 4 === 0 ? 4 : 3}">${((used) => ranges.map((r) => rangeCard(s, r, used)))(new Set())}</div>
    <div class="catx__foot">
      <a class="btn btn--brand catx__enter" href="${s.page}">Enter ${esc(s.brandShort)} ${icon('arrow')}</a>
      ${s.id === 'chemicals' ? `<a class="link" href="#chemicals">Search the chemical catalogue</a>` : ''}
      ${siteLink(s)}
    </div>
  </div>`;
};

export const categories = () => html`
<section class="section categories catx" id="categories" aria-labelledby="categories-title">
  <div class="section__head">
    <h2 class="section__title" id="categories-title">${twoTone('Categories', 'we serve')}</h2>
    <p class="section__lead">Every range from our four divisions, as listed on each division’s own website. Pick a division, then add products to one enquiry.</p>
  </div>
  <div class="tabs catx__tabs" role="tablist" aria-label="Divisions" data-tabs>
    ${sectors.map(
      (s, i) =>
        `<button class="tab catx__tab${i === 0 ? ' is-active' : ''}" type="button" role="tab" id="${catId(s)}-tab" aria-controls="${catId(s)}" aria-selected="${
          i === 0
        }" tabindex="${i === 0 ? 0 : -1}" style="${accentStyle(s)}">${icon(s.icon)}${esc(s.brandShort)} <span>${bySector(s.id).length}</span></button>`,
    )}
  </div>
  ${sectors.map(categoryPanel)}
</section>`;

/* Facts band: verifiable portfolio facts only ----------------------------- */
export const factsBand = () => html`
<section class="facts" aria-label="Portfolio at a glance">
  <ul>
    <li><strong>${sectors.length}</strong><span>divisions, one sourcing desk</span></li>
    <li><strong>${products.length + chemicals.length}</strong><span>products across all four divisions</span></li>
    <li><strong>${chemicals.length}</strong><span>chemicals in ${chemicalGroups.length} groups: ${chemicalGroups.map((g) => g.short.toLowerCase()).join(', ')}</span></li>
    <li><strong>${registrations.length}</strong><span>export registrations named by our divisions</span></li>
  </ul>
</section>`;

/* Chemicals: catalogue + pricing request --------------------------------- */
const chemRow = (c) => html`
  <tr class="chem-table__row" data-chem-row data-group="${c.group}" data-name="${esc(c.name.toLowerCase())}">
    <th scope="row" class="chem-table__name">${esc(c.name)}${c.note ? `<span class="chem-table__note">${esc(c.note)}</span>` : ''}</th>
    <td class="chem-table__group">${esc(groupName(c.group))}</td>
    <td class="chem-table__use">${c.use ? esc(c.use) : '<span class="chem-table__empty">Application confirmed on enquiry</span>'}</td>
    <td class="chem-table__act">${pricingLink(c)}</td>
  </tr>`;

export const options = (list, selected = '') => list.map((o) => `<option${o === selected ? ' selected' : ''}>${esc(o)}</option>`).join('');

export const contactFields = (prefix) => html`
  <div class="field-row">
    <label class="field">
      <span class="field__label">Your name <abbr title="required">*</abbr></span>
      <input name="name" required autocomplete="name" maxlength="120">
    </label>
    <label class="field">
      <span class="field__label">Company <abbr title="required">*</abbr></span>
      <input name="company" required autocomplete="organization" maxlength="160">
    </label>
  </div>
  <div class="field-row">
    <label class="field">
      <span class="field__label">Business email <abbr title="required">*</abbr></span>
      <input type="email" name="email" required autocomplete="email" id="${prefix}-email" maxlength="160">
    </label>
    <label class="field">
      <span class="field__label">Phone or WhatsApp</span>
      <input type="tel" name="phone" autocomplete="tel" maxlength="40">
    </label>
  </div>`;

export const consent = (prefix) => html`
  <label class="check check--consent">
    <input type="checkbox" name="consent" required id="${prefix}-consent">
    <span>GoodBiz Global may use these details to answer this enquiry, as set out in the <a href="privacy.html">privacy notice</a>.</span>
  </label>`;

const chemForm = () => html`
<form class="form card chem-form" id="chem-enquiry" data-form="chemical" novalidate>
  <h3 class="form__title">Request chemical pricing</h3>
  <p class="form__intro">Choose the product, then tell us how much, where it is going and how you want it packed.</p>
  <label class="field">
    <span class="field__label">Product <abbr title="required">*</abbr></span>
    <select name="product" required data-chem-select>
      <option value="">Select a product</option>
      ${groupsInUse().map(
        (g) => `<optgroup label="${esc(g.name)}">${chemicals
          .filter((c) => c.group === g.id)
          .map((c) => `<option value="${c.id}">${esc(c.name)}</option>`)
          .join('')}</optgroup>`,
      )}
      <option value="other">Another chemical (describe below)</option>
    </select>
  </label>
  <div class="field-row">
    <label class="field">
      <span class="field__label">Quantity <abbr title="required">*</abbr></span>
      <input name="quantity" inputmode="decimal" required placeholder="e.g. 20" pattern="[0-9]+([.,][0-9]+)?" maxlength="12">
    </label>
    <label class="field">
      <span class="field__label">Unit <abbr title="required">*</abbr></span>
      <select name="unit" required>${options(units, 'Metric tonnes (MT)')}</select>
    </label>
  </div>
  <label class="field">
    <span class="field__label">Destination country <abbr title="required">*</abbr></span>
    <input name="country" required autocomplete="country-name" maxlength="80">
  </label>
  <label class="field">
    <span class="field__label">Required grade or specification</span>
    <textarea name="grade" rows="2" maxlength="1000" placeholder="Grade, purity or standard you require"></textarea>
  </label>
  <label class="field">
    <span class="field__label">Packaging preference</span>
    <select name="packaging">${options(packagingOptions)}</select>
  </label>
  <fieldset class="field checks">
    <legend class="field__label">Technical documents (optional)</legend>
    <label class="check"><input type="checkbox" name="docs" value="SDS"> SDS, safety data sheet</label>
    <label class="check"><input type="checkbox" name="docs" value="TDS"> TDS, technical data sheet</label>
    <label class="check"><input type="checkbox" name="docs" value="COA"> COA, certificate of analysis</label>
    <span class="field__hint">Shared only where the producer issues them for the quoted product or lot.</span>
  </fieldset>
  ${contactFields('chem')}
  <label class="field">
    <span class="field__label">Anything else</span>
    <textarea name="message" rows="3" maxlength="2000" placeholder="Delivery timeline, Incoterms, end use, or another chemical"></textarea>
  </label>
  ${consent('chem')}
  <button class="btn btn--brand btn--block" type="submit">Send pricing request</button>
  <p class="form__status" role="status" data-form-status></p>
</form>`;

export const chemicalsSection = () => html`
<section class="section chem" id="chemicals" aria-labelledby="chem-title">
  <div class="section__head">
    <h2 class="section__title" id="chem-title">${twoTone('Chemicals &', 'industrial solvents')}</h2>
    <p class="section__lead">Organic solvents, inorganic chemicals and surfactants for bulk-export enquiries, subject to confirmed supplier availability, an agreed specification and the rules of the destination country.</p>
  </div>
  <div class="chem__panel">
    <div class="chem__catalogue">
      <div class="tabs tabs--filter" role="group" aria-label="Filter by chemical group"${groupsInUse().length < 2 ? ' hidden' : ''}>
        <button type="button" class="tab is-active" aria-pressed="true" data-chem-filter="all">All <span>${chemicals.length}</span></button>
        ${groupsInUse().map(
          (g) =>
            `<button type="button" class="tab" aria-pressed="false" data-chem-filter="${g.id}">${esc(g.short)} <span>${
              chemicals.filter((c) => c.group === g.id).length
            }</span></button>`,
        )}
      </div>
      <label class="search search--inline">
        <span class="visually-hidden">Search chemicals by name</span>
        <span class="search__icon">${icon('search')}</span>
        <input class="search__input" type="search" placeholder="Search by name, e.g. SLES, toluene, caustic" autocomplete="off" data-chem-search>
      </label>
      <p class="chem__status" aria-live="polite" data-chem-status>Showing all ${chemicals.length} products</p>
      <div class="card chem__table-card">
        <table class="chem-table">
          <caption class="visually-hidden">Chemicals and industrial solvents available for bulk-export enquiry</caption>
          <thead><tr><th scope="col">Product</th><th scope="col">Group</th><th scope="col">Common industrial use</th><th scope="col"><span class="visually-hidden">Pricing</span></th></tr></thead>
          ${groupsInUse().map(
            (g) => html`
            <tbody data-chem-group="${g.id}">
              <tr class="chem-table__heading"><th colspan="4" scope="colgroup">${esc(g.name)}</th></tr>
              ${chemicals.filter((c) => c.group === g.id).map(chemRow)}
            </tbody>`,
          )}
        </table>
        <div class="empty" data-chem-empty hidden>
          ${icon('search')}
          <p><strong>No chemical matches “<span data-chem-term></span>”.</strong> We may still source it: choose “Another chemical” in the form and name it.</p>
          <button type="button" class="btn btn--soft btn--sm" data-chem-clear>Clear search</button>
        </div>
      </div>
      <p class="fineprint">Uses shown are general industrial applications, not specifications. Grade, purity, packaging, HSN classification and documentation are confirmed with the supplier on each quotation. No price is published because prices depend on grade, volume, packing and destination.</p>
    </div>
    ${chemForm()}
  </div>
</section>`;

/* How we work: tabbed steps ---------------------------------------------- */
const stepDetail = {
  Enquire: ['Product name, or several', 'Quantity and unit', 'Destination country and port', 'When you need it'],
  Specify: ['Grade or specification', 'Packaging and labelling', 'Documents: SDS, TDS, COA, origin', 'Destination import rules'],
  Match: ['Indian manufacturers, growers and processors', 'Checked against your specification', 'Samples where the producer offers them'],
  Quote: ['Written quotation with Incoterms', 'Validity and payment terms stated', 'Subject to confirmed availability'],
  Ship: ['Export packing and marking', 'Export documentation', 'Handover to your forwarder or nominated line'],
};

export const processSection = () => html`
<section class="section process" id="process" aria-labelledby="process-title">
  <div class="section__head">
    <h2 class="section__title" id="process-title">${twoTone('How we', 'work')}</h2>
    <p class="section__lead">Specification first, then price. Five steps from your enquiry to a shipment leaving an Indian port.</p>
  </div>
  <div class="tabs" role="tablist" aria-label="Steps" data-tabs>
    ${process.map(
      (s, i) =>
        `<button class="tab${i === 0 ? ' is-active' : ''}" type="button" role="tab" id="step-tab-${i}" aria-controls="step-${i}" aria-selected="${
          i === 0
        }" tabindex="${i === 0 ? 0 : -1}">${icon(s.icon)}${esc(s.verb)}</button>`,
    )}
  </div>
  <div class="process__panels">
    ${process.map(
      (s, i) => html`
      <div class="process__panel" role="tabpanel" id="step-${i}" aria-labelledby="step-tab-${i}"${i === 0 ? '' : ' data-inactive'}>
        <div class="process__text">
          <h3>${esc(s.verb)}</h3>
          <p>${esc(s.text)}</p>
          <ul>${stepDetail[s.verb].map((d) => `<li>${icon('check')}${esc(d)}</li>`)}</ul>
          <a class="btn btn--white" href="#quote">Start an enquiry</a>
        </div>
        <div class="process__media">${pic(s.image, '', { sizes: '(max-width: 760px) 100vw, 40vw', pos: s.position })}</div>
      </div>`,
    )}
  </div>
</section>`;

/* What sets us apart: four commitments as ruled rows -------------------- */
export const reasonsSection = () => html`
<section class="section reasons" id="why" aria-labelledby="why-title">
  <div class="section__head">
    <h2 class="section__title" id="why-title">What sets us apart</h2>
    <p class="section__lead">Commitments about how we work, not claims about volume.</p>
  </div>
  <ul class="reasons__list">
    ${reasons.map((r) => `<li><h3>${esc(r.phrase)}</h3><p>${esc(r.text)}</p></li>`)}
  </ul>
</section>`;

/* Markets ---------------------------------------------------------------- */
export const marketsSection = () => html`
<section class="section markets" id="markets" aria-labelledby="markets-title">
  <div class="section__head">
    <h2 class="section__title" id="markets-title">${twoTone('Target', 'markets')}</h2>
    <p class="section__lead">Regions GoodBiz Global intends to focus on. Enquiries from any other country are welcome; destination rules are checked for every country before we quote.</p>
  </div>
  <ul class="markets__list">${markets.map((m) => `<li>${icon('globe')}${esc(m.replace(/^the /, ''))}</li>`)}</ul>
</section>`;

/* About ------------------------------------------------------------------ */
export const about = () => html`
<section class="section about" id="about" aria-labelledby="about-title">
  <div class="about__card card">
    <div class="about__media">${pic('madras1996', 'Cargo ship and cranes at the port of Madras (Chennai), 1996', { sizes: '(max-width: 760px) 100vw, 40vw' })}</div>
    <div class="about__text">
      <h2 class="section__title" id="about-title">${twoTone('About', 'GoodBiz Global')}</h2>
      <p>GoodBiz Global is an India-based merchant exporter and international sourcing partner. We do not run factories or farms; we work between them and the buyer.</p>
      <p>An importer sends one enquiry, and we find the Indian manufacturer, grower or processor that fits the specification, agree the quotation and coordinate the shipment to the port.</p>
      <ul class="about__facts">
        <li>${icon('pin')}<span><small>Based in</small>India</span></li>
        <li>${icon('match')}<span><small>Works as</small>Merchant exporter and sourcing partner</span></li>
        ${site.phone ? `<li>${icon('phone')}<span><small>Call</small><a href="${telHref}">${esc(site.phone)}</a></span></li>` : ''}
        <li>${icon('mail')}<span><small>Write to</small><a href="mailto:${site.email}">${site.email}</a></span></li>
      </ul>
    </div>
  </div>
</section>`;

/* Quote ------------------------------------------------------------------ */
export const quote = () => html`
<section class="section quote" id="quote" aria-labelledby="quote-title">
  <div class="quote__panel">
    <div class="quote__intro">
      <h2 class="section__title" id="quote-title">Request a quotation</h2>
      <p>One enquiry for any mix of products. We confirm the specification first, then quote in writing.</p>
      <ul class="quote__points">
        ${site.replyTime ? `<li>${icon('check')}<span>${esc(site.replyTime)}</span></li>` : ''}
        <li>${icon('check')}<span>No prices published; every quote is specific to grade, volume, packing and destination</span></li>
        ${site.phone ? `<li>${icon('phone')}<span>Prefer to talk? Call <a href="${telHref}">${esc(site.phone)}</a></span></li>` : ''}
        <li>${icon('check')}<span>Prefer email? <a href="mailto:${site.email}">${site.email}</a></span></li>
      </ul>
    </div>
    <form class="form quote__form" id="quote-form" data-form="quote" novalidate>
      <div class="quote__items" role="group" aria-labelledby="list-title">
        <h3 class="form__title" id="list-title">Your enquiry list</h3>
        <p class="quote__empty" data-list-empty>No products added yet. Use “Add to enquiry” on any product above or in search, or describe what you need below.</p>
        <ol class="enquiry-list" data-list></ol>
      </div>
      <label class="field">
        <span class="field__label">Products not listed, or more detail</span>
        <textarea name="products_other" rows="3" maxlength="2000" placeholder="Product, specification, quantity and any standards you require"></textarea>
      </label>
      ${contactFields('quote')}
      <div class="field-row">
        <label class="field">
          <span class="field__label">Destination country <abbr title="required">*</abbr></span>
          <input name="country" required autocomplete="country-name" maxlength="80">
        </label>
        <label class="field">
          <span class="field__label">Destination port</span>
          <input name="port" placeholder="e.g. Jebel Ali, Mombasa, Rotterdam" maxlength="80">
        </label>
      </div>
      <div class="field-row">
        <label class="field">
          <span class="field__label">Preferred Incoterms</span>
          <select name="incoterms">${options(['Not sure yet', 'FOB', 'CFR', 'CIF', 'EXW', 'FCA', 'DAP'])}</select>
        </label>
        <label class="field">
          <span class="field__label">When do you need it?</span>
          <select name="timeline">${options(['Within a month', 'One to three months', 'Three months or more', 'Price check only'])}</select>
        </label>
      </div>
      <label class="field">
        <span class="field__label">Message</span>
        <textarea name="message" rows="3" maxlength="2000"></textarea>
      </label>
      ${consent('quote')}
      <button class="btn btn--brand btn--block" type="submit">Send enquiry</button>
      <p class="form__status" role="status" data-form-status></p>
    </form>
  </div>
</section>`;

/* Footer: company line, the four divisions, then legal ------------------ */
export const footer = () => html`
<footer class="ftr">
  <div class="ftr__inner">
    <div class="ftr__lead">
      <p class="ftr__line">Indian sourcing.<br>Global opportunities.</p>
      <div class="ftr__reach">
        <a class="btn btn--white" href="#quote">Request a quotation</a>
        <ul class="ftr__contact">
          ${site.phone ? `<li>${icon('phone')}<a href="${telHref}">${esc(site.phone)}</a></li>` : ''}
          <li>${icon('mail')}<span><a href="mailto:${site.email}">${esc(site.email)}</a></span></li>
          ${site.address ? `<li>${icon('pin')}<span>${esc(site.address)}</span></li>` : ''}
        </ul>
        ${site.hours ? `<p class="ftr__hours">${esc(site.hours)}</p>` : ''}
      </div>
    </div>
    <nav class="ftr__divisions" aria-label="GoodBiz divisions">
      <ul>${sectors.map(
        (s) => html`
        <li style="${accentStyle(s)}">
          <a class="ftr__division" href="${s.page}">${brandMark(s, { size: 'sm' })}<span>${plural(bySector(s.id).length, 'product')}</span></a>
          ${siteLink(s, 'ftr__site')}
        </li>`,
      )}</ul>
    </nav>
    <div class="ftr__meta">
      <p class="brand__name">GoodBiz<span> Global</span></p>
      <ul>
        <li><a href="#about">About us</a></li><li><a href="#process">How we work</a></li><li><a href="#registrations">Registrations</a></li><li><a href="#chemicals">Chemical pricing</a></li>
      </ul>
    </div>
  </div>
  <div class="ftr__bottom">
    <p>© ${new Date().getFullYear()} GoodBiz Global. All rights reserved.</p>
    <ul>${legal.map((l) => `<li><a href="${l.href}">${esc(l.label)}</a></li>`)}</ul>
  </div>
</footer>`;
