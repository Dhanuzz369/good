// Brand-style presentation of the four divisions: the homepage's
// promotional banners and "Our brands" cards, and one page per range with
// every product at its own anchor (the target of every product link).
import { esc, html, addButton, plural } from './util.js';
import { icon } from './icons.js';
import { site } from '../data/site.js';
import { sectors, chemicalGroups, defaultUnit, productHref, registrations } from '../data/products.js';
import { pic, bySector, isChem, productMedia, telHref, rangesOf, regLogos, siteLink } from './sections.js';
import { brandMark, accentStyle } from './brand.js';

const chemPricingHref = (c) => `index.html?chem=${encodeURIComponent(c.id)}#chem-enquiry`;

/* Homepage: promotional banners ------------------------------------------ */
export const adBanners = () => html`
<section class="ads" aria-roledescription="carousel" aria-label="Featured product ranges" data-ads>
  <div class="ads__track" data-ads-track tabindex="0" aria-live="off">
    ${sectors.map(
      (s, i) => html`
      <article class="ad" aria-roledescription="slide" aria-label="${i + 1} of ${sectors.length}: ${esc(s.name)}" data-ad>
        ${pic(s.image, s.imageAlt, { cls: 'ad__img', sizes: '(max-width: 760px) 100vw, 1280px' })}
        <div class="ad__copy">
          ${brandMark(s, { size: 'sm' })}
          <p class="ad__range">${esc(s.name)}</p>
          <h2 class="ad__title">${esc(s.adTitle)}</h2>
          <p class="ad__text">${esc(s.adText)}</p>
          <div class="ad__actions">
            <a class="btn btn--white" href="${s.page}">Enter ${esc(s.brandShort)}</a>
            <a class="ad__link" href="#quote">Request a quote ${icon('arrow')}</a>
          </div>
        </div>
      </article>`,
    )}
  </div>
  <div class="ads__controls">
    <button class="round-btn" type="button" data-ads-prev aria-label="Previous range">${icon('chevronLeft')}</button>
    <div class="ads__dots" role="group" aria-label="Choose a range">
      ${sectors.map(
        (s, i) =>
          `<button class="ads__dot${i === 0 ? ' is-active' : ''}" type="button" data-ads-dot="${i}" aria-label="${esc(s.short)}"${
            i === 0 ? ' aria-current="true"' : ''
          }></button>`,
      )}
    </div>
    <button class="round-btn" type="button" data-ads-next aria-label="Next range">${icon('chevronRight')}</button>
    <button class="ads__pause" type="button" data-ads-pause aria-pressed="false">Pause</button>
  </div>
</section>`;

/* Division brands ------------------------------------------------------ */
// Homepage gateway: one card per division, its ranges, its registrations,
// and two ways in: the division page here, or the division's own website.
const gatewayTile = (s) => {
  const items = bySector(s.id);
  const ranges = rangesOf(s);
  return html`
  <article class="gate" style="${accentStyle(s)}" aria-labelledby="gate-${s.id}" data-reveal>
    <a class="gate__media" href="${s.page}" tabindex="-1" aria-hidden="true">
      ${pic(s.image, '', { cls: 'gate__img', sizes: '(max-width: 760px) 100vw, 50vw' })}
      <span class="gate__count">${plural(items.length, 'product')}</span>
    </a>
    <div class="gate__body">
      ${brandMark(s, { size: 'lg', as: 'h3', id: `gate-${s.id}` })}
      <p class="gate__pitch">${esc(s.pitch)}</p>
      <ul class="gate__ranges" aria-label="${esc(s.brandShort)} ranges">${ranges.map(
        (r) => `<li><a href="${s.page}#${r.slug}">${esc(r.name)} <span>${r.list.length}</span></a></li>`,
      )}</ul>
      ${regLogos(s) ? `<div class="gate__regs"><p>Registered with</p>${regLogos(s)}</div>` : ''}
      <div class="gate__actions">
        <a class="gate__go" href="${s.page}">Enter ${esc(s.brandShort)} ${icon('arrow')}</a>
        ${siteLink(s, 'gate__site')}
      </div>
    </div>
  </article>`;
};

export const brandGateway = () => html`
<section class="section gateway" id="brands" aria-labelledby="brands-title">
  <div class="section__head section__head--row">
    <div>
      <h2 class="section__title" id="brands-title">Our brands</h2>
      <p class="section__lead">Four divisions, one sourcing desk. Choose the one you buy from to see only its products, or visit its own website.</p>
    </div>
    <nav class="gateway__jump" aria-label="Go straight to a division">
      ${sectors.map((s) => `<a href="${s.page}" style="${accentStyle(s)}">${icon(s.icon)}${esc(s.brandShort)}</a>`)}
    </nav>
  </div>
  <div class="gateway__grid" data-reveal-group>${sectors.map(gatewayTile)}</div>
</section>`;

// Registrations named on the division websites, with the logos they show.
export const registrationsSection = () => html`
<section class="section regs" id="registrations" aria-labelledby="regs-title">
  <div class="section__head">
    <h2 class="section__title" id="regs-title">Registered with</h2>
    <p class="section__lead">Export bodies and regulators our divisions name on their own websites.</p>
  </div>
  <ul class="regs__grid">${registrations.map(
    (r) => html`
    <li class="reg">
      <span class="reg__logo"><img src="${r.logo}" alt="" width="${r.w}" height="${r.h}" loading="lazy" decoding="async"></span>
      <span class="reg__name">${esc(r.name)}</span>
      <span class="reg__full">${esc(r.full)}</span>
      <span class="reg__by">${sectors
        .filter((s) => r.divisions.includes(s.id))
        .map((s) => `<a href="${s.page}" style="${accentStyle(s)}">${esc(s.brandShort)}</a>`)
        .join('')}</span>
    </li>`,
  )}</ul>
  <p class="fineprint">As listed by ${sectors
    .filter((s) => registrations.some((r) => r.divisions.includes(s.id)))
    .map((s) => esc(s.brand))
    .join(' and ')}. Ask us for registration details with your quotation.</p>
</section>`;

// Compact division tile for "Other GoodBiz brands" on a range page.
const brandCard = (s) => html`
  <a class="brand-tile" href="${s.page}" style="${accentStyle(s)}">
    ${pic(s.image, '', { cls: 'brand-tile__img', sizes: '(max-width: 760px) 50vw, 25vw' })}
    <span class="brand-tile__body">${brandMark(s, { size: 'sm' })}<span class="brand-tile__count">${plural(bySector(s.id).length, 'product line')}</span></span>
  </a>`;

/* Range page ------------------------------------------------------------- */
const productCard = (p) => {
  const chem = isChem(p);
  const meta = chem
    ? [chemicalGroups.find((g) => g.id === p.group)?.name, p.use || 'Application confirmed on enquiry']
    : [p.group, p.origin ? `Main growing regions: ${p.origin}` : ''];
  return html`
  <article class="pcard${p.image ? '' : ' pcard--text'}" id="${p.id}" aria-labelledby="${p.id}-name">
    ${p.image ? `<div class="pcard__media">${productMedia(p, '(max-width: 760px) 100vw, 30vw')}</div>` : ''}
    <div class="pcard__body">
      <h3 class="pcard__name" id="${p.id}-name">${esc(p.name)}</h3>
      <ul class="pcard__meta">${meta.filter(Boolean).map((m) => `<li>${esc(m)}</li>`)}</ul>
      ${p.note ? `<p class="pcard__note">${esc(p.note)}</p>` : ''}
      <div class="pcard__actions">
        ${
          chem
            ? `<a class="btn btn--brand btn--sm" href="${chemPricingHref(p)}">Request pricing<span class="visually-hidden"> for ${esc(p.name)}</span></a>`
            : addButton(p.id, p.name, 'Add to enquiry', defaultUnit[p.sector])
        }
        ${p.url ? `<a class="pcard__more" href="${p.url}" target="_blank" rel="noopener">Full details${icon('external')}<span class="visually-hidden"> for ${esc(p.name)} (opens in a new tab)</span></a>` : ''}
      </div>
    </div>
  </article>`;
};

const productGrid = (s) =>
  rangesOf(s)
    .map(
      (r) => html`
      <h2 class="range__group" id="${r.slug}">${esc(r.name)} <span>${r.list.length}</span></h2>
      <div class="pgrid">${r.list.map(productCard)}</div>`,
    )
    .join('');

// Division switcher: the five brands as tabs under the header on range pages.
const switcher = (current) => html`
<nav class="switcher" aria-label="GoodBiz brands">
  <ul>${sectors.map(
    (s) =>
      `<li><a href="${s.page}" style="${accentStyle(s)}"${s.id === current.id ? ' aria-current="page"' : ''}>${icon(s.icon)}${esc(
        s.brandShort,
      )}</a></li>`,
  )}</ul>
</nav>`;

export const sectorPage = (s) => {
  const items = bySector(s.id);
  return html`
<div class="division" style="${accentStyle(s)}">
${switcher(s)}
<section class="range-hero" aria-labelledby="range-title">
  ${pic(s.image, s.imageAlt, { cls: 'range-hero__img', eager: true })}
  <div class="range-hero__inner">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> ${icon('chevronRight')} <a href="index.html#brands">Our brands</a> ${icon('chevronRight')} <span aria-current="page">${esc(s.brand)}</span></nav>
    ${brandMark(s, { size: 'xl' })}
    <h1 class="range-hero__title" id="range-title">${esc(s.h1)}</h1>
    <p class="range-hero__range">${esc(s.name)} · ${plural(items.length, 'product line')}</p>
    <p class="range-hero__text">${esc(s.pitch)}</p>
    <div class="range-hero__actions">
      <a class="btn btn--white" href="#products">See the products</a>
      <a class="ad__link" href="index.html#quote">Request a quotation ${icon('arrow')}</a>
      ${siteLink(s, 'ad__link')}
    </div>
    ${regLogos(s) ? `<div class="range-hero__regs"><p>Registered with</p>${regLogos(s)}</div>` : ''}
  </div>
</section>
<section class="section range" id="products" aria-label="${esc(s.brand)} products">
  <ul class="range__facts">${s.facts.map((f) => `<li>${icon('shield')} ${esc(f)}</li>`)}</ul>
  ${productGrid(s)}
  ${s.id === 'chemicals' ? `<p class="range__more"><a class="link" href="index.html#chemicals">Search and filter the chemical catalogue</a></p>` : ''}
  <p class="fineprint">Offered for bulk-export enquiry, subject to confirmed supplier availability, an agreed specification and the rules of the destination country. Prices, grades, packaging and documents are confirmed on each written quotation.</p>
</section>
<section class="section brands brands--others" aria-labelledby="others-title">
  <div class="section__head">
    <h2 class="section__title" id="others-title">Other GoodBiz brands</h2>
  </div>
  <div class="brand-tiles">${sectors.filter((x) => x.id !== s.id).map(brandCard)}</div>
</section>
<section class="section range-cta" aria-labelledby="range-cta-title">
  <div class="range-cta__panel">
    <h2 class="section__title section__title--light" id="range-cta-title">Ready to send an enquiry?</h2>
    <p>Add the ${esc(s.brandShort)} products you need, then send one enquiry with quantities and destination. You can mix products from every GoodBiz brand.</p>
    <a class="btn btn--white" href="index.html#quote">Review your enquiry list</a>
    <p class="range-cta__mail">${site.phone ? `Call <a href="${telHref}">${esc(site.phone)}</a> or write` : 'Or write'} to <a href="mailto:${site.email}">${site.email}</a></p>
  </div>
</section>
</div>`;
};
