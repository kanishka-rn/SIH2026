# Supabase MCP (Phase 1)

Cursor connects to this workspace through the official hosted Supabase MCP server.

## Configuration (no secrets)

Tracked files (URLs only):

- `.cursor/mcp.json` — Cursor project MCP config
- `.mcp.json` — generic MCP client config

Server URL: `https://mcp.supabase.com/mcp`

OAuth tokens and API keys must **not** be stored in these files. Cursor authenticates with Supabase via OAuth 2.1.

## Authenticate in Cursor

1. Open **Settings → Cursor Settings → Tools & MCP**.
2. Confirm the `supabase` server is listed.
3. If it shows that authentication is required, use Cursor’s **Authenticate** / MCP login action for that server.
4. In the browser, sign in to the Supabase account that owns the **SIH2026** organization and approve access.
5. Do not paste access tokens, service-role keys, or database passwords into chat.

CLI equivalent (local Cursor): `agent mcp login supabase`

## What Phase 1 verified

- MCP server is reachable.
- Cursor can authenticate and list organizations.
- Organization name: **SIH2026** (free plan).
- **No Supabase database project** was present on that account at verification time (`list_projects` returned none).
- No tables were created. No dataset was imported.

## Next (not done in this phase)

Creating a database **project** named SIH2026 (if you want one under that organization) is a later explicit step. Schema design and migrations are Phase 2.
