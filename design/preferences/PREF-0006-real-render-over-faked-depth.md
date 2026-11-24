---
type: design-pref
id: PREF-0006
title: "Genuinely rendered material over faked depth"
polarity: like
scope: "brand graphics and hero visuals"
evidence_date: 2026-10-21
facets: [F.3D.rendered-real, F.3D.faked-css, E.DEP.extruded, C.MAT.metallic, E.TEX.brushed-metal, E.TEX.polished, A.FAM.spatial-3d]
tags: [design/pref]
---

# PREF-0006 — Genuinely rendered material over faked depth

**Polarity:** like
**Facet terms:** `F.3D.rendered-real` ✓ · `F.3D.faked-css` ✗ · `E.DEP.extruded` ✓ · `C.MAT.metallic` ✓ · `E.TEX.brushed-metal` ✓ · `E.TEX.polished` ✓ · `A.FAM.spatial-3d` ✓
**Scope:** brand graphics and hero visuals
**Evidence:** for the Bit. 3D mark Sam asked for a real Blender render (Cycles/OptiX — extruded logo path with a 34° twist, brushed-steel face, polished flutes, studio HDRI, red rim light) **over** the CSS-layer fake 3D that had been offered (2026-10-21)
**Date:** 2026-10-21

**The preference.** When depth or material is the point, render it properly — real geometry,
real light, real surface response. Do not approximate it with stacked layers, gradients or
CSS pseudo-3D.

**Why.** Faked depth reads as faked. The material response — anisotropic sheen on brushed
steel, specular on polished flutes — is the thing being communicated, and it is exactly what
an approximation loses.

**Exceptions.** This is about brand and hero visuals, where the render is an asset. It is not
licence for runtime 3D or live blur in product UI, where `K.BUDGET.effects` governs.

**Related:** PREF-0004 · PREF-0005 · [[bit-design-system]]
