/* mhyson. winkelmandje: bewaart regels per kleur en rekent af via Shopify (cart-permalink) */
(function () {
  const SHOP = 'https://0f76bd-xw.myshopify.com';
  const PRICE = 295;
  const BASE = document.currentScript.src.replace(/assets\/shop\.js.*$/, '');
  const COLORS = [
    {k:'roze',  n:'Blush',    v:58898037277003, sw:'#e9b5b0'},
    {k:'beige', n:'Sand',     v:58898037309771, sw:'#ece3d3'},
    {k:'blauw', n:'Sky',      v:58898037342539, sw:'#8fc3c3'},
    {k:'grijs', n:'Stone',    v:58898037375307, sw:'#8d8b88'},
    {k:'zwart', n:'Midnight', v:58898037408075, sw:'#1d1b1a'}
  ];
  const byK = Object.fromEntries(COLORS.map(c => [c.k, c]));
  const eur = n => '€' + n.toLocaleString('nl-NL', {minimumFractionDigits: 0});

  let cart = [];
  try { cart = JSON.parse(localStorage.getItem('mh_cart') || '[]').filter(l => byK[l.k] && l.q > 0); } catch (e) {}
  const save = () => { try { localStorage.setItem('mh_cart', JSON.stringify(cart)); } catch (e) {} render(); };
  const count = () => cart.reduce((s, l) => s + l.q, 0);

  function add(k, q) {
    const l = cart.find(x => x.k === k);
    if (l) l.q = Math.min(20, l.q + q); else cart.push({k, q: Math.min(20, q)});
    save(); open();
  }
  function setQ(k, q) { cart = cart.map(l => l.k === k ? {...l, q} : l).filter(l => l.q > 0); save(); }
  function checkoutUrl(lines) {
    let code = ''; try { code = localStorage.getItem('mh_code') || ''; } catch (e) {}
    return SHOP + '/cart/' + lines.map(l => byK[l.k].v + ':' + l.q).join(',') + (code ? '?discount=' + encodeURIComponent(code) : '');
  }

  /* ---------- lade ---------- */
  const css = `
  .mhc-ov{position:fixed;inset:0;z-index:200;background:rgba(20,15,14,.45);backdrop-filter:blur(4px);opacity:0;pointer-events:none;transition:opacity .5s}
  .mhc-ov.open{opacity:1;pointer-events:auto}
  .mhc{position:fixed;top:0;right:0;bottom:0;z-index:201;width:min(440px,100%);background:#faf6f4;color:#231b1a;display:flex;flex-direction:column;transform:translateX(105%);transition:transform .7s cubic-bezier(.16,1,.3,1);box-shadow:-30px 0 80px -30px rgba(0,0,0,.35);font-family:Inter,system-ui,sans-serif}
  .mhc.open{transform:none}
  .mhc-h{display:flex;justify-content:space-between;align-items:center;padding:calc(20px + env(safe-area-inset-top)) 26px 20px;border-bottom:1px solid rgba(35,27,26,.1)}
  .mhc-h b{font-family:Fraunces,Georgia,serif;font-weight:400;font-size:28px;letter-spacing:-.03em}
  .mhc-h button{background:none;border:0;font-size:30px;line-height:1;cursor:pointer;color:inherit;opacity:.6}
  .mhc-free{margin:16px 26px 0;padding:12px 16px;border-radius:14px;background:#efe3df;font-size:13px}
  .mhc-l{flex:1;overflow:auto;padding:8px 26px}
  .mhc-i{display:grid;grid-template-columns:84px 1fr auto;gap:16px;align-items:center;padding:18px 0;border-bottom:1px solid rgba(35,27,26,.08)}
  .mhc-i .th{width:84px;height:84px;border-radius:18px;display:grid;place-items:center;overflow:hidden}
  .mhc-i .th img{height:74px;width:auto}
  .mhc-i .nm{font-family:Fraunces,Georgia,serif;font-size:19px;line-height:1.1}
  .mhc-i .cl{font-size:13px;opacity:.65;margin-top:3px;display:flex;align-items:center;gap:6px}
  .mhc-i .cl i{width:10px;height:10px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(0,0,0,.15)}
  .mhc-q{display:inline-flex;align-items:center;margin-top:10px;border-radius:999px;box-shadow:inset 0 0 0 1px rgba(35,27,26,.18)}
  .mhc-q button{width:32px;height:32px;border:0;background:none;cursor:pointer;font-size:16px;color:inherit}
  .mhc-q span{min-width:22px;text-align:center;font-weight:600;font-size:14px}
  .mhc-i .pr{text-align:right;font-weight:600}
  .mhc-i .rm{display:block;margin-top:8px;font-size:12px;opacity:.55;background:none;border:0;cursor:pointer;color:inherit;text-decoration:underline}
  .mhc-e{padding:60px 0;text-align:center;opacity:.7}
  .mhc-f{padding:22px 26px calc(26px + env(safe-area-inset-bottom));border-top:1px solid rgba(35,27,26,.1);background:#fff}
  .mhc-row{display:flex;justify-content:space-between;font-size:15px;margin-bottom:6px}
  .mhc-row.t{font-family:Fraunces,Georgia,serif;font-size:24px;margin:10px 0 16px}
  .mhc-go{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:19px;border-radius:999px;border:0;background:#231b1a;color:#fff;font:600 13px Inter,sans-serif;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;text-decoration:none;transition:transform .4s cubic-bezier(.16,1,.3,1)}
  .mhc-go:hover{transform:translateY(-2px)}
  .mhc-go[aria-disabled=true]{opacity:.35;pointer-events:none}
  .mhc-pay{display:flex;justify-content:center;gap:8px;margin-top:14px;font-size:11px;opacity:.6;letter-spacing:.06em}
  .mhc-bump{animation:mhcb .6s cubic-bezier(.16,1,.3,1)}
  @keyframes mhcb{40%{transform:scale(1.35)}}
  [data-cart-count]:empty{display:none}`;
  document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);
  document.body.insertAdjacentHTML('beforeend', `
    <div class="mhc-ov" id="mhcOv"></div>
    <aside class="mhc" id="mhc" aria-label="Winkelmandje" aria-hidden="true">
      <div class="mhc-h"><b>Je mandje</b><button type="button" aria-label="Sluiten" data-cart-close>×</button></div>
      <div class="mhc-free">✓ Gratis verzending naar Nederland en België · 30 dagen proefzitten</div>
      <div class="mhc-l" id="mhcL"></div>
      <div class="mhc-f">
        <div class="mhc-row"><span>Subtotaal</span><span id="mhcSub">€0</span></div>
        <div class="mhc-row"><span>Verzending</span><span>Gratis</span></div>
        <div class="mhc-row t"><span>Totaal</span><span id="mhcTot">€0</span></div>
        <a class="mhc-go" id="mhcGo" href="#">Veilig afrekenen →</a>
        <div class="mhc-pay">Klarna · PayPal · Apple Pay · Bancontact · Creditcard</div>
      </div>
    </aside>`);
  const el = document.getElementById('mhc'), ov = document.getElementById('mhcOv'), L = document.getElementById('mhcL');

  function render() {
    const n = count();
    document.querySelectorAll('[data-cart-count]').forEach(b => { const old = b.textContent; b.textContent = n || ''; if (n && old !== String(n)) { b.classList.remove('mhc-bump'); void b.offsetWidth; b.classList.add('mhc-bump'); } });
    if (!cart.length) L.innerHTML = '<div class="mhc-e">Je mandje is nog leeg.<br>Kies een kleur en je zit zo.</div>';
    else L.innerHTML = cart.map(l => { const c = byK[l.k]; return `
      <div class="mhc-i">
        <div class="th" style="background:${c.sw}33"><img src="${BASE}img/stoel-${c.k}.webp" alt=""></div>
        <div><div class="nm">Air Chair</div><div class="cl"><i style="background:${c.sw}"></i>${c.n}</div>
          <div class="mhc-q"><button type="button" data-q="${l.k}" data-d="-1" aria-label="Minder">−</button><span>${l.q}</span><button type="button" data-q="${l.k}" data-d="1" aria-label="Meer">+</button></div></div>
        <div class="pr">${eur(PRICE * l.q)}<button type="button" class="rm" data-rm="${l.k}">Verwijder</button></div>
      </div>`; }).join('');
    const tot = eur(PRICE * n);
    document.getElementById('mhcSub').textContent = tot; document.getElementById('mhcTot').textContent = tot;
    const go = document.getElementById('mhcGo');
    go.href = cart.length ? checkoutUrl(cart) : '#'; go.setAttribute('aria-disabled', !cart.length);
  }
  L.addEventListener('click', e => {
    const q = e.target.closest('[data-q]'), r = e.target.closest('[data-rm]');
    if (q) { const l = cart.find(x => x.k === q.dataset.q); setQ(l.k, Math.min(20, l.q + +q.dataset.d)); }
    if (r) setQ(r.dataset.rm, 0);
  });
  function open() { el.classList.add('open'); ov.classList.add('open'); el.setAttribute('aria-hidden', 'false'); }
  function close() { el.classList.remove('open'); ov.classList.remove('open'); el.setAttribute('aria-hidden', 'true'); }
  ov.addEventListener('click', close);
  document.addEventListener('click', e => {
    if (e.target.closest('[data-cart-open]')) { e.preventDefault(); open(); }
    if (e.target.closest('[data-cart-close]')) close();
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  // mandje van een ander tabblad bijwerken
  addEventListener('storage', e => { if (e.key === 'mh_cart') { try { cart = JSON.parse(e.newValue || '[]'); } catch (x) {} render(); } });
  render();

  window.MH = {COLORS, PRICE, add, open, close, checkoutUrl, eur};
})();
