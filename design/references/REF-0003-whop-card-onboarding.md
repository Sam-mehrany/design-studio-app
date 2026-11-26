---
type: design-ref
id: REF-0003
title: "Whop Card onboarding step: glowing card on near-black"
source: "Pinterest board 'component-design-idea' (mehrani0146)"
kind: concept
concept: component
captured: 2026-11-26
image: library/REF-0003.jpg
archetype: [J.ON.empty-first-run]
facets: [A.FAM.glassmorphism, A.POS.premium, B.GRID.single-column, B.DEN.sparse, C.PAL.single-accent, C.VAL.dark-first, C.SAT.vivid, C.MAT.glass-frosted, D.FACE.neo-grotesque, D.HERO.display-numeral, D.SCALE.dramatic, E.RAD.medium, E.DEP.live-blur, F.IMG.render-3d, F.DEP.soft, F.COST.high, K.DEV.handheld]
imagery_dep: soft
rtl: risky
cost: high
verdict: adapt
confidence: low
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: Thu 2026-11-26 1:45 PM EST (UTC-05:00)
---

# REF-0003 — Whop Card onboarding step — glowing orange card on near-black

## Read

*Figures measured off the image with Python/PIL (median-sampled hex, WCAG 2.x ratios, ink heights in original-image pixels unless stated); type-scale ratios are derived from those ink heights; radii in px are estimated by eye.*

**Colour.** Near-black field `#101010`–`#17161a`, one accent orange `#fb592a`/`#ff5e30` used for the card face, logo, shards and the active pagination dot (`#f55b32`). Idle dots `#1d2220` are almost invisible on the field.

**Typography.** Balance numeral cap 27px, title 17px, body 9px (orig px): numeral ≈1.6× title, title ≈1.9× body, numeral 3× body — a dramatic, top-heavy scale. Neo-grotesque, white bold title, grey body.

**Layout & harmony.** Centred single column: object hero (the card), title, two-line body, dots. Sparse; the object carries the screen.

**Shape & surface.** Card radius medium (~12px). The card is a frosted-glass slab with orange bleeding through, edged by a light rim — depth by blur and glow, not by shadow.

**Buttons & components.** No button in frame; pagination dots are the only control, active dot as a short orange bar.

**Gradient & imagery.** Blurred orange 3D shards behind the card and orange light bleeding through frosted glass — live-blur and render cost. Without the glow the card is a dark rectangle; the screen still works, so soft.

**Contrast.** Title white ≈ 20:1. Body `#686868` on `#17161a` = 3.23:1 — **fails**. Balance label `#867973` ≈ 4.6:1, borderline. White on the orange `#fb592a` = 3.20:1 — fails for small text.

## Why the verdict

Concept; cost is high (blur + glow) and body contrast fails. The object-hero onboarding mechanism transfers; the finish does not. Low confidence because the frame is a fragment of a flow.

## Notes

Original filename: `pin-component-design-idea-6No59M1Z79EA.jpg`. Card numerals and $ placement would need checking under RTL (numerals stay LTR inside a mirrored layout).

**Related:** —
