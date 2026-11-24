# Decisions — index

Design decision records: what was fixed, what else was considered, and what it cost.
Template: [`_template.md`](_template.md). Superseded, never edited away.

| ID | Decision | Status | Scope |
|---|---|---|---|
| [DDR-0001](DDR-0001-effects-budget.md) | No live blur, mesh gradients or decorative raster in the Iranian products | accepted | health-app, all surfaces |

## When something is a DDR rather than a PREF

A **PREF** records a taste: what is liked or rejected, and why. It is evidence about Sam.

A **DDR** records a constraint-driven commitment: what is now fixed for a product, what it
gives up, and where it binds. It is evidence about a project.

The two can conflict, and when they do the DDR says so explicitly — DDR-0001 is the worked
example: it bars runtime effects that PREF-0004 and PREF-0006 record a liking for, and states
that the scopes differ rather than pretending there is no tension. A decision that silently
overrides a stated preference is how confidence in this database would be lost.
