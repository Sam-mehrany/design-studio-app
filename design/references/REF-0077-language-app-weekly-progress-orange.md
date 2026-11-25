---
type: design-ref
id: REF-0077
title: "Language app — 'You've completed 5 modules this week', tilted phone on orange"
source: "Pinterest board 'Health app' (private) https://de.pinterest.com/mehrani0146/health-app/ — pin https://de.pinterest.com/pin/1024498615375290330/"
kind: concept
captured: 2026-11-24
image: library/REF-0077.jpg
archetype: [J.DATA.record, J.CORE.browse]
facets: [A.FAM.editorial, A.POS.playful, B.GRID.single-column, B.DEN.sparse, B.HIER.size, B.HIER.weight, B.CONT.cards, B.SPACE.generous, C.PAL.duotone, C.VAL.dark-first, C.CON.high, C.SEM.loose, C.SAT.vivid, C.MAT.flat, D.FACE.grotesque, D.PAIR.single, D.SCALE.dramatic, D.WGT.high-contrast, D.NUM.lining, E.RAD.large, E.RAD.pill, E.DEP.tonal, E.DEP.border-only, F.IMG.illustration, F.DEP.soft, F.ILL.line, F.ICON.line, H.TONE.warm, H.LEN.minimal, H.NUM.unit-adjacent, K.DEV.handheld, K.INPUT.touch, K.LOC.ltr-latin, K.ATT.interstitial, K.A11Y.contrast]
imagery_dep: soft
rtl: breaks
cost: low
verdict: adapt
confidence: med
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
concept: mockup
---

# REF-0077 — Language app — "You've completed 5 modules this week", tilted phone on orange

## Read

Values below: hex values **measured by pixel sampling** (dominant colours); type sizes estimated by eye and labelled as such. One line of context: a marketing shot — a phone tilted ~30° on a burnt-orange surface, showing a dark home screen with a "Salut, Emily!" greeting, a "You've completed 5 modules this week" headline, an orange "View Progress" pill and two lesson cards ("Going shopping", "Around the world"). Note: language-learning content, not health, despite the board.

**Colour.** Measured: burnt-orange ground #AF391D, light greys #E7E7E7/#CCCCCC, black #000203. The screen itself is dark (estimated ~#1A1A1A) with a coral-orange accent (estimated ~#F25A2A) that matches the orange ground — the accent is the brand colour, used for the CTA pill and the second lesson card. White lesson card vs orange lesson card is the only colour contrast on screen; the palette is duotone (orange + black/white) with no semantic hues.

**Typography.** Estimated by eye: headline "You've completed / 5 modules / this week" ~28–32 px bold, rotated with the phone, greeting ~16 px, card titles ~18 px bold, "01"/"02" ~14 px. Dramatic scale — the headline is the whole screen, everything else is one small tier. The headline's tight leading and the tilt are the composition, not the type scale.

**Layout & harmony.** One phone, diagonal, filling the frame corner to corner; the orange ground is the page. Inside the phone: a single column — XP/streak pills top, greeting, headline, CTA pill, two lesson cards side by side, "Scheduled" label and "See all" bottom. Hierarchy is size (headline) then colour (orange card). The tilt makes the whole screen read as a left-to-right diagonal sentence, so RTL breaks.

**Shape & surface.** Radius scale estimated: lesson cards ~16 px, CTA pill fully rounded, phone ~40 px. Separation is tonal (dark screen on orange ground; white card vs orange card). No shadow on the UI; the phone casts a soft real shadow on the orange surface. The lesson cards carry line illustration (a shopping tote, a globe) in black on white/orange.

**Buttons & components.** The orange "View Progress" pill with an arrow is the loudest control; the two numbered lesson cards are the browse objects. The "1,230 XP" and "0 days" pills at the top are quiet status chips. The loudest element overall is the headline, not a control.

**Gradient & imagery.** No gradient. The lesson-card illustrations are monoline drawings — decorative, and the cards still read without them, so dependency is soft. The orange ground is a photographic surface, not a UI element; the shot is a product photo of a phone, not a screenshot.

**Contrast.** Computed from sampled colours: white on burnt orange #AF391D ≈ 5.9:1 — passes. White on the dark screen (estimated ~#1A1A1A ≈ 17:1) — passes. Black on orange lesson card ~#F25A2A ≈ 5.5:1 — passes. All headline and card text passes; the smallest text is the "See all" caption, estimated grey on dark, not measured.

## Why the verdict

Adapt: the headline-led weekly-progress screen with numbered lesson cards is a strong, low-cost pattern, but this is a tilted marketing photo of a language app (off-topic for the Health board), and the diagonal composition breaks under RTL — adapt, not adopt.

## Notes

Original file: browser-download-20261124T175354.800967800Z-60-e236f8a7dee2efc2c64e6a5d34ac2a6c.jpg (736x1308), from Pinterest board "Health app". Language-learning content, not health — filed here because that is the board it came from.

**Related:** REF-0078 — the other non-health wellness-adjacent concept in this batch.
