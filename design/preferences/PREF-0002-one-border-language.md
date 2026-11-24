---
type: design-pref
id: PREF-0002
title: "One border language; status never a side stripe"
polarity: reject
scope: "all product UI"
evidence_date: 2026-10-07
facets: [E.ACC.side-stripe, E.ACC.badge, E.ACC.tinted-note, E.ACC.icon-plus-word, E.STROKE.uniform, E.DEP.border-plus-shadow, C.SEM.strict, I.DISC.pattern-exists-first]
tags: [design/pref]
---

# PREF-0002 — One border language; status never a side stripe

**Polarity:** reject
**Facet terms:** `E.ACC.side-stripe` ✗ · `E.ACC.badge` ✓ · `E.ACC.tinted-note` ✓ · `E.ACC.icon-plus-word` ✓ · `E.STROKE.uniform` ✓ · `E.DEP.border-plus-shadow` ✓ · `C.SEM.strict` ✓ · `I.DISC.pattern-exists-first` ✓
**Scope:** all product UI
**Evidence:** Sam rejected a 4px amber border on the inline-start edge of the active-plan card on the Markito packages page — "there is no where in the design language we use a border like this" (2026-10-07)
**Date:** 2026-10-07

**The preference.** Every card uses the same 1px neutral border, the same radius and the
same shadow. Status is carried by a badge, a tinted note, or an icon *with* a word — never
by a coloured stripe on one edge, and never by a treatment that exists nowhere else.

**Why.** A one-off treatment reads as a different design system. Consistency with the token
set is what makes a set of screens look like one product; a local solution to a local
problem costs that, and the saving is never worth it.

**Exceptions.** None observed. If a side stripe is ever genuinely needed, it has to enter the
system as a documented pattern first, used in more than one place.

**Related:** PREF-0013 · [[feedback-no-side-accent-borders]] · [[markito-redesign-task]]
