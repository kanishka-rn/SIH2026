# Supabase MCP

Cursor uses the official hosted Supabase MCP server for this repository. From Phase 2 onward, agents should use MCP tools for Supabase operations instead of asking someone to run SQL in the dashboard.

## Connected project

| Field | Value |
| --- | --- |
| Organization | SIH2026 |
| Database project name | SIH2026 |
| Project ref | `umgugjqfspmkrwtargen` |
| Region | ap-northeast-1 |
| Status at last check | ACTIVE_HEALTHY |
| Postgres | 17.6 |
| API URL | `https://umgugjqfspmkrwtargen.supabase.co` |

The project ref appears in the public API hostname. It is **not** a password, API key, or service-role key.

## How Cursor accesses Supabase

1. Tracked config (URLs only):
   - `.cursor/mcp.json` — Cursor
   - `.mcp.json` — other MCP clients
2. Server: `https://mcp.supabase.com/mcp?project_ref=umgugjqfspmkrwtargen`
3. Authentication: OAuth 2.1 inside Cursor (**Settings → Cursor Settings → Tools & MCP**). Do not paste access tokens, secret keys, or database passwords into chat.
4. Agents then call MCP tools such as `list_tables`, `list_extensions`, `execute_sql`, and (in later phases) migrations.

Local CLI login, if needed: `agent mcp login supabase`

## What MCP is used for

- Discovering the SIH2026 project
- Read-only inspection of Postgres (schemas, tables, extensions)
- Later phases: schema/migrations, advisors, and other platform operations **when explicitly requested**

MCP is not used to store application secrets in git.

## Secrets

Never commit:

- `.env` / `.env.local`
- publishable or secret API keys
- legacy `anon` / `service_role` JWT keys
- `DATABASE_URL` passwords
- OAuth access tokens
- Vault secrets

Use `.env.example` files for **variable names only**. Copy them locally and fill values from the Supabase dashboard.

Current key terminology (do not mix these into the frontend):

| Use | Variable | Notes |
| --- | --- | --- |
| Browser / public client | `VITE_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_...` |
| Backend privileged access | `SUPABASE_SECRET_KEY` | `sb_secret_...` — server only |
| Legacy compatibility | `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | JWT keys; prefer publishable/secret |

## Inspection snapshot (Phase 2)

Read-only. Nothing was created or altered.

- `public` tables: **0**
- `public` views: **0**
- `public` functions: **0**
- Application migrations: **none**
- Installed extensions: `plpgsql`, `pgcrypto`, `uuid-ossp`, `pg_stat_statements`, `supabase_vault`
- **pgvector (`vector`)**: available (default 0.8.2), **not installed**
- PostgreSQL full-text search: built-in `to_tsvector` works; text-search configs include `simple`, `english`, `hindi`, `tamil`, and others. `pg_trgm` is available but not installed.

Platform schemas (`auth`, `storage`, `realtime`, `vault`, …) exist as part of a new Supabase project. They are not application tables.

## Next phase (not started)

Database schema design, enabling `vector` if required, migrations, RLS, and dataset import happen **only** when requested. Do not create tables in this phase.
