const el = document.getElementById(new URLSearchParams(location.search).get('at') || 'main') || document.querySelector('.pcard');
el?.scrollIntoView({ block: 'start' }); scrollBy(0, -70);
await new Promise((r) => setTimeout(r, 500));
return { at: el?.id };
