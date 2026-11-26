---
type: design-ref
id: REF-0040
title: "Split login with painted illustration and red primary"
source: "Pinterest board 'login-page-design' (mehrani0146)"
kind: concept
concept: web
captured: 2026-11-26
image: library/REF-0040.jpg
archetype: [J.ON.signup]
facets: [B.GRID.split, B.GRID.asymmetric, C.PAL.single-accent, C.SAT.vivid, C.VAL.light-first, D.FACE.neo-grotesque, D.WGT.two-step, E.RAD.small, F.IMG.illustration, F.ILL.editorial, K.DEV.desktop, K.INPUT.pointer]
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

# REF-0040 — Split login with painted illustration and red primary

## Read

*Measured with PIL off the pin image (hex = mode of a sampled patch; text ink = strongest anti-aliased pixel in the glyph box, so small-text ratios can understate slightly; sizes are ink heights in image px, not CSS px).*

**Colour.** White form `#fcfcfc` against a dark painterly panel (`#050712`–`#32252d`); one vivid red `#ea4236` for the primary button and the 'Forgot password' link.

**Typography.** Neo-grotesque; bold H1 ('Hi Designer') `#0d0d0d` = 18.9:1, labels/body regular dark grey `#3f3f3f`.

**Layout & harmony.** Asymmetric split: image ~45% left with a slanted edge into the form pane; form centred in the right pane.

**Shape & surface.** Small radii on inputs and button; the slanted divider is the one expressive shape.

**Buttons & components.** Full-width red primary with white label; Google button outlined beneath.

**Gradient & imagery.** A painted/illustrated figure panel as mood; the form stands without it.

**Contrast.** Labels `#3f3f3f` on white = 10.3:1. White on red `#ea4236` = 3.94:1 — **fails** 4.5:1 for a regular-weight label. Red link text on white ≈ 3.9:1 — fails.

## Why the verdict

Mechanism (one hot accent for the single action) is right; the red is a shade too light for its white label.

## Notes

Slanted split edge is the reason for B.GRID.asymmetric. No sign-in archetype; J.ON.signup used as nearest (see REF-0039). Original filename: `pin-login-page-design-HhOW5Dim00Sg.jpg`. Board is a hint only; concept judged from the image.

**Related:** —
