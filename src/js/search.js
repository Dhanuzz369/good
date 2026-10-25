// Hero product search: one field across every product and chemical, with
// each result carrying its own enquiry action. Results are built with DOM
// methods (never innerHTML from the query) so typed text can't inject markup.
import { sectors, products, chemicals, chemicalGroups, defaultUnit } from '../data/products.js';
import { images } from '../data/images.js';
import { icon } from '../render/icons.js';

// British and American spellings, and the common trade names buyers type.
const aliases = {
  'caustic-soda': 'sodium hydroxide naoh lye flakes',
  'caustic-soda-liquid': 'sodium hydroxide naoh lye lye solution',
  'titanium-dioxide': 'tio2 pigment',
  'copper-sulphate': 'cuso4 blue vitriol',
  ipa: 'isopropanol 2-propanol',
  dcm: 'dichloromethane',
  sls: 'sodium dodecyl sulphate',
  'sles-70': 'sodium laureth sulphate',
  'sles-28': 'sodium laureth sulphate',
  labsa: 'linear alkyl benzene sulphonic acid',
  jaggery: 'gur gud cane sugar',
  rmu: 'switchgear medium voltage',
  'tr-oil-distribution': 'transformer',
  'tr-oil-power': 'transformer',
  'south-indian-rice': 'sona masoori ponni',
  'arecanut': 'betel nut supari',
  'groundnuts': 'peanuts',
  'herbal-phenol': 'phenyl',
  'dish-wash-liquid': 'dishwashing',
};

export const normalize = (s) =>
  s
    .toLowerCase()
    .replace(/sulfate/g, 'sulphate')
    .replace(/sulfonate/g, 'sulphonate')
    .replace(/chili(?!l)/g, 'chilli')
    .replace(/[^a-z0-9%]+/g, ' ')
    .trim();

const sectorById = Object.fromEntries(sectors.map((s) => [s.id, s]));
const index = [
  ...products.map((p) => ({ ...p, kind: 'product', sectorId: p.sector })),
  ...chemicals.map((c) => ({ ...c, kind: 'chemical', sectorId: 'chemicals' })),
].map((p) => {
  const s = sectorById[p.sectorId];
  const detail =
    p.kind === 'chemical'
      ? chemicalGroups.find((g) => g.id === p.group)?.short
      : p.origin
        ? `Grown in ${p.origin}`
        : p.group || s.tagline;
  return {
    ...p,
    sectorName: s.short,
    detail,
    href: `${s.page}#${p.id}`,
    nameKey: normalize(p.name),
    hay: normalize([p.name, s.name, p.group, p.origin, p.use, aliases[p.id]].filter(Boolean).join(' ')),
  };
});

function rank(q) {
  const tokens = normalize(q).split(' ').filter(Boolean);
  if (!tokens.length) return [];
  return index
    .map((p) => {
      if (!tokens.every((t) => p.hay.includes(t))) return null;
      const starts = p.nameKey.startsWith(tokens[0]) ? 3 : 0;
      const inName = tokens.every((t) => p.nameKey.includes(t)) ? 2 : 0;
      return { p, score: starts + inName };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.p.name.localeCompare(b.p.name))
    .map((r) => r.p);
}

// Highlight the first query token inside the visible name.
function nameWithMark(name, q) {
  const frag = document.createDocumentFragment();
  const first = normalize(q).split(' ')[0];
  const i = first ? name.toLowerCase().indexOf(first) : -1;
  if (i < 0) {
    frag.append(name);
    return frag;
  }
  const mark = document.createElement('mark');
  mark.textContent = name.slice(i, i + first.length);
  frag.append(name.slice(0, i), mark, name.slice(i + first.length));
  return frag;
}

function media(p) {
  const box = document.createElement('span');
  box.className = 'result__media';
  if (p.image && images[p.image]) {
    const img = new Image(48, 48);
    img.src = images[p.image].small;
    img.alt = '';
    img.loading = 'lazy';
    box.append(img);
  } else {
    const tile = document.createElement('span');
    tile.className = `tile-icon tile-icon--${p.sectorId}`;
    tile.innerHTML = icon(p.icon || sectorById[p.sectorId].icon); // static markup from our own icon set
    box.append(tile);
  }
  return box;
}

function action(p) {
  const a = document.createElement('a');
  if (p.kind === 'chemical') {
    a.className = 'btn btn--soft btn--sm';
    a.href = '#chem-enquiry';
    a.dataset.chem = p.id;
    a.textContent = 'Request pricing';
  } else {
    a.className = 'add';
    a.href = '#quote';
    a.dataset.add = p.id;
    a.dataset.name = p.name;
    a.dataset.unit = defaultUnit[p.sectorId] || '';
    // Static markup from our own icon set; the label is set as text.
    a.innerHTML =
      icon('plus', { cls: 'icon add__icon add__icon--plus' }) + icon('check', { cls: 'icon add__icon add__icon--check' });
    const label = document.createElement('span');
    label.className = 'add__label';
    label.textContent = 'Add to enquiry';
    a.append(label);
  }
  return a;
}

export function initSearch({ onRender } = {}) {
  const form = document.querySelector('[data-search]');
  if (!form) return;
  const input = form.querySelector('[data-search-input]');
  const panel = form.querySelector('[data-search-results]');
  const live = document.querySelector('[data-search-status]');
  let current = [];

  const close = () => {
    panel.dataset.open = 'false';
    input.setAttribute('aria-expanded', 'false');
  };

  const render = () => {
    const q = input.value.trim();
    panel.replaceChildren();
    if (!q) {
      if (live) live.textContent = '';
      return close();
    }
    current = rank(q);
    if (live) live.textContent = current.length ? `${current.length} products found` : `No product matches ${q}`;
    if (!current.length) {
      const box = document.createElement('div');
      box.className = 'results__empty';
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = `No product matches “${q}”.`;
      p.append(strong, ' We may still be able to source it.');
      const ask = document.createElement('button');
      ask.type = 'button';
      ask.className = 'btn btn--soft btn--sm';
      ask.textContent = 'Ask us to source it';
      ask.style.marginTop = '10px';
      ask.addEventListener('click', () => {
        const other = document.querySelector('#quote-form [name=products_other]');
        if (other) other.value = other.value ? `${other.value}\n${q}` : q;
        close();
        document.getElementById('quote')?.scrollIntoView();
        other?.focus({ preventScroll: true });
      });
      box.append(p, ask);
      panel.append(box);
    } else {
      const count = document.createElement('p');
      count.className = 'results__count';
      count.textContent = `${current.length} ${current.length === 1 ? 'product' : 'products'} found`;
      const list = document.createElement('ul');
      current.slice(0, 8).forEach((p) => {
        const li = document.createElement('li');
        li.className = 'result';
        const text = document.createElement('span');
        text.className = 'result__text';
        const link = document.createElement('a');
        link.href = p.href;
        link.dataset.resultLink = '';
        link.append(nameWithMark(p.name, q));
        link.addEventListener('click', close);
        const small = document.createElement('small');
        small.textContent = `${p.sectorName} · ${p.detail}`;
        text.append(link, small);
        li.append(media(p), text, action(p));
        list.append(li);
      });
      panel.append(count, list);
    }
    panel.dataset.open = 'true';
    input.setAttribute('aria-expanded', 'true');
    onRender?.();
  };

  let t;
  input.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(render, 90);
  });
  input.addEventListener('focus', () => input.value.trim() && render());

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    render();
    panel.querySelector('[data-result-link]')?.focus();
  });

  // Arrow keys move between result names; Escape returns to the field.
  form.addEventListener('keydown', (e) => {
    const links = [...panel.querySelectorAll('[data-result-link]')];
    const at = links.indexOf(document.activeElement);
    if (e.key === 'ArrowDown' && links.length) {
      e.preventDefault();
      links[Math.min(at + 1, links.length - 1)].focus();
    } else if (e.key === 'ArrowUp' && at >= 0) {
      e.preventDefault();
      (at === 0 ? input : links[at - 1]).focus();
    } else if (e.key === 'Escape') {
      close();
      input.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (!form.contains(e.target)) close();
  });

  document.querySelectorAll('[data-quick]').forEach((chip) =>
    chip.addEventListener('click', () => {
      input.value = chip.dataset.quick;
      render();
      input.focus();
    }),
  );
}
