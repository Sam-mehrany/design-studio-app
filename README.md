# Design Studio

A design-reference library that thinks in **concepts**, not folders.

Design Studio is a personal library for the designs you collect — landing pages,
app screens, components, slides, photos, 3D renders, device mockups — analysed on
a shared vocabulary, linked by similarity, and browsable as a gallery and as a
graph. It is built for designers who want their references to stay searchable and
arguable, not piled in a folder called `inspo-final-v2`.

It is not a moodboard app and not a Figma plugin. It is a small local app around a
plain-text vault: every reference is a Markdown file, every judgement is a facet
term, and Git is the version history.

## What it does

- **Overview** — a dashboard of the library: review progress, liked share,
  RTL-clean and photo-independent shares as gauges, the library by concept,
  the most-collected archetypes, the newest references up for review and your
  liked references. Every tile links into a filtered gallery.
- **Gallery** — every reference as a card, with its verdict (`adopt` / `adapt` /
  `reject`), its archetype, and its concept. Filter by archetype, verdict, kind,
  imagery dependency, RTL survivability, or cost.
- **Graph** — an Obsidian-style graph of the whole library. Nodes are references,
  edges are measured similarity. The graph is full-bleed, has no entrance
  animation, and every node is draggable — drag one to pin it where you want it.
  Colour is the concept: web, mobile, component, slide, imagery, mockup.
  Hover a node (desktop) or press it (phone) and a preview card appears with the
  thumbnail, title, concept, verdict and link count.
- **Queue** — references that have been analysed but not yet reviewed. Reviewing
  is where taste gets recorded: what you like becomes a preference record, with
  evidence, not a vibe.
- **Inbox** — drop images here and Muse analyses them into the library (see
  [SETUP-MUSE.md](SETUP-MUSE.md)).
- **Candidates** — preference statements waiting to be written up from your
  review reasons.

### Concept grouping — why the graph finally makes sense

Every reference carries a `concept:` field stating what artefact the image
depicts: `web`, `mobile`, `component`, `slide`, `imagery`, or `mockup`. A computer,
phone or tablet shown in an environment is a **mockup**, not the UI on its screen —
a laptop showing a landing page is a mockup, not web. A slide showing a dashboard
is a slide, not a landing.

The graph groups by concept first. Similarity in `design/tools/lib.js` weights the
concept at **7.0**, the screen archetype at **2.5**, and discounts cross-concept
pairs by **×0.4**, so a slide and a landing with the same type and accent no longer
link just because they look alike.

Verified on 25 Nov 2026, on the library shipped with this repo:

| Concept | Refs |
|---|---:|
| Web | 17 |
| Mobile | 8 |
| Component | 15 |
| Slide | 3 |
| Imagery | 19 |
| Mockup | 28 |
| **Total** | **90** |

**319 graph edges, 1 cross-concept link** — REF-0094 (a slide) to REF-0047 (web),
which is honest: REF-0094 is a screenshot of the gallery showing REF-0047. Before
concept grouping there were 121 cross-concept links out of 279 edges.

## How it works, technically

- **No database.** The vault is files: Markdown records with YAML frontmatter
  (`design/references/REF-NNNN-*.md`), a 12-facet taxonomy (`design/facets/`
  A–L: style, structure, colour, typography, shape, imagery, motion, content,
  components, archetypes, platform, evaluation), preference records
  (`design/preferences/PREF-NNNN.md`) and decision records
  (`design/decisions/DDR-NNNN.md`). The model is documented in
  [`design/00-model.md`](design/00-model.md).
- **Similarity is measured, not guessed.** `design/tools/lib.js` builds an
  IDF-weighted facet vector per reference and links pairs whose cosine similarity
  clears a 0.25 threshold (max 4 edges per node). Concept and archetype are
  heavy pseudo-terms in that vector.
- **Zero-dependency server.** `design/tools/studio.js` is plain Node — no
  framework, no database — serving the UI and a JSON API on port **7391**, bound
  to `127.0.0.1` only. Writes require the `X-Studio` header plus Host/Origin
  checks, so a page in another browser cannot write to your library.
- **Electron shell.** `main.js` forks the server with Electron's bundled Node and
  opens it as a desktop window. No separate Node install is needed for the
  packaged app. `npm run dist` builds a Windows installer (NSIS).
- **Git is the backup.** The vault is a git repo. Ingest commits after a batch;
  every reference, preference and decision is diffable text.
- **Muse AI does the analysis.** Drop images in `design/references/inbox/` and
  Muse (via Claude Code) classifies each one with the ingest skill in
  `design/tools/design-ingest-SKILL.md`: concept first, then archetype, then
  facets A–H — with measured values (real hex codes, real contrast ratios)
  instead of adjectives. Records land `unreviewed`; nothing becomes a stated
  preference until you review it.
- **Claude connects over MCP.** The same tools are served over stdio
  (`design/tools/design-mcp.js`, for Claude Code or Claude Desktop beside the vault)
  and over HTTP at `/mcp` on the running studio (for claude.ai, cloud sessions and the
  phone, guarded by `STUDIO_MCP_TOKEN`). Claude can query the library, look at the
  images, and record your reactions and reasons. Setup for every client:
  [MCP.md](MCP.md).
- **Phone use.** The same vault can be served to a Muse Space through a host
  bridge — one vault, no separate copy. See [SETUP-MUSE.md](SETUP-MUSE.md).

## Quick start

```bash
git clone https://github.com/Sam-mehrany/design-studio-app.git
cd design-studio-app
npm install        # once (installs Electron + electron-builder for the desktop app)
npm run sync       # copy the server out of design/tools/ into server/
npm run serve      # start the server on http://127.0.0.1:7391
```

Open <http://127.0.0.1:7391> in a browser. For the desktop app instead:

```bash
npm start          # unpackaged Electron window
npm run dist       # Windows installer -> dist/Design Studio Setup <version>.exe
```

**Full guide for a new Muse AI account — including how Muse analyses images,
how the graph works, and troubleshooting — is in
[SETUP-MUSE.md](SETUP-MUSE.md).** It also covers macOS/Linux, where to point the
app at your own vault, and what to do when the port is busy.

## Add your own references

1. Drop image files into `design/references/inbox/`.
2. Ask Muse to ingest them (it follows `design/tools/design-ingest-SKILL.md`).
3. Review them in the Queue view. What you like or reject becomes a PREF record
   with your words as evidence.
4. Commit: the vault is a git repo, so `git add design && git commit` is the
   backup.

## About the library in this repo

This repo ships the code, the taxonomy, and the **90 text reference records**
analysed from Sam Mehrany's own collection — so you can open it and see a real,
working library, not an empty shell.

It does **not** ship the 90 reference images (about 16 MB of PNG/JPG files).
They are other designers' published work, collected as screenshots, and they are
not included in this push. After cloning, the gallery shows an
"Image not in this copy" placeholder for images you don't have. The intended
start for a new designer is: clone, run it, drop **your own** images into
`design/references/inbox/` and let Muse ingest them.

If you are Sam, running this from the original Windows machine: a normal
`git push` from that machine carries the full library including images, because
that machine holds the full history.

## Sam's setup, as one example

Sam runs the live vault from a folder on his Windows machine (in his case
`D:\Memory\design`) and keeps this repo as a snapshot of it, refreshed with
`node sync-design.js` before a push. You don't need that layout — the `design/`
folder shipped in this repo *is* a complete vault, and the app falls back to it
when no other vault is found. Point the app at your own folder with the
`DESIGN_VAULT` environment variable or **File → Change library folder…** in the
desktop app.

## License

MIT — see [LICENSE](LICENSE). Copyright 2026 Sam Mehrany.
