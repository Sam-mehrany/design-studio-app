# Design database

A **UI design taxonomy** plus the taste record that uses it. The purpose is precision: to be
able to describe a design in terms specific enough that the result comes back right the first
time, and to judge a result against something written down rather than against a feeling.

**The harness is in [HARNESS.md](HARNESS.md)** — Obsidian Bases views for browsing, the
`/design-ingest` skill for analysing images, the `design-db` MCP server so Claude Code can
query this from any project, and git underneath it all.

Start with [**00-model.md**](00-model.md) — the faceted model and the grammar everything here
obeys. Everything else is either vocabulary, evidence, or a form to fill in.

## Map

```
00-model.md         the faceted model, ID grammar, stance marks, the DNA string, the loop
HARNESS.md          the tooling: Bases views, the ingest skill, the MCP server, git
lexicon.md          every term ID on one page, grouped — definitions stay in the facet files

facets/             the vocabulary — twelve axes, A to L
  A style families  · B structure & layout · C colour · D typography
  E shape & surface · F imagery & iconography · G motion · H content & voice
  I components      · J screen archetypes    · K platform & context
  L evaluation rubric

preferences/        the taste record — one evidenced preference per file (PREF-NNNN)
decisions/          design decision records — what was fixed, and what it cost (DDR-NNNN)
references/         analysed artefacts, scored on the facets (REF-NNNN)
briefs/             per-surface targets, written as facet terms (BRIEF-slug)
views/              Obsidian Bases views over all of the above
tools/              mcp-tools.js — the MCP service (stdio: design-mcp.js, HTTP: studio /mcp)
```

Records are **frontmatter-first**: the queryable data is YAML, the prose below it is for a
human reading one record. The facet files stay prose — they are documentation, and the MCP
server parses their tables directly, so the vocabulary has exactly one source of truth.

## The four things this is for

**1. Describing what I want.** Pick terms, get a DNA string. Instead of "make it clean and
modern", the brief says `dark-first · single-accent · dense · tabular-numerals ·
border-over-shadow · rtl-primary` and a `reject` line. See [00-model](00-model.md) §5.

**2. Logging a reference.** Any screenshot, app or print piece gets a REF record: classified
on the facets, scored on the three fields that kill most inspiration — imagery dependency,
RTL survivability, cost — and given a verdict. Over time the REF set becomes the evidence
base, and the pattern that appears in it repeatedly is the one worth adopting.

**3. Recording taste.** A PREF record is one evidenced preference: what was said or rejected,
when, why, and where it applies. Each one updates a **Stance** cell in a facet table, so the
vocabulary itself becomes a map of what is liked, rejected, conditional or still unknown.

**4. Judging a result.** Facet [L](facets/L-evaluation-rubric.md) is a scored rubric with a
fixed critique format. A design gets reported as scores plus **misses cited by ID** —
"violates PREF-0002", "scores 2 on L.ROB" — rather than as reassurance.

## The two rules that keep it honest

**Evidence or `–`.** A Stance cell becomes `✓` or `✗` only from something actually said or
actually rejected. Never from inference. A wrong `✓` is worse than an empty cell, because it
invents a preference and then designs to it. The `–` cells are the backlog — they are what to
ask about next.

**Taste decides between survivors, not what survives.** A pattern is admitted because it
appears in several shipped products, or because it answers a named constraint, or as a
written differentiation call with its cost stated. Liking it is not one of the three. Liking
it is how one of the survivors gets chosen. ([00-model](00-model.md) §1, and the health app's
own `00-method.md` §0, which is where this rule came from.)

## Current state

Twelve PREF records, all from the Bit. design system and the Markito redesign — so the taste
evidence is strong on **brand and presentation work** and thin on **product UI**. The
vocabulary is complete; the Stance column is mostly `–`, which is the correct starting
condition and not a gap to fill by guessing.

- [preferences/index.md](preferences/index.md) — what is recorded, and the honest list of
  what is not
- [PREF-0001](preferences/PREF-0001-no-quality-downgrades.md) governs everything else: never
  solve a design problem by lowering ambition.

## Scope boundary

This holds the **language**, the **taste record** and the **cross-project references**. A
project's actual tokens, components and screens live in that project's repo — the training
product's design work is in `D:\Project\software\health-app\docs\design\`, and this database
is what it is specified in. See [[vault-conventions]] for how this folder relates to the rest
of the vault.
