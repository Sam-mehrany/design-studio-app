---
type: design-ref
id: REF-0069
title: "Workout detail — '20 min Upper Body' dark screen, lime accent"
source: "Pinterest board 'Health app' (private) https://de.pinterest.com/mehrani0146/health-app/ — pin https://de.pinterest.com/pin/1024498615375290517/"
kind: concept
captured: 2026-11-24
image: library/REF-0069.jpg
archetype: [J.CORE.detail]
facets: [A.FAM.dark-athletic, A.POS.performance, B.GRID.single-column, B.DEN.moderate, B.HIER.size, B.HIER.enclosure, B.CONT.cards, B.CONT.seams, B.SPACE.rhythmic, B.REACH.bottom-primary, C.PAL.single-accent, C.VAL.dark-first, C.CON.high, C.SEM.strict, C.SAT.vivid, C.MAT.flat, D.FACE.neo-grotesque, D.PAIR.single, D.SCALE.two-tier, D.WGT.two-step, D.NUM.lining, D.HERO.inline, E.RAD.large, E.RAD.pill, E.DEP.tonal, E.DEP.border-only, E.ACC.badge, F.IMG.photography, F.DEP.soft, F.PHOTO.tight-crop, F.ICON.line, F.ICON-SYS.single-weight, H.TONE.terse, H.LEN.minimal, H.NUM.unit-adjacent, K.DEV.handheld, K.INPUT.touch, K.INPUT.one-hand, K.ENV.gym, K.ATT.interstitial, K.LOC.ltr-latin, K.A11Y.contrast]
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

# REF-0069 — Workout detail — "20 min Upper Body" dark screen, lime accent

## Read

Values below: hex values **measured by pixel sampling** (dominant colours); type sizes estimated by eye and labelled as such. One line of context: a workout detail screen — title, meta line, a "New" feature card with a muscle diagram, a Warm Up exercise row, and a floating Start Workout pill over a tab bar.

**Colour.** Measured: near-black field #18181A, card surface #363638, white text #FFFFFF, lime accent (estimated ~#D9F24F, sampled greys only — the lime occupies a small area). One accent only, used for the "New" badge, the muscle highlights and the Clips tab badge; it always means "new / active", never decorates. No status hues beyond it.

**Typography.** Estimated by eye: title ~34–38 px bold, meta line ~15 px grey, card body ~19 px regular, exercise name ~19 px semibold, "Start Workout" ~19 px semibold on the white pill. Two-tier scale — the title is the hero, everything else is one quiet tier. Numerals lining ("20 min", "30s").

**Layout & harmony.** Single column, estimated: ~20 px side padding, card radius ~20 px, sections separated by hairlines and tone steps rather than gutters. Hierarchy is size first (title), then enclosure (the feature card), then position. The bottom pill CTA sits inside the thumb arc; the tab bar below it is partly covered by the pill, which is a real layout tension.

**Shape & surface.** Radius scale estimated: cards ~20 px, pills fully rounded, the settings icon a white circle. Separation is tonal (card #363638 on field #18181A) plus a hairline border on the feature card. No shadow. The muscle diagram is a flat vector silhouette with lime-lit muscle groups.

**Buttons & components.** The loudest element is the white "Start Workout" pill with a black play disc — louder than any data on screen. Secondary actions are quiet: an outlined "Customize workout" pill, a tonal "Refresh" pill, circular icon buttons (bookmark, more). The "New" badge is a small lime pill, the only coloured label.

**Gradient & imagery.** No gradient. One small exercise thumbnail photo (tight crop of a person exercising) and the flat muscle diagram; delete the photo and the row still reads, so imagery dependency is soft. The diagram carries the "target muscles" feature, not decoration.

**Contrast.** Computed from sampled colours: white #FFFFFF on field #18181A ≈ 17.9:1 — passes. Lime ~#D9F24F on #18181A ≈ 15:1 — passes. Mid-grey meta text (estimated ~#8A8A8A on #18181A ≈ 5.5:1) — passes, estimated not measured.

## Why the verdict

Adapt: the single-lime-on-black system with a tonal card ladder and a bottom pill CTA is a clean, low-cost mechanism that mirrors well, but this is a staged concept crop (no status bar, tab bar obscured by the CTA), so adapt, not adopt.

## Notes

Original file: browser-download-20261124T174903.545175117Z-52-4900734d6e3500d1d08171142d515b7a.jpg (736x1472), from Pinterest board "Health app".

**Related:** REF-0070 · REF-0071 · REF-0073 — dark-first lime-accent fitness screens in this batch; the lime accent is the shared mechanism, the card ladders differ.
