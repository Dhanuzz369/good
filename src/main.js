import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/sections.css';
import './styles/pages.css';
import './styles/motion.css';

import { initEnquiryList } from './js/enquiry-list.js';
import { initCatalogue } from './js/catalogue.js';
import { initForms } from './js/forms.js';
import { initSearch } from './js/search.js';
import { initHeader, initTicker, initExpanders, initTabs, initCarousel, initReveal, initImageFallback, initAds, initSwitcher } from './js/ui.js';

initImageFallback();
initHeader();
initTicker();
const paintEnquiryButtons = initEnquiryList();
initSearch({ onRender: paintEnquiryButtons });
initCatalogue();
initForms();
initExpanders();
initTabs();
initCarousel();
initAds();
initSwitcher();
initReveal();
