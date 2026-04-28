// ——— Cursor
(() => {
  const d=document.getElementById('cdot'),r=document.getElementById('cring');
  if(!d) return;
  let x=0,y=0,rx=0,ry=0;
  addEventListener('mousemove',e=>{x=e.clientX;y=e.clientY;d.style.transform=`translate3d(${x-3}px,${y-3}px,0)`});
  (function loop(){rx+=(x-rx)*.15;ry+=(y-ry)*.15;r.style.transform=`translate3d(${rx-17}px,${ry-17}px,0)`;requestAnimationFrame(loop)})();
  document.addEventListener('mouseover',e=>{if(e.target.closest('a,button,.tag,.cc,.svcc,.pil,.card,.ac,.ahero'))document.body.classList.add('cb')});
  document.addEventListener('mouseout',e=>{if(e.target.closest('a,button,.tag,.cc,.svcc,.pil,.card,.ac,.ahero'))document.body.classList.remove('cb')});
})();

// ——— Progress
addEventListener('scroll',()=>{
  const h=document.documentElement,p=h.scrollTop/(h.scrollHeight-h.clientHeight)*100;
  document.getElementById('prog').style.width=p+'%';
  document.getElementById('nav').classList.toggle('sc',h.scrollTop>20);
});

// ——— Router (SPA)
const pages=document.querySelectorAll('.page');
function go(id){
  const target=document.querySelector(`[data-page="${id}"]`)||document.querySelector('[data-page="404"]');
  pages.forEach(p=>p.classList.remove('active'));
  target.classList.add('active');
  document.querySelectorAll('.nlinks a').forEach(a=>a.classList.toggle('active',a.dataset.go===id));
  scrollTo({top:0,behavior:'instant'});
  history.replaceState(null,'','#'+id);
  setTimeout(initReveal,50);
  closeMenu();
}
document.addEventListener('click',e=>{
  const t=e.target.closest('[data-go]');
  if(t){e.preventDefault();go(t.dataset.go)}
});
addEventListener('load',()=>{const h=location.hash.slice(1);go(h||'home')});

// ——— Mobile menu
const mm=document.getElementById('mmenu'),ham=document.getElementById('ham');
function closeMenu(){mm.classList.remove('open');document.body.classList.remove('nav-open')}
ham.onclick=()=>{mm.classList.toggle('open');document.body.classList.toggle('nav-open')};

// ——— Reveal + count-up
let revIO;
function initReveal(){
  if(revIO)revIO.disconnect();
  revIO=new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        en.target.classList.add('in');
        // count-up
        en.target.querySelectorAll?.('.cnt').forEach(c=>{
          if(c.dataset.done)return;c.dataset.done=1;
          const to=parseFloat(c.dataset.to),dec=+(c.dataset.dec||0),dur=1400;
          const t0=performance.now();
          (function tick(t){
            const p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3),v=to*e;
            c.textContent=dec?v.toFixed(dec):Math.round(v);
            if(p<1)requestAnimationFrame(tick);
          })(t0);
        });
        // chart
        if(en.target.classList?.contains('chart'))en.target.classList.add('in');
        // cl ticks
        if(en.target.classList?.contains('cl')){
          [...en.target.children].forEach((li,i)=>setTimeout(()=>li.classList.add('in'),120*i));
        }
        // process line
        if(en.target.id==='proc'){
          en.target.querySelector('.pline').style.setProperty('--p','100%');
          [...en.target.querySelectorAll('.step')].forEach((s,i)=>setTimeout(()=>s.classList.add('active'),280*i));
        }
      }
    });
  },{threshold:.18,rootMargin:'0px 0px -60px 0px'});
  document.querySelectorAll('.page.active .reveal,.page.active .chart,.page.active .cl,.page.active #proc').forEach(e=>{
    e.classList.remove('in');
    if(e.id==='proc'){e.querySelector('.pline').style.setProperty('--p','0%');e.querySelectorAll('.step').forEach(s=>s.classList.remove('active'))}
    revIO.observe(e);
  });
}

// ——— Particles (hero)
(() => {
  const c=document.getElementById('particles');if(!c)return;
  const ctx=c.getContext('2d');let w,h,ps=[],mouse={x:-999,y:-999};
  function rs(){w=c.width=c.offsetWidth*devicePixelRatio;h=c.height=c.offsetHeight*devicePixelRatio;ctx.scale(1,1)}
  addEventListener('resize',rs);rs();
  const N=Math.min(90,Math.floor(w*h/28000));
  for(let i=0;i<N;i++)ps.push({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,r:Math.random()*1.4+.4});
  c.addEventListener('mousemove',e=>{const b=c.getBoundingClientRect();mouse.x=(e.clientX-b.left)*devicePixelRatio;mouse.y=(e.clientY-b.top)*devicePixelRatio});
  c.addEventListener('mouseleave',()=>{mouse.x=-999;mouse.y=-999});
  (function loop(){
    ctx.clearRect(0,0,w,h);
    for(const p of ps){
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;
      const dx=p.x-mouse.x,dy=p.y-mouse.y,d=Math.hypot(dx,dy);
      if(d<140*devicePixelRatio){p.x+=dx/d*.8;p.y+=dy/d*.8}
      ctx.fillStyle='rgba(255,255,255,.5)';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
    }
    for(let i=0;i<ps.length;i++)for(let j=i+1;j<ps.length;j++){
      const a=ps[i],b=ps[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy);
      if(d<120*devicePixelRatio){
        const op=1-d/(120*devicePixelRatio);
        ctx.strokeStyle=`rgba(201,245,70,${op*.18})`;ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
      }
    }
    requestAnimationFrame(loop);
  })();
})();

// ——— Accordions
document.querySelectorAll('.acch').forEach(b=>{
  b.onclick=()=>b.parentElement.classList.toggle('open');
});

// ——— Tabs
document.querySelectorAll('.tabs').forEach(tabs=>{
  const parent=tabs.parentElement;
  tabs.querySelectorAll('button').forEach(btn=>{
    btn.onclick=()=>{
      tabs.querySelectorAll('button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      parent.querySelectorAll('.tabp').forEach(p=>p.classList.toggle('active',p.dataset.tab===btn.dataset.tab));
    };
  });
});

// ——— Case filters
(() => {
  const wrap=document.getElementById('caseFilters');if(!wrap)return;
  wrap.querySelectorAll('.tag').forEach(t=>t.onclick=()=>{
    wrap.querySelectorAll('.tag').forEach(x=>x.classList.remove('active'));
    t.classList.add('active');
    const f=t.dataset.filter;
    document.querySelectorAll('#caseGrid .cc').forEach(c=>{
      c.style.display=(f==='all'||c.dataset.cat===f)?'flex':'none';
    });
  });
})();

// ——— Budget slider
(() => {
  const s=document.getElementById('bud'),o=document.getElementById('bOut');if(!s)return;
  const ranges=['&lt; € 10 000','€ 10 000 – 15 000','€ 15 000 – 30 000','€ 30 000 – 60 000','€ 60 000 – 100 000','€ 100 000 – 150 000','€ 150 000 – 200 000','&gt; € 200 000'];
  const upd=()=>o.innerHTML=ranges[+s.value];s.oninput=upd;upd();
})();

// ——— ROAS calc
(() => {
  const sp=document.getElementById('roasSpend'),rv=document.getElementById('roasRev'),cg=document.getElementById('roasCogs');
  if(!sp)return;
  const u=()=>{
    const s=+sp.value||0,r=+rv.value||0,c=+cg.value||0;
    document.getElementById('roasOut').textContent='×'+(s?((r/s).toFixed(2)):'0.00');
    document.getElementById('poasOut').textContent='×'+(s?(((r-c)/s).toFixed(2)):'0.00');
  };[sp,rv,cg].forEach(i=>i.oninput=u);u();
})();

// ——— Contact form
(() => {
  const f=document.getElementById('cf');if(!f)return;
  f.onsubmit=e=>{
    e.preventDefault();
    let ok=true;
    f.querySelectorAll('[required]').forEach(i=>{
      const bad=!i.value||(i.type==='email'&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(i.value));
      i.classList.toggle('err',bad);if(bad)ok=false;
    });
    if(ok){document.getElementById('fok').classList.add('show');f.reset();document.getElementById('bOut').innerHTML='€ 15 000 – 30 000';}
  };
})();

// ——— TOC active
(() => {
  const links=document.querySelectorAll('.toc a');if(!links.length)return;
  addEventListener('scroll',()=>{
    let cur='';
    links.forEach(l=>{
      const id=l.getAttribute('href').slice(1),el=document.getElementById(id);
      if(el&&el.getBoundingClientRect().top<180)cur=id;
    });
    links.forEach(l=>l.classList.toggle('active',l.getAttribute('href')==='#'+cur));
  });
})();
