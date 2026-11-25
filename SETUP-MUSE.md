# Setup guide for a new Muse AI account

How to get Design Studio running in Muse, from zero, and how to use Muse to
grow your own design-reference library with it.

## (a) What Muse is, and what you need

**Muse** is Meta's personal AI agent. It runs in its own environment (a Linux
virtual machine with a workspace folder), can read and write files, run commands,
search the web, and connect to your accounts (GitHub, Gmail, Google Calendar,
Instagram, Threads, X, and others). You talk to it in chat; it does the work and
reports back with verified facts and links.

For Design Studio you need:

- A **Muse account** (this guide assumes you are already talking to Muse).
- A **GitHub account**, with this repo accessible to Muse's GitHub connection
  (Muse will ask you to authorise it and pick the repositories it may reach).
- **Node.js 20+** and **git** in the Muse environment (already present in the
  standard Muse VM — check with `node --version` and `git --version`).
- **Claude Code (optional but recommended)** for image analysis. Muse can use
  your Claude Pro account via Claude Code to analyse images into the library.
  Without it, you can still browse, filter and graph the shipped library, and
  add records by hand — you just won't get automatic ingest.

No database, no cloud service, no paid tier of Design Studio itself. The app is
plain Node and plain files.

## (b) Get the repo into Muse

**Option 1 — clone it (recommended):**

Ask Muse, or run this in the Muse terminal:

```bash
cd ~/workspace
git clone https://github.com/Sam-mehrany/design-studio-app.git
cd design-studio-app
```

**Option 2 — upload the folder:**

If you already have the project on your own machine, upload the folder into
Muse's workspace (for example as `~/workspace/design-studio-app`). Keep the
`design/` folder intact — that is the vault. Do not upload `node_modules/`
(it is ~550 MB and is rebuilt by `npm install`); do not upload `server/`
(it is generated, see (h)).

Where it lives in Muse: `~/workspace/design-studio-app`. The app's vault is the
`design/` folder inside it.

## (c) Install and run

From inside the repo folder:

```bash
npm install        # once — installs Electron + electron-builder (dev tools for the desktop app)
npm run sync       # copy the server out of design/tools/ into server/
npm run serve      # start the server on http://127.0.0.1:7391
```

Then open **<http://127.0.0.1:7391>** in a browser.

What to expect on first run:

- The **Gallery** view with 90 reference cards (Web 17, Mobile 8, Component 15,
  Slide 3, Imagery 19, Mockup 28), a left-hand filter rail, and counts in the
  header: 90 refs, 10 liked, 79 to review, 0 inbox.
- The **Graph** view with 90 nodes in six colour clusters and 319 edges.
- The reference images will show an **"Image not in this copy"** placeholder.
  That is expected: this repo ships the 90 text records, not the 90 images
  (see (i)). The records, filters, graph and verdicts all work without them.
  Drop your own images in (section (e)) and they appear with real thumbnails.
- The server logs look like this:

```text
design-studio on http://127.0.0.1:7391
  vault:  /home/<you>/workspace/design-studio-app/design
  ui:     /home/<you>/workspace/design-studio-app/design/tools/ui  (live from the vault)
  refs:   90    inbox: 0    git: yes
```

Stop it with `Ctrl+C`. The server only listens on `127.0.0.1` (your own machine);
nothing about it is reachable from the internet.

## (d) Desktop app

**Run unpackaged** (needs a display — works on Windows/macOS, not on a headless
Linux VM):

```bash
npm start
```

The Electron window opens on the server. It finds your vault automatically:
a remembered folder first, then the `design/` folder shipped in the repo, then
it asks you to choose a folder. **File → Change library folder…** repoints it.

**Build a Windows installer:**

```bash
npm run dist       # -> dist/Design Studio Setup <version>.exe (NSIS, x64)
```

The installer needs nothing else on the target machine — the server runs on
Electron's bundled Node. On macOS/Linux, `npm run serve` in a browser is the
supported way to run it; the Electron packaging in `package.json` is currently
configured for Windows (NSIS).

## (e) How Muse / Claude Code analyses images

This is the core loop. You collect images; Muse turns them into analysed
reference records.

1. **Drop images** (PNG/JPG/WebP screenshots, photos, renders) into
   `design/references/inbox/`. Any number at a time; batches of 5–10 work best.
2. **Ask Muse to ingest them.** For example: "Ingest the images in the inbox."
   Muse follows the skill in `design/tools/design-ingest-SKILL.md`.
3. **What Muse does, in order, for each image:**
   - **Step 0 — `concept` FIRST.** It looks at the image and decides what
     artefact it depicts: `mockup` (a computer/phone/tablet in an environment),
     `web` (a website shown flat), `mobile` (a phone app screen, flat),
     `component` (one isolated card), `slide` (presentation slides), or
     `imagery` (a photo/render with no UI). Getting this right is what keeps
     slides out of the landing cluster and laptop photos out of the web
     cluster. When unsure, it says so in the record's Notes and picks the one
     the image was saved for.
   - **Step 1 — archetype (`J`).** What job is the screen doing — e.g.
     `J.DATA.home`, `J.CORE.browse`, `J.ACQ.landing`? Slides take
     `J.PRES.slide` / `J.PRES.deck`; imagery takes `J.REF.imagery`.
   - **Step 2 — shipped or concept?** A real product has empty rows and odd
     data; a concept shot has three perfect data points. This drives `kind`.
   - **Step 3 — the three killers:** imagery dependency (does the composition
     survive deleting the photo?), RTL survivability (would it mirror?),
     and render/download cost.
   - **Step 4 — facets A–H**, with **measured values, not guesses**: real hex
     codes sampled from the image, real WCAG contrast ratios, real type-scale
     ratios. "Body `#5a5a5a` on `#f8f8f8` = 6.49:1" — never "clean and modern".
     A measured claim is checkable later; an adjective is not.
   - **Verdict** (`adopt` / `adapt` / `reject`) with a confidence note.
4. **Where the record lands.** One file per image:
   `design/references/REF-NNNN-<slug>.md`, the image moved to
   `design/references/library/REF-NNNN.<ext>`, and the index regenerated with:

   ```bash
   node design/tools/index-refs.js
   ```

   (Muse runs this itself during ingest — never edit
   `design/references/index.md` by hand; it is generated.)
5. **Records land `unreviewed`.** This is a rule, not a default: a classifier
   never writes a Stance. Nothing becomes a stated preference until you review
   it (see below). After a batch of 10+ records, Muse commits the vault with a
   one-line message — the vault is a git repo, so the history is the audit trail.

**Reviewing (where taste gets recorded):** open the **Queue** view, look at each
unreviewed reference with Muse, and answer one question per image: *would you
use this, and what specifically do you like or not?* If you state a preference
("I like the dense rows", "never that gradient"), Muse writes a PREF record in
`design/preferences/`, quotes your words with the date, and updates the facet
table cell. Agreement with a classification alone changes no stance.

## (f) How the graph works, and how to use it

- **Open the Graph tab.** It is full-bleed — no container, no entrance
  animation. The layout is solved before first paint.
- **Colour is the concept.** Web is blue, mobile green, component purple, slide
  pink, imagery yellow, mockup cyan. Liked references get an orange ring.
- **Filter chips** at the top isolate one concept (or All). The legend at the
  bottom left explains the colours and the rule: a link means the two records'
  IDF-weighted facet vectors score ≥ 0.20.
- **Drag a node to pin it** where you want it; double-click to release it.
  Pan by dragging the background, zoom with the wheel or pinch.
- **Hover a node** (desktop) or **press it** (phone) to see its preview card:
  thumbnail, ID, title, concept, verdict and link count. Use it to find a
  reference without opening 90 files.
- **Read the clusters, not the dots.** A tight cluster is a family of designs
  that share a vocabulary; a lone node bridging two clusters is worth opening.
  The one cross-concept edge in the shipped library (REF-0094 → REF-0047) is a
  slide screenshotting the gallery — the graph is telling the truth about the
  images, not about the styles.

## (g) Phone use via a Muse Space + bridge

The same vault can be used from your phone through a **Muse Space**: a small
web app (Gallery / Graph / Queue / Candidates / Inbox) that talks to the live
backend vault through a host bridge. There is one vault — the Space does not
keep a separate copy, so a reference added on your phone is in the same git
repo as one added on your desktop.

Setting one up is a Muse task, not a config file: ask Muse to "build a Design
Studio Space connected to this vault via the host bridge", and it will create
the Space, wire the bridge to the server on port 7391, and verify the Graph tab
loads your concepts (Web 17 · Mobile 8 · Component 15 · Slide 3 · Imagery 19 ·
Mockup 28). The backend must be running (`npm run serve`) while you use the
Space. The Space's own data (its UI state) lives in the Space; the library
lives in the vault.

## (h) Troubleshooting

- **Port 7391 already in use.** Another copy of the server is running (check
  with `curl -H 'X-Studio: 1' http://127.0.0.1:7391/api/overview`). Stop the
  other one, or start on a different port: `node server/studio.js --port 7392`
  (after `npm run sync`). The Electron app picks the first free port from 7391
  automatically.
- **"Vault not found" / 0 refs.** The server resolves the vault in this order:
  `DESIGN_VAULT` env var → the folder the server file lives in, if it looks
  like a vault (`00-model.md` + `facets/` + `references/`) → the `design/`
  folder next to `server/`. Set it explicitly:
  `DESIGN_VAULT=/path/to/your/design node server/studio.js --port 7391`.
- **`server/` is generated — do not edit it.** `npm run sync` copies `lib.js`,
  `studio.js` and `ui/` out of `design/tools/` into `server/`. Edit
  `design/tools/` (that is the source of truth), then run `npm run sync`
  again. The next sync wipes hand edits in `server/`.
- **Pointing at a different tools folder:** set `DESIGN_TOOLS` before syncing,
  e.g. `DESIGN_TOOLS=/path/to/vault/tools npm run sync`. On Sam's Windows
  machine the vault lives outside the repo, so `sync-server.js` also checks
  `D:/Memory/design/tools` when it exists.
- **Images show "Image not in this copy".** The record exists but the file in
  `design/references/library/` is missing — expected for the shipped library
  (see (i)), or the image was never moved out of the inbox. Check
  `design/references/library/REF-NNNN.*` exists.
- **Ingest did nothing / inbox still full.** Check `POST /api/ingest` only runs
  when Claude Code is available — Muse reports the Claude binary it found on
  startup. Ask Muse to check `which claude` / the ingest status endpoint
  (`GET /api/ingest/status` with header `X-Studio: 1`).
- **Electron won't start on Linux.** There is no display in a headless VM. Use
  `npm run serve` and a browser instead. `npx electron --no-sandbox` is needed
  if you run as root.
- **A change in the vault didn't show up.** The UI reads live from the vault
  (`design/tools/ui` is served live), but the *server code* is the synced copy
  — restart the server after editing `design/tools/lib.js` or `studio.js`.

## (i) What is NOT included, and what to do next

- **The 90 reference images are not in this repo** (~16 MB of PNG/JPG). The
  records are here; the images are not. After cloning you will see the
  "Image not in this copy" placeholder. That is by design for this public push:
  the images are screenshots of other designers' published work. Start with
  your own images (section (e)).
- **Sam's full library with images** lives on his Windows machine. A normal
  `git push` from that machine carries the images, because that machine holds
  the full history.
- **No hosted version.** There is no cloud Design Studio. You run your own
  copy, on your own machine, against your own vault. That is the point: your
  taste database is a folder you own.
- **Next steps once it runs:** drop 10 of your own reference images into the
  inbox, ingest them, review them in the Queue, and watch the graph grow a
  seventh cluster — yours.
