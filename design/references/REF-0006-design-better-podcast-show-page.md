---
type: design-ref
id: REF-0006
title: "Design Better — podcast show page with episode list"
source: "Pinterest pin https://de.pinterest.com/pin/1024498615378073091/ — board 'Component Design Idea' (mehrani0146)"
kind: shipped
captured: 2026-11-24
image: library/REF-0006.jpg
archetype: [J.CORE.browse]
facets: [A.FAM.print-poster, B.GRID.single-column, B.DEN.moderate, B.HIER.size, B.HIER.colour, B.CONT.bare, B.SPACE.rhythmic, C.PAL.single-accent, C.VAL.tonal-layered, C.CON.high, C.SAT.vivid, D.FACE.grotesque, D.SCALE.dramatic, D.WGT.high-contrast, D.CASE.sentence, D.NUM.lining, E.RAD.large, E.DEP.tonal, E.EDGE.framed, F.IMG.photography, F.PHOTO.tight-crop, F.DEP.soft, F.ICON.line, K.DEV.handheld, K.LOC.ltr-latin, K.INPUT.touch]
imagery_dep: soft
rtl: risky
cost: low
verdict: adapt
confidence: med
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
concept: mobile
---

# REF-0006 — Design Better — podcast show page with episode list

## Read

Values below were **measured by sampling pixels** (hex values and WCAG ratios computed from sampled colours); type sizes are estimated by eye and labelled as such. One line of context: a shipped podcast app's show page — a poster-style cover above an episode list, with a mini-player pinned at the bottom.

**Colour.** Measured surface ladder: grey backdrop #495058, hero orange #FB4722, lower feed panel dark brown #54180D. One accent hue only — the orange-red carries the whole identity, the brown is its dark tonal step, and the grey is a neutral stage. No semantic hues: no green, amber or blue for status; meaning is carried by size, weight and position.

**Typography.** Estimated by eye: show title "Design Better" at about 56–64 px bold across two lines on the cover, episode titles at about 15–17 px semibold, body excerpt at about 13–14 px, dates at about 12 px. Headline-to-body multiple about 4×, a dramatic two-tier scale with almost nothing in between. The face is a grotesque sans; numerals are lining ("40m", "-1:18:05").

**Layout & harmony.** Single-column phone screen, estimated by eye: cover occupies the top ~55%, feed rows below with about 16–20 px gaps, one family of spacing throughout. Hierarchy is ranked by size first (the cover title), then by colour (orange vs brown), then by position. The thin cream graphic lines on the cover are the only ornament, and they align to the same grid as the text.

**Shape & surface.** Estimated radius scale, by eye: phone frame about 36–40 px, inner controls (back, search, sort pills) fully circular or pill, episode thumbnails about 8–10 px. Separation is tonal, not bordered: orange steps to brown with no outline and no shadow, and the mini-player floats as a lighter brown pill over the feed.

**Buttons & components.** The loudest controls are the small circular icon buttons (back, search, sort) in a translucent orange-white on the cover — quiet against the orange — while the mini-player is the loudest element in the lower half: a full-width pill with play control and a 60-second skip badge. The "40m" duration pill and the download icon are secondary, set in muted brown-grey.

**Gradient & imagery.** No gradient on any interface surface; the cover is flat orange. Imagery is limited to small square episode thumbnails (tight-cropped portraits), about 64–72 px each. Removing them would not break the layout — titles, dates and durations still read — so the imagery dependency is soft, not hard.

**Contrast.** Measured: black text on orange #FB4722 is 5.42:1 — passes 4.5:1. White on dark brown #54180D is 13.88:1 — passes. The failure is the white status-bar icons and time on the orange cover at 3.48:1 — below 4.5:1 for small text, so the status row is the one measured miss.

## Why the verdict

Adapt: the cover-as-poster plus list mechanism is sound and cheap (flat colour, no blur, no mesh), but the white-on-orange status row fails contrast as measured, and the left-anchored hero makes RTL risky — both fixable without changing the mechanism.

## Notes

Original file: browser-download-20261124T151634.350231426Z-0-9e972989c922451d2a92db833b833846.jpg (1080x1920), from Pinterest board "Component Design Idea".

**Related:** REF-0005 (dark browse grid) · REF-0016 (poster-type headline card)
