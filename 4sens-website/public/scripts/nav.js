// Progress bar + nav scroll
addEventListener('scroll', () => {
  const h = document.documentElement;
  const p = h.scrollTop / (h.scrollHeight - h.clientHeight) * 100;
  const prog = document.getElementById('prog');
  if (prog) prog.style.width = p + '%';
  const nav = document.getElementById('nav');
  if (nav) nav.classList.toggle('sc', h.scrollTop > 20);
});

// Mobile menu
const mm = document.getElementById('mmenu');
const ham = document.getElementById('ham');
if (ham && mm) {
  ham.onclick = () => {
    mm.classList.toggle('open');
    document.body.classList.toggle('nav-open');
  };
  // Close on link click
  mm.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mm.classList.remove('open');
      document.body.classList.remove('nav-open');
    });
  });
}

// Mark active nav link based on current path
const path = location.pathname.replace(/\/$/, '') || '/';
document.querySelectorAll('.nlinks a[href]').forEach(a => {
  const href = a.getAttribute('href').replace(/\/$/, '') || '/';
  a.classList.toggle('active', href === path || (href !== '/' && path.startsWith(href)));
});
