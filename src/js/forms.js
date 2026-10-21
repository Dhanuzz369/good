// Validation and delivery for both enquiry forms. With site.formEndpoint set,
// enquiries are POSTed as JSON; otherwise a complete, pre-filled email opens
// in the visitor's mail client, addressed to site.email.
import { site } from '../data/site.js';
import { chemicals } from '../data/products.js';
import { getItems, clear } from './enquiry-list.js';

const messages = {
  valueMissing: 'Please fill this in.',
  typeMismatch: 'Please enter a valid email address.',
  consent: 'Please confirm we may use these details to reply.',
  number: 'Enter the quantity as a number, for example 20 or 2.5.',
  tooLong: 'This is longer than we can accept; please shorten it.',
};

function showError(field, text) {
  const wrap = field.closest('.field, .check');
  field.setAttribute('aria-invalid', 'true');
  let msg = wrap.querySelector('.field__error');
  if (!msg) {
    msg = document.createElement('span');
    msg.className = 'field__error';
    msg.id = `${field.name}-${Math.random().toString(36).slice(2, 7)}-err`;
    wrap.append(msg);
    field.setAttribute('aria-describedby', msg.id);
  }
  msg.textContent = text;
}
function clearError(field) {
  field.removeAttribute('aria-invalid');
  field.closest('.field, .check')?.querySelector('.field__error')?.remove();
  field.removeAttribute('aria-describedby');
}

function validate(form) {
  let first = null;
  form.querySelectorAll('input, select, textarea').forEach((f) => {
    clearError(f);
    if (f.checkValidity()) return;
    const text =
      f.name === 'consent'
        ? messages.consent
        : f.validity.typeMismatch
          ? messages.typeMismatch
          : f.validity.patternMismatch
            ? messages.number
            : f.validity.tooLong
              ? messages.tooLong
              : messages.valueMissing;
    showError(f, text);
    first ||= f;
  });
  return first;
}

const line = (label, value) => (value ? `${label}: ${value}` : null);

function chemicalBody(data) {
  const product =
    data.get('product') === 'other' ? 'Another chemical (see notes)' : chemicals.find((c) => c.id === data.get('product'))?.name;
  const docs = data.getAll('docs');
  return {
    subject: `Pricing request: ${product} for ${data.get('country')}`,
    lines: [
      'CHEMICAL PRICING REQUEST',
      line('Product', product),
      line('Quantity', `${data.get('quantity')} ${data.get('unit')}`),
      line('Destination country', data.get('country')),
      line('Required grade / specification', data.get('grade')),
      line('Packaging preference', data.get('packaging')),
      line('Technical documents requested', docs.join(', ')),
      '',
      line('Name', data.get('name')),
      line('Company', data.get('company')),
      line('Email', data.get('email')),
      line('Phone / WhatsApp', data.get('phone')),
      '',
      line('Notes', data.get('message')),
    ],
  };
}

function quoteBody(data) {
  const items = getItems();
  const list = items.map((i) => `- ${i.name}: ${i.qty || 'quantity to confirm'} ${i.qty ? i.unit : ''}`.trim());
  return {
    subject: `Quotation request from ${data.get('company')} (${data.get('country')})`,
    lines: [
      'QUOTATION REQUEST',
      items.length ? 'Products:' : null,
      ...list,
      line('Other products / detail', data.get('products_other')),
      '',
      line('Destination country', data.get('country')),
      line('Destination port', data.get('port')),
      line('Preferred Incoterms', data.get('incoterms')),
      line('Timeline', data.get('timeline')),
      '',
      line('Name', data.get('name')),
      line('Company', data.get('company')),
      line('Email', data.get('email')),
      line('Phone / WhatsApp', data.get('phone')),
      '',
      line('Message', data.get('message')),
    ],
  };
}

async function deliver({ subject, lines }, data) {
  const body = lines.filter((l) => l !== null).join('\n').replace(/\n{3,}/g, '\n\n');
  if (site.formEndpoint) {
    const res = await fetch(site.formEndpoint, {
      signal: AbortSignal.timeout(15000),
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ subject, body, ...Object.fromEntries(data), items: getItems() }),
    });
    if (!res.ok) throw new Error(`Form endpoint answered ${res.status}`);
    return 'sent';
  }
  window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return 'mail';
}

export function initForms() {
  document.querySelectorAll('[data-form]').forEach((form) => {
    const status = form.querySelector('[data-form-status]');
    form.addEventListener('input', (e) => {
      if (e.target.getAttribute('aria-invalid') === 'true' && e.target.checkValidity()) clearError(e.target);
    });
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.classList.remove('is-error', 'is-ok');
      const kind = form.dataset.form;

      if (kind === 'quote' && getItems().length === 0 && !form.products_other.value.trim()) {
        const f = form.products_other;
        showError(f, 'Add a product from the page or describe what you need.');
        f.focus();
        return;
      }
      const first = validate(form);
      if (first) {
        status.textContent = 'Some details are missing. Please check the highlighted fields.';
        status.classList.add('is-error');
        first.focus();
        return;
      }

      const data = new FormData(form);
      const payload = kind === 'chemical' ? chemicalBody(data) : quoteBody(data);
      const btn = form.querySelector('[type=submit]');
      btn.disabled = true;
      btn.classList.add('is-loading');
      try {
        const how = await deliver(payload, data);
        status.textContent =
          how === 'sent'
            ? 'Thank you. Your enquiry has been sent and we will reply by email.'
            : `Your email app should open with the enquiry filled in; press send there. If nothing opens, write to ${site.email}.`;
        status.classList.add('is-ok');
        if (how === 'sent') {
          form.reset();
          if (kind === 'quote') clear();
        }
      } catch {
        status.textContent = `Sorry, the enquiry could not be sent (connection problem). Your details are still in the form; try again, or email ${site.email}.`;
        status.classList.add('is-error');
      } finally {
        btn.disabled = false;
        btn.classList.remove('is-loading');
      }
    });
  });
}
