// Settle images and entrances, then scroll to ?at=<id> (offset by the header).
document.documentElement.style.scrollBehavior = 'auto';
document.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; i.decoding = 'sync'; });
await Promise.all([...document.images].map((i) => i.decode().catch(() => 0)));
for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 25)); }
const at = new URLSearchParams(location.search).get('at');
const el = at && document.getElementById(at);
if (el) { el.scrollIntoView({ block: 'start' }); scrollBy(0, -(Number(new URLSearchParams(location.search).get('off')) || 80)); } else scrollTo(0, 0);
await new Promise((r) => setTimeout(r, 700));
return { y: scrollY, sw: document.documentElement.scrollWidth, at };
