# Facet G — Motion & interaction

*How does it move, respond and feel under the hand?* Motion is the facet most often
specified as an adjective ("smooth", "snappy") and least often as a number. This facet
exists to force numbers: a band, a curve, a choreography and a removal path.

## G.DUR — Duration band

| ID | Term | One line | Stance |
|---|---|---|---|
| `G.DUR.instant` | Instant (0–80ms) | State change with no perceived travel | – |
| `G.DUR.fast` | Fast (100–200ms) | Interface response; the default for UI feedback | – |
| `G.DUR.moderate` | Moderate (250–400ms) | Transitions between contexts | – |
| `G.DUR.slow` | Slow (500ms+) | Narrative, onboarding, brand moments | – |
| `G.DUR.unbounded` | Unbounded | Ambient loops, idle animation | – |

A duration that is pleasant once is intolerable on the fortieth repetition. Anything on a
path the user takes many times per session belongs in `instant` or `fast`.

## G.EASE — Easing character

| ID | Term | One line | Stance |
|---|---|---|---|
| `G.EASE.linear` | Linear | Mechanical; correct for progress and timers | – |
| `G.EASE.ease-out` | Ease-out | Fast start, soft landing; the default for entrances | – |
| `G.EASE.ease-in-out` | Ease-in-out | Symmetric; context transitions | – |
| `G.EASE.spring` | Spring | Physical, mass and tension; overshoot | – |
| `G.EASE.overshoot` | Overshoot | Deliberate past-the-target bounce | – |
| `G.EASE.anticipate` | Anticipate | Pulls back before moving | – |

## G.CHOR — Choreography

| ID | Term | One line | Stance |
|---|---|---|---|
| `G.CHOR.simultaneous` | Simultaneous | Everything moves together | – |
| `G.CHOR.staggered` | Staggered | Sequential delay across a list | – |
| `G.CHOR.led` | Led | One element moves, the rest follow its logic | – |
| `G.CHOR.none` | None | Appearance without transition | – |

## G.TRANS — Transition model

| ID | Term | One line | Stance |
|---|---|---|---|
| `G.TRANS.shared-element` | Shared element | A persistent object carries between views | – |
| `G.TRANS.cross-fade` | Cross-fade | Opacity only | – |
| `G.TRANS.push` | Push / slide | Directional; must respect RTL | – |
| `G.TRANS.modal-rise` | Modal rise | Sheet or dialog from an edge | – |
| `G.TRANS.cut` | Cut | No transition; instant replacement | – |

## G.MICRO — Micro-interaction density

| ID | Term | One line | Stance |
|---|---|---|---|
| `G.MICRO.none` | None | State changes only | – |
| `G.MICRO.restrained` | Restrained | Feedback on consequential actions only | – |
| `G.MICRO.rich` | Rich | Most interactions acknowledged | – |
| `G.MICRO.celebratory` | Celebratory | Achievement moments get a performance | – |

## G.FEED — Feedback model

| ID | Term | One line | Stance |
|---|---|---|---|
| `G.FEED.visual` | Visual only | Colour, movement, state | – |
| `G.FEED.haptic` | Haptic | Vibration on confirm; valuable when eyes are elsewhere | – |
| `G.FEED.audio` | Audio | Sound on events; needs a silent path | – |
| `G.FEED.optimistic` | Optimistic | Commits in the UI before the server confirms | – |
| `G.FEED.pending` | Explicit pending | Shows unsynced or in-flight state honestly | – |

## G.GEST — Gesture vocabulary

| ID | Term | One line | Stance |
|---|---|---|---|
| `G.GEST.tap-only` | Tap only | No gesture knowledge required | – |
| `G.GEST.swipe-row` | Swipe row | Row actions behind a swipe; direction mirrors in RTL | – |
| `G.GEST.long-press` | Long press | Secondary actions; undiscoverable alone | – |
| `G.GEST.drag-reorder` | Drag to reorder | Precision drag; poor with wet or gloved hands | – |
| `G.GEST.pull-refresh` | Pull to refresh | Conventional, safe | – |
| `G.GEST.stepper` | Stepper buttons | Increment and decrement by tap; no precision needed | – |

## G.RED — Removability

| ID | Term | One line | Stance |
|---|---|---|---|
| `G.RED.removable` | Removable | Every animation has a reduced-motion and low-power path | – |
| `G.RED.decorative-only` | Decorative-only | Motion carries no information, so removal costs nothing | – |
| `G.RED.load-bearing` | Load-bearing | Motion carries meaning; removal needs a static equivalent | – |

## Open questions

- Spring versus ease-out as the house character — unobserved.
- Appetite for celebratory moments (PR hit, streak) versus staying sober throughout?
