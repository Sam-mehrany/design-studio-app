---
type: design-ref
id: REF-0001
title: "AI shopping-assistant answer cards over product photo"
source: "Pinterest board 'component-design-idea' (mehrani0146)"
kind: concept
concept: component
captured: 2026-11-26
image: library/REF-0001.jpg
archetype: [J.CORE.search]
facets: [A.ERA.current, A.POS.premium, B.GRID.single-column, B.DEN.sparse, B.HIER.size, B.CONT.cards, C.PAL.neutral-only, C.VAL.dark-first, C.CON.high, D.FACE.neo-grotesque, D.SCALE.two-tier, D.WGT.single, D.CASE.sentence, E.RAD.large, E.RAD.pill, E.DEP.flat, F.IMG.photography, F.DEP.soft, F.PHOTO.full-bleed, H.TONE.neutral, K.DEV.handheld, K.INPUT.touch]
imagery_dep: soft
rtl: clean
cost: low
verdict: adapt
confidence: med
status: unreviewed
sam_reaction:
sam_note: "typo-graphy style, minimal design, modern design"
tags: [design/ref]
modified: Thu 2026-11-26 1:45 PM EST (UTC-05:00)
component_type: I.TYPE.chat
medium: flat-ui
platform: mobile
---

# REF-0001 — AI shopping-assistant answer cards over a product photo

## Nature

Stacked AI-assistant answer cards laid over a product photo; no screen chrome around them → a chat/answer component, phone-width.

*Nature backfilled by Hark, 27 Nov 2026, from the image.*

## Read

*Figures measured off the image with Python/PIL (median-sampled hex, WCAG 2.x ratios, ink heights in original-image pixels unless stated); type-scale ratios are derived from those ink heights; radii in px are estimated by eye.*

**Colour.** Neutral-only on the UI: cards `#131313` over a full-bleed product photo whose red is `#eb4846`; the card is fractionally translucent (it reads `#0d0101` where it crosses the jacket). Text is white; the de-emphasis grey measures ≈`#746b6c`. The only colour in frame is the photograph.

**Typography.** Two tiers only. The answer list (domain names) is display-sized: cap height 59px against 26px for the body line, a 2.3× jump with nothing between. One weight throughout; hierarchy is size plus the white/grey split. Neo-grotesque, sentence case.

**Layout & harmony.** A single column of stacked answer cards, one idea per card, generous internal padding. Each card ends in a row of pill actions, so the rhythm is text block → action row → next card.

**Shape & surface.** Large card radius (~24px at this scale) against pill buttons — two radii, cleanly nested. No shadow, no border: the card is defined purely by tone against the photo.

**Buttons & components.** Three button weights in one row: solid white (`#f8f8f8`, black text 19.8:1), solid mid-grey (`#717171`, white text 4.88:1), and an outline pill. The ladder is legible without colour.

**Gradient & imagery.** No gradients. The photo is context, not structure — delete it and the cards still stand, so `imagery_dep: soft`.

**Contrast.** Body white on `#131313` ≈ 20:1. Dimmed copy `#746b6c` on `#131313` = 3.59:1 — **fails** AA for body text. White on the grey pill = 4.88:1, passes narrowly.

## Why the verdict

Concept shot (perfect three-item answers), so not adopt. The two-tier type and the three-step pill ladder transfer; the dim grey needs lifting to ≥4.5:1.

## Notes

Original filename: `pin-component-design-idea-25IojfqwYoyw.jpg`. Board hint `component-design-idea`. Translucency over photo is minimal and not true live blur, so no blur cost recorded.

**Related:** —
