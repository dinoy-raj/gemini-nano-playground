// Recreation of the Nano Prompt Ground Compose UI (Material 3 dark, purple seed) in HTML.
// All app measurements are in dp and mirror the composables in app/src/main/java/.../ground/ui.

const C = {
  background: '#141218',
  surface: '#141218',
  surfaceContainer: '#211F26',
  surfaceContainerHigh: '#2B2930',
  surfaceContainerHighest: '#36343B',
  surfaceVariant: '#49454F',
  onSurface: '#E6E0E9',
  onSurfaceVariant: '#CAC4D0',
  primary: '#D0BCFF',
  onPrimary: '#381E72',
  secondary: '#CCC2DC',
};

// ---------------------------------------------------------------- Material shapes (approximations)
function polarPath(fn, steps = 360) {
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const r = fn(t);
    const x = 50 + r * Math.cos(t - Math.PI / 2);
    const y = 50 + r * Math.sin(t - Math.PI / 2);
    d += (i ? 'L' : 'M') + x.toFixed(2) + ' ' + y.toFixed(2);
  }
  return d + 'Z';
}
const SHAPES = {
  cookie4: polarPath(t => 50 * (1 - 0.14 * (0.5 - 0.5 * Math.cos(4 * t)))),
  cookie6: polarPath(t => 50 * (1 - 0.12 * (0.5 - 0.5 * Math.cos(6 * t)))),
  cookie9: polarPath(t => 50 * (1 - 0.10 * (0.5 - 0.5 * Math.cos(9 * t)))),
  verySunny: polarPath(t => 50 * (1 - 0.2 * Math.pow(0.5 - 0.5 * Math.cos(8 * t), 0.8))),
  softBurst: polarPath(t => 50 * (1 - 0.16 * Math.pow(0.5 - 0.5 * Math.cos(10 * t), 1.2))),
  ghostish: polarPath(t => 50 * (0.9 + 0.08 * Math.cos(2 * t + 0.6) + 0.04 * Math.cos(3 * t + 1.3) - 0.03 * Math.cos(5 * t))),
  gem: polarPath(t => {
    const n = 6, a = ((t % (2 * Math.PI / n)) - Math.PI / n);
    return 48 * Math.cos(Math.PI / n) / Math.cos(a) * (1 - 0.06 * Math.pow(Math.cos(a * n / 2), 6));
  }),
  sparkle4: 'M50 0C53 30 70 47 100 50C70 53 53 70 50 100C47 70 30 53 0 50C30 47 47 30 50 0Z',
};
function shape(name, color, extra = '') {
  if (name === 'slanted') return `<svg class="shape" viewBox="0 0 100 100" preserveAspectRatio="none" ${extra}><rect x="14" y="8" width="72" height="84" rx="22" fill="${color}" transform="skewX(-12) translate(10 0)"/></svg>`;
  return `<svg class="shape" viewBox="0 0 100 100" preserveAspectRatio="none" ${extra}><path d="${SHAPES[name]}" fill="${color}"/></svg>`;
}
const icon = (name, size, color, extra = '') =>
  `<span class="ms" style="font-size:${size}px;color:${color};${extra}">${name}</span>`;

// ---------------------------------------------------------------- status / nav bars
function statusBar(dp, opts = {}) {
  const right = opts.airplane
    ? icon('airplanemode_active', 15 * dp, C.onSurface) + icon('battery_full', 16 * dp, C.onSurface, 'transform:rotate(90deg)')
    : icon('signal_cellular_alt', 15 * dp, C.onSurface) + icon('wifi', 15 * dp, C.onSurface) + icon('battery_full', 16 * dp, C.onSurface, 'transform:rotate(90deg)');
  return `<div class="sb" style="height:${36 * dp}px;padding:0 ${22 * dp}px;font-size:${14 * dp}px">
    <span style="font-weight:500">9:41</span>
    <span style="display:flex;gap:${4 * dp}px;align-items:center">${right}</span></div>`;
}
const navBar = dp => `<div class="nav" style="height:${24 * dp}px"><i style="width:${108 * dp}px;height:${4 * dp}px"></i></div>`;

// ---------------------------------------------------------------- app sections
function headerInfoBar(dp, version) {
  return `<div class="row" style="background:${C.surfaceContainer};border-radius:${40 * dp}px;padding:${12 * dp}px ${16 * dp}px">
    <div class="box" style="width:${34 * dp}px;height:${34 * dp}px">${shape('cookie6', C.onPrimary)}${icon('auto_awesome', 11 * dp, C.primary)}</div>
    <div style="width:${16 * dp}px"></div>
    <span style="color:${C.secondary};font-size:${12 * dp}px">Gemini ${version}</span>
    <div style="flex:1"></div>
    <div class="box" style="width:${28 * dp}px;height:${28 * dp}px;background:${C.onSurfaceVariant};border-radius:50%">${icon('bug_report', 12 * dp, C.surface)}</div>
  </div>`;
}

function responseBox(dp, s) {
  let inner;
  if (s.inferencing) {
    inner = `<div class="box" style="position:absolute;inset:0"><div class="box spin" style="width:${48 * dp}px;height:${48 * dp}px">${shape('softBurst', C.primary)}</div></div>`;
  } else if (!s.response) {
    inner = `<div class="box" style="position:absolute;inset:0;color:${C.onSurface}">.</div>`;
  } else {
    const stats = s.stats
      ? `<div class="stats" style="margin-top:${16 * dp}px;gap:${8 * dp}px;font-size:${10 * dp}px;color:${C.primary}">
          <span>${s.stats[0]} ms</span><span>|</span><span>${s.stats[1]} tokens</span><span>|</span><span>Finish Reason: ${s.stats[2]}</span></div>`
      : '';
    inner = `<div class="resp" style="position:absolute;inset:0 ${24 * dp}px;padding-top:${32 * dp}px">
        <div class="md" style="padding:${4 * dp}px;font-size:${16 * dp}px;line-height:${24 * dp}px;color:${C.onSurface};--dp:${dp}px">${s.response}</div>${stats}
      </div>
      <div style="position:absolute;left:0;right:0;bottom:0;height:${100 * dp}px;background:linear-gradient(transparent,${C.surfaceContainer}80,${C.surfaceContainer})"></div>
      <div class="box" style="position:absolute;bottom:${16 * dp}px;left:50%;transform:translateX(-50%);width:${68 * dp}px;height:${68 * dp}px;border-radius:${36 * dp}px;background:${C.surface}80">${icon('copy_all', 20 * dp, C.onSurfaceVariant)}</div>`;
  }
  return `<div style="position:relative;flex:1;background:${C.surfaceContainer};border-radius:${(s.inferencing ? 56 : 36) * dp}px;overflow:hidden">${inner}</div>`;
}

function chatOptions(dp, s) {
  const count = String(s.count ?? 0);
  const active = s.inferencing;
  const col = active ? C.onSurface : C.onSurfaceVariant;
  const w = active ? 700 : 400;
  return `<div class="row" style="height:${100 * dp}px;gap:${4 * dp}px">
    <div class="box" style="margin:${8 * dp}px;width:${90 * dp}px;height:${84 * dp}px">
      <div style="position:absolute;inset:0;transform:rotate(${s.count % 2 ? 90 : 0}deg)">${shape('cookie4', C.surfaceContainerHigh)}</div>
      <span style="position:relative;color:${col};font-weight:${w};font-size:${13 * dp}px">${count}<span style="font-size:${8 * dp}px">s</span></span>
    </div>
    <div class="box" style="margin:${8 * dp}px;flex:1;height:${84 * dp}px;background:${C.surfaceContainerHigh};border-radius:${24 * dp}px">${icon('gesture', 20 * dp, C.onSurfaceVariant)}</div>
    <div class="box" style="margin:${8 * dp}px;width:${90 * dp}px;height:${84 * dp}px">${shape('ghostish', C.surfaceContainerHigh)}${icon('cleaning_services', 20 * dp, C.onSurfaceVariant)}</div>
  </div>`;
}

function actionButton(dp, size, shapeName, color, iconName) {
  return `<div class="box" style="margin:${8 * dp}px;width:${size * dp}px;height:${size * dp}px">${shape(shapeName, color)}${icon(iconName, (size / 3) * dp, C.surface)}</div>`;
}

function queryField(dp, s, expanded) {
  const outline = `background:${C.surfaceContainerHighest};border:${1 * dp}px solid ${C.onSurfaceVariant}99;border-radius:${36 * dp}px`;
  if (!expanded) {
    const text = s.query
      ? `<span style="color:${C.onSurface};font-size:${10 * dp}px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${s.query}</span>`
      : `<span style="color:${C.onSurfaceVariant};font-size:${10 * dp}px;font-weight:500">Type your prompt .....</span>`;
    return `<div style="flex:${s.fieldWeight};margin:${8 * dp}px;${outline};display:flex;align-items:center;min-height:0">
      <div style="flex:3;padding:0 ${16 * dp}px 0 ${32 * dp}px;overflow:hidden;display:flex">${text}</div>
      <div class="box" style="flex:1">${actionButton(dp, 50, 'verySunny', C.onSurfaceVariant, 'auto_awesome')}</div>
    </div>`;
  }
  return `<div style="flex:1;margin:${8 * dp}px;${outline};display:flex;flex-direction:column;min-height:0">
    <div style="flex:2;display:flex;align-items:center;padding:${8 * dp}px ${24 * dp}px">
      <div style="color:${C.onSurface};font-size:${20 * dp}px;line-height:${30 * dp}px;font-weight:700">${s.query}<span class="caret" style="height:${26 * dp}px;width:${2 * dp}px;background:${C.primary}"></span></div>
    </div>
    <div class="row" style="flex:1;justify-content:center">
      ${actionButton(dp, 48, 'slanted', C.onSurfaceVariant, 'content_paste_go')}
      <div style="width:${16 * dp}px"></div>
      ${actionButton(dp, 120, 'verySunny', C.onSurface, 'auto_awesome')}
      <div style="width:${16 * dp}px"></div>
      ${actionButton(dp, 48, 'gem', C.onSurfaceVariant, 'cleaning_services')}
    </div>
  </div>`;
}

function chatScreen(dp, s) {
  if (s.expanded) {
    return `<div class="col" style="flex:1;padding:${16 * dp}px;min-height:0">
      ${chatOptions(dp, s)}
      ${queryField(dp, s, true)}
    </div>`;
  }
  return `<div class="col" style="flex:1;padding:${16 * dp}px;min-height:0">
    <div class="col" style="flex:8;padding:0 ${8 * dp}px ${8 * dp}px;gap:${16 * dp}px;min-height:0">
      ${headerInfoBar(dp, s.version || 'nano-v3')}
      ${responseBox(dp, s)}
    </div>
    ${chatOptions(dp, s)}
    ${queryField(dp, { ...s, fieldWeight: 1.3 }, false)}
  </div>`;
}

function infoScreen(dp, s) {
  return `<div class="col" style="flex:1;align-items:center;padding-top:${24 * dp}px">
    <div class="box" style="width:${230 * dp}px;height:${230 * dp}px">${shape('cookie9', C.onPrimary)}
      <div class="col" style="position:relative;align-items:center;gap:${16 * dp}px">${icon('auto_awesome', 36 * dp, C.primary)}
      <div style="color:${C.primary};font-size:${20 * dp}px;font-weight:700;text-align:center;line-height:1.3">Gemini<br>${s.version || 'nano-v3'}</div></div>
    </div>
    <div style="height:${24 * dp}px"></div>
    <div class="row" style="align-self:stretch;justify-content:center;margin:0 ${32 * dp}px;padding:${12 * dp}px;border:${1 * dp}px solid ${C.surfaceVariant};border-radius:${16 * dp}px;gap:${12 * dp}px">
      ${icon('auto_awesome', 16 * dp, C.primary)}<span style="color:${C.primary};font-size:${12 * dp}px;font-weight:500">Leave a Review On Play Store</span>${icon('auto_awesome', 16 * dp, C.primary)}
    </div>
    <div style="height:${64 * dp}px"></div>
    <div style="color:#888;font-size:${12 * dp}px;font-weight:500">Build by&nbsp; <u style="color:#fff">Dinoy Raj</u>.</div>
    <div style="color:#888;font-size:${10 * dp}px;margin-top:${4 * dp}px">version 1.0.5</div>
  </div>`;
}

function clearCacheDialog(dp) {
  return `<div class="box" style="position:absolute;inset:0;background:#0009;z-index:5">
    <div class="col" style="width:${312 * dp}px;background:${C.surfaceContainerHigh};border-radius:${28 * dp}px;padding:${24 * dp}px;align-items:center">
      ${icon('auto_awesome_motion', 24 * dp, C.secondary)}
      <div style="color:${C.onSurface};font-size:${24 * dp}px;line-height:${32 * dp}px;margin-top:${16 * dp}px;text-align:center">Clear Nano LRU Cache?</div>
      <div style="color:${C.onSurfaceVariant};font-size:${14 * dp}px;line-height:${20 * dp}px;margin-top:${16 * dp}px">Nano stores your least recently used static prompts. Would you like to clear this cache now?</div>
      <div class="row" style="align-self:stretch;justify-content:flex-end;gap:${8 * dp}px;margin-top:${24 * dp}px;color:${C.primary};font-size:${14 * dp}px;font-weight:500">
        <span style="padding:${10 * dp}px ${12 * dp}px">Cancel</span><span style="padding:${10 * dp}px ${12 * dp}px">Clear</span></div>
    </div></div>`;
}

function downloadingScreen(dp, s) {
  const pct = s.progress ?? 0.64;
  let wave = '';
  const w = 300, amp = 3;
  for (let x = 0; x <= w * pct; x += 2) wave += (x ? 'L' : 'M') + x + ' ' + (6 + amp * Math.sin(x / 20 * Math.PI * 2 / 2)).toFixed(2);
  return `<div class="col" style="flex:1;justify-content:center;align-items:center;padding:${24 * dp}px">
    <svg viewBox="0 0 300 12" style="width:100%;height:${12 * dp}px" preserveAspectRatio="none">
      <line x1="${w * pct + 8}" y1="6" x2="300" y2="6" stroke="${C.surfaceContainerHighest}" stroke-width="4" stroke-linecap="round"/>
      <path d="${wave}" fill="none" stroke="${C.primary}" stroke-width="4" stroke-linecap="round"/></svg>
    <div style="height:${36 * dp}px"></div>
    <div style="color:${C.onSurfaceVariant};font-size:${14 * dp}px;line-height:${28 * dp}px">Downloading Gemini Nano …</div>
    <div style="color:${C.onSurfaceVariant}b3;font-size:${12 * dp}px">${Math.round(pct * 100)}%</div>
  </div>`;
}

// Full app screen (status bar + content + gesture bar) sized w x h dp, rendered at `dp` px per dp.
function appScreen(s, wDp, hDp, dp, opts = {}) {
  let body;
  if (s.screen === 'info') body = infoScreen(dp, s);
  else if (s.screen === 'download') body = downloadingScreen(dp, s);
  else body = chatScreen(dp, s);
  const bars = opts.noBars !== true;
  return `<div class="app" style="width:${wDp * dp}px;height:${hDp * dp}px;background:${C.background}">
    ${bars ? statusBar(dp, s) : ''}${body}${bars ? navBar(dp) : ''}${s.dialog ? clearCacheDialog(dp) : ''}</div>`;
}
