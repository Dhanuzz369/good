// Chemical catalogue: search by name, filter by group, and "Request pricing"
// that selects the product in the pricing form.
export function initCatalogue() {
  const search = document.querySelector('[data-chem-search]');
  const filters = [...document.querySelectorAll('[data-chem-filter]')];
  const rows = [...document.querySelectorAll('[data-chem-row]')];
  const groups = [...document.querySelectorAll('[data-chem-group]')];
  const status = document.querySelector('[data-chem-status]');
  const empty = document.querySelector('[data-chem-empty]');
  const term = document.querySelector('[data-chem-term]');
  const clearBtn = document.querySelector('[data-chem-clear]');
  const form = document.getElementById('chem-enquiry');
  const select = document.querySelector('[data-chem-select]');
  if (!search || !form) return;

  let group = 'all';
  const apply = () => {
    const q = search.value.trim().toLowerCase();
    let shown = 0;
    rows.forEach((r) => {
      // A typed name searches every group, so a filter never hides an exact match.
      const ok = q ? r.dataset.name.includes(q) : group === 'all' || r.dataset.group === group;
      r.hidden = !ok;
      if (ok) shown++;
    });
    groups.forEach((g) => (g.hidden = !g.querySelector('[data-chem-row]:not([hidden])')));
    empty.hidden = shown > 0;
    if (term) term.textContent = search.value.trim();
    document.querySelector('.chem-table').hidden = shown === 0;
    status.textContent =
      shown === rows.length ? `Showing all ${rows.length} products` : `Showing ${shown} of ${rows.length} products`;
  };

  search.addEventListener('input', () => {
    if (search.value.trim() && group !== 'all') filters[0].click();
    apply();
  });
  clearBtn?.addEventListener('click', () => {
    search.value = '';
    filters[0].click();
    search.focus();
  });
  filters.forEach((btn) =>
    btn.addEventListener('click', () => {
      group = btn.dataset.chemFilter;
      filters.forEach((b) => {
        const on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      apply();
    }),
  );

  const choose = (id, { scroll = true } = {}) => {
    select.value = id;
    rows.forEach((r) => r.classList.toggle('is-selected', r.querySelector('[data-chem]')?.dataset.chem === id));
    form.classList.remove('is-flash');
    void form.offsetWidth;
    form.classList.add('is-flash');
    if (scroll) {
      form.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      form.querySelector('[name=quantity]').focus({ preventScroll: true });
    }
  };

  // Delegated, so pricing links drawn by the search work too.
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-chem]');
    if (!a) return;
    e.preventDefault();
    choose(a.dataset.chem);
  });
  select.addEventListener('change', () => choose(select.value, { scroll: false }));
  apply();

  // Arriving from a range page's "Request pricing": preselect that chemical.
  const wanted = new URLSearchParams(location.search).get('chem');
  if (wanted && [...select.options].some((o) => o.value === wanted)) choose(wanted, { scroll: false });
}
