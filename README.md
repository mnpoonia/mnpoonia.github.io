# Aman Poonia Site And Crop Reference

This repository contains the personal site and a static Astro crop-reference prototype. The crop reference is designed around a crop-first farmer journey:

```text
Crop -> problem -> inspection -> nonchemical action -> formulation evidence -> exact product-label check
```

Plant Protection is the deepest section. Crop guidance is deliberately source-bound: a missing record is shown as a gap rather than replaced with an inferred value or rate.

## Who This Is For

The site serves three groups with different needs. The public pages should keep these roles visible rather than treating every visitor as a pesticide decision-maker.

| Role | Primary journey | What they can contribute |
| --- | --- | --- |
| Farmer | Choose crop → identify/inspect a problem → record observations → review safe next steps | Field observations, photos with location/date, local names, crop stage, and follow-up results. Farmers should not need to understand the data model to contribute. |
| Retailer | Search the exact product in hand → confirm manufacturer and formulation → see label status, supported crop-target evidence, restrictions, and source links | Package-front/back photos, current label or leaflet versions, manufacturer corrections, product availability notes, and missing catalog entries. A retailer must not use ingredient similarity to infer a crop use. |
| Manufacturer / product company | Submit a new product or crop-disease claim → attach the current approved label/leaflet → await editorial review | Exact brand, manufacturer, full formulation, label version/date, crop, disease, dose, water volume, PHI, restrictions, and a stable official label URL or file reference. |
| Scientist or extension expert | Review crop-problem evidence → add diagnosis/scouting/management records → review conflicts and gaps → submit a recommendation for editorial review | Source-backed claims, field protocols, diagnostic distinctions, nonchemical management, label evidence, conflict reviews, and attributable expert field recommendations. |

## Expert-Originated Recommendations

A scientist may have valid local, field, or extension knowledge that is not yet published in a journal or public package of practices. The system should accept that contribution, but it must be distinguished from a cited, label-authorized instruction.

Use this publication model:

1. Submit the recommendation as an **attributable expert field recommendation**, with expert name/role, organization, geography, crop and production scope, date, rationale, field observations or trial context, and known limitations.
2. Mark it **review pending** until an editorial reviewer confirms the record is correctly scoped and safely phrased.
3. Publish it, if appropriate, as local expert guidance or a nonchemical/scouting recommendation, with the contributor and review date visible.
4. Do **not** publish a pesticide dose, tank mix, PHI, REI, repeat interval, or product authorization as expert opinion alone. Those require the current exact product label and applicable regulatory scope.
5. When later evidence or a formal source becomes available, link it to the original expert record; retain the original contribution and review history rather than silently replacing it.

This expert-contribution state is not implemented as a normalized schema yet. Until it is, collect these records through the contributor workflow and keep them out of actionable treatment cards.

## Prerequisites

- Node.js 22 or later
- npm
- Git

## Clone And Run Locally

```bash
git clone https://github.com/mnpoonia/mnpoonia.github.io.git
cd mnpoonia.github.io
npm install
npm run dev
```

Astro prints the local address, normally `http://localhost:4321`. Open it in a browser and use the crop reference at `/crop-protection/`.

## Common Commands

```bash
# Start the local development server.
npm run dev

# Validate normalized crop-reference records and relationships.
npm run validate

# Run unit and PPQS-import tests.
npm test

# Type-check Astro and TypeScript files.
npx astro check

# Validate, type-check, and generate the static site in dist/.
npm run build

# Preview the generated static site.
npm run preview
```

Run the following before opening a pull request or committing a substantial data change:

```bash
npm run validate
npm test
npx astro check
npm run build
```

## Project Layout

```text
src/pages/                         Astro routes
src/components/                    Reusable page components
src/styles/global.css              Site and crop-reference styles
src/data/crop-protection/          Normalized crop-reference data
src/data/crop-protection.ts        Data facade and joining helpers
scripts/validate-data.ts           Referential and safety-oriented validation
scripts/import-ppqs-insecticides.mjs
                                    PPQS candidate extraction
docs/crop-protection-data.md       Detailed data authoring rules
```

## Source Code Guide

Use this map to find the right place for a change. Prefer extending normalized data before adding crop-specific UI logic.

| If you need to change... | Start here | Related files |
| --- | --- | --- |
| Site shell, global header, footer, or metadata | `src/layouts/BaseLayout.astro` | `src/styles/global.css` |
| Blog home or post rendering | `src/pages/index.astro` | `src/pages/posts/[...slug].astro` |
| Crop-reference landing page | `src/pages/crop-protection/index.astro` | `src/components/CropProtectionNav.astro` |
| Crop directory | `src/pages/crop-protection/crops/index.astro` | `src/data/crop-protection/crops.json` |
| Whole-crop page layout | `src/pages/crop-protection/crops/[id].astro` | `src/data/crop-protection/guidance/`, `calendar/`, `occurrences/` |
| Crop-specific pest, disease, weed, or disorder guide | `src/pages/crop-protection/crops/[cropId]/targets/[organismId].astro` | `stages/`, `look-alikes/`, `actions/`, `scouting.json`, `thresholds.json`, `uses/` |
| Cross-crop biological reference | `src/pages/crop-protection/organisms/[id].astro` | `src/data/crop-protection/organisms.json` |
| Product catalog or product page | `src/pages/crop-protection/products/` | `src/components/ProductLookup.astro`, `ProductDoseLookup.astro` |
| Ingredient reference | `src/pages/crop-protection/ingredients/[id].astro` | `src/data/crop-protection/ingredients.json` |
| Shared treatment display | `src/components/UseCard.astro` | `EvidenceStatus.astro`, `SourceLinks.astro` |
| Identification image behavior | `src/components/ImageGallery.astro` | `src/data/crop-protection/images.json` |
| Field-observation prompt | `src/components/ObservationGuide.astro` | `src/lib/recommendations.ts` for the legacy psylla assessment flow |
| Crop-reference styling | `src/styles/global.css` | Keep Astro component markup semantic and put shared visual rules here |
| Data parsing and exports | `src/data/crop-protection/records.ts` | `src/data/crop-protection.ts` |
| Record schemas and allowed statuses | `src/data/crop-protection/schemas.ts` | `scripts/validate-data.ts` |
| Referential and safety-oriented validation | `scripts/validate-data.ts` | Run with `npm run validate` |
| PPQS candidate extraction | `scripts/import-ppqs-insecticides.mjs` | `data/source/ppqs/` and `src/data/crop-protection/ppqs-import.ts` |
| Tests | `src/lib/recommendations.test.ts` | `scripts/ppqs-pilot.test.ts` |

### Crop Reference Data Flow

The crop reference is assembled at build time. The dependency path is:

```text
JSON data collections
  -> records.ts parses records with Zod schemas
  -> crop-protection.ts exports normalized collections and helpers
  -> Astro routes join crop, problem, evidence, and treatment records
  -> reusable components render source and safety boundaries
```

The canonical farmer-facing routes are:

```text
/crop-protection/
/crop-protection/crops/
/crop-protection/crops/<crop-id>/
/crop-protection/crops/<crop-id>/targets/<problem-id>/
/crop-protection/products/
/crop-protection/products/<product-id>/
/crop-protection/ingredients/<ingredient-id>/
/crop-protection/sources/
```

### Where New Data Belongs

```text
src/data/crop-protection/
  crops.json                 Crop identity and aliases
  organisms.json             Reusable pests, diseases, weeds, and disorders
  occurrences/<crop>.json    Crop-to-problem links and inspection notes
  guidance/<crop>.json       General crop-context claims
  calendar/<crop>.json       Month-based crop tasks and monitoring priorities
  stages/<problem>.json      Life stages, symptoms, and observation states
  look-alikes/<crop>.json    Crop-specific diagnostic comparisons
  actions/<crop>.json        Nonchemical management actions
  scouting.json              Repeatable inspection protocols
  thresholds.json            Action thresholds or documented threshold gaps
  seasonality.json           Geography-scoped monitoring periods
  ingredients.json           Active ingredients and resistance information
  formulations.json          Stable formulation identities and composition
  products.json              Branded products linked to formulations
  uses/<source-or-crop>.json Crop-target-formulation evidence
  label-uses.json            Exact-product label evidence
  sources.json               Source metadata and evidence status
  images.json                Licensed/approved image metadata
```

When adding a new crop, pest, disease, product, or use relationship, start with these data files. The generic routes generate pages for all crop-problem occurrences; do not create a new Astro route for one crop unless it requires genuinely reusable behavior that cannot be represented in the data model.

## Add Or Change Crop Data

The crop pages are data driven. New data should not require a crop-specific page or component.

1. Add or update a crop in `src/data/crop-protection/crops.json`.
2. Add a reusable pest, disease, weed, or disorder in `organisms.json`.
3. Link it to a crop in `occurrences/<crop-id>.json`.
4. Add optional crop context in `guidance/<crop-id>.json` and seasonal tasks in `calendar/<crop-id>.json`.
5. Add recognition stages in `stages/<problem-id>.json`, plus crop-problem look-alikes and nonchemical actions where evidence supports them.
6. Add scouting, threshold, and seasonality records as they become available.
7. Add ingredients, formulations, products, and sources to their dedicated JSON collections.
8. Add a crop-target-formulation reference in `uses/`. Every use needs a stable `formulationId`; do not transfer rates between crops, targets, products, or formulations.
9. Add an exact product-label record only after checking the exact label version, crop-target use, and restrictions.
10. Run the verification commands above.

Read [`docs/crop-protection-data.md`](docs/crop-protection-data.md) before authoring crop-reference records. It documents evidence states, source boundaries, and the distinction between formulation references and exact product labels.

## Contribution Routes

The public contributor page is at `/crop-protection/contribute/`. It uses catalog-backed crop, target, geography, product, and formulation selectors where the records exist. It copies a structured handoff or opens a pre-addressed email to `aman.poonia.29@gmail.com` for editorial review; it does not publish changes automatically.

The email action uses a `mailto:` link. It works on phones and desktops with a configured mail app, but cannot send automatically or attach files. The Copy action is the reliable fallback for long records, photos, or devices without a configured mail client.

- **Farmers:** submit what was observed, where on the plant, crop stage, date, photos, local name, and what changed after follow-up.
- **Retailers:** submit a package image, full product name, manufacturer, exact formulation, label version/date, and a direct manufacturer or regulatory link where available.
- **Manufacturers/product companies:** select `Manufacturer / product company`, then either select the existing formulation or request a missing formulation. Enter the new brand and manufacturer plus the exact crop-disease claim and approved label or leaflet. A product launch announcement or an ingredient match alone is not enough to publish a treatment card.
- **Scientists and extension experts:** submit claim-by-claim guidance with scope, rationale, source or field basis, conflicts, limitations, and whether it is safe as nonchemical guidance only or needs exact-label verification.

Future contributor forms should select the role first and request only the evidence that role can reliably provide.

## Safety Rules

- A formulation reference is not proof that a purchased brand is currently labeled for the crop and target.
- Do not infer doses, waiting periods, application intervals, or tank mixes.
- Keep `conditions`, pre-harvest intervals, source mappings, and conflicts visible.
- Use `demonstration` only for non-operational structure records.
- Use explicit evidence gaps when source-backed data is unavailable.
- Historical or unsafe guidance belongs in audit material only, never as application instructions.
- Expert field knowledge may be valuable, but must be attributable, scoped, reviewed, and visibly distinct from source-verified or exact-label evidence.

## PPQS Import Workflow

PPQS data is formulation-level evidence, not automatic product-label authorization.

```bash
npm run import:ppqs-insecticides
```

Review generated candidate records and their cited PDF context before manually promoting a row to a normalized record in `src/data/crop-protection/uses/`. Do not edit raw import output manually.

## Deployment

The site builds as static Astro output. GitHub Pages deployment is configured in the repository workflow. `npm run build` generates the deployable files in `dist/`.
