# AGENTS.md - TidyQuest

Node.js/Express backend + React/Vite frontend, TypeScript throughout, SQLite persistence.

## Commands

```bash
# Dev (two terminals, or concurrently)
npm run dev                # Both frontend (5173) and backend (3000) via concurrently
npm run dev:server         # tsx watch src/index.ts
npm run dev:client         # Vite dev server

# Build
npm run build              # Client (tsc -b && vite build) then server (tsc)

# Production
cd server && npm start     # node dist/index.js (serves client/dist)

# Tests (only server-side, Vitest + Supertest)
cd server && npm test      # vitest run (10s timeout, no file parallelism)
cd server && npm run test:watch

# Type check server only
cd server && npx tsc --noEmit
```

## Architecture

- **server/**: Express API under `/api`. `createApp()` exported for test imports. In production, also serves `client/dist` as static SPA fallback.
- **client/**: React 19 + Vite 7 + React Router v7. Dev server proxies via Vite config (not explicit proxy — uses relative fetch paths).
- **data/**: Persistent volume (SQLite DB + uploaded avatars). Owned by `node` user in Docker.

## Database & Schema

- **Proxy singleton**: `server/src/database.ts` exports `db` as a Proxy over a mutable `_db` singleton. Route files import `db` (`import db from '../database'`). Tests call `setDatabase()` to swap in an in-memory instance — no module mocking needed.
- **VITEST guard**: When `process.env.VITEST` is set, the real DB file is never created. The server startup block (`require.main === module || !process.env.VITEST`) prevents the server from auto-starting when imported by tests.
- **Schema is duplicated** in `server/src/test/setup.ts`. When adding/altering tables or columns, update **both** `database.ts:initDatabase()` and `setup.ts:runSchema()`.
- **Migrations**: Column additions use `ALTER TABLE ADD COLUMN` inside try/catch (ignoring "duplicate column name" errors). One-shot data migrations are guarded by `app_settings` flags (e.g. `taskAssigneesMigrated_v1`, `iconsMigrated_v2`).

## Testing

- Tests live in `server/src/test/`. All integration tests (no unit tests) via Supertest.
- `createTestApp()` returns `{ agent, db }` — fresh in-memory DB per suite.
- `createAdmin(agent)` registers first user (auto-promoted to admin). `createUser(agent, adminToken, opts)` creates through admin API.
- `fileParallelism: false` in vitest config — tests share the DB proxy singleton.
- JWT secret for tests is `test-secret-key-for-vitest` (set in vitest config and setup.ts).

## Environment Variables

| Variable | Purpose |
|---|---|
| `JWT_SECRET` | Required in production (min 32 chars) |
| `NODE_ENV` | `production` or `development` (controls CORS, defaults) |
| `TZ` | Timezone for day/week boundaries |
| `PORT` | Server port (default 3000) |
| `ADMIN_RESET_PASSWORD` | One-shot: resets first admin's password on startup, then self-clears from `process.env` |

`.env` exists in the repo with dev defaults. It is NOT gitignored (contains only non-secret dev values).

## Production / Docker

- Multi-stage Dockerfile: frontend-build → server-build → runtime (Alpine, su-exec, non-root `node` user).
- `docker-entrypoint.sh` chowns `/app/data` to `node:node` when run as root.
- `docker-compose.yml` reads `.env` via `env_file`, defaults `NODE_ENV=production` via `${NODE_ENV:-production}`.
- `podman-compose.yaml` also exists (mirror of docker-compose).
- Migrations run automatically on startup via `initDatabase()`.