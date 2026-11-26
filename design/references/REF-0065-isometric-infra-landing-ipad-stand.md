---
type: design-ref
id: REF-0065
title: "iPad-on-stand mockup — light landing with italic serif headline, orange single accent, isometric block diagram"
source: "Pinterest board 'mockup-idea' (mehrani0146)"
kind: concept
concept: mockup
captured: 2026-11-26
image: library/REF-0065.png
archetype: [J.ACQ.landing]
facets: [A.FAM.blueprint, A.ERA.current, B.GRID.asymmetric, B.DEN.moderate, B.HIER.size, C.VAL.light-first, C.PAL.single-accent, C.SAT.vivid, C.SEM.loose, D.PAIR.display-text, D.FACE.transitional-serif, D.FACE.neo-grotesque, D.CASE.title, E.RAD.small, E.STROKE.hairline, E.DEP.border-only, F.IMG.illustration, F.ILL.isometric, F.ILL.technical-diagram, F.DEP.soft, F.COST.med, E.ENV.staged, K.DEV.tablet, K.INPUT.touch, K.LOC.ltr-latin]
imagery_dep: soft
rtl: risky
cost: med
verdict: adapt
confidence: med
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: Thu 2026-11-26 1:40 PM EST (UTC-05:00)
---

# REF-0065 — iPad-on-stand mockup — light landing with italic serif headline, orange single accent, isometric block diagram

## Read

Measured: hex values and WCAG ratios sampled from the original file with Python/PIL (median of a region for grounds, extreme-luminance pixels for text, so anti-aliasing can pull a ratio slightly low); cap heights by row profiling where stated. Anything marked *estimated* was read by eye.

**Colour.** Screen `#f9f9f9` with near-black type `#212121`; one orange `#fd5811` used for buttons, the logo, the active nav dot and the highlighted blocks in the diagram. Neutral scene: grey wall `#83838b`, pale desk `#e3e4e8`, silver stand.

**Typography.** Headline is an italic transitional serif in Title-ish case ("Observe, Synthesise, Simulate, Build"); body and nav are a neo-grotesque in Title Case. Display serif + text sans. Headline-to-body about 2.5× (*estimated*).

**Layout & harmony.** Asymmetric: claim and CTAs top-left, the isometric diagram occupies the right two-thirds with numbered call-out tags (1–4), a faint square grid behind, logo strip at the base. Moderate density; size ranks, the grid gives a blueprint register.

**Shape & surface.** Small radius on buttons (~4px, *estimated*), hairline grid and borders, no shadows on the UI; the diagram blocks carry flat isometric shading.

**Buttons & components.** Paired CTA: filled orange "Start Building" + orange-outline "Explore the Docs"; the same pair repeats in the nav (Get started / Contact). Call-out tags are black squares with white numerals on hairline leaders.

**Gradient & imagery.** No gradients. The isometric illustration is the visual interest but the page stands without it (soft).

**Contrast.** Headline `#212121` on `#f9f9f9` = 15.3:1; body `#777777` = 4.25:1 — fails 4.5 narrowly; button label white on `#fd621f` = 2.92:1 (3.19:1 against the pure `#fd5811`) — fails for text at this size.

## Why the verdict

The single-accent + technical-diagram system is cheap (vector, type, one hue) and transfers; the orange fails as a text ground. Concept → adapt.

## Notes

Original file: `pin-mockup-idea-pauxVzRiFaCg.png`. Same orange-on-white-button contrast failure is common; darkening the orange to ~`#c2410c` would clear 4.5:1 with white.

**Related:** —
