# Facet J — Screen archetypes

*What job is this screen doing?* The archetype determines what a good answer even looks
like: density, hierarchy and motion are all downstream of the job. Categorising references
by archetype rather than by appearance is what exposes **coverage gaps** — the archetype
with no references is the screen about to be designed blind.

Each archetype carries its **central tension**: the thing that makes it hard, and the thing
a reference should be judged on.

## J.ACQ — Acquisition & marketing

| ID | Archetype | Central tension |
|---|---|---|
| `J.ACQ.landing` | Landing page | One claim versus every claim |
| `J.ACQ.pricing` | Pricing | Comparability versus steering |
| `J.ACQ.feature` | Feature page | Explaining mechanism without a manual |
| `J.ACQ.profile-public` | Public profile | Credibility without social proof you do not have |
| `J.ACQ.case-study` | Case study | Narrative versus evidence |
| `J.ACQ.docs` | Documentation | Findability versus completeness |

## J.ON — Onboarding & intake

| ID | Archetype | Central tension |
|---|---|---|
| `J.ON.signup` | Sign-up | Fewest fields versus the data the product needs |
| `J.ON.intake` | Intake / profiling | Depth of questioning versus abandonment |
| `J.ON.empty-first-run` | First run | Showing value before any data exists |
| `J.ON.permissions` | Permission request | Asking at the moment of need, not on launch |
| `J.ON.connect` | Connect / pairing | Making an invisible link feel confirmed |

## J.CORE — The core loop

The screen the product lives on. Usually the least photogenic and the most important.

| ID | Archetype | Central tension |
|---|---|---|
| `J.CORE.capture` | Capture / logging | Speed under hostile conditions versus completeness |
| `J.CORE.timer` | Timer / in-progress | Glanceability with the device at arm's length |
| `J.CORE.editor` | Editor / builder | Power versus discoverability |
| `J.CORE.browse` | Browse / library | Finding a known item versus discovering an unknown one |
| `J.CORE.detail` | Item detail | Depth versus the one action the user came for |
| `J.CORE.search` | Search & filter | Query power versus a single field |
| `J.CORE.queue` | Queue / inbox | Triage speed versus context per item |

## J.DATA — Data & insight

| ID | Archetype | Central tension |
|---|---|---|
| `J.DATA.home` | Today / home dashboard | Glanceability versus the urge to show everything |
| `J.DATA.trend` | Trend & history | Honest axes versus a flattering curve |
| `J.DATA.compare` | Comparison | Like-for-like versus cherry-picked windows |
| `J.DATA.report` | Report / export | Screen reading versus print and share |
| `J.DATA.record` | Records / milestones | Celebrating without inflating |

## J.OPS — Management & operator

| ID | Archetype | Central tension |
|---|---|---|
| `J.OPS.roster` | Roster / list of people | Scanning thirty rows for the one that needs attention |
| `J.OPS.assign` | Assignment | Bulk efficiency versus per-case care |
| `J.OPS.builder` | Program / content builder | The hardest screen in most products; structure versus freedom |
| `J.OPS.review` | Review / approval | Enough context to decide, no more |
| `J.OPS.messaging` | Messaging & check-ins | Structure versus conversation |
| `J.OPS.admin` | Admin & configuration | Exposing power without inviting damage |

## J.COM — Commerce

| ID | Archetype | Central tension |
|---|---|---|
| `J.COM.catalogue` | Catalogue | Comparison versus choice paralysis |
| `J.COM.cart` | Cart / summary | Total honesty versus abandonment |
| `J.COM.checkout` | Checkout | Trust under the local payment rails available |
| `J.COM.receipt` | Receipt / confirmation | Reassurance and what happens next |
| `J.COM.packs` | Prepaid packs | Making one-time purchases feel like continuity |

## J.SYS — System states

Never in a reference board. Always in a shipped product.

| ID | Archetype | Central tension |
|---|---|---|
| `J.SYS.empty` | Empty states | Instructive without lecturing |
| `J.SYS.offline` | Offline & degraded | Honest about what works, calm about what does not |
| `J.SYS.sync` | Sync & conflict | Never losing data silently |
| `J.SYS.error` | Errors | Recovery path over diagnosis |
| `J.SYS.permission-denied` | Access denied | Why, and what to do, without leaking |
| `J.SYS.maintenance` | Maintenance / outage | Certainty about when, not an apology |

## J.ACC — Account & settings

| ID | Archetype | Central tension |
|---|---|---|
| `J.ACC.settings` | Settings | Findability across a long tail |
| `J.ACC.profile` | Own profile | Identity versus privacy defaults |
| `J.ACC.privacy` | Privacy controls | Comprehensible consequence per switch |
| `J.ACC.notifications` | Notification preferences | Granularity versus a usable list |

## How to use this facet

1. **Tag every reference** with its archetype on intake.
2. **Count.** A board that is 70% `J.DATA.home` and 0% `J.CORE.capture` is telling you what
   it was collected from, not what the product needs.
3. **Fill gaps from benchmarks, not from Pinterest** — `J.CORE`, `J.OPS.builder`, `J.COM`
   and all of `J.SYS` have to be sourced from shipped products, because nobody posts them.
4. **Order component work by archetype priority**, not by what is easy to draw.

Project-specific archetype maps (which of these a given product actually has, in priority
order) live with that project, not here.
