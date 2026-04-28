(() => {
  const c = document.getElementById('particles'); if (!c) return;
  const ctx = c.getContext('2d'); let w, h, ps = [], mouse = { x: -999, y: -999 };
  const mobile = window.innerWidth < 768;
  function rs() { w = c.width = c.offsetWidth * devicePixelRatio; h = c.height = c.offsetHeight * devicePixelRatio; }
  addEventListener('resize', rs); rs();
  const N = mobile ? Math.min(35, Math.floor(w * h / 60000)) : Math.min(55, Math.floor(w * h / 36000));
  for (let i = 0; i < N; i++) ps.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3, r: Math.random() * 1.4 + .4 });
  c.addEventListener('mousemove', e => { const b = c.getBoundingClientRect(); mouse.x = (e.clientX - b.left) * devicePixelRatio; mouse.y = (e.clientY - b.top) * devicePixelRatio; });
  c.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });
  (function loop() {
    ctx.clearRect(0, 0, w, h);
    for (const p of ps) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1; if (p.y < 0 || p.y > h) p.vy *= -1;
      const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
      if (d < 140 * devicePixelRatio) { p.x += dx / d * .8; p.y += dy / d * .8; }
      ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }
    if (!mobile) {
      for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) {
        const a = ps[i], b = ps[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
        if (d < 120 * devicePixelRatio) {
          const op = 1 - d / (120 * devicePixelRatio);
          ctx.strokeStyle = `rgba(201,245,70,${op * .18})`; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    requestAnimationFrame(loop);
  })();
})();
