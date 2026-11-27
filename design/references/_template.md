---
type: design-ref
id: REF-0000
title: ""
source: ""
kind: shipped          # shipped | concept | print | brand
concept: web           # web | mobile | component | slide | imagery | mockup — the artefact depicted; see nature.md
component_type:        # one I.TYPE term (I.TYPE.footer, I.TYPE.navbar, I.TYPE.widget…) — only when concept is component
medium: flat-ui        # flat-ui | 3d-render | photo | composite | ai-generated | illustration — how the image was made
platform: desktop      # desktop | mobile | tablet | watch | multi | none — what the UI is designed for
captured: 2026-01-01
image: library/.png    # relative to design/references/
archetype: []          # J terms, e.g. [J.CORE.capture]
facets: []             # every descriptive term the machine or I assigned
imagery_dep: none      # hard | soft | none
rtl: clean             # clean | risky | breaks
cost: low              # low | med | high
verdict: adapt         # adopt | adapt | reject
confidence: med        # the classifier's own confidence: low | med | high
status: unreviewed     # unreviewed | reviewed | corrected
analysed_by:           # the analyser that wrote it: claude-opus-5-5, local:qwen2.5vl:7b, Hark
sam_reaction:          # like | dislike — set by Sam in the studio, never by a classifier
sam_note:              # his words on why. THIS is what a preference gets written from
tags: [design/ref]
modified: 2026-11-24T09:10:52.875Z
---

# REF-0000 — <what this is>

## Nature

One line naming the four nature fields in words, then the visual evidence that decided each:
"Laptop bezel and keyboard on a rock under a hard spotlight → mockup; perfect CG light, no grain → 3d-render."

## Read

What this actually does well, in one or two sentences — the mechanism, not the mood. "Hero
number at 72pt with the unit at 14pt beside it, everything else at 13pt, so the one value
reads from across a room" beats "clean and modern".

## Why the verdict

One or two sentences tying the verdict to the frontmatter: which of the three killers
decided it, or which constraint it answers.

## Notes

Anything the fields cannot hold. Near-duplicates of other REFs, the context that made it
work, what it would take to adapt it.

**Related:** PREF-NNNN · other REFs in the same cluster

---

## Rules

**The frontmatter is the data.** Bases and the MCP server read it; the prose is for a human
reading one record. Anything that should be queryable goes in a field, not a sentence.

**`status: unreviewed` means the classification is a machine proposal and nothing more.**
It carries no weight as evidence until Sam has seen it. `reviewed` means he agreed;
`corrected` means he changed something — and a correction is the most valuable row in the
database, because it is real evidence about taste.

**A classifier never writes a Stance.** It fills `facets`, `archetype`, the three killers and
a proposed `verdict`. Stance cells in the facet tables change only from Sam's input, and
only through a PREF record. See [00-model](../00-model.md) §4.

**Shipped beats concept.** A concept shot can be useful, but its verdict can never be
`adopt` on its own — a pattern needs shipped evidence (00-model §3 gate).
