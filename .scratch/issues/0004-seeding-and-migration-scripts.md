# Parent

- [PRD: Drizzle Storage Scaffold for apps/api](../PRD.md)

## What to build

Add the operational tooling: a seed script that populates sample users through the repository interface, npm scripts for generating and applying migrations, and SQLite auto-migration on app boot. The seed script must be safe to re-run.

## Acceptance criteria

- [ ] `src/storage/seed.ts` reads `STORAGE_DIALECT` and `DATABASE_URL`, creates the adapter, runs migrations, and upserts sample users.
- [ ] `pnpm db:seed` runs the seed script.
- [ ] `pnpm db:generate:sqlite` and `pnpm db:generate:postgres` generate migrations for each adapter.
- [ ] `pnpm db:migrate:sqlite` and `pnpm db:migrate:postgres` apply migrations for each adapter.
- [ ] The app runs SQLite migrations automatically on boot when `STORAGE_DIALECT=sqlite`.
- [ ] `apps/api` builds and typechecks.

## Blocked by

- [0001 SQLite adapter and storage seam](./0001-sqlite-adapter-and-storage-seam.md)
- [0002 Postgres adapter](./0002-postgres-adapter.md)
