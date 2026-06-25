# PRD: Drizzle Storage Scaffold for apps/api

## Problem Statement

The `apps/api` workspace has no persistence layer. It only serves health checks. We need to add a schema-driven, migration-ready storage layer that can run against either SQLite or Postgres without leaking storage details into the rest of the app.

## Solution

Introduce a `Storage` seam in `apps/api/src/storage`. The app depends only on the `Storage` interface and the domain-specific repository interfaces it exposes. Two adapters—SQLite and Postgres—implement that seam using Drizzle ORM. Each adapter owns its schema and migrations, and the app bootstraps the correct adapter from environment variables. A seed script populates sample data through the public repository interface, and tests exercise the SQLite adapter through the same seam.

## User Stories

1. As a developer, I want to choose SQLite or Postgres via environment variables, so that the same API code runs in different deployment environments without changes.
2. As a developer, I want storage schemas and migrations to be owned by each adapter, so that dialect-specific types and constraints are explicit and safe.
3. As a developer, I want the app code to depend only on repository interfaces, so that Drizzle or driver types never leak into routes or business logic.
4. As a developer, I want the app to auto-run SQLite migrations on boot, so that the local dev database is always up to date.
5. As a developer, I want a script to seed sample users, so that I can verify the storage layer without writing manual SQL.
6. As a developer, I want example HTTP routes for users, so that I can see the storage adapter used end-to-end.
7. As a developer, I want storage tests that run against an in-memory SQLite database, so that I have fast, isolated coverage of the storage seam.

## Implementation Decisions

- **Interface**: The public surface is a `Storage` module with a `users` repository. Routes and seeding call `storage.users.createUser(...)` and never import `drizzle-orm` or driver packages.
- **Adapters**: `SqliteStorage` and `PostgresStorage` implement the `Storage` interface. Each holds its own Drizzle client and maps between DB-native types and the shared `User` entity.
- **Schema ownership**: Each adapter has its own `schema.ts` using its dialect's table builders (`sqliteTable`, `pgTable`). A shared `src/storage/entities.ts` holds the plain `User` type and `CreateUserInput`, `UpdateUserInput` shapes.
- **Identifiers**: `users.id` is a string UUID. SQLite defaults it via `lower(hex(randomblob(16)))`; Postgres defaults it via `gen_random_uuid()`.
- **Timestamps**: `createdAt` and `updatedAt` are stored idiomatically per dialect (SQLite integer milliseconds, Postgres `timestamp with time zone`) and exposed to the app as `Date`.
- **Configuration**: `STORAGE_DIALECT=sqlite|postgres` plus `DATABASE_URL`. SQLite treats the URL as a `file:` path; Postgres treats it as a `postgres://` connection string.
- **Migrations**: Drizzle Kit generates per-adapter migrations. Migration files live under each adapter and are committed. The app auto-runs SQLite migrations on boot. Postgres migrations are applied via a `db:migrate:postgres` script.
- **Seeding**: `src/storage/seed.ts` reads the same config, creates the active adapter, runs migrations, and upserts sample users through the repository interface so it is safe to re-run.
- **Fastify wiring**: `buildServer` accepts the ready `Storage` object and decorates the Fastify instance with it. Routes read from `app.storage`.
- **Example routes**: `GET /users`, `GET /users/:id`, `POST /users`, `PATCH /users/:id`, `DELETE /users/:id` demonstrate the repository CRUD surface.
- **Type safety**: No `any`, no non-null assertions, no type assertions. All seams are typed through interfaces and entity types.

## Testing Decisions

- The primary test surface is the `Storage` interface, exercised through the SQLite adapter backed by an in-memory database.
- Tests use the public `Users` methods (`createUser`, `listUsers`, `getUserById`, `updateUser`, `deleteUser`) and assert on returned entities, not on internal SQL or table shapes.
- A single integration test verifies the `users` route end-to-end by building a server with the in-memory SQLite adapter and calling it through Fastify's inject API.
- Tests do not mock the storage layer; they swap the adapter for an in-memory SQLite instance, which is fast and proves the seam works.

## Out of Scope

- Production Postgres deployment configuration (SSL, connection pooling, replicas).
- Authentication, authorization, or password hashing for users.
- Pagination, sorting, filtering, or search on the users list.
- Complex domain models beyond the minimal `users` example.
- Transaction management or multi-repository coordination in the repository interface.
- CI pipeline changes for database setup.

## Further Notes

- This is intentionally a scaffold. The repository surface should stay small and grow only when real business needs arrive.
- The adapter pattern is justified by the explicit requirement to support two databases, not by hypothetical future swaps. One adapter would make the seam unnecessary.
- Keep the `Storage` interface narrow. If more repositories are added later, they should be exposed as properties on the same interface, preserving one seam for the app.
