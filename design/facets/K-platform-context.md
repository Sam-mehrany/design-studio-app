# Facet K — Platform & context

*Where, on what, under what conditions, in what locale?* This facet is why most borrowed
design fails. A reference designed for a flagship phone on fast wifi indoors, in English,
with two free hands, is not transferable to a mid-range Android in a gym on a throttled
network in Persian with one hand and chalk on the fingers. Context is a specification.

## K.DEV — Device class

| ID | Term | One line |
|---|---|---|
| `K.DEV.handheld` | Handheld | Phone; the default assumption for consumer products |
| `K.DEV.tablet` | Tablet | Larger canvas, still touch, often landscape |
| `K.DEV.desktop` | Desktop | Pointer, keyboard, multiple windows |
| `K.DEV.large-display` | Large display | Wall or TV; read at distance |
| `K.DEV.wearable` | Wearable | Glance-scale, seconds of attention |
| `K.DEV.print` | Print | Fixed, no states, no interaction |

## K.TIER — Hardware tier

| ID | Term | One line | Note |
|---|---|---|---|
| `K.TIER.flagship` | Flagship | Everything renders; no visual budget pressure | – |
| `K.TIER.midrange` | Mid-range | Blur, heavy shadow and large renders cost frames | – |
| `K.TIER.low` | Low-end | Avoid compositing effects entirely | – |

## K.INPUT — Input modality

| ID | Term | One line |
|---|---|---|
| `K.INPUT.touch` | Touch | ≥44pt targets, no hover, imprecise |
| `K.INPUT.pointer` | Pointer | Hover available, precision assumed |
| `K.INPUT.keyboard` | Keyboard | Full focus order and visible focus ring required |
| `K.INPUT.one-hand` | One-handed | Reach zone binds; see `B.REACH` |
| `K.INPUT.impaired-grip` | Impaired grip | Sweat, gloves, chalk, cold — no precision drag, bigger targets |
| `K.INPUT.voice` | Voice | Hands unavailable |
| `K.INPUT.assistive` | Assistive tech | Screen reader, switch control, magnification |

## K.ENV — Physical environment

| ID | Term | One line |
|---|---|---|
| `K.ENV.indoor-controlled` | Controlled indoor | Stable moderate light; the design-studio default |
| `K.ENV.gym` | Gym | Overhead glare, mirrors, low ambient, device at arm's length |
| `K.ENV.sunlight` | Direct sunlight | Contrast collapses; high contrast mandatory |
| `K.ENV.dark` | Dark | Dark surface mandatory; bright screens hostile |
| `K.ENV.motion` | In motion | Walking, commuting; large targets, forgiving layouts |
| `K.ENV.shared` | Shared / overlooked | Others can see the screen; privacy affects layout |

## K.ATT — Attention budget

| ID | Term | One line |
|---|---|---|
| `K.ATT.glance` | Glance | Under 2 seconds; one value, no reading |
| `K.ATT.interstitial` | Interstitial | 10–30 seconds between other activity |
| `K.ATT.focused` | Focused | Minutes of deliberate attention |
| `K.ATT.extended` | Extended | A working session; fatigue and comfort matter |

## K.NET — Network

| ID | Term | One line |
|---|---|---|
| `K.NET.fast` | Fast and reliable | No budget pressure |
| `K.NET.metered` | Metered | Data costs the user money; weight is a courtesy |
| `K.NET.intermittent` | Intermittent | Offline-first architecture required, not optional |
| `K.NET.throttled` | Throttled / degraded | Assume a fraction of normal throughput |
| `K.NET.censored` | Censored / blocked | Foreign CDNs, fonts and APIs unavailable; host domestically |

`K.NET.intermittent` and worse make `H.STATE.offline`, `H.STATE.stale`,
`H.STATE.conflict` and `G.FEED.optimistic` mandatory rather than nice.

## K.LOC — Locale & direction

| ID | Term | One line |
|---|---|---|
| `K.LOC.ltr-latin` | LTR Latin | The default most references assume |
| `K.LOC.rtl-persian` | RTL Persian | Right-to-left, Jalali dates, toman, Persian or Latin digits |
| `K.LOC.rtl-arabic` | RTL Arabic | Right-to-left, Hijri dates, different numeral conventions |
| `K.LOC.bilingual` | Bilingual | Both directions in one product; mirroring is systematic |

## K.DIST — Distribution

| ID | Term | One line |
|---|---|---|
| `K.DIST.web` | Web | No gatekeeper, instant updates, SEO available |
| `K.DIST.pwa` | PWA | Installable; no native APIs, no iOS background work |
| `K.DIST.app-store` | App store | Review, platform cut, native capability |
| `K.DIST.alt-store` | Alternative store | Regional store; different review and reach |
| `K.DIST.enterprise` | Enterprise / internal | Known device fleet, trained users |

## K.A11Y — Accessibility floor

The floor, not the ambition. Below this a design is incorrect, not merely unambitious.

| ID | Term | One line |
|---|---|---|
| `K.A11Y.contrast` | Contrast | 4.5:1 body, 3:1 large text and UI boundaries, both themes |
| `K.A11Y.target-size` | Target size | ≥44pt touch targets with adequate spacing |
| `K.A11Y.focus-visible` | Visible focus | Every interactive element keyboard-reachable and visibly focused |
| `K.A11Y.not-colour-alone` | Not colour alone | Status carried by icon and word as well as hue |
| `K.A11Y.reduced-motion` | Reduced motion | A full no-motion path |
| `K.A11Y.text-scaling` | Text scaling | Layout survives 200% text without clipping |
| `K.A11Y.labels` | Accessible names | Every control and icon-only button named |

## K.BUDGET — Performance budget

Written as numbers per surface, before design, not measured after.

| ID | Term | One line |
|---|---|---|
| `K.BUDGET.weight` | Weight ceiling | A stated KB cap per screen, fonts included |
| `K.BUDGET.fonts` | Font budget | How many faces, weights and subsets are affordable |
| `K.BUDGET.images` | Image budget | Whether raster imagery is affordable at all |
| `K.BUDGET.effects` | Effect budget | Whether blur, shadow stacking and mesh gradients are affordable |
