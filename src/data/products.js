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
//   (sectors) brand, brandShort, accent, accentSoft and pitch define the five
//             division brands shown on the homepage gateway and range pages
//   featured  shown as one of the six thumbnails in its category row
//   review    internal flag: the name must be checked against the supplier's
//             official list before publishing (never rendered)
//
// Deliberately absent: prices, stock, HSN codes, CAS numbers, grades, purity,
// packaging and certifications. These are confirmed per quotation only.

export const sectors = [
  {
    id: 'electrical',
    // Division brand: how buyers choose a range from the homepage.
    brand: 'GoodBiz Power Systems',
    brandShort: 'Power Systems',
    accent: '#1957a6',
    accentSoft: '#e7eff9',
    pitch: "Transformers, RMUs, panels and protection for utilities, EPC contractors and industry.",
    name: 'Electrical & Industrial Solutions',
    short: 'Electrical',
    tagline: 'Transformers, switchgear and control',
    anchor: '#electrical',
    page: 'power-systems.html',
    adTitle: 'Power and control, built to your standard',
    adText: "Transformers, ring main units, panels and protection equipment from Indian manufacturers, quoted to IEC, IS or your own specification.",
    image: 'switchgear',
    imageAlt: 'Rows of circuit breakers inside an electrical distribution panel',
    icon: 'bolt',
    facts: ['Built to IEC, IS or your own standard', 'Rating and tests confirmed before quotation'],
  },
  {
    id: 'agri',
    // Division brand: how buyers choose a range from the homepage.
    brand: 'GoodBiz Agro',
    brandShort: 'Agro',
    accent: '#2f6b1f',
    accentSoft: '#eaf4e4',
    pitch: "Byadgi chilli, turmeric, jaggery, fresh produce and grains, with the origin of every lot stated.",
    name: 'Agricultural Commodities & Food Products',
    short: 'Agricultural',
    tagline: 'Spices, jaggery, fresh produce, grains',
    anchor: '#agri',
    page: 'agro.html',
    adTitle: 'Byadgi chilli, turmeric, jaggery and more',
    adText: "Spices, staples and fresh produce from India's growing regions, with the origin of every lot stated on the quotation.",
    image: 'chilliDrying',
    imageAlt: 'Red chillies spread to dry across a field, seen from above',
    icon: 'leaf',
    facts: ['Origin of each lot stated on the quotation', 'Food-safety rules checked for your country'],
  },
  {
    id: 'fmcg',
    // Division brand: how buyers choose a range from the homepage.
    brand: 'GoodBiz Hygiene',
    brandShort: 'Hygiene',
    accent: '#07707a',
    accentSoft: '#e2f4f5',
    pitch: "Dishwashing liquid, floor and bathroom cleaners, detergents, handwash and soaps for wholesale.",
    name: 'FMCG & Household Cleaning Products',
    short: 'Cleaning & FMCG',
    tagline: 'Home care and personal care',
    anchor: '#fmcg',
    page: 'hygiene.html',
    adTitle: 'Cleaning and personal care, made to your brief',
    adText: "Dishwashing liquid, floor and bathroom cleaners, detergents and soaps for wholesalers, distributors and institutional buyers.",
    image: 'liquidSoap',
    imageAlt: 'Blue liquid soap in a clear plastic bottle',
    icon: 'droplet',
    facts: ['Formulation, fragrance and pack size to your brief', 'Label requirements agreed before quotation'],
  },
  {
    id: 'textiles',
    // Division brand: how buyers choose a range from the homepage.
    brand: 'GoodBiz Textiles',
    brandShort: 'Textiles',
    accent: '#94461b',
    accentSoft: '#f6ebe3',
    pitch: "Woven and knitted cloth and textile materials from Indian mills, matched to your specification.",
    name: 'Textiles & Fabrics',
    short: 'Textiles',
    tagline: 'Woven and knitted cloth from Indian mills',
    anchor: '#textiles',
    page: 'textiles.html',
    adTitle: 'Cloth from Indian mills, matched to your spec',
    adText: "Send the fibre, weight, width and finish; we approach the Indian mills able to make it.",
    image: 'mill1941',
    imageAlt: 'Two women carrying cones of yarn in a Bombay textile mill, early 1940s',
    icon: 'fabric',
    facts: ['Matched to fibre, GSM, width and finish', 'Lab dips or swatches on request'],
  },
  {
    id: 'chemicals',
    // Division brand: how buyers choose a range from the homepage.
    brand: 'GoodBiz Chemicals',
    brandShort: 'Chemicals',
    accent: '#2c4a5a',
    accentSoft: '#e6edf1',
    pitch: "Organic solvents, industrial and inorganic chemicals, and surfactants for bulk export.",
    name: 'Chemicals & Industrial Solvents',
    short: 'Chemicals',
    tagline: 'Solvents, industrial chemicals, surfactants',
    anchor: '#chemicals',
    page: 'chemicals.html',
    adTitle: 'Solvents, inorganics and surfactants in bulk',
    adText: "Twenty bulk chemicals, with SDS, TDS and COA shared where the producer issues them for your lot.",
    image: 'drums',
    imageAlt: 'Galvanised steel chemical drums standing outdoors',
    icon: 'flask',
    facts: ['SDS, TDS and COA where the producer issues them', 'Destination restrictions checked first'],
  },
];

export const products = [
  // Electrical & Industrial Solutions
  { id: 'power-transformers', sector: 'electrical', name: 'Power transformers', icon: 'transformer', featured: true },
  { id: 'oil-immersed-transformers', sector: 'electrical', name: 'Oil-immersed transformers', image: 'transformer', featured: true },
  { id: 'rmu', sector: 'electrical', name: 'Ring Main Units (RMUs)', icon: 'rmu', featured: true },
  { id: 'enclosures', sector: 'electrical', name: 'Electrical enclosures and fabricated electrical boxes', icon: 'enclosure' },
  { id: 'control-panels', sector: 'electrical', name: 'Electrical control panels and switchboards', image: 'controlPanel', featured: true },
  { id: 'automation', sector: 'electrical', name: 'Electrical automation and instrumentation equipment', icon: 'gauge' },
  { id: 'fire-gas', sector: 'electrical', name: 'Fire and gas detection and related industrial systems', icon: 'flame', featured: true },
  { id: 'distribution-protection', sector: 'electrical', name: 'Electrical distribution and protection equipment', image: 'switchgear', featured: true },

  // Agricultural Commodities & Food Products
  { id: 'byadgi-chilli', sector: 'agri', group: 'Spices', name: 'Byadgi red chilli', origin: 'Byadgi, Haveri district, Karnataka', image: 'byadgi', featured: true },
  { id: 'red-chilli-other', sector: 'agri', group: 'Spices', name: 'Red chilli, other varieties', origin: 'Karnataka and Tamil Nadu', image: 'chilliDrying' },
  { id: 'turmeric', sector: 'agri', group: 'Spices', name: 'Turmeric', origin: 'Telangana, Maharashtra, Tamil Nadu', image: 'turmeric', featured: true },
  { id: 'ginger', sector: 'agri', group: 'Spices', name: 'Ginger', origin: 'Karnataka, Kerala, North-East India', image: 'gingerGarlic', featured: true },
  { id: 'jaggery', sector: 'agri', group: 'Staples', name: 'Jaggery', origin: 'Uttar Pradesh, Maharashtra, Karnataka', image: 'jaggery', featured: true },
  { id: 'garlic', sector: 'agri', group: 'Fresh produce', name: 'Garlic', origin: 'Madhya Pradesh, Rajasthan, Gujarat', image: 'garlic', featured: true },
  { id: 'lemons', sector: 'agri', group: 'Fresh produce', name: 'Lemons', origin: 'Andhra Pradesh, Gujarat, Maharashtra', icon: 'leaf' },
  {
    id: 'rice', sector: 'agri', group: 'Grains', name: 'Rice and broken rice', origin: 'Several states', image: 'rice', featured: true,
    note: 'Only where Indian export policy permits it at the time of order.',
  },
  { id: 'cereals', sector: 'agri', group: 'Grains', name: 'Selected cereals and agricultural commodities', origin: 'Confirmed per lot', icon: 'grain' },

  // FMCG & Household Cleaning Products
  { id: 'dishwash', sector: 'fmcg', group: 'Home care', name: 'Dishwashing liquid', icon: 'droplet', featured: true },
  { id: 'floor-cleaner', sector: 'fmcg', group: 'Home care', name: 'Floor cleaner', icon: 'droplet', featured: true },
  { id: 'bathroom-cleaner', sector: 'fmcg', group: 'Home care', name: 'Bathroom cleaner', icon: 'droplet' },
  { id: 'tile-cleaner', sector: 'fmcg', group: 'Home care', name: 'Tile cleaner', icon: 'droplet' },
  { id: 'phenyl', sector: 'fmcg', group: 'Home care', name: 'Phenyl and other floor-cleaning formulations', icon: 'droplet', featured: true },
  { id: 'laundry', sector: 'fmcg', group: 'Home care', name: 'Laundry detergents', image: 'laundryPowder', featured: true },
  { id: 'handwash', sector: 'fmcg', group: 'Personal care', name: 'Handwash', image: 'liquidSoap', featured: true },
  { id: 'bath-soap', sector: 'fmcg', group: 'Personal care', name: 'Bath soaps', image: 'soap', featured: true },
  { id: 'body-wash', sector: 'fmcg', group: 'Personal care', name: 'Body wash', icon: 'droplet' },
  { id: 'other-formulations', sector: 'fmcg', group: 'Personal care', name: 'Other cleaning and personal-care formulations', icon: 'droplet' },

  // Textiles & Fabrics
  { id: 'cloth-fabrics', sector: 'textiles', name: 'Cloth and fabrics', image: 'fabricRolls', featured: true },
  { id: 'textile-materials', sector: 'textiles', name: 'Textile materials from Indian manufacturers', image: 'loom', featured: true },
];

// Chemicals & Industrial Solvents. Three technical groups; never describe
// the whole range as "organic chemicals".
export const chemicalGroups = [
  { id: 'solvents', name: 'Organic solvents & specialty chemicals', short: 'Solvents & specialty' },
  { id: 'inorganic', name: 'Industrial & inorganic chemicals', short: 'Industrial & inorganic' },
  { id: 'surfactants', name: 'Surfactants & detergent raw materials', short: 'Surfactants' },
];

export const chemicals = [
  { id: 'ethyl-acetate', group: 'solvents', name: 'Ethyl acetate', use: 'Solvent for inks, coatings and adhesives', icon: 'flask', featured: true },
  { id: 'methanol', group: 'solvents', name: 'Methanol', use: 'Industrial solvent and chemical feedstock' },
  { id: 'ipa', group: 'solvents', name: 'IPA (isopropyl alcohol)', use: 'Solvent and cleaning agent' },
  { id: 'dcm', group: 'solvents', name: 'DCM / methylene chloride', use: 'Process and extraction solvent' },
  { id: 'toluene', group: 'solvents', name: 'Toluene', use: 'Solvent for paints, thinners and coatings' },
  { id: 'n-heptane', group: 'solvents', name: 'N-heptane', use: '' },
  { id: 'hexane', group: 'solvents', name: 'Hexane', use: 'Extraction solvent' },
  { id: 'diisopropylamine', group: 'solvents', name: 'Diisopropylamine', use: 'Chemical intermediate', review: true },

  { id: 'titanium-dioxide', group: 'inorganic', name: 'Titanium dioxide', use: 'White pigment for paints, plastics and coatings', image: 'titaniumDioxide', featured: true },
  { id: 'caustic-soda', group: 'inorganic', name: 'Caustic soda', use: 'Soap, detergent and process chemical', image: 'causticSoda', featured: true },
  { id: 'caustic-soda-liquid', group: 'inorganic', name: 'Liquid caustic soda', use: 'Soap, detergent and process chemical' },
  { id: 'copper-sulphate', group: 'inorganic', name: 'Copper sulphate', use: 'Agricultural and electroplating applications', image: 'copperSulphate', featured: true },

  { id: 'labsa', group: 'surfactants', name: 'LABSA', use: 'Anionic surfactant for detergents', icon: 'flask', featured: true },
  { id: 'sles-70', group: 'surfactants', name: 'SLES 70%', use: 'Surfactant for liquid detergents and personal care', icon: 'flask', featured: true },
  { id: 'sles-28', group: 'surfactants', name: 'SLES 28%', use: 'Surfactant for liquid detergents and personal care' },
  { id: 'sls', group: 'surfactants', name: 'SLS / sodium lauryl sulphate', use: 'Foaming surfactant' },
  { id: 'aos', group: 'surfactants', name: 'Alpha olefin sulphonate (AOS)', use: 'Anionic surfactant', review: true },
  { id: 'slsa', group: 'surfactants', name: 'Sodium lauryl sulphoacetate', use: '', review: true },
  { id: 'alcohol-ethoxylates', group: 'surfactants', name: 'Alcohol ethoxylates', use: 'Non-ionic surfactants', review: true },
  {
    id: 'npe', group: 'surfactants', name: 'Nonylphenol ethoxylates (NPE)', use: 'Non-ionic surfactants', review: true,
    note: 'Restricted in the EU and several other markets. Exact designation and destination rules are confirmed before quotation.',
  },
];

// The unit an enquiry line starts with, by sector (buyers can change it).
export const defaultUnit = {
  electrical: 'Pieces / units',
  agri: 'Metric tonnes (MT)',
  fmcg: 'Litres',
  textiles: 'Metres',
  chemicals: 'Metric tonnes (MT)',
};

// Quick searches shown under the hero search field.
export const quickSearches = ['SLES 70%', 'Byadgi chilli', 'Transformers', 'Caustic soda', 'Dishwashing liquid'];

// Where a product lives: its own entry on its sector's page.
export const productHref = (p) => {
  const sector = sectors.find((s) => s.id === (chemicals.includes(p) ? 'chemicals' : p.sector));
  return `${sector.page}#${p.id}`;
};

export const findProduct = (id) =>
  products.find((p) => p.id === id) || chemicals.find((c) => c.id === id);

export const sectorOf = (item) => (item.group && chemicals.includes(item) ? 'chemicals' : item.sector);
