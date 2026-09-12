# Website recovery points

## Stable Restore v1 — 11 September 2026

Stable production baseline: `3a079b843436ab3f8ffae6a24d02540a47fd2ffb`
Backup branch: `backup/stable-before-archive-2026-09-11`

## Stable Archive v2 — 12 September 2026

Photos and documents archive, multi-person links, group and unidentified items, profile media sections, and mobile layout repairs: `7278d81568cd70df7d650d62fab9ac4f7400faa2`
Backup branch: `backup/stable-archive-v2-2026-09-12`

Preserved earlier archive repair branch: `backup/archive-repair-2026-09-11`

## Family Archive Stable — 12 September 2026

Stable production state immediately before the structured Research & Sources database: `7f86aa1c773ebde21e6638b512e2ce118c28d0cc`
Backup branch: `backup/family-archive-stable-2026-09-12`

## Research & Sources v1 — 12 September 2026

Structured research database before assisted document import and external archive search tools: `ef2e6df293c1db292aebb17db8fdca87280858cf`
Backup branch: `backup/research-sources-v1-2026-09-12`

## Research Tools v2 — 12 September 2026

Assisted document importer and external archive-search release before recurring GEDCOM updates: `dd3a9654a730a0f0dd100d28ad0fb31f93e56612`
Backup branch: `backup/research-tools-v2-2026-09-12`

## GEDCOM Import v3 — 12 September 2026

Recurring GEDCOM update importer before adding the 1926 Census search: `ecf10ec8385d85739bfe1f429b4887081bc47d21`
Backup branch: `backup/gedcom-import-v3-2026-09-12`

## Census 1926 — 12 September 2026

Official 1926 Irish Census search before adding Lisa Butler as an administrator: `84787cc3806a47073e911fe3ae5eb0f81d847670`

To restore a named version, move `main` to its backup branch or revert later commits. Vercel deploys `main` automatically.

The Supabase project remains separate from the website source. Schema-changing work must be tested before promotion and recorded in versioned SQL. Restore website code without deleting newer family records or uploaded files unless that data rollback is explicitly approved.
