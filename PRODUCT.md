# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Overseas importers, distributors, wholesalers and industrial procurement teams buying from India in bulk:
electrical and industrial equipment buyers, agricultural commodity traders, FMCG and cleaning-products
wholesalers and chemical importers. They arrive with a product in mind (often a
specific chemical, crop or equipment type), want to confirm GoodBiz can source it, and send a
specific enquiry with quantity, destination and specification.

## Product Purpose

GoodBiz Global is an India-based merchant exporter and international B2B sourcing partner. It connects
overseas buyers with Indian manufacturers, growers and industrial suppliers. The website's job is to let
a buyer understand the portfolio quickly and submit a qualified enquiry or pricing request. Success is a
complete enquiry: product, quantity, unit, destination country and contact details.

## Positioning

One sourcing desk across five unrelated sectors, working specification-first: grade, packaging,
documents and destination rules are agreed before a quotation. GoodBiz does not manufacture; it
matches, quotes and coordinates shipment.

## Operating Context

- Five sectors: Electrical & Industrial Solutions; Agricultural Commodities & Food Products; FMCG &
  Household Cleaning Products; Chemicals & Industrial Solvents (this replaces the
  former "Other Commodities & Industrial Raw Materials" category).
- Buyers compare against other sourcing agents and marketplaces; they scan, search by product name and
  want a direct route to a quotation.
- Enquiries are delivered by email (pre-filled mailto) until a form endpoint or CRM is configured in
  `src/data/site.js`.

## Capabilities and Constraints

- Static site built with Vite; product data in `src/data/`, rendered into HTML at build time.
- Enquiry list (add products from any sector, carried into the quote form), chemical catalogue with
  search, group filters and per-product pricing requests, optional SDS/TDS/COA request.
- Products are offered subject to confirmed supplier availability, agreed specification and
  destination-country compliance. Rice and broken rice only where Indian export policy permits.
- Never publish prices, stock, HSN codes, CAS numbers, grades, purity, packaging, certifications or
  suppliers unless confirmed by the supplier. Unverified technical fields are absent or explicitly
  marked for supplier confirmation.
- Chemical names to verify against the supplier's official list: Diisopropylamine, AOS, sodium lauryl
  sulphoacetate, alcohol ethoxylates, and the exact nonylphenol ethoxylate designation.

## Brand Commitments

- Name: GoodBiz Global. Tagline: "Indian Sourcing. Global Opportunities."
- Visual reference made binding by the user (2026-10-15): the homepage should follow the layout and
  bright look of ofbusiness.com (search-led hero, category rows with sub-product thumbnails, stats strip,
  tabbed process panel, gallery, large link-column footer), recoloured toward GoodBiz navy and teal.
  No copying of OfBusiness's logo, wording, photographs or brand assets.
- Reference slots for live prices and big numbers are filled with honest substitutes: products open for
  enquiry (no prices) and verifiable portfolio facts (sector, product-line and chemical counts).

## Evidence on Hand

- No company photography, logos, certifications, customers, testimonials, order volumes or prices.
  These must not be fabricated.
- Openly licensed photographs of the trade's world, credited on the page: `source-images/credits.json`.
- Contact details are placeholders until confirmed: email, phone, registered address.
- Target markets list is a placeholder to confirm.

## Product Principles

1. Find the product fast: search and category browsing come before persuasion.
2. Every product has a route to a specific enquiry within one click.
3. Specification before price; never imply data that has not been confirmed.
4. Serious industrial credibility, especially in the chemical catalogue.

## Accessibility & Inclusion

WCAG 2.1 AA: keyboard operable, visible focus, 4.5:1 text contrast, 44px touch targets, reduced-motion
support. International audience reading in a second language: plain, short wording.
