// Company-level configuration. Every value marked TODO must be confirmed
// by GoodBiz Global before the site goes live.
export const site = {
  name: 'GoodBiz Global',
  tagline: 'Indian sourcing. Global opportunities.',
  description:
    'India-based merchant exporter and B2B sourcing partner for electrical equipment, agricultural commodities, soaps and cleaning products, and industrial chemicals.',
  // TODO: confirm the real enquiry mailbox. Enquiry forms open a pre-filled
  // email to this address until a form backend is connected.
  email: 'enquiries@goodbizglobal.com',
  // Set to true once the mailbox is confirmed; until then the page marks it.
  emailConfirmed: false,
  // Set to true once GoodBiz Global confirms the target-markets list.
  marketsConfirmed: false,
  // Contact number, shown in the footer, quote panel, About card and range pages.
  phone: '+91 8884799369',
  // TODO: replace with the registered office address.
  // Shown only once filled in.
  address: '',
  // TODO: confirm. Shown only once filled in.
  hours: '',
  // TODO: confirm the reply commitment. Shown only once filled in.
  replyTime: '',
  // Optional: set to an HTTPS endpoint (e.g. Formspree, a CRM webhook) to
  // POST enquiries as JSON instead of opening the visitor's email client.
  formEndpoint: '',
};

export const nav = [
  { label: 'Chemicals', href: '#chemicals' },
  { label: 'How we work', href: '#process' },
  { label: 'About', href: '#about' },
];

export const legal = [
  { label: 'Privacy notice', href: 'privacy.html' },
  { label: 'Terms of enquiry', href: 'terms.html' },
  { label: 'Export compliance', href: 'compliance.html' },
];
