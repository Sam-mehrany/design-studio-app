# The harness

Five pieces that turn the markdown database into something you browse, feed and query.
Built 29 Oct 2026, the studio added 24 Nov 2026. Nothing here needs a package installed.

```
design-studio    the interface: gallery, filters, graph, queue  tools/studio.js + tools/ui/
Obsidian Bases   the same data inside Obsidian                  views/*.base
/design-ingest   analyse images into REF records                ~/.claude/skills/design-ingest/
design-db MCP    Claude queries and annotates the database      tools/mcp-tools.js (stdio + HTTP /mcp)
git              every automated write is reversible            the vault is a repo
```

All of it shares one parser, `tools/lib.js`, so the studio, the MCP server and anything
added later cannot drift apart in how they read a record.

## 0 — The studio

```
D:\Memory\design\tools\studio.cmd          # starts it and opens the browser
node D:/Memory/design/tools/studio.js      # or by hand, --port to change the port
DESIGN_VAULT=<dir> node .../studio.js      # point at a fixture vault for development
```

It binds to `127.0.0.1` only. Five views:

- **Gallery** — thumbnails with a filter rail down the left: archetype, verdict, kind,
  survives-without-photo, RTL, cost, review status, your reaction, plus free-text search and
  facet-term filters. Clicking a card opens the detail panel: the image, the classification,
  every facet term with its stance, and the nearest references in the library.
- **Graph** — the similarity network. Each reference is a vector over the facet vocabulary,
  IDF-weighted; an edge is cosine similarity above 0.20. Hovering lights a node's links,
  clicking opens it.
- **Queue** — everything `status: unreviewed`, with its proposed classification, Like /
  Not-for-me, and a reason box.
- **Candidates** — facet terms your reactions lean on consistently (3+ reactions, 70%+
  agreement). Writing a reason appends it to `preferences/_candidates.md` with your words,
  the date and the references behind it. That queue is what a PREF record gets written from.
- **Inbox** — **paste a screenshot with Ctrl+V anywhere in the app**, or drop image files
  onto the window, then run the analysis. Pasted blobs arrive unnamed, so they are saved as
  `paste-<timestamp>.png`; several images in one paste are handled. A text paste is left
  alone, so typing a reason into a box still behaves normally.

**What it will and will not write.** Only `sam_reaction`, `sam_note`, `status`, `verdict`,
`facets`, `archetype`, `imagery_dep`, `rtl`, `cost`, `kind`, `title`, `source`, `confidence`
— each validated against its allowed values, with facet terms checked against the vocabulary
so an invented term cannot enter. Writes replace those keys only; the record body is compared
byte-for-byte after the write and rolled back if it changed. Each write is committed to git.

**It never sets a Stance.** A reaction is recorded on the reference. A facet's stance changes
only through a PREF record, written from a reason in your words.

## The loop, closed

A reason recorded in the studio is evidence sitting in `preferences/_candidates.md`. It
becomes a real preference through **Mode 3 of `/design-ingest`**: your words decide the
polarity and the scope (a reason that names a context makes a *conditional*, not a blanket
like), the record is written, its facet stances are set, the index row is added, and the
queue entry is removed — one commit per preference, and the entry stays queued if any step
fails. `design_overview` reports pending reasons so a session notices them, and
`design_candidates` shows them, kept strictly apart from the computed leanings, which are
not evidence.

Stances are only ever written through `tools/set-stance.js`, which refuses a taste with no
PREF, a PREF that does not list the term, a polarity disagreeing with the record, a
conditional with no condition, a term in a table that has no Stance column, and any flip of
an already-recorded position. It changes exactly one line, re-parses the file and rolls back
if anything else moved.

### `req` — the mark added on 24 Nov 2026

An audit found that **78 of 122** claimed stances had no evidence behind them: constraints
written as `✓ required`, and my own fit judgments written as uncited `✗`. The parser was
reporting all of them as Sam's taste, and `design-db` would have fed them to every future
session as his positions.

They were demoted. `✓ ✗ ~` now always cite a PREF or DDR, `req` marks a constraint on the
work (correctness, accessibility, locale, or a DDR), and `–` marks unknown — which may still
carry a note as guidance. A note is not a position. Setting a taste on a term that also
carries a `req` keeps the constraint in the cell rather than overwriting it.

### Automatic analysis on upload

The Inbox tab runs `claude -p "/design-ingest …" --model <chosen> --permission-mode
acceptEdits` headlessly, which keeps everything on your Claude plan with no API key. Pick the
model in the Inbox: Haiku 5.5 for a cheap bulk pass, Opus 5.5 by default, Fable 5.1 at the top.

**It needs the standalone CLI to be signed in, which is separate from this app's own auth.**
Two failures were worked through on 24 Nov 2026 before it ran:

1. `execFile('claude')` cannot launch the `claude.cmd` shim on Windows — Node refuses a
   `.cmd` without a shell. The server now resolves the real `claude.exe` inside the npm
   package.
2. `Failed to authenticate: OAuth session expired and could not be refreshed`. The cause was
   not the nesting I first guessed — it failed identically from the installed app launched
   off the Start Menu. `~/.claude/.credentials.json` held an **empty** `accessToken` and
   `refreshToken` with `expiresAt: 0`: nothing to refresh with. Nothing in Windows Credential
   Manager, no `ANTHROPIC_*` override. The CLI was simply signed out, while this app kept
   working because it holds its own auth.

**The fix is `claude` run once interactively**, which rewrites that file with real tokens.
After Sam did so the same spawn succeeded, and the first headless ingest ran.

If it fails again, check that file before anything else — an empty token with `expiresAt: 0`
means signed out, not broken. The fallback is always running `/design-ingest` inside a Claude
Code session. The UI reports the real failure rather than pretending it worked.

### UI changes do not need a rebuild

The server serves `ui/` from **the vault** (`<vault>/tools/ui`) when it exists, and only
falls back to the copy bundled beside it. So editing the studio's CSS or JS in the vault and
reloading the window is enough — a rebuild is only needed when `studio.js`, `lib.js` or
`main.js` change. The startup banner says which source is in use.

### The similarity, precisely

This is a real vector space, but not an image-embedding one. Every reference is a sparse
vector over the ~426 facet terms it carries, weighted by inverse document frequency, compared
by cosine. The advantage over an opaque embedding is that every link is explainable — the
detail panel shows *which* terms two references share. The limitation is that it is only as
good as the tagging, and on a fresh library every tag is a machine proposal until you review
it. Visual similarity in the CLIP sense would need a model download and dependencies; it is
deliberately not here.

**The scores are meaningless on a small library — read the shared-term count instead.** With
only a handful of records, IDF has no middle ground: a term is either in one document (full
weight, shared with nobody) or in all of them (almost no weight). So the terms two references
*share* are the cheap ones and the terms that separate them are the expensive ones, and
cosine comes out absurdly low. Measured at 3 references: REF-0001 ↔ REF-0002 scored **0.159
despite sharing 13 terms**. The ranking is still correct — the two dashboards beat the
folder card — so use the ordering and the "shares N" count, and start trusting the absolute
number somewhere around 20–30 references.

## 1 — Browsing: Obsidian Bases

Open `views/references.base` or `views/taste.base` in Obsidian. Bases is a core plugin and is
already enabled in this vault, so there is nothing to install.

`references.base` gives six views over the reference library: **Gallery** (thumbnails),
**All references** (the full table), **Review queue** (unreviewed only), **Adopt — shipped
only**, **Survives without photography**, and **RTL-safe and cheap**.

`taste.base` gives **Preferences**, **Rejections only**, **Decisions** and **Briefs**.

This works because records are **frontmatter-first**: the queryable data lives in YAML, and
the prose underneath is for a human reading one record. Add a field to the template and it
becomes filterable everywhere.

> Bases' view configuration has changed across Obsidian releases. If a view errors or a
> column is blank, adjust it in Obsidian's own view editor — the filters are plain
> expressions over `note.<property>` and are easy to repair by hand.

## 2 — Feeding it: the `/design-ingest` skill

Installed at user scope (`~/.claude/skills/design-ingest/`), so it works from any project.

Drop images into `references/inbox/` — or any project's own inbox, passed as an argument —
and run `/design-ingest`. For each image it reads the actual pixels, classifies on the
twelve facets, validates every term ID against the vocabulary, writes a `REF-NNNN` record,
moves the image to `references/library/REF-NNNN.png`, and leaves it `status: unreviewed`.

**It never writes a Stance.** It proposes a classification and a provisional verdict. Taste
enters only through review — mode 2 of the skill — where a correction or a stated preference
becomes a PREF record with Sam quoted and dated. The queue is not overhead; it is the data
collection mechanism.

## 3 — Querying it: the `design-db` MCP server

Every tool lives in `tools/mcp-tools.js` and is served two ways:

- **stdio** — `tools/design-mcp.js`, registered at user scope in `~/.claude.json` as
  `design-db` (backup of the previous config: `~/.claude.json.bak-design-mcp`), for Claude
  Code and Claude Desktop on this machine.
- **HTTP** — `/mcp` on the running studio, for clients that cannot spawn a process here
  (claude.ai, cloud sessions, the phone). Needs `STUDIO_MCP_TOKEN` as soon as it is
  reachable from anywhere but this machine.

Zero dependencies: plain JSON-RPC, the vault's markdown parsed directly, writes through
`tools/vault-write.js` (the studio's own writer), so nothing can drift from the files.
Client setup: `MCP.md` at the repo root.

**It needs a new Claude Code session to appear.** MCP servers are connected at startup.

| Tool | What it returns |
|---|---|
| `design_overview` | The primer: twelve facets with term counts, every preference in one line, decisions, briefs, library size by concept. Read this instead of loading facet files |
| `design_stats` | The library in numbers: review progress, reactions, breakdowns by concept, archetype, verdict, RTL, imagery, cost, confidence |
| `design_facet` | One facet's full vocabulary with stances; filterable to `likes` / `rejects` / `conditional` / `unknown` |
| `design_terms` | Substring search across all terms when you know the concept but not the ID |
| `design_validate` | Checks term IDs against the vocabulary, with near-miss suggestions. The drift guard — call before writing IDs anywhere |
| `design_prefs` | Preference records with their evidence; filter by polarity or facet prefix |
| `design_candidates` | Queued reasons (evidence) and computed leanings (not evidence) |
| `design_brief` | A surface's DNA string, constraints, archetype priority and reject line |
| `design_refs` | Query the library by concept, archetype, verdict, kind, imagery dependency, RTL, cost, status, reaction, facet or free text; compact and paged |
| `design_ref` | One reference in full: terms with stances by family, Read, verdict, notes, nearest neighbours |
| `design_image` | The reference (or inbox) image itself, so Claude can look at it |
| `design_record` | Full text of any record by ID |
| `design_inbox` | Images waiting for analysis and the last run's state |
| `design_rubric` | Facet L and the critique output format, for judging a design against a brief |
| `design_react` | **Write.** Sam's like / dislike / none and his reason — only from what he said |
| `design_review` | **Write.** Mode 2: agree (reviewed) or correct the classification (corrected) |
| `design_queue_reason` | **Write.** Queue a reason Sam stated against a term, as evidence for a PREF |

No tool writes a facet stance or a PREF record: those stay Mode 3, in the vault.

**Why this is the load-bearing piece.** The database is ~18k words and can never all fit in
context. The MCP server means any Claude Code session, in any project, pulls the twenty
relevant lines on demand — and gets the taxonomy automatically, without anything being
pasted in.

## 4 — Safety: git

The vault is a git repo as of 29 Oct 2026 (845 files in the baseline commit), with
`.obsidian/workspace.json`, `.trash/` and the hook state ignored. There is no remote; this is
an undo buffer, not a backup. Any automated write into the vault is now revertible, which is
the precondition for pointing a pipeline at the only store of every project's memory.

## What is deliberately not built

A web UI. Bases covers browsing, and the review queue works fine as a conversation. Build an
interface only once Bases is demonstrably too slow — and then only for the four things it
genuinely cannot do: side-by-side comparison of several references, keyboard-speed accept and
reject, bulk stance editing, and similarity search over embeddings.

## Adding a field

1. Add it to `references/_template.md` frontmatter with its allowed values.
2. Add a `properties` entry and put it in a view's `order` in `views/references.base`.
3. Add it to the filter list in `design_refs` in `tools/mcp-tools.js` (one array), and to
   `WRITABLE` / `ENUMS` in `tools/vault-write.js` if Claude or the studio may write it.
4. Mention it in the skill's reading order so the classifier fills it.
