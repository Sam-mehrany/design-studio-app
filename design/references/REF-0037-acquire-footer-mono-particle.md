---
type: design-ref
id: REF-0037
title: "Black footer: monospace display, grey/white split headline, particle render"
source: "Pinterest board 'footer-design' (mehrani0146)"
kind: concept
concept: web
captured: 2026-11-26
image: library/REF-0037.jpg
archetype: [J.ACQ.landing]
facets: [C.VAL.dark-first, C.PAL.neutral-only, D.FACE.mono, D.CASE.all-caps-label, D.SET.tracked-caps, B.HIER.colour, F.IMG.render-3d, E.RAD.sharp, A.POS.premium, K.DEV.desktop]
imagery_dep: soft
rtl: risky
cost: high
verdict: adapt
confidence: med
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: Thu 2026-11-26 1:12 PM EST (UTC-05:00)
---

# REF-0037 — Black footer: monospace display, grey/white split headline, particle render

## Read

*Measured with PIL off the pin image (hex = mode of a sampled patch; text ink = strongest anti-aliased pixel in the glyph box, so small-text ratios can understate slightly; sizes are ink heights in image px, not CSS px).*

**Colour.** Neutral-only on near-black `#0e0e0e`. Headline splits into white `#fcfcfc` (key words) and dark grey `#575757` (the rest) — hierarchy by value, not hue.

**Typography.** Monospace display headline, tracked all-caps mono micro-labels for column heads, sans/mono links.

**Layout & harmony.** Headline + square CTA on top, link columns below, copyright row; a particle point-cloud render fills one side.

**Shape & surface.** Sharp corners: the white CTA is a square, no radius anywhere.

**Buttons & components.** One white square button (`#121317` on `#fcfcfc` = 18.1:1) — loudest object on the page.

**Gradient & imagery.** Particle-cloud 3D render as atmosphere; the footer works without it.

**Contrast.** White words 19.1:1, links 18.6:1. Grey headline words `#575757` on `#0c0c0c` = 2.71:1 — **fails** even the 3:1 large-text floor. Mono labels `#666666` = 3.4:1 and copyright 3.2:1 — fail.

## Why the verdict

Value-split headline and sharp mono register are portable; the dim half of the headline fails contrast and the particle render is costly.

## Notes

Particle render likely WebGL/video if live → high cost. Original filename: `pin-footer-design-YzKXuPZ9WiqQ.jpg`. Board is a hint only; concept judged from the image.

**Related:** —
