const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

$$('.lang-switch').forEach(sw => {
  const btn = $('.lang-btn', sw);
  btn?.addEventListener('click', () => {
    const open = sw.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
});
document.addEventListener('click', (e) => {
  if (!e.target.closest('.lang-switch')) $$('.lang-switch').forEach(s => s.classList.remove('open'));
});

const drawer = $('.drawer'), burger = $('.burger'), closeBtn = $('.drawer-close'), backdrop = $('.backdrop');
let lastFocus = null;
const focusable = () => $$('button,a,input,[tabindex]:not([tabindex="-1"])', drawer).filter(el => !el.disabled);
function setDrawer(open) {
  drawer?.classList.toggle('open', open);
  backdrop?.classList.toggle('show', open);
  document.body.classList.toggle('lock', open);
  burger?.setAttribute('aria-expanded', String(open));
  drawer?.setAttribute('aria-hidden', String(!open));
  if (open) { lastFocus = document.activeElement; focusable()[0]?.focus(); }
  else lastFocus?.focus();
}
burger?.addEventListener('click', () => setDrawer(true));
closeBtn?.addEventListener('click', () => setDrawer(false));
backdrop?.addEventListener('click', () => setDrawer(false));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { setDrawer(false); closeModal(); }
  if (e.key === 'Tab' && drawer?.classList.contains('open')) {
    const f = focusable(); if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});
$$('.drawer a').forEach(a => a.addEventListener('click', () => setDrawer(false)));

const details = $$('.faq details');
details.forEach(d => d.addEventListener('toggle', () => {
  if (d.open) details.filter(x => x !== d).forEach(x => x.open = false);
}));

const modal = $('.modal');
const modalOpeners = $$('[data-open-policy]');
const modalClosers = $$('.icon-close,[data-close-policy]');
function openModal() { modal?.classList.add('open'); modal?.setAttribute('aria-hidden', 'false'); document.body.classList.add('lock'); }
function closeModal() { modal?.classList.remove('open'); modal?.setAttribute('aria-hidden', 'true'); document.body.classList.remove('lock'); }
modalOpeners.forEach(b => b.addEventListener('click', (e) => { e.preventDefault(); openModal(); }));
modalClosers.forEach(b => b.addEventListener('click', closeModal));
modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.14 });
$$('.reveal').forEach(el => io.observe(el));
