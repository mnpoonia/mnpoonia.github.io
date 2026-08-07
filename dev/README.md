# Development Workspace

`dev/` is the working area for future-facing product and engineering design. It keeps active plans separate from the durable documentation in `docs/`.

## Folder Rules

```text
dev/
  roadmap.md                 Prioritized product and engineering phases
  contribution-intake.md     Submission, review, and publication design
  decisions/                 Short architecture decision records
  research/                  Source evaluations and discovery notes
```

Use this folder for:

- A planned feature that is not implemented yet.
- A tradeoff that needs a written decision.
- A research note or source evaluation.
- A scoped implementation plan that later becomes an issue or pull request.

Do not use this folder as a second source of truth for current data schemas or contributor instructions. Once a plan is implemented, update `docs/` and code comments where appropriate.

## Current Priorities

Read [`roadmap.md`](roadmap.md) for the next phases and [`contribution-intake.md`](contribution-intake.md) for the proposed Supabase-backed review workflow.
