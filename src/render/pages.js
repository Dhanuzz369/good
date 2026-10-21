// Brand-style presentation of the five product ranges: the homepage's
// promotional banners and "Our brands" cards, and one page per range with
// every product at its own anchor (the target of every product link).
import { esc, html, addButton, plural } from './util.js';
import { icon } from './icons.js';
import { site } from '../data/site.js';
import { sectors, chemicalGroups, defaultUnit, productHref } from '../data/products.js';
import { textileSpec } from '../data/content.js';
import { pic, bySector, isChem, productMedia, reviewFlag, tbc, telHref } from './sections.js';
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
// Homepage gateway: one large tile per division; the whole tile opens it.
const gatewayTile = (s, i) => {
  const items = bySector(s.id);
  // Lead tiles name three products, the smaller ones two (one tidy line).
  const named = items.filter((p) => p.featured).sort((x, y) => x.name.length - y.name.length).slice(0, i < 2 ? 3 : 2);
  return html`
  <article class="gate${i < 2 ? ' gate--lead' : ''}" style="${accentStyle(s)}" aria-labelledby="gate-${s.id}" data-reveal>
    ${pic(s.image, '', { cls: 'gate__img', sizes: i < 2 ? '(max-width: 760px) 100vw, 50vw' : '(max-width: 760px) 100vw, 33vw' })}
    <div class="gate__body">
      ${brandMark(s, { size: i < 2 ? 'lg' : 'md', as: 'h3', id: `gate-${s.id}` })}
      <p class="gate__range">${esc(s.name)}</p>
      <p class="gate__pitch">${esc(s.pitch)}</p>
      <ul class="gate__products" aria-label="Includes">${named.map((p) => `<li>${esc(p.name)}</li>`)}${
        items.length > named.length ? `<li>+${items.length - named.length} more</li>` : ''
      }</ul>
      <a class="gate__go" href="${s.page}">Enter ${esc(s.brandShort)} ${icon('arrow')}<span class="visually-hidden">, ${esc(s.brand)}: ${esc(
        plural(items.length, 'product line'),
      )}</span></a>
    </div>
  </article>`;
};

export const brandGateway = () => html`
<section class="section gateway" id="brands" aria-labelledby="brands-title">
  <div class="section__head section__head--row">
    <div>
      <h2 class="section__title" id="brands-title">Our <span class="tone">brands</span></h2>
      <p class="section__lead">Five divisions, one sourcing desk. Choose the one you buy from and see only its products.</p>
    </div>
    <nav class="gateway__jump" aria-label="Go straight to a division">
      ${sectors.map((s) => `<a href="${s.page}" style="${accentStyle(s)}">${icon(s.icon)}${esc(s.brandShort)}</a>`)}
    </nav>
  </div>
  <div class="gateway__grid" data-reveal-group>${sectors.map(gatewayTile)}</div>
</section>`;

// Lower on the homepage: every product, filed under its division.
export const brandsSection = () => html`
<section class="section product-index" id="all-products" aria-labelledby="index-title">
  <div class="section__head">
    <h2 class="section__title" id="index-title">Every product, <span class="tone">by brand</span></h2>
    <p class="section__lead">Each name opens its own entry, with an enquiry or pricing action.</p>
  </div>
  <div class="product-index__cols">
    ${sectors.map(
      (s) => html`
      <div class="product-index__col" style="${accentStyle(s)}">
        <a class="product-index__head" href="${s.page}">${brandMark(s, { size: 'sm' })}</a>
        <ul>${bySector(s.id).map((p) => `<li><a href="${productHref(p)}">${esc(p.name)}</a></li>`)}</ul>
      </div>`,
    )}
  </div>
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
      ${p.review ? reviewFlag : ''}
      <ul class="pcard__meta">${meta.filter(Boolean).map((m) => `<li>${esc(m)}</li>`)}</ul>
      ${p.note ? `<p class="pcard__note">${esc(p.note)}</p>` : ''}
      <div class="pcard__actions">
        ${
          chem
            ? `<a class="btn btn--brand btn--sm" href="${chemPricingHref(p)}">Request pricing<span class="visually-hidden"> for ${esc(p.name)}</span></a>`
            : addButton(p.id, p.name, 'Add to enquiry', defaultUnit[p.sector])
        }
      </div>
    </div>
  </article>`;
};

const productGrid = (s) => {
  const items = bySector(s.id);
  if (s.id !== 'chemicals') return `<div class="pgrid">${items.map(productCard).join('')}</div>`;
  return chemicalGroups
    .filter((g) => items.some((c) => c.group === g.id))
    .map(
      (g) => html`
      <h2 class="range__group" id="group-${g.id}">${esc(g.name)}</h2>
      <div class="pgrid">${items.filter((c) => c.group === g.id).map(productCard)}</div>`,
    )
    .join('');
};

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
    ${brandMark(s, { size: 'xl', as: 'h1', id: 'range-title' })}
    <p class="range-hero__range">${esc(s.name)} · ${plural(items.length, 'product line')}</p>
    <p class="range-hero__text">${esc(s.pitch)}</p>
    <div class="range-hero__actions">
      <a class="btn btn--white" href="#products">See the products</a>
      <a class="ad__link" href="index.html#quote">Request a quotation ${icon('arrow')}</a>
    </div>
  </div>
</section>
<section class="section range" id="products" aria-label="${esc(s.brand)} products">
  <ul class="range__facts">${s.facts.map((f) => `<li>${icon('shield')} ${esc(f)}</li>`)}</ul>
  ${productGrid(s)}
  ${
    s.id === 'textiles'
      ? `<div class="spec-panel range__spec"><p class="spec-panel__title">To quote cloth, send us:</p><dl>${textileSpec
          .map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`)
          .join('')}</dl></div>`
      : ''
  }
  ${s.id === 'chemicals' ? `<p class="range__more"><a class="link" href="index.html#chemicals">Search and filter the chemical catalogue</a></p>` : ''}
  <p class="fineprint">Offered for bulk-export enquiry, subject to confirmed supplier availability, an agreed specification and the rules of the destination country. Prices, grades, packaging and documents are confirmed on each written quotation.</p>
</section>
<section class="section brands brands--others" aria-labelledby="others-title">
  <div class="section__head">
    <h2 class="section__title" id="others-title">Other GoodBiz <span class="tone">brands</span></h2>
  </div>
  <div class="brand-tiles">${sectors.filter((x) => x.id !== s.id).map(brandCard)}</div>
</section>
<section class="section range-cta" aria-labelledby="range-cta-title">
  <div class="range-cta__panel">
    <h2 class="section__title section__title--light" id="range-cta-title">Ready to send an enquiry?</h2>
    <p>Add the ${esc(s.brandShort)} products you need, then send one enquiry with quantities and destination. You can mix products from every GoodBiz brand.</p>
    <a class="btn btn--white" href="index.html#quote">Review your enquiry list</a>
    <p class="range-cta__mail">${site.phone ? `Call <a href="${telHref}">${esc(site.phone)}</a> or write` : 'Or write'} to <a href="mailto:${site.email}">${site.email}</a>${tbc(site.emailConfirmed, 'address to be confirmed')}</p>
  </div>
</section>
</div>`;
};
