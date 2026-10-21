# GoodBiz Global website

Marketing site for GoodBiz Global, an India-based merchant exporter and B2B sourcing partner.
Five division brands: GoodBiz Power Systems, Agro, Hygiene, Textiles and Chemicals.

## Run

```bash
npm install
npm run dev        # http://localhost:5173 (dev-only test-data switch: ?data=worst|empty|one|huge)
npm run build      # static site in dist/
npm run preview    # serve dist/ at http://localhost:4173
npm run check      # validate product data (no prices, CAS, HSN, grades in data)
```

## Where things live

- `src/data/` product, chemical and division data (`products.js`), site contact details (`site.js`), images (`images.js`)
- `src/render/` HTML templates rendered at build time by the Vite plugin in `vite.config.js`
- `src/styles/` design tokens, components, sections, pages and the motion system (`motion.css`)
- `src/js/` search, enquiry list, chemical catalogue, forms and UI behaviour
- `index.html` homepage; `power-systems.html`, `agro.html`, `hygiene.html`, `textiles.html`, `chemicals.html` division pages
- `PRODUCT.md`, `DESIGN.md` product and design-system records; `scripts/qa/` browser QA probes

## Before launch

- Confirm the enquiry email in `src/data/site.js` and set `emailConfirmed: true`.
- Add the registered address, business hours and reply time in `src/data/site.js`.
- Set `formEndpoint` in `src/data/site.js` to send enquiries to a form service or CRM (until then forms open a pre-filled email).
- Confirm the target-markets list and the chemical names flagged `review: true` in `src/data/products.js`.
- Photographs are openly licensed pictures credited in the footer (`source-images/credits.json`); replace them with your own product photography when available.
