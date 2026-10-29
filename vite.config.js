import { defineConfig } from 'vite';
import { basename, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// Load a render or data module. In dev, Vite's SSR loader tracks every file in
// the import graph and reloads it when it changes; a plain Node import would
// cache nested modules (e.g. pages.js -> sections.js) and serve stale code.
// A production build runs once, so a plain import is enough there.
const loaderFor = (ctx) => (file) =>
  ctx.server ? ctx.server.ssrLoadModule(`/${file}`) : import(pathToFileURL(resolve(file)).href);

// Renders the product data into index.html at build (and dev) time.
// Placeholders look like <!-- @section name -->.
const renderSections = () => ({
  name: 'goodbiz-render-sections',
  async transformIndexHtml(htmlSource, ctx) {
    const load = loaderFor(ctx);
    const s = await load('src/render/sections.js');
    const pages = await load('src/render/pages.js');
    const { sectors } = await load('src/data/products.js');
    const seo = await load('src/render/seo.js');
    // Head metadata for every page: '' is the homepage, otherwise the file name.
    const file = basename(ctx.filename);
    const withHead = (out) => seo.applyHead(out, file === 'index.html' ? '' : file);

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
    return devToggle(withHead(withFixture(fixtureName, () => render())));

    function render() {
    // Range pages: same header and footer, with in-page links pointing home.
    const sectorMatch = htmlSource.match(/<!-- @sector-page ([a-z]+) -->/);
    if (sectorMatch) {
      const sector = sectors.find((x) => x.id === sectorMatch[1]);
      const rebase = (h) => h.replaceAll('href="#', 'href="index.html#').replace('href="index.html#main"', 'href="#main"');
      let out = htmlSource
        .replace('<!-- @section header -->', rebase(s.header()))
        .replace(sectorMatch[0], pages.sectorPage(sector));
      return out.replace('<!-- @section footer -->', rebase(s.footer()));
    }
    if (!ctx.filename.endsWith('index.html')) return htmlSource;

    let out = htmlSource
      .replace('<!-- @section header -->', s.header())
      .replace('<!-- @section hero -->', s.hero())
      .replace('<!-- @section gateway -->', pages.brandGateway())
      .replace('<!-- @section ads -->', pages.adBanners())
      .replace('<!-- @section categories -->', s.categories())
      .replace('<!-- @section registrations -->', pages.registrationsSection())
      .replace('<!-- @section facts -->', s.factsBand())
      .replace('<!-- @section chemicals -->', s.chemicalsSection())
      .replace('<!-- @section process -->', s.processSection())
      .replace('<!-- @section reasons -->', s.reasonsSection())
      .replace('<!-- @section faq -->', pages.faqSection())
      .replace('<!-- @section markets -->', s.marketsSection())
      .replace('<!-- @section about -->', s.about())
      .replace('<!-- @section quote -->', s.quote());

    out = out.replace('<!-- @section footer -->', s.footer());
    return out;
    }
  },
  // robots.txt and sitemap.xml, built from the same page list as the head tags.
  async generateBundle() {
    const seo = await import(pathToFileURL(resolve('src/render/seo.js')).href);
    this.emitFile({ type: 'asset', fileName: 'robots.txt', source: seo.robotsTxt() });
    this.emitFile({ type: 'asset', fileName: 'llms.txt', source: seo.llmsTxt() });
    this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: seo.sitemapXml(new Date().toISOString().slice(0, 10)) });
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
        chemicals: resolve('chemicals.html'),
      },
    },
  },
});
