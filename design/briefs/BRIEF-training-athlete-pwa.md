---
type: design-brief
id: BRIEF-training-athlete-pwa
title: "Athlete app, Iranian training platform"
project: health-app
surface: athlete-pwa
status: draft
date: 2026-10-29
dna: "dense · single-accent · strictly-semantic · tabular-numerals · rtl-primary · border-over-shadow · fast-removable-motion · no-photography · offline-honest"
tags: [design/brief]
---

# BRIEF-training-athlete-pwa — athlete app, Iranian training platform

**Project:** health-app (Iran-only training platform) · **Surface:** athlete PWA
**Date:** 2026-10-29 · **Status:** draft — two terms unresolved, see Open questions

The first brief written in this system, and partly a worked example of the format. Source
memos: `D:\Project\software\health-app\docs\01-product-direction.md`,
`02-iran-market-reassessment.md` (operative), `docs\design\00-method.md`.

## DNA

```
dense · single-accent · strictly-semantic · tabular-numerals · rtl-primary ·
border-over-shadow · fast-removable-motion · no-photography · offline-honest
```

Theme polarity is deliberately absent from the string until it is decided.

## Long form

```
surface    K.DEV.handheld · K.TIER.midrange · K.INPUT.touch + one-hand + impaired-grip
           K.ENV.gym · K.ATT.glance (logger: interstitial) · K.NET.throttled/intermittent
           K.NET.censored · K.LOC.rtl-persian · K.DIST.pwa
lineage    A.FAM.brutalist-utility, finished to A.FAM.dark-athletic · A.POS.performance
structure  B.DEN.dense · B.GRID.single-column · B.HIER.enclosure + size
           B.SPACE.tight · B.FLOW.rtl · B.REACH.bottom-primary
colour     C.PAL.single-accent · C.SEM.strict · C.CON.high · C.VIZ.accent-only
type       D.FA.* (all) · D.FACE.neo-grotesque (Latin) · D.FA.iransans-class (Persian)
           D.NUM.tabular · D.HERO.display-numeral · D.SET.compact-ui
surface    E.DEP.border-only or border-plus-shadow · E.STROKE.uniform · E.EDGE.safe-inset
           E.RAD.nested-rule
imagery    F.IMG.data-as-image · F.ILL.silhouette (body/measurement) · F.COST.low
           F.ICON-SYS.single-weight + grid-drawn · F.ICON-RTL.*
motion     G.DUR.fast · G.RED.removable · G.FEED.optimistic + pending · G.GEST.stepper
voice      H.VOCAB.domain-real + glossary-locked · H.NUM.precision-fixed
           H.STATE.* (offline, stale, conflict mandatory) · H.LOC.calendar-jalali
           H.LOC.currency-toman · H.LOC.native-authored
reject     F.IMG.photography · E.DEP.live-blur · C.MAT.gradient-mesh · C.CON.low
           A.FAM.soft-wellness · G.GEST.drag-reorder (as sole path) · C.SEM.loose
```

## Constraints

| Constraint | Consequence for the design |
|---|---|
| No photo or video UGC is permissible in this market | `F.IMG.photography` is out entirely. Bodies and progress are shown as numbers and silhouettes. Every screen must read with zero imagery |
| `K.NET.throttled` · data prices up ~40% · blackout history | A stated KB ceiling per screen. One subset Persian face. No decorative raster, no mesh gradient, no video |
| `K.NET.censored` — foreign CDNs, fonts and APIs unavailable | Fonts self-hosted domestically. No Google Fonts, no third-party icon CDN |
| `K.NET.intermittent` — offline-first | `H.STATE.offline`, `.stale`, `.conflict` and `G.FEED.optimistic`/`.pending` are mandatory components, not polish |
| `K.ENV.gym` + `K.INPUT.impaired-grip` | `C.CON.high` non-negotiable. Targets ≥44pt. No precision drag. Steppers, not sliders, for numeric entry |
| `K.DIST.pwa` — no native APIs, no iOS background work | No GPS tracking, no HealthKit. Sessions are typed in the data model so running can be added behind a native shell later |
| `K.TIER.midrange` | No live blur, no stacked shadows, no runtime 3D |
| Gender-aware discovery, private by default | Profiles unlisted-but-linkable; no public identity surface in the athlete app |

## Archetypes in scope, in priority order

1. `J.CORE.capture` — **the active workout logger**. The product lives here
2. `J.CORE.timer` — set entry and rest timer
3. `J.SYS.offline` / `J.SYS.sync` — offline, stale, conflict
4. `J.DATA.home` — today
5. `J.DATA.trend` — progress and volume
6. `J.CORE.browse` / `J.CORE.detail` — exercise library, no video
7. `J.ON.connect` — trainer connect code
8. `J.ON.intake` — goals and body data
9. `J.DATA.record` — PRs
10. `J.ACC.privacy` — privacy controls
11. `J.SYS.empty` / `J.SYS.error`

Component work starts at the logger's `set-row`, not at a dashboard card.

## Non-negotiables

Every item in `K.A11Y`, verified in both themes. Plus: no data loss on sync conflict, ever —
the competitor's reviews say it loses workout records, and not repeating that visibly is a
product requirement, not a nicety.

## Open questions

| Question | Who decides |
|---|---|
| `C.VAL.dark-first` or `C.VAL.light-first` for this surface | Sam |
| `D.NUM.persian` or `D.NUM.latin` as the interface default | Sam |
| `H.TONE.coaching` or `H.TONE.terse` for athlete-facing copy | Sam, ideally with a Persian-speaking athlete's read |

## How this gets judged

Facet [L](../facets/L-evaluation-rubric.md), with the `reject` line as a hard check and
`L.ROB`, `L.RTL` and `L.COST` weighted heaviest — those are the three this product is most
likely to fail on.

**Related:** DDR-0001 · PREF-0002 · PREF-0007 · PREF-0009 · PREF-0012
