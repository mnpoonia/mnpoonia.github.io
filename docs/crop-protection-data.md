# Crop Protection Data Guide

This directory is the source of truth for reusable crop-protection records. Add source-backed data first; pages and tools consume it automatically.

## Add A Crop And Its Pests

1. Add the crop once in `src/data/crop-protection/crops.json`.
2. Add a reusable organism once in `src/data/crop-protection/organisms.json`; use a stable lowercase ID such as `brown-planthopper`, not a display name.
3. Create `src/data/crop-protection/occurrences/<crop-id>.json` to link the crop and organism, adding the crop-specific inspection note.
4. A crop can link to an organism even when no pesticide data exists. This lets a farmer select it without implying a pesticide recommendation.
5. Add crop-specific reference-use records separately.

## Add A Dose Or Recommendation

1. Create or update `src/data/crop-protection/uses/<crop-id>.json` using `docs/templates/reference-uses.json`.
2. Reference the stable `cropId` and `organismId`.
3. Tie each record to one active ingredient, exact formulation, crop, target, dose, water volume, source, and evidence status.
4. Add acre equivalents only when calculated from a documented hectare rate. Mark them as approximate.
5. Put stage, timing, interval, flowering, water-stress, or other restrictions in `timing` and `conditions` only when a source supports them.
6. Do not create a dose by copying a rate from another formulation, brand, crop, or target.

## Add Lifecycle, Symptoms, And Images

1. Create `src/data/crop-protection/stages/<organism-id>.json`.
2. Create one record per egg, immature, adult, damage, symptom, or weed-growth stage that needs its own identification guidance.
3. State where to look, naked-eye or magnification guidance, seasonality scope, immediate action, and stage-linked management evidence.
4. Keep `imageStatus` as `needed` until an image record with license and attribution is available. Do not copy images merely because they appear on a web page.
5. Do not place a stage-specific pesticide claim in a record unless its source actually supports the stage or a defensible equivalent. Otherwise state that the evidence is unknown.

## Full Skeleton Collections

The repository now has fixture-ready schemas and collections for geographies, seasonality, scouting protocols, thresholds, label uses, product compatibility, and recommendation rules. These records are intentionally allowed to be `unverified` or `conditional` while data is being collected. A fixture must never be promoted to an application recommendation until label and evidence status are updated.

The generated pages are available for every record at:

```text
/crop-protection/crops/<crop-id>/
/crop-protection/organisms/<organism-id>/
```

## PPQS Major-Use Import Rule

The PPQS major-use table is formulation-level evidence. Record it in `uses/` with its PDF page and published table details, but do not use it as proof that a specific commercial brand has the same current statutory leaflet. Brand-level label records in `label-uses.json` must remain `unverified` until the exact product label, version, and directions have been checked.

## Add A Product Or Ingredient

Product and ingredient records still live in `src/data/crop-protection.ts` during this transition. Add them with stable IDs, source references, exact composition, and formulation. A later migration will split these into JSON collections using the same pattern.

## Evidence Status

- `verified`: identity or fact directly checked against a primary or authoritative source.
- `conditional`: useful official guidance that still needs label, crop-stage, or other scenario checks.
- `unverified`: visible reference information not eligible for a recommendation.
- `research-only`: study evidence that does not establish current registered use.

## Required Checks

Run these before submitting data:

```bash
npm run validate
npm test
npm run build
```

Validation rejects duplicate IDs, unknown crops, unknown organisms, unknown ingredients, and unknown sources. It is intentional that a crop can contain an organism without any pesticide-use record: that produces an evidence gap rather than an invented recommendation.
