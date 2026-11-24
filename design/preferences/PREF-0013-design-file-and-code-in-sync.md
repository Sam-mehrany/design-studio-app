---
type: design-pref
id: PREF-0013
title: "The design file and the build change together"
polarity: like
scope: "any project with both a design file and an implementation"
evidence_date: 2026-10-07
facets: [I.DISC.sync-both-sides]
tags: [design/pref]
---

# PREF-0013 — The design file and the build change together

**Polarity:** like
**Facet terms:** `I.DISC.sync-both-sides` ✓
**Scope:** any project with both a design file and an implementation
**Evidence:** "any changes should be applied in both side figma and the project" — Sam on the Markito redesign (2026-10-07)
**Date:** 2026-10-07

**The preference.** Any UI, naming, component or copy change lands in the implementation
**and** in the design file in the same pass, with a statement of what changed in each. If one
side cannot be done — a connector failure, a missing file — say so explicitly rather than
skipping it quietly.

**Why.** The deliverable is usually both, plus a case study describing them. The moment they
drift, every later decision is made against a stale reference and the drift compounds.

**Exceptions.** None. A genuine blocker is reported, not absorbed.

**Related:** PREF-0002 · [[feedback-figma-and-project-in-sync]]
