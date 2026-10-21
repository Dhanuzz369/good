// The enquiry list: products a buyer adds from anywhere on the page, carried
// into the quotation form with a quantity and unit for each line.
import { units } from '../data/content.js';

const KEY = 'goodbiz-enquiry-v1';
const listeners = new Set();
let items = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((i) => i && i.id && i.name) : [];
  } catch {
    return [];
  }
}
function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* private mode: the list still works for this visit */
  }
  listeners.forEach((fn) => fn(items));
}

export const getItems = () => items;
export const has = (id) => items.some((i) => i.id === id);
export function add(id, name, unit) {
  if (!has(id)) items = [...items, { id, name, qty: '', unit: units.includes(unit) ? unit : units[1] }];
  save();
}
export function remove(id) {
  items = items.filter((i) => i.id !== id);
  save();
}
export function update(id, patch) {
  items = items.map((i) => (i.id === id ? { ...i, ...patch } : i));
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
}
export function clear() {
  items = [];
  save();
}
export const subscribe = (fn) => listeners.add(fn);

// Escapes every value written into the list markup (names come from our own
// data, but quantities come from storage the visitor controls).
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// The one authored motion moment: the product's name travels from the
// button into the header's enquiry count, so the buyer sees where it went.
function flyToList(from, name) {
  const target = document.querySelector('[data-enquiry-count]:not([hidden]) [data-enquiry-n]');
  if (!target || matchMedia('(prefers-reduced-motion: reduce)').matches || !from.animate) return;
  const a = from.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  const chip = document.createElement('span');
  chip.className = 'fly-chip';
  chip.textContent = name;
  chip.setAttribute('aria-hidden', 'true');
  document.body.append(chip);
  const c = chip.getBoundingClientRect();
  const x0 = a.left + a.width / 2 - c.width / 2;
  const y0 = a.top + a.height / 2 - c.height / 2;
  const x1 = b.left + b.width / 2 - c.width / 2;
  const y1 = b.top + b.height / 2 - c.height / 2;
  chip
    .animate(
      [
        { transform: `translate(${x0}px, ${y0}px) scale(1)`, opacity: 0 },
        { transform: `translate(${x0}px, ${y0 - 24}px) scale(1)`, opacity: 1, offset: 0.18 },
        { transform: `translate(${x1}px, ${y1}px) scale(0.3)`, opacity: 0.2 },
      ],
      { duration: 520, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' },
    )
    .finished.finally(() => chip.remove());
}

export function initEnquiryList() {
  const count = document.querySelector('[data-enquiry-count]');
  const countN = document.querySelector('[data-enquiry-n]');
  const list = document.querySelector('[data-list]');
  const empty = document.querySelector('[data-list-empty]');

  // Every "Add to enquiry" control, including ones the search draws later,
  // is handled by one delegated listener and upgraded into a toggle button.
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-add]');
    if (!el) return;
    e.preventDefault();
    const { add: id, name, unit } = el.dataset;
    if (has(id)) remove(id);
    else {
      add(id, name, unit);
      flyToList(el, name);
    }
  });
  document.addEventListener('keydown', (e) => {
    const el = e.target.closest?.('[data-add]');
    if (el && e.key === ' ') {
      e.preventDefault();
      el.click();
    }
  });

  const paintButtons = () => {
    document.querySelectorAll('[data-add]').forEach((el) => {
      el.setAttribute('role', 'button');
      const on = has(el.dataset.add);
      el.classList.toggle('is-added', on);
      el.setAttribute('aria-pressed', String(on));
      const label = el.querySelector('.add__label');
      const base = el.dataset.label || (el.dataset.label = label.textContent);
      label.textContent = on ? 'Added' : base;
      el.setAttribute('aria-label', `${on ? 'Remove' : 'Add'} ${el.dataset.name} ${on ? 'from' : 'to'} enquiry list`);
    });
  };

  const paintList = () => {
    if (!list) return;
    empty.hidden = items.length > 0;
    list.innerHTML = items
      .map(
        (i, n) => `
      <li class="enquiry-list__item" data-item="${esc(i.id)}">
        <span class="enquiry-list__name">${esc(i.name)}</span>
        <label class="field">
          <span class="field__label">Quantity</span>
          <input name="qty-${n}" inputmode="decimal" value="${esc(i.qty)}" data-qty>
        </label>
        <label class="field">
          <span class="field__label">Unit</span>
          <select name="unit-${n}" data-unit>${units
            .map((u) => `<option${u === i.unit ? ' selected' : ''}>${esc(u)}</option>`)
            .join('')}</select>
        </label>
        <button type="button" class="enquiry-list__remove" data-remove aria-label="Remove ${esc(i.name)}">Remove</button>
      </li>`,
      )
      .join('');
  };

  let last = items.length;
  const paintCount = () => {
    if (!count) return;
    count.hidden = items.length === 0;
    countN.textContent = items.length;
    if (items.length > last) {
      count.classList.remove('is-bumped');
      void count.offsetWidth;
      count.classList.add('is-bumped');
    }
    last = items.length;
  };

  list?.addEventListener('input', (e) => {
    const li = e.target.closest('[data-item]');
    if (!li) return;
    if (e.target.matches('[data-qty]')) update(li.dataset.item, { qty: e.target.value });
    if (e.target.matches('[data-unit]')) update(li.dataset.item, { unit: e.target.value });
  });
  list?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-remove]');
    if (btn) remove(btn.closest('[data-item]').dataset.item);
  });

  // Phone-width bar that keeps the list one tap away; hidden while the
  // quote form itself is on screen.
  const mbar = document.querySelector('[data-mbar]');
  const mbarN = document.querySelector('[data-mbar-n]');
  let quoteVisible = false;
  const paintBar = () => {
    if (!mbar) return;
    mbarN.textContent = items.length;
    const show = items.length > 0 && !quoteVisible;
    mbar.dataset.open = String(show);
    mbar.setAttribute('aria-hidden', String(!show));
    mbar.tabIndex = show ? 0 : -1;
  };
  const quote = document.getElementById('quote');
  if (quote && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => {
      quoteVisible = e.isIntersecting;
      paintBar();
    }).observe(quote);
  }

  const paint = () => {
    paintBar();
    paintButtons();
    paintList();
    paintCount();
  };
  subscribe(paint);
  paint();
  return paintButtons;
}
