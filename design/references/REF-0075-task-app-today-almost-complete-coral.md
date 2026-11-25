---
type: design-ref
id: REF-0075
title: "Task app — 'Your task today is almost complete!', coral cards, checklist detail"
source: "Pinterest board 'Health app' (private) https://de.pinterest.com/mehrani0146/health-app/ — pin https://de.pinterest.com/pin/1024498615375290334/"
kind: concept
captured: 2026-11-24
image: library/REF-0075.jpg
archetype: [J.CORE.queue, J.CORE.detail]
facets: [A.FAM.flat, A.POS.utilitarian, B.GRID.split, B.DEN.moderate, B.HIER.size, B.HIER.weight, B.CONT.cards, B.SPACE.rhythmic, C.PAL.duotone, C.VAL.dark-first, C.CON.high, C.SEM.layered, C.SAT.vivid, C.MAT.flat, D.FACE.grotesque, D.PAIR.single, D.SCALE.dramatic, D.WGT.high-contrast, D.NUM.lining, E.RAD.large, E.RAD.pill, E.DEP.tonal, E.DEP.border-only, F.IMG.none, F.DEP.none, F.ICON.line, H.TONE.warm, H.LEN.helper, H.NUM.unit-adjacent, K.DEV.handheld, K.INPUT.touch, K.LOC.ltr-latin, K.ATT.interstitial, K.A11Y.contrast]
imagery_dep: none
rtl: clean
cost: low
verdict: adapt
confidence: med
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
concept: mobile
---

# REF-0075 — Task app — "Your task today is almost complete!", coral cards, checklist detail

## Read

Values below: hex values **measured by pixel sampling** (dominant colours); type sizes estimated by eye and labelled as such. One line of context: three phones on black — an onboarding cover ("Effortlessly manage your to-do list"), a task list with coral cards ("Robin Buenos", "John De Palace"), and a task detail with a checked checklist and a "Mark as Complete" pill. Note: task-management content, not health, despite the board.

**Colour.** Measured: black field #010101, white #FFFFFF, card surface #1F1F1F. One vivid accent: coral/salmon (estimated ~#F27A5E) fills the task cards and the "Get Started" arrow disc; on the detail phone the same coral is the headline colour. Duotone in effect — coral plus black/white — with coral meaning "the task" and black meaning "the app". No other hues.

**Typography.** Estimated by eye: cover headline ~34–38 px bold with tight leading ("Effortlessly / manage your / to-do list and / take control of / your day"), list headline "Your task / today is almost / complete!" ~30 px bold, card titles ~18 px bold, body ~13–14 px. Dramatic scale: display headlines rank everything, body is one quiet tier. Weight contrast is high.

**Layout & harmony.** Three phones in a row on a black void, each a single column. Left: centred headline over a black silk-like backdrop, one pill CTA bottom. Middle: date strip, two coral task cards with progress pills ("2 hours", "69%"; "3 hours", "100%"), a third card peeking. Right: detail header, description paragraph, checklist of five items, bottom CTA. Hierarchy is size first, then enclosure; density moderate.

**Shape & surface.** Radius scale estimated: cards ~20–24 px, pills fully rounded, the coral cards are flat colour blocks with no border and no shadow. Separation is tonal (card #1F1F1F on black #010101) or by the coral fill itself. The cover phone's backdrop is a dark silk texture — the only non-flat surface in the set.

**Buttons & components.** The loudest elements are the coral cards themselves, not the controls. The "Mark as Complete" black pill with a check is the primary action on the detail phone; the "Get Started" pill with a coral arrow disc is the cover CTA. Progress is shown as small pills ("69%", "100%") and as checked coral squares in the checklist — icon plus state, not colour alone.

**Gradient & imagery.** No gradient and no photography — the only imagery is the dark silk texture behind the cover headline, which is decorative. Nothing breaks without it; this is a type-and-colour system throughout.

**Contrast.** Computed from sampled colours: white on black #010101 ≈ 21:1 — passes. Black on coral ~#F27A5E ≈ 6.5:1 — passes for the card titles. White on coral ≈ 3.0:1 — fails, but no white text sits on coral (card titles are black on coral). Grey body text (estimated ~#8A8A8A on #1F1F1F ≈ 4.9:1) — passes, estimated not measured.

## Why the verdict

Adapt: the coral-card-as-task-object with a display headline and a checklist detail is a strong, low-cost, imagery-free mechanism that mirrors cleanly, but it is a staged three-phone concept of a task app (off-topic for the Health board), so adapt, not adopt.

## Notes

Original file: browser-download-20261124T175250.330523012Z-58-8c99aa282c39ccfdef74b96231f9f385.jpg (735x554), from Pinterest board "Health app". Task-management content, not health — filed here because that is the board it came from.

**Related:** REF-0074 — the other task-management concept in this batch.
