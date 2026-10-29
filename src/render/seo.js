// Search and sharing metadata, written into each page's <head> at build time:
// title, description, canonical URL, Open Graph / Twitter card, and JSON-LD.
// Also builds robots.txt and sitemap.xml from the same page list.
import { esc } from './util.js';
import { site } from '../data/site.js';
import { sectors, products, chemicals } from '../data/products.js';
import { images } from '../data/images.js';

const abs = (path = '') => `${site.url}/${path}`;
const bySector = (id) => (id === 'chemicals' ? chemicals : products.filter((p) => p.sector === id));
// JSON-LD inside <script>: never let a value close the tag.
const jsonLd = (data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

const orgId = abs('#organization');
const organization = () => ({
  '@type': 'Organization',
  '@id': orgId,
  name: site.name,
  url: abs(),
  description: site.description,
  slogan: site.tagline,
  ...(site.phone ? { telephone: site.phone } : {}),
  address: { '@type': 'PostalAddress', addressCountry: 'IN', ...(site.address ? { streetAddress: site.address } : {}) },
  areaServed: 'Worldwide',
  knowsAbout: ['Merchant export from India', 'Electrical equipment', 'Agricultural commodities', 'Soaps and detergents', 'Industrial chemicals'],
  // The four division websites are this organisation's own sites.
  sameAs: sectors.map((s) => s.site),
  ...(site.phone ? { contactPoint: { '@type': 'ContactPoint', telephone: site.phone, contactType: 'sales', availableLanguage: 'English' } } : {}),
  department: sectors.map((s) => ({ '@type': 'Organization', '@id': `${s.site}#organization`, name: s.brand, url: s.site, description: s.pitch, subjectOf: { '@type': 'WebPage', url: abs(s.page) } })),
});

// Short, factual answers to the questions buyers and answer engines ask.
// Shown on the homepage and repeated in llms.txt. Facts only from this site
// and the division websites; nothing invented.
export const faqs = () => [
  {
    q: 'What does GoodBiz Global export from India?',
    a: `Four product divisions: ${sectors.map((s) => `${s.brand} (${s.tagline.toLowerCase()})`).join(', ')}. In all, ${products.length + chemicals.length} products are open for enquiry.`,
  },
  {
    q: 'Is GoodBiz Global a manufacturer?',
    a: 'No. GoodBiz Global is a merchant exporter and sourcing partner. It finds the Indian manufacturer, grower or processor that fits your specification, agrees the quotation and coordinates the shipment.',
  },
  {
    q: 'How do I get a price?',
    a: 'Send one enquiry with the products, quantity, destination country and port. Prices are not published because they depend on grade, volume, packing and destination; you receive a written quotation.',
  },
  {
    q: 'Which documents come with an order?',
    a: 'Export documents for your destination are prepared with the shipment. For chemicals an SDS is available on request, and a COA where the producer issues one for your lot.',
  },
  {
    q: 'Which countries do you ship to?',
    a: 'Enquiries from any country are welcome. Destination rules, such as restricted substances and food-safety requirements, are checked for your country before a quotation is issued.',
  },
  {
    q: 'Where can I see each division in detail?',
    a: `Each division has its own website: ${sectors.map((s) => `${s.brand} at ${new URL(s.site).hostname.replace(/^www\./, '')}`).join(', ')}.`,
  },
];

// Indexable pages, in sitemap order.
export const pages = () => [
  { path: '', title: site.seoTitle, description: site.seoDescription, image: site.seoImage, imageAlt: 'Container ship alongside cranes at a port' },
  ...sectors.map((s) => ({ path: s.page, title: s.seoTitle, description: s.seoDescription, image: s.image, imageAlt: s.imageAlt, sector: s })),
];

const socialTags = (page) => {
  const img = images[page.image];
  return [
    `<meta property="og:site_name" content="${esc(site.name)}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:locale" content="en_IN">`,
    `<meta property="og:title" content="${esc(page.title)}">`,
    `<meta property="og:description" content="${esc(page.description)}">`,
    `<meta property="og:url" content="${abs(page.path)}">`,
    ...(img
      ? [
          `<meta property="og:image" content="${abs(img.src)}">`,
          `<meta property="og:image:width" content="${img.w}">`,
          `<meta property="og:image:height" content="${img.h}">`,
          `<meta property="og:image:alt" content="${esc(page.imageAlt)}">`,
          `<meta name="twitter:image" content="${abs(img.src)}">`,
        ]
      : []),
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(page.title)}">`,
    `<meta name="twitter:description" content="${esc(page.description)}">`,
  ];
};

const structuredData = (page) => {
  if (!page.sector) {
    return jsonLd({
      '@context': 'https://schema.org',
      '@graph': [
        organization(),
        { '@type': 'WebSite', '@id': abs('#website'), url: abs(), name: site.name, inLanguage: 'en', publisher: { '@id': orgId } },
      ],
    });
  }
  const s = page.sector;
  const url = abs(s.page);
  return jsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#page`,
        url,
        name: page.title,
        description: page.description,
        inLanguage: 'en',
        isPartOf: { '@type': 'WebSite', '@id': abs('#website'), url: abs(), name: site.name },
        about: { '@type': 'Organization', '@id': `${s.site}#organization`, name: s.brand, url: s.site, sameAs: [s.site], parentOrganization: { '@id': orgId, name: site.name, url: abs() } },
        breadcrumb: { '@id': `${url}#breadcrumb` },
        mainEntity: {
          '@type': 'ItemList',
          name: `${s.brand} products`,
          numberOfItems: bySector(s.id).length,
          itemListElement: bySector(s.id).map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: p.name,
            url: `${url}#${p.id}`,
            ...(p.url ? { item: { '@type': 'Thing', name: p.name, url: p.url } } : {}),
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: abs() },
          { '@type': 'ListItem', position: 2, name: s.brand, item: url },
        ],
      },
    ],
  });
};

// The two faces the first screen paints with, fetched before the CSS asks.
const fontPreloads = ['switzer-400', 'cabinet-grotesk-800'].map(
  (f) => `<link rel="preload" href="/fonts/${f}.woff2" as="font" type="font/woff2" crossorigin>`,
);

// Rewrites a page's <head>. `path` is '' for the homepage, a file name otherwise.
export const applyHead = (htmlSource, path) => {
  const page = pages().find((p) => p.path === path);
  let out = htmlSource;
  if (page) {
    out = out
      .replace(/<title>[^<]*<\/title>/, `<title>${esc(page.title)}</title>`)
      .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(page.description)}">`);
  }
  const tags = [
    `<link rel="canonical" href="${abs(path)}">`,
    ...fontPreloads,
    ...(page ? [...socialTags(page), structuredData(page)] : []),
  ];
  return out.replace('</head>', `  ${tags.join('\n  ')}\n</head>`);
};

// Search and AI answer engines are all welcome; named so the policy is explicit.
const aiCrawlers = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended', 'Bingbot'];
export const robotsTxt = () =>
  `User-agent: *\nAllow: /\n\n${aiCrawlers.map((b) => `User-agent: ${b}\nAllow: /`).join('\n\n')}\n\nSitemap: ${abs('sitemap.xml')}\n`;

// llms.txt: a plain summary for AI assistants, built from the same data as the pages.
export const llmsTxt = () => {
  const line = (s) => {
    const items = bySector(s.id);
    return `## ${s.brand}\n\n${s.pitch}\n\n- Website: ${s.site}\n- Page on this site: ${abs(s.page)}\n- Products (${items.length}): ${items.map((p) => p.name).join('; ')}\n`;
  };
  return `# ${site.name}\n\n> ${site.seoDescription}\n\n${site.name} is an India-based merchant exporter and B2B sourcing partner. It does not manufacture; it matches each enquiry to Indian manufacturers, growers and processors, agrees the specification, quotes in writing and coordinates shipment. No prices are published: every quotation depends on grade, volume, packing and destination.\n\n- Website: ${abs()}\n${site.phone ? `- Phone: ${site.phone}\n` : ''}- Request a quotation: ${abs('#quote')}\n\n${sectors.map(line).join('\n')}\n## Questions buyers ask\n\n${faqs().map((f) => `### ${f.q}\n\n${f.a}\n`).join('\n')}`;
};

export const sitemapXml = (lastmod) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages()
    .map((p) => `  <url><loc>${abs(p.path)}</loc><lastmod>${lastmod}</lastmod></url>`)
    .join('\n')}\n</urlset>\n`;
