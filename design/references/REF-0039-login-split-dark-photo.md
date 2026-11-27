---
type: design-ref
id: REF-0039
title: "Split login: form left, dark photo panel with overlaid claim"
source: "Pinterest board 'login-page-design' (mehrani0146)"
kind: concept
concept: component
captured: 2026-11-26
image: library/REF-0039.jpg
archetype: [J.ON.signup]
facets: [B.GRID.split, B.SPACE.generous, F.IMG.photography, C.PAL.neutral-only, C.VAL.light-first, E.RAD.medium, D.FACE.neo-grotesque, K.DEV.desktop, K.INPUT.pointer]
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
component_type: I.TYPE.auth-form
medium: flat-ui
platform: desktop
---

# REF-0039 — Split login: form left, dark photo panel with overlaid claim

## Nature

Split sign-in panel: credential form plus a photo panel → auth form, not a page.

*Nature backfilled by Hark, 27 Nov 2026, from the image.*

## Read

*Measured with PIL off the pin image (hex = mode of a sampled patch; text ink = strongest anti-aliased pixel in the glyph box, so small-text ratios can understate slightly; sizes are ink heights in image px, not CSS px).*

**Colour.** Neutral: page `#ececec`, form surface `#fcfcfc`, black button `#141414`; the right panel is a deep-blue sea photo (`#122e42`–`#244262`). No accent hue.

**Typography.** Neo-grotesque; bold black headline on the form side, large white claim on the photo, small grey helper text.

**Layout & harmony.** Two equal panes inside a browser frame: form pane with generous whitespace, image pane with bottom-left text.

**Shape & surface.** Medium radii on inputs, button and image pane.

**Buttons & components.** Full-width black primary (`#ffffff` on `#141414` = 18.4:1); outlined social sign-in buttons.

**Gradient & imagery.** The photo is atmosphere; the form works without it, but the right half becomes empty.

**Contrast.** Headline 20.4:1; subtitle `#464648` = 9.2:1; photo text ≈ 10.3:1. Placeholder `#a3a3a5` = 2.45:1, 'Remember me' 2.74:1, 'or continue' 2.47:1 — **fail**.

## Why the verdict

Standard split-login mechanism with a correct primary; helper/placeholder text fails, and it is a concept.

## Notes

Concept tell: password field placeholder reads 'Input your company name'. Browser chrome, not device hardware → web. No dedicated sign-in/log-in archetype exists; J.ON.signup used as nearest — propose J.ON.signin to Sam. Original filename: `pin-login-page-design-Bzs_6XJgDR-g.jpg`. Board is a hint only; concept judged from the image.

**Related:** —
