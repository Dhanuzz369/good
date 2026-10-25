// One icon family: 24px grid, 1.75 stroke, round joins. Used for controls and
// for product tiles where no honest photograph exists.
const paths = {
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  external: '<path d="M14 5h5v5M19 5l-8 8M17 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h4"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  chevronRight: '<path d="m9 6 6 6-6 6"/>',
  chevronLeft: '<path d="m15 6-6 6 6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4 7 8 6 8-6"/>',
  phone: '<path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2Z"/>',
  pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/>',
  doc: '<path d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-10A.5.5 0 0 1 7 20Z"/><path d="M14 3.5V8h4M9.5 12.5h5M9.5 16h5"/>',
  list: '<path d="M9 6.5h11M9 12h11M9 17.5h11"/><circle cx="4.75" cy="6.5" r="1"/><circle cx="4.75" cy="12" r="1"/><circle cx="4.75" cy="17.5" r="1"/>',
  ship: '<path d="M3.5 15.5h17l-2.5 4h-12Z"/><path d="M6 15.5V10h12v5.5M9 10V6.5h6V10M12 6.5V4"/>',
  globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.4 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.4-3.5-8.5s1-5.9 3.5-8.5Z"/>',
  shield: '<path d="M12 3.5 19 6v5.5c0 4.4-3 7.7-7 9-4-1.3-7-4.6-7-9V6Z"/><path d="m8.8 12 2.2 2.2 4.2-4.4"/>',
  match: '<circle cx="7.5" cy="12" r="3.5"/><circle cx="16.5" cy="12" r="3.5"/><path d="M11 12h2"/>',
  bolt: '<path d="M13 3.5 5.5 13.5h6l-1 7 7.5-10h-6Z"/>',
  leaf: '<path d="M5 19c0-8 5-13.5 14.5-14-.5 9.5-6 14.5-14 14.5Z"/><path d="M5 19c3-4 6-6.5 9.5-8"/>',
  grain: '<path d="M12 21V8M12 8c-2.5-.5-3.5-2.5-3.5-4.5C11 4 12 6 12 8Zm0 0c2.5-.5 3.5-2.5 3.5-4.5C13 4 12 6 12 8Z"/><path d="M12 14c-2.6-.4-4-2.4-4-4.6 2.6.3 4 2.3 4 4.6Zm0 0c2.6-.4 4-2.4 4-4.6-2.6.3-4 2.3-4 4.6Z"/>',
  droplet: '<path d="M12 3.5s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11Z"/><path d="M9.2 15.2a2.9 2.9 0 0 0 2.6 2.4"/>',
  fabric: '<path d="M4 7.5a3 3 0 0 1 6 0v12a3 3 0 0 0-6 0Z"/><path d="M7 4.5h11.5a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5H7"/>',
  flask: '<path d="M9.5 3.5h5M10.5 3.5v6L5 18.5a1.4 1.4 0 0 0 1.2 2h11.6a1.4 1.4 0 0 0 1.2-2L13.5 9.5v-6"/><path d="M7.6 14.5h8.8"/>',
  drum: '<ellipse cx="12" cy="5.5" rx="6.5" ry="2"/><path d="M5.5 5.5v13c0 1.1 2.9 2 6.5 2s6.5-.9 6.5-2v-13M5.5 10.5c0 1.1 2.9 2 6.5 2s6.5-.9 6.5-2M5.5 15c0 1.1 2.9 2 6.5 2s6.5-.9 6.5-2"/>',
  transformer: '<rect x="5" y="8" width="14" height="12.5" rx="1"/><path d="M8 8V5M12 8V4M16 8V5M8 11.5v6M11 11.5v6M14 11.5v6M17 11.5v6"/>',
  rmu: '<rect x="3.5" y="4" width="17" height="16.5" rx="1"/><path d="M9.2 4v16.5M14.8 4v16.5"/><circle cx="6.3" cy="9" r="1.2"/><circle cx="12" cy="9" r="1.2"/><circle cx="17.7" cy="9" r="1.2"/>',
  enclosure: '<rect x="5" y="3.5" width="14" height="17" rx="1"/><path d="M16 11v2M8 7.5h5"/>',
  gauge: '<path d="M4 16a8 8 0 1 1 16 0"/><path d="m12 16 4-5"/><circle cx="12" cy="16" r="1.3"/>',
  flame: '<path d="M12 21c-3.6 0-6-2.4-6-5.6 0-3.6 3-5.4 3.6-9 2.2 1.6 3 3.4 3 5 1-.8 1.6-2 1.6-3.4 2.2 1.8 3.8 4.4 3.8 7.4 0 3.2-2.4 5.6-6 5.6Z"/>',
};

export const icon = (name, { cls = 'icon', label = '' } = {}) => {
  const body = paths[name];
  if (!body) throw new Error(`Unknown icon: ${name}`);
  const a11y = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true" focusable="false"';
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" ${a11y}>${body}</svg>`;
};
