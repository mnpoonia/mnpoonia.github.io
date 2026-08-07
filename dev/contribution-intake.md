# Contribution Intake And Review Design

## Goal

Accept useful information from farmers, retailers, manufacturers, and experts without allowing unreviewed material to become farmer-facing guidance.

## Current State

The public form uses controlled selectors where catalog records exist. It validates role-specific handoff fields, copies a structured record, or opens a pre-addressed email draft.

This is suitable for an early prototype but has limits:

- `mailto:` depends on a configured mail client and cannot attach files.
- Records can be lost in email or copied incompletely.
- There is no review queue, attribution history, or submission status.

## Proposed Supabase Boundary

Use Supabase for intake, authentication, review state, and private attachments. Keep reviewed public guidance in repository JSON and publish through the existing static build.

```text
Contributor form
  -> Supabase Auth and Postgres submission
  -> private Storage attachment
  -> reviewer queue
  -> accepted structured record
  -> editor promotes it into Git-reviewed JSON
  -> static build publishes reviewed content
```

Supabase must not directly publish a new pesticide recommendation on public crop pages.

## Initial Tables

```text
profiles
  id, display_name, organization, role, verification_status

contributions
  id, contributor_id, contribution_type, crop_id, target_id,
  geography_id, status, submitted_at, reviewed_at, reviewer_id,
  review_notes

expert_recommendations
  contribution_id, recommendation_type, recommendation, field_basis,
  limitations, production_scope, evidence_reference

product_submissions
  contribution_id, brand, manufacturer, formulation_id, label_version,
  label_url, dose, water_volume, phi, restrictions

attachments
  id, contribution_id, storage_path, file_type, caption, captured_at
```

## Roles And Publication Rules

| Contributor | Can submit | Can publish directly? |
| --- | --- | --- |
| Farmer | Observations, photos, local terms, follow-up results | No |
| Retailer | Product identity, package and label details | No |
| Manufacturer | New brand, formulation relationship, label-backed crop-target claim | No |
| Scientist / extension expert | Scoped diagnosis, scouting, nonchemical guidance, attributable field recommendations | No |
| Reviewer | Decision and review notes | No; promotes a record for editorial publication |
| Editor | Reviewed repository data | Yes, through Git review and static deployment |

## Expert Guidance Rule

An expert may submit unpublished field knowledge if it includes identity, organization, geography, crop and production scope, rationale, field basis, and limitations. It can publish after review as attributed local guidance.

Expert opinion alone cannot authorize a pesticide dose, tank mix, PHI, REI, repeat interval, or product crop-target use. Those fields require exact current product-label evidence and applicable regulatory scope.
