// Picture registry. Every picture on the site is a found, openly licensed
// photograph of the trade's world (not GoodBiz Global's own goods). Each key
// maps to its optimised WebP pair and to its entry in
// source-images/credits.json, from which the on-page credits are built.
// Replace with the company's own product photography when it exists.
const entry = (name, w, h, sourceFile) => ({
  src: `images/${name}.webp`,
  small: `images/${name}-800.webp`,
  w,
  h,
  source: sourceFile,
});
const pub = (f) => `public/images/${f}`;
const src = (f) => `source-images/${f}`;

export const images = {
  byadgi: entry('byadgi-chilli', 1600, 1200, pub('byadgi-chilli.jpg')),
  chilliDrying: entry('chilli-drying', 1600, 1199, pub('chilli-drying.jpg')),
  turmeric: entry('turmeric', 1600, 1200, pub('turmeric.jpg')),
  jaggery: entry('jaggery', 1600, 1064, pub('jaggery.jpg')),
  gingerGarlic: entry('ginger-garlic', 1600, 1200, pub('ginger-garlic.jpg')),
  garlic: entry('garlic', 1200, 800, src('garlic.jpg')),
  rice: entry('rice', 1200, 804, src('rice.jpg')),
  switchgear: entry('switchgear', 683, 1024, pub('switchgear.webp')),
  controlPanel: entry('control-panel', 1200, 1191, src('control-panel.jpg')),
  transformer: entry('transformer', 1600, 1066, pub('transformer.jpg')),
  drums: entry('drums', 1600, 1200, pub('drums.jpg')),
  causticSoda: entry('caustic-soda', 1200, 954, src('caustic-soda.jpg')),
  titaniumDioxide: entry('titanium-dioxide', 1200, 798, src('titanium-dioxide.jpg')),
  copperSulphate: entry('copper-sulphate', 1200, 894, src('copper-sulphate.jpg')),
  loom: entry('loom', 1600, 1195, pub('loom.jpg')),
  fabricRolls: entry('fabric-rolls', 1600, 1068, pub('fabric-rolls.jpg')),
  mill1941: entry('bombay-mill-1941', 1600, 1101, pub('bombay-mill-1941.jpg')),
  soap: entry('soap', 1131, 1542, pub('soap.jpg')),
  liquidSoap: entry('liquid-soap', 1200, 2024, src('liquid-soap.jpg')),
  laundryPowder: entry('laundry-powder', 1200, 801, src('laundry-powder.jpg')),
  jnpt: entry('jnpt', 1600, 900, pub('jnpt.jpg')),
  madras1996: entry('madras-port-1996', 1600, 1045, pub('madras-port-1996.jpg')),
};
