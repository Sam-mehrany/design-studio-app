---
name: design-ingest
description: Analyse design reference images into the design taxonomy at D:\Memory\design — classify each screenshot on the twelve facets, write a REF record, file the image in the library, and queue it for review. Also handles reviewing the queue, writing Sam's queued reasons up as preference records with their facet stances, and reporting what the library says about a pattern. Use when images are dropped into a references inbox, when asked to ingest, analyse, classify or sort design references or Pinterest pins, when asked to review the reference queue, or when asked what the reference library says about a pattern.
---

# Design reference ingest

Pipeline into the faceted design database at `D:\Memory\design`. Read
`design/00-model.md` §3–§4 once per session before writing anything, or call the
`design-db` MCP tool `design_overview`, which is cheaper.

## The rule that cannot be broken

**A classifier never writes a Stance.** Facet tables carry Sam's taste; this skill proposes
*descriptive* classification and a *provisional* verdict, nothing more. Every record lands
`status: unreviewed` and carries no evidential weight until Sam has seen it.

A stance cell in `facets/*.md` changes only through a PREF record, and only from something
Sam actually said or rejected. An inferred preference is worse than an unknown, because it
gets designed to.

## Mode 1 — Ingest

**Input:** images in `D:\Memory\design\references\inbox\` (default), or a path given in the
invocation — e.g. the health app's `docs\design\references\inbox\`.

For each image, in batches of 5–10:

1. **Read the image.** Actually look at it. Do not classify from the filename.
2. **Dedupe.** Compare against existing records' `title` and `source`. A near-duplicate gets
   noted in the existing record's `## Notes` instead of a new REF. Say which you skipped.
3. **Allocate an ID.** Next free `REF-NNNN`, four digits, scanning `references/*.md`. Never
   reuse.
4. **Classify** — see the reading order below.
5. **Validate every term ID** with the MCP tool `design_validate` before writing it. An
   invented term silently rots the database. If a real distinction has no term, say so in
   `## Notes` and propose the new term to Sam rather than inventing one.
6. **Write the record** from `references/_template.md`, frontmatter first.
7. **Move the image** to `references/library/REF-NNNN.<ext>`, keeping the original filename
   in the record's `## Notes`. Move, don't copy — the inbox should empty.
8. **Regenerate the index** — `node D:/Memory/design/tools/index-refs.js`. It rewrites the
   table in `references/index.md` from the records. Never edit that table by hand; it sat
   empty through three ingests when it depended on someone remembering.
9. **Report** a compact table: ID, archetype, verdict, confidence, and your one-line read.

### Reading order for one image

Concept before archetype before aesthetics. What the image *is* determines everything
downstream — including which cluster the graph puts it in.

0. **`concept` — what artefact is depicted, judged from the image.** Pick exactly one:
   - `mockup` — a computer, phone, tablet or other digital device shown in an environment (on a desk, in hands, on a stand, in a scene). The image was saved for the device presentation, not the UI on its screen — so a laptop showing a landing page is a mockup, not web, and a floating-phone marketing shot is a mockup, not mobile. If the screen fills the frame edge-to-edge with no device hardware or environment visible, it is not a mockup: judge the UI.
   - `web` — a website / landing / dashboard / pricing page, shown flat (screen fills the frame, no device hardware or environment in shot)
   - `mobile` — a phone or watch app screen, shown flat
   - `component` — one isolated card / component, not a full screen
   - `slide` — one or more presentation slides / a deck (even when a slide shows a web hero or a dashboard inside it — the artefact is the slide). A slide photographed on a laptop in a scene is a mockup, not a slide.
   - `imagery` — no UI design at all: a photograph, 3D render, still life, mood image, or a blank gradient screen with no device in shot. A blank monitor on a rock is a mockup (the device is the subject), not imagery.
   Write it as `concept:` in the frontmatter. This is what the graph groups by: two records with different concepts almost never link, however similar their style terms are. Getting this wrong is how slides ended up clustered with landings in Nov 2026 (REF-0023/0064/0066 were filed as landings; they are slides) — and how device mockups ended up mixed with web UI (REF-0021/0027/0030/0033 were filed as web; they are mockups). When in doubt between two concepts, say so in `## Notes` and pick the one the image was saved for: the device presentation, or the UI itself.

1. **`J` archetype.** What job is this screen doing? If it is a marketing shot of an app
   rather than a screen, say so — it is a `J.ACQ.landing`, not the product. A slide takes
   `J.PRES.slide` / `J.PRES.deck` (plus a second archetype for its subject, e.g.
   `J.DATA.report` for a data slide); imagery with no UI takes `J.REF.imagery`, never an
   empty archetype.
2. **Shipped or concept?** A real product has empty rows, long labels, status bars, odd data.
   A concept shot has three perfect data points and no edge cases. This drives `kind`, and a
   concept shot can never be `verdict: adopt` on its own.
3. **The three killers**, which decide most verdicts:
   - `imagery_dep` — mentally delete the photography. Does the composition still stand?
     `hard` if it collapses, `soft` if the photo was decoration, `none` if there was none.
   - `rtl` — would this mirror? `breaks` if hierarchy depends on a left-anchored hero
     element or the layout reads as a left-to-right sentence; `risky` if directional icons,
     charts or numerals would need rework; `clean` if it is symmetric or list-based.
   - `cost` — live blur, mesh gradients, video, large renders, many font weights → `high`.
     Vector, type and flat colour → `low`.
4. **Descriptive facets A–H — this is the analysis, and it is about the design, not the
   product.** Sam's correction, 24 Nov 2026: *"the explanations [are] more about what the
   software is while it should focus more on design subjects."* Explaining what the app does
   for its business is not a design reference. Two sentences of context at most; everything
   else goes on these:

   - **Colour** — the actual surface ladder and accent values, which hues carry meaning and
     which decorate, how many semantic hues there are.
   - **Typography** — the scale and its ratio, hero-to-body multiple, weights, numerals
     (tabular or not), the face's lineage.
   - **Layout & harmony** — grid, density, what ranks the hierarchy, the spacing rhythm,
     whether radii / shadows / icon weights are one family or several.
   - **Shape & surface** — radius scale, border vs shadow vs tone, elevation logic.
   - **Buttons & components** — fill, weight, how loud they are relative to the data.
   - **Gradients & imagery** — where they are, what they cost, whether anything breaks
     without them.
   - **Contrast** — measured, not guessed, and name the failures.

   **Measure rather than estimate.** The studio serves the image, so sample it: load it into
   a canvas and read real values.

   ```js
   // hex at a point, mode colour of a region, cap height of a glyph row, WCAG ratio
   const d = ctx.getImageData(x, y, w, h).data;
   ```

   "Body `#5a5a5a` on `#f8f8f8` = 6.49:1, micro-labels `#858585` = 3.47:1 — fails" is worth
   a hundred words of "clean and modern". A measured claim is also checkable later.
5. **`K` context,** where the image implies it — device, environment, locale.
6. **Verdict,** with `confidence`. `adopt` = use as-is. `adapt` = the mechanism is right, the
   finish is not transferable. `reject` = fails a killer or a `DDR`. Check the active briefs'
   `reject` lines — `design_brief` — before proposing `adopt`.

### Writing the `## Read` section

Short bolded paragraphs, one per design subject — **Colour**, **Typography**, **Layout &
harmony**, **Shape & surface**, **Buttons & components**, **Gradient & imagery**,
**Contrast** — each carrying real values. Say at the top whether the figures were measured
off the image or estimated, and never present an estimate as a measurement.

What the product *does* belongs in one line, if at all. A reader six months from now wants
the type scale and the colour roles, not the business model.

## Mode 2 — Review

The review queue is where taste actually gets recorded. Pull `design_refs status:unreviewed`,
then for each, show Sam the image with your proposed classification and verdict, and ask the
only question that matters: **would you use this, and what specifically do you like or not?**

Then:

- He agrees → `status: reviewed`. No stance change: agreement with a classification is not a
  statement of taste.
- He corrects a *classification* → fix it, `status: corrected`. If the same correction
  recurs, the vocabulary may be wrong — tell him.
- He states a *preference* ("I like the dense rows", "never that gradient") → **this is the
  evidence.** Write a PREF record from `preferences/_template.md`, quote him with the date,
  update the facet table cell(s), add a row to `preferences/index.md`.

Batch the questions. Ten images at a time with one question each beats one at a time.

## Mode 3 — Close the loop (queued reasons → PREF records)

The studio writes Sam's reasons to `preferences/_candidates.md`. They are **evidence**, and
they sit there doing nothing until they become PREF records. Run this when he asks to write
up preferences, or when `design_overview` reports reasons awaiting write-up.

**His words decide the preference. The leaning only points at the question.**

Read each entry and ask what he actually said — not what the counter suggests:

- A reason that names a *context* makes a **conditional**, not a blanket like. "Dense rows
  mean I can see the whole session without scrolling, which is the only thing that matters
  mid-set" is `~ during active logging`, scoped to the athlete logger. It is not `✓ dense`.
- A reason that names a **different term** than the queued one: follow the words, and say so.
- A reason that contradicts the leaning: follow the words.
- A reason too vague to scope — "I just like it" — **do not write a PREF.** Leave it queued
  and ask him one specific follow-up question.

Then, per entry, in this order, committing once per PREF:

1. **Allocate the id** as the highest existing PREF number **+ 1**. Never refill a gap
   (0010 was never issued and stays that way).
2. **Write the record** from `preferences/_template.md`. Frontmatter: `polarity`, `scope`
   (what his words actually cover, not everything), `evidence_date` from the queue entry,
   and `facets` listing only the terms his reason genuinely touches. Quote him verbatim in
   **Evidence**, with the date and the REF ids from the entry.
3. **Set the stance** for each facet term the record claims:

   ```bash
   node D:/Memory/design/tools/set-stance.js <TERM> like|reject|conditional --pref PREF-00NN --condition "..."
   ```

   It refuses a stance with no PREF, a PREF that does not list the term, a polarity that
   disagrees with the record, a conditional with no condition, and any flip of an already
   recorded stance. **If it refuses, stop and tell Sam** — do not edit the facet table by
   hand to get around it.
4. **Add the row** to `preferences/index.md`.
5. **Remove that entry** from `preferences/_candidates.md`.
6. **Commit.** If any step above fails, leave the entry queued and report it.

Finally, tell Sam which stances moved — `C.VAL.dark-first` going from unknown to a recorded
position is the whole point, and it is what every later session will read.

### Stance marks

`✓` `✗` `~` are claims about **Sam** and each one cites a PREF or DDR. `req` is a claim
about the **work** — a correctness, accessibility or locale constraint — and must never be
written as a taste. `–` is unknown, and may carry a note as guidance. A note is not a
position. See `00-model.md` §4.

## Mode 4 — Patterns

When asked what the library says: count, don't impress. The gate in `00-model.md` §3 is
three or more **shipped** products. Report frequency across records — "7 of 9 shipped loggers
put set entry at thumb level; the 2 that don't are tablet-first" — and name the archetypes
with no coverage, because that is the real finding.

## Conventions

- **Never edit records in `archive/`,** and never promote a reference folder file to the
  vault root. Root files are the recall layer — see `vault-conventions.md`.
- Records live in subfolders and carry **no `description:` frontmatter**, so they do not
  compete in memory recall. Use `title:`.
- The vault is a git repo. After a batch of 10+ records, commit with a one-line message.
- A PREF that is general enough to apply outside design work *also* gets a root
  `feedback-*` memory. Most do not.
