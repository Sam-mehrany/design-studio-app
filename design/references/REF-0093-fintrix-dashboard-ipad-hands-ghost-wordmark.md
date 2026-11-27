---
type: design-ref
id: REF-0093
title: "Hands-held iPad mockup — dark fintech dashboard with orange single-bar highlight, ghost wordmark backdrop (Fintrix)"
source: "Pinterest board 'mockup-idea' (mehrani0146)"
kind: concept
concept: mockup
captured: 2026-11-27
image: library/REF-0093.jpg
archetype: [J.DATA.home]
facets: [A.FAM.corporate-saas, A.POS.premium, B.GRID.modular, B.DEN.dense, B.HIER.colour, B.CONT.cards, C.VAL.dark-first, C.PAL.single-accent, C.SEM.layered, C.VIZ.accent-only, D.FACE.geometric-sans, D.SCALE.tight, E.RAD.medium, E.RAD.pill, E.ACC.badge, E.ENV.tonal-field, F.ICON.line, F.DEP.none, F.COST.med, K.DEV.tablet, K.INPUT.touch, K.LOC.ltr-latin]
imagery_dep: none
rtl: risky
cost: med
verdict: adapt
confidence: med
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: Fri 2026-11-27 12:45 PM EST (UTC-05:00)
medium: photo
platform: tablet
---

# REF-0093 — Hands-held iPad mockup — dark fintech dashboard with orange single-bar highlight, ghost wordmark backdrop (Fintrix)

## Nature

iPad held in real hands → photographed.

*Nature backfilled by Hark, 27 Nov 2026, from the image.*

## Read

Measured: hex values and WCAG ratios sampled from the original file with Python/PIL (median of a region for grounds, extreme-luminance pixels for text, so anti-aliasing can pull a ratio slightly low); cap heights by row profiling where stated. Anything marked *estimated* was read by eye. These pins are ~564px wide, so small UI text is only 3–6px tall in the file; its sampled ratio reads lower than the designed colour would, and is flagged where that matters.

**Colour.** Dark-first: screen `#161616`, cards `#131313` — almost no tonal step between them. Orange `#f06211` is the brand/action hue (New Payment button, active nav, highlighted chart bar `#ee630a`, upgrade card); status pills add green, red and amber at low saturation (`#2f5433`, `#553236`, `#404021` grounds). Backdrop is a grey gradient `#848484`→`#dcdcdc` with the "Fintrix" wordmark as a ghost.

**Typography.** Geometric sans, small and tight; stat values `$19,270.56` are only slightly larger than labels. Hierarchy is carried by colour and the one orange bar more than by size.

**Layout & harmony.** Sidebar with MAIN / FEATURES / TOOLS groups, three stat cards, a bar chart, a transactions table, and a right column (card, quick actions, daily limit, bills). Dense, modular, one radius family.

**Shape & surface.** Medium card radius, pill status chips and buttons, flat tonal cards.

**Buttons & components.** Orange filled "New Payment"; status pills (Received / Failed / Processed); segmented orange progress bar for the daily limit. Accent-only chart: every bar grey except the selected one.

**Gradient & imagery.** No photography; the glow on the highlighted bar is the only effect.

**Contrast.** Stat values `#a9a9a9` on `#1a1a1a` = 7.41:1; labels `#757575` = 3.93:1 — fails; sidebar items `#474747` = 1.93:1 and table text `#303030` = 1.37:1 sampled (tiny, but clearly too dim). White on the orange = 3.25:1 — fails for text; black on it = 6.46:1.

## Why the verdict

The accent-only chart (all grey, one orange bar) is a strong, cheap data mechanism; the cards need more tonal separation and the secondary text fails. Concept (the same $19,270.56 appears three times) → adapt, med.

## Notes

Original file: `pin-mockup-idea-1024498615378162258.jpg`. Pin: https://www.pinterest.com/pin/1024498615378162258/ — outbound link: https://payhip.com/InterfaceMotel/blog/news/make-the-small-details-feel-thoughtful-with-free-settings-ui-kits/?figma-dashboard. Pin description: Fintrix financial dashboard by @orbixstudiollc. Ghost wordmark device also in REF-0084.

**Related:** REF-0084 · REF-0031
