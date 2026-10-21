// Dev-only worst-case datasets (break-ui). The Vite dev server applies one when
// the URL carries ?data=worst|empty|one|huge, renders, then restores the real
// data. Never used by `vite build`. Values are realistic trade data, not noise.
import { sectors, products, chemicals, chemicalGroups } from './products.js';
import { images } from './images.js';
import { site } from './site.js';
import { markets } from './content.js';

const snapshot = () => ({
  products: structuredClone(products),
  chemicals: structuredClone(chemicals),
  sectors: structuredClone(sectors),
  site: { ...site },
  markets: [...markets],
});

const replace = (arr, next) => arr.splice(0, arr.length, ...next);

const fixtures = {
  worst() {
    // Long, real-world product designations spread across rows.
    products[0].name = '33 kV outdoor vacuum circuit breaker with numerical feeder-protection relay panel';
    products[3].name = 'IP66 stainless-steel junction boxes, explosion-proof (ATEX/IECEx) enclosures and cable glands';
    products[8].origin = 'Guntur, Prakasam, Krishna and West Godavari districts, Andhra Pradesh; Byadgi, Haveri district, Karnataka';
    products[18].name = 'Concentrated lemon-and-neem dishwashing liquid, 5 L and 20 L institutional packs';
    chemicals[0].name = 'Polyoxyethylene (20) sorbitan monooleate (Polysorbate 80)';
    chemicals[0].use = 'Non-ionic emulsifier and solubiliser for food, cosmetic and pharmaceutical formulations';
    chemicals.push({
      id: 'lauryl-sulphoacetate-long', group: 'surfactants', review: true,
      name: 'Sodium Lauryl Sulphoacetate (SLSA), 70% active needles, cosmetic grade',
      use: '', note: 'Designation, activity and grade to be confirmed with the supplier before quotation.',
    });
    // A product whose photograph is missing on the server.
    images.missing = { ...images.byadgi, src: 'images/does-not-exist.webp', small: 'images/does-not-exist-800.webp' };
    products[9].image = 'missing';
    products[9].featured = true;
    site.email = 'international.procurement.enquiries@goodbizglobal-exports.com';
    markets.push('the Democratic Republic of the Congo', 'Saint Vincent and the Grenadines', 'Bosnia and Herzegovina');
  },
  empty() {
    // A chemical group with nothing in it, and a range with no featured photos.
    replace(chemicals, chemicals.filter((c) => c.group !== 'inorganic'));
    products.forEach((p) => { if (p.sector === 'fmcg') p.featured = false; });
  },
  one() {
    // Exactly one of everything countable: pluralisation.
    replace(products, [...products.filter((p) => p.sector !== 'textiles'), products.find((p) => p.sector === 'textiles')]);
    replace(chemicals, [chemicals[0], ...chemicals.filter((c) => c.group !== 'solvents')]);
  },
  huge() {
    // A realistic upper bound for an unpaginated catalogue.
    const base = [...chemicals];
    const grades = ['technical', 'industrial', 'cosmetic', 'food', 'pharmaceutical', 'reagent', 'electronic', 'feed'];
    const next = [];
    for (let i = 0; i < 400; i++) {
      const c = base[i % base.length];
      next.push({ ...c, id: `${c.id}-${i}`, name: `${c.name}, ${grades[i % grades.length]} grade`, featured: i < 6 && c.featured });
    }
    replace(chemicals, next);
  },
};

export function withFixture(name, render) {
  if (!fixtures[name]) return render();
  const saved = snapshot();
  try {
    fixtures[name]();
    return render();
  } finally {
    replace(products, saved.products);
    replace(chemicals, saved.chemicals);
    replace(sectors, saved.sectors);
    Object.assign(site, saved.site);
    replace(markets, saved.markets);
    delete images.missing;
  }
}

export const fixtureNames = ['demo', ...Object.keys(fixtures)];
export const groupsUsed = chemicalGroups;
