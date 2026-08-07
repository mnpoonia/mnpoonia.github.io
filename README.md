# Aman Poonia Site And Crop Reference

This repository contains the personal site and a static Astro crop-reference prototype. The crop reference is designed around a crop-first farmer journey:

```text
Crop -> problem -> inspection -> nonchemical action -> formulation evidence -> exact product-label check
```

Plant Protection is the deepest section. Crop guidance is deliberately source-bound: a missing record is shown as a gap rather than replaced with an inferred value or rate.

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

## Safety Rules

- A formulation reference is not proof that a purchased brand is currently labeled for the crop and target.
- Do not infer doses, waiting periods, application intervals, or tank mixes.
- Keep `conditions`, pre-harvest intervals, source mappings, and conflicts visible.
- Use `demonstration` only for non-operational structure records.
- Use explicit evidence gaps when source-backed data is unavailable.
- Historical or unsafe guidance belongs in audit material only, never as application instructions.

## PPQS Import Workflow

PPQS data is formulation-level evidence, not automatic product-label authorization.

```bash
npm run import:ppqs-insecticides
```

Review generated candidate records and their cited PDF context before manually promoting a row to a normalized record in `src/data/crop-protection/uses/`. Do not edit raw import output manually.

## Deployment

The site builds as static Astro output. GitHub Pages deployment is configured in the repository workflow. `npm run build` generates the deployable files in `dist/`.
