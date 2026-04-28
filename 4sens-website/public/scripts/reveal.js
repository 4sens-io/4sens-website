// Scroll reveal + count-up + chart + checklist + process
let revIO;
function initReveal() {
  if (revIO) revIO.disconnect();
  revIO = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      // count-up
      en.target.querySelectorAll?.('.cnt').forEach(c => {
        if (c.dataset.done) return; c.dataset.done = 1;
        const to = parseFloat(c.dataset.to), dec = +(c.dataset.dec || 0), dur = 1400;
        const t0 = performance.now();
        (function tick(t) {
          const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3), v = to * e;
          c.textContent = dec ? v.toFixed(dec) : Math.round(v);
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      });
      // chart
      if (en.target.classList?.contains('chart')) en.target.classList.add('in');
      // checklist ticks
      if (en.target.classList?.contains('cl')) {
        [...en.target.children].forEach((li, i) => setTimeout(() => li.classList.add('in'), 120 * i));
      }
      // process line
      if (en.target.id === 'proc') {
        en.target.querySelector('.pline')?.style.setProperty('--p', '100%');
        [...en.target.querySelectorAll('.step')].forEach((s, i) => setTimeout(() => s.classList.add('active'), 280 * i));
      }
    });
  }, { threshold: .18, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal,.chart,.cl,#proc').forEach(e => {
    e.classList.remove('in');
    if (e.id === 'proc') {
      e.querySelector('.pline')?.style.setProperty('--p', '0%');
      e.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    }
    revIO.observe(e);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReveal);
} else {
  initReveal();
}
