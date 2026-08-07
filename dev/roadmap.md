# Crop Reference Roadmap

## Product Principle

The public reference remains crop-first and safety-bound:

```text
Crop -> problem -> inspection -> nonchemical action -> formulation evidence -> exact product-label check
```

Published crop and protection guidance remains static, reviewed, and traceable. A missing record is shown as a gap, never replaced by an inferred dose or label claim.

## Completed Foundation

- Generic crop and crop-target routes.
- Crop-context, seasonal-task, problem, look-alike, scouting, threshold, and nonchemical-action structures.
- Product, formulation, ingredient, use, exact-label, and source separation.
- Visible evidence statuses, restrictions, and source conflicts.
- Contributor workflow for farmers, retailers, manufacturers, and experts.
- Mobile-oriented controlled selectors and copy/email handoff.

## Next Phase: Contribution Review System

Build persistent contribution intake before scaling public data.

1. Add authenticated submissions and private attachments.
2. Store role, scope, evidence, and reviewer history.
3. Add a reviewer queue with statuses: draft, submitted, needs-information, under-review, accepted-for-publication, rejected, published, superseded.
4. Keep promotion to repository JSON and static publication manual at first.
5. Add formal expert field-guidance records and attribution.

See [`contribution-intake.md`](contribution-intake.md).

## Separate Disease Population Phase

Complete Kinnow diseases through reviewed data rather than custom page work:

1. Phytophthora disease complex.
2. Citrus scab.
3. Citrus canker.
4. Other precisely identified diseases only after crop-specific occurrence evidence is reviewed.

Each farmer-ready disease guide needs recognition features, look-alikes, scouting, action threshold or explicit threshold gap, nonchemical actions, source-backed treatment evidence, exact-label boundaries, image status, and review date.

## Later Platform Work

- Generalize the Kinnow psylla assessment into a crop-target follow-up tool.
- Add attachment review and image-license metadata.
- Replace native product/formulation selectors with accessible search once the catalog grows.
- Add browser tests for mobile contribution paths and safety rendering.
- Add automatic discovery of per-crop JSON files so new data files do not need a manual `records.ts` import.
- Expand crop coverage through complete vertical slices, not shallow directories.
