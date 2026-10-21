import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const load = (file) => import(`${pathToFileURL(resolve(file)).href}?t=${Date.now()}`);

// Renders the product data into index.html at build (and dev) time.
// Placeholders look like <!-- @section name -->.
const renderSections = () => ({
  name: 'goodbiz-render-sections',
  async transformIndexHtml(htmlSource, ctx) {
    const s = await load('src/render/sections.js');
    const pages = await load('src/render/pages.js');
    const { images } = await load('src/data/images.js');
    const { sectors } = await load('src/data/products.js');
    const all = JSON.parse(readFileSync(resolve('source-images/credits.json'), 'utf8'));
    const creditsFor = (out) =>
      Object.values(images)
        .filter((i) => out.includes(i.src))
        .map((i) => all.find((c) => c.file === i.source))
        .filter(Boolean);

    // Dev server only: ?data=worst|empty|one|huge swaps in a break-ui fixture
    // for this render and a small toggle is added to the page.
    const fixtureName = ctx.server ? new URL(ctx.originalUrl || '/', 'http://x').searchParams.get('data') : null;
    const { withFixture, fixtureNames } = await load('src/data/fixtures.js');
    const devToggle = (out) =>
      !ctx.server
        ? out
        : out.replace(
            '</body>',
            `<nav class="dev-data" aria-label="Test data (dev only)">${fixtureNames
              .map((n) => `<a href="?data=${n}"${(fixtureName || 'demo') === n ? ' aria-current="true"' : ''}>${n === 'huge' ? '400 rows' : n === 'one' ? '1' : n[0].toUpperCase() + n.slice(1)}</a>`)
              .join('')}</nav><style>.dev-data{position:fixed;z-index:999;left:50%;bottom:12px;translate:-50% 0;display:flex;gap:2px;padding:3px;border-radius:999px;background:#e5e7eb;font:500 12px system-ui}.dev-data a{padding:6px 10px;border-radius:999px;color:#111;text-decoration:none}.dev-data a[aria-current]{background:#fff;box-shadow:0 1px 2px #0002}</style></body>`,
          );
    return devToggle(withFixture(fixtureName, () => render()));

    function render() {
    // Range pages: same header and footer, with in-page links pointing home.
    const sectorMatch = htmlSource.match(/<!-- @sector-page ([a-z]+) -->/);
    if (sectorMatch) {
      const sector = sectors.find((x) => x.id === sectorMatch[1]);
      const rebase = (h) => h.replaceAll('href="#', 'href="index.html#').replace('href="index.html#main"', 'href="#main"');
      let out = htmlSource
        .replace('<!-- @section header -->', rebase(s.header()))
        .replace(sectorMatch[0], pages.sectorPage(sector));
      return out.replace('<!-- @section footer -->', rebase(s.footer(creditsFor(out))));
    }
    if (!ctx.filename.endsWith('index.html')) return htmlSource;

    let out = htmlSource
      .replace('<!-- @section header -->', s.header())
      .replace('<!-- @section hero -->', s.hero())
      .replace('<!-- @section gateway -->', pages.brandGateway())
      .replace('<!-- @section ads -->', pages.adBanners())
      .replace('<!-- @section brands -->', pages.brandsSection())
      .replace('<!-- @section categories -->', s.categories())
      .replace('<!-- @section facts -->', s.factsBand())
      .replace('<!-- @section chemicals -->', s.chemicalsSection())
      .replace('<!-- @section process -->', s.processSection())
      .replace('<!-- @section reasons -->', s.reasonsSection())
      .replace('<!-- @section gallery -->', s.gallerySection())
      .replace('<!-- @section markets -->', s.marketsSection())
      .replace('<!-- @section about -->', s.about())
      .replace('<!-- @section quote -->', s.quote());

    // Credit exactly the pictures the page uses.
    out = out.replace('<!-- @section footer -->', s.footer(creditsFor(out)));
    return out;
    }
  },
});

export default defineConfig({
  base: './',
  plugins: [renderSections()],
  build: {
    rollupOptions: {
      input: {
        main: resolve('index.html'),
        privacy: resolve('privacy.html'),
        terms: resolve('terms.html'),
        compliance: resolve('compliance.html'),
        powerSystems: resolve('power-systems.html'),
        agro: resolve('agro.html'),
        hygiene: resolve('hygiene.html'),
        textiles: resolve('textiles.html'),
        chemicals: resolve('chemicals.html'),
      },
    },
  },
});
