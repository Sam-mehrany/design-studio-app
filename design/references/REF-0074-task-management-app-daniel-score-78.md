---
type: design-ref
id: REF-0074
title: "Task management app — 'Hello Daniel, your overall score is above average', 78%"
source: "Pinterest board 'Health app' (private) https://de.pinterest.com/mehrani0146/health-app/ — pin https://de.pinterest.com/pin/1024498615375290401/"
kind: concept
captured: 2026-11-24
image: library/REF-0074.jpg
archetype: [J.DATA.home]
facets: [A.FAM.flat, A.POS.utilitarian, B.GRID.split, B.DEN.moderate, B.HIER.size, B.HIER.weight, B.CONT.cards, B.SPACE.generous, C.PAL.duotone, C.VAL.light-first, C.CON.high, C.SEM.loose, C.SAT.muted, C.MAT.flat, D.FACE.grotesque, D.PAIR.single, D.SCALE.dramatic, D.WGT.high-contrast, D.NUM.lining, D.HERO.display-numeral, E.RAD.large, E.RAD.pill, E.DEP.border-only, E.DEP.tonal, F.IMG.photography, F.DEP.soft, F.PHOTO.tight-crop, F.ICON.line, H.TONE.warm, H.LEN.minimal, H.NUM.unit-adjacent, K.DEV.handheld, K.INPUT.touch, K.LOC.ltr-latin, K.ATT.interstitial, K.A11Y.contrast]
imagery_dep: soft
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

# REF-0074 — Task management app — "Hello Daniel, your overall score is above average", 78%

## Read

Values below: hex values **measured by pixel sampling** (dominant colours); type sizes estimated by eye and labelled as such. One line of context: a two-phone presentation spread (labelled "UI/UX Task Management App", 2023) — left phone a dark home with a pale-green tasks card, right phone a light "Statistics" screen with a big headline and a 78% progress figure. Note: this is a task/habit app, not a health app, despite the board it was pinned to.

**Colour.** Measured: light page #E5E5E5, white #FFFFFF, black #202020. Two hues carry the palette: pale green (estimated ~#D8E8C8) for the "Current tasks" card and pale yellow (estimated ~#F2E3A0) for the "Statistics shared" strip — a duotone of soft tints on black-and-white, with a pink "High" tag as a third small hue. Colour is loose: the tints decorate sections rather than meaning anything consistent.

**Typography.** Estimated by eye: "Hello 👋 Daniel / your overall / score is above / average" ~30–34 px bold with tight leading, "78%" ~40 px bold, card titles ~16 px semibold, body ~13 px. Dramatic scale — the headline and the 78% are display, everything else is one small tier. Weight contrast (heavy display vs regular body) does most of the ranking.

**Layout & harmony.** Two phones on a light-grey spread, each a single column of stacked cards. Left phone: dark header, green tasks card, webinar row, community card with photo. Right phone: statistics header, yellow shared strip, Weekly/Monthly toggle, progress row, bottom nav. Hierarchy is size first (headline, 78%), then enclosure. Space is generous between cards.

**Shape & surface.** Radius scale estimated: cards ~20–24 px, pills fully rounded, phones ~48 px. Separation is by border (hairline on light cards) and tone (dark phone header vs light cards). No shadow. The green and yellow tinted cards are flat colour blocks, not gradients.

**Buttons & components.** The black circular "+" button and the "Weekly/Monthly" segmented toggle are the only real controls; the loudest element is the "78%" figure, not any control. The "You have 3 tasks" card uses a pink "High" tag and hashtag chips (#shopping, #renovation, #planning) as its content.

**Gradient & imagery.** No gradient. One photo (a person with a coffee cup) appears twice — in the community card and as a header strip — so the imagery is repeated stock, not load-bearing; delete it and both screens still read, so dependency is soft.

**Contrast.** Computed from sampled colours: black #202020 on white #FFFFFF ≈ 16.1:1 — passes. Black on pale green ~#D8E8C8 ≈ 12:1 — passes. Grey body text (estimated ~#8A8A8A on white ≈ 3.9:1) — fails 4.5:1 for small text, estimated not measured; the small grey captions are the weakest text on the spread.

## Why the verdict

Adapt: the oversized-headline-plus-one-big-number statistics screen is a strong, low-cost pattern, but this is a 2023 concept presentation spread of a task app (off-topic for the Health board), with loose colour semantics and small grey text that likely fails contrast — adapt, not adopt.

## Notes

Original file: browser-download-20261124T175214.630955608Z-57-e46871352d9944b850b11f8ae623d5b6.jpg (736x552), from Pinterest board "Health app". Task/habit management content, not health — filed here because that is the board it came from. Dated 2023 in the image.

**Related:** REF-0075 — the other task-management concept in this batch; both use oversized display type as the ranking device.
