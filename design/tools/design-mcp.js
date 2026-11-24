#!/usr/bin/env node
/**
 * design-mcp — an MCP server over the design taxonomy and taste database.
 *
 * Zero dependencies on purpose: it speaks newline-delimited JSON-RPC on stdio and
 * reads the vault's markdown directly, so there is nothing to install, pin or update.
 *
 * Root resolves to this file's parent folder (design/), overridable with DESIGN_VAULT.
 */

'use strict';
const lib = require('./lib.js');
const {
  ROOT, FACET_NAMES, read, facetFile, parseFacet, allTerms,
  records, section,
} = lib;

const firstPara = (body) => {
  const m = body.match(/^\*\*The preference\.\*\*\s*([\s\S]*?)\n\n/m)
    || body.match(/\n\n([^#*][\s\S]*?)\n\n/);
  return m ? ' ' + m[1].replace(/\s+/g, ' ').trim() : '';
};

/* ---------- tools ---------- */

const TOOLS = [
  { name: 'design_overview',
    description: 'Start here. The design database primer: the twelve facets, every recorded preference in one line each, the decision records, and the available briefs. Cheap — read this before any design work rather than loading the facet files.',
    inputSchema: { type: 'object', properties: {} } },
  { name: 'design_facet',
    description: "One facet's full vocabulary: its dimensions, every term with its definition, and Sam's stance (likes / rejects / conditional / unknown). Pass the letter A–L.",
    inputSchema: { type: 'object', properties: { facet: { type: 'string', description: 'Facet letter A–L' }, stance: { type: 'string', description: 'Optional filter: likes | rejects | conditional | unknown' } }, required: ['facet'] } },
  { name: 'design_terms',
    description: 'Search the whole vocabulary by substring across term IDs, names and definitions. Use when you know the concept but not the term ID.',
    inputSchema: { type: 'object', properties: { query: { type: 'string' }, limit: { type: 'number' } }, required: ['query'] } },
  { name: 'design_validate',
    description: 'Validate facet term IDs against the vocabulary before writing them into a record or a brief. Guards against drift and invented terms. Returns unknown IDs with near-miss suggestions.',
    inputSchema: { type: 'object', properties: { terms: { type: 'array', items: { type: 'string' } } }, required: ['terms'] } },
  { name: 'design_prefs',
    description: "Sam's recorded design preferences, with the evidence behind each. Filterable by polarity or facet term. Read these before proposing any visual treatment.",
    inputSchema: { type: 'object', properties: { polarity: { type: 'string', description: 'like | reject | conditional' }, facet: { type: 'string', description: 'Facet term or prefix, e.g. C.PAL or E.ACC.side-stripe' }, full: { type: 'boolean', description: 'Include the full body of each record' } } } },
  { name: 'design_brief',
    description: 'A surface brief: its DNA string, constraints, archetypes in priority order and explicit reject line. Call with no id to list the briefs.',
    inputSchema: { type: 'object', properties: { id: { type: 'string' } } } },
  { name: 'design_refs',
    description: 'Query the analysed reference library by archetype, verdict, kind, imagery dependency, RTL survivability, cost, review status or facet term.',
    inputSchema: { type: 'object', properties: { archetype: { type: 'string' }, verdict: { type: 'string' }, kind: { type: 'string' }, imagery_dep: { type: 'string' }, rtl: { type: 'string' }, cost: { type: 'string' }, status: { type: 'string' }, sam_reaction: { type: 'string', description: 'like | dislike' }, facet: { type: 'string' }, limit: { type: 'number' } } } },
  { name: 'design_candidates',
    description: "Preferences waiting to be written up: reasons Sam gave in the studio (evidence, ready to become PREF records) and, separately, the facet terms his reactions lean on (not evidence). Check this before design work — a queued reason is a preference he has already stated.",
    inputSchema: { type: 'object', properties: {} } },
  { name: 'design_record',
    description: 'The full text of one record by ID — PREF-0002, DDR-0001, REF-0014, BRIEF-training-athlete-pwa.',
    inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
  { name: 'design_rubric',
    description: 'The evaluation rubric (facet L) and the critique output format. Use when judging a design against a brief.',
    inputSchema: { type: 'object', properties: {} } },
];

function toolOverview() {
  const L = [];
  L.push('# Design database — primer');
  L.push('');
  L.push(`Root: ${ROOT}`);
  L.push('A faceted UI design taxonomy plus Sam\'s evidenced taste record. Grammar: 00-model.md.');
  L.push('');
  L.push('## The twelve facets');
  for (const [k, v] of Object.entries(FACET_NAMES)) {
    if (k === 'L') { L.push(`- **L** ${v} — 11 scored dimensions and the critique format  (design_rubric)`); continue; }
    const f = parseFacet(k);
    const n = f ? f.dimensions.reduce((a, d) => a + d.terms.length, 0) : 0;
    L.push(`- **${k}** ${v} — ${f ? f.dimensions.length : 0} dimensions, ${n} terms  (design_facet "${k}")`);
  }
  L.push('');
  L.push('## Term ID grammar');
  L.push('`<facet>.<dimension>.<term>` — e.g. `C.PAL.single-accent`, `B.DEN.dense`, `E.DEP.border-only`.');
  L.push('Validate every ID with design_validate before writing it anywhere.');
  L.push('');
  const prefs = records('design-pref');
  L.push(`## Recorded preferences (${prefs.length})`);
  for (const p of prefs) L.push(`- **${p.id}** [${p.polarity}] ${p.title} — *scope: ${p.scope}*`);
  L.push('');
  const ddrs = records('design-ddr');
  L.push(`## Decisions (${ddrs.length})`);
  for (const d of ddrs) L.push(`- **${d.id}** [${d.status}] ${d.title} — *${d.scope}*`);
  L.push('');
  const briefs = records('design-brief');
  L.push(`## Briefs (${briefs.length})`);
  for (const b of briefs) L.push(`- **${b.id}** ${b.project} / ${b.surface} [${b.status}]\n  DNA: ${b.dna}`);
  L.push('');
  const refs = records('design-ref');
  const unrev = refs.filter((r) => r.status === 'unreviewed').length;
  L.push(`## Reference library`);
  L.push(`${refs.length} analysed references, ${unrev} awaiting review.`);
  const queued = lib.readQueue().length;
  if (queued) {
    L.push('');
    L.push(`**${queued} reason${queued === 1 ? '' : 's'} awaiting write-up** — Sam has stated `
      + 'these preferences but they are not PREF records yet. Call design_candidates.');
  }
  L.push('');
  L.push('## The two rules');
  L.push('1. **Evidence or unknown.** A stance is `likes`/`rejects` only from something Sam actually said or rejected — never from inference. `unknown` is the honest default and the backlog.');
  L.push('2. **Taste decides between survivors, not what survives.** A pattern is admitted by appearing in 3+ shipped products, by answering a named constraint, or as a written differentiation call with its cost stated. Liking it only chooses among those.');
  return L.join('\n');
}

function toolFacet(a) {
  const f = parseFacet(String(a.facet || '').trim().charAt(0));
  if (!f) return `Unknown facet "${a.facet}". Valid: ${Object.keys(FACET_NAMES).join(', ')}`;
  const want = a.stance ? String(a.stance).toLowerCase() : null;
  const L = [`# Facet ${f.letter} — ${f.name}`, `Source: facets/${f.file}`, ''];
  for (const d of f.dimensions) {
    const terms = want ? d.terms.filter((t) => t.stance === want) : d.terms;
    if (!terms.length) continue;
    L.push(`## ${d.id} — ${d.name}`);
    for (const t of terms) {
      const st = t.stance ? ` [${t.stance}${t.stance_note ? ': ' + t.stance_note : ''}]` : '';
      L.push(`- \`${t.id}\` **${t.name}** — ${t.definition}${st}`);
    }
    L.push('');
  }
  if (f.open_questions.length && !want) {
    L.push('## Open questions'); for (const q of f.open_questions) L.push(`- ${q}`);
  }
  return L.join('\n');
}

function toolTerms(a) {
  const q = String(a.query || '').toLowerCase();
  const hits = allTerms().filter((t) => (t.id + ' ' + t.name + ' ' + t.definition).toLowerCase().includes(q)).slice(0, a.limit || 40);
  if (!hits.length) return `No terms matching "${a.query}".`;
  return hits.map((t) => `\`${t.id}\` **${t.name}** (${t.facet}/${t.dimension}) — ${t.definition}${t.stance ? ` [${t.stance}]` : ''}`).join('\n');
}

function toolValidate(a) {
  const known = new Map(allTerms().map((t) => [t.id.toLowerCase(), t]));
  const ok = [], bad = [];
  for (const raw of a.terms || []) {
    const id = String(raw).replace(/`/g, '').trim();
    const hit = known.get(id.toLowerCase());
    if (hit) ok.push(`\`${hit.id}\` ${hit.name}${hit.stance ? ` [${hit.stance}]` : ''}`);
    else {
      const tail = id.split('.').pop().toLowerCase();
      const near = [...known.values()].filter((t) => t.id.toLowerCase().includes(tail) || t.name.toLowerCase().includes(tail)).slice(0, 4).map((t) => t.id);
      bad.push(`\`${id}\` UNKNOWN${near.length ? ` — did you mean: ${near.join(', ')}` : ''}`);
    }
  }
  return [bad.length ? `## ${bad.length} unknown\n` + bad.join('\n') : '## All terms valid', ok.length ? `\n## ${ok.length} valid\n` + ok.join('\n') : ''].join('\n').trim();
}

function toolPrefs(a) {
  let list = records('design-pref');
  if (a.polarity) list = list.filter((p) => String(p.polarity).toLowerCase() === String(a.polarity).toLowerCase());
  if (a.facet) { const f = String(a.facet).toLowerCase(); list = list.filter((p) => (p.facets || []).some((t) => String(t).toLowerCase().startsWith(f))); }
  if (!list.length) return 'No preference records match.';
  return list.map((p) => {
    const head = `## ${p.id} — ${p.title}\n**${p.polarity}** · scope: ${p.scope} · evidence: ${p.evidence_date}\nterms: ${(p.facets || []).join(', ') || '(none — governs all)'}`;
    if (a.full) return head + '\n\n' + p._body;
    const why = section(p._body, 'Why') || '';
    const ev = (p._body.match(/^\*\*Evidence:\*\*\s*(.+)$/m) || [])[1] || '';
    return head + (ev ? `\nEvidence: ${ev}` : '') + firstPara(p._body) + (why ? `\nWhy: ${why.replace(/\s+/g, ' ').slice(0, 300)}` : '');
  }).join('\n\n');
}

function toolBrief(a) {
  const list = records('design-brief');
  if (!a.id) {
    if (!list.length) return 'No briefs yet.';
    return list.map((b) => `- **${b.id}** ${b.project}/${b.surface} [${b.status}]\n  ${b.dna}`).join('\n');
  }
  const b = list.find((x) => String(x.id).toLowerCase() === String(a.id).toLowerCase() || String(x._file).toLowerCase().includes(String(a.id).toLowerCase()));
  return b ? `# ${b.id}\n\n${b._body}` : `No brief "${a.id}". Available: ${list.map((x) => x.id).join(', ')}`;
}

function toolRefs(a) {
  let list = records('design-ref');
  const eq = (k) => { if (a[k]) { const v = String(a[k]).toLowerCase(); list = list.filter((r) => String(r[k] || '').toLowerCase() === v); } };
  ['verdict', 'kind', 'imagery_dep', 'rtl', 'cost', 'status', 'sam_reaction'].forEach(eq);
  if (a.archetype) { const v = String(a.archetype).toLowerCase(); list = list.filter((r) => (r.archetype || []).some((x) => String(x).toLowerCase().startsWith(v))); }
  if (a.facet) { const v = String(a.facet).toLowerCase(); list = list.filter((r) => (r.facets || []).some((x) => String(x).toLowerCase().startsWith(v))); }
  if (!list.length) return records('design-ref').length ? 'No references match those filters.' : 'The reference library is empty — nothing has been ingested yet.';
  return `${list.length} match:\n\n` + list.slice(0, a.limit || 40).map((r) => {
    const reaction = r.sam_reaction ? ` · Sam: ${r.sam_reaction}` : '';
    const note = r.sam_note ? `\n  Sam's words: "${r.sam_note}"` : '';
    return `- **${r.id}** ${r.title} (${r.kind}) — ${(r.archetype || []).join(', ')}\n`
      + `  verdict: ${r.verdict} · photo-dep: ${r.imagery_dep} · rtl: ${r.rtl} · cost: ${r.cost} · ${r.status}${reaction}\n`
      + `  terms: ${(r.facets || []).join(', ')}${note}\n  file: ${r._file}`;
  }).join('\n');
}

function toolCandidates() {
  const queued = lib.readQueue();
  const leanings = lib.candidatePrefs(records('design-ref'), 3, 0.7);
  const L = [];
  L.push(`# Candidate preferences`);
  L.push('');
  L.push(`## Reasons awaiting write-up (${queued.length})`);
  L.push('');
  L.push('**This is evidence.** Sam gave these reasons in the studio; each one is ready to');
  L.push('become a PREF record. Nothing else here counts as evidence.');
  L.push('');
  if (!queued.length) L.push('_Nothing queued._');
  for (const q of queued) {
    L.push(`- \`${q.term}\` · leaning **${q.leaning}** · ${q.date}`);
    L.push(`  > ${q.reason.replace(/\n/g, '\n  > ')}`);
    L.push(`  from: ${q.refs.join(', ') || '(no refs recorded)'}`);
  }
  L.push('');
  L.push(`## Computed leanings (${leanings.length}) — NOT evidence`);
  L.push('');
  L.push('Terms his reactions agree on. These only say where it is worth asking him for a');
  L.push('reason; they never justify a stance on their own.');
  L.push('');
  if (!leanings.length) L.push('_No clear leanings yet._');
  for (const c of leanings) {
    L.push(`- \`${c.term}\` ${c.name ? '(' + c.name + ')' : ''} — leans **${c.leaning}**, `
      + `${c.like} like / ${c.dislike} not, ${Math.round(c.ratio * 100)}% agree · stance now: ${c.stance}`);
  }
  return L.join('\n');
}

function toolRecord(a) {
  const id = String(a.id || '').toLowerCase();
  for (const kind of ['design-pref', 'design-ddr', 'design-ref', 'design-brief']) {
    const hit = records(kind).find((r) => String(r.id).toLowerCase() === id);
    if (hit) return `# ${hit.id} — ${hit.title}\nfile: ${hit._file}\n\n${hit._body}`;
  }
  return `No record "${a.id}".`;
}

function toolRubric() {
  const t = read(facetFile('L'));
  return t || 'Rubric file missing.';
}

const DISPATCH = {
  design_overview: toolOverview, design_facet: toolFacet, design_terms: toolTerms,
  design_validate: toolValidate, design_prefs: toolPrefs, design_brief: toolBrief,
  design_refs: toolRefs, design_record: toolRecord, design_rubric: toolRubric,
  design_candidates: toolCandidates,
};

/* ---------- JSON-RPC over stdio ---------- */

let PROTOCOL = '2024-11-05';
const send = (msg) => process.stdout.write(JSON.stringify(msg) + '\n');
const ok = (id, result) => send({ jsonrpc: '2.0', id, result });
const err = (id, code, message) => send({ jsonrpc: '2.0', id, error: { code, message } });

function handle(msg) {
  const { id, method, params } = msg;
  if (method === 'initialize') {
    if (params && params.protocolVersion) PROTOCOL = params.protocolVersion;
    return ok(id, { protocolVersion: PROTOCOL, capabilities: { tools: {} }, serverInfo: { name: 'design-mcp', version: '1.0.0' } });
  }
  if (method === 'notifications/initialized' || method === 'notifications/cancelled') return;
  if (method === 'ping') return ok(id, {});
  if (method === 'tools/list') return ok(id, { tools: TOOLS });
  if (method === 'resources/list') return ok(id, { resources: [] });
  if (method === 'prompts/list') return ok(id, { prompts: [] });
  if (method === 'tools/call') {
    const fn = DISPATCH[params && params.name];
    if (!fn) return err(id, -32602, `Unknown tool: ${params && params.name}`);
    try {
      const text = fn((params && params.arguments) || {});
      return ok(id, { content: [{ type: 'text', text: String(text) }] });
    } catch (e) {
      return ok(id, { content: [{ type: 'text', text: `Error: ${e.message}` }], isError: true });
    }
  }
  if (id !== undefined) return err(id, -32601, `Method not found: ${method}`);
}

let buf = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  buf += chunk;
  let nl;
  while ((nl = buf.indexOf('\n')) !== -1) {
    const line = buf.slice(0, nl).trim();
    buf = buf.slice(nl + 1);
    if (!line) continue;
    try { handle(JSON.parse(line)); }
    catch (e) { process.stderr.write(`parse error: ${e.message}\n`); }
  }
});
process.stdin.on('end', () => process.exit(0));
