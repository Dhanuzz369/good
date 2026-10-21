document.documentElement.style.scrollBehavior = 'auto';
document.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; i.decoding = 'sync'; });
await Promise.all([...document.images].map((i) => i.decode().catch(() => 0)));
for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); }
scrollTo(0, 0); await new Promise((r) => setTimeout(r, 900));
return { h: document.documentElement.scrollHeight, sw: document.documentElement.scrollWidth };
