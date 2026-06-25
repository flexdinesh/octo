# Parent

- [PRD: Drizzle Storage Scaffold for apps/api](../PRD.md)

## What to build

Establish the public `Storage` seam and the shared `User` entity shapes, then implement the SQLite adapter with full CRUD. End with tests that exercise the SQLite adapter through the public seam using an in-memory database. This slice proves the adapter pattern works end-to-end before adding a second adapter.

## Acceptance criteria

- [ ] `apps/api/src/storage/` exists with a `Storage` interface exposing a `users` repository.
- [ ] `User`, `CreateUserInput`, `UpdateUserInput` entity types live in `src/storage/entities.ts`.
- [ ] `Users` interface declares `listUsers`, `getUserById`, `getUserByEmail`, `createUser`, `updateUser`, `deleteUser`.
- [ ] `SqliteStorage` implements `Storage` using Drizzle ORM and `better-sqlite3`.
- [ ] SQLite `users` schema uses `id`, `email`, `name`, `createdAt`, `updatedAt` with UUID default and timestamp mapping.
- [ ] Initial SQLite migration is generated and committed under the adapter.
- [ ] Storage tests run against an in-memory SQLite instance and pass.
- [ ] `apps/api` builds and typechecks.

## Blocked by

None - can start immediately.
