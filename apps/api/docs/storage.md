# Storage

The app depends on a `Storage` interface, not on Drizzle or drivers. `Storage` exposes data-access interfaces like `users`. Two adapters implement it: `SqliteStorage` and `PostgresStorage`.

## Decisions

- **Storage interface**: App code imports only from `src/storage/`. Drizzle, `better-sqlite3`, and `pg` stay inside the adapters.
- **Per-adapter schemas**: Each dialect owns its schema and migrations in `src/storage/adapters/{dialect}/`. They share the same column names and entity types.
- **Schema-driven**: Schema files are the source of truth. Migrations are generated with Drizzle Kit and committed.
- **SQLite auto-migrates on boot**: Postgres migrations are applied explicitly via script.
- **Seeding works with any adapter**: `seed.ts` uses the `Users` interface, so it works against SQLite or Postgres.

## How Drizzle works

- **Schema files** (`schema.ts`) are the source of truth. They define tables, columns, and types in TypeScript.
- **Generate**: `drizzle-kit generate` compares the schema to the previous migration and creates a new SQL file. It never edits existing migrations.
- **Migrate**: `drizzle-kit migrate` runs unapplied SQL files in order and records them in a journal. Running it twice is a no-op.
- **Immutability**: committed migration files should not be edited. To change the database, edit the schema and generate a new migration.

## Configuration

Set `STORAGE_DIALECT` and `DATABASE_URL`:

```sh
STORAGE_DIALECT=sqlite DATABASE_URL=file:./data/api.sqlite
STORAGE_DIALECT=postgres DATABASE_URL=postgresql://localhost:5432/octo
```

Defaults: SQLite dialect, `file:./data/api.sqlite`.

## Scripts

| Script                      | When to run                                                                        |
| --------------------------- | ---------------------------------------------------------------------------------- |
| `pnpm db:generate:sqlite`   | After changing the SQLite schema.                                                  |
| `pnpm db:generate:postgres` | After changing the Postgres schema.                                                |
| `pnpm db:migrate:sqlite`    | To apply SQLite migrations manually. Usually not needed—the app runs them on boot. |
| `pnpm db:migrate:postgres`  | To apply Postgres migrations before starting the app.                              |
| `pnpm db:seed`              | After migrations to insert sample users. Safe to re-run.                           |

## Files

- `src/storage/index.ts` — `Storage` interface and factory.
- `src/storage/entities.ts` — plain `User` types.
- `src/storage/models/users.ts` — `Users` interface.
- `src/storage/adapters/{sqlite,postgres}/schema.ts` — dialect-specific schemas.
- `src/storage/adapters/{sqlite,postgres}/migrations/` — generated SQL migrations.
- `src/storage/seed.ts` — seed script.
