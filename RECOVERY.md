# Website recovery points

Stable production baseline: 3a079b843436ab3f8ffae6a24d02540a47fd2ffb
Backup branch: backup/stable-before-archive-2026-09-11

Preserved archive work: 529fa8bc8cc2497ad814c0a94ac3e3db9f139d42
Backup branch: backup/archive-repair-2026-09-11

To restore the stable website, point the main branch to the stable backup branch or revert later commits. Vercel deploys main automatically.

The Supabase project remains separate from the website source. Schema-changing work must be tested before promotion and recorded in versioned SQL.
