# Crop Reference Data Guide

This directory is the source of truth for reusable crop and crop-protection records. The canonical farmer journey is crop → problem → inspection → management → exact-label check. Add source-backed data first; pages and tools consume it automatically.

## What The Template Supports

The generic crop page renders these sections when records exist:

- Crop context: climate, soil and drainage, varieties, planting, training and pruning, nutrition, irrigation, weed management, harvest, and post-harvest.
- Seasonal tasks.
- Plant protection grouped into insect pests, mites, diseases, nutrient disorders, physiological disorders, abiotic injury, and weeds.
- Recognition, look-alikes, scouting, thresholds, nonchemical actions, formulation references, exact-label records, and source gaps.

Kinnow contains a deliberately small vertical slice: citrus psyllid, a Phytophthora disease-complex guide, a nutrient-disorder guide, and an orchard-weed gap. This proves the structure; disease population and review remain a separate phase.

`demonstration` records exist only to exercise the structure. They are not operational advice and must never be promoted to a pesticide or nutrient instruction without source review.

## Add Crop Context Or Calendar Data

1. Add crop context records in `guidance/<crop-id>.json`.
2. Use one of the supported sections from `cropGuidanceSchema`.
3. Give each consequential value a source, geography when relevant, evidence status, and qualifiers.
4. Add calendar records in `calendar/<crop-id>.json`; a calendar identifies what to inspect or do, never proves a pest is present.
5. Use explicit evidence-gap or `demonstration` records while a section is being built. Do not invent operational values.

## Add A Crop And Its Pests

1. Add the crop once in `src/data/crop-protection/crops.json`.
2. Add a reusable organism once in `src/data/crop-protection/organisms.json`; use a stable lowercase ID such as `brown-planthopper`, not a display name.
3. Create `src/data/crop-protection/occurrences/<crop-id>.json` to link the crop and organism/problem, adding the crop-specific inspection note.
4. A crop can link to an organism even when no pesticide data exists. This lets a farmer select it without implying a pesticide recommendation.
5. Add crop-specific reference-use records separately.

## Add A Dose Or Recommendation

1. Create or update `src/data/crop-protection/uses/<crop-id>.json` using `docs/templates/reference-uses.json`.
2. Reference the stable `cropId` and `organismId`.
3. Tie each record to one active ingredient, exact formulation, crop, target, dose, water volume, source, and evidence status.
4. Add acre equivalents only when calculated from a documented hectare rate. Mark them as approximate.
5. Put stage, timing, interval, flowering, water-stress, or other restrictions in `timing` and `conditions` only when a source supports them.
6. Do not create a dose by copying a rate from another formulation, brand, crop, or target.

## Add Recognition, Look-Alikes, And Actions

1. Create `src/data/crop-protection/stages/<organism-id>.json`.
2. Create one record per egg, immature, adult, damage, symptom, or weed-growth stage that needs its own identification guidance.
3. State where to look, naked-eye or magnification guidance, seasonality scope, immediate action, and stage-linked management evidence.
4. Keep `imageStatus` as `needed` until an image record with license and attribution is available. Do not copy images merely because they appear on a web page.
5. Do not place a stage-specific pesticide claim in a record unless its source actually supports the stage or a defensible equivalent. Otherwise state that the evidence is unknown.
6. Add crop-problem look-alikes in `look-alikes/<crop-id>.json`. State how to distinguish the condition and what to do when uncertainty remains.
7. Add nonchemical management records in `actions/<crop-id>.json`. Use `monitor`, `cultural`, `mechanical`, `sanitation`, `biological`, or `expert-confirmation`; chemical evidence belongs in use records.

## Full Skeleton Collections

The repository now has fixture-ready schemas and collections for geographies, seasonality, scouting protocols, thresholds, label uses, product compatibility, and recommendation rules. These records are intentionally allowed to be `unverified` or `conditional` while data is being collected. A fixture must never be promoted to an application recommendation until label and evidence status are updated.

The generated pages are available for every crop-problem occurrence at:

```text
/crop-protection/crops/<crop-id>/
/crop-protection/crops/<crop-id>/targets/<organism-id>/
/crop-protection/organisms/<organism-id>/
```

## Farmer-Selected Disease Or Pest

Recommendation requests store a farmer-selected crop, organism, optional stage, severity, observation date, and prior applications. The selected diagnosis is the working scenario. Record whether it was `user-selected`, chosen through the `image-guide`, or `expert-confirmed`, but do not require an image or laboratory confirmation before showing relevant formulation records.

## PPQS Major-Use Import Rule

The PPQS major-use table is formulation-level evidence. Record it in `uses/` with its PDF page and published table details, but do not use it as proof that a specific commercial brand has the same current statutory leaflet. Brand-level label records in `label-uses.json` must remain `unverified` until the exact product label, version, and directions have been checked.

The raw PPQS import lives at `data/source/ppqs/2026-03-31-insecticides/records.ndjson` and is viewable at `/crop-protection/imports/ppqs-2026/`. Do not edit it manually. Re-run `npm run import:ppqs-insecticides`, review the cited page, then promote a row into a normalized `uses/` record.

## Add A Product Or Ingredient

Products, ingredients, formulations, and sources live in their own JSON collections. Add them with stable IDs, source references, and exact composition. Reference uses should include `formulationId` and remain crop-target-formulation scoped. Exact product-label records must include version, URL, and verification status.

## Evidence Status

- `verified`: identity or fact directly checked against a primary or authoritative source.
- `conditional`: useful official guidance that still needs label, crop-stage, or other scenario checks.
- `unverified`: visible reference information not eligible for a recommendation.
- `research-only`: study evidence that does not establish current registered use.
- `demonstration`: non-operational structure record used while authoring a new section.
- `historical-do-not-use`: retained for audit context but never shown as an application instruction.

## Required Checks

Run these before submitting data:

```bash
npm run validate
npm test
npx astro check
npm run build
```

Validation rejects duplicate IDs, unknown crops, unknown organisms, unknown ingredients, and unknown sources. It is intentional that a crop can contain an organism without any pesticide-use record: that produces an evidence gap rather than an invented recommendation.
