// Accordions
document.querySelectorAll('.acch').forEach(b => {
  b.onclick = () => b.parentElement.classList.toggle('open');
});

// Tabs
document.querySelectorAll('.tabs').forEach(tabs => {
  const parent = tabs.parentElement;
  tabs.querySelectorAll('button').forEach(btn => {
    btn.onclick = () => {
      tabs.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      parent.querySelectorAll('.tabp').forEach(p => p.classList.toggle('active', p.dataset.tab === btn.dataset.tab));
    };
  });
});

// Case filters
(() => {
  const wrap = document.getElementById('caseFilters'); if (!wrap) return;
  wrap.querySelectorAll('.tag').forEach(t => t.onclick = () => {
    wrap.querySelectorAll('.tag').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    const f = t.dataset.filter;
    document.querySelectorAll('#caseGrid .cc').forEach(c => {
      c.style.display = (f === 'all' || c.dataset.cat === f) ? 'flex' : 'none';
    });
  });
})();

// Budget slider
(() => {
  const s = document.getElementById('bud'), o = document.getElementById('bOut'); if (!s) return;
  const ranges = ['&lt; € 10 000', '€ 10 000 – 15 000', '€ 15 000 – 30 000', '€ 30 000 – 60 000', '€ 60 000 – 100 000', '€ 100 000 – 150 000', '€ 150 000 – 200 000', '&gt; € 200 000'];
  const upd = () => o.innerHTML = ranges[+s.value]; s.oninput = upd; upd();
})();

// ROAS calc
(() => {
  const sp = document.getElementById('roasSpend'), rv = document.getElementById('roasRev'), cg = document.getElementById('roasCogs');
  if (!sp) return;
  const u = () => {
    const s = +sp.value || 0, r = +rv.value || 0, c = +cg.value || 0;
    document.getElementById('roasOut').textContent = '×' + (s ? (r / s).toFixed(2) : '0.00');
    document.getElementById('poasOut').textContent = '×' + (s ? ((r - c) / s).toFixed(2) : '0.00');
  };
  [sp, rv, cg].forEach(i => i.oninput = u); u();
})();

// Contact form
(() => {
  const f = document.getElementById('cf'); if (!f) return;
  f.onsubmit = e => {
    e.preventDefault();
    let ok = true;
    f.querySelectorAll('[required]').forEach(i => {
      const bad = !i.value || (i.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(i.value));
      i.classList.toggle('err', bad); if (bad) ok = false;
    });
    if (ok) { document.getElementById('fok').classList.add('show'); f.reset(); const bOut = document.getElementById('bOut'); if (bOut) bOut.innerHTML = '€ 15 000 – 30 000'; }
  };
})();

// TOC active
(() => {
  const links = document.querySelectorAll('.toc a'); if (!links.length) return;
  addEventListener('scroll', () => {
    let cur = '';
    links.forEach(l => {
      const id = l.getAttribute('href').slice(1), el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top < 180) cur = id;
    });
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + cur));
  });
})();
