---
type: design-ddr
id: DDR-0001
title: "No live blur, mesh gradients or decorative raster in the Iranian products"
status: accepted
date: 2026-10-29
scope: "health-app, all three surfaces (athlete PWA, trainer panel, public profile)"
facets: [E.DEP.live-blur, C.MAT.gradient-mesh, A.FAM.glassmorphism, F.IMG.photography, F.COST.low]
forced_by: [K.NET.throttled, K.NET.censored, K.TIER.midrange]
tags: [design/ddr]
---

# DDR-0001 — No live blur, mesh gradients or decorative raster in the Iranian products

**Status:** accepted
**Date:** 2026-10-29
**Scope:** health-app, all three surfaces (athlete PWA, trainer panel, public profile)
**Facet terms:** `E.DEP.live-blur` ✗ · `C.MAT.gradient-mesh` ✗ · `A.FAM.glassmorphism` ✗ · `F.IMG.photography` ✗ · `F.COST.low` required
**Forced by:** `K.NET.throttled` · `K.NET.censored` · `K.TIER.midrange` · no-UGC legal position

## Decision

Depth comes from hairline borders and surface tone only. No runtime backdrop blur, no mesh
or multi-stop gradient fields, no decorative raster imagery, no video. One Persian face,
subset and self-hosted domestically, with a Latin fallback. Each screen has a stated KB
ceiling. Visual interest comes from type, structure and the data itself
(`F.IMG.data-as-image`).

## Alternatives considered

| Option | Why not |
|---|---|
| Glass/blur surfaces as the depth model | GPU cost on mid-range Android, and it needs a busy backdrop to read — which means imagery we cannot ship |
| Photography-led, as nearly every fitness app | Photo and video UGC is not permissible in this market, and the download weight is unaffordable at current data prices |
| Shadow-elevation depth | Reads poorly on dark surfaces and costs more to composite than borders; tonal layering does the same job |
| Variable font for the whole weight range | Attractive, but the Persian subset cost is worse than two static weights |

## Cost

The product will look plainer than its international reference set, and it gives up one of
the easy routes to a premium feel. Distinctiveness has to be earned structurally — through
type, density and the quality of the data display — which is harder and slower.

It also means the reference board's most-liked pins will mostly be unusable as drawn. That
is the trade, made knowingly.

## Where it binds

Every token, every component, every screen on all three surfaces. The budget is checked at
Stage 9 of the project's design method, per surface.

## Conflicts

Tensions with **PREF-0004** and **PREF-0006**, which record a liking for tonal environment
depth and genuinely rendered material. Those remain true for **brand and marketing** assets
rendered once and served as a single optimised image. They do not extend to runtime effects
inside the product. No preference is overridden; the scopes are different, and this record
exists so that distinction is explicit rather than discovered later.

Consistent with **PREF-0001**: this is a reduction driven by named external constraints, with
its cost written down — not a quiet lowering of ambition.

**Related:** PREF-0001 · PREF-0004 · PREF-0006 · BRIEF-training-athlete-pwa
