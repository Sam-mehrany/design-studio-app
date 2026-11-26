---
type: design-ref
id: REF-0034
title: "Usage detail: monospace hero numerals, segmented meter, dithered photo frame"
source: "Pinterest board 'dashboard-design' (mehrani0146)"
kind: concept
concept: web
captured: 2026-11-26
image: library/REF-0034.jpg
archetype: [J.CORE.detail]
facets: [D.PAIR.mono-accent, D.FACE.mono, D.NUM.tabular, D.HERO.display-numeral, C.PAL.single-accent, C.SEM.layered, C.VAL.light-first, C.CON.low, E.TEX.pattern, E.RAD.large, F.IMG.photography, F.PHOTO.duotone, B.SPACE.generous, K.DEV.desktop, K.LOC.ltr-latin]
imagery_dep: soft
rtl: risky
cost: med
verdict: adapt
confidence: med
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: Thu 2026-11-26 1:12 PM EST (UTC-05:00)
---

# REF-0034 — Usage detail: monospace hero numerals, segmented meter, dithered photo frame

## Read

*Measured with PIL off the pin image (hex = mode of a sampled patch; text ink = strongest anti-aliased pixel in the glyph box, so small-text ratios can understate slightly; sizes are ink heights in image px, not CSS px).*

**Colour.** Near-white surfaces `#fafafa` / cards `#fefefe`, one orange `#f86000` for the segmented usage meter (idle segments pale grey) and the integration logo `#f06820`. Semantic green `#2d6a48` up, pink `#c24972` down; a cream chip `#fcf4e8` with brown text. Monochrome dithered photo around the frame.

**Typography.** Mono for figures (`12,480`, `142ms`, `+8.4%`), neo-grotesque for everything else. Label 22.6, title 30.1, hero numeral 45.1 (preview px): hero ≈ 2.0× label. Tabular by construction.

**Layout & harmony.** Breadcrumb header, title row with logo, two metric cards, then tabs and a content stream on a dotted grid. Generous spacing; low density.

**Shape & surface.** Large radii, hairline-faint card borders, dotted-grid background texture inside the app.

**Buttons & components.** Segmented meter of capsule bars is the signature component; tabs with a black underline; faded icon sidebar.

**Gradient & imagery.** A 1-bit halftone/dither landscape frames the app; it is decoration — the UI stands alone.

**Contrast.** Subtitle `#3c3c3c` on `#fcfcfc` = 10.8:1; green delta 6.1:1; pink `#c24972` = 4.4:1 (just under). Breadcrumb, search placeholder and inactive tabs `#aeaeae` = 2.1–2.2:1 — **fail**; faded sidebar icons ≈ 1.4:1.

## Why the verdict

Mono-for-data pairing and the segmented meter are transferable; faded inactive states fail contrast and it is a concept, so adapt.

## Notes

No term for 1-bit dither/halftone photography — filed as F.PHOTO.duotone, the nearest; propose a new F.PHOTO term (e.g. 'dithered') to Sam. Shows a third-party AI brand as the subject; brand content irrelevant to the reference. Original filename: `pin-dashboard-design-zjvJHNXZyQ6A.jpg`. Board is a hint only; concept judged from the image.

**Related:** —
