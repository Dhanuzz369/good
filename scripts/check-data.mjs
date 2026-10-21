// Guards the product data: unique ids, valid references, and none of the
// fields the business must never publish without supplier confirmation.
import { existsSync } from 'node:fs';
import { sectors, products, chemicals, chemicalGroups, quickSearches } from '../src/data/products.js';
import { process as steps } from '../src/data/content.js';
import { images } from '../src/data/images.js';

const errors = [];
const banned = ['price', 'cas', 'hsn', 'stock', 'purity', 'grade', 'packaging', 'certification', 'moq'];
const all = [...products, ...chemicals];

const ids = new Set();
for (const p of all) {
  if (ids.has(p.id)) errors.push(`Duplicate id: ${p.id}`);
  ids.add(p.id);
  for (const k of Object.keys(p)) if (banned.includes(k.toLowerCase())) errors.push(`${p.id}: field "${k}" must not be published`);
}
for (const p of products) if (!sectors.some((s) => s.id === p.sector)) errors.push(`${p.id}: unknown sector ${p.sector}`);
for (const c of chemicals) if (!chemicalGroups.some((g) => g.id === c.group)) errors.push(`${c.id}: unknown group ${c.group}`);
for (const q of quickSearches) {
  const words = q.toLowerCase().split(' ');
  if (!all.some((p) => words.every((w) => p.name.toLowerCase().includes(w.replace(/s$/, ''))))) errors.push(`quick search finds nothing: ${q}`);
}
for (const p of all) if (p.image && !images[p.image]) errors.push(`${p.id}: unknown image ${p.image}`);
for (const key of [...sectors.map((s) => s.image), ...steps.map((s) => s.image)])
  if (!images[key]) errors.push(`Unknown image key: ${key}`);
for (const [key, i] of Object.entries(images))
  for (const f of [i.src, i.small]) if (!existsSync(`public/${f}`)) errors.push(`${key}: missing file public/${f}`);

const review = chemicals.filter((c) => c.review).map((c) => c.name);
console.log(`${products.length} products, ${chemicals.length} chemicals, ${Object.keys(images).length} pictures checked.`);
if (review.length) console.log(`Names to verify against the supplier list before launch: ${review.join('; ')}`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Data check passed.');
