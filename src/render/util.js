import { icon } from './icons.js';

const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => map[c]);

// "1 product line", "8 product lines" (English plural rules).
const rules = new Intl.PluralRules('en');
export const plural = (n, one, many = `${one}s`) => `${n} ${rules.select(n) === 'one' ? one : many}`;

// Tagged template that joins arrays and drops null/false so section
// templates can map over data without manual .join('').
export const html = (strings, ...values) =>
  strings.reduce((out, str, i) => {
    const v = values[i - 1];
    const val = Array.isArray(v) ? v.join('') : v === false || v == null ? '' : v;
    return out + val + str;
  });

// "Add to enquiry" control. Without script it is a plain link to the quote
// form; the enquiry-list module upgrades it into a toggle.
export const addButton = (id, name, label = 'Add to enquiry', unit = '') =>
  `<a class="add" href="#quote" data-add="${esc(id)}" data-name="${esc(name)}"${
    unit ? ` data-unit="${esc(unit)}"` : ''
  }>${icon('plus', { cls: 'icon add__icon add__icon--plus' })}${icon('check', {
    cls: 'icon add__icon add__icon--check',
  })}<span class="add__label">${label}</span></a>`;
