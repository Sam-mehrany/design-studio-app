---
type: design-pref
id: PREF-0007
title: "RTL is a first-class edition, not a mirror"
polarity: like
scope: "all work with a Persian audience"
evidence_date: 2026-10-29
facets: [B.FLOW.rtl, B.FLOW.bidi, F.ICON-RTL.flip-directional, F.ICON-RTL.keep-metaphor, K.LOC.rtl-persian]
tags: [design/pref]
---

# PREF-0007 — RTL is a first-class edition, not a mirror

**Polarity:** like
**Facet terms:** `B.FLOW.rtl` ✓ · `B.FLOW.bidi` ✓ · all of `D.FA` · `F.ICON-RTL.flip-directional` ✓ · `F.ICON-RTL.keep-metaphor` ✓ · `K.LOC.rtl-persian`
**Scope:** all work with a Persian audience
**Evidence:** the Bit. design system ships a separate Farsi edition set in IRANSans (`BIT Design System - Farsi.fig`) alongside the international one, rather than relying on a mirrored LTR file; the current training product is specified Persian/RTL from the start
**Date:** 2026-10-29

**The preference.** Persian layouts are designed as Persian, with their own type decisions,
line heights and numeral policy. Directional icons flip; metaphors (clock, search, media
transport) do not. The LTR version is the derivative, not the source.

**Why.** A mirrored LTR layout is detectable — spacing tuned for Latin, a type scale that
ignores Persian's need for more leading, and numerals that fight the direction of the line.
Designing RTL first produces a product that reads as native rather than localised.

**Exceptions.** International-audience work (the Bit. international edition, portfolio in
English) is LTR-primary by the same logic reversed.

**Related:** PREF-0009 · [[bit-design-system]] · [[health-app-trainer-first-direction]]
