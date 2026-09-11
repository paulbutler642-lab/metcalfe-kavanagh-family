# Website recovery points

## Stable Restore v1 — 11 September 2026

Stable production baseline: `3a079b843436ab3f8ffae6a24d02540a47fd2ffb`
Backup branch: `backup/stable-before-archive-2026-09-11`

## Stable Archive v2 — 12 September 2026

Photos and documents archive, multi-person links, group and unidentified items, profile media sections, and mobile layout repairs: `7278d81568cd70df7d650d62fab9ac4f7400faa2`
Backup branch: `backup/stable-archive-v2-2026-09-12`

Preserved earlier archive repair branch: `backup/archive-repair-2026-09-11`

To restore a named version, move `main` to its backup branch or revert later commits. Vercel deploys `main` automatically.

The Supabase project remains separate from the website source. Schema-changing work must be tested before promotion and recorded in versioned SQL. Restore website code without deleting newer family records or uploaded files unless that data rollback is explicitly approved.
