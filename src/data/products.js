// Product portfolio. One record per enquirable product line.
//
// Model:
//   id        stable slug, used by the enquiry list, search and form pre-fill
//   name      display name exactly as it should appear to buyers
//   sector    one of the sector ids below
//   group     sub-grouping inside a sector (optional)
//   origin    agricultural only: the main Indian growing regions for the crop
//   use       one short line of general, well-established industrial use;
//             leave empty rather than guessing
//   note      buyer-facing caveat (regulatory or naming), optional
//   image     key in images.js when an honest photograph exists; otherwise
//             omitted and the page draws the sector's icon tile instead
//   icon      icon name for the fallback tile (see src/render/icons.js)
//   url       the product's page on its division website (full details)
//   (sectors) brand, brandShort, accent, accentSoft, site and pitch define the four
//             division brands shown on the homepage gateway and range pages
//   featured  shown as one of the six thumbnails in its category row
//
// Product names, ranges and growing regions follow the four division websites.
// Deliberately absent: prices, stock, HSN codes, CAS numbers, grades, purity,
// packaging and certifications here; the division sites and each quotation
// carry those.

export const sectors = [
  {
    id: 'electrical',
    // Division brand: how buyers choose a range from the homepage.
    brand: 'GoodBiz Power Systems',
    brandShort: 'Power Systems',
    accent: '#1957a6',
    accentSoft: '#e7eff9',
    site: 'https://goodbizelec-navy.vercel.app/',
    pitch: 'LT panels, MV switchgear and RMUs, transformers, breakers, enclosures and panel parts, matched to your grid.',
    name: 'Electrical & Power Equipment',
    short: 'Electrical',
    tagline: 'Panels, switchgear and transformers',
    anchor: '#electrical',
    page: 'power-systems.html',
    adTitle: 'Panels, switchgear and transformers for your grid',
    adText: 'Six product families, LT panels to 33 kV, sourced from Indian manufacturers and matched to the voltage, standards and paperwork of your country.',
    image: 'pwLtPcc',
    imageAlt: 'Power control centre line-up with two air circuit breaker incomers and feeder drawers',
    icon: 'bolt',
    facts: ['Matched to your grid and standards', 'HSN code on every quotation line'],
  },
  {
    id: 'agri',
    brand: 'GoodBiz Agro',
    brandShort: 'Agro',
    accent: '#2f6b1f',
    accentSoft: '#eaf4e4',
    site: 'https://goodbizagro.vercel.app/',
    pitch: 'Rice, jaggery, arecanut, groundnuts, coconut and copra, ginger and turmeric from South India’s growing belts.',
    name: 'Agricultural Commodities & Spices',
    short: 'Agricultural',
    tagline: 'Rice, jaggery, nuts and spices',
    anchor: '#agri',
    page: 'agro.html',
    adTitle: 'Rice, spices and staples from South India',
    adText: 'South Indian and non-basmati rice, jaggery, arecanut, groundnuts, coconut and copra, ginger and turmeric, with the growing region of every lot stated.',
    image: 'agTurmeric',
    imageAlt: 'Turmeric from Erode, Salem and Alleppey',
    icon: 'leaf',
    facts: ['Growing region stated for every lot', 'Shipped from Chennai, Kochi, Tuticorin and New Mangalore'],
  },
  {
    id: 'fmcg',
    brand: 'GoodBiz Hygiene',
    brandShort: 'Hygiene',
    accent: '#07707a',
    accentSoft: '#e2f4f5',
    site: 'https://soap-gules.vercel.app/',
    pitch: 'Bath soaps, laundry and kitchen care, surface cleaners and soap-making raw materials, private label welcome.',
    name: 'Soaps, Detergents & Cleaning Products',
    short: 'Hygiene',
    tagline: 'Soaps, detergents and cleaners',
    anchor: '#fmcg',
    page: 'hygiene.html',
    adTitle: 'Soaps, detergents and cleaners, under your label',
    adText: 'Twenty-three products in five ranges, from toilet soap and detergent powder to floor cleaner and soap noodles, in mixed containers and private label.',
    image: 'hyToiletBathSoap',
    imageAlt: 'Toilet and bath soap bars',
    icon: 'droplet',
    facts: ['Private label and mixed containers', 'Formulation, fragrance and pack size to your brief'],
  },
  {
    id: 'chemicals',
    brand: 'GoodBiz Chemicals',
    brandShort: 'Chemicals',
    accent: '#2c4a5a',
    accentSoft: '#e6edf1',
    site: 'https://chem-phi.vercel.app/',
    pitch: 'Solvents, amines, inorganics and surfactants for manufacturers, with an SDS on request for every product.',
    name: 'Industrial Chemicals & Solvents',
    short: 'Chemicals',
    tagline: 'Solvents, amines, inorganics, surfactants',
    anchor: '#chemicals',
    page: 'chemicals.html',
    adTitle: 'Solvents, amines, inorganics and surfactants',
    adText: 'Nineteen industrial chemicals in four groups. SDS available on request; COA and other documents agreed in the quotation.',
    image: 'drums',
    imageAlt: 'Galvanised steel chemical drums standing outdoors',
    icon: 'flask',
    facts: ['SDS available on request', 'Chemicals not listed sourced on request'],
  },
];

// Product ranges inside each division, in the order the division site shows them.
const P = (sector, group, list) =>
  list.map(([id, name, extra = {}]) => ({ id, sector, group, name, ...extra }));

const agroUrl = (slug) => `https://goodbizagro.vercel.app/products/${slug}`;
const hyUrl = (slug) => `https://soap-gules.vercel.app/products/${slug}/`;
const pwUrl = (slug) => `https://goodbizelec-navy.vercel.app/products/${slug}`;
const riceNote = 'Only where Indian export policy permits it at the time of order.';

export const products = [
  // GoodBiz Power Systems: six product families
  ...P('electrical', 'LT panels', [
    ['lt-pcc', 'Power distribution panels (PCC)', { image: 'pwLtPcc', featured: true }],
    ['lt-mcc', 'Motor control centres (MCC)', { image: 'pwLtMcc' }],
    ['lt-plc', 'PLC and automation panels', { image: 'pwLtPlc' }],
    ['lt-ats', 'ATS and changeover panels', { image: 'pwLtAts' }],
    ['lt-apfc', 'APFC and capacitor banks', { image: 'pwLtPcc' }],
    ['lt-db', 'Distribution boards', { image: 'pwLtDb' }],
  ].map((x) => [...x.slice(0, 2), { url: pwUrl('lt-panels'), ...x[2] }])),
  ...P('electrical', 'MV switchgear & RMU', [
    ['mv-ais', 'Air-insulated switchgear (AIS)', { image: 'pwMvLineup' }],
    ['mv-gis', 'Gas-insulated switchgear (GIS)', { image: 'pwMvCompartment' }],
    ['rmu', 'Ring main units (RMU)', { image: 'pwMvPedestal', featured: true }],
    ['mv-vcb', 'Vacuum circuit breakers', { image: 'pwMvModular' }],
    ['mv-lbs', 'Load break switches and isolators', { image: 'pwMvMetering' }],
  ].map((x) => [x[0], x[1], { url: pwUrl('mv-switchgear-rmu'), icon: 'rmu', ...x[2] }])),
  ...P('electrical', 'Transformers', [
    ['tr-oil-distribution', 'Oil-filled distribution transformers', { image: 'pwTrOnan', featured: true }],
    ['tr-oil-power', 'Oil-filled power transformers', { image: 'pwTrOnaf' }],
    ['tr-large-power', 'Large power transformers', { image: 'pwTrOnaf' }],
    ['tr-dry', 'Dry-type (cast resin) transformers', { image: 'pwTrDry' }],
    ['tr-converter', 'Converter and inverter duty transformers', { image: 'pwTrDry' }],
  ].map((x) => [x[0], x[1], { url: pwUrl('transformers'), ...x[2] }])),
  ...P('electrical', 'Breakers & contactors', [
    // The division site has no breaker photos; these are its panel pictures
    // that show the devices fitted (ACB incomers, MCCB and MCB rows, relays).
    ['br-acb', 'Air circuit breakers (ACB)', { image: 'pwLtPcc', featured: true }],
    ['br-mccb', 'Moulded case circuit breakers (MCCB)', { image: 'pwLtDb' }],
    ['br-mcb', 'Miniature circuit breakers (MCB)', { image: 'pwLtDb' }],
    ['br-rcd', 'Residual current devices', { image: 'pwLtDb' }],
    ['br-contactors', 'Industrial contactors', { image: 'pwLtMcc' }],
    ['br-relays', 'Relays', { image: 'pwLtPlc' }],
  ].map((x) => [x[0], x[1], { url: pwUrl('breakers-contactors'), icon: 'bolt', ...x[2] }])),
  ...P('electrical', 'Enclosures & junction boxes', [
    ['enc-modular', 'Modular panel cabinets', { image: 'pwEncModular', featured: true }],
    ['enc-wall', 'Wall-mount enclosures', { image: 'pwEncWall' }],
    ['enc-junction', 'Junction boxes', { image: 'pwEncJunction' }],
    ['enc-kiosk', 'Outdoor kiosks', { image: 'pwEncKiosk' }],
  ].map((x) => [x[0], x[1], { url: pwUrl('enclosures-junction-boxes'), ...x[2] }])),
  ...P('electrical', 'Busbars & panel parts', [
    ['pt-busbars', 'Busbars and busbar supports', { image: 'pwBusbars', featured: true }],
    ['pt-insulators', 'Insulators and shrouds', { image: 'pwInsulators' }],
    ['pt-terminals', 'Terminals and wiring accessories', { image: 'pwTerminals' }],
    ['pt-spares', 'Switchgear spares', { image: 'pwInsulators' }],
  ].map((x) => [x[0], x[1], { url: pwUrl('parts'), ...x[2] }])),

  // GoodBiz Agro: origin is the belt the division site names for each crop
  ...P('agri', 'Rice', [
    ['south-indian-rice', 'South Indian rice', { origin: 'Raichur, Mandya, Thanjavur and Palakkad mills', image: 'agSouthIndianRice', url: agroUrl('rice'), note: riceNote, featured: true }],
    ['non-basmati-rice', 'Non-basmati rice', { origin: 'Godavari delta, Nellore and Raichur mills', image: 'agNonBasmati', url: agroUrl('non-basmati-rice'), note: riceNote, featured: true }],
    ['broken-rice', 'Broken rice', { origin: 'Godavari delta, Nellore and Raichur mills', image: 'agBrokenRice', url: agroUrl('broken-rice'), note: riceNote }],
  ]),
  ...P('agri', 'Jaggery', [
    ['jaggery', 'Jaggery', { origin: 'Mandya, Belagavi and Thoothukudi', image: 'agJaggery', url: agroUrl('jaggery'), featured: true }],
  ]),
  ...P('agri', 'Nuts & plantation crops', [
    ['arecanut', 'Arecanut', { origin: 'Shivamogga, Dakshina Kannada and Kasaragod', image: 'agArecanut', url: agroUrl('arecanut'), featured: true }],
    ['groundnuts', 'Groundnuts', { origin: 'Chitradurga, Anantapur and Tiruvannamalai', image: 'agGroundnuts', url: agroUrl('groundnuts'), featured: true }],
    ['coconut-copra', 'Coconut and copra', { origin: 'Tiptur, Tumakuru and Pollachi', image: 'agCoconut', url: agroUrl('coconut-copra'), featured: true }],
  ]),
  ...P('agri', 'Spices', [
    ['ginger', 'Ginger', { origin: 'Wayanad, Kodagu and Hassan', image: 'agGinger', url: agroUrl('ginger'), featured: true }],
    ['turmeric', 'Turmeric', { origin: 'Erode, Salem and Alleppey', image: 'agTurmeric', url: agroUrl('turmeric'), featured: true }],
  ]),

  // GoodBiz Hygiene: five ranges
  ...P('fmcg', 'Bath & personal soaps', [
    ['toilet-bath-soap', 'Toilet and bath soap', { image: 'hyToiletBathSoap', featured: true }],
    ['herbal-ayurvedic-soap', 'Herbal and ayurvedic soap', { image: 'hyHerbalSoap' }],
    ['glycerin-soap', 'Glycerin and transparent soap', { image: 'hyRenderBarClear', slug: 'glycerin-transparent-soap' }],
    ['antibacterial-soap', 'Antibacterial and medicated soap', { image: 'hyAntibacterialSoap' }],
    ['hotel-guest-soap', 'Hotel and guest soap (mini bars)', { image: 'hyHotelSoap' }],
    ['liquid-hand-wash', 'Liquid hand wash', { image: 'hyHandWash', featured: true }],
    ['body-wash', 'Body wash and shower gel', { image: 'hyBodyWash', slug: 'body-wash-shower-gel' }],
  ]),
  ...P('fmcg', 'Laundry care', [
    ['laundry-soap-bar', 'Laundry soap and detergent bar', { image: 'hyLaundryBar' }],
    ['detergent-powder', 'Detergent powder', { image: 'hyDetergentPowder', featured: true }],
    ['liquid-detergent', 'Liquid detergent', { image: 'hyLiquidDetergent' }],
    ['fabric-softener', 'Fabric softener and conditioner', { image: 'hyFabricSoftener' }],
  ]),
  ...P('fmcg', 'Kitchen care', [
    ['dish-wash-liquid', 'Dish wash liquid and gel', { image: 'hyDishLiquid', featured: true }],
    ['dish-wash-bar', 'Dish wash bar', { image: 'hyDishBar' }],
  ]),
  ...P('fmcg', 'Surface & home cleaners', [
    ['floor-cleaner', 'Floor cleaner', { image: 'hyFloorCleaner', featured: true }],
    ['herbal-phenol', 'Herbal phenol and phenyl', { image: 'hyPhenol' }],
    ['glass-cleaner', 'Glass cleaner', { image: 'hyGlassCleaner' }],
    ['toilet-bowl-cleaner', 'Toilet bowl cleaner', { image: 'hyToiletBowl' }],
    ['bathroom-tile-cleaner', 'Bathroom and tile cleaner', { image: 'hyTileCleaner' }],
    ['multi-surface-cleaner', 'Multi-surface cleaner', { image: 'hyMultiSurface' }],
  ]),
  ...P('fmcg', 'Industrial & raw materials', [
    ['soap-noodles', 'Soap noodles', { image: 'hyRenderSack' }],
    ['hy-labsa', 'LABSA for detergent making', { image: 'hyRenderDrum', slug: 'labsa' }],
    ['hy-sles', 'SLES for liquid formulations', { image: 'hyRenderDrum', slug: 'sles' }],
    ['bulk-cleaning-chemicals', 'Bulk and institutional cleaning chemicals', { image: 'hyRenderCarboy', slug: 'bulk-institutional-cleaners' }],
  ]),
].map(({ slug, ...p }) => (p.sector === 'fmcg' ? { ...p, url: hyUrl(slug || p.id) } : p));

// GoodBiz Chemicals: the four groups of the division catalogue.
export const chemicalGroups = [
  { id: 'solvents', name: 'Solvents', short: 'Solvents' },
  { id: 'amines', name: 'Amines', short: 'Amines' },
  { id: 'inorganics', name: 'Inorganics', short: 'Inorganics' },
  { id: 'surfactants', name: 'Surfactants', short: 'Surfactants' },
];

const chemUrl = (slug) => `https://chem-phi.vercel.app/products/${slug}`;
const C = (group, list) =>
  list.map(([id, name, use, extra = {}]) => ({ id, group, name, use, url: chemUrl(extra.slug || id), ...extra }));

export const chemicals = [
  ...C('solvents', [
    ['ethyl-acetate', 'Ethyl acetate', 'Solvent for inks, coatings and adhesives', { icon: 'flask', featured: true }],
    ['methanol', 'Methanol', 'Industrial solvent and chemical feedstock'],
    ['ipa', 'IPA (isopropyl alcohol)', 'Solvent and cleaning agent', { slug: 'isopropyl-alcohol' }],
    ['dcm', 'DCM / methylene chloride', 'Process and extraction solvent', { slug: 'methylene-chloride' }],
    ['toluene', 'Toluene', 'Solvent for paints, thinners and coatings'],
    ['n-heptane-hexane', 'N-heptane and hexane', 'Extraction solvents'],
  ]),
  ...C('amines', [['diisopropylamine', 'Diisopropylamine (DIPA)', 'Chemical intermediate']]),
  ...C('inorganics', [
    ['titanium-dioxide', 'Titanium dioxide', 'White pigment for paints, plastics and coatings', { image: 'titaniumDioxide', featured: true }],
    ['caustic-soda', 'Caustic soda (solid)', 'Soap, detergent and process chemical', { image: 'causticSoda', featured: true, slug: 'caustic-soda-flakes' }],
    ['caustic-soda-liquid', 'Liquid caustic soda', 'Soap, detergent and process chemical', { slug: 'liquid-caustic-soda' }],
    ['copper-sulphate', 'Copper sulphate', 'Agricultural and electroplating applications', { featured: true }],
  ]),
  ...C('surfactants', [
    ['labsa', 'LABSA', 'Anionic surfactant for detergents', { image: 'hyRenderDrum', featured: true }],
    ['sles-70', 'SLES 70%', 'Surfactant for liquid detergents and personal care', { image: 'hyRenderDrum', featured: true }],
    ['sles-28', 'SLES 28%', 'Surfactant for liquid detergents and personal care', { image: 'hyRenderDrum' }],
    ['sls', 'SLS / sodium lauryl sulphate', 'Foaming surfactant', { slug: 'sodium-lauryl-sulphate' }],
    ['aos', 'Alpha olefin sulphonate (AOS)', 'Anionic surfactant', { slug: 'alpha-olefin-sulphonate' }],
    ['slsa', 'Sodium lauryl sulphoacetate', 'Mild anionic surfactant', { slug: 'sodium-lauryl-sulphoacetate' }],
    ['alcohol-ethoxylates', 'Alcohol ethoxylates', 'Non-ionic surfactants'],
    ['npe', 'Nonylphenol ethoxylates (NPE)', 'Non-ionic surfactants', {
      slug: 'nonylphenol-ethoxylates',
      note: 'Restricted in the EU and several other markets. Destination rules are confirmed before quotation.',
    }],
  ]),
// The chemicals site shows no product photos; its molecule illustration
  // stands in for every chemical without a photograph of its own.
].map(({ slug, ...c }) => ({ image: 'chMolecule', ...c }));

// Registrations each division names on its own website, with its logo.
export const registrations = [
  { id: 'fieo', name: 'FIEO', full: 'Federation of Indian Export Organisations', logo: 'images/registrations/fieo.png', w: 242, h: 240, divisions: ['agri', 'fmcg'] },
  { id: 'apeda', name: 'APEDA', full: 'Agricultural and Processed Food Products Export Development Authority', logo: 'images/registrations/apeda.png', w: 208, h: 155, divisions: ['agri'] },
  { id: 'spices-board', name: 'Spices Board India', full: 'Spices Board, Ministry of Commerce and Industry', logo: 'images/registrations/spices-board.png', w: 500, h: 150, divisions: ['agri'] },
  { id: 'fssai', name: 'FSSAI', full: 'Food Safety and Standards Authority of India', logo: 'images/registrations/fssai.png', w: 234, h: 80, divisions: ['agri'] },
  { id: 'dgft', name: 'DGFT (IEC)', full: 'Directorate General of Foreign Trade, Importer Exporter Code', logo: 'images/registrations/dgft.png', w: 553, h: 160, divisions: ['agri'] },
  { id: 'cdb', name: 'Coconut Development Board', full: 'Coconut Development Board, Government of India', logo: 'images/registrations/cdb.png', w: 103, h: 160, divisions: ['agri'] },
  { id: 'chemexcil', name: 'CHEMEXCIL', full: 'Basic Chemicals, Cosmetics & Dyes Export Promotion Council', logo: 'images/registrations/chemexcil.png', w: 353, h: 240, divisions: ['fmcg'] },
];
export const registrationsFor = (sectorId) => registrations.filter((r) => r.divisions.includes(sectorId));

// The unit an enquiry line starts with, by sector (buyers can change it).
export const defaultUnit = {
  electrical: 'Pieces / units',
  agri: 'Metric tonnes (MT)',
  fmcg: 'Litres',
  chemicals: 'Metric tonnes (MT)',
};

// Quick searches shown under the hero search field.
export const quickSearches = ['SLES 70%', 'Turmeric', 'Transformers', 'Caustic soda', 'Detergent powder'];

// Where a product lives: its own entry on its sector's page.
export const productHref = (p) => {
  const sector = sectors.find((s) => s.id === (chemicals.includes(p) ? 'chemicals' : p.sector));
  return `${sector.page}#${p.id}`;
};

export const findProduct = (id) =>
  products.find((p) => p.id === id) || chemicals.find((c) => c.id === id);

export const sectorOf = (item) => (item.group && chemicals.includes(item) ? 'chemicals' : item.sector);
