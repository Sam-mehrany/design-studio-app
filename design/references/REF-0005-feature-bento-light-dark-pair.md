---
type: design-ref
id: REF-0005
title: "Feature tile: light card and dark card nested in a white tray"
source: "Pinterest board 'component-design-idea' (mehrani0146)"
kind: concept
concept: component
captured: 2026-11-26
image: library/REF-0005.jpg
archetype: [J.ACQ.feature]
facets: [A.ERA.current, B.GRID.split, B.DEN.moderate, B.HIER.colour, B.CONT.nested, B.CONT.tray, C.PAL.neutral-only, C.VAL.tonal-layered, C.CON.high, D.FACE.neo-grotesque, D.SCALE.tight, D.WGT.single, D.CASE.sentence, E.RAD.large, E.RAD.nested-rule, E.RAD.pill, E.DEP.border-plus-shadow, E.STROKE.hairline, E.ACC.badge, F.IMG.none, F.ICON.line]
imagery_dep: none
rtl: clean
cost: low
verdict: adapt
confidence: high
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: Thu 2026-11-26 1:45 PM EST (UTC-05:00)
---

# REF-0005 — Feature tile — a light card and a dark card nested in a white tray

## Read

*Figures measured off the image with Python/PIL (median-sampled hex, WCAG 2.x ratios, ink heights in original-image pixels unless stated); type-scale ratios are derived from those ink heights; radii in px are estimated by eye.*

**Colour.** Neutral-only ladder: page `#eaeaea`, outer tray white, inner light card and footer strip `#f1f1f1`, dark card `#2e2e2e` → `#0e0e0e` (vertical tonal gradient). The single non-neutral is a tiny green status dot on the 'Deployed' tag (`#e6f7cd` text tint).

**Typography.** Heading cap 20px, card title 18px, body 12px (orig px): a tight scale (heading ≈1.1× title, title 1.5× body). Hierarchy is carried by colour — the heading is two-tone, `#b8b8b8` lead-in then black. Single weight, sentence case, neo-grotesque.

**Layout & harmony.** Split pane: two equal cards side by side inside one tray, a segmented control above, a tag row as footer. Radii, hairlines and icon weights are one family.

**Shape & surface.** Nested radius rule observed: tray radius > card radius > tag pill. Light card uses a hairline border; dark card a soft shadow. Border-plus-shadow, consistently applied.

**Buttons & components.** Segmented pill control (active segment white on `#f3f3f3`), small pill tags, a 'Restart' ghost chip. Everything is quieter than the content.

**Gradient & imagery.** Only the subtle top-to-bottom tone on the dark card. No imagery.

**Contrast.** Black on white 21:1; body `#656565` on `#f1f1f1` = 5.16:1, passes. Grey heading lead-in `#b8b8b8` on white = 1.98:1 and tag text `#999999` on `#f1f1f1` = 2.52:1 — both **fail**; the two-tone heading is decorative by design.

## Why the verdict

Concept, but the mechanism (nested radii, light/dark pair, neutral ladder) is low-cost and portable. Adapt with high confidence; fix the grey lead-in contrast.

## Notes

Original filename: `pin-component-design-idea-DHpUElQjajQg.jpg`. Two-tone heading device recurs in REF-0006 and REF-0011.

**Related:** —
