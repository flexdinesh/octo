# Parent

- [PRD: Drizzle Storage Scaffold for apps/api](../PRD.md)

## What to build

Wire the storage adapter into the Fastify server. `buildServer` accepts the active `Storage` object and decorates the Fastify instance. Add example `/users` routes that exercise the repository CRUD surface. Add a route integration test that uses the in-memory SQLite adapter.

## Acceptance criteria

- [ ] `buildServer` accepts a `Storage` object and decorates the app with `storage`.
- [ ] `main.ts` reads storage config, creates the adapter, and passes it to `buildServer`.
- [ ] `GET /users` returns a list of users.
- [ ] `GET /users/:id` returns a single user or 404.
- [ ] `POST /users` creates a user and returns it.
- [ ] `PATCH /users/:id` updates a user and returns it.
- [ ] `DELETE /users/:id` deletes a user and returns 204.
- [ ] Route integration tests pass using an in-memory SQLite adapter.
- [ ] `apps/api` builds and typechecks.

## Blocked by

- [0001 SQLite adapter and storage seam](./0001-sqlite-adapter-and-storage-seam.md)
