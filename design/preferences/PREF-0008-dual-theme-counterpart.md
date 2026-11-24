---
type: design-pref
id: PREF-0008
title: "A light counterpart gets made, not derived"
polarity: conditional
scope: "brand graphics so far; product UI untested"
evidence_date: 2026-10-20
facets: [C.VAL.true-dual]
tags: [design/pref]
---

# PREF-0008 — A light counterpart gets made, not derived

**Polarity:** conditional
**Facet terms:** `C.VAL.true-dual` ~
**Scope:** brand graphics so far; product UI untested
**Evidence:** the Bit. promo graphics exist as a dark set (`graphics.html`) **and** a separate light-mode copy (`graphics-light.html`) rather than only the dark one (2026-10-20)
**Date:** 2026-10-20

**The preference.** When a surface has two themes, the second one is authored, not
mechanically inverted. Weak evidence so far — one instance, on brand graphics.

**Why.** Inverted values do not survive: shadow stops reading on dark, tonal depth stops
reading on light, and accent contrast shifts. Each theme needs its own values bound to the
same semantic tokens.

**Exceptions.** Unknown. This is a `~`, not a `✓` — it has not been stated as a rule and
may just reflect one deliverable's requirements. Ask before treating dual themes as a
default obligation on a product.

**Related:** PREF-0004 · [[bit-design-system]]
