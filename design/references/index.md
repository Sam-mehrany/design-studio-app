# References — index

Analysed artefacts, one record each, scored on the facets. Template: [`_template.md`](_template.md).

The table below is **generated** from the records by `tools/index-refs.js` — editing it by
hand will be overwritten. Run that after an ingest. It sat empty through the first three
ingests because nothing kept it in step, which is why it is no longer hand-maintained.

<!-- refs:start -->

| ID | What | Kind | Archetype | Imagery dep. | RTL | Cost | Verdict | Review |
|---|---|---|---|---|---|---|---|---|
| [REF-0001](REF-0001-margin-overview-dashboard.md) | Margin — Overview dashboard for a trades business | concept | J.DATA.home, J.DATA.trend | none | risky | low | adapt | reviewed like |
| [REF-0002](REF-0002-lunor-contracts-dashboard.md) | Lunor — dark contract-management dashboard | concept | J.DATA.home | soft | risky | low | adapt | reviewed like |
| [REF-0003](REF-0003-taskello-folder-card.md) | Taskello — dark folder-tab collection card | concept | J.CORE.browse | soft | risky | med | adapt | reviewed like |

<!-- refs:end -->

## How references become patterns

A single reference is an anecdote. The gate in [00-model](../00-model.md) §3 is what turns a
set of them into evidence: a pattern is admitted when it appears in **three or more shipped**
products, or when it answers a named constraint, or as a written differentiation call. So the
useful questions of this table are frequency questions —

- which treatment appears in every shipped logger, and which only in concept shots?
- which archetypes have no records at all? (that is the real output — see facet J)
- where do the `adopt` verdicts cluster, and does that cluster match the DNA of the brief?

## Two project-local reference sets

Project intake tables can live with the project when they are specific to it — the health
app's is `docs\design\references\REFERENCE-LOG.md`, scored on the same fields. A reference
that turns out to matter **across** projects gets promoted to a REF record here, so the
cross-project evidence base accumulates in one place instead of being scattered through
project folders.
