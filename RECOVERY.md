# Website recovery points

## Pre-Media-Storage-v1 — 12 September 2026

Known-good site immediately before automatic image optimisation: `7aed8cf78e5f1ca5c5d0ee548e539353b111db3c`
Backup branch: `Pre-Media-Storage-v1`

## Pre-Family-Profile-v1 — 12 September 2026

Known-good site immediately before the individual profile presentation upgrade: `a1b23aa`
Backup branch: `Pre-Family-Profile-v1`

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

## Lisa administrator access — 12 September 2026

Lisa Butler administrator access before adding a dedicated WhatsApp Admin preview: `6ee46dcad2e4d58816f182419bc15c3e28053b04`

## Admin WhatsApp preview — 12 September 2026

Working administrator thumbnail before adding the matching public-site thumbnail: `a060f692e4e38216f38eafca5b65359783049e87`

## Public website thumbnail — 12 September 2026

Matching public-site thumbnail before adding family tabs to the Timeline: `93c21fea2cc89acc4e4a5132073492a2dbeae194`

## Corrected Timeline — 12 September 2026

Correct surname grouping and early-year sorting before adding person merge and delete tools: `15bd66cbe0c996e31f2261fbe74b987e0e4ef65e`

## William and Billy restored — 12 September 2026

William and Billy restored as separate profiles, with unsafe merging disabled, before adding Profile Change History: `799bda411ea1b4caf0256e41d2e3a955d3258dd2`

## Profile Change History — 12 September 2026

Profile Change History before adding structured date entry: `1627f319b308c0590970d517d8ca50b3e559051f`

## Structured date entry — 12 September 2026

Structured genealogy date controls before adding profile relationships: `c912436cc79cd076c4ace7d6cde28c8f59a04806`

## Profile relationships — 12 September 2026

Reciprocal profile relationships before adding visitor analytics: `347d31bc7f68c735ec8b5ebe0a80b2d0c32589c6`

To restore a named version, move `main` to its backup branch or revert later commits. Vercel deploys `main` automatically.

The Supabase project remains separate from the website source. Schema-changing work must be tested before promotion and recorded in versioned SQL. Restore website code without deleting newer family records or uploaded files unless that data rollback is explicitly approved.

## Database backup and recovery procedure

The Admin page includes **Backup & Recovery** tools. Use **Download full backup** after significant research or media updates and at least monthly. The JSON contains all family tables plus a media manifest with every bucket and storage path.

Use **Validate a backup file** immediately after downloading. A successful validation confirms the file format and reports the people and media counts. Keep at least one recent copy outside GitHub, Vercel and Supabase.

Recovery order:

1. Preserve the current database before making any recovery change.
2. Validate the selected JSON backup in Admin.
3. Restore tables in dependency order: people, relationships, research sources, source links, media, media links, stories, visitor records and change history.
4. Use the media manifest to verify every referenced object still exists in its recorded Supabase Storage bucket.
5. Check William Metcalfe, Mary Kavanagh and Enoch Medcalf, then verify the family tree and archive before reopening editing.

Database restoration is intentionally not a one-click browser action because it can overwrite newer family research. It should be performed through a reviewed Supabase SQL/import operation using the validated backup while Row Level Security remains enabled.
