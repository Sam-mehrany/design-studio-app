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

## What is it? — nature before style

The first thing the studio decides about a reference is **what kind of thing the
picture is**, because a footer, a full landing page and a 3D render of a laptop
showing that landing page are three different references even when the pixels on
the screen match. Four fields, defined in [`design/nature.md`](design/nature.md):

| Field | Answers | Values |
|---|---|---|
| `concept` | What artefact is depicted? | web · mobile · component · slide · imagery · mockup |
| `component_type` | Which component? (only for components) | 34 `I.TYPE` terms — footer, navbar, sidebar, hero, pricing card, stat card, auth form, mobile widget, modal, bottom sheet… ([facet I](design/facets/I-components.md)) |
| `medium` | How was the image made? | flat-ui · 3d-render · photo · composite · ai-generated · illustration |
| `platform` | What is the UI designed for? | desktop · mobile · tablet · watch · multi · none |

So "a mockup idea drafted in 3D software" is `concept: mockup, medium: 3d-render`;
"a widget for a mobile app" is `concept: component, component_type: I.TYPE.widget,
platform: mobile`. Each record opens with a `## Nature` section giving the visual
evidence for each field, so a classification is checkable — and when you change
one in the studio, the record becomes `corrected` and future analyses follow it.

Shipped library, after the 27 Nov 2026 backfill: 33 components (8 footers, 7 auth
forms, 4 profile cards, 4 cards, …), 42 mockups (33 rendered, 8 photographed, 1
AI-generated), 11 web, 11 imagery, 2 mobile, 1 slide.

## The vector database

Every reference is a point in a vector database with two named vectors — **image**
(the picture itself) and **text** (its nature, title, terms and full analysis) —
and a payload of its nature fields, verdict and review status. That is what powers:

- **Search by meaning** — type in the Gallery search and press Enter: "dark footer
  with a giant ghost wordmark", "3D render of a phone on stone". Rail filters
  (component type, medium…) apply on top.
- **Looks like** — the detail panel shows the nearest references by the picture.
- **Duplicates** — at ingest, a new image that matches an existing one is flagged.
- **Precedent** — the analyser is shown the most similar references already in the
  library (corrected ones first), so the 50th footer is filed like the first.

Two interchangeable backends (`design/tools/vectordb.js`):

- **local** (default) — an embedded store in `design/.vectors/`: Float32 matrices
  plus a JSON payload file, exact cosine search with payload filters. Nothing to
  install or run. Exact search beats an ANN index at personal-library scale.
- **qdrant** — set `QDRANT_URL` (and `QDRANT_API_KEY` for Qdrant Cloud) and the
  same index lives in Qdrant with named vectors and keyword payload indexes.
  `docker run -p 6333:6333 qdrant/qdrant` is enough locally.

Embeddings come from the first available of:

- **Voyage** `voyage-multimodal-3.5` (`VOYAGE_API_KEY`) — images and text in one
  space, so a text query can find a picture. Needed for image similarity and
  duplicate detection.
- **A local embedding model** (`embed.localModel`, e.g. `nomic-embed-text` in
  Ollama) — free and offline, text only.
- **Hashed keywords** — no setup at all, lexical rather than semantic. The UI says
  "ranked by keywords" when this is what you have.

The markdown records stay the source of truth; the vector store is derived data
that syncs itself (only new or changed references are embedded — text and image
are hashed separately, so editing a note never re-pays for an image). Rebuild it
any time: `node design/tools/vindex.js --rebuild`.

## Analysis: Claude or a model on your own machine

Drop images into the Inbox and pick who analyses them:

| Analyser | Cost | Notes |
|---|---|---|
| Claude Opus 5.5 | $4 / $20 per M tokens | deepest read; default when `ANTHROPIC_API_KEY` is set |
| Claude Sonnet 5.5 | $2 / $10 | faster |
| Claude Haiku 5.5 | $0.10 / $0.50 | cheapest Claude |
| **Local vision model** | free | anything Ollama / LM Studio / llama.cpp / vLLM serves; listed automatically |
| Hark | — | analysed in your chat, as before |

Whatever the model, the pipeline around it is the same: the image is downscaled to
an API-safe copy (the library keeps the original), its **palette and contrast are
measured off the pixels** and handed to the model as fact, the answer is
schema-constrained JSON, every term is validated against the facet tables (unknown
ones become proposals in Notes, never terms), and the record lands `unreviewed`.
The measurement matters most for small local models, which guess hex values badly.

**Running locally with Ollama:**

```bash
ollama pull qwen2.5vl:7b          # or a larger vision model if your GPU has room: qwen2.5vl:32b, gemma3:27b
ollama pull nomic-embed-text      # optional: local embeddings for search
```

The Inbox lists every vision model Ollama has. To make one the default and use
local embeddings, create `design/studio.config.json`:

```json
{
  "analysis": { "provider": "local" },
  "local":    { "url": "http://127.0.0.1:11434", "model": "qwen2.5vl:7b", "contextTokens": 16384 },
  "embed":    { "provider": "local", "localModel": "nomic-embed-text" }
}
```

Every setting also has an environment variable (`STUDIO_ANALYSER`,
`STUDIO_LOCAL_URL`, `STUDIO_LOCAL_MODEL`, `STUDIO_EMBED`, `STUDIO_EMBED_MODEL`,
`STUDIO_VECTOR_DB`, `QDRANT_URL` — see `design/tools/config.js`). **API keys are
read from the environment only** (`ANTHROPIC_API_KEY`, `VOYAGE_API_KEY`,
`QDRANT_API_KEY`), never from the config file, because the vault is a git repo.

From a terminal:

```bash
node design/tools/analyse.js --list                     # what can analyse here
node design/tools/analyse.js --with local:qwen2.5vl:7b  # analyse the inbox
node design/tools/analyse.js --nature REF-0037          # re-decide only the nature fields
node design/tools/vindex.js search "pricing card with a big numeral" --type I.TYPE.pricing-card
```

## How it works, technically

- **Files first.** The vault is files: Markdown records with YAML frontmatter
  (`design/references/REF-NNNN-*.md`), a 12-facet taxonomy (`design/facets/`
  A–L: style, structure, colour, typography, shape, imagery, motion, content,
  components, archetypes, platform, evaluation), preference records
  (`design/preferences/PREF-NNNN.md`) and decision records
  (`design/decisions/DDR-NNNN.md`). The model is documented in
  [`design/00-model.md`](design/00-model.md). The vector database above is derived
  from them and can be deleted and rebuilt at any time.
- **Similarity is measured, not guessed.** `design/tools/lib.js` builds an
  IDF-weighted facet vector per reference and links pairs whose cosine similarity
  clears a 0.25 threshold (max 4 edges per node). Concept and archetype are
  heavy pseudo-terms in that vector.
- **Small server.** `design/tools/studio.js` is plain Node — no framework —
  serving the UI and a JSON API on port **7391**, bound
  to `127.0.0.1` only. Writes require the `X-Studio` header plus Host/Origin
  checks, so a page in another browser cannot write to your library. Browsing
  needs no npm packages; analysis loads the Anthropic SDK and two pure-JS image
  codecs (`jpeg-js`, `pngjs`) on first use — nothing native to rebuild.
- **Electron shell.** `main.js` forks the server with Electron's bundled Node and
  opens it as a desktop window. No separate Node install is needed for the
  packaged app. `npm run dist` builds a Windows installer (NSIS).
- **Git is the backup.** The vault is a git repo. Ingest commits after a batch;
  every reference, preference and decision is diffable text.
- **Or Muse in your chat.** Drop images in `design/references/inbox/` and
  Muse (via Claude Code) classifies each one with the ingest skill in
  `design/tools/design-ingest-SKILL.md`: concept first, then archetype, then
  facets A–H — with measured values (real hex codes, real contrast ratios)
  instead of adjectives. Records land `unreviewed`; nothing becomes a stated
  preference until you review it.
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
2. In the Inbox, pick an analyser (Claude, a local model, or Hark/Muse in your
   chat) and press Analyse.
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

**Bringing new studio code into a live vault.** `sync-design.js` normally copies
vault → repo, so pull the repo and install its code into the vault *first*, or the
next snapshot would overwrite the new code with the vault's old copy:

```bash
npm install                                   # the SDK and image codecs, once
node sync-design.js --to-vault --check        # see what it would change
node sync-design.js --to-vault                # tools/, nature.md, the template; patches facet I
cd D:\Memory\design && node tools/backfill-nature.js   # nature fields for REF-0001..0101
```

`--to-vault` never touches a record, preference, decision or stance, and inserts
the `I.TYPE` table into the vault's facet I instead of replacing the file. The
backfill only fills empty fields and leaves any record you corrected alone.

## License

MIT — see [LICENSE](LICENSE). Copyright 2026 Sam Mehrany.
