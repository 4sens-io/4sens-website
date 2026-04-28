(() => {
  const d = document.getElementById('cdot'), r = document.getElementById('cring');
  if (!d) return;
  let x = 0, y = 0, rx = 0, ry = 0;
  addEventListener('mousemove', e => {
    x = e.clientX; y = e.clientY;
    d.style.transform = `translate3d(${x - 3}px,${y - 3}px,0)`;
  });
  (function loop() {
    rx += (x - rx) * .15; ry += (y - ry) * .15;
    r.style.transform = `translate3d(${rx - 17}px,${ry - 17}px,0)`;
    requestAnimationFrame(loop);
  })();
  document.addEventListener('mouseover', e => {
    if (e.target.closest('a,button,.tag,.cc,.svcc,.pil,.card,.ac,.ahero')) document.body.classList.add('cb');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest('a,button,.tag,.cc,.svcc,.pil,.card,.ac,.ahero')) document.body.classList.remove('cb');
  });
})();
