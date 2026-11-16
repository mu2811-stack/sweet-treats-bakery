/* ==========================================================================
   MOTION X-RAY  ·  ITE 270 Module 5 teaching helper
   --------------------------------------------------------------------------
   Press M (or click the "Motion X-ray" button in the corner) to see every
   animation running on your page: what it animates, its duration, delay,
   easing, iterations and a live progress bar. You can also:
     · run everything at 1×, ¼× or ⅒× speed
     · pause and resume everything
     · outline elements that still have the .pending class (Step 5)
     · draw your IntersectionObserver trigger zone (Step 6a)

   To draw the trigger zone, call this from your own script:
       window.motionXray && motionXray.zone('-45% 0px -45% 0px');

   It never changes your animations' code. You can leave it in while you
   work and remove the <script> tag before you publish.
   ========================================================================== */
(function () {
  if (window.motionXray) return;

  const style = document.createElement('style');
  style.textContent = `
  #mx-open{position:fixed;right:14px;bottom:14px;z-index:2147483000;font:600 12px/1 ui-monospace,Menlo,Consolas,monospace;
    background:#111;color:#9be3a7;border:1px solid #444;border-radius:999px;padding:9px 12px;cursor:pointer}
  #mx-panel{position:fixed;right:14px;bottom:14px;z-index:2147483001;width:min(460px,calc(100vw - 28px));max-height:min(70vh,560px);
    display:none;flex-direction:column;background:#111;color:#e8e8ea;border:1px solid #444;border-radius:14px;
    font:12px/1.45 ui-monospace,Menlo,Consolas,monospace;box-shadow:0 10px 40px rgba(0,0,0,.4)}
  #mx-panel.open{display:flex}
  #mx-panel *{box-sizing:border-box;transition:none!important;animation:none!important}
  #mx-head{display:flex;flex-wrap:wrap;gap:6px;align-items:center;padding:10px 12px;border-bottom:1px solid #333}
  #mx-head strong{color:#9be3a7;margin-right:auto}
  #mx-panel button{font:inherit;background:#222;color:#e8e8ea;border:1px solid #444;border-radius:999px;padding:3px 9px;cursor:pointer}
  #mx-panel button[aria-pressed="true"]{background:#9be3a7;color:#111;border-color:#9be3a7}
  #mx-panel button:focus-visible{outline:2px solid #ff9f0a;outline-offset:2px}
  #mx-meta{padding:6px 12px;color:#a1a1a6;border-bottom:1px solid #333}
  #mx-list{overflow:auto;padding:6px 12px 12px;display:grid;gap:8px}
  .mx-row{display:grid;gap:3px;padding:8px 0;border-bottom:1px solid #2a2a2a}
  .mx-row b{color:#ff9f0a;font-weight:600}
  .mx-row .mx-t{color:#7fc8f8}
  .mx-row .mx-n{color:#a1a1a6}
  .mx-bar{height:6px;background:#2a2a2a;border-radius:3px;overflow:hidden}
  .mx-bar i{display:block;height:100%;background:#9be3a7}
  .mx-empty{color:#a1a1a6;padding:10px 0}
  html.mx-pending .pending{outline:2px dashed #ff375f!important;outline-offset:4px!important;opacity:.45!important}
  #mx-zone{position:fixed;left:0;right:0;z-index:2147482999;pointer-events:none;display:none;
    background:rgba(255,55,95,.08);border-top:2px dashed #ff375f;border-bottom:2px dashed #ff375f}
  #mx-zone span{position:absolute;right:12px;top:4px;font:11px ui-monospace,Menlo,monospace;background:#fff;color:#ff375f;padding:1px 6px;border-radius:5px}
  html.mx-zone #mx-zone{display:block}`;
  document.head.appendChild(style);

  const openBtn = document.createElement('button');
  openBtn.id = 'mx-open'; openBtn.type = 'button'; openBtn.textContent = 'Motion X-ray (M)';
  const panel = document.createElement('section');
  panel.id = 'mx-panel'; panel.setAttribute('aria-label', 'Motion X-ray');
  panel.innerHTML = `
    <div id="mx-head">
      <strong>Motion X-ray</strong>
      <span>speed</span>
      <button type="button" data-rate="1" aria-pressed="true">1×</button>
      <button type="button" data-rate="0.25" aria-pressed="false">¼×</button>
      <button type="button" data-rate="0.1" aria-pressed="false">⅒×</button>
      <button type="button" id="mx-pause" aria-pressed="false">Pause all</button>
      <button type="button" id="mx-pend" aria-pressed="false">Show pending</button>
      <button type="button" id="mx-zbtn" aria-pressed="false">Show trigger zone</button>
      <button type="button" id="mx-close" aria-label="Close Motion X-ray">✕</button>
    </div>
    <div id="mx-meta"></div>
    <div id="mx-list"></div>`;
  const zone = document.createElement('div');
  zone.id = 'mx-zone'; zone.innerHTML = '<span>trigger zone</span>';

  function mount() { document.body.append(openBtn, panel, zone); }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);

  let rate = 1, open = false, paused = [];
  const $ = s => panel.querySelector(s);
  const reducedMQ = matchMedia('(prefers-reduced-motion: reduce)');

  function toggle(force) {
    open = typeof force === 'boolean' ? force : !open;
    panel.classList.toggle('open', open);
    openBtn.style.display = open ? 'none' : '';
  }
  openBtn.addEventListener('click', () => toggle(true));
  $('#mx-close').addEventListener('click', () => toggle(false));
  addEventListener('keydown', e => {
    const tag = (e.target.tagName || '').toLowerCase();
    if (e.key.toLowerCase() === 'm' && !e.metaKey && !e.ctrlKey && !e.altKey && !['input', 'textarea', 'select'].includes(tag) && !e.target.isContentEditable) toggle();
  });
  panel.querySelectorAll('[data-rate]').forEach(b => b.addEventListener('click', () => {
    rate = +b.dataset.rate;
    panel.querySelectorAll('[data-rate]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  }));
  $('#mx-pause').addEventListener('click', e => {
    const on = e.currentTarget.getAttribute('aria-pressed') !== 'true';
    e.currentTarget.setAttribute('aria-pressed', String(on));
    if (on) { paused = document.getAnimations().filter(a => a.playState === 'running'); paused.forEach(a => a.pause()); }
    else { paused.forEach(a => a.play()); paused = []; }
  });
  $('#mx-pend').addEventListener('click', e => {
    const on = document.documentElement.classList.toggle('mx-pending');
    e.currentTarget.setAttribute('aria-pressed', String(on));
  });
  $('#mx-zbtn').addEventListener('click', e => {
    const on = document.documentElement.classList.toggle('mx-zone');
    e.currentTarget.setAttribute('aria-pressed', String(on));
  });

  // Turn a rootMargin like "-45% 0px -45% 0px" into a band on screen
  function zoneFrom(margin) {
    const parts = String(margin).trim().split(/\s+/);
    const top = parts[0], bottom = parts[2] || parts[0];
    const toPx = v => v.endsWith('%') ? parseFloat(v) / 100 * innerHeight : parseFloat(v) || 0;
    const t = -toPx(top), b = -toPx(bottom);
    zone.style.top = Math.max(0, t) + 'px';
    zone.style.bottom = Math.max(0, b) + 'px';
    zone.querySelector('span').textContent = 'trigger zone · rootMargin: ' + margin;
  }
  let lastMargin = null;
  addEventListener('resize', () => { if (lastMargin) zoneFrom(lastMargin); });

  const label = el => {
    if (!el) return '(none)';
    if (el.nodeType !== 1) return String(el);
    let s = el.tagName.toLowerCase();
    if (el.id) s += '#' + el.id;
    const cls = (el.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean).slice(0, 2);
    if (cls.length) s += '.' + cls.join('.');
    return s;
  };
  const kind = a => {
    if (window.CSSTransition && a instanceof CSSTransition) return `CSS transition · <b>${a.transitionProperty}</b>`;
    if (window.CSSAnimation && a instanceof CSSAnimation) return `CSS animation · <b>${a.animationName}</b>`;
    return `JS animate()${a.id ? ' · <b>' + a.id + '</b>' : ''}`;
  };
  const ms = v => typeof v === 'number' ? Math.round(v) + 'ms' : String(v);

  function frame() {
    if (!document.getAnimations) { requestAnimationFrame(frame); return; }
    const anims = document.getAnimations();
    anims.forEach(a => { if (a.playbackRate !== rate) a.playbackRate = rate; });
    if (open) {
      $('#mx-meta').textContent = `${anims.length} animation${anims.length === 1 ? '' : 's'} · reduced motion: ${reducedMQ.matches ? 'ON' : 'off'} · speed ${rate}×`;
      if (!anims.length) {
        $('#mx-list').innerHTML = '<p class="mx-empty">No animations running yet. Hover, click or scroll something you animated.</p>';
      } else {
        $('#mx-list').innerHTML = anims.slice(0, 40).map(a => {
          const t = a.effect ? a.effect.getTiming() : {};
          const c = a.effect ? a.effect.getComputedTiming() : {};
          const end = c.endTime, local = c.localTime || 0;
          const pct = isFinite(end) && end > 0 ? Math.min(1, local / end) : (c.progress || 0);
          const eased = c.progress == null ? '-' : c.progress.toFixed(2);
          const iters = t.iterations === Infinity ? '∞' : t.iterations;
          // CSS @keyframes animations keep their easing on the keyframes, not on the effect
          let easing = t.easing;
          if (easing === 'linear' && a.effect.getKeyframes) {
            const k = a.effect.getKeyframes()[0];
            if (k && k.easing) easing = k.easing;
          }
          t.easing = easing;
          return `<div class="mx-row">
            <div>${kind(a)} <span class="mx-n">on</span> <span class="mx-t">${label(a.effect && a.effect.target)}</span></div>
            <div class="mx-n">duration ${ms(t.duration)} · delay ${ms(t.delay || 0)} · easing ${t.easing} · iterations ${iters} · ${a.playState}</div>
            <div class="mx-bar" title="time elapsed"><i style="width:${(pct * 100).toFixed(1)}%"></i></div>
            <div class="mx-n">eased progress ${eased}</div>
          </div>`;
        }).join('');
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  window.motionXray = {
    open: () => toggle(true),
    close: () => toggle(false),
    zone(margin) { lastMargin = margin; zoneFrom(margin); }
  };
})();
