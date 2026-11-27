---
type: design-ref
id: REF-0080
title: "Sidebar navigation in a light/dark pair — grouped caps sections, lime action and upgrade pill (Qanun)"
source: "Pinterest board 'component-design-idea' (mehrani0146)"
kind: concept
concept: component
captured: 2026-11-27
image: library/REF-0080.jpg
archetype: [J.DATA.home]
facets: [A.FAM.corporate-saas, A.ERA.current, B.GRID.single-column, B.DEN.moderate, B.HIER.position, C.VAL.true-dual, C.PAL.single-accent, C.SAT.vivid, D.FACE.geometric-sans, D.PAIR.single, D.CASE.all-caps-label, D.CASE.title, D.WGT.two-step, E.RAD.medium, E.RAD.pill, E.DEP.tonal, F.ICON.line, F.IMG.none, F.DEP.none, F.COST.low, I.STATE.active, K.DEV.desktop, K.INPUT.pointer, K.LOC.ltr-latin]
imagery_dep: none
rtl: risky
cost: low
verdict: adapt
confidence: med
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: Fri 2026-11-27 12:45 PM EST (UTC-05:00)
component_type: I.TYPE.sidebar
medium: flat-ui
platform: desktop
---

# REF-0080 — Sidebar navigation in a light/dark pair — grouped caps sections, lime action and upgrade pill (Qanun)

## Nature

A sidebar navigation rail in a light/dark pair, no canvas beside it.

*Nature backfilled by Hark, 27 Nov 2026, from the image.*

## Read

Measured: hex values and WCAG ratios sampled from the original file with Python/PIL (median of a region for grounds, extreme-luminance pixels for text, so anti-aliasing can pull a ratio slightly low); cap heights by row profiling where stated. Anything marked *estimated* was read by eye. These pins are ~564px wide, so small UI text is only 3–6px tall in the file; its sampled ratio reads lower than the designed colour would, and is flagged where that matters.

**Colour.** Two themes of one component on a `#dedede` field. Light: panel `#ffffff`, active row `#efefef`. Dark: deep forest-green panel `#022a22` (not grey — the brand hue becomes the surface), active row a neutral `#606060`. One accent shared by both: lime `#d9ed44` on the "Upgrade" pill and the "+ Log" action (`#bcd231`). No semantic hues.

**Typography.** Geometric sans throughout, title case items, small tracked ALL-CAPS section labels (OVERVIEW / CONNECTIONS / MORE). Measured glyph heights: wordmark 8px, item 5px x-height, section label 3–4px — a tight two-step scale where position, not size, separates groups. Two weights (regular items, semibold active/wordmark).

**Layout & harmony.** Single column: logo + collapse, search with ⌘K chip, primary action, three labelled groups, then a pinned user/upgrade footer. Group labels and whitespace do the grouping; no dividers. Icon weight (outline, ~1.5px) matches the type weight, so it reads as one family.

**Shape & surface.** Panel radius ~10px, row highlight ~6px, pill button and chips (*estimated*). Tonal fills only — no borders or shadows on rows.

**Buttons & components.** One loud element per panel: the lime "Upgrade" pill bottom-right; "+ Log" is a small lime circle. Everything else is a quiet text row, active state by tonal fill rather than colour.

**Gradient & imagery.** None. Vector icons and type; nothing to lose.

**Contrast.** Dark: items `#8fa9a6` on `#042a22` = 6.17:1, section labels `#87a09c` = 5.33:1, active text `#d2d2d2` on `#636363` = 3.97:1 — fails. Light: section labels `#b1b1b1` on white = 2.07:1 — fails; items read 3.36:1 (thin 5px text, likely darker as designed). Dark text on lime = 4.5–4.7:1 sampled; true black on `#d9ed44` would be ~16:1.

## Why the verdict

A clean true-dual mechanism (brand hue as the dark surface, one shared accent) that costs nothing to build. Concept exploration with failing light-theme labels → adapt, med.

## Notes

Original file: `pin-component-design-idea-1024498615378161048.jpg`. Pin: https://www.pinterest.com/pin/1024498615378161048/ — outbound link: https://dribbble.com/imimran004. Pin description: health-app sidebar exploration in light and dark themes. Concept doubt: an isolated nav component, not a full screen, so `component`; archetype set to J.DATA.home because the taxonomy has no term for app-shell navigation — worth proposing one (e.g. `J.SYS.nav-shell`) to Sam.

**Related:** —
