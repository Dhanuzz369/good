# GoodBiz Global website

Marketing site for GoodBiz Global, an India-based merchant exporter and B2B sourcing partner.
Four division brands: GoodBiz Power Systems, Agro, Hygiene and Chemicals. Products, ranges and registrations follow each division's own website (linked from every product).

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
- `index.html` homepage; `power-systems.html`, `agro.html`, `hygiene.html`, `chemicals.html` division pages
- `PRODUCT.md`, `DESIGN.md` product and design-system records; `scripts/qa/` browser QA probes

## Before launch

- Confirm the enquiry email in `src/data/site.js` and set `emailConfirmed: true`.
- Add the registered address, business hours and reply time in `src/data/site.js`.
- Set `formEndpoint` in `src/data/site.js` to send enquiries to a form service or CRM (until then forms open a pre-filled email).
- Confirm the target-markets list and the chemical names flagged `review: true` in `src/data/products.js`.
- Product pictures come from the four division websites (goodbizpower.com, goodbizagro.com, goodbizhygiene.com, goodbizchemicals.com). The few other photographs on the page are CC0 or public domain, so no on-page credit is needed (sources in `source-images/credits.json`). Before adding a photo whose licence requires attribution (CC BY, CC BY-SA), add a credit back to the footer.
