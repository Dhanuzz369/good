// Division brand lockup: the division's mark (its icon on its accent colour)
// beside "GoodBiz" over the division name. One component wherever a division
// appears: header menu, gateway, banners, category rows, range pages.
import { esc, html } from './util.js';
import { icon } from './icons.js';

export const accentStyle = (s) => `--accent:${s.accent};--accent-soft:${s.accentSoft}`;

export const brandMark = (s, { size = 'md', as = 'span', id = '' } = {}) => html`
  <${as} class="bmark bmark--${size}" style="${accentStyle(s)}"${id ? ` id="${id}"` : ''}>
    <span class="bmark__sign" aria-hidden="true">${icon(s.icon)}</span>
    <span class="bmark__name"><span class="bmark__house">GoodBiz</span> <span class="bmark__division">${esc(s.brandShort)}</span></span>
  </${as}>`;
