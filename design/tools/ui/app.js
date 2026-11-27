'use strict';
/* design-studio front end. No framework, no build step.
   Shell: sidebar (sections) + top bar (breadcrumb, global search, add, theme) + one view.
   Views: overview (dashboard) · gallery · graph · queue · candidates · inbox. */

const $ = (sel, root = document) => root.querySelector(sel);
const el = (tag, attrs = {}, kids = []) => {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') n.className = v;
    else if (k === 'text') n.textContent = v;
    else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
    else n.setAttribute(k, v === true ? '' : String(v));
  }
  for (const k of [].concat(kids)) if (k) n.appendChild(typeof k === 'string' ? document.createTextNode(k) : k);
  return n;
};
const frag = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; };

/* ---------- icons: one line family, 1.7 stroke (F.ICON.line) ---------- */

const ICONS = {
  overview: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>',
  gallery: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>',
  graph: '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="8" r="2.5"/><circle cx="9" cy="18" r="2.5"/><path d="M8.4 6.5l7.2 1M6.7 8.4l1.6 7.2M16.4 10l-5.7 6.1"/>',
  queue: '<path d="M4 6h11M4 12h11M4 18h6"/><path d="M14.5 17.5l2.2 2.2 4.3-4.6"/>',
  candidates: '<path d="M9.5 18h5M10.5 21h3"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.1v.1h5v-.1c0-.8.4-1.6 1.1-2.1A6 6 0 0 0 12 3z"/>',
  inbox: '<path d="M3 13.5L5.8 5h12.4l2.8 8.5V19a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M3 13.5h5l1 2.5h6l1-2.5h5"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
  upload: '<path d="M12 15V4M7.5 8.5L12 4l4.5 4.5"/><path d="M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M2.5 12h2M19.5 12h2M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  chevron: '<path d="M9.5 6l6 6-6 6"/>',
  chevronL: '<path d="M14.5 6l-6 6 6 6"/>',
  back: '<path d="M19 12H5.5M11 6l-6 6 6 6"/>',
  close: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
  arrow: '<path d="M7 17L17 7M8.5 7H17v8.5"/>',
  logout: '<path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4"/><path d="M9.5 16.5L5 12l4.5-4.5M5 12h10"/>',
  filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
  folder: '<path d="M3.5 7a2 2 0 0 1 2-2h4l2 2.5h7a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/>',
  heart: '<path d="M12 19.5s-7.5-4.5-7.5-10A4.2 4.2 0 0 1 12 7a4.2 4.2 0 0 1 7.5 2.5c0 5.5-7.5 10-7.5 10z"/>',
  x: '<path d="M7 7l10 10M17 7L7 17"/>',
  refs: '<rect x="4" y="3.5" width="13" height="17" rx="2"/><path d="M20 7v11.5a2 2 0 0 1-2 2H8"/><path d="M7.5 8h6M7.5 12h6"/>',
  check: '<circle cx="12" cy="12" r="8.5"/><path d="M8.3 12.2l2.6 2.6 4.8-5.3"/>',
  rtl: '<path d="M20 6H8M20 12H4M20 18H10"/><path d="M7 15l-3 3 3 3"/>',
  photo: '<rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="M3.5 4l17 16"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  fit: '<path d="M4 9V5a1 1 0 0 1 1-1h4M15 4h4a1 1 0 0 1 1 1v4M20 15v4a1 1 0 0 1-1 1h-4M9 20H5a1 1 0 0 1-1-1v-4"/>',
  reset: '<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3L4.5 9"/><path d="M4.5 4.5V9H9"/>',
  refresh: '<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3L19.5 9"/><path d="M19.5 4.5V9H15"/>',
};
const icon = (name) => frag(`<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ''}</svg>`);
const hydrateIcons = (root = document) => {
  for (const i of root.querySelectorAll('i[data-icon]')) i.replaceWith(icon(i.dataset.icon));
};

/* ---------- concept identity: colour + shape (shape is the secondary encoding) ---------- */

const CONCEPTS = ['web', 'mobile', 'component', 'slide', 'imagery', 'mockup'];
const SHAPE = { web: 'circle', mobile: 'square', component: 'diamond', slide: 'triangle', imagery: 'tri-down', mockup: 'hexagon', none: 'circle' };
const SHAPE_PTS = {
  square: [[-0.86, -0.86], [0.86, -0.86], [0.86, 0.86], [-0.86, 0.86]],
  diamond: [[0, -1.18], [1.18, 0], [0, 1.18], [-1.18, 0]],
  triangle: [[0, -1.2], [1.12, 0.78], [-1.12, 0.78]],
  'tri-down': [[0, 1.2], [1.12, -0.78], [-1.12, -0.78]],
  hexagon: [0, 1, 2, 3, 4, 5].map((k) => [Math.cos(Math.PI / 6 + k * Math.PI / 3) * 1.08, Math.sin(Math.PI / 6 + k * Math.PI / 3) * 1.08]),
};
const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
const conceptColour = (c) => cssVar('--c-' + (CONCEPTS.includes(c) ? c : 'none'));
/** A 12px legend glyph in the concept's colour and shape. Colour comes from CSS, so it follows the theme. */
function shapeGlyph(c) {
  const s = SHAPE[CONCEPTS.includes(c) ? c : 'none'];
  const fill = `var(--c-${CONCEPTS.includes(c) ? c : 'none'})`;
  const body = s === 'circle'
    ? `<circle cx="6" cy="6" r="5" fill="${fill}"/>`
    : `<polygon fill="${fill}" points="${SHAPE_PTS[s].map(([x, y]) => `${(6 + x * 4.6).toFixed(2)},${(6 + y * 4.6).toFixed(2)}`).join(' ')}"/>`;
  return frag(`<svg class="shape" viewBox="0 0 12 12" aria-hidden="true">${body}</svg>`);
}

/* ---------- api, toast, images ---------- */

const api = async (p, opts = {}) => {
  // X-Studio forces a CORS preflight on writes, which the server refuses for other origins.
  const r = await fetch(p, { ...opts, headers: { ...(opts.headers || {}), 'X-Studio': '1' } });
  if (r.status === 401) { location.href = '/login'; throw new Error('sign in required'); }
  const body = await r.json().catch(() => ({ error: `${r.status} ${r.statusText}` }));
  if (!r.ok || body.error) throw new Error(body.error || `${r.status}`);
  return body;
};

function toast(msg, bad) {
  const t = el('div', { class: 'toast' + (bad ? ' bad' : ''), role: bad ? 'alert' : 'status', text: msg });
  document.body.appendChild(t);
  setTimeout(() => t.remove(), bad ? 6000 : 2600);
}

/**
 * A reference image that is not in this copy of the library (for example a
 * screenshot that was never synced into it) shows a hatched placeholder instead of
 * the browser's broken-image icon. The error listener is attached before src, so a
 * cached 404 still reaches it.
 */
const shotImg = (src, alt, cls) => el('img', {
  onerror: (e) => e.target.replaceWith(el('div', { class: 'shot-missing', text: 'Image not in this copy' })),
  src, alt: alt || '', loading: 'lazy', ...(cls ? { class: cls } : {}),
});
const thumb = (r, cls = '') => el('div', { class: 'thumb ' + cls }, [r && r.image ? shotImg('/img/' + r.image, '') : el('div', { class: 'shot-missing' })]);

/* ---------- state ---------- */

const VIEWS = { overview: 'Overview', gallery: 'Gallery', graph: 'Graph', queue: 'Queue', candidates: 'Candidates', inbox: 'Inbox', ref: 'Reference' };

/** #gallery -> {view:'gallery'}; #ref/REF-0032 -> {view:'ref', id:'REF-0032'}; anything else -> overview. */
function parseHash() {
  let h = location.hash.slice(1);
  try { h = decodeURIComponent(h); } catch { /* keep raw */ }
  const m = h.match(/^ref\/(.+)$/);
  if (m) return { view: 'ref', id: m[1] };
  return { view: VIEWS[h] && h !== 'ref' ? h : 'overview' };
}
const START = parseHash();

const S = {
  view: START.view,
  refId: START.id || null,     // the reference the ref page shows
  lastRef: null,               // highlighted in the gallery after coming back from a page
  galleryScroll: 0,
  restoreGallery: false,
  overview: null,
  refs: [],
  detail: null,
  filters: { concept: new Set(), archetype: new Set(), verdict: new Set(), kind: new Set(), imagery_dep: new Set(), rtl: new Set(), cost: new Set(), status: new Set(), reaction: new Set(), term: new Set() },
  search: '',
  railOpen: false,
};

const FILTER_FIELDS = [
  ['concept', 'Concept'], ['archetype', 'Archetype'], ['verdict', 'Verdict'], ['kind', 'Kind'],
  ['imagery_dep', 'Survives without photo'], ['rtl', 'RTL'], ['cost', 'Cost'],
  ['status', 'Review'], ['reaction', 'My reaction'],
];
const DEP_LABEL = { none: 'yes — no imagery', soft: 'photo is decoration', hard: 'no — collapses' };

/** Facet term id -> display name, from the taxonomy the server already sends. */
let TERM_NAME = new Map();
function indexTerms() {
  TERM_NAME = new Map();
  for (const f of (S.overview && S.overview.facets) || []) {
    for (const d of f.dimensions) for (const t of d.terms) TERM_NAME.set(t.id, t.name);
  }
}
const termName = (id) => TERM_NAME.get(id) || id;

const fieldVals = (r, field) => (field === 'archetype' ? r.archetype
  : field === 'reaction' ? [r.sam_reaction || 'none'] : [r[field]]);

function valuesOf(field) {
  const tally = new Map();
  for (const r of S.refs) {
    for (const v of fieldVals(r, field)) {
      if (!v) continue;
      tally.set(v, (tally.get(v) || 0) + 1);
    }
  }
  const out = [...tally.entries()];
  if (field === 'concept') return out.sort((a, b) => CONCEPTS.indexOf(a[0]) - CONCEPTS.indexOf(b[0]));
  return out.sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])));
}

function matches(r) {
  for (const [field] of FILTER_FIELDS) {
    const want = S.filters[field];
    if (!want.size) continue;
    if (!fieldVals(r, field).some((v) => want.has(v))) return false;
  }
  if (S.filters.term.size && ![...S.filters.term].every((t) => r.facets.includes(t) || r.archetype.includes(t))) return false;
  if (S.search) {
    const q = S.search.toLowerCase();
    const hay = [r.id, r.title, r.source, r.concept, ...r.facets, ...r.archetype, ...r.archetype.map(termName)].join(' ').toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}
const filtered = () => S.refs.filter(matches);
const anyFilter = () => S.search || Object.values(S.filters).some((s) => s.size);
function clearFilters() { for (const k of Object.keys(S.filters)) S.filters[k].clear(); S.search = ''; $('#q').value = ''; }

/** Jump to the gallery showing exactly one filter value. */
function showIn(field, value) {
  clearFilters();
  S.filters[field].add(value);
  setView('gallery');
}

/* ---------- chrome ---------- */

function renderChrome() {
  const c = S.overview ? S.overview.counts : {};
  $('#count-queue').textContent = c.unreviewed ? String(c.unreviewed) : '';
  $('#count-inbox').textContent = c.inbox ? String(c.inbox) : '';
  $('#ref-total').textContent = c.refs !== undefined ? `${c.refs} refs` : '';
  const root = S.overview ? S.overview.root : '';
  const tail = root.split(/[/\\]/).filter(Boolean).slice(-2).join('/');
  $('#root').textContent = tail ? '…/' + tail : '—';
  $('#root').title = root;
  const crumbs = S.view === 'ref'
    ? [el('button', { class: 'crumb-link', onclick: backToGallery, text: 'Gallery' }), el('span', { class: 'sep' }, [icon('chevron')]), el('b', { text: S.refId })]
    : [el('b', { text: VIEWS[S.view] })];
  $('.crumbs').replaceChildren(el('span', { class: 'root', text: 'Studio' }), el('span', { class: 'sep' }, [icon('chevron')]), ...crumbs);
  const navView = S.view === 'ref' ? 'gallery' : S.view;
  for (const b of document.querySelectorAll('#nav button')) b.setAttribute('aria-current', String(b.dataset.view === navView));
  document.title = S.view === 'ref' ? `${S.refId} · Design Studio` : `${VIEWS[S.view]} · Design Studio`;
}

function setView(v, fromHistory) {
  S.view = v;
  S.railOpen = false;
  document.body.classList.remove('nav-open');
  if (!fromHistory) pushHash('#' + v);
  render();                       // paint immediately so the section feels instant
  // The library changes on disk underneath us — a record written since page load would
  // otherwise show in Graph (which fetches per open) but not in Gallery (which read the
  // cached list once). Re-read, then repaint if we are still on the same view.
  // The graph is skipped: it fetches its own data and a repaint would re-solve the layout.
  loadAll().then(() => { if (S.view === v && v !== 'graph') render(); else renderChrome(); });
}

function syncOverlay() {
  document.body.classList.toggle('overlay', S.view === 'gallery' && S.railOpen && window.innerWidth <= 1020);
}
function closeOverlays() {
  document.body.classList.remove('nav-open');
  if (S.railOpen) { S.railOpen = false; render(); }
}

/* ---------- overview ---------- */

/** Semicircle meter (REF-0032's gauge): dashed outer guide, soft track, ink arc + knob. */
function gauge(ratio, value, unit, label) {
  const p = Math.max(0, Math.min(1, ratio || 0));
  const R = 86, cx = 110, cy = 112;
  const th = Math.PI - p * Math.PI;
  const kx = (cx + R * Math.cos(th)).toFixed(1), ky = (cy - R * Math.sin(th)).toFixed(1);
  const arc = `M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`;
  const svg = frag(`<svg viewBox="0 0 220 124" role="img" aria-label="${label}">
    <path class="outer" d="M 8 ${cy} A 102 102 0 0 1 212 ${cy}" fill="none" stroke-width="1" stroke-dasharray="1.5 5"/>
    <circle class="end" cx="8" cy="${cy}" r="2.5"/><circle class="end" cx="212" cy="${cy}" r="2.5"/>
    <path class="track" d="${arc}" fill="none" stroke-width="14" stroke-linecap="round"/>
    ${p > 0 ? `<path class="val" d="${arc}" fill="none" stroke-width="14" stroke-linecap="round" pathLength="100" stroke-dasharray="${(p * 100).toFixed(2)} 200"/>` : ''}
    <circle class="knob" cx="${kx}" cy="${ky}" r="6.5" stroke-width="3"/>
  </svg>`);
  return el('div', { class: 'gauge' }, [svg, el('div', { class: 'gauge-num' }, [String(value), unit ? el('small', { text: unit }) : null])]);
}

function kpiTile({ label, sub, ico, ratio, value, unit, aria, go }) {
  return el('section', { class: 'tile kpi' }, [
    el('div', { class: 'tile-head' }, [
      el('div', {}, [el('h2', { text: label }), el('p', { text: sub })]),
      el('button', { class: 'icon-btn sm', title: `Show ${label.toLowerCase()}`, 'aria-label': `Show ${label.toLowerCase()} in the gallery`, onclick: go }, [icon(ico)]),
    ]),
    gauge(ratio, value, unit, aria),
  ]);
}

function niceScale(max) {
  for (const s of [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 5000]) {
    if (max / s <= 4) return { step: s, top: Math.max(s, Math.ceil(max / s) * s) };
  }
  return { step: max / 4, top: max };
}

/** Single-series column chart: one ink, hatched hover band, tooltip, click to filter. */
function columnChart(rows, onPick) {
  const total = rows.reduce((s, r) => s + r.v, 0) || 1;
  const { step, top } = niceScale(Math.max(1, ...rows.map((r) => r.v)));
  const ticks = [];
  for (let t = 0; t <= top; t += step) ticks.push(t);
  const tip = el('div', { class: 'tip', hidden: true });
  const show = (r, i) => {
    tip.textContent = `${r.label} · ${r.v} ref${r.v === 1 ? '' : 's'} · ${Math.round((r.v / total) * 100)}%`;
    tip.style.left = ((i + 0.5) / rows.length) * 100 + '%';
    tip.style.top = (1 - r.v / top) * 100 + '%';
    tip.hidden = false;
  };
  const hide = () => { tip.hidden = true; };
  return el('div', { class: 'colchart' }, [
    el('div', { class: 'yaxis', 'aria-hidden': 'true' }, ticks.map((t) => el('span', { style: `bottom:${(t / top) * 100}%`, text: String(t) }))),
    el('div', { class: 'plot' }, [
      ...ticks.slice(1).map((t) => el('div', { class: 'gl', style: `bottom:${(t / top) * 100}%` })),
      el('div', { class: 'cols' }, rows.map((r, i) => el('button', {
        class: 'col', 'aria-label': `${r.label}: ${r.v} references. Show them.`,
        onmouseenter: () => show(r, i), onfocus: () => show(r, i), onmouseleave: hide, onblur: hide,
        onclick: () => onPick(r),
      }, [el('div', { class: 'bar', style: `height:${(r.v / top) * 100}%` })]))),
      tip,
    ]),
    el('div', { class: 'xaxis', 'aria-hidden': 'true' }, rows.map((r) => el('span', {}, [r.glyph || null, r.label]))),
  ]);
}

function overviewView() {
  const R = S.refs, n = R.length;
  if (!n) {
    return el('div', { class: 'dash' }, [el('div', { class: 'empty' }, [
      el('b', { text: 'The library is empty' }),
      el('div', { text: 'Paste a screenshot with Ctrl+V or drop image files anywhere on this window. They land in the inbox; run the analysis from there.' }),
      el('button', { class: 'btn primary', onclick: () => setView('inbox') }, [icon('inbox'), 'Open the inbox']),
    ])]);
  }
  const count = (f) => R.filter(f).length;
  const reviewed = count((r) => r.status !== 'unreviewed');
  const liked = count((r) => r.sam_reaction === 'like');
  const reacted = count((r) => r.sam_reaction);
  const rtlClean = count((r) => r.rtl === 'clean');
  const rtlRisky = count((r) => r.rtl === 'risky');
  const noPhoto = count((r) => r.imagery_dep === 'none');
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);

  const kpis = [
    kpiTile({
      label: 'References', sub: `${reviewed} reviewed · ${n - reviewed} waiting`, ico: 'refs',
      ratio: reviewed / n, value: n, aria: `Reviewed ${pct(reviewed, n)} percent of ${n} references.`, go: () => setView('gallery'),
    }),
    kpiTile({
      label: 'Liked', sub: reacted ? `${liked} of ${reacted} reactions` : 'No reactions yet', ico: 'heart',
      ratio: reacted ? liked / reacted : 0, value: liked, aria: `${liked} liked out of ${reacted} reactions.`, go: () => showIn('reaction', 'like'),
    }),
    kpiTile({
      label: 'RTL-clean', sub: `${rtlClean} clean · ${rtlRisky} risky`, ico: 'rtl',
      ratio: rtlClean / n, value: pct(rtlClean, n), unit: '%', aria: `${pct(rtlClean, n)} percent survive right-to-left cleanly.`, go: () => showIn('rtl', 'clean'),
    }),
    kpiTile({
      label: 'Stands without photo', sub: `${noPhoto} need no imagery`, ico: 'photo',
      ratio: noPhoto / n, value: pct(noPhoto, n), unit: '%', aria: `${pct(noPhoto, n)} percent work with no imagery.`, go: () => showIn('imagery_dep', 'none'),
    }),
  ];

  // concept mix
  const cRows = CONCEPTS.map((c) => ({ key: c, label: c[0].toUpperCase() + c.slice(1), v: count((r) => r.concept === c), glyph: shapeGlyph(c) }));
  const conceptTile = el('section', { class: 'tile span-7' }, [
    el('div', { class: 'tile-head' }, [
      el('div', {}, [el('h2', { text: 'Library by concept' }), el('p', { text: 'What each image depicts — select a column to open those references' })]),
      el('button', { class: 'icon-btn sm', title: 'Open the graph', 'aria-label': 'Open the graph', onclick: () => setView('graph') }, [icon('arrow')]),
    ]),
    columnChart(cRows, (r) => showIn('concept', r.key)),
  ]);

  // archetypes
  const aTally = new Map();
  for (const r of R) for (const a of r.archetype) aTally.set(a, (aTally.get(a) || 0) + 1);
  const aTop = [...aTally.entries()].sort((a, b) => b[1] - a[1]).slice(0, 7);
  const aMax = aTop.length ? aTop[0][1] : 1;
  const archTile = el('section', { class: 'tile span-5' }, [
    el('div', { class: 'tile-head' }, [
      el('div', {}, [el('h2', { text: 'Top archetypes' }), el('p', { text: `The screens you collect most · ${aTally.size} in use` })]),
    ]),
    el('div', { class: 'hbars' }, aTop.map(([id, v]) => el('button', {
      class: 'hbar', title: id, onclick: () => showIn('archetype', id), 'aria-label': `${termName(id)}: ${v} references`,
    }, [
      el('span', { class: 'nm' }, [termName(id), el('code', { text: id })]),
      el('span', { class: 'v', text: String(v) }),
      el('span', { class: 'trk hatch' }, [el('i', { style: `width:${(v / aMax) * 100}%` })]),
    ]))),
  ]);

  // review table
  const pending = R.filter((r) => r.status === 'unreviewed').sort((a, b) => String(b.id).localeCompare(String(a.id))).slice(0, 6);
  const tableTile = el('section', { class: 'tile span-7' }, [
    el('div', { class: 'tile-head' }, [
      el('div', {}, [el('h2', { text: 'Up for review' }), el('p', { text: pending.length ? 'Newest analysed references with no reaction yet' : 'Every reference has a reaction' })]),
      pending.length ? el('button', { class: 'btn sm', style: 'margin-left:auto', onclick: () => setView('queue') }, ['View all', icon('arrow')]) : null,
    ]),
    pending.length ? el('table', { class: 'tbl' }, [
      el('thead', {}, [el('tr', {}, [
        el('th', { text: 'Reference' }), el('th', { class: 'hide-sm', text: 'ID' }), el('th', { class: 'hide-sm', text: 'Concept' }),
        el('th', { text: 'Verdict' }), el('th', { class: 'hide-sm', text: 'Confidence' }),
      ])]),
      el('tbody', {}, pending.map((r) => el('tr', {
        class: 'row', tabindex: '0',
        onclick: () => openRef(r.id),
        onkeydown: (e) => { if (e.key === 'Enter') openRef(r.id); },
      }, [
        el('td', {}, [el('div', { class: 'ttl' }, [thumb(r), el('span', { text: r.title || r.id })])]),
        el('td', { class: 'id hide-sm', text: r.id }),
        el('td', { class: 'cap hide-sm' }, [el('span', { style: 'display:inline-flex;align-items:center;gap:6px' }, [shapeGlyph(r.concept), r.concept || '—'])]),
        el('td', {}, [r.verdict ? el('span', { class: 'pill ' + r.verdict, text: r.verdict }) : '—']),
        el('td', { class: 'cap hide-sm', text: r.confidence || '—' }),
      ]))),
    ]) : el('div', { class: 'note', text: 'Nothing waiting. New images go through the inbox.' }),
  ]);

  // liked
  const likedRefs = R.filter((r) => r.sam_reaction === 'like').slice(0, 6);
  const likedTile = el('section', { class: 'tile span-5' }, [
    el('div', { class: 'tile-head' }, [
      el('div', {}, [el('h2', { text: 'Liked' }), el('p', { text: 'Your recorded taste, newest first' })]),
      likedRefs.length ? el('button', { class: 'icon-btn sm', title: 'Show all liked', 'aria-label': 'Show all liked references', onclick: () => showIn('reaction', 'like') }, [icon('arrow')]) : null,
    ]),
    likedRefs.length ? el('div', { class: 'plist' }, likedRefs.reverse().map((r) => el('button', { class: 'pitem', onclick: () => openRef(r.id) }, [
      thumb(r, 'lg'),
      el('span', { style: 'min-width:0' }, [
        el('div', { class: 'pt', text: r.title || r.id }),
        el('div', { class: 'ps', text: `${r.id} · ${termName(r.archetype[0] || '') || '—'}` }),
      ]),
      el('span', { class: 'pill', style: 'text-transform:capitalize' }, [shapeGlyph(r.concept), r.concept || '—']),
    ]))) : el('div', { class: 'note' }, [
      'No likes yet. React to references in the ',
      el('a', { href: '#queue', onclick: (e) => { e.preventDefault(); setView('queue'); } }, ['queue']), ' and they collect here.',
    ]),
  ]);

  return el('div', { class: 'dash' }, [el('div', { class: 'dash-grid' }, [...kpis, conceptTile, archTile, tableTile, likedTile])]);
}

/* ---------- gallery ---------- */

function chipLabel(field, v) {
  if (field === 'imagery_dep') return DEP_LABEL[v] || v;
  if (field === 'archetype') return termName(v);
  return String(v);
}

function railSection(title, field) {
  const vals = valuesOf(field);
  if (!vals.length) return null;
  return el('section', {}, [
    el('h3', { text: title }),
    el('div', { class: 'chips' }, vals.map(([v, n]) => el('button', {
      class: 'chip', title: field === 'archetype' ? v : null,
      style: field === 'concept' || field === 'reaction' || field === 'status' ? 'text-transform:capitalize' : null,
      'aria-pressed': String(S.filters[field].has(v)),
      onclick: () => {
        const set = S.filters[field];
        set.has(v) ? set.delete(v) : set.add(v);
        render();
      },
    }, [
      field === 'concept' ? shapeGlyph(v) : null,
      el('span', { text: chipLabel(field, v) }),
      el('span', { class: 'n', text: String(n) }),
    ]))),
  ]);
}

function rail() {
  return el('aside', { class: 'rail' + (S.railOpen ? ' open' : ''), 'aria-label': 'Filters' }, [
    el('div', { class: 'rail-close' }, [el('button', {
      class: 'icon-btn sm', 'aria-label': 'Close filters', onclick: () => { S.railOpen = false; render(); },
    }, [icon('close')])]),
    ...FILTER_FIELDS.map(([f, label]) => railSection(label, f)),
  ]);
}

function card(r, extra) {
  return el('article', {
    class: 'card', 'data-id': r.id, 'aria-current': S.lastRef === r.id ? 'true' : null, tabindex: '0',
    title: `Open ${r.id}`,
    onclick: () => openRef(r.id),
    onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openRef(r.id); } },
  }, [
    el('div', { class: 'shot' }, [r.image ? shotImg('/img/' + r.image, r.title) : el('div', { class: 'shot-missing', text: 'No image' })]),
    el('div', { class: 'meta' }, [
      el('div', { class: 't', text: r.title || r.id }),
      el('div', { class: 'sub' }, [shapeGlyph(r.concept), [r.id, r.concept].filter(Boolean).join(' · ')]),
      el('div', { class: 'badges' }, [
        r.verdict ? el('span', { class: 'pill ' + r.verdict, text: r.verdict }) : null,
        r.status === 'unreviewed' ? el('span', { class: 'pill unreviewed', text: 'to review' }) : null,
        r.sam_reaction === 'like' ? el('span', { class: 'pill like' }, [icon('heart'), 'liked']) : null,
        r.sam_reaction === 'dislike' ? el('span', { class: 'pill dislike', text: 'not for me' }) : null,
        r.kind && r.kind !== 'concept' ? el('span', { class: 'pill vio', text: r.kind }) : null,
        extra || null,
      ]),
    ]),
  ]);
}

function galleryMain() {
  const list = filtered();
  const terms = [...S.filters.term];
  const head = el('div', { class: 'page-head' }, [
    el('h1', { text: 'Gallery' }),
    el('span', { class: 'sub', text: list.length === S.refs.length ? `${S.refs.length} references` : `${list.length} of ${S.refs.length} references` }),
    terms.length ? el('div', { class: 'active-terms' }, terms.map((t) => el('button', {
      class: 'chip', 'aria-pressed': 'true', title: 'Remove this term filter',
      onclick: () => { S.filters.term.delete(t); render(); },
    }, [el('span', { text: t }), icon('x')]))) : null,
    el('div', { class: 'end' }, [
      el('button', { class: 'btn sm filters-btn', onclick: () => { S.railOpen = true; render(); } }, [icon('filter'), 'Filters']),
      anyFilter() ? el('button', { class: 'btn sm', onclick: () => { clearFilters(); render(); } }, ['Clear filters']) : null,
    ]),
  ]);
  let body;
  if (!S.refs.length) {
    body = el('div', { class: 'empty' }, [
      el('b', { text: 'The library is empty' }),
      el('div', { text: 'Paste a screenshot with Ctrl+V, or drop image files anywhere on this window. They land in the inbox; run the analysis from the Inbox.' }),
    ]);
  } else if (!list.length) {
    body = el('div', { class: 'empty' }, [
      el('b', { text: 'No references match' }),
      el('div', { text: `${S.refs.length} in the library. Clear a filter to widen.` }),
      el('button', { class: 'btn', onclick: () => { clearFilters(); render(); } }, ['Clear filters']),
    ]);
  } else {
    body = el('div', { class: 'grid' }, list.map((r) => card(r)));
  }
  return el('div', { class: 'gal-main' }, [head, body]);
}

/* ---------- reference page: one addressable page per reference (#ref/REF-0032) ---------- */

const refHash = (id) => '#ref/' + encodeURIComponent(id);

/** Push a history entry unless we are already there, so Back and Forward walk the app. */
function pushHash(h) {
  if (location.hash === h) return;
  try { history.pushState(null, '', h); } catch { /* sandboxed viewers: no history */ }
}

function openRef(id, replace) {
  if (S.view === 'gallery') { const g = $('#main .gal-main'); S.galleryScroll = g ? g.scrollTop : 0; }
  S.view = 'ref';
  S.refId = id;
  S.lastRef = id;
  if (!S.detail || S.detail.id !== id) S.detail = null;
  S.railOpen = false;
  document.body.classList.remove('nav-open');
  if (replace) { try { history.replaceState(null, '', refHash(id)); } catch { /* ignore */ } } else pushHash(refHash(id));
  render();
  if (!S.detail) loadDetail(id);
}

async function loadDetail(id) {
  try {
    const d = await api('/api/ref/' + encodeURIComponent(id));
    if (S.refId !== id) return;
    S.detail = d;
  } catch (e) {
    if (S.refId !== id) return;
    S.detail = { id, error: e.message };
  }
  if (S.view === 'ref') render();
}

function backToGallery() {
  S.restoreGallery = true;
  setView('gallery');
}

/** The order prev/next walks: the gallery's current filter when this ref is in it, else the library. */
function refOrder(id) {
  const f = filtered();
  return f.some((r) => r.id === id) ? f : S.refs;
}
function stepRef(dir) {
  const order = refOrder(S.refId);
  const i = order.findIndex((r) => r.id === S.refId);
  const next = order[i + dir];
  if (i >= 0 && next) openRef(next.id, true);
}

async function react(id, value) {
  const current = S.refs.find((r) => r.id === id);
  const next = current && current.sam_reaction === value ? '' : value;
  try {
    await api('/api/ref/' + encodeURIComponent(id), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ sam_reaction: next, status: next ? 'reviewed' : 'unreviewed' }),
    });
    await loadAll();
    if (S.detail && S.detail.id === id) { S.detail.sam_reaction = next; S.detail.status = next ? 'reviewed' : 'unreviewed'; }
    render();
  } catch (e) { toast(e.message, true); }
}

async function saveNote(id, text) {
  try {
    await api('/api/ref/' + encodeURIComponent(id), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ sam_note: text }),
    });
    toast('Reason saved — that is the evidence a preference needs.');
    await loadRefs();
  } catch (e) { toast(e.message, true); }
}

function reactionSeg(r) {
  return el('div', { class: 'seg', role: 'group', 'aria-label': 'My reaction' }, [
    el('button', { class: 'like', 'aria-pressed': String(r.sam_reaction === 'like'), onclick: () => react(r.id, 'like') }, [icon('heart'), 'Like']),
    el('button', { 'aria-pressed': String(r.sam_reaction === 'dislike'), onclick: () => react(r.id, 'dislike') }, ['Not for me']),
  ]);
}

function termRow(t) {
  return el('button', {
    class: 'term', title: t.definition ? `${t.definition} — show every reference with this term` : 'Show every reference with this term',
    onclick: () => showIn('term', t.id),
  }, [
    el('code', { text: t.id }),
    el('span', { class: 'nm', text: t.name || (t.valid ? '' : 'unknown term') }),
    t.stance ? el('span', { class: 'st ' + t.stance, text: t.stance }) : null,
  ]);
}

/* A deliberately tiny Markdown reader for the record's prose: paragraphs, bullet lists,
   **bold**, *italic* and `code`. It builds DOM nodes, never innerHTML. A `#rrggbb` code
   span gets a swatch, because the Read section is written in measured hex. */
const HEX = /^#[0-9a-f]{6}$/i;
function inline(text) {
  const out = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*\s][^*]*\*)/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const t = m[0];
    if (t.startsWith('**')) out.push(el('strong', {}, inline(t.slice(2, -2))));
    else if (t.startsWith('`')) {
      const c = t.slice(1, -1);
      out.push(HEX.test(c)
        ? el('code', { class: 'hex' }, [el('i', { class: 'sw', style: `background:${c}` }), c])
        : el('code', { text: c }));
    } else out.push(el('em', {}, inline(t.slice(1, -1))));
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
function prose(md) {
  const blocks = String(md || '').split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return el('div', { class: 'prose' }, blocks.map((b) => (/^[-*] /.test(b)
    ? el('ul', {}, b.split('\n').map((l) => el('li', {}, inline(l.replace(/^[-*]\s+/, '')))))
    : el('p', {}, inline(b.replace(/\n/g, ' '))))));
}

/** Every distinct hex the analysis measured, in the order it mentions them. */
function measuredPalette(md) {
  const seen = new Set();
  for (const m of String(md || '').matchAll(/#[0-9a-fA-F]{6}\b/g)) seen.add(m[0].toLowerCase());
  return [...seen].slice(0, 16);
}
function paletteStrip(hexes) {
  return el('div', { class: 'palette' }, hexes.map((h) => el('button', {
    class: 'swatch', title: `Copy ${h}`, 'aria-label': `Copy ${h}`,
    onclick: async () => {
      try { await navigator.clipboard.writeText(h); toast(`Copied ${h}`); } catch { toast(h); }
    },
  }, [el('span', { class: 'chip-col', style: `background:${h}` }), el('code', { text: h })])));
}

let heroCache = null;

function refPage() {
  const id = S.refId;
  const r = S.refs.find((x) => x.id === id);
  const d = S.detail && S.detail.id === id ? S.detail : null;
  const order = refOrder(id);
  const i = order.findIndex((x) => x.id === id);
  const prev = i > 0 ? order[i - 1] : null;
  const next = i >= 0 && i < order.length - 1 ? order[i + 1] : null;
  const filteredOrder = order !== S.refs && order.length !== S.refs.length;

  const head = el('div', { class: 'page-head ref-head' }, [
    el('button', { class: 'btn sm', onclick: backToGallery, title: 'Back to the gallery (Esc)' }, [icon('back'), 'Gallery']),
    el('span', { class: 'ref-id', text: id }),
    r && r.verdict ? el('span', { class: 'pill ' + r.verdict, text: r.verdict }) : null,
    r && r.status === 'unreviewed' ? el('span', { class: 'pill unreviewed', text: 'to review' }) : null,
    r && r.sam_reaction === 'like' ? el('span', { class: 'pill like' }, [icon('heart'), 'liked']) : null,
    el('div', { class: 'end' }, [
      i >= 0 ? el('span', { class: 'sub pos', text: `${i + 1} of ${order.length}${filteredOrder ? ' filtered' : ''}` }) : null,
      el('div', { class: 'stepper' }, [
        el('button', { class: 'icon-btn sm', disabled: !prev, title: prev ? `Previous: ${prev.id} (←)` : 'First reference', 'aria-label': 'Previous reference', onclick: () => stepRef(-1) }, [icon('chevronL')]),
        el('button', { class: 'icon-btn sm', disabled: !next, title: next ? `Next: ${next.id} (→)` : 'Last reference', 'aria-label': 'Next reference', onclick: () => stepRef(1) }, [icon('chevron')]),
      ]),
    ]),
  ]);
  const page = (kids) => el('article', { class: 'refpage', 'data-id': id }, [head, ...kids]);

  if (!r && S.refs.length && (!d || d.error)) {
    return page([el('div', { class: 'empty' }, [
      el('b', { text: `${id} is not in this library` }),
      el('div', { text: 'It may have been renamed or removed from the vault.' }),
      el('button', { class: 'btn', onclick: backToGallery }, ['Back to the gallery']),
    ])]);
  }
  if (d && d.error) return page([el('div', { class: 'hint warn', style: 'margin:20px', text: d.error })]);
  if (!d) return page([el('div', { class: 'note', style: 'padding:24px 20px', text: 'Loading…' })]);

  const rr = r || d;
  const byId = new Map(S.refs.map((x) => [x.id, x]));
  const sec = (title, kids, cls = '') => el('section', { class: 'rsec ' + cls }, [el('h3', { text: title }), ...[].concat(kids)]);
  const kv = (k, v) => el('div', {}, [el('dt', { text: k }), el('dd', { text: v || '—' })]);

  // facets, grouped by family letter in A–L order
  const famName = Object.fromEntries(((S.overview && S.overview.facets) || []).map((f) => [f.letter, f.name]));
  const fam = new Map();
  for (const t of d.facetDetail || []) {
    const L = String(t.id).split('.')[0];
    if (!fam.has(L)) fam.set(L, []);
    fam.get(L).push(t);
  }
  const families = [...fam.entries()].sort((a, b) => a[0].localeCompare(b[0]));

  const palette = measuredPalette(d.read);
  const near = (d.neighbours || []).filter((n) => byId.has(n.id));

  // The hero is reused across repaints of the same reference: a fresh <img> has no height
  // until it decodes, which would clamp the restored scroll position after a reaction.
  if (!heroCache || heroCache.dataset.id !== id) {
    heroCache = el('div', { class: 'ref-hero hatch', 'data-id': id }, [
      d.image
        ? el('a', { href: '/img/' + d.image, target: '_blank', rel: 'noopener', title: 'Open the full-size image' }, [shotImg('/img/' + d.image, d.title)])
        : el('div', { class: 'shot-missing', text: 'No image recorded' }),
    ]);
  }
  const main = el('div', { class: 'ref-main' }, [
    heroCache,
    palette.length ? sec('Measured palette', [
      el('p', { class: 'sec-sub', text: 'Every hex the analysis measured, in the order the read cites them. Select one to copy it.' }),
      paletteStrip(palette),
    ]) : null,
    d.read ? sec('Read', prose(d.read)) : null,
    d.why ? sec('Why the verdict', prose(d.why)) : null,
    d.notes ? sec('Notes', prose(d.notes)) : null,
  ]);

  const side = el('aside', { class: 'ref-side', 'aria-label': 'Classification and reaction' }, [
    el('div', { class: 'rsec ref-title' }, [
      el('h1', { text: d.title || d.id }),
      el('p', { class: 'src', text: d.source || '' }),
      el('div', { class: 'meta-row' }, [
        el('span', { class: 'pill', style: 'text-transform:capitalize' }, [shapeGlyph(rr.concept), rr.concept || '—']),
        d.kind ? el('span', { class: 'pill vio', text: d.kind }) : null,
        d.captured ? el('span', { class: 'pill', text: 'captured ' + d.captured }) : null,
      ]),
    ]),
    sec('My reaction', [
      reactionSeg(rr),
      el('textarea', {
        placeholder: 'Why? One line. "the set rows read at a glance because the weight column is tabular"',
        'aria-label': 'Why — the reason behind your reaction',
        onchange: (e) => saveNote(d.id, e.target.value),
      }, [rr.sam_note || '']),
      el('p', { class: 'sec-sub', style: 'margin:8px 0 0', text: 'A reaction never changes a facet stance on its own. The reason is what turns a pattern into a recorded preference.' }),
    ]),
    sec('Classification', el('dl', { class: 'kv' }, [
      kv('Verdict', d.verdict), kv('Confidence', d.confidence),
      kv('Needs photo', DEP_LABEL[d.imagery_dep] || d.imagery_dep), kv('RTL', d.rtl),
      kv('Cost', d.cost), kv('Review', d.status),
    ])),
    d.archetypeDetail && d.archetypeDetail.length ? sec('Archetype', el('div', { class: 'terms' }, d.archetypeDetail.map(termRow))) : null,
    sec(`Facet terms · ${(d.facetDetail || []).length}`, families.length
      ? families.map(([L, terms]) => el('div', { class: 'fam' }, [
        el('div', { class: 'fam-h' }, [el('b', { text: L }), el('span', { text: famName[L] || '' }), el('span', { class: 'n', text: String(terms.length) })]),
        el('div', { class: 'terms' }, terms.map(termRow)),
      ]))
      : el('div', { class: 'note', text: 'No facet terms recorded.' })),
    sec('File', [
      el('code', { class: 'path', text: d.file }),
      d.modified ? el('p', { class: 'sec-sub', style: 'margin:6px 0 0', text: 'modified ' + d.modified }) : null,
    ]),
  ]);

  return page([
    el('div', { class: 'ref-grid' }, [main, side]),
    el('section', { class: 'ref-near' }, [
      el('div', { class: 'near-head' }, [
        el('h3', { text: 'Nearest in the library' }),
        el('span', { class: 'sec-sub', text: near.length ? 'Ranked by shared facet terms (IDF-weighted cosine)' : 'Nothing else shares terms with this one yet.' }),
      ]),
      near.length ? el('div', { class: 'grid' }, near.map((n) => card(byId.get(n.id), el('span', {
        class: 'pill', title: `Shares ${n.shared.length}: ${n.shared.join(', ')}`, text: `${Math.round(n.score * 100)}% match`,
      })))) : null,
    ]),
  ]);
}

/* ---------- graph ---------- */

// Obsidian-style: full-bleed canvas, layout solved to equilibrium before the first paint,
// no perpetual animation loop (a rAF loop runs only while a drag / unpin is re-settling it).
let graphLegendOpen = window.innerWidth > 600;   // kept in memory only: viewer sandboxes may block localStorage
let graphToken = 0;           // a newer graphView() invalidates an older, still-fetching startGraph()

function graphView() {
  const counts = new Map(CONCEPTS.map((c) => [c, S.refs.filter((r) => r.concept === c).length]));
  const chip = (key, label) => el('button', {
    class: 'gchip glass', 'data-concept': key, 'aria-pressed': String(key === 'all'),
  }, [key === 'all' ? null : shapeGlyph(key), el('span', { text: label })]);
  const btn = (act, label, ico) => el('button', { class: 'gbtn', 'data-act': act, title: label, 'aria-label': label }, [icon(ico)]);
  const legend = el('div', { class: 'graph-legend glass' + (graphLegendOpen ? '' : ' collapsed') }, [
    el('button', {
      class: 'glegend-head', 'aria-expanded': String(graphLegendOpen), onclick: (e) => {
        graphLegendOpen = !graphLegendOpen;
        legend.classList.toggle('collapsed', !graphLegendOpen);
        e.currentTarget.setAttribute('aria-expanded', String(graphLegendOpen));
      },
    }, [el('b', { text: 'Legend' }), el('span', { class: 'caret' }, [icon('chevron')])]),
    el('div', { class: 'glegend-body' }, [
      ...CONCEPTS.map((c) => el('div', { class: 'row' }, [shapeGlyph(c), el('span', { text: c }), el('span', { class: 'n', text: String(counts.get(c) || 0) })])),
      el('div', { class: 'row' }, [el('i', { class: 'ring' }), el('span', { text: 'liked' })]),
      el('div', { class: 'note', text: 'Colour and shape = what the image depicts. A link is IDF-weighted facet-vector cosine ≥ 0.20: the two share named terms. Drag a node to pin it; double-click to release.' }),
    ]),
  ]);
  const wrap = el('div', { class: 'graph-wrap' }, [
    el('canvas', { id: 'graph', 'aria-label': 'Similarity graph of the library' }),
    el('div', { class: 'graph-preview glass', style: 'display:none' }),
    el('div', { class: 'graph-chips', role: 'group', 'aria-label': 'Filter by concept' },
      [chip('all', 'All'), ...CONCEPTS.map((c) => chip(c, c))]),
    legend,
    el('div', { class: 'graph-controls glass' }, [
      btn('in', 'Zoom in', 'plus'), btn('out', 'Zoom out', 'minus'), btn('fit', 'Fit to view', 'fit'), btn('reset', 'Reset layout', 'reset'),
    ]),
  ]);
  const token = ++graphToken;
  setTimeout(() => startGraph(wrap, token), 0);
  return wrap;
}

const hexA = (hex, a) => {
  const h = hex.replace('#', '');
  const v = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return `rgba(${parseInt(v.slice(0, 2), 16)},${parseInt(v.slice(2, 4), 16)},${parseInt(v.slice(4, 6), 16)},${a})`;
};

async function startGraph(wrap, token) {
  const canvas = $('#graph', wrap);
  let data;
  try { data = await api('/api/graph'); } catch (e) { toast(e.message, true); return; }
  // render() can run more than once per view switch; only the live, newest view may draw.
  if (token !== graphToken || !wrap.isConnected) return;
  if (!data.nodes.length) {
    for (const k of [...wrap.children]) k.remove();
    wrap.appendChild(el('div', { class: 'graph-empty', text: 'No references yet — nothing to link.' }));
    return;
  }

  /* ----- theme colours, read once per view (a theme switch re-renders the view) ----- */
  const C = {
    ink: cssVar('--ink'), ink2: cssVar('--ink-2'), ink3: cssVar('--ink-3'), surface: cssVar('--surface'),
    concept: Object.fromEntries([...CONCEPTS, 'none'].map((c) => [c, conceptColour(c)])),
  };

  /* ----- model ----- */
  const groupOf = (n) => (CONCEPTS.includes(n.concept) ? n.concept : 'none');
  const nodes = data.nodes.map((n) => ({
    ...n, g: groupOf(n), x: 0, y: 0, vx: 0, vy: 0, pinned: false,
    r: 6 + Math.min(8, (n.terms || 0) * 0.45),
  }));
  const index = new Map(nodes.map((n) => [n.id, n]));
  const links = data.edges.map((e) => ({ s: index.get(e.source), t: index.get(e.target), w: e.score })).filter((l) => l.s && l.t);
  const adj = new Map(nodes.map((n) => [n, new Set()]));
  for (const l of links) { adj.get(l.s).add(l.t); adj.get(l.t).add(l.s); }

  // One anchor per concept, spaced around a ring; each concept gets an arc proportional to its
  // size, so a 3-node group is its own small island rather than sitting inside a big one.
  const groups = [...CONCEPTS, 'none'].map((g) => ({ g, list: nodes.filter((n) => n.g === g) })).filter((o) => o.list.length);
  for (const o of groups) o.spread = 40 + Math.sqrt(o.list.length) * 30;
  const GAP = 110;
  const arcTotal = groups.reduce((s, o) => s + 2 * o.spread + GAP, 0);
  const ringR = groups.length === 1 ? 0 : Math.max(150, arcTotal / (2 * Math.PI));
  const anchor = new Map();
  let acc = 0;
  for (const o of groups) {
    const mid = acc + o.spread + GAP / 2;
    const a = (mid / arcTotal) * Math.PI * 2 - Math.PI / 2;
    anchor.set(o.g, { x: Math.cos(a) * ringR, y: Math.sin(a) * ringR });
    acc += 2 * o.spread + GAP;
  }

  function seed() {
    let s = 1234567;                                   // fixed seed: same data -> same layout
    const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
    for (const o of groups) {
      const c = anchor.get(o.g);
      o.list.forEach((n) => {
        const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()) * o.spread;
        n.x = c.x + Math.cos(a) * d; n.y = c.y + Math.sin(a) * d;
        n.vx = n.vy = 0; n.pinned = false;
      });
    }
  }

  let alpha = 1;
  const EPS = 0.02, ALPHA_MIN = 0.012;
  let dragging = null;

  /** One tick of the force model. Returns the largest node speed. */
  function step() {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const d2 = Math.max(dx * dx + dy * dy, 36);
        const d = Math.sqrt(d2);
        const push = (3200 / d2) * alpha;
        const ux = dx / d, uy = dy / d;
        a.vx -= ux * push; a.vy -= uy * push;
        b.vx += ux * push; b.vy += uy * push;
      }
    }
    for (const l of links) {
      const dx = l.t.x - l.s.x, dy = l.t.y - l.s.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 0.01;
      const f = (d - (120 - l.w * 70)) * 0.012 * alpha;
      const ux = dx / d, uy = dy / d;
      l.s.vx += ux * f; l.s.vy += uy * f;
      l.t.vx -= ux * f; l.t.vy -= uy * f;
    }
    let maxV = 0;
    for (const n of nodes) {
      const c = anchor.get(n.g);                       // pull toward own concept's anchor
      n.vx += (c.x - n.x) * 0.012 * alpha;
      n.vy += (c.y - n.y) * 0.012 * alpha;
      n.vx *= 0.82; n.vy *= 0.82;
      if (n.pinned || n === dragging) { n.vx = n.vy = 0; continue; }
      n.x += n.vx; n.y += n.vy;
      maxV = Math.max(maxV, Math.abs(n.vx), Math.abs(n.vy));
    }
    return maxV;
  }

  /** Solve to equilibrium synchronously (bounded), so nothing is ever seen moving into place. */
  function settleNow(budget = 700) {
    alpha = 1;
    for (let i = 0; i < budget; i++) {
      const v = step();
      alpha = Math.max(alpha * 0.992, 0.05);
      if (i > 40 && v < EPS) break;
    }
    alpha = 0;
  }

  seed();
  settleNow();

  /* ----- view ----- */
  const ctx = canvas.getContext('2d');
  const view = { x: 0, y: 0, k: 1 };
  let W = 0, H = 0, dpr = 1, fitted = false;
  let hover = null, filter = 'all';
  const clampK = (k) => Math.max(0.12, Math.min(6, k));
  const visible = (n) => filter === 'all' || n.g === filter;

  /** Trace a node's concept shape (the secondary encoding to its colour). */
  function tracePath(n, rad) {
    const s = SHAPE[n.g] || 'circle';
    ctx.beginPath();
    if (s === 'circle') { ctx.arc(n.x, n.y, rad, 0, Math.PI * 2); return; }
    SHAPE_PTS[s].forEach(([px, py], i) => (i ? ctx.lineTo : ctx.moveTo).call(ctx, n.x + px * rad, n.y + py * rad));
    ctx.closePath();
  }

  /* ----- node preview card: thumbnail + title beside the hovered node ----- */
  const preview = wrap.querySelector('.graph-preview');
  let previewNode = null;
  function showPreview(n) {
    if (!n) { preview.style.display = 'none'; previewNode = null; return; }
    if (n !== previewNode) {
      previewNode = n;
      preview.replaceChildren(
        n.image ? shotImg('/img/' + n.image, n.title || n.id) : el('div', { class: 'shot-missing', text: 'No image' }),
        el('div', { class: 'gp-meta' }, [shapeGlyph(n.g), el('b', { text: n.id }), el('span', { text: n.title || '' })]),
      );
      preview.style.display = 'block';
    }
  }
  function positionPreview() {
    if (!previewNode) return;
    const n = previewNode;
    const sx = n.x * view.k + view.x, sy = n.y * view.k + view.y;
    const pw = preview.offsetWidth, ph = preview.offsetHeight;
    let x = sx + (n.r * view.k) + 12;
    if (x + pw > W - 8) x = sx - (n.r * view.k) - 12 - pw;
    let y = sy - ph / 2;
    y = Math.max(8, Math.min(H - ph - 8, y));
    preview.style.left = Math.max(8, x) + 'px';
    preview.style.top = y + 'px';
  }

  function fitView() {
    if (!W || !H) return;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const n of nodes) { x0 = Math.min(x0, n.x - n.r); x1 = Math.max(x1, n.x + n.r); y0 = Math.min(y0, n.y - n.r); y1 = Math.max(y1, n.y + n.r); }
    const pad = W < 600 ? 40 : 90;
    const k = clampK(Math.min((W - 2 * pad) / Math.max(x1 - x0, 1), (H - 2 * pad) / Math.max(y1 - y0, 1), 2.2));
    view.k = k;
    view.x = W / 2 - ((x0 + x1) / 2) * k;
    view.y = H / 2 - ((y0 + y1) / 2) * k;
  }
  function zoomAt(mx, my, factor) {
    const k2 = clampK(view.k * factor), r = k2 / view.k;
    view.x = mx - (mx - view.x) * r;
    view.y = my - (my - view.y) * r;
    view.k = k2;
  }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const nb = hover ? adj.get(hover) : null;
    const k = view.k;
    ctx.setTransform(dpr * k, 0, 0, dpr * k, dpr * view.x, dpr * view.y);
    for (const l of links) {
      const both = visible(l.s) && visible(l.t);
      const lit = hover && (l.s === hover || l.t === hover);
      ctx.globalAlpha = !both ? 0.05 : hover ? (lit ? 1 : 0.08) : 1;
      ctx.strokeStyle = lit ? C.ink : hexA(C.ink3, 0.18 + l.w * 0.45);
      ctx.lineWidth = (lit ? 1.6 : 0.6 + l.w * 1.2) / k;
      ctx.beginPath(); ctx.moveTo(l.s.x, l.s.y); ctx.lineTo(l.t.x, l.t.y); ctx.stroke();
    }
    for (const n of nodes) {
      const on = hover ? (n === hover || nb.has(n)) : true;
      ctx.globalAlpha = !visible(n) ? 0.12 : on ? 1 : 0.18;
      tracePath(n, n.r);
      ctx.fillStyle = C.concept[n.g] || C.concept.none;
      ctx.fill();
      ctx.lineWidth = 2 / k; ctx.strokeStyle = C.surface; ctx.stroke();   // 2px surface ring separates overlaps
      if (n.reaction === 'like') {
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r + 4 / k, 0, Math.PI * 2);
        ctx.lineWidth = 2 / k; ctx.strokeStyle = C.ink; ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
    // labels in screen space so text stays crisp and a constant size at any zoom
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = '500 11px Inter, -apple-system, "Segoe UI", sans-serif';
    ctx.textBaseline = 'middle';
    if (hover) {
      ctx.fillStyle = C.ink2;
      ctx.textAlign = 'left';
      for (const n of nb) if (visible(n)) ctx.fillText(n.id, n.x * k + view.x + n.r * k + 7, n.y * k + view.y);
    }
    positionPreview();   // the HTML preview card follows the node through pans, zooms and drags
  }

  // Coalesced one-shot repaint; never re-arms itself.
  let drawQueued = 0;
  const redraw = () => { if (!drawQueued) drawQueued = requestAnimationFrame(() => { drawQueued = 0; draw(); }); };

  // The only loop: runs while a drag / unpin is re-settling the layout, then stops itself.
  let raf = 0;
  function tick() {
    raf = 0;
    const v = step();
    alpha *= 0.96;
    draw();
    if (alpha > ALPHA_MIN && (v > EPS || dragging)) raf = requestAnimationFrame(tick);
    else alpha = 0;
  }
  const reheat = (a = 0.35) => { alpha = Math.max(alpha, a); if (!raf) raf = requestAnimationFrame(tick); };

  /* ----- sizing: first paint happens here, after the layout above is already settled ----- */
  const sizeCanvas = () => {
    const r = wrap.getBoundingClientRect();
    if (!r.width || !r.height) return false;
    dpr = window.devicePixelRatio || 1;
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    return true;
  };
  new ResizeObserver(() => {
    if (!sizeCanvas()) return;
    if (!fitted) { fitView(); fitted = true; }
    draw();
  }).observe(wrap);

  /* ----- hit test + pointer handling ----- */
  const toWorld = (mx, my) => ({ x: (mx - view.x) / view.k, y: (my - view.y) / view.k });
  const pick = (mx, my) => {
    const p = toWorld(mx, my);
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      if (!visible(n)) continue;
      const rr = n.r + 4 / view.k;
      if ((n.x - p.x) ** 2 + (n.y - p.y) ** 2 <= rr * rr) return n;
    }
    return null;
  };
  const local = (e) => { const b = canvas.getBoundingClientRect(); return { x: e.clientX - b.left, y: e.clientY - b.top }; };
  const setHover = (n) => {
    if (n === hover) return;
    hover = n;
    canvas.style.cursor = n ? 'pointer' : '';
    showPreview(n);
    redraw();
  };

  const ptrs = new Map();            // active pointers (mouse, pen, fingers)
  let gesture = null;                // {type:'node'|'pan'|'pinch', ...}
  let lastTap = { id: null, t: 0 }, openTimer = 0;
  const DRAG_PX = 5;

  canvas.addEventListener('pointerdown', (e) => {
    canvas.setPointerCapture(e.pointerId);
    const p = local(e);
    ptrs.set(e.pointerId, p);
    if (ptrs.size === 2) {
      const [a, b] = [...ptrs.values()];
      gesture = { type: 'pinch', d0: Math.hypot(a.x - b.x, a.y - b.y) || 1, k0: view.k, m0: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, v0: { x: view.x, y: view.y } };
      dragging = null;
      return;
    }
    if (ptrs.size > 2) return;
    const n = pick(p.x, p.y);
    if (n) {
      const w = toWorld(p.x, p.y);
      gesture = { type: 'node', n, sx: p.x, sy: p.y, ox: n.x - w.x, oy: n.y - w.y, moved: false };
    } else {
      gesture = { type: 'pan', sx: p.x, sy: p.y, vx: view.x, vy: view.y };
      canvas.style.cursor = 'grabbing';
    }
  });

  canvas.addEventListener('pointermove', (e) => {
    const p = local(e);
    if (!ptrs.has(e.pointerId)) {                      // plain hover (mouse / pen)
      if (e.pointerType !== 'touch') setHover(pick(p.x, p.y));
      return;
    }
    ptrs.set(e.pointerId, p);
    if (!gesture) return;
    if (gesture.type === 'pinch' && ptrs.size >= 2) {
      const [a, b] = [...ptrs.values()];
      const m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const k2 = clampK(gesture.k0 * (Math.hypot(a.x - b.x, a.y - b.y) / gesture.d0));
      const wx = (gesture.m0.x - gesture.v0.x) / gesture.k0, wy = (gesture.m0.y - gesture.v0.y) / gesture.k0;
      view.k = k2; view.x = m.x - wx * k2; view.y = m.y - wy * k2;
      redraw();
    } else if (gesture.type === 'node') {
      if (!gesture.moved && Math.hypot(p.x - gesture.sx, p.y - gesture.sy) < DRAG_PX) return;   // still a click
      gesture.moved = true;
      const n = gesture.n, w = toWorld(p.x, p.y);
      dragging = n; n.pinned = true;
      n.x = w.x + gesture.ox; n.y = w.y + gesture.oy;
      canvas.style.cursor = 'grabbing';
      setHover(n);
      reheat(0.3);
    } else if (gesture.type === 'pan') {
      view.x = gesture.vx + (p.x - gesture.sx);
      view.y = gesture.vy + (p.y - gesture.sy);
      redraw();
    }
  });

  const release = (e, cancelled) => {
    if (!ptrs.has(e.pointerId)) return;
    ptrs.delete(e.pointerId);
    const g = gesture;
    if (g && g.type === 'pinch') { if (ptrs.size < 2) gesture = null; return; }
    gesture = null;
    dragging = null;
    canvas.style.cursor = hover ? 'pointer' : '';
    if (!g || cancelled || g.type !== 'node' || g.moved) return;   // a drag never counts as a click
    const n = g.n, now = Date.now();
    if (n.pinned) {
      // Double-click releases a pinned node; a single click opens it after the double-click window.
      if (lastTap.id === n.id && now - lastTap.t < 320) {
        clearTimeout(openTimer); lastTap = { id: null, t: 0 };
        n.pinned = false; reheat(0.5);
        return;
      }
      lastTap = { id: n.id, t: now };
      clearTimeout(openTimer);
      openTimer = setTimeout(() => openRef(n.id), 330);
    } else {
      openRef(n.id);
    }
  };
  canvas.addEventListener('pointerup', (e) => release(e, false));
  canvas.addEventListener('pointercancel', (e) => release(e, true));
  canvas.addEventListener('pointerleave', (e) => { if (!ptrs.has(e.pointerId)) setHover(null); });

  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const p = local(e);
    const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
    zoomAt(p.x, p.y, Math.exp(-dy * 0.0015));
    redraw();
  }, { passive: false });

  /* ----- floating controls ----- */
  wrap.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (b) {
      const act = b.dataset.act;
      if (act === 'in') zoomAt(W / 2, H / 2, 1.3);
      else if (act === 'out') zoomAt(W / 2, H / 2, 1 / 1.3);
      else if (act === 'fit') fitView();
      else if (act === 'reset') {
        cancelAnimationFrame(raf); raf = 0; dragging = null;
        seed(); settleNow(); fitView();               // re-solved off-screen, shown settled
      }
      redraw();
      return;
    }
    const c = e.target.closest('[data-concept]');
    if (c) {
      filter = c.dataset.concept;
      if (hover && !visible(hover)) { hover = null; showPreview(null); }
      for (const x of wrap.querySelectorAll('.gchip')) x.setAttribute('aria-pressed', String(x === c));
      redraw();
    }
  });
}

/* ---------- queue ---------- */

function queueView() {
  const pending = S.refs.filter((r) => r.status === 'unreviewed');
  const head = el('div', { class: 'page-head' }, [
    el('h1', { text: 'Queue' }),
    el('span', { class: 'sub', text: pending.length ? `${pending.length} waiting for your reaction` : 'All caught up' }),
  ]);
  if (!pending.length) {
    return el('div', { class: 'list-view' }, [head, el('div', { class: 'empty' }, [
      el('b', { text: 'Nothing waiting' }),
      el('div', { text: S.refs.length ? 'Every reference has been reviewed.' : 'The library is empty.' }),
    ])]);
  }
  return el('div', { class: 'list-view' }, [
    head,
    el('div', { class: 'hint info', text: 'The classification below is my proposal. Correcting it, or saying why you like something, is what records your taste.' }),
    ...pending.map((r) => el('div', { class: 'qrow' }, [
      el('div', { class: 'qshot', onclick: () => openRef(r.id), title: `Open ${r.id}` }, [r.image ? shotImg('/img/' + r.image, r.title) : el('div', { class: 'shot-missing' })]),
      el('div', { style: 'min-width:0' }, [
        el('div', { class: 'qt', text: r.title || r.id }),
        el('div', { class: 'qs', text: [r.id, r.source, termName(r.archetype[0] || '')].filter(Boolean).join(' · ') }),
        el('div', { class: 'badges' }, [
          el('span', { class: 'pill', style: 'text-transform:capitalize' }, [shapeGlyph(r.concept), r.concept || '—']),
          r.verdict ? el('span', { class: 'pill ' + r.verdict, text: r.verdict }) : null,
          el('span', { class: 'pill', text: 'photo: ' + (r.imagery_dep || '?') }),
          el('span', { class: 'pill', text: 'rtl: ' + (r.rtl || '?') }),
          el('span', { class: 'pill', text: 'cost: ' + (r.cost || '?') }),
        ]),
        el('div', { class: 'codes' }, r.facets.slice(0, 8).map((t) => el('code', { title: termName(t), text: t }))),
      ]),
      el('div', { class: 'qact' }, [
        reactionSeg(r),
        el('textarea', {
          placeholder: 'Why? (this is the evidence)', 'aria-label': `Why — ${r.id}`,
          onchange: (e) => saveNote(r.id, e.target.value),
        }, [r.sam_note || '']),
        el('button', { class: 'btn sm', onclick: () => openRef(r.id) }, ['Open reference page', icon('arrow')]),
      ]),
    ])),
  ]);
}

/* ---------- candidates ---------- */

function candidatesView() {
  const host = el('div', { class: 'list-view' }, [
    el('div', { class: 'page-head' }, [el('h1', { text: 'Candidates' }), el('span', { class: 'sub', text: 'Looking for patterns in your reactions…' })]),
  ]);
  api('/api/candidates').then(({ candidates }) => {
    const head = el('div', { class: 'page-head' }, [
      el('h1', { text: 'Candidates' }),
      el('span', { class: 'sub', text: candidates.length ? `${candidates.length} leaning${candidates.length === 1 ? '' : 's'} found` : 'No clear leanings yet' }),
    ]);
    if (!candidates.length) {
      host.replaceChildren(head, el('div', { class: 'empty' }, [
        el('b', { text: 'No clear leanings yet' }),
        el('div', { text: 'React to more references. A term shows up here once enough reactions agree on it.' }),
        el('button', { class: 'btn', onclick: () => setView('queue') }, ['Go to the queue']),
      ]));
      return;
    }
    host.replaceChildren(
      head,
      el('div', { class: 'hint', text: 'These are terms your reactions lean on consistently. They are candidates, not preferences — a preference needs a reason in your words. Write one and it goes to the queue for me to turn into a PREF record.' }),
      ...candidates.map((c) => {
        const box = el('textarea', { placeholder: `Why do you ${c.leaning} ${c.term}? One line in your words.`, 'aria-label': `Reason for ${c.term}` });
        return el('div', { class: 'cand' }, [
          el('div', { class: 'head' }, [
            el('code', { text: c.term }),
            el('span', { class: 'nm', text: c.name || '' }),
            el('span', { class: 'pill ' + (c.leaning === 'like' ? 'like' : 'dislike'), text: c.leaning }),
            el('span', {
              class: 'pill ' + (c.stance === 'required' ? 'required' : ''),
              title: c.stance === 'required'
                ? 'A constraint on the work, not a taste — a preference here would sit alongside it'
                : 'Sam’s recorded position on this term',
              text: 'stance now: ' + c.stance,
            }),
            el('span', { class: 'stat', text: `${c.like} like / ${c.dislike} not · ${Math.round(c.ratio * 100)}% agree` }),
          ]),
          el('div', { class: 'meter hatch' }, [el('i', { style: `width:${Math.round(c.ratio * 100)}%` })]),
          el('div', { class: 'note', style: 'margin-bottom:10px' }, [`From ${c.refs.length} references: ${c.refs.join(', ')}`]),
          box,
          el('div', { class: 'acts' }, [
            el('button', {
              class: 'btn primary', text: 'Record this reason',
              onclick: async (e) => {
                const reason = box.value.trim();
                if (!reason) { toast('A reason is the whole point — write one line.', true); return; }
                e.currentTarget.disabled = true;
                const b = e.currentTarget;
                try {
                  const out = await api('/api/candidate-reason', {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({ term: c.term, leaning: c.leaning, refs: c.refs, reason }),
                  });
                  toast('Queued in ' + out.file);
                  box.value = '';
                } catch (err) { toast(err.message, true); }
                b.disabled = false;
              },
            }),
            el('button', { class: 'btn', onclick: () => showIn('term', c.term) }, ['See these references']),
          ]),
        ]);
      }),
    );
  }).catch((e) => host.appendChild(el('div', { class: 'hint warn', text: e.message })));
  return host;
}

/* ---------- inbox ---------- */

const kb = (n) => (n > 1024 * 1024 ? (n / 1024 / 1024).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB');

let MODELS = null;
const modelChoice = () => {
  try { return localStorage.getItem('design.model') || ''; } catch { return ''; }
};
const setModelChoice = (v) => { try { localStorage.setItem('design.model', v); } catch { /* ignore */ } };

function inboxView() {
  const host = el('div', { class: 'inbox' }, [
    el('div', { class: 'page-head' }, [el('h1', { text: 'Inbox' }), el('span', { class: 'sub', text: 'Loading…' })]),
  ]);

  const paint = (data, status) => {
    const running = status && status.running;
    const n = data.count;
    const chosen = ((MODELS || []).some((m) => m.id === modelChoice()) ? modelChoice() : null) || (MODELS || []).find((m) => m.default)?.id || '';

    const header = el('div', { class: 'page-head' }, [
      el('h1', { text: 'Inbox' }),
      el('span', { class: 'sub', text: n ? `${n} image${n === 1 ? '' : 's'} ready to analyse` : 'Nothing waiting' }),
      el('div', { class: 'end' }, [
        el('button', { class: 'btn sm', onclick: () => refreshInbox() }, [icon('refresh'), 'Refresh']),
        el('button', { class: 'btn sm', onclick: () => $('#file-in').click() }, [icon('upload'), 'Add images']),
      ]),
    ]);

    const grid = n
      ? el('div', { class: 'shots' }, data.files.map((f) => el('figure', { class: 'shot-card' }, [
        el('div', { class: 'shot-img' }, [el('img', { src: f.url, alt: f.name, loading: 'lazy' })]),
        el('figcaption', {}, [
          el('span', { class: 'shot-name', title: f.name, text: f.name }),
          el('span', { class: 'shot-size', text: kb(f.size) }),
        ]),
        el('button', {
          class: 'icon-btn sm shot-remove', title: 'Remove from the inbox', 'aria-label': `Remove ${f.name}`,
          onclick: async (e) => {
            e.stopPropagation();
            try {
              await api('/api/inbox/remove', {
                method: 'POST', headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ name: f.name }),
              });
              toast(`Removed ${f.name}`);
              refreshInbox();
            } catch (err) { toast(err.message, true); }
          },
        }, [icon('close')]),
      ])))
      : el('div', { class: 'empty' }, [
        el('b', { text: 'Nothing waiting' }),
        el('div', {}, [
          'Press ', el('kbd', { text: 'Ctrl' }), ' + ', el('kbd', { text: 'V' }),
          ' anywhere to paste a screenshot, or drop image files onto the window.',
        ]),
        el('button', { class: 'btn primary', onclick: () => $('#file-in').click() }, [icon('upload'), 'Choose images']),
      ]);

    const controls = el('div', { class: 'run-bar' }, [
      el('label', { class: 'run-model' }, [
        el('span', { text: 'Analyse with' }),
        el('select', {
          disabled: running,
          onchange: (e) => { setModelChoice(e.target.value); refreshInbox(); },
        }, (MODELS || []).map((m) => el('option', {
          value: m.id, selected: m.id === chosen, text: `${m.name} — ${m.note}`,
        }))),
      ]),
      el('button', {
        class: 'btn primary',
        text: running ? 'Analysing…' : n ? `Analyse ${n} image${n === 1 ? '' : 's'}` : 'Nothing to analyse',
        disabled: running || !n,
        onclick: async () => {
          try {
            const out = await api('/api/ingest', {
              method: 'POST', headers: { 'content-type': 'application/json' },
              body: JSON.stringify({ model: chosen }),
            });
            if (!out.ok) { toast(out.error, true); return; }
            if (out.queued) { toast(`Sent ${out.count} image${out.count === 1 ? '' : 's'} to Hark. Message Hark "analyze" in your chat.`); refreshInbox(); return; }
            toast(`Analysing ${out.count} image${out.count === 1 ? '' : 's'} — this takes a few minutes.`);
            pollIngest();
            refreshInbox();
          } catch (e) { toast(e.message, true); }
        },
      }),
    ]);

    const explain = el('p', { class: 'inbox-foot' }, [
      'Hark reads each image with the ', el('code', { class: 'path', text: 'design-ingest' }),
      ' rules: concept first, measured colour and contrast, and a record left in the Queue for you to react to. ',
      'After pressing Analyse, message Hark "analyze" in your chat to start the run.',
    ]);

    // replaceChildren() stringifies a null argument into the text "null", so filter first.
    host.replaceChildren(...[
      header,
      grid,
      controls,
      status && status.code !== null && status.code !== undefined && !running
        ? el('div', { class: 'hint ' + (status.code === 0 ? 'info' : 'warn') },
          [status.code === 0
            ? (status.queued ? 'Queued for Hark. Message Hark "analyze" in your chat; results land in the Queue.' : `Last run finished${status.model ? ' on ' + status.model : ''}. Check the Queue.`)
            : (status.hint || `Last run failed (exit ${status.code}). Run /design-ingest inside a Claude Code session instead.`)])
        : null,
      explain,
      status && status.log
        ? el('details', { class: 'run-log' }, [
          el('summary', { text: 'Run output' }),
          el('pre', { class: 'path', text: status.log }),
        ])
        : null,
    ].filter(Boolean));
  };

  const refreshInbox = async () => {
    try {
      if (!MODELS) MODELS = (await api('/api/models')).models;
      const [data, status] = await Promise.all([api('/api/inbox'), api('/api/ingest/status')]);
      if (!host.isConnected && S.view !== 'inbox') return;
      paint(data, status);
      await loadOverview();
      renderChrome();
    } catch (e) { toast(e.message, true); }
  };
  refreshInbox();
  return host;
}

let pollTimer = null;
function pollIngest() {
  clearInterval(pollTimer);
  pollTimer = setInterval(async () => {
    try {
      const s = await api('/api/ingest/status');
      if (!s.running) {
        clearInterval(pollTimer);
        await loadAll();
        if (S.view !== 'graph') render(); else renderChrome();
        toast(s.code === 0 ? 'Ingest finished — references are in the Queue.' : 'Ingest ended with errors; see the Inbox.', s.code !== 0);
      }
    } catch { clearInterval(pollTimer); }
  }, 4000);
}

/* ---------- render ---------- */

/** Search-as-you-type repaints only the gallery body, keeping the rail and panel. */
function renderContent() {
  const cur = $('#main .gal-main');
  if (S.view === 'gallery' && cur) { cur.replaceWith(galleryMain()); return true; }
  return false;
}

const SCROLLERS = '.gal-main, .refpage, .list-view, .dash, .inbox';

function render() {
  const main = $('#main');
  // A repaint of the same screen (after a reaction, a reload of the library) keeps its scroll.
  const key = S.view + ':' + (S.view === 'ref' ? S.refId : '');
  const old = main.querySelector(SCROLLERS);
  const keep = main.dataset.key === key && old ? old.scrollTop : null;
  renderChrome();
  if (S.view === 'gallery') {
    main.className = 'gallery';
    main.replaceChildren(rail(), galleryMain());
  } else {
    main.className = '';
    const view = S.view === 'ref' ? refPage()
      : S.view === 'overview' ? overviewView()
      : S.view === 'graph' ? graphView()
        : S.view === 'queue' ? queueView()
          : S.view === 'candidates' ? candidatesView()
            : inboxView();
    main.replaceChildren(view);
  }
  main.dataset.key = key;
  const sc = main.querySelector(SCROLLERS);
  if (sc && keep !== null) sc.scrollTop = keep;
  else if (sc && S.view === 'gallery' && S.restoreGallery) {
    // Back from a reference page: land where you were, with that card in view.
    sc.scrollTop = S.galleryScroll;
    const c = S.lastRef && sc.querySelector(`.card[data-id="${CSS.escape(S.lastRef)}"]`);
    if (c) c.scrollIntoView({ block: 'nearest' });
  }
  S.restoreGallery = false;
  syncOverlay();
}

/* ---------- data ---------- */

async function loadOverview() { S.overview = await api('/api/overview'); indexTerms(); }
async function loadRefs() { S.refs = (await api('/api/refs')).refs; }
async function loadAll() {
  try { await Promise.all([loadOverview(), loadRefs()]); }
  catch (e) { toast('Cannot reach the studio server: ' + e.message, true); }
}

/* ---------- upload: drop, paste, pick ---------- */

const EXT_FOR = {
  'image/png': '.png', 'image/jpeg': '.jpg', 'image/webp': '.webp',
  'image/gif': '.gif', 'image/avif': '.avif', 'image/svg+xml': '.svg',
};

// 2026-11-24T09:30:24.123Z -> 20261124093024  (14 chars; 15 would catch the dot)
const stamp = () => new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);

/** A pasted screenshot arrives as a blob called "image.png", or with no name at all. */
function uploadName(file, i, pasted) {
  const generic = !file.name || /^(image|screenshot|untitled)\b/i.test(file.name);
  if (!pasted && !generic) return file.name;
  const ext = EXT_FOR[file.type] || (file.name && file.name.match(/\.[a-z0-9]+$/i) || ['.png'])[0];
  return `${pasted ? 'paste' : 'drop'}-${stamp()}${i ? '-' + (i + 1) : ''}${ext}`;
}

async function uploadFiles(files, pasted) {
  if (!files.length) return 0;
  let ok = 0;
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const name = uploadName(f, i, pasted);
    try {
      await api('/api/upload?name=' + encodeURIComponent(name), { method: 'POST', body: await f.arrayBuffer() });
      ok++;
    } catch (err) { toast(`${name}: ${err.message}`, true); }
  }
  if (ok) {
    toast(`${ok} image${ok === 1 ? '' : 's'} ${pasted ? 'pasted' : 'added'} into the inbox.`);
    await loadOverview();
    renderChrome();
    if (S.view === 'inbox') render();
  }
  return ok;
}

let dragDepth = 0;
const isFileDrag = (e) => [...((e.dataTransfer && e.dataTransfer.types) || [])].includes('Files');
window.addEventListener('dragenter', (e) => { if (!isFileDrag(e)) return; e.preventDefault(); dragDepth++; document.body.classList.add('dragging'); });
window.addEventListener('dragleave', (e) => { if (!isFileDrag(e)) return; e.preventDefault(); if (--dragDepth <= 0) { dragDepth = 0; document.body.classList.remove('dragging'); } });
window.addEventListener('dragover', (e) => e.preventDefault());
window.addEventListener('drop', async (e) => {
  e.preventDefault();
  dragDepth = 0;
  document.body.classList.remove('dragging');
  await uploadFiles([...(e.dataTransfer.files || [])].filter((f) => f.type.startsWith('image/')), false);
});

// Paste a screenshot straight in. Text pastes are left alone, so typing a reason
// into a textarea still behaves normally.
window.addEventListener('paste', async (e) => {
  const cd = e.clipboardData;
  if (!cd) return;
  const files = [...(cd.items || [])]
    .filter((it) => it.kind === 'file' && String(it.type).startsWith('image/'))
    .map((it) => it.getAsFile())
    .filter(Boolean);
  if (!files.length) return;
  e.preventDefault();
  await uploadFiles(files, true);
});

/* ---------- shell wiring ---------- */

hydrateIcons();

for (const b of document.querySelectorAll('#nav button')) {
  b.addEventListener('click', () => {
    if (b.dataset.view === 'gallery' && S.view === 'ref') { backToGallery(); return; }
    setView(b.dataset.view);
  });
}

const q = $('#q');
q.addEventListener('input', () => {
  S.search = q.value;
  if (S.view !== 'gallery') { setView('gallery'); return; }
  renderContent();
});
q.addEventListener('keydown', (e) => { if (e.key === 'Escape') { q.value = ''; S.search = ''; renderContent(); q.blur(); } });

const fileIn = $('#file-in');
$('#add-btn').addEventListener('click', () => fileIn.click());
fileIn.addEventListener('change', async () => {
  await uploadFiles([...fileIn.files], false);
  fileIn.value = '';
});

function paintThemeButton() {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  const b = $('#theme-btn');
  b.replaceChildren(icon(dark ? 'sun' : 'moon'));
  b.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  b.title = b.getAttribute('aria-label');
}
$('#theme-btn').addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem('design.theme', next); } catch { /* storage blocked: session-only */ }
  paintThemeButton();
  if (S.view === 'graph') render();     // canvas colours are read at draw time, not from CSS
});
paintThemeButton();

$('#menu-btn').addEventListener('click', () => document.body.classList.add('nav-open'));
$('#scrim').addEventListener('click', closeOverlays);
window.addEventListener('resize', syncOverlay);

document.addEventListener('keydown', (e) => {
  const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement && document.activeElement.tagName);
  if (e.key === '/' && !typing) { e.preventDefault(); q.focus(); return; }
  if (S.view === 'ref' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); stepRef(-1); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); stepRef(1); return; }
  }
  if (e.key !== 'Escape') return;
  if (document.body.classList.contains('nav-open')) { document.body.classList.remove('nav-open'); return; }
  if (S.railOpen) { S.railOpen = false; render(); return; }
  if (S.view === 'ref' && !typing) backToGallery();
});

/** Back / Forward, or a pasted link: follow the hash. */
function route() {
  const h = parseHash();
  if (h.view === 'ref') {
    if (S.view === 'ref' && S.refId === h.id) return;
    S.view = 'ref'; S.refId = h.id; S.lastRef = h.id; S.detail = null;
    render();
    loadDetail(h.id);
    return;
  }
  if (h.view !== S.view) {
    if (h.view === 'gallery' && S.view === 'ref') S.restoreGallery = true;
    setView(h.view, true);
  }
}
window.addEventListener('popstate', route);
window.addEventListener('hashchange', route);

loadAll().then(() => {
  render();
  if (S.view === 'ref') { S.lastRef = S.refId; loadDetail(S.refId); }
});

/* sign out, shown only when the studio has a login */
fetch('/api/session').then((r) => r.json()).then((s) => {
  if (!s.auth) return;
  $('#side-foot').appendChild(el('button', {
    class: 'icon-btn', type: 'button', title: 'Sign out', 'aria-label': 'Sign out',
    onclick: async () => { await api('/api/logout', { method: 'POST' }).catch(() => {}); location.href = '/login'; },
  }, [icon('logout')]));
}).catch(() => {});
