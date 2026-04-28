(function () {
  const KEY = '4sens_access';
  const HASH = 'erik123';

  if (sessionStorage.getItem(KEY) === '1') return;

  const overlay = document.createElement('div');
  overlay.id = 'pw-overlay';
  overlay.innerHTML = `
    <div class="pw-box">
      <div class="pw-logo"><b>4sens</b><em>·</em><span>Agency</span></div>
      <p class="pw-label">Acceso restringido</p>
      <form id="pw-form">
        <input id="pw-input" type="password" placeholder="Contraseña" autocomplete="current-password" autofocus/>
        <button type="submit">Entrar <span>→</span></button>
      </form>
      <p id="pw-error" class="pw-error">Contraseña incorrecta.</p>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    #pw-overlay{position:fixed;inset:0;z-index:99999;background:#07070A;display:flex;align-items:center;justify-content:center;font-family:"Instrument Sans",system-ui,sans-serif}
    .pw-box{width:100%;max-width:380px;padding:48px 40px;border:1px solid rgba(255,255,255,.08);border-radius:20px;background:#111116;text-align:center}
    .pw-logo{display:inline-flex;align-items:baseline;gap:2px;font-family:"Syne",sans-serif;font-size:24px;letter-spacing:-.04em;margin-bottom:28px}
    .pw-logo b{font-weight:700;color:#fff}.pw-logo em{color:#C9F546;font-weight:700;padding:0 3px;font-style:normal}.pw-logo span{font-weight:400;color:#5A5A6A;font-size:16px}
    .pw-label{font-family:"DM Mono",monospace;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#5A5A6A;margin-bottom:28px}
    #pw-form{display:flex;flex-direction:column;gap:12px}
    #pw-input{width:100%;padding:14px 18px;border:1px solid rgba(255,255,255,.12);border-radius:10px;background:rgba(255,255,255,.04);color:#fff;font-size:15px;text-align:center;letter-spacing:.1em;outline:none;transition:border-color .2s}
    #pw-input:focus{border-color:#C9F546}
    #pw-form button{padding:14px;border-radius:10px;background:#C9F546;color:#000;font-size:15px;font-weight:600;cursor:pointer;border:none;transition:background .2s}
    #pw-form button:hover{background:#DEFC66}
    .pw-error{color:#ff5f5f;font-size:13px;margin-top:12px;opacity:0;transition:opacity .2s;font-family:"DM Mono",monospace}
    .pw-error.show{opacity:1}
  `;

  document.head.appendChild(style);
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  document.getElementById('pw-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const val = document.getElementById('pw-input').value;
    if (val === HASH) {
      sessionStorage.setItem(KEY, '1');
      overlay.style.transition = 'opacity .3s';
      overlay.style.opacity = '0';
      setTimeout(() => { overlay.remove(); document.body.style.overflow = ''; }, 320);
    } else {
      const err = document.getElementById('pw-error');
      err.classList.add('show');
      document.getElementById('pw-input').value = '';
      document.getElementById('pw-input').focus();
      setTimeout(() => err.classList.remove('show'), 2500);
    }
  });
})();
