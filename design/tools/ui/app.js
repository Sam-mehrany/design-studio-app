'use strict';
/* design-studio front end. No framework, no build step. */

const $ = (sel, el = document) => el.querySelector(sel);
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

const api = async (p, opts = {}) => {
  // X-Studio forces a CORS preflight on writes, which the server refuses for other origins.
  const r = await fetch(p, { ...opts, headers: { ...(opts.headers || {}), 'X-Studio': '1' } });
  const body = await r.json().catch(() => ({ error: `${r.status} ${r.statusText}` }));
  if (!r.ok || body.error) throw new Error(body.error || `${r.status}`);
  return body;
};

function toast(msg, bad) {
  const t = el('div', { class: 'toast' + (bad ? ' bad' : ''), text: msg });
  document.body.appendChild(t);
  setTimeout(() => t.remove(), bad ? 6000 : 2600);
}

/**
 * A reference image that is not in this copy of the library (for example a
 * screenshot that was never synced into it) shows a placeholder instead of the
 * browser's broken-image icon. The error listener is attached before src, so a
 * cached 404 still reaches it.
 */
const shotImg = (src, alt, cls) => el('img', {
  onerror: (e) => e.target.replaceWith(el('div', { class: 'shot-missing', text: 'Image not in this copy' })),
  src, alt, loading: 'lazy', ...(cls ? { class: cls } : {}),
});

/* ---------- state ---------- */

const S = {
  view: 'gallery',
  overview: null,
  refs: [],
  selected: null,
  detail: null,
  filters: { archetype: new Set(), verdict: new Set(), kind: new Set(), imagery_dep: new Set(), rtl: new Set(), cost: new Set(), status: new Set(), reaction: new Set(), term: new Set() },
  search: '',
};

const FILTER_FIELDS = [
  ['archetype', 'Archetype'], ['verdict', 'Verdict'], ['kind', 'Kind'],
  ['imagery_dep', 'Survives without photo'], ['rtl', 'RTL'], ['cost', 'Cost'],
  ['status', 'Review'], ['reaction', 'My reaction'],
];
const DEP_LABEL = { none: 'yes — no imagery', soft: 'photo is decoration', hard: 'no — collapses' };

function valuesOf(field) {
  const tally = new Map();
  for (const r of S.refs) {
    const vals = field === 'archetype' ? r.archetype
      : field === 'reaction' ? [r.sam_reaction || 'none'] : [r[field]];
    for (const v of vals) {
      if (!v) continue;
      tally.set(v, (tally.get(v) || 0) + 1);
    }
  }
  return [...tally.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])));
}

function matches(r) {
  for (const [field] of FILTER_FIELDS) {
    const want = S.filters[field];
    if (!want.size) continue;
    const vals = field === 'archetype' ? r.archetype
      : field === 'reaction' ? [r.sam_reaction || 'none'] : [r[field]];
    if (!vals.some((v) => want.has(v))) return false;
  }
  if (S.filters.term.size && ![...S.filters.term].every((t) => r.facets.includes(t) || r.archetype.includes(t))) return false;
  if (S.search) {
    const q = S.search.toLowerCase();
    const hay = [r.id, r.title, r.source, ...r.facets, ...r.archetype].join(' ').toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

const filtered = () => S.refs.filter(matches);

/* ---------- chrome ---------- */

function renderStats() {
  const c = S.overview ? S.overview.counts : {};
  const items = [
    ['refs', c.refs], ['liked', c.liked], ['to review', c.unreviewed], ['inbox', c.inbox],
  ];
  $('#stats').replaceChildren(...items.map(([label, n]) =>
    el('div', { class: 'stat' }, [el('b', { text: String(n ?? '—') }), el('span', { text: label })])));
  const root = S.overview ? S.overview.root : '';
  const tail = root.split(/[/\\]/).filter(Boolean).slice(-2).join('/');
  const node = $('#root');
  node.textContent = tail ? '…/' + tail : '';
  node.title = root;
}

function setView(v) {
  S.view = v;
  for (const b of document.querySelectorAll('nav button')) {
    b.setAttribute('aria-current', String(b.dataset.view === v));
  }
  render();                       // paint immediately so the tab feels instant
  // The library changes on disk underneath us — a record written since page load would
  // otherwise show in Graph (which fetches per open) but not in Gallery (which read the
  // cached list once). Re-read, then repaint if we are still on the same view.
  loadAll().then(() => { if (S.view === v) render(); });
}

/* ---------- gallery ---------- */

function railSection(title, field) {
  const vals = valuesOf(field);
  if (!vals.length) return null;
  return el('section', {}, [
    el('h3', { text: title }),
    el('div', { class: 'chips' }, vals.map(([v, n]) => el('button', {
      class: 'chip',
      'aria-pressed': String(S.filters[field].has(v)),
      onclick: () => {
        const set = S.filters[field];
        set.has(v) ? set.delete(v) : set.add(v);
        render();
      },
    }, [
      el('span', { text: field === 'imagery_dep' ? (DEP_LABEL[v] || v) : String(v) }),
      el('span', { class: 'n', text: String(n) }),
    ]))),
  ]);
}

function rail() {
  const activeTerms = [...S.filters.term];
  const anyFilter = activeTerms.length || S.search || FILTER_FIELDS.some(([f]) => S.filters[f].size);
  return el('div', { class: 'rail' }, [
    el('section', {}, [
      el('h3', { text: 'Search' }),
      el('input', {
        type: 'search', placeholder: 'title, source, term…', value: S.search,
        oninput: (e) => { S.search = e.target.value; renderContent(); },
      }),
      anyFilter ? el('button', {
        class: 'clear', text: 'Clear all filters',
        onclick: () => {
          for (const k of Object.keys(S.filters)) S.filters[k].clear();
          S.search = '';
          render();
        },
      }) : null,
    ]),
    activeTerms.length ? el('section', {}, [
      el('h3', { text: 'Facet terms' }),
      el('div', { class: 'chips' }, activeTerms.map((t) => el('button', {
        class: 'chip', 'aria-pressed': 'true', title: 'remove this term filter',
        onclick: () => { S.filters.term.delete(t); render(); },
      }, [el('span', { text: t })]))),
    ]) : null,
    ...FILTER_FIELDS.map(([f, label]) => railSection(label, f)),
  ]);
}

function card(r) {
  return el('div', {
    class: 'card', 'aria-selected': String(S.selected === r.id), tabindex: '0',
    onclick: () => select(r.id),
    onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(r.id); } },
  }, [
    el('div', { class: 'shot' }, [r.image ? shotImg('/img/' + r.image, r.title) : null]),
    el('div', { class: 'meta' }, [
      el('div', { class: 't', text: r.title || r.id }),
      el('div', { class: 'sub', text: [r.id, r.archetype[0] || ''].filter(Boolean).join(' · ') }),
      el('div', { class: 'badges' }, [
        r.verdict ? el('span', { class: 'badge ' + r.verdict, text: r.verdict }) : null,
        r.kind === 'concept' ? el('span', { class: 'badge concept', text: 'concept' }) : null,
        r.status === 'unreviewed' ? el('span', { class: 'badge unreviewed', text: 'to review' }) : null,
        r.sam_reaction ? el('span', { class: 'badge ' + r.sam_reaction, text: r.sam_reaction }) : null,
      ]),
    ]),
  ]);
}

function galleryContent() {
  const list = filtered();
  if (!S.refs.length) {
    return el('div', { class: 'content' }, [el('div', { class: 'empty' }, [
      el('b', { text: 'The library is empty' }),
      el('div', { text: 'Paste a screenshot with Ctrl+V, or drop image files anywhere on this window. They land in the inbox; run the analysis from the Inbox tab.' }),
    ])]);
  }
  if (!list.length) {
    return el('div', { class: 'content' }, [el('div', { class: 'empty' }, [
      el('b', { text: 'No references match these filters' }),
      el('div', { text: `${S.refs.length} in the library. Clear a filter in the rail to widen.` }),
    ])]);
  }
  return el('div', { class: 'content' }, [
    el('div', { class: 'grid' }, list.map(card)),
  ]);
}

/* ---------- detail ---------- */

async function select(id) {
  if (S.selected === id) { S.selected = null; S.detail = null; render(); return; }
  S.selected = id;
  S.detail = null;
  render();
  try {
    S.detail = await api('/api/ref/' + encodeURIComponent(id));
  } catch (e) { toast(e.message, true); }
  render();
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
    await loadRefs();
    if (S.detail && S.detail.id === id) S.detail.sam_reaction = next;
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

function termRow(t) {
  return el('button', {
    class: 'term', title: t.definition || '', style: 'cursor:pointer;text-align:left;width:100%',
    onclick: () => { S.filters.term.add(t.id); setView('gallery'); },
  }, [
    el('code', { text: t.id }),
    el('span', { class: 'nm', text: t.name || (t.valid ? '' : 'unknown term') }),
    t.stance ? el('span', { class: 'st ' + t.stance, text: t.stance }) : null,
  ]);
}

function detailPanel() {
  if (!S.selected) return null;
  const d = S.detail;
  if (!d) return el('div', { class: 'panel' }, [el('div', { class: 'note', text: 'Loading…' })]);
  const r = S.refs.find((x) => x.id === d.id) || d;
  return el('div', { class: 'panel' }, [
    el('h2', { text: d.title || d.id }),
    el('div', { class: 'src', text: [d.id, d.source, d.kind].filter(Boolean).join(' · ') }),
    d.image ? shotImg('/img/' + d.image, d.title, 'shot-full') : null,

    el('h4', { text: 'My reaction' }),
    el('div', { class: 'react' }, [
      el('button', { 'aria-pressed': String(r.sam_reaction === 'like'), text: 'Like', onclick: () => react(d.id, 'like') }),
      el('button', { class: 'off', 'aria-pressed': String(r.sam_reaction === 'dislike'), text: 'Not for me', onclick: () => react(d.id, 'dislike') }),
    ]),
    el('div', { class: 'hint', text: 'A reaction never changes a facet stance on its own. The reason below is what turns a pattern into a recorded preference.' }),
    el('textarea', {
      placeholder: 'Why? One line. "the set rows read at a glance because the weight column is tabular"',
      value: r.sam_note || '',
      onchange: (e) => saveNote(d.id, e.target.value),
    }),

    el('h4', { text: 'Classification' }),
    el('dl', { class: 'kv' }, [
      el('dt', { text: 'verdict' }), el('dd', { text: d.verdict || '—' }),
      el('dt', { text: 'needs photo' }), el('dd', { text: DEP_LABEL[d.imagery_dep] || d.imagery_dep || '—' }),
      el('dt', { text: 'RTL' }), el('dd', { text: d.rtl || '—' }),
      el('dt', { text: 'cost' }), el('dd', { text: d.cost || '—' }),
      el('dt', { text: 'confidence' }), el('dd', { text: d.confidence || '—' }),
      el('dt', { text: 'status' }), el('dd', { text: d.status || '—' }),
    ]),

    d.archetypeDetail && d.archetypeDetail.length ? el('h4', { text: 'Archetype' }) : null,
    d.archetypeDetail && d.archetypeDetail.length ? el('div', { class: 'terms' }, d.archetypeDetail.map(termRow)) : null,

    el('h4', { text: `Facet terms (${(d.facetDetail || []).length})` }),
    el('div', { class: 'terms' }, (d.facetDetail || []).map(termRow)),

    el('h4', { text: 'Nearest in the library' }),
    (d.neighbours || []).length
      ? el('div', { class: 'nb' }, d.neighbours.map((n) => el('button', { onclick: () => select(n.id) }, [
        el('span', { class: 'score', text: n.score.toFixed(2) }),
        el('span', {}, [
          el('div', { class: 'who', text: n.title || n.id }),
          el('div', { class: 'shared', text: `shares ${n.shared.length}: ${n.shared.slice(0, 3).join(', ')}${n.shared.length > 3 ? '…' : ''}` }),
        ]),
      ])))
      : el('div', { class: 'note', text: 'Nothing else shares terms with this one yet.' }),

    d.read ? el('h4', { text: 'Read' }) : null,
    d.read ? el('div', { class: 'note', text: d.read }) : null,
    el('h4', { text: 'File' }),
    el('code', { class: 'path', text: d.file }),
  ]);
}

/* ---------- graph ---------- */

// Obsidian-style: full-bleed canvas, layout solved to equilibrium before the first paint,
// no perpetual animation loop (a rAF loop runs only while a drag / unpin is re-settling it).
const CONCEPTS = ['web', 'mobile', 'component', 'slide', 'imagery', 'mockup'];
const CONCEPT_COLOUR = {
  web: '#6b8cff', mobile: '#3fcf8e', component: '#b58cf0', slide: '#f06fa0', imagery: '#e6c84f', mockup: '#56c8dc',
};
const NEUTRAL_NODE = '#8e8e90';
let graphLegendOpen = true;   // kept in memory only: viewer sandboxes may block localStorage
let graphToken = 0;           // a newer graphView() invalidates an older, still-fetching startGraph()

function graphView() {
  const chip = (key, label) => el('button', {
    class: 'gchip', 'data-concept': key, 'aria-pressed': String(key === 'all'),
  }, [
    key === 'all' ? null : el('i', { style: `background:${CONCEPT_COLOUR[key]}` }),
    el('span', { text: label }),
  ]);
  const btn = (act, label, glyph) => el('button', { class: 'gbtn', 'data-act': act, title: label, 'aria-label': label, text: glyph });
  const legend = el('div', { class: 'graph-legend' + (graphLegendOpen ? '' : ' collapsed') }, [
    el('button', { class: 'glegend-head', 'aria-expanded': String(graphLegendOpen), onclick: (e) => {
      graphLegendOpen = !graphLegendOpen;
      legend.classList.toggle('collapsed', !graphLegendOpen);
      e.currentTarget.setAttribute('aria-expanded', String(graphLegendOpen));
    } }, [el('b', { text: 'Legend' }), el('span', { class: 'caret', text: '▾' })]),
    el('div', { class: 'glegend-body' }, [
      ...CONCEPTS.map((c) => el('div', { class: 'row' }, [el('i', { style: `background:${CONCEPT_COLOUR[c]}` }), el('span', { text: c })])),
      el('div', { class: 'row' }, [el('i', { class: 'ring' }), el('span', { text: 'liked' })]),
      el('div', { class: 'note', text: 'Colour = what the image depicts. A link is IDF-weighted facet-vector cosine ≥ 0.20: the two share named terms. Drag a node to pin it; double-click to release.' }),
    ]),
  ]);
  const wrap = el('div', { class: 'graph-wrap' }, [
    el('canvas', { id: 'graph' }),
    el('div', { class: 'graph-preview', style: 'display:none' }),
    el('div', { class: 'graph-chips', role: 'group', 'aria-label': 'Filter by concept' },
      [chip('all', 'All'), ...CONCEPTS.map((c) => chip(c, c))]),
    legend,
    el('div', { class: 'graph-controls' }, [
      btn('in', 'Zoom in', '+'), btn('out', 'Zoom out', '−'), btn('fit', 'Fit to view', '⤢'), btn('reset', 'Reset layout', '↺'),
    ]),
  ]);
  const token = ++graphToken;
  setTimeout(() => startGraph(wrap, token), 0);
  return wrap;
}

async function startGraph(wrap, token) {
  const canvas = $('#graph', wrap);
  let data;
  try { data = await api('/api/graph'); } catch (e) { toast(e.message, true); return; }
  // render() runs twice per view switch (see setView); only the live, newest view may draw.
  if (token !== graphToken || !wrap.isConnected) return;
  if (!data.nodes.length) {
    for (const k of [...wrap.children]) k.remove();
    wrap.appendChild(el('div', { class: 'graph-empty', text: 'No references yet — nothing to link.' }));
    return;
  }

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

  /* ----- node preview card: thumbnail + title beside the hovered node ----- */
  const preview = wrap.querySelector('.graph-preview');
  let previewNode = null;
  function showPreview(n) {
    if (!n) { preview.style.display = 'none'; previewNode = null; return; }
    if (n !== previewNode) {
      previewNode = n;
      preview.replaceChildren(
        n.image ? shotImg('/img/' + n.image, n.title || n.id) : el('div', { class: 'shot-missing', text: 'No image' }),
        el('div', { class: 'gp-meta' }, [
          el('span', { class: 'gp-dot', style: `background:${CONCEPT_COLOUR[n.g] || NEUTRAL_NODE}` }),
          el('b', { text: n.id }),
          el('span', { text: n.title || '' }),
        ]),
      );
      preview.style.display = 'block';
    }
  }
  function positionPreview() {
    if (!previewNode) return;
    const n = previewNode;
    const sx = n.x * view.k + view.x, sy = n.y * view.k + view.y;
    const pw = preview.offsetWidth, ph = preview.offsetHeight;
    let x = sx + (n.r * view.k) + 10;
    if (x + pw > W - 8) x = sx - (n.r * view.k) - 10 - pw;
    let y = sy - ph / 2;
    y = Math.max(8, Math.min(H - ph - 8, y));
    preview.style.left = Math.max(8, x) + 'px';
    preview.style.top = y + 'px';
  }

  function fitView() {
    if (!W || !H) return;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const n of nodes) { x0 = Math.min(x0, n.x - n.r); x1 = Math.max(x1, n.x + n.r); y0 = Math.min(y0, n.y - n.r); y1 = Math.max(y1, n.y + n.r); }
    const pad = W < 600 ? 36 : 80;
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
      ctx.globalAlpha = !both ? 0.04 : hover ? (lit ? 1 : 0.06) : 1;
      ctx.strokeStyle = lit ? 'rgba(242,242,243,0.85)' : `rgba(150,150,155,${0.14 + l.w * 0.4})`;
      ctx.lineWidth = (lit ? 1.6 : 0.6 + l.w * 1.2) / k;
      ctx.beginPath(); ctx.moveTo(l.s.x, l.s.y); ctx.lineTo(l.t.x, l.t.y); ctx.stroke();
    }
    for (const n of nodes) {
      const on = hover ? (n === hover || nb.has(n)) : true;
      ctx.globalAlpha = !visible(n) ? 0.1 : on ? 1 : 0.15;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = CONCEPT_COLOUR[n.g] || NEUTRAL_NODE;
      ctx.fill();
      ctx.lineWidth = 1 / k; ctx.strokeStyle = '#1b1b1d'; ctx.stroke();
      if (n.reaction === 'like') {
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r + 2.5 / k, 0, Math.PI * 2);
        ctx.lineWidth = 2 / k; ctx.strokeStyle = '#ff6b00'; ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
    // labels in screen space so text stays crisp and a constant size at any zoom
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = '11px Inter, -apple-system, sans-serif';
    ctx.textBaseline = 'middle';
    if (hover) {
      ctx.fillStyle = 'rgba(242,242,243,0.8)';
      ctx.textAlign = 'left';
      for (const n of nb) if (visible(n)) ctx.fillText(n.id, n.x * k + view.x + n.r * k + 6, n.y * k + view.y);
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
      openTimer = setTimeout(() => { setView('gallery'); select(n.id); }, 330);
    } else {
      setView('gallery'); select(n.id);
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
  if (!pending.length) {
    return el('div', { class: 'content' }, [el('div', { class: 'empty' }, [
      el('b', { text: 'Nothing waiting' }),
      el('div', { text: S.refs.length ? 'Every reference has been reviewed.' : 'The library is empty.' }),
    ])]);
  }
  return el('div', { class: 'content' }, [
    el('div', { class: 'hint info', text: `${pending.length} to review. The classification below is my proposal — correcting it, or saying why you like something, is what records your taste.` }),
    el('div', { class: 'queue' }, pending.map((r) => el('div', { class: 'qrow' }, [
      r.image ? shotImg('/img/' + r.image, r.title) : el('div'),
      el('div', {}, [
        el('div', { style: 'font-size:14px;margin-bottom:2px' }, [r.title || r.id]),
        el('div', { class: 'sub', style: 'color:#8e8e90;font-size:11px;margin-bottom:8px' },
          [[r.id, r.source, r.kind, r.archetype.join(' ')].filter(Boolean).join(' · ')]),
        el('div', { class: 'badges', style: 'margin-bottom:8px' }, [
          r.verdict ? el('span', { class: 'badge ' + r.verdict, text: r.verdict }) : null,
          el('span', { class: 'badge', text: 'photo: ' + (r.imagery_dep || '?') }),
          el('span', { class: 'badge', text: 'rtl: ' + (r.rtl || '?') }),
          el('span', { class: 'badge', text: 'cost: ' + (r.cost || '?') }),
        ]),
        el('div', { class: 'terms' }, r.facets.slice(0, 6).map((t) =>
          el('div', { class: 'term' }, [el('code', { text: t })]))),
      ]),
      el('div', {}, [
        el('div', { class: 'react' }, [
          el('button', { text: 'Like', onclick: () => react(r.id, 'like') }),
          el('button', { class: 'off', text: 'Not for me', onclick: () => react(r.id, 'dislike') }),
        ]),
        el('textarea', {
          placeholder: 'Why? (this is the evidence)',
          value: r.sam_note || '',
          onchange: (e) => saveNote(r.id, e.target.value),
        }),
        el('div', { style: 'margin-top:6px' }, [
          el('button', { class: 'clear', text: 'Open in gallery', onclick: () => { setView('gallery'); select(r.id); } }),
        ]),
      ]),
    ]))),
  ]);
}

/* ---------- candidates ---------- */

async function candidatesView() {
  const host = el('div', { class: 'content' }, [el('div', { class: 'note', text: 'Looking for patterns in your reactions…' })]);
  api('/api/candidates').then(({ candidates }) => {
    if (!candidates.length) {
      host.replaceChildren(el('div', { class: 'empty' }, [
        el('b', { text: 'No clear leanings yet' }),
        el('div', { text: 'React to more references. A term shows up here once at least 3 reactions agree on it.' }),
      ]));
      return;
    }
    host.replaceChildren(
      el('div', { class: 'hint', text: 'These are terms your reactions lean on consistently. They are candidates, not preferences — a preference needs a reason in your words. Write one and it goes to the queue for me to turn into a PREF record.' }),
      ...candidates.map((c) => {
        const box = el('textarea', { placeholder: `Why do you ${c.leaning} ${c.term}? One line in your words.` });
        return el('div', { class: 'cand' }, [
          el('div', { class: 'head' }, [
            el('code', { text: c.term }),
            el('span', { text: c.name || '' }),
            el('span', { class: 'badge ' + (c.leaning === 'like' ? 'like' : 'dislike'), text: c.leaning }),
            el('span', {
              class: 'badge ' + c.stance,
              title: c.stance === 'required'
                ? 'A constraint on the work, not a taste — a preference here would sit alongside it'
                : 'Sam’s recorded position on this term',
              text: 'stance now: ' + c.stance,
            }),
            el('span', { style: 'margin-left:auto;font-family:var(--mono);font-size:11px;color:#9a9a9c' },
              [`${c.like} like / ${c.dislike} not · ${Math.round(c.ratio * 100)}% agree`]),
          ]),
          el('div', { class: 'bar' }, [el('i', { style: `width:${Math.round(c.ratio * 100)}%` })]),
          el('div', { class: 'note', style: 'margin-bottom:8px' },
            [`From ${c.refs.length} references: ${c.refs.join(', ')}`]),
          box,
          el('div', { style: 'margin-top:6px;display:flex;gap:6px' }, [
            el('button', {
              class: 'primary', text: 'Record this reason',
              onclick: async (e) => {
                const reason = box.value.trim();
                if (!reason) { toast('A reason is the whole point — write one line.', true); return; }
                e.target.disabled = true;
                try {
                  const out = await api('/api/candidate-reason', {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({ term: c.term, leaning: c.leaning, refs: c.refs, reason }),
                  });
                  toast('Queued in ' + out.file);
                  box.value = '';
                } catch (err) { toast(err.message, true); }
                e.target.disabled = false;
              },
            }),
            el('button', {
              class: 'clear', style: 'width:auto;padding:7px 12px', text: 'See these references',
              onclick: () => { S.filters.term.clear(); S.filters.term.add(c.term); setView('gallery'); },
            }),
          ]),
        ]);
      }),
    );
  }).catch((e) => host.replaceChildren(el('div', { class: 'hint warn', text: e.message })));
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
  const host = el('div', { class: 'content' }, []);

  const paint = (data, status) => {
    const running = status && status.running;
    const n = data.count;
    const chosen = modelChoice() || (MODELS || []).find((m) => m.default)?.id || '';

    const header = el('div', { class: 'inbox-head' }, [
      el('div', {}, [
        el('h2', { class: 'inbox-title', text: n ? `${n} image${n === 1 ? '' : 's'} ready to analyse` : 'Inbox is empty' }),
        el('p', { class: 'inbox-sub' }, [
          'Press ', el('kbd', { text: 'Ctrl' }), ' + ', el('kbd', { text: 'V' }),
          ' anywhere to paste a screenshot, or drop image files onto the window.',
        ]),
      ]),
      el('button', { class: 'clear inbox-refresh', text: 'Refresh', onclick: () => refreshInbox() }),
    ]);

    const grid = n
      ? el('div', { class: 'shots' }, data.files.map((f) => el('figure', { class: 'shot-card' }, [
        el('div', { class: 'shot-img' }, [el('img', { src: f.url, alt: f.name, loading: 'lazy' })]),
        el('figcaption', {}, [
          el('span', { class: 'shot-name', title: f.name, text: f.name }),
          el('span', { class: 'shot-size', text: kb(f.size) }),
        ]),
        el('button', {
          class: 'shot-remove', title: 'Remove from the inbox', 'aria-label': `Remove ${f.name}`, text: '✕',
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
        }),
      ])))
      : el('div', { class: 'empty' }, [
        el('b', { text: 'Nothing waiting' }),
        el('div', { text: 'Paste or drop a screenshot and it will appear here before anything is analysed.' }),
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
        class: 'primary',
        text: running ? 'Analysing…' : n ? `Analyse ${n} image${n === 1 ? '' : 's'}` : 'Nothing to analyse',
        disabled: running || !n,
        onclick: async () => {
          try {
            const out = await api('/api/ingest', {
              method: 'POST', headers: { 'content-type': 'application/json' },
              body: JSON.stringify({ model: chosen }),
            });
            if (!out.ok) { toast(out.error, true); return; }
            toast(`Analysing ${out.count} image${out.count === 1 ? '' : 's'} — this takes a few minutes.`);
            pollIngest();
            refreshInbox();
          } catch (e) { toast(e.message, true); }
        },
      }),
    ]);

    const explain = el('p', { class: 'inbox-foot' }, [
      'Runs ', el('code', { class: 'path', text: 'claude -p /design-ingest' }),
      ' on your plan: it reads each image, proposes a classification and leaves a record in the Queue for you to react to. ',
      'If the CLI cannot sign in on its own, run ', el('code', { class: 'path', text: '/design-ingest' }),
      ' inside a Claude Code session instead.',
    ]);

    // replaceChildren() stringifies a null argument into the text "null", so filter first.
    host.replaceChildren(...[
      header,
      grid,
      controls,
      explain,
      status && status.code !== null && status.code !== undefined && !running
        ? el('div', { class: 'hint ' + (status.code === 0 ? 'info' : 'warn') },
          [status.code === 0
            ? `Last run finished${status.model ? ' on ' + status.model : ''}. Check the Queue tab.`
            : (status.hint || `Last run failed (exit ${status.code}). Run /design-ingest inside a Claude Code session instead.`)])
        : null,
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
      paint(data, status);
      await loadOverview();
      renderStats();
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
        if (S.view === 'inbox') render();
        toast(s.code === 0 ? 'Ingest finished — references are in the Queue.' : 'Ingest ended with errors; see the Inbox tab.', s.code !== 0);
      }
    } catch { clearInterval(pollTimer); }
  }, 4000);
}

/* ---------- render ---------- */

function renderContent() {
  const content = $('#main .content, #main .graph-wrap');
  if (S.view === 'gallery' && content) {
    content.replaceWith(galleryContent());
    return true;
  }
  return false;
}

function render() {
  const main = $('#main');
  renderStats();
  if (S.view === 'gallery') {
    main.className = 'with-rail' + (S.selected ? ' detail-open' : '');
    main.replaceChildren(rail(), galleryContent(), detailPanel() || document.createComment(''));
    return;
  }
  main.className = '';
  const view = S.view === 'graph' ? graphView()
    : S.view === 'queue' ? queueView()
      : S.view === 'inbox' ? inboxView()
        : el('div', { class: 'content' }, [el('div', { class: 'note', text: 'Loading…' })]);
  main.replaceChildren(view);
  if (S.view === 'candidates') candidatesView().then((node) => main.replaceChildren(node));
}

/* ---------- data ---------- */

async function loadOverview() { S.overview = await api('/api/overview'); }
async function loadRefs() { S.refs = (await api('/api/refs')).refs; }
async function loadAll() {
  try { await Promise.all([loadOverview(), loadRefs()]); }
  catch (e) { toast('Cannot reach the studio server: ' + e.message, true); }
}

/* ---------- upload: drop and paste ---------- */

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
    renderStats();
    if (S.view === 'inbox') render();
  }
  return ok;
}

let dragDepth = 0;
window.addEventListener('dragenter', (e) => { e.preventDefault(); dragDepth++; document.body.classList.add('dragging'); });
window.addEventListener('dragleave', (e) => { e.preventDefault(); if (--dragDepth <= 0) { dragDepth = 0; document.body.classList.remove('dragging'); } });
window.addEventListener('dragover', (e) => e.preventDefault());
window.addEventListener('drop', async (e) => {
  e.preventDefault();
  dragDepth = 0;
  document.body.classList.remove('dragging');
  await uploadFiles([...(e.dataTransfer.files || [])], false);
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

for (const b of document.querySelectorAll('nav button')) {
  b.addEventListener('click', () => setView(b.dataset.view));
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && S.selected) { S.selected = null; S.detail = null; render(); }
});

loadAll().then(render);
