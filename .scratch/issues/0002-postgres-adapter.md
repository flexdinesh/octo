# Parent

- [PRD: Drizzle Storage Scaffold for apps/api](../PRD.md)

## What to build

Add the Postgres adapter that satisfies the same `Storage` interface as the SQLite adapter. It owns its own Drizzle schema and initial migration, maps the same `User` entity type, and exposes the same `Users` operations. The app code should require no changes to support Postgres after this slice.

## Acceptance criteria

- [ ] `PostgresStorage` implements `Storage` using Drizzle ORM and `pg`.
- [ ] Postgres `users` schema uses `uuid` primary key, `text`, `timestamp with time zone`, and the same column names as the SQLite adapter.
- [ ] Initial Postgres migration is generated and committed under the adapter.
- [ ] `createStorage(config)` can return either `SqliteStorage` or `PostgresStorage` based on `STORAGE_DIALECT`.
- [ ] The storage tests can be parameterized to run against Postgres in addition to SQLite, or at least a manual verification script proves the adapter works.
- [ ] `apps/api` builds and typechecks.

## Blocked by

- [0001 SQLite adapter and storage seam](./0001-sqlite-adapter-and-storage-seam.md)
