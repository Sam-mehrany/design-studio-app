---
type: design-ref
id: REF-0002
title: "Sivra social profile card, blue 3D banner on black"
source: "Pinterest board 'component-design-idea' (mehrani0146)"
kind: concept
concept: component
captured: 2026-11-26
image: library/REF-0002.jpg
archetype: [J.ACQ.profile-public]
facets: [A.ERA.current, B.CONT.cards, B.HIER.size, C.PAL.single-accent, C.VAL.light-first, C.SAT.vivid, D.FACE.neo-grotesque, D.SCALE.two-tier, D.WGT.two-step, E.RAD.large, E.RAD.pill, E.DEP.border-only, E.ENV.white-void, F.IMG.render-3d, F.3D.rendered-real, F.DEP.soft, K.DEV.handheld]
imagery_dep: soft
rtl: clean
cost: med
verdict: adapt
confidence: med
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: Thu 2026-11-26 1:45 PM EST (UTC-05:00)
---

# REF-0002 — Sivra social profile card — blue 3D banner, white body, on black

## Read

*Figures measured off the image with Python/PIL (median-sampled hex, WCAG 2.x ratios, ink heights in original-image pixels unless stated); type-scale ratios are derived from those ink heights; radii in px are estimated by eye.*

**Colour.** Single accent: a saturated blue (`#0063fe` avatar, `#2161ee` in the render) on a pale-blue banner `#cedbfe` and a pure-white body. Page is `#000000`. Text is near-black; the handle grey is `#646464`.

**Typography.** Banner headline cap height 34px vs bio cap 24px — only 1.4×, and the display name is set no larger than the bio, so the name does not lead. Neo-grotesque, two weights (bold name, regular bio).

**Layout & harmony.** X/Twitter profile-card anatomy: banner, overlapping round avatar left, Follow pill right, name/handle/bio/meta stacked. Moderate density, clear top-to-bottom order.

**Shape & surface.** Large outer radius (~24px). The card has a thin grey rim (`#3c3c3c` at the edge) reading as a bevel against black — border, no cast shadow. Avatar is a full circle with a white ring.

**Buttons & components.** One button: a solid near-black Follow pill `#231f20`, white text 16.3:1. Quiet relative to the banner.

**Gradient & imagery.** The banner is a halftone-textured 3D blue render. Remove it and the card still works (it becomes a plain banner), so soft dependence; the render is the only cost.

**Contrast.** Body/name ≈ 21:1 on white; handle `#646464` on white = 5.92:1, passes. Headline on the pale banner ≈ 18.6:1.

## Why the verdict

Concept card with placeholder content; the anatomy is a well-worn shipped pattern (X profile) but the finish here is decorative. Adapt.

## Notes

Original filename: `pin-component-design-idea-56eZwPkaEVvA.jpg`. Same profile-card family as REF-0007 and REF-0016 (likely one designer's series). Hierarchy flaw worth noting: name not larger than bio.

**Related:** —
