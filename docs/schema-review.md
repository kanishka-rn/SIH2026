# Schema review — SIH2026

Review of `docs/database-design.md`. No database objects were created.

## Architectural decisions

1. **Postgres-only** for OLTP, FTS, graph, eval, and (later) vectors. Matches Phase 2 (Supabase 17.6).
2. **UUID PKs** + **natural unique keys** (`is_number`, QCO ids).
3. **Assertions not booleans** for compliance (`SUPPORTED` / `NOT_SUPPORTED_BY_DATA` / `UNKNOWN` / `NEEDS_VERIFICATION`).
4. **Provenance on facts**; derived data never overwrites authoritative columns.
5. **Graph in SQL** (entities/edges/CTE). Separate graph DB not justified without V0.4 evidence that Postgres cannot hold the edge set.
6. **FTS in-database** for lexical v1; BM25-as-a-service deferred until eval requires it.
7. **Embeddings blocked** on measured dimension. `vector` extension stays off.
8. **Do not 1:1 map CSVs to tables.** Canonical entities + maps.

## Tradeoffs

| Choice | Benefit | Cost |
| --- | --- | --- |
| Dual `standard_references` + `graph_relationships` | Fast 1-hop vs rich types | Must keep them consistent on ingest |
| UUID everywhere | Merge-safe ingest | Slightly larger indexes than bigints |
| Table-per-embedding-dimension (if needed) | Correct ANN | More migrations if models proliferate |
| FTS vs dedicated BM25 | Operational simplicity | Ranking may need reranker to match papers |

## Normalization

- 3NF-ish for standards/org units.
- Arrays only for low-cardinality tags (`ics_codes`) and stored paths.
- JSONB limited to `decision_traces.payload` and report notes — not the source of IS numbers.

## Performance / scale

- ~24k `standards` is small for Postgres.
- Risk is **chunks × embeddings** and **eval items**. HNSW and GIN belong on those tables later.
- Hot path: filter metadata (B-tree) → FTS + ANN candidate caps → fuse in app → 1-hop references.

## Security

- No secrets in tables.
- Service role only for ingest.
- Publishable key for client reads of **non-sensitive catalog** after RLS.
- User history/saves: `auth.uid() = user_id`.
- Do not expose `stg_*` or `ingestion_*` error payloads that might contain PII from tenders without review.

## RLS (to apply in a migration phase, not now)

| Tables | Policy sketch |
| --- | --- |
| Catalog (standards, graph, QCO, eval gold if public) | `SELECT` for `authenticated` (and `anon` only if product requires public directory) |
| `recommendation_runs`, history, saves | SELECT/INSERT/DELETE own rows |
| Ingestion / staging | no grant to `anon`/`authenticated` |

Enable RLS on every table in `public` before exposing the Data API.

Views: `security_invoker` if any.

## Migration strategy (future)

1. Approve this design + complete dataset inventory.
2. `CREATE EXTENSION` only as needed (`vector`, `pg_trgm`) in a named migration.
3. Ordered migrations: enums/types → catalogs → standards → graph → retrieval → compliance → recs → eval → RLS.
4. Generate SQL via `supabase migration new` (CLI) when that phase starts — not ad-hoc `apply_migration` loops.

## Rollback

- Forward-only for data loads (re-run upsert).
- Schema: new migration to drop unused objects; avoid rewriting history.
- Keep archive checksum to restore by re-ingest.

## Extensibility

- New relation types: extra `rel_type` values, not new databases.
- New locales: rows in `standard_titles`.
- New embed models: `embedding_models` + matching vector table.
- Auth providers: `profiles` keyed to `auth.users`.

## Gaps until V0.4 is mounted

- Exact column mapping
- Embedding provider/dim/coverage
- Whether `graph_paths` files exist
- Whether gazette/QCO files are authoritative or sparse
- Duplicate IS-number rate

Do not treat this review as a green light to migrate until those are measured.
