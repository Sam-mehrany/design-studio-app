---
type: design-ref
id: REF-0009
title: "Profile card in two variants: white and green grain gradient"
source: "Pinterest board 'component-design-idea' (mehrani0146)"
kind: concept
concept: component
captured: 2026-11-26
image: library/REF-0009.png
archetype: [J.ACQ.profile-public]
facets: [A.ERA.current, A.POS.playful, B.CONT.cards, B.HIER.size, C.PAL.single-accent, C.SAT.vivid, C.MAT.gradient-mesh, C.MAT.grain, D.FACE.neo-grotesque, D.WGT.two-step, E.RAD.large, E.RAD.pill, E.DEP.flat, E.STROKE.hairline, F.IMG.illustration, F.ILL.line, F.ICON.solid]
imagery_dep: soft
rtl: risky
cost: med
verdict: adapt
confidence: med
status: unreviewed
sam_reaction:
sam_note:
tags: [design/ref]
modified: Thu 2026-11-26 1:45 PM EST (UTC-05:00)
---

# REF-0009 — Profile card in two variants — white, and full green grain gradient

## Read

*Figures measured off the image with Python/PIL (median-sampled hex, WCAG 2.x ratios, ink heights in original-image pixels unless stated); type-scale ratios are derived from those ink heights; radii in px are estimated by eye.*

**Colour.** Variant A: white card on `#efefef`, text `#181d27` / `#535862` (Untitled-UI-like neutrals). Variant B: the same card flooded with a grainy green gradient `#016d6b` → `#108e5a` → `#6fb966`/`#abd184`. CTA is a black→grey gradient pill (`#111111` → `#666666`).

**Typography.** Stat numeral cap 36px, name 29px, labels 21px (orig px): stats lead at ~1.7× labels. Two weights, neo-grotesque.

**Layout & harmony.** Avatar → name/handle → hairline divider (`#dedede`) → three-stat row with icons → full-width CTA. Same skeleton in both variants.

**Shape & surface.** Large radius card, pill CTA with a circular arrow knob at its end (slide-to-act look). Flat.

**Buttons & components.** The CTA is the heaviest element in variant A; in B it competes with the gradient.

**Gradient & imagery.** Line-illustrated avatar (navy `#122c67`). The green grain gradient is pure decoration; deleting it returns variant A.

**Contrast.** Variant A passes: name 16.9:1, labels 7.14:1. Variant B **fails**: white on `#abd184` = 1.72:1, on `#6fb966` = 2.38:1; only the dark top `#016d6b` passes (6.17:1). Green-on-green labels measured 2.5–3.5:1.

## Why the verdict

Concept. Variant A's structure adapts cheaply; variant B is a contrast failure and is the reason confidence is not higher.

## Notes

Original filename: `pin-component-design-idea-MZQ25edYAe8g.png`. Arrow-ended CTA is directional (risky under RTL).

**Related:** —
